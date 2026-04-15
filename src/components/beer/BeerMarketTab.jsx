import { useState } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { useDispatch } from '../../hooks/useDispatch.js'
import { formatCurrency } from '../../utils/currency.js'

export default function BeerMarketTab() {
  const game = useGameStore((s) => s.game)
  const dispatch = useDispatch()

  if (!game || !game.beerMarket) {
    return <div className="p-6 text-center text-broker-text-muted">No beer market in this title</div>
  }

  const bm = game.beerMarket
  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)

  function handleAdvance() {
    dispatch({ type: 'ADVANCE_BEER_MARKET' })
  }

  return (
    <div className="p-3 space-y-4">
      {/* Stock & controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-broker-text-muted">
          Stock: <span className="text-white font-medium">{bm.stock}</span> cubes
          {' · '}Export: <span className="text-white font-medium">{bm.exportMarket.cubes}</span>
        </div>
        <button
          onClick={handleAdvance}
          className="text-xs bg-amber-900 hover:bg-amber-800 text-amber-200 px-3 py-1 rounded"
        >
          Advance Market
        </button>
      </div>

      {/* Market segments */}
      <div className="space-y-2">
        {bm.segments.map((seg) => (
          <SegmentRow key={seg.id} segment={seg} game={game} dispatch={dispatch} fmt={fmt} />
        ))}
      </div>

      {/* Export market */}
      <ExportRow bm={bm} game={game} dispatch={dispatch} fmt={fmt} />

      {/* Brewery income calculator */}
      <BreweryIncomePanel game={game} dispatch={dispatch} fmt={fmt} />
    </div>
  )
}

function SegmentRow({ segment, game, dispatch, fmt }) {
  const seg = segment
  const titleSeg = game.title.beerMarket?.segments.find((s) => s.id === seg.id)

  function handleDeliver(brewerySym) {
    dispatch({ type: 'DELIVER_BEER', brewerySym, segmentId: seg.id, count: 1 })
  }

  function handleToggleNoDemand() {
    if (seg.noDemand) {
      dispatch({ type: 'REMOVE_NO_DEMAND', segmentId: seg.id })
    } else {
      dispatch({ type: 'PLACE_NO_DEMAND', segmentId: seg.id })
    }
  }

  // Get brewery corps for quick deliver buttons
  const breweries = game.corporations.filter((c) => c.type === 'brewery' && c.floated)

  return (
    <div className={`bg-broker-surface rounded-lg p-3 ${seg.noDemand ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">
          Segment {seg.id}
          {titleSeg && (
            <span className="text-xs text-broker-text-muted ml-2">
              Regular: {fmt(titleSeg.regularIncome)} · New: {fmt(titleSeg.newIncome)}
            </span>
          )}
        </div>
        <button
          onClick={handleToggleNoDemand}
          className={`text-xs px-2 py-0.5 rounded ${
            seg.noDemand
              ? 'bg-red-900 text-red-300'
              : 'bg-broker-surface-hover text-broker-text-muted hover:bg-broker-surface-hover'
          }`}
        >
          {seg.noDemand ? 'No Demand' : 'Active'}
        </button>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-600 inline-block" />
          <span className="text-broker-text">Regular: {seg.regularDemand}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-orange-600 inline-block" />
          <span className="text-broker-text">New: {seg.newDemand}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-white inline-block" />
          <span className="text-broker-text">Delivered: {seg.deliveries}</span>
        </div>
      </div>

      {!seg.noDemand && (seg.regularDemand > 0 || seg.newDemand > 0) && breweries.length > 0 && (
        <div className="flex gap-1 mt-2">
          <span className="text-xs text-broker-text-muted py-1">Deliver:</span>
          {breweries.map((b) => (
            <button
              key={b.sym}
              onClick={() => handleDeliver(b.sym)}
              className="text-xs px-2 py-1 rounded font-medium"
              style={{ backgroundColor: b.color, color: b.textColor || '#fff' }}
            >
              {b.sym}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ExportRow({ bm, game, dispatch, fmt }) {
  const exportIncome = game.title.beerMarket?.exportIncome || 100
  const breweries = game.corporations.filter((c) => c.type === 'brewery' && c.floated)

  function handleDeliver(brewerySym) {
    dispatch({ type: 'DELIVER_EXPORT', brewerySym, count: 1 })
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">
          Export Market
          <span className="text-xs text-broker-text-muted ml-2">Income: {fmt(exportIncome)}/cube</span>
        </div>
        <span className="text-sm text-white font-medium">{bm.exportMarket.cubes} cubes</span>
      </div>

      {bm.exportMarket.cubes > 0 && breweries.length > 0 && (
        <div className="flex gap-1">
          <span className="text-xs text-broker-text-muted py-1">Deliver:</span>
          {breweries.map((b) => (
            <button
              key={b.sym}
              onClick={() => handleDeliver(b.sym)}
              className="text-xs px-2 py-1 rounded font-medium"
              style={{ backgroundColor: b.color, color: b.textColor || '#fff' }}
            >
              {b.sym}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function BreweryIncomePanel({ game, dispatch, fmt }) {
  const [selectedBrewery, setSelectedBrewery] = useState(null)
  const [income, setIncome] = useState('')

  const breweries = game.corporations.filter((c) => c.type === 'brewery' && c.floated)
  if (breweries.length === 0) return null

  function handleCollect() {
    const amount = parseInt(income, 10)
    if (!amount || !selectedBrewery) return
    dispatch({
      type: 'BREWERY_INCOME',
      brewerySym: selectedBrewery,
      ownerType: 'corporation',
      ownerId: selectedBrewery,
      income: amount,
    })
    setIncome('')
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Brewery Income</div>
      <div className="flex gap-1 mb-2">
        {breweries.map((b) => (
          <button
            key={b.sym}
            onClick={() => setSelectedBrewery(b.sym)}
            className={`text-xs px-2 py-1 rounded font-medium ${
              selectedBrewery === b.sym ? 'ring-2 ring-white' : ''
            }`}
            style={{ backgroundColor: b.color, color: b.textColor || '#fff' }}
          >
            {b.sym} ({fmt(b.cash)})
          </button>
        ))}
      </div>
      {selectedBrewery && (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Income"
            className="w-24 bg-broker-bg border border-broker-border rounded px-2 py-1 text-sm text-white"
          />
          <button
            onClick={handleCollect}
            className="text-xs bg-green-800 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            Collect to Treasury
          </button>
        </div>
      )}
    </div>
  )
}
