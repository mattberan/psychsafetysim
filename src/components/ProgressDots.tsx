import { useGameStore } from '../store/gameStore'

export function ProgressDots() {
  const { currentIndex, scenarioQueue } = useGameStore()
  const total = scenarioQueue.length

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === currentIndex ? '20px' : '6px',
            height: '6px',
            borderRadius: '3px',
            background: i < currentIndex
              ? '#3B82F6'
              : i === currentIndex
                ? '#60A5FA'
                : '#1E293B',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
      <span style={{ marginLeft: '6px', fontSize: '12px', color: '#64748B' }}>
        {currentIndex + 1} / {total}
      </span>
    </div>
  )
}
