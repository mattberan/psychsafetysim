import { useGameStore } from './store/gameStore'
import { IntroScreen } from './screens/IntroScreen'
import { ScenarioScreen } from './screens/ScenarioScreen'
import { ConsequenceScreen } from './screens/ConsequenceScreen'
import { DebriefScreen } from './screens/DebriefScreen'
import { DailyScreen } from './screens/DailyScreen'
import { DailyConsequenceScreen } from './screens/DailyConsequenceScreen'

export default function App() {
  const phase = useGameStore((s) => s.phase)

  switch (phase) {
    case 'intro':
      return <IntroScreen />
    case 'scenario':
      return <ScenarioScreen />
    case 'consequence':
      return <ConsequenceScreen />
    case 'debrief':
      return <DebriefScreen />
    case 'daily':
      return <DailyScreen />
    case 'daily-consequence':
      return <DailyConsequenceScreen />
    default:
      return <IntroScreen />
  }
}
