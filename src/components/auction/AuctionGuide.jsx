import { useState, useCallback, useMemo } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { useDispatch } from '../../hooks/useDispatch.js'
import { currentPregameStep } from '../../engine/roundTracker.js'
import { formatCurrency } from '../../utils/currency.js'
import { getRules } from './auctionRules.js'
import SetupHints from './SetupHints.jsx'
import PlayerOrderBar from './PlayerOrderBar.jsx'
import WaterfallAuction from './WaterfallAuction.jsx'
import EnglishAuction from './EnglishAuction.jsx'
import BidboxAuction from './BidboxAuction.jsx'
import DraftAuction from './DraftAuction.jsx'
import ResultsEntry from './ResultsEntry.jsx'

export default function AuctionGuide() {
  const game = useGameStore((s) => s.game)
  const dispatch = useDispatch()
  const [rulesExpanded, setRulesExpanded] = useState(false)
  const [manualMode, setManualMode] = useState(false)

  if (!game) return null

  const fmt = useCallback((n) => formatCurrency(n, game.title.currencyFormat), [game.title.currencyFormat])
  const step = currentPregameStep(game.roundTracker)
  const auctionType = step?.type || 'waterfall'
  const rules = getRules(auctionType)

  const companies = game.companies
  const unsoldCompanies = companies.filter((c) => !c.ownerId)
  const allSold = unsoldCompanies.length === 0
  const hasCompanies = companies.length > 0

  // Players ordered starting from priority deal holder
  const orderedPlayers = useMemo(() => {
    const all = game.players
    const prioIdx = all.findIndex((p) => p.id === game.priorityDeal)
    if (prioIdx > 0) return [...all.slice(prioIdx), ...all.slice(0, prioIdx)]
    return all
  }, [game.players, game.priorityDeal])

  function handleAdvance() {
    dispatch({ type: 'ADVANCE_ROUND' })
  }

  function renderAuction() {
    if (!hasCompanies) {
      return (
        <div className="bg-broker-surface rounded-lg p-4 text-center text-broker-text-muted text-sm">
          No companies to auction. Resolve this step at the table, then advance.
        </div>
      )
    }

    if (manualMode) {
      return <ResultsEntry game={game} dispatch={dispatch} fmt={fmt} />
    }

    switch (auctionType) {
      case 'waterfall':
        return <WaterfallAuction game={game} players={orderedPlayers} dispatch={dispatch} fmt={fmt} auctionType={auctionType} />
      case 'english':
        return <EnglishAuction game={game} players={orderedPlayers} dispatch={dispatch} fmt={fmt} />
      case 'bidbox':
        return <BidboxAuction game={game} players={orderedPlayers} dispatch={dispatch} fmt={fmt} />
      case 'draft':
      case 'purchase':
      case 'priority':
        return <DraftAuction game={game} players={orderedPlayers} dispatch={dispatch} fmt={fmt} auctionType={auctionType} />
      default:
        return <DraftAuction game={game} players={orderedPlayers} dispatch={dispatch} fmt={fmt} auctionType={auctionType} />
    }
  }

  return (
    <div className="p-3 space-y-3">
      {/* Interactive setup hints */}
      <SetupHints game={game} dispatch={dispatch} />

      {/* Player order bar (reorderable + cash) */}
      <PlayerOrderBar players={game.players} dispatch={dispatch} fmt={fmt} />

      {/* Auction header: rules + mode toggle */}
      <div className="bg-broker-surface rounded-lg">
        <div className="flex items-center justify-between px-3 py-2">
          <button
            onClick={() => setRulesExpanded(!rulesExpanded)}
            className="font-medium text-sm text-left flex-1"
          >
            {rules.title}
            <span className="text-broker-text-muted text-xs ml-2">{rulesExpanded ? 'hide' : 'rules'}</span>
          </button>

          <button
            onClick={() => setManualMode(!manualMode)}
            className={`text-xs px-2.5 py-1 rounded transition-colors ${
              manualMode
                ? 'bg-amber-800 text-amber-200'
                : 'bg-broker-surface-hover text-broker-text-muted hover:text-white'
            }`}
          >
            {manualMode ? 'Guided' : 'Manual'}
          </button>
        </div>
        {rulesExpanded && (
          <div className="px-3 pb-3 space-y-1">
            <p className="text-sm text-broker-text-muted">{rules.summary}</p>
            {rules.steps.length > 0 && (
              <ol className="text-xs text-broker-text-muted space-y-0.5 list-decimal list-inside mt-2">
                {rules.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            )}
          </div>
        )}
      </div>

      {/* Auction content */}
      {renderAuction()}

      {/* Done / Advance button */}
      <button
        onClick={handleAdvance}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          allSold || !hasCompanies
            ? 'bg-broker-green text-broker-gold hover:bg-broker-green-light'
            : 'bg-broker-surface hover:bg-broker-surface-hover text-broker-text-muted'
        }`}
      >
        {allSold || !hasCompanies
          ? 'Done — Start SR1'
          : `Skip Auction (${unsoldCompanies.length} unsold)`
        }
      </button>
    </div>
  )
}
