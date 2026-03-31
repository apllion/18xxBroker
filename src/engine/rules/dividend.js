// Dividend — calculate payouts (advisory).

export function calculateDividend(state, corpSym, totalRevenue) {
  const perShare = Math.floor(totalRevenue / 10)

  const payouts = []
  for (const player of state.players) {
    const pct = player.shares
      .filter((s) => s.corpSym === corpSym)
      .reduce((sum, s) => sum + s.percent, 0)
    if (pct > 0) {
      payouts.push({
        playerId: player.id,
        name: player.name,
        percent: pct,
        amount: perShare * (pct / 10),
      })
    }
  }

  return { perShare, payouts, totalRevenue }
}
