import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

export function IntroScreen() {
  const startGame = useGameStore((s) => s.startGame)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', maxWidth: '580px', position: 'relative' }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '28px',
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--amber)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Team Simulator
          </span>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--amber)' }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
          }}
        >
          What you say next{' '}
          <span style={{
            background: 'linear-gradient(90deg, var(--amber), #FCD34D)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            changes everything.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '44px',
            fontWeight: 400,
          }}
        >
          You're a team lead. Real moments. Real consequences.
          <br />
          See how your words shape the team around you.
        </motion.p>

        {/* Pill stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '44px',
            flexWrap: 'wrap',
          }}
        >
          {[
            '7 real scenarios',
            '~15 minutes',
            'No wrong-looking answers',
          ].map((label) => (
            <span
              key={label}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '5px 14px',
              }}
            >
              {label}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <motion.button
            whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.97 }}
            onClick={startGame}
            style={{
              background: 'var(--amber)',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 44px',
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '0.01em',
            }}
          >
            Start →
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}
        >
          Based on research by Amy Edmondson · Google Project Aristotle · Kim Scott
        </motion.p>
      </motion.div>
    </div>
  )
}
