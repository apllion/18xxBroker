import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'

const BASE_TABS = [
  { id: 'market', label: 'Market' },
  { id: 'corps', label: 'Corps' },
  { id: 'privates', label: 'Privates' },
]

const BEER_TAB = { id: 'beer', label: 'Beer' }

const SUMMARY_TAB = { id: 'summary', label: 'Summary' }

export default function BottomNav() {
  const game = useGameStore((s) => s.game)
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)

  const hasBeer = game?.beerMarket != null
  const tabs = [...BASE_TABS, ...(hasBeer ? [BEER_TAB] : []), SUMMARY_TAB]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-broker-surface border-t border-broker-border flex z-20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-white bg-broker-surface-hover'
              : 'text-broker-text-muted hover:text-broker-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
