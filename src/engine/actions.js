// Actions — every user input is an action appended to the log.
// applyAction mutates state and returns a log entry.

import { buyShareFromIPO, buyShareFromMarket, sellShares } from './sharePool.js'
import { placeCorpOnMarket, moveDividend, moveSell, moveRight, moveLeft, moveSoldOutCorps, corpPrice } from './stockMarket.js'
import { buyAvailableTrain, rustTrains } from './depot.js'
import { addTrain } from './corporation.js'
import { advanceToPhase, phaseForTrain } from './phase.js'
import { collectRevenue, collectAllRevenue, closeAllCompanies, assignPrivate, closePrivate } from './privateCompany.js'
import { transferFromBank, transferToBank } from './bank.js'
import { deliverToSegment, deliverToExport, advanceBeerMarket, removeNoDemand, placeNoDemand } from './beerMarket.js'
import { advanceRound, setRound, setFixedIndex, roundLabel } from './roundTracker.js'

let actionSeq = 0

export function applyAction(state, action) {
  const entry = {
    id: actionSeq++,
    timestamp: Date.now(),
    action,
    description: describeAction(state, action),
  }

  switch (action.type) {
    case 'PAR_SHARE':
      handlePar(state, action)
      break
    case 'BUY_SHARE':
      handleBuyShare(state, action)
      break
    case 'SELL_SHARES':
      handleSellShares(state, action)
      break
    case 'PAY_DIVIDEND':
      handlePayDividend(state, action)
      break
    case 'WITHHOLD_DIVIDEND':
      handleWithholdDividend(state, action)
      break
    case 'HALF_DIVIDEND':
      handleHalfDividend(state, action)
      break
    case 'BUY_TRAIN':
      handleBuyTrain(state, action)
      break
    case 'BUY_PRIVATE':
      handleBuyPrivate(state, action)
      break
    case 'SELL_PRIVATE':
      handleSellPrivate(state, action)
      break
    case 'COLLECT_REVENUE':
      handleCollectRevenue(state, action)
      break
    case 'COLLECT_ALL_REVENUE':
      handleCollectAllRevenue(state, action)
      break
    case 'SOLD_OUT_ADJUST':
      handleSoldOutAdjust(state, action)
      break
    case 'ADJUST_CASH':
      handleAdjustCash(state, action)
      break
    case 'ADVANCE_ROUND':
      if (state.roundTracker) {
        advanceRound(state.roundTracker, state.phaseManager)
      }
      break
    case 'SET_ROUND':
      if (state.roundTracker) {
        if (action.fixedIndex != null) {
          setFixedIndex(state.roundTracker, action.fixedIndex)
        } else {
          setRound(state.roundTracker, action.roundType, action.srNumber, action.orSet, action.orInSet)
        }
      }
      break
    // Beer market actions (HSB)
    case 'DELIVER_BEER':
      handleDeliverBeer(state, action)
      break
    case 'DELIVER_EXPORT':
      handleDeliverExport(state, action)
      break
    case 'BREWERY_INCOME':
      handleBreweryIncome(state, action)
      break
    case 'ADVANCE_BEER_MARKET':
      handleAdvanceBeerMarket(state, action)
      break
    case 'REMOVE_NO_DEMAND':
      handleRemoveNoDemand(state, action)
      break
    case 'PLACE_NO_DEMAND':
      handlePlaceNoDemand(state, action)
      break
    default:
      break
  }

  state.actionLog.push(entry)
  return entry
}

function handlePar(state, { playerId, corpSym, parPrice, row, col }) {
  const corp = state.corporations.find((c) => c.sym === corpSym)
  const player = state.players.find((p) => p.id === playerId)
  if (!corp || !player) return

  corp.parPrice = parPrice
  corp.ipoed = true
  placeCorpOnMarket(state.stockMarket, corpSym, row, col)

  const presPercent = state.title.shares?.[0] ?? 20
  const cost = (parPrice * presPercent) / 10
  player.cash -= cost
  corp.ipoShares -= presPercent
  corp.cash += cost
  player.shares.push({ corpSym, percent: presPercent, isPresident: true })

  const soldPercent = 100 - corp.ipoShares
  if (soldPercent >= corp.floatPercent) {
    corp.floated = true
  }
}

function handleBuyShare(state, { playerId, corpSym, source, percent = 10 }) {
  if (source === 'ipo') {
    buyShareFromIPO(state, playerId, corpSym, percent)
  } else if (source === 'market') {
    buyShareFromMarket(state, playerId, corpSym, percent)
  }
}

function handleSellShares(state, { playerId, corpSym, percent = 10 }) {
  sellShares(state, playerId, corpSym, percent)
  // Title-aware sell movement
  const sellMovement = state.title.sellMovement || 'down_share'
  moveSell(state.stockMarket, corpSym, percent, sellMovement)
}

