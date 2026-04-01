import { motion } from 'framer-motion'

interface Props {
  label: string
  value: number
  color: string
  delta?: number
}

export function MetricBar({ label, value, color, delta }: Props) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {delta !== undefined && delta !== 0 && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: delta > 0 ? '#10B981' : '#EF4444',
              }}
            >
              {delta > 0 ? '+' : ''}{delta}
            </motion.span>
          )}
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0' }}>{value}</span>
        </div>
      </div>
      <div style={{ height: '6px', background: '#1E293B', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: color,
            borderRadius: '3px',
          }}
        />
      </div>
    </div>
  )
}
