import { useState, useMemo } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { formatCurrency } from '../../utils/currency.js'
import { corpPrice } from '../../engine/stockMarket.js'
import { currentPhase, trainLimit, operatingRounds } from '../../engine/phase.js'
import { nextAvailableTrains, remainingCount } from '../../engine/depot.js'
import { calculateDividend } from '../../engine/rules/dividend.js'

export default function CorpsTab() {
  const game = useGameStore((s) => s.game)
  const dispatch = useGameStore((s) => s.dispatch)
  const [corpIndex, setCorpIndex] = useState(0)

  if (!game) return null

  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)
  const phase = currentPhase(game.phaseManager)
  const orCount = operatingRounds(game.phaseManager)

  // Operating order: floated corps sorted by share price descending
  const operatingOrder = useMemo(() => {
    return game.corporations
      .filter((c) => c.floated)
      .map((c) => ({ ...c, price: corpPrice(game.stockMarket, c.sym) || 0 }))
      .sort((a, b) => b.price - a.price)
  }, [game.corporations, game.stockMarket])

  if (operatingOrder.length === 0) {
    return (
      <div className="p-6 text-center text-broker-text-muted">
        No corporations have floated yet
      </div>
    )
  }

  const safeIndex = Math.min(corpIndex, operatingOrder.length - 1)
  const selected = operatingOrder[safeIndex]

  function nextCorp() {
    setCorpIndex((i) => (i + 1) % operatingOrder.length)
  }
  function prevCorp() {
    setCorpIndex((i) => (i - 1 + operatingOrder.length) % operatingOrder.length)
  }

  function handleSoldOutAdjust() {
    dispatch({ type: 'SOLD_OUT_ADJUST' })
  }

  function handleCollectAll() {
    dispatch({ type: 'COLLECT_ALL_REVENUE' })
  }

  return (
    <div className="p-3 space-y-3">
      {/* OR info bar */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-broker-text-muted">
          Phase <span className="text-white font-medium">{phase.name}</span>
          {' · '}ORs: {orCount}
          {' · '}Train limit: {typeof phase.trainLimit === 'number' ? phase.trainLimit : '—'}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCollectAll}
            className="text-xs bg-green-900 hover:bg-green-800 text-green-200 px-2 py-1 rounded"
          >
            Collect Privates
          </button>
          <button
            onClick={handleSoldOutAdjust}
            className="text-xs bg-broker-green hover:bg-broker-green-light text-broker-gold px-2 py-1 rounded"
          >
            Sold-out ↑
          </button>
        </div>
      </div>

      {/* Corp operating order with nav */}
      <div className="flex items-center gap-2">
        <button onClick={prevCorp} className="text-broker-text-muted hover:text-broker-gold px-2 py-1">◀</button>
        <div className="flex gap-1 overflow-x-auto flex-1">
          {operatingOrder.map((c, i) => (
            <button
              key={c.sym}
              onClick={() => setCorpIndex(i)}
              className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium transition-colors ${
                i === safeIndex
                  ? 'ring-2 ring-white'
                  : i < safeIndex ? 'opacity-40' : 'opacity-80'
              }`}
              style={{ backgroundColor: c.color, color: c.textColor || '#fff' }}
            >
              {c.sym}
            </button>
          ))}
        </div>
        <button onClick={nextCorp} className="text-broker-text-muted hover:text-broker-gold px-2 py-1">▶</button>
      </div>

      <div className="text-xs text-broker-text-muted text-center">
        {safeIndex + 1} of {operatingOrder.length} · {selected.sym} operating
      </div>

      {/* Corp detail */}
      <CorpDetail game={game} corp={selected} dispatch={dispatch} fmt={fmt} onNext={nextCorp} />
    </div>
  )
}

function CorpDetail({ game, corp, dispatch, fmt, onNext }) {
  const [revenue, setRevenue] = useState('')

  const price = corpPrice(game.stockMarket, corp.sym)
  const limit = trainLimit(game.phaseManager)
  const president = game.players.find((p) =>
    p.shares.some((s) => s.corpSym === corp.sym && s.isPresident)
  )

  const revNum = parseInt(revenue, 10) || 0
  const perShare = revNum > 0 ? Math.floor(revNum / 10) : 0
  const dividendPreview = revNum > 0 ? calculateDividend(game, corp.sym, revNum) : null
  const isDoubleJump = price && perShare >= price

  function handlePay() {
    if (revNum <= 0) return
    dispatch({ type: 'PAY_DIVIDEND', corpSym: corp.sym, totalRevenue: revNum })
    setRevenue('')
  }

  function handleWithhold() {
    if (revNum <= 0) return
    dispatch({ type: 'WITHHOLD_DIVIDEND', corpSym: corp.sym, totalRevenue: revNum })
    setRevenue('')
  }

  function handleHalfPay() {
    if (revNum <= 0) return
    dispatch({ type: 'HALF_DIVIDEND', corpSym: corp.sym, totalRevenue: revNum })
    setRevenue('')
  }

  function handleBuyTrain(trainName, trainPrice) {
    dispatch({ type: 'BUY_TRAIN', corpSym: corp.sym, trainName, price: trainPrice })
  }

  function handleBuyFromCorp(fromCorpSym, trainName, negotiatedPrice) {
    dispatch({ type: 'BUY_TRAIN', corpSym: corp.sym, trainName, price: negotiatedPrice, fromCorpSym })
  }

  // Quick revenue presets based on common values
  const presets = []
  for (let v = 20; v <= 400; v += 20) presets.push(v)

  // Other corps' trains available for purchase
  const otherCorpTrains = game.corporations
    .filter((c) => c.sym !== corp.sym && c.floated && c.trains.length > 0)
    .map((c) => ({ sym: c.sym, color: c.color, textColor: c.textColor, trains: c.trains }))

  return (
    <div className="space-y-3">
      {/* Corp info */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-bold text-lg" style={{ color: corp.color }}>{corp.sym}</span>
            <span className="text-broker-text-muted text-sm ml-2">{corp.name}</span>
          </div>
          <div className="text-right text-sm">
            <div className="text-broker-text">Price: {price ? fmt(price) : '—'}</div>
            <div className="text-broker-text-muted">Par: {fmt(corp.parPrice)}</div>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-broker-text">
          <div>Treasury: <span className="font-medium text-white">{fmt(corp.cash)}</span></div>
          <div>President: <span className="font-medium">{president?.name ?? '—'}</span></div>
          <div>Tokens: {corp.tokensPlaced}/{corp.tokens.length}</div>
        </div>
      </div>

      {/* Trains */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">
          Trains ({corp.trains.length}/{limit})
        </div>
        <div className="flex gap-2">
          {corp.trains.length === 0 ? (
            <span className="text-broker-text-muted text-sm">No trains</span>
          ) : (
            corp.trains.map((t) => (
              <span key={t.id} className="bg-broker-surface-hover px-3 py-1 rounded text-sm font-medium">
                {t.name}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Revenue & Dividends */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Revenue</div>
        <input
          type="number"
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
          placeholder="Enter revenue"
          className="w-full bg-broker-bg border border-broker-border rounded px-3 py-2 text-white text-lg text-center mb-2 focus:outline-none focus:border-gray-500"
        />

        <div className="flex flex-wrap gap-1 mb-3">
          {presets.filter((v) => v <= 300).map((v) => (
            <button
              key={v}
              onClick={() => setRevenue(String(v))}
              className="bg-broker-surface-hover hover:bg-broker-surface-hover text-xs px-2 py-1 rounded"
            >
              {v}
            </button>
          ))}
        </div>

        {dividendPreview && (
          <div className="text-xs text-broker-text-muted mb-2">
            {fmt(dividendPreview.perShare)}/share
            {isDoubleJump && <span className="text-yellow-400 font-medium ml-1">(double jump!)</span>}
            {' · '}
            {dividendPreview.payouts.map((p) => `${p.name}: +${fmt(p.amount)}`).join(' · ')}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handlePay}
            disabled={revNum <= 0}
            className="flex-1 bg-green-800 hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            <div>Pay {revNum > 0 ? fmt(revNum) : ''}</div>
            <div className="text-xs opacity-70">
              {isDoubleJump ? 'price ↗↗' : 'price ↗'}
            </div>
          </button>
          <button
            onClick={handleHalfPay}
            disabled={revNum <= 0}
            className="flex-1 bg-yellow-900 hover:bg-yellow-800 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            <div>Half</div>
            <div className="text-xs opacity-70">½ each</div>
          </button>
          <button
            onClick={handleWithhold}
            disabled={revNum <= 0}
            className="flex-1 bg-orange-900 hover:bg-orange-800 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            <div>Withhold</div>
            <div className="text-xs opacity-70">price ↙</div>
          </button>
        </div>
      </div>

      {/* Buy train from depot */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Buy Train from Depot</div>
        <div className="space-y-1">
          {nextAvailableTrains(game.depot).map((t) => {
            const canAfford = corp.cash >= t.price
            const count = remainingCount(game.depot, t.name)
            return (
              <button
                key={t.name}
                onClick={() => canAfford && handleBuyTrain(t.name, t.price)}
                disabled={!canAfford}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${
                  canAfford
                    ? 'bg-broker-surface-hover hover:bg-broker-surface-hover text-white'
                    : 'bg-broker-bg text-broker-text-muted cursor-not-allowed'
                }`}
              >
                <span className="font-medium">{t.name}-train</span>
                <span>
                  {fmt(t.price)}
                  {t.rustsOn && <span className="text-xs text-red-400 ml-1">rusts on {t.rustsOn}</span>}
                  <span className="text-xs text-broker-text-muted ml-2">({count} left)</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Buy train from other corp */}
      {otherCorpTrains.length > 0 && (
        <BuyFromCorpPanel
          otherCorpTrains={otherCorpTrains}
          buyerCash={corp.cash}
          onBuy={handleBuyFromCorp}
          fmt={fmt}
        />
      )}

      {/* Next corp button */}
      <button
        onClick={onNext}
        className="w-full bg-broker-surface-hover hover:bg-broker-surface-hover text-white py-3 rounded-lg font-medium transition-colors"
      >
        Done — Next Corp ▶
      </button>
    </div>
  )
}