function handlePayDividend(state, { corpSym, totalRevenue }) {
  const corp = state.corporations.find((c) => c.sym === corpSym)
  if (!corp) return

  const perShare = Math.floor(totalRevenue / 10)

  // Pay each player for their shares
  for (const player of state.players) {
    const pct = player.shares
      .filter((s) => s.corpSym === corpSym)
      .reduce((sum, s) => sum + s.percent, 0)
    if (pct > 0) {
      const payout = perShare * (pct / 10)
      player.cash += payout
      state.bank.cash -= payout
    }
  }

  // IPO shares: money goes to corp (full cap) or bank (incremental)
  if (corp.ipoShares > 0 && state.title.capitalization === 'full') {
    const ipoPayout = perShare * (corp.ipoShares / 10)
    corp.cash += ipoPayout
    state.bank.cash -= ipoPayout
  }

  // Market shares: dividends go to bank (already there, no transfer needed)

  // Price movement: title-aware (standard double jump, or TRG triple jump, etc.)
  moveDividend(state.stockMarket, corpSym, perShare, state.title.dividendMovement)
}

function handleWithholdDividend(state, { corpSym, totalRevenue }) {
  const corp = state.corporations.find((c) => c.sym === corpSym)
  if (!corp) return

  corp.cash += totalRevenue
  state.bank.cash -= totalRevenue

  // Price moves left once
  moveLeft(state.stockMarket, corpSym, 1)
}

function handleHalfDividend(state, { corpSym, totalRevenue }) {
  // Half to shareholders, half to treasury
  const corp = state.corporations.find((c) => c.sym === corpSym)
  if (!corp) return

  const halfRevenue = Math.floor(totalRevenue / 2)
  const perShare = Math.floor(halfRevenue / 10)

  // Pay shareholders their half
  for (const player of state.players) {
    const pct = player.shares
      .filter((s) => s.corpSym === corpSym)
      .reduce((sum, s) => sum + s.percent, 0)
    if (pct > 0) {
      const payout = perShare * (pct / 10)
      player.cash += payout
      state.bank.cash -= payout
    }
  }

  // Other half to corp treasury
  const treasuryHalf = totalRevenue - halfRevenue
  corp.cash += treasuryHalf
  state.bank.cash -= treasuryHalf

  // Half pay: no price movement (or move right once depending on title)
  // Most titles: no movement. Some: move right if > 0.
  // Default: no movement for half pay
}

function handleBuyTrain(state, { corpSym, trainName, price, fromCorpSym }) {
  const corp = state.corporations.find((c) => c.sym === corpSym)
  if (!corp) return

  let train
  if (fromCorpSym) {
    const fromCorp = state.corporations.find((c) => c.sym === fromCorpSym)
    if (!fromCorp) return
    const idx = fromCorp.trains.findIndex((t) => t.name === trainName)
    if (idx === -1) return
    train = fromCorp.trains.splice(idx, 1)[0]
    corp.cash -= price
    fromCorp.cash += price
  } else {
    train = buyAvailableTrain(state.depot, trainName)
    if (!train) return
    const actualPrice = price ?? train.price
    corp.cash -= actualPrice
    state.bank.cash += actualPrice
  }

  addTrain(corp, train)

  // Check phase advancement
  const newPhase = phaseForTrain(state.phaseManager, trainName)
  if (newPhase && state.phaseManager.currentIndex < state.phaseManager.phases.indexOf(newPhase)) {
    advanceToPhase(state.phaseManager, newPhase.name)

    // Handle train rusting
    rustTrains(state, trainName)

    // Handle events
    for (const event of (train.events || [])) {
      if (event === 'close_companies') {
        closeAllCompanies(state)
      }
    }

    // Make trains available that were gated on this train name
    for (const t of state.depot.upcoming) {
      if (t.availableOn === trainName) {
        t.availableOn = null
      }
    }
  }
}

function handleBuyPrivate(state, { playerId, companySym, price }) {
  const player = state.players.find((p) => p.id === playerId)
  const company = state.companies.find((c) => c.sym === companySym)
  if (!player || !company) return

  player.cash -= price
  state.bank.cash += price
  assignPrivate(company, playerId, 'player')
  player.privates.push(companySym)
}

function handleSellPrivate(state, { companySym, fromPlayerId, toCorpSym, price }) {
  const company = state.companies.find((c) => c.sym === companySym)
  const fromPlayer = state.players.find((p) => p.id === fromPlayerId)
  const toCorp = state.corporations.find((c) => c.sym === toCorpSym)
  if (!company || !fromPlayer || !toCorp) return

  fromPlayer.cash += price
  toCorp.cash -= price
  fromPlayer.privates = fromPlayer.privates.filter((s) => s !== companySym)
  assignPrivate(company, toCorpSym, 'corporation')
}

function handleCollectRevenue(state, { companySym }) {
  collectRevenue(state, companySym)
}

function handleCollectAllRevenue(state) {
  collectAllRevenue(state)
}

function handleSoldOutAdjust(state) {
  // Move all sold-out corps up one space (called at end of OR set)
  moveSoldOutCorps(state.stockMarket, state.corporations)
}

// --- Beer market handlers (HSB) ---

