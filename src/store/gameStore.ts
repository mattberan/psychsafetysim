import { create } from 'zustand'
import { scenarios, type Scenario, type Choice } from '../data/scenarios'

export type GamePhase =
  | 'intro'
  | 'scenario'
  | 'consequence'
  | 'debrief'

export interface Metrics {
  trust: number
  velocity: number
  retention: number
  innovation: number
}

export interface ChoiceRecord {
  scenarioId: string
  scenarioTitle: string
  choice: Choice
  metricsAfter: Metrics
}

interface GameState {
  phase: GamePhase
  metrics: Metrics
  initialMetrics: Metrics
  scenarioQueue: Scenario[]
  currentIndex: number
  currentScenario: Scenario | null
  selectedChoice: Choice | null
  history: ChoiceRecord[]

  startGame: () => void
  selectChoice: (choice: Choice) => void
  nextScenario: () => void
  restartGame: () => void
}

const STARTING_METRICS: Metrics = {
  trust: 60,
  velocity: 60,
  retention: 60,
  innovation: 60,
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function applyDelta(metrics: Metrics, choice: Choice, _history: ChoiceRecord[]): Metrics {
  const jitter = () => Math.floor(Math.random() * 5) - 2

  // Compounding rule: if trust < 40, halve positive deltas
  const trustLow = metrics.trust < 40
  const scale = (v: number) => {
    const jittered = v + jitter()
    return trustLow && jittered > 0 ? Math.floor(jittered / 2) : jittered
  }

  const clamp = (v: number) => Math.min(95, Math.max(5, v))

  return {
    trust: clamp(metrics.trust + scale(choice.delta.trust)),
    velocity: clamp(metrics.velocity + scale(choice.delta.velocity)),
    retention: clamp(metrics.retention + scale(choice.delta.retention)),
    innovation: clamp(metrics.innovation + scale(choice.delta.innovation)),
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'intro',
  metrics: { ...STARTING_METRICS },
  initialMetrics: { ...STARTING_METRICS },
  scenarioQueue: [],
  currentIndex: 0,
  currentScenario: null,
  selectedChoice: null,
  history: [],

  startGame: () => {
    // Pin P1 Blame Spiral first — most counterintuitive, best hook
    const rest = shuffle(scenarios.filter((s) => s.id !== 'p1-blame-spiral'))
    const first = scenarios.find((s) => s.id === 'p1-blame-spiral')!
    const queue = [first, ...rest]
    set({
      phase: 'scenario',
      metrics: { ...STARTING_METRICS },
      initialMetrics: { ...STARTING_METRICS },
      scenarioQueue: queue,
      currentIndex: 0,
      currentScenario: queue[0],
      selectedChoice: null,
      history: [],
    })
  },

  selectChoice: (choice: Choice) => {
    const { metrics, history, currentScenario } = get()
    const newMetrics = applyDelta(metrics, choice, history)
    const record: ChoiceRecord = {
      scenarioId: currentScenario!.id,
      scenarioTitle: currentScenario!.title,
      choice,
      metricsAfter: newMetrics,
    }
    set({
      phase: 'consequence',
      selectedChoice: choice,
      metrics: newMetrics,
      history: [...history, record],
    })
  },

  nextScenario: () => {
    const { currentIndex, scenarioQueue } = get()
    const next = currentIndex + 1
    if (next >= scenarioQueue.length) {
      set({ phase: 'debrief' })
    } else {
      set({
        phase: 'scenario',
        currentIndex: next,
        currentScenario: scenarioQueue[next],
        selectedChoice: null,
      })
    }
  },

  restartGame: () => {
    set({ phase: 'intro' })
  },
}))
