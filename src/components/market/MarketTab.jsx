import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import MarketGrid from './MarketGrid.jsx'
import ShareHoldings from './ShareHoldings.jsx'
import ActionPanel from './ActionPanel.jsx'
import PlayerSelector from './PlayerSelector.jsx'

export default function MarketTab() {
  const game = useGameStore((s) => s.game)
  if (!game) return null

  return (
    <div className="p-3 space-y-4">
      <PlayerSelector />
      <MarketGrid />
      <ShareHoldings />
      <ActionPanel />
    </div>
  )
}
