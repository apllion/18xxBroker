// SharePool — buy/sell shares between players, IPO, and market pool.
// Advisory only — never blocks actions.

export function buyShareFromIPO(state, playerId, corpSym, percent = 10) {
  const player = state.players.find((p) => p.id === playerId)
  const corp = state.corporations.find((c) => c.sym === corpSym)
  const price = state.stockMarket.corpPositions[corpSym]
    ? priceForCorp(state, corpSym)
    : corp.parPrice

  if (!player || !corp || !price) return

  const cost = (price * percent) / 10
  const isPresident = percent === 20 || (percent === (state.title.shares?.[0] ?? 20))

  player.cash -= cost
  corp.ipoShares -= percent

  // Capitalization: full = money goes to corp treasury on float
  if (state.title.capitalization === 'full') {
    corp.cash += cost
  }

  player.shares.push({ corpSym, percent, isPresident })

  // Check float
  const soldPercent = 100 - corp.ipoShares
  if (!corp.floated && soldPercent >= corp.floatPercent) {
    corp.floated = true
    if (state.title.capitalization === 'full') {
      // Corp gets full capitalization: par * 10 shares
      // Already accumulated from individual sales, so nothing extra needed
    }
  }

  state.bank.cash -= 0 // money came from player, went to corp — bank not involved for IPO buys
}

export function buyShareFromMarket(state, playerId, corpSym, percent = 10) {
  const player = state.players.find((p) => p.id === playerId)
  const corp = state.corporations.find((c) => c.sym === corpSym)
  const price = priceForCorp(state, corpSym)

  if (!player || !corp || !price) return

  const cost = (price * percent) / 10
  player.cash -= cost
  corp.marketShares -= percent
  state.bank.cash += cost // market shares: money goes to bank

  player.shares.push({ corpSym, percent, isPresident: false })
}

export function sellShares(state, playerId, corpSym, percent = 10) {
  const player = state.players.find((p) => p.id === playerId)
  const corp = state.corporations.find((c) => c.sym === corpSym)
  const price = priceForCorp(state, corpSym)

  if (!player || !corp || !price) return

  const revenue = (price * percent) / 10
  player.cash += revenue
  state.bank.cash -= revenue

  // Remove shares from player
  let remaining = percent
  player.shares = player.shares.filter((s) => {
    if (s.corpSym === corpSym && remaining > 0) {
      remaining -= s.percent
      return false
    }
    return true
  })

  corp.marketShares += percent
}

function priceForCorp(state, corpSym) {
  const pos = state.stockMarket.corpPositions[corpSym]
  if (!pos) return null
  const cell = state.stockMarket.grid[pos.row]?.[pos.col]
  return cell ? cell.price : null
}
