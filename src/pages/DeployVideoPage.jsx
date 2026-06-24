import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { v } from '../utils/videoUrl'
import './DeployVideoPage.css'

const DIALOGUE = "Now the construction is done. Would you like to experience the space?"

function useTypewriter(text, active, speed = 38) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [active, text, speed])

  return { displayed, done }
}

export default function DeployVideoPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(0)

  const { displayed, done: typeDone } = useTypewriter(DIALOGUE, showBubble)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  function handleTimeUpdate() {
    const v = videoRef.current
    if (v && v.duration) setProgress(v.currentTime / v.duration)
  }

  function handleVideoEnd() {
    setVideoEnded(true)
    setTimeout(() => setShowBubble(true), 600)
  }

  function handleYes() {
    setExiting(true)
    setTimeout(() => navigate('/choose'), 1000)
  }

  function handleNo() {
    setExiting(true)
    setTimeout(() => navigate('/'), 1000)
  }

  return (
    <div className={`dv-page ${ready ? 'dv-page--ready' : ''} ${exiting ? 'dv-page--exit' : ''}`}>
      <video
        ref={videoRef}
        className="dv-video"
        src={v('Deploy.mp4')}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        style={{ filter: showBubble ? 'brightness(0.35) saturate(0.4)' : 'brightness(0.6) saturate(0.7)' }}
      />

      <div className="dv-vignette" />

      {/* ── Top HUD ── */}
      <header className="dv-hud-top slide-down" style={{ animationDelay: '0.2s' }}>
        <div className="dv-status">
          <span className="hud-label hud-label--accent">// DEPLOYMENT ACTIVE</span>
          <span className="hud-label">ROBOTIC UNITS CONSTRUCTING</span>
        </div>
        <div className="dv-status" style={{ alignItems: 'flex-end' }}>
          <span className="hud-label">COMPLETION</span>
          <span className="hud-label hud-label--green">{Math.round(progress * 100)}%</span>
        </div>
      </header>

      {/* ── Progress bar ── */}
      {!videoEnded && (
        <div className="dv-progress-wrap">
          <div className="dv-progress-track">
            <div className="dv-progress-fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <span className="hud-label">{Math.round(progress * 100)}%</span>
        </div>
      )}

      {/* ── Right HUD ── */}
      {!videoEnded && (
        <aside className="dv-readout fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="dv-readout-row">
            <span className="hud-label">OPERATION</span>
            <span className="hud-label hud-label--accent">UMBAU</span>
          </div>
          <div className="dv-readout-row">
            <span className="hud-label">UNITS DEPLOYED</span>
            <span className="hud-label hud-label--green">{Math.round(progress * 47)}/47</span>
          </div>
          <div className="dv-readout-row">
            <span className="hud-label">PHASE</span>
            <span className="hud-label">CONSTRUCTION<span className="blink">...</span></span>
          </div>
        </aside>
      )}

      {/* ══ Speech Bubble ══ */}
      {showBubble && (
        <div className={`dv-dialogue ${showBubble ? 'dv-dialogue--show' : ''}`}>
          {/* Scanline effect inside bubble */}
          <div className="dv-dialogue-scanlines" />

          {/* Robot avatar */}
          <div className="dv-avatar hud-frame">
            <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
            <div className="dv-avatar-inner">
              <span className="dv-avatar-icon">⬡</span>
              <span className="hud-label" style={{ marginTop: '0.3rem' }}>UNIT-A1</span>
            </div>
          </div>

          {/* Text + choices */}
          <div className="dv-dialogue-body">
            <div className="dv-dialogue-header">
              <span className="hud-label hud-label--accent">// SYSTEM MESSAGE</span>
              <span className="hud-label">KONSTRUKTIONSEINHEIT · WOLFSBURG NODE</span>
            </div>

            <p className="dv-dialogue-text">
              {displayed}
              {!typeDone && <span className="blink dv-cursor">▌</span>}
            </p>

            {typeDone && (
              <div className="dv-choices fade-in">
                <button className="dv-choice-btn dv-choice-btn--yes hud-frame" onClick={handleYes}>
                  <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
                  <span className="dv-choice-key">[ Y ]</span>
                  <span className="dv-choice-label">YES — ENTER THE SPACE</span>
                </button>
                <button className="dv-choice-btn dv-choice-btn--no hud-frame" onClick={handleNo}>
                  <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
                  <span className="dv-choice-key">[ N ]</span>
                  <span className="dv-choice-label">NO — RETURN TO BASE</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Bottom HUD ── */}
      <footer className="dv-hud-bottom">
        <span className="hud-label">PROJEKT UMBAU // WOLFSBURG 2045</span>
        <span className="hud-label">52°26'N 10°47'E</span>
      </footer>

      <div className="lb-top" /><div className="lb-bottom" />
    </div>
  )
}
