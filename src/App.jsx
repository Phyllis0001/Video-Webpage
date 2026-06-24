import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import StartingVideoPage from './pages/StartingVideoPage'
import DeployVideoPage from './pages/DeployVideoPage'
import ChoicePage from './pages/ChoicePage'
import VideoSequencePage from './pages/VideoSequencePage'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      {/* Global game overlays */}
      <div className="g-scanlines" />
      <div className="g-crosshair">
        <div className="g-crosshair-dot" />
      </div>

      <Routes>
        <Route path="/"                    element={<LandingPage />} />
        <Route path="/intro"               element={<StartingVideoPage />} />
        <Route path="/deploy"              element={<DeployVideoPage />} />
        <Route path="/choose"              element={<ChoicePage />} />
        <Route path="/experience/:scenario" element={<VideoSequencePage />} />
      </Routes>
    </>
  )
}
