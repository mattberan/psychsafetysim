import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { toneLabels, toneDescriptions } from '../data/outcomes'
import { SubscribeModal } from '../components/SubscribeModal'

const TONE_COLORS: Record<string, string> = {
  dismissive: '#EF4444',
  deflecting: '#F59E0B',
  engaging: '#3B82F6',
  modeling: '#10B981',
}

const TONE_ICONS: Record<string, string> = {
  dismissive: '✕',
  deflecting: '→',
  engaging: '↗',
  modeling: '★',
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function DailyConsequenceScreen() {
  const { selectedChoice, currentScenario, restartGame, startGame } = useGameStore()
  const [showSubscribe, setShowSubscribe] = useState(false)

  if (!selectedChoice || !currentScenario) return null

  const tone = selectedChoice.tone
  const toneColor = TONE_COLORS[tone]
  const metricKeys = ['trust', 'velocity', 'retention', 'innovation'] as const
  const metricLabels = { trust: 'Trust', velocity: 'Velocity', retention: 'Retention', innovation: 'Innovation' }

  // Share text
  const shareText = `Today's Psych Safety Challenge: "${currentScenario.title}"\nMy response: ${toneLabels[tone]}\n\nHow would you handle it?`

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText).catch(() => {})
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--amber)' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Daily Challenge
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>· {getTodayLabel()}</span>
        </div>
        <button
          onClick={restartGame}
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
            padding: '5px 12px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        flex: 1, maxWidth: '680px', width: '100%', margin: '0 auto',
        padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', gap: '20px',
      }}>

        {/* Tone verdict */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '16px 20px',
            background: `${toneColor}12`, border: `1px solid ${toneColor}35`, borderRadius: '12px',
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `${toneColor}20`, border: `1px solid ${toneColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
          }}>
            {TONE_ICONS[tone]}
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: toneColor, marginBottom: '3px' }}>
              {toneLabels[tone]}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.45, opacity: 0.8 }}>
              {toneDescriptions[tone]}
            </div>
          </div>
        </motion.div>

        {/* What you said */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 18px' }}
        >
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            You said:
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.55, fontStyle: 'italic', opacity: 0.85 }}>
            "{selectedChoice.text}"
          </p>
        </motion.div>

        {/* Consequence */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '18px 20px' }}
        >
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            What happened:
          </div>
          <p style={{ fontSize: '17px', color: 'var(--text-primary)', lineHeight: 1.65, fontWeight: 400 }}>
            {selectedChoice.consequence}
          </p>
        </motion.div>

        {/* Metric deltas */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
        >
          {metricKeys.map((key) => {
            const d = selectedChoice.delta[key]
            return (
              <div key={key} style={{
                background: d > 0 ? 'rgba(16,185,129,0.08)' : d < 0 ? 'rgba(239,68,68,0.08)' : 'var(--surface)',
                border: `1px solid ${d > 0 ? 'rgba(16,185,129,0.25)' : d < 0 ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
                borderRadius: '8px', padding: '8px 14px',
                display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '80px',
              }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {metricLabels[key]}
                </span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: d > 0 ? '#10B981' : d < 0 ? '#EF4444' : 'var(--text-muted)' }}>
                  {d > 0 ? '+' : ''}{d}
                </span>
              </div>
            )
          })}
        </motion.div>

        {/* Research */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '16px 18px' }}
        >
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            The Research
          </div>
          <p style={{ fontSize: '14px', color: '#A5B4FC', lineHeight: 1.6, marginBottom: currentScenario.researchNote ? '8px' : 0 }}>
            {currentScenario.insight}
          </p>
          {currentScenario.researchNote && (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {currentScenario.researchNote}
            </p>
          )}
        </motion.div>

        {/* Subscribe CTA — the main hook */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.04))',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '14px', padding: '22px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Come back tomorrow
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.55, marginBottom: 0, fontWeight: 500 }}>
                A new scenario every day. Subscribe and it shows up in your inbox — one moment, one choice.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowSubscribe(true)}
              style={{
                background: 'var(--amber)', color: '#000',
                border: 'none', borderRadius: '9px',
                padding: '11px 22px', fontSize: '14px', fontWeight: 800,
                flexShrink: 0, alignSelf: 'center',
              }}
            >
              Subscribe →
            </motion.button>
          </div>
        </motion.div>

        {/* Secondary actions */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
        >
          <button
            onClick={handleCopyShare}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '10px 18px',
              fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Copy share text
          </button>
          <button
            onClick={startGame}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '10px 18px',
              fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Play full simulation →
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSubscribe && (
          <SubscribeModal onClose={() => setShowSubscribe(false)} triggerLabel="daily-challenge" />
        )}
      </AnimatePresence>
    </div>
  )
}
