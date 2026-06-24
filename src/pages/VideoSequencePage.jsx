import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './VideoSequencePage.css'

const SCENARIOS = {
  event: {
    title: 'Event Space',
    mission: 'MISSION 01 — ASSEMBLY',
    accent: '#c8a96e',
    accentRgb: '200,169,110',
    videos: [
      { src: '/videos/event_1.mp4',   caption: 'The robots arrive at dusk.' },
      { src: '/videos/event_2.mp4',   caption: 'Scaffold arms extend across the field.' },
      { src: '/videos/event 3.mp4',   caption: 'A structure rises from memory.' },
      { src: '/videos/event 4.mp4',   caption: 'The amphitheatre takes its final form.' },
      { src: '/videos/event 5.mp4',   caption: 'People gather as if drawn by instinct.' },
      { src: '/videos/event 6.mp4',   caption: 'The city performs itself.' },
    ],
  },
  market: {
    title: 'Market',
    mission: 'MISSION 02 — EXCHANGE',
    accent: '#4aff8a',
    accentRgb: '74,255,138',
    videos: [
      { src: '/videos/Market shot1.mp4',  caption: 'First units emerge at 5 AM.' },
      { src: '/videos/market_shot 2.mp4', caption: 'Kiosks orient toward morning sun and footfall.' },
      { src: '/videos/market_shot 3.mp4', caption: 'Trade routes crystallise in real time.' },
      { src: '/videos/Market_shot 4.mp4', caption: 'The market remembers its users.' },
      { src: '/videos/Market_shot 5.mp4', caption: 'Stalls negotiate space between themselves.' },
      { src: '/videos/Market_shot 6.mp4', caption: 'By evening, the machines retract.' },
    ],
  },
  playground: {
    title: 'Playground',
    mission: 'MISSION 03 — DISCOVERY',
    accent: '#9a7eb0',
    accentRgb: '154,126,176',
    videos: [
      { src: '/videos/playground_1.mp4', caption: 'A child approaches the responsive ground.' },
      { src: '/videos/playground_2.mp4', caption: 'The surface reads motion and replies.' },
      { src: '/videos/playground_3.mp4', caption: 'New tunnels form from nowhere.' },
      { src: '/videos/Playground_4.mp4', caption: 'The machine learns what joy feels like.' },
      { src: '/videos/playground 5.mp4', caption: 'Play becomes architecture.' },
    ],
  },
}

export default function VideoSequencePage() {
  const { scenario } = useParams()
  const navigate = useNavigate()
  const data = SCENARIOS[scenario]

  const [current, setCurrent] = useState(0)
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!data) { navigate('/choose'); return }
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [data, navigate])

  const goToSlide = useCallback((index) => {
    if (transitioning || index === current) return
    setTransitioning(true)
    setShowCaption(false)
    setProgress(0)
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
      setTimeout(() => setShowCaption(true), 500)
    }, 450)
  }, [transitioning, current])

  const goNext = useCallback(() => {
    if (current < data.videos.length - 1) goToSlide(current + 1)
  }, [current, data, goToSlide])

  const goPrev = useCallback(() => {
    if (current > 0) goToSlide(current - 1)
  }, [current, goToSlide])

  useEffect(() => {
    const t = setTimeout(() => setShowCaption(true), 700)
    return () => clearTimeout(t)
  }, [current])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onTime = () => { if (video.duration) setProgress(video.currentTime / video.duration) }
    const onEnd  = () => { if (current < data.videos.length - 1) goNext() }
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('ended', onEnd)
    return () => { video.removeEventListener('timeupdate', onTime); video.removeEventListener('ended', onEnd) }
  }, [current, data, goNext])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === ' ') { e.preventDefault(); const v = videoRef.current; if (v) v.paused ? v.play() : v.pause() }
      if (e.key === 'Escape') handleExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  function handleExit() {
    setExiting(true)
    setTimeout(() => navigate('/choose'), 900)
  }

  if (!data) return null
  const video = data.videos[current]
  const isLast = current === data.videos.length - 1

  return (
    <div
      className={`vs-page ${ready ? 'vs-page--ready' : ''} ${exiting ? 'vs-page--exit' : ''}`}
      style={{ '--accent': data.accent, '--accent-rgb': data.accentRgb }}
    >
      {/* Video */}
      <div className={`vs-video-wrap ${transitioning ? 'vs-video-wrap--trans' : ''}`}>
        <video
          ref={videoRef}
          key={video.src}
          className="vs-video"
          src={video.src}
          autoPlay playsInline
          onLoadedData={() => videoRef.current?.play().catch(()=>{})}
        />
        <div className="vs-vignette" />
      </div>

      {/* ── Top HUD ── */}
      <header className="vs-header slide-down">
        <div className="vs-header-left">
          <button className="vs-back" onClick={handleExit}>
            <span className="vs-back__line" />
            <span className="hud-label">← EXIT ZONE</span>
          </button>
          <div className="vs-header-mission">
            <span className="hud-label hud-label--accent">{data.mission}</span>
          </div>
        </div>
        <div className="vs-header-right">
          <span className="hud-label">SCENE</span>
          <span className="vs-scene-num" style={{ color: 'var(--accent)' }}>
            {String(current + 1).padStart(2,'0')} / {String(data.videos.length).padStart(2,'0')}
          </span>
        </div>
      </header>

      {/* ── Caption ── */}
      <div className={`vs-caption ${showCaption ? 'vs-caption--show' : ''}`}>
        <span className="vs-caption-bar" />
        <p className="vs-caption-text">{video.caption}</p>
      </div>

      {/* ── HUD overlay: scene progress ring ── */}
      <div className="vs-scene-hud">
        <div className="vs-scene-label hud-frame">
          <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
          <span className="hud-label" style={{ color: 'var(--accent)' }}>
            {data.title.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="vs-footer slide-up" style={{ animationDelay: '0.3s' }}>
        {/* Dot progress */}
        <div className="vs-dots">
          {data.videos.map((_, i) => (
            <button
              key={i}
              className={`vs-dot ${i === current ? 'vs-dot--active' : ''} ${i < current ? 'vs-dot--done' : ''}`}
              onClick={() => goToSlide(i)}
            >
              {i === current && (
                <span className="vs-dot-fill" style={{ transform: `scaleX(${progress})` }} />
              )}
            </button>
          ))}
        </div>

        {/* Nav */}
        <div className="vs-nav">
          <button className="vs-nav-btn" onClick={goPrev} disabled={current === 0}>
            <span>←</span>
            <span className="hud-label">PREV</span>
          </button>

          {isLast ? (
            <button className="vs-nav-btn vs-nav-btn--end hud-frame" onClick={handleExit}>
              <span className="cf-tl"/><span className="cf-tr"/><span className="cf-bl"/><span className="cf-br"/>
              <span className="hud-label" style={{ color: 'var(--accent)' }}>MISSION COMPLETE — EXIT ↺</span>
            </button>
          ) : (
            <button className="vs-nav-btn" onClick={goNext}>
              <span className="hud-label">NEXT</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="vs-key-hint">
          <span className="hud-label">[ ← → ] NAVIGATE &nbsp; [ SPACE ] PAUSE &nbsp; [ ESC ] EXIT</span>
        </div>
      </footer>

      <div className="lb-top" /><div className="lb-bottom" />
    </div>
  )
}
