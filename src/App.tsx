import { useGameStore } from './store/gameStore'
import { IntroScreen } from './screens/IntroScreen'
import { ScenarioScreen } from './screens/ScenarioScreen'
import { ConsequenceScreen } from './screens/ConsequenceScreen'
import { DebriefScreen } from './screens/DebriefScreen'

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
    default:
      return <IntroScreen />
  }
}
