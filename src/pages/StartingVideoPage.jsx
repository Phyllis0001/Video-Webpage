import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './StartingVideoPage.css'

export default function StartingVideoPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [unitCount, setUnitCount] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  // Animate unit counter while video plays
  useEffect(() => {
    if (!videoEnded) {
      const interval = setInterval(() => {
        setUnitCount(n => (n < 47 ? n + 1 : n))
      }, 180)
      return () => clearInterval(interval)
    }
  }, [videoEnded])

  function handleTimeUpdate() {
    const v = videoRef.current
    if (v && v.duration) setProgress(v.currentTime / v.duration)
  }

  function handleVideoEnd() {
    setVideoEnded(true)
  }

  function handleDeploy() {
    setExiting(true)
    setTimeout(() => navigate('/deploy'), 1000)
  }

  return (
    <div className={`sv-page ${ready ? 'sv-page--ready' : ''} ${exiting ? 'sv-page--exit' : ''}`}>
      <video
        ref={videoRef}
        className="sv-video"
        src="/videos/starting.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
      />

      <div className="sv-vignette" />

      {/* ── Top HUD ── */}
      <header className="sv-hud-top slide-down" style={{ animationDelay: '0.2s' }}>
        <div className="sv-status">
          <span className="hud-label hud-label--accent">// INITIALIZING</span>
          <span className="hud-label">ROBOTIC FLEET DEPLOYMENT</span>
        </div>
        <div className="sv-status">
          <span className="hud-label">UNITS ONLINE:</span>
          <span className="hud-label hud-label--green">{String(unitCount).padStart(2,'0')} / 47</span>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="sv-progress-wrap">
        <div className="sv-progress-track">
          <div className="sv-progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="hud-label">{Math.round(progress * 100)}%</span>
      </div>

      {/* ── Left HUD readout ── */}
      <aside className="sv-readout slide-in-left" style={{ animationDelay: '0.4s' }}>
        <div className="sv-readout-row">
          <span className="hud-label">MODE</span>
          <span className="hud-label hud-label--accent">PASSIVE SCAN</span>
        </div>
        <div className="sv-readout-row">
          <span className="hud-label">SECTOR</span>
          <span className="hud-label">WOLFSBURG-CENTRAL</span>
        </div>
        <div className="sv-readout-row">
          <span className="hud-label">STATUS</span>
          <span className={`hud-label ${videoEnded ? 'hud-label--green' : 'hud-label--accent'}`}>
            {videoEnded ? 'READY' : <span>LOADING<span className="blink">...</span></span>}
          </span>
        </div>
      </aside>

      {/* ── Center bottom: mission text or deploy button ── */}
      <div className="sv-center-bottom">
        {!videoEnded ? (
          <p className="sv-mission-text hud-frame" key="scanning">
            <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
            <span className="hud-label">SCANNING DEPLOYMENT ZONE</span>
            <span className="blink hud-label hud-label--accent"> ▌</span>
          </p>
        ) : (
          <div className="sv-deploy-prompt fade-in">
            <p className="sv-deploy-msg hud-label hud-label--green">
              ✓ FLEET INITIALISED — AWAITING COMMAND
            </p>
            <button className="sv-deploy-btn hud-frame" onClick={handleDeploy}>
              <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
              <span className="sv-deploy-btn__icon">◈</span>
              <span className="sv-deploy-btn__text">START TO DEPLOY</span>
              <span className="blink sv-deploy-btn__cursor">_</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom HUD ── */}
      <footer className="sv-hud-bottom">
        <span className="hud-label">PROJEKT UMBAU // WOLFSBURG 2045</span>
        <span className="hud-label">52°26'N 10°47'E</span>
      </footer>

      <div className="lb-top" /><div className="lb-bottom" />
    </div>
  )
}
