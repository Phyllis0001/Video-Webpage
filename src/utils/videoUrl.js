// Prepends Vite's base URL so video paths work in both dev (/) and GitHub Pages (/Video-Webpage/)
export const v = (filename) => `${import.meta.env.BASE_URL}videos/${filename}`
