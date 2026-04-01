import { useGameStore } from '../store/gameStore'

const METRICS = [
  { key: 'trust' as const, label: 'Trust', color: '#3B82F6' },
  { key: 'velocity' as const, label: 'Speed', color: '#F59E0B' },
  { key: 'retention' as const, label: 'Loyalty', color: '#10B981' },
  { key: 'innovation' as const, label: 'Ideas', color: '#8B5CF6' },
]

export function MetricHUD() {
  const { metrics } = useGameStore()

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      {METRICS.map(({ key, label, color }) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {/* Mini bar */}
          <div style={{ width: '36px', height: '3px', background: 'var(--surface2)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${metrics[key]}%`,
              background: color,
              borderRadius: '2px',
              transition: 'width 0.8s ease',
            }} />
          </div>
          <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
