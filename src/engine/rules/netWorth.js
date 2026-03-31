// NetWorth — calculate player valuations (advisory).

import { corpPrice } from '../stockMarket.js'

export function playerNetWorth(state, playerId) {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return 0

  let shareValue = 0
  for (const holding of player.shares) {
    const price = corpPrice(state.stockMarket, holding.corpSym)
    if (price) {
      shareValue += (price * holding.percent) / 10
    }
  }

  let privateValue = 0
  for (const sym of player.privates) {
    const company = state.companies.find((c) => c.sym === sym)
    if (company && !company.closed) {
      privateValue += company.value
    }
  }

  return player.cash + shareValue + privateValue
}

export function allNetWorths(state) {
  return state.players.map((p) => ({
    playerId: p.id,
    name: p.name,
    cash: p.cash,
    shareValue: playerNetWorth(state, p.id) - p.cash - privateValueFor(state, p.id),
    privateValue: privateValueFor(state, p.id),
    total: playerNetWorth(state, p.id),
  })).sort((a, b) => b.total - a.total)
}

function privateValueFor(state, playerId) {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return 0
  return player.privates.reduce((sum, sym) => {
    const c = state.companies.find((co) => co.sym === sym)
    return sum + (c && !c.closed ? c.value : 0)
  }, 0)
}
