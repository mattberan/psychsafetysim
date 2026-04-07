import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { toPng } from 'html-to-image'
import { useGameStore } from '../store/gameStore'
import { classifyProfile, toneLabels } from '../data/outcomes'
import { SubscribeModal } from '../components/SubscribeModal'

const ATTRITION_COLORS: Record<string, string> = {
  LOW: '#10B981',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
  CRITICAL: '#FF3333',
}

// Readable text constants
const LABEL = { fontSize: '11px', fontWeight: 600, color: '#8899AA', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }
const BODY = { fontSize: '14px', color: '#C8D6E4', lineHeight: 1.6 }
const ROW_TEXT = { fontSize: '13px', color: '#C8D6E4' }

const TONE_COLORS: Record<string, string> = {
  dismissive: '#EF4444', deflecting: '#F59E0B', engaging: '#3B82F6', modeling: '#10B981',
}

export function DebriefScreen() {
  const { metrics, initialMetrics, history, restartGame, startDailyChallenge } = useGameStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)
  const [showSubscribe, setShowSubscribe] = useState(false)

  const profile = classifyProfile(metrics.trust, metrics.velocity, metrics.retention, metrics.innovation)

  const toneCounts: Record<string, number> = {}
  history.forEach((r) => {
    const t = r.choice.tone
    toneCounts[t] = (toneCounts[t] || 0) + 1
  })

  const highSafetyCount = history.filter((r) => r.choice.isHighSafety).length
  const totalScenarios = history.length

  const radarData = [
    { metric: 'Trust', start: initialMetrics.trust, end: metrics.trust },
    { metric: 'Velocity', start: initialMetrics.velocity, end: metrics.velocity },
    { metric: 'Retention', start: initialMetrics.retention, end: metrics.retention },
    { metric: 'Innovation', start: initialMetrics.innovation, end: metrics.innovation },
  ]

  const handleExport = async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true })
      const link = document.createElement('a')
      link.download = 'psych-safety-debrief.png'
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('Export failed', e)
    }
  }

  const toneColors: Record<string, string> = {
    dismissive: '#EF4444',
    deflecting: '#F59E0B',
    engaging: '#3B82F6',
    modeling: '#10B981',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '840px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: '20px', padding: '4px 14px', marginBottom: '16px',
          }}>
            <span style={{ fontSize: '11px', color: '#A5B4FC', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Simulation Complete
            </span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F1F5F9', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Your Team Debrief
          </h1>
          <p style={{ fontSize: '16px', color: '#8899AA', margin: 0 }}>
            Here's what your choices added up to.
          </p>
        </div>

        {/* Exportable card */}
        <div ref={cardRef} style={{ background: 'var(--bg)', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Profile header */}
          <div style={{
            background: `linear-gradient(135deg, ${profile.color}18, ${profile.color}06)`,
            border: `1px solid ${profile.color}45`,
            borderRadius: '14px', padding: '24px', marginBottom: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            gap: '20px', flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...LABEL, marginBottom: '8px' }}>Team Health Profile</div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: profile.color, margin: '0 0 10px' }}>
                {profile.name}
              </h2>
              <p style={{ ...BODY, margin: 0 }}>{profile.description}</p>
            </div>
            <div style={{
              background: `${profile.color}18`, border: `1px solid ${profile.color}40`,
              borderRadius: '10px', padding: '14px 18px', textAlign: 'center', flexShrink: 0,
            }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: profile.color }}>
                {highSafetyCount}/{totalScenarios}
              </div>
              <div style={{ fontSize: '11px', color: '#8899AA', marginTop: '2px' }}>
                high-safety choices
              </div>
            </div>
          </div>

          {/* Two column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

            {/* Radar */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <div style={LABEL}>Final Metrics</div>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2A2A38" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#8899AA', fontSize: 12, fontWeight: 600 }} />
                  <Radar name="Start" dataKey="start" stroke="#4A5568" fill="#4A5568" fillOpacity={0.2} />
                  <Radar name="End" dataKey="end" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
                {[{ color: '#4A5568', label: 'Start' }, { color: '#F59E0B', label: 'End' }].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
                    <span style={{ fontSize: '11px', color: '#8899AA', fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projection */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <div style={LABEL}>6-Month Projection</div>
              {[
                { label: 'Ticket Resolution Time', value: profile.ticketResolutionChange, good: profile.ticketResolutionChange.startsWith('-') },
                { label: 'Sprint Completion Rate', value: profile.sprintCompletionChange, good: profile.sprintCompletionChange.startsWith('+') },
                { label: 'Ideas Shipped / Quarter', value: profile.ideasPerQuarter, good: parseFloat(profile.ideasPerQuarter) >= 3.4 },
              ].map(({ label, value, good }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={ROW_TEXT}>{label}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: good ? '#10B981' : '#EF4444' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <span style={ROW_TEXT}>Voluntary Attrition Risk</span>
                <span style={{
                  fontSize: '12px', fontWeight: 700,
                  color: ATTRITION_COLORS[profile.attritionRisk],
                  background: `${ATTRITION_COLORS[profile.attritionRisk]}18`,
                  padding: '3px 10px', borderRadius: '20px',
                  border: `1px solid ${ATTRITION_COLORS[profile.attritionRisk]}40`,
                }}>
                  {profile.attritionRisk}
                </span>
              </div>
            </div>
          </div>

          {/* Patterns */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <div style={LABEL}>Your Behavior Patterns</div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {Object.entries(toneCounts).map(([tone, count]) => {
                const c = toneColors[tone]
                return (
                  <div key={tone} style={{
                    background: `${c}12`, border: `1px solid ${c}40`,
                    borderRadius: '8px', padding: '8px 14px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: c }}>{count}</span>
                    <span style={{ fontSize: '12px', color: '#C8D6E4', fontWeight: 500 }}>{toneLabels[tone]}</span>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {history.map((record, i) => {
                const c = toneColors[record.choice.tone]
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', background: 'var(--surface2)', borderRadius: '6px', gap: '10px',
                  }}>
                    <span style={{ fontSize: '13px', color: '#C8D6E4', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {record.scenarioTitle}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: c, flexShrink: 0, background: `${c}15`, padding: '2px 8px', borderRadius: '4px' }}>
                      {toneLabels[record.choice.tone]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: `${profile.color}0E`, border: `1px solid ${profile.color}30`,
            borderRadius: '12px', padding: '18px 20px',
          }}>
            <p style={{ fontSize: '15px', color: '#E2EAF2', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
              {profile.summary}
            </p>
          </div>
        </div>

        {/* Export */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
          <button
            onClick={handleExport}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.15)',
            }}
          >
            ↓ Export debrief as PNG
          </button>
        </div>

        {/* What If? Panel */}
        <div style={{ marginTop: '8px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px',
          }}>
            What if you'd chosen differently?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {history.map((record) => {
              const isOpen = expandedScenario === record.scenarioId
              return (
                <div key={record.scenarioId}>
                  <button
                    onClick={() => setExpandedScenario(isOpen ? null : record.scenarioId)}
                    style={{
                      width: '100%', background: isOpen ? 'var(--surface2)' : 'var(--surface)',
                      border: `1px solid ${isOpen ? 'var(--border-hover)' : 'var(--border)'}`,
                      borderRadius: isOpen ? '10px 10px 0 0' : '10px',
                      padding: '10px 14px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#C8D6E4', fontWeight: 500, textAlign: 'left' }}>
                      {record.scenarioTitle}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 600, color: TONE_COLORS[record.choice.tone],
                        background: `${TONE_COLORS[record.choice.tone]}15`,
                        padding: '2px 8px', borderRadius: '4px',
                      }}>
                        {toneLabels[record.choice.tone]}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          overflow: 'hidden',
                          background: 'var(--surface2)',
                          border: '1px solid var(--border-hover)',
                          borderTop: 'none',
                          borderRadius: '0 0 10px 10px',
                        }}
                      >
                        <WhatIfChoices record={record} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* Subscribe banner — prominent, above What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.05))',
            border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: '14px', padding: '20px 24px', marginTop: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '20px', flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              ★ Free Newsletter
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
              Scenarios, research insights, and new features as we build — straight to your inbox.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowSubscribe(true)}
            style={{
              background: 'var(--amber)', color: '#000', border: 'none',
              borderRadius: '9px', padding: '12px 28px',
              fontSize: '15px', fontWeight: 800, flexShrink: 0, cursor: 'pointer',
            }}
          >
            Subscribe →
          </motion.button>
        </motion.div>

        {/* What's Next */}
        <div style={{ marginTop: '16px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            Or keep going:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>

            {/* Replay */}
            <motion.button
              whileHover={{ scale: 1.02, borderColor: 'var(--border-hover)' }}
              whileTap={{ scale: 0.98 }}
              onClick={restartGame}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '20px 16px', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '10px' }}>↺</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F1F5F9', marginBottom: '6px' }}>Play Again</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Scenarios shuffle every time. See if your choices change.
              </div>
            </motion.button>

            {/* Daily Challenge */}
            <motion.button
              whileHover={{ scale: 1.02, borderColor: 'rgba(245,158,11,0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={startDailyChallenge}
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.04))',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '12px', padding: '20px 16px', cursor: 'pointer', textAlign: 'left',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '10px' }}>★</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F1F5F9', marginBottom: '6px' }}>Today's Challenge</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Try today's scenario now, then subscribe to get it daily.
              </div>
            </motion.button>

            {/* Play as someone else — coming soon */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '20px 16px', opacity: 0.5,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'var(--surface2)', color: 'var(--text-muted)',
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase',
              }}>
                Soon
              </div>
              <div style={{ fontSize: '22px', marginBottom: '10px' }}>◈</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F1F5F9', marginBottom: '6px' }}>Play as Priya</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                The same moments — from the receiving end.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSubscribe && (
          <SubscribeModal onClose={() => setShowSubscribe(false)} triggerLabel="debrief" />
        )}
      </AnimatePresence>
    </div>
  )
}

// Sub-component: all 4 choices for a given scenario
function WhatIfChoices({ record }: { record: import('../store/gameStore').ChoiceRecord }) {
  const { scenarioQueue } = useGameStore()
  const scenario = scenarioQueue.find(s => s.id === record.scenarioId)
  if (!scenario) return null

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {scenario.choices.map((choice, i) => {
        const isChosen = choice.id === record.choice.id
        const c = TONE_COLORS[choice.tone]
        const letters = ['A','B','C','D']
        return (
          <div
            key={choice.id}
            style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start',
              padding: '10px 12px', borderRadius: '8px',
              background: isChosen ? `${c}12` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isChosen ? c + '40' : 'rgba(255,255,255,0.04)'}`,
            }}
          >
            <span style={{
              width: '20px', height: '20px', borderRadius: '4px',
              background: isChosen ? `${c}25` : 'var(--surface)',
              border: `1px solid ${isChosen ? c + '50' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700, color: isChosen ? c : 'var(--text-muted)',
              flexShrink: 0, marginTop: '1px',
            }}>
              {letters[i]}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: isChosen ? '#F1F5F9' : 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 4px' }}>
                {choice.text}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  fontSize: '10px', fontWeight: 600, color: c,
                  background: `${c}15`, padding: '1px 7px', borderRadius: '3px',
                }}>
                  {toneLabels[choice.tone]}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {(['trust','velocity','retention','innovation'] as const).map(k => {
                    const d = choice.delta[k]
                    return d !== 0 ? `${k[0].toUpperCase()} ${d > 0 ? '+' : ''}${d}` : null
                  }).filter(Boolean).join(' · ')}
                </span>
                {isChosen && (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: c }}>← your choice</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
