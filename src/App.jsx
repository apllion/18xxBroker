import { Routes, Route } from 'react-router-dom'
import { useGameStore } from './store/gameStore.js'
import { useSyncContext } from './hooks/SyncContext.jsx'
import GameSelector from './components/setup/GameSelector.jsx'
import PlayerSetup from './components/setup/PlayerSetup.jsx'
import GameShell from './components/layout/GameShell.jsx'

export default function App() {
  const game = useGameStore((s) => s.game)
  const sync = useSyncContext()

  // In a room but no game yet — waiting for host to send state
  if (!game && sync?.roomId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className={`w-4 h-4 rounded-full mx-auto ${
            sync.status === 'connected' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'
          }`} />
          <div>
            <div className="text-lg font-medium">Joining room</div>
            <div className="font-mono text-2xl font-bold tracking-widest mt-1">{sync.roomId}</div>
          </div>
          <div className="text-sm text-broker-text-muted">
            {sync.status === 'connected'
              ? `Connected to ${sync.peerCount} device${sync.peerCount !== 1 ? 's' : ''} — waiting for game...`
              : 'Connecting...'}
          </div>
          <button
            onClick={sync.leaveRoom}
            className="text-sm text-broker-text-muted hover:text-red-300 mt-4"
          >
            Leave Room
          </button>
        </div>
      </div>
    )
  }

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
