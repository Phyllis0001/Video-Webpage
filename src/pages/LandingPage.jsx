import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 600)
    return () => clearTimeout(t)
  }, [])

  function handleEnter() {
    setEntering(true)
    setTimeout(() => navigate('/intro'), 1200)
  }

  return (
    <div className={`land ${ready ? 'land--ready' : ''} ${entering ? 'land--exit' : ''}`}>
      <video
        ref={videoRef}
        className="land__video"
        src="/videos/Firefly slowly zoom into this image 402125.mp4"
        autoPlay muted loop playsInline
      />

      <div className="land__vignette" />

      {/* ── Top HUD bar ── */}
      <div className="land__hud-top slide-down" style={{ animationDelay: '0.3s' }}>
        <div className="hud-frame" style={{ display: 'flex', gap: '2rem' }}>
          <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
          <span className="hud-label">SYS:ONLINE</span>
          <span className="hud-label hud-label--green">◉ UNIT READY</span>
        </div>
        <div className="land__coords">
          <span className="hud-label">52°26'N 10°47'E</span>
          <span className="hud-label hud-label--accent">WOLFSBURG // 2045</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="land__main">
        <p className="land__eyebrow slide-down" style={{ animationDelay: '0.5s' }}>
          // MISSION BRIEFING
        </p>

        <h1 className="land__title">
          <span className="land__title-line slide-up" style={{ animationDelay: '0.7s' }}>PROJEKT</span>
          <span className="land__title-line land__title-line--outline slide-up" style={{ animationDelay: '0.95s' }}>UMBAU</span>
        </h1>

        <div className="land__divider slide-up" style={{ animationDelay: '1.1s' }}>
          <span className="land__divider-line" />
          <span className="hud-label hud-label--accent">OBJECTIVE</span>
          <span className="land__divider-line" />
        </div>

        <p className="land__desc slide-up" style={{ animationDelay: '1.2s' }}>
          Industrial robotic systems leave the factory.<br />
          The city becomes the machine. The machine becomes the city.<br />
          <span className="land__desc--sub">After Cedric Price's Fun Palace — architecture that transforms with life.</span>
        </p>

        <button
          className="land__btn hud-frame slide-up"
          style={{ animationDelay: '1.5s' }}
          onClick={handleEnter}
        >
          <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
          <span className="land__btn-icon">▶</span>
          <span className="land__btn-text">START EXPERIENCE</span>
          <span className="blink land__btn-cursor">_</span>
        </button>

        <p className="land__hint slide-up" style={{ animationDelay: '1.8s' }}>
          [ PRESS TO INITIATE DEPLOYMENT SEQUENCE ]
        </p>
      </main>

      {/* ── Bottom HUD bar ── */}
      <div className="land__hud-bottom fade-in" style={{ animationDelay: '1s' }}>
        <span className="hud-label">BAUHAUS-UNIVERSITÄT WEIMAR · SEM 2</span>
        <span className="hud-label">URBAN VISION PROJECT // v1.0</span>
      </div>

      <div className="lb-top" /><div className="lb-bottom" />
    </div>
  )
}
