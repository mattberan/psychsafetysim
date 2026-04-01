import { useGameStore } from '../store/gameStore'
import { MetricBar } from './MetricBar'

const METRICS_CONFIG = [
  { key: 'trust' as const, label: 'Trust Index', color: '#3B82F6' },
  { key: 'velocity' as const, label: 'Velocity Score', color: '#F59E0B' },
  { key: 'retention' as const, label: 'Retention Signal', color: '#10B981' },
  { key: 'innovation' as const, label: 'Innovation Rate', color: '#8B5CF6' },
]

interface Props {
  showDeltas?: boolean
}

export function MetricsDashboard({ showDeltas }: Props) {
  const { metrics, history, selectedChoice } = useGameStore()

  const lastRecord = history[history.length - 1]
  const prevMetrics = history.length > 1
    ? history[history.length - 2].metricsAfter
    : history.length === 1
      ? { trust: 60, velocity: 60, retention: 60, innovation: 60 }
      : null

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '20px',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '10px', color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
          Team Health
        </p>
      </div>

      {METRICS_CONFIG.map(({ key, label, color }) => {
        const delta =
          showDeltas && prevMetrics
            ? metrics[key] - prevMetrics[key]
            : undefined
        return (
          <MetricBar
            key={key}
            label={label}
            value={metrics[key]}
            color={color}
            delta={delta}
          />
        )
      })}

      {metrics.trust < 40 && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px 10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#FCA5A5',
          }}
        >
          ⚠ Trust is critically low. All positive changes are halved.
        </div>
      )}
    </div>
  )
}
