import { useRef } from 'react'
import { motion } from 'framer-motion'
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

export function DebriefScreen() {
  const { metrics, initialMetrics, history, restartGame } = useGameStore()
  const cardRef = useRef<HTMLDivElement>(null)

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

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            style={{
              background: 'var(--surface2)', color: '#C8D6E4',
              border: '1px solid var(--border-hover)',
              borderRadius: '10px', padding: '12px 24px',
              fontSize: '14px', fontWeight: 600,
            }}
          >
            ↓ Export as PNG
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.97 }}
            onClick={restartGame}
            style={{
              background: 'var(--amber)', color: '#000',
              border: 'none', borderRadius: '10px',
              padding: '12px 24px', fontSize: '14px', fontWeight: 800,
            }}
          >
            Play Again →
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
