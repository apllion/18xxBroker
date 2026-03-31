import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import Header from './Header.jsx'
import BottomNav from './BottomNav.jsx'
import MarketTab from '../market/MarketTab.jsx'
import CorpsTab from '../corps/CorpsTab.jsx'
import PrivatesTab from '../privates/PrivatesTab.jsx'
import SummaryTab from '../summary/SummaryTab.jsx'
import BeerMarketTab from '../beer/BeerMarketTab.jsx'

const TAB_COMPONENTS = {
  market: MarketTab,
  corps: CorpsTab,
  privates: PrivatesTab,
  beer: BeerMarketTab,
  summary: SummaryTab,
}

export default function GameShell() {
  const activeTab = useUIStore((s) => s.activeTab)
  const TabComponent = TAB_COMPONENTS[activeTab] || SummaryTab

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto pb-16">
        <TabComponent />
      </main>
      <BottomNav />
    </div>
  )
}