function handleDeliverBeer(state, { brewerySym, segmentId, count = 1 }) {
  if (!state.beerMarket) return
  const delivered = deliverToSegment(state.beerMarket, segmentId, count)
  // Income is tracked when BREWERY_INCOME action is dispatched
  return delivered
}

function handleDeliverExport(state, { brewerySym, count = 1 }) {
  if (!state.beerMarket) return
  deliverToExport(state.beerMarket, count)
}

function handleBreweryIncome(state, { brewerySym, ownerType, ownerId, income }) {
  // Pay brewery income to owner (player for small brewery, shareholders for corp)
  if (ownerType === 'player') {
    const player = state.players.find((p) => p.id === ownerId)
    if (player) {
      player.cash += income
      state.bank.cash -= income
    }
  } else if (ownerType === 'corporation') {
    // For brewery corps: income goes to corp treasury (withhold) or paid as dividend
    const corp = state.corporations.find((c) => c.sym === brewerySym)
    if (corp) {
      corp.cash += income
      state.bank.cash -= income
    }
  }
}

function handleAdvanceBeerMarket(state) {
  if (!state.beerMarket) return
  advanceBeerMarket(state.beerMarket)
}

function handleRemoveNoDemand(state, { segmentId }) {
  if (!state.beerMarket) return
  removeNoDemand(state.beerMarket, segmentId)
}

function handlePlaceNoDemand(state, { segmentId }) {
  if (!state.beerMarket) return
  placeNoDemand(state.beerMarket, segmentId)
}

function handleAdjustCash(state, { entityId, entityType, amount }) {
  if (entityType === 'player') {
    const player = state.players.find((p) => p.id === entityId)
    if (player) player.cash += amount
  } else if (entityType === 'corporation') {
    const corp = state.corporations.find((c) => c.sym === entityId)
    if (corp) corp.cash += amount
  } else if (entityType === 'bank') {
    state.bank.cash += amount
  }
}

// Generate human-readable description
function describeAction(state, action) {
  const playerName = (id) => state.players.find((p) => p.id === id)?.name ?? id
  const fmt = (n) => `${state.title.currencyFormat}${n}`

  switch (action.type) {
    case 'PAR_SHARE':
      return `${playerName(action.playerId)} pars ${action.corpSym} at ${fmt(action.parPrice)}`
    case 'BUY_SHARE':
      return `${playerName(action.playerId)} buys ${action.percent ?? 10}% ${action.corpSym} from ${action.source}`
    case 'SELL_SHARES':
      return `${playerName(action.playerId)} sells ${action.percent ?? 10}% ${action.corpSym}`
    case 'PAY_DIVIDEND': {
      const ps = Math.floor(action.totalRevenue / 10)
      const price = corpPrice(state.stockMarket, action.corpSym)
      const jumps = price && ps >= price ? ' (double jump)' : ''
      return `${action.corpSym} pays ${fmt(action.totalRevenue)} (${fmt(ps)}/share)${jumps}`
    }
    case 'WITHHOLD_DIVIDEND':
      return `${action.corpSym} withholds ${fmt(action.totalRevenue)}`
    case 'HALF_DIVIDEND':
      return `${action.corpSym} half-pays ${fmt(action.totalRevenue)}`
    case 'BUY_TRAIN':
      return `${action.corpSym} buys ${action.trainName}-train${action.fromCorpSym ? ` from ${action.fromCorpSym}` : ''} for ${fmt(action.price ?? 0)}`
    case 'BUY_PRIVATE':
      return `${playerName(action.playerId)} buys ${action.companySym} for ${fmt(action.price)}`
    case 'SELL_PRIVATE':
      return `${playerName(action.fromPlayerId)} sells ${action.companySym} to ${action.toCorpSym} for ${fmt(action.price)}`
    case 'COLLECT_REVENUE':
      return `${action.companySym} collects revenue`
    case 'COLLECT_ALL_REVENUE':
      return 'All private revenue collected'
    case 'SOLD_OUT_ADJUST':
      return 'Sold-out corporations move up'
    case 'DELIVER_BEER':
      return `${action.brewerySym} delivers ${action.count ?? 1} beer to segment ${action.segmentId}`
    case 'DELIVER_EXPORT':
      return `${action.brewerySym} delivers ${action.count ?? 1} beer to export market`
    case 'BREWERY_INCOME':
      return `${action.brewerySym} earns ${fmt(action.income)} brewery income`
    case 'ADVANCE_BEER_MARKET':
      return 'Beer market advanced'
    case 'REMOVE_NO_DEMAND':
      return `No Demand removed from segment ${action.segmentId}`
    case 'PLACE_NO_DEMAND':
      return `No Demand placed on segment ${action.segmentId}`
    case 'ADJUST_CASH':
      return `Manual adjustment: ${action.entityId} ${action.amount >= 0 ? '+' : ''}${fmt(action.amount)}${action.reason ? ` (${action.reason})` : ''}`
    case 'ADVANCE_ROUND':
      return `→ ${state.roundTracker ? roundLabel(state.roundTracker) : 'next round'}`
    case 'SET_ROUND':
      return `Round set manually`
    default:
      return JSON.stringify(action)
  }
}
