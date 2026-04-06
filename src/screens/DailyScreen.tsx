import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import type { Choice } from '../data/scenarios'

const CATEGORY_COLORS: Record<string, string> = {
  'responding-to-failure': '#EF4444',
  'speaking-up-to-leaders': '#3B82F6',
  'welcoming-dissent': '#8B5CF6',
  'peer-feedback': '#F59E0B',
  'inclusion-signals': '#10B981',
  'postmortem-culture': '#EC4899',
}

const CATEGORY_LABELS: Record<string, string> = {
  'responding-to-failure': 'Responding to Failure',
  'speaking-up-to-leaders': 'Speaking Up',
  'welcoming-dissent': 'Welcoming Dissent',
  'peer-feedback': 'Peer Feedback',
  'inclusion-signals': 'Inclusion',
  'postmortem-culture': 'Postmortem Culture',
}

function useTypingText(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])
  return { displayed, done }
}

const choiceLetters = ['A', 'B', 'C', 'D']

// Format today's date nicely
function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function DailyScreen() {
  const { currentScenario, selectChoice, restartGame } = useGameStore()
  const [showChoices, setShowChoices] = useState(false)
  const [contextVisible, setContextVisible] = useState(false)

  useEffect(() => {
    setShowChoices(false)
    setContextVisible(false)
    const t1 = setTimeout(() => setContextVisible(true), 200)
    const t2 = setTimeout(() => setShowChoices(true), 800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [currentScenario?.id])

  const triggerFull = currentScenario?.trigger ?? ''
  const { displayed: typedTrigger, done: triggerDone } = useTypingText(
    contextVisible ? triggerFull : '',
    18
  )

  if (!currentScenario) return null

  const catColor = CATEGORY_COLORS[currentScenario.category] ?? 'var(--amber)'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--amber)' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Daily Challenge
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>·</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{getTodayLabel()}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: catColor }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: catColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {CATEGORY_LABELS[currentScenario.category]}
          </span>
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

      {/* Content */}
      <div style={{
        flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto',
        padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', gap: '24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800,
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
            lineHeight: 1.2, marginBottom: '10px',
          }}>
            {currentScenario.title}
          </h2>
          <AnimatePresence>
            {contextVisible && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ fontSize: '15px', color: 'var(--text-primary)', opacity: 0.75, lineHeight: 1.65 }}
              >
                {currentScenario.context}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {contextVisible && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${catColor}CC, ${catColor}66)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 800, color: '#000', flexShrink: 0,
                }}>
                  {currentScenario.character[0]}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentScenario.character}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentScenario.characterRole}</div>
                </div>
              </div>
              <div style={{
                background: 'var(--surface)', border: `1px solid ${catColor}30`,
                borderLeft: `3px solid ${catColor}`, borderRadius: '4px 12px 12px 12px',
                padding: '18px 20px',
              }}>
                <p style={{
                  fontSize: 'clamp(16px, 2.2vw, 20px)', color: 'var(--text-primary)',
                  lineHeight: 1.55, fontWeight: 500, margin: 0, minHeight: '1.5em',
                }}>
                  {typedTrigger}
                  {!triggerDone && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      style={{ display: 'inline-block', width: '2px', height: '1.1em', background: catColor, marginLeft: '2px', verticalAlign: 'text-bottom' }}
                    />
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showChoices && triggerDone && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div style={{
                fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px',
              }}>
                You respond as Alex:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentScenario.choices.map((choice: Choice, i: number) => (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ background: 'var(--surface2)', borderColor: 'var(--border-hover)', x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => selectChoice(choice)}
                    style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: '10px', padding: '14px 16px', textAlign: 'left',
                      display: 'flex', gap: '12px', alignItems: 'flex-start',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '6px',
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
                      flexShrink: 0, marginTop: '1px',
                    }}>
                      {choiceLetters[i]}
                    </span>
                    <span style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                      {choice.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
