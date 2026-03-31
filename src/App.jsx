import { Routes, Route } from 'react-router-dom'
import { useGameStore } from './store/gameStore.js'
import GameSelector from './components/setup/GameSelector.jsx'
import PlayerSetup from './components/setup/PlayerSetup.jsx'
import GameShell from './components/layout/GameShell.jsx'

export default function App() {
  const game = useGameStore((s) => s.game)

  if (!game) {
    return (
      <Routes>
        <Route path="/" element={<GameSelector />} />
        <Route path="/setup/:titleId" element={<PlayerSetup />} />
      </Routes>
    )
  }

  return <GameShell />
}