function BuyFromCorpPanel({ otherCorpTrains, buyerCash, onBuy, fmt }) {
  const [buyingFrom, setBuyingFrom] = useState(null) // { corpSym, trainName }
  const [negotiatedPrice, setNegotiatedPrice] = useState('')

  function handleConfirm() {
    const price = parseInt(negotiatedPrice, 10)
    if (!price || !buyingFrom) return
    onBuy(buyingFrom.corpSym, buyingFrom.trainName, price)
    setBuyingFrom(null)
    setNegotiatedPrice('')
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Buy Train from Corporation</div>
      <div className="space-y-1">
        {otherCorpTrains.map((c) =>
          c.trains.map((t) => (
            <div key={`${c.sym}-${t.id}`} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-sm font-medium w-10">{c.sym}</span>
              <span className="text-sm">{t.name}-train</span>
              <button
                onClick={() => setBuyingFrom({ corpSym: c.sym, trainName: t.name })}
                className="ml-auto text-xs bg-broker-surface-hover hover:bg-broker-surface-hover px-2 py-1 rounded"
              >
                Buy
              </button>
            </div>
          ))
        )}
      </div>

      {buyingFrom && (
        <div className="mt-2 flex gap-2 items-center">
          <span className="text-xs text-broker-text-muted">
            {buyingFrom.trainName} from {buyingFrom.corpSym} for:
          </span>
          <input
            type="number"
            value={negotiatedPrice}
            onChange={(e) => setNegotiatedPrice(e.target.value)}
            placeholder="Price"
            className="w-24 bg-broker-bg border border-broker-border rounded px-2 py-1 text-sm text-white"
          />
          <button
            onClick={handleConfirm}
            className="text-xs bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded text-white"
          >
            Confirm
          </button>
          <button
            onClick={() => setBuyingFrom(null)}
            className="text-xs text-broker-text-muted hover:text-broker-text px-2 py-1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
