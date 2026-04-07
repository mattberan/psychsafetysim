import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 👉 Swap in your Formspree form ID here
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqegnznk'

interface Props {
  onClose: () => void
  triggerLabel?: string
}

export function SubscribeModal({ onClose, triggerLabel }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, source: triggerLabel ?? 'daily-challenge' }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-hover)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '440px',
          width: '100%',
        }}
      >
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F1F5F9', marginBottom: '10px' }}>
                You're in.
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                You're on the list. Scenarios, insights, and updates — coming to your inbox.
              </p>
              <button
                onClick={onClose}
                style={{
                  background: 'var(--amber)', color: '#000',
                  border: 'none', borderRadius: '8px',
                  padding: '10px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Dot + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--amber)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Free Newsletter
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F1F5F9', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                The Beran Brief
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Three topics, one sentence each — every Thursday. Get new scenarios, research insights, and new games, apps and content as we build them together — straight to your inbox.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border-hover)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '15px',
                    color: '#F1F5F9',
                    outline: 'none',
                    width: '100%',
                  }}
                />
                <motion.button
                  whileHover={{ filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    background: 'var(--amber)', color: '#000',
                    border: 'none', borderRadius: '8px',
                    padding: '13px', fontSize: '15px', fontWeight: 800,
                    opacity: status === 'loading' ? 0.7 : 1,
                  }}
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe →'}
                </motion.button>
                {status === 'error' && (
                  <p style={{ fontSize: '13px', color: '#EF4444', textAlign: 'center' }}>
                    Something went wrong. Try again?
                  </p>
                )}
              </form>

              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', fontSize: '13px',
                  cursor: 'pointer', marginTop: '14px', display: 'block', width: '100%',
                  textAlign: 'center',
                }}
              >
                Maybe later
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
