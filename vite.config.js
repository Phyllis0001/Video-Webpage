import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to serve mp4 videos from project root at /videos/
function localVideoServer() {
  return {
    name: 'local-video-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/videos/')) {
          const filename = decodeURIComponent(req.url.slice('/videos/'.length).split('?')[0])
          const filePath = path.resolve(process.cwd(), filename)
          if (fs.existsSync(filePath) && filePath.endsWith('.mp4')) {
            const stat = fs.statSync(filePath)
            const range = req.headers['range']
            if (range) {
              const parts = range.replace(/bytes=/, '').split('-')
              const start = parseInt(parts[0], 10)
              const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1
              const chunkSize = end - start + 1
              res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
              })
              fs.createReadStream(filePath, { start, end }).pipe(res)
            } else {
              res.writeHead(200, {
                'Content-Length': stat.size,
                'Content-Type': 'video/mp4',
                'Accept-Ranges': 'bytes',
              })
              fs.createReadStream(filePath).pipe(res)
            }
            return
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localVideoServer()],
})
