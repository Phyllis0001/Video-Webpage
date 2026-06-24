import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ChoicePage.css'

const SCENARIOS = [
  {
    id: 'event',
    number: '01',
    title: 'Event Space',
    mission: 'MISSION 01 — ASSEMBLY',
    tag: 'COMMUNITY · PERFORMANCE · STRUCTURE',
    description: 'Robotic scaffold arrays reconfigure overnight. By morning, an empty lot becomes an amphitheatre. The city assembles itself for human ritual.',
    previewVideo: '/videos/event_1.mp4',
    accent: '#c8a96e',
    accentRgb: '200,169,110',
  },
  {
    id: 'market',
    number: '02',
    title: 'Market',
    mission: 'MISSION 02 — EXCHANGE',
    tag: 'ECONOMY · MOBILITY · TRADE',
    description: 'Modular robotic kiosks emerge at dawn, guided by demand data. They find sun, shelter, and footfall — reshaping trade routes in real time.',
    previewVideo: '/videos/Market shot1.mp4',
    accent: '#4aff8a',
    accentRgb: '74,255,138',
  },
  {
    id: 'playground',
    number: '03',
    title: 'Playground',
    mission: 'MISSION 03 — DISCOVERY',
    tag: 'CHILDHOOD · PLAY · RESPONSIVE',
    description: 'Soft robotic structures respond to children\'s motion. Obstacles grow, tunnels reroute — the ground itself becomes an active collaborator.',
    previewVideo: '/videos/playground_1.mp4',
    accent: '#9a7eb0',
    accentRgb: '154,126,176',
  },
]

export default function ChoicePage() {
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120)
    return () => clearTimeout(t)
  }, [])

  function handleChoose(id) {
    setExiting(true)
    setTimeout(() => navigate(`/experience/${id}`), 900)
  }

  return (
    <div className={`cp ${ready ? 'cp--ready' : ''} ${exiting ? 'cp--exit' : ''}`}>

      {/* ── Sidebar ── */}
      <aside className="cp-sidebar">
        <button className="cp-back" onClick={() => navigate('/')}>
          <span className="cp-back__line" />
          <span className="hud-label">← ABORT MISSION</span>
        </button>

        <div className="cp-sidebar-mid">
          <p className="hud-label hud-label--accent" style={{ marginBottom: '0.8rem' }}>// SELECT DEPLOYMENT ZONE</p>
          <h2 className="cp-sidebar-heading">
            CHOOSE<br /><span className="cp-sidebar-heading--outline">SCENARIO</span>
          </h2>
          <p className="cp-sidebar-body">
            Three urban zones await robotic transformation. Select your mission objective.
          </p>

          {active && (
            <div className="cp-sidebar-active fade-in">
              <span className="hud-label hud-label--accent">ACTIVE TARGET</span>
              <span className="cp-sidebar-active-name" style={{ color: SCENARIOS.find(s=>s.id===active)?.accent }}>
                {SCENARIOS.find(s=>s.id===active)?.title.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="cp-sidebar-footer">
          <span className="hud-label">WOLFSBURG 2045</span>
          <span className="hud-label hud-label--green">SYS:ACTIVE</span>
        </div>
      </aside>

      {/* ── Cards ── */}
      <main className="cp-cards">
        {SCENARIOS.map((s, i) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            index={i}
            isActive={active === s.id}
            onHover={() => setActive(s.id)}
            onLeave={() => setActive(null)}
            onChoose={() => handleChoose(s.id)}
          />
        ))}
      </main>

      <div className="lb-top" /><div className="lb-bottom" />
    </div>
  )
}

function ScenarioCard({ scenario, index, isActive, onHover, onLeave, onChoose }) {
  return (
    <article
      className={`cp-card ${isActive ? 'cp-card--active' : ''}`}
      style={{ '--accent': scenario.accent, '--accent-rgb': scenario.accentRgb, animationDelay: `${0.1 + index * 0.12}s` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onChoose}
    >
      {/* Video preview */}
      <div className="cp-card-video-wrap">
        <video
          className="cp-card-video"
          src={scenario.previewVideo}
          muted loop playsInline
          ref={el => {
            if (el) { isActive ? el.play().catch(()=>{}) : (el.pause(), el.currentTime = 0) }
          }}
        />
        <div className="cp-card-overlay" />
      </div>

      {/* HUD frame corners on active */}
      {isActive && (
        <>
          <span className="cp-card-corner cp-card-corner--tl" />
          <span className="cp-card-corner cp-card-corner--tr" />
          <span className="cp-card-corner cp-card-corner--bl" />
          <span className="cp-card-corner cp-card-corner--br" />
        </>
      )}

      {/* Content */}
      <div className="cp-card-content">
        <div className="cp-card-top">
          <span className="hud-label" style={{ color: 'var(--accent)', opacity: 0.9 }}>
            {scenario.mission}
          </span>
          <span className="hud-label" style={{ marginTop: '0.3rem' }}>{scenario.tag}</span>
        </div>

        <div className="cp-card-mid">
          <h3 className="cp-card-title">{scenario.title.toUpperCase()}</h3>
          <div className="cp-card-scan-line" />
        </div>

        <div className={`cp-card-bottom ${isActive ? 'cp-card-bottom--show' : ''}`}>
          <p className="cp-card-desc">{scenario.description}</p>
          <div className="cp-card-cta">
            <span className="hud-label" style={{ color: 'var(--accent)' }}>ENTER ZONE →</span>
            <span className="blink hud-label" style={{ color: 'var(--accent)' }}>▌</span>
          </div>
        </div>
      </div>
    </article>
  )
}
