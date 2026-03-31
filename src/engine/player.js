// Player — cash, share holdings, privates.

export function createPlayer(id, name, startingCash) {
  return {
    id,
    name,
    cash: startingCash,
    shares: [],    // [{ corpSym, percent, isPresident }]
    privates: [],  // [companySym]
  }
}

export function playerSharePercent(player, corpSym) {
  return player.shares
    .filter((s) => s.corpSym === corpSym)
    .reduce((sum, s) => sum + s.percent, 0)
}

export function playerCertCount(player) {
  // Each share holding = 1 cert, plus each private = 1 cert
  return player.shares.length + player.privates.length
}

export function isPresident(player, corpSym) {
  return player.shares.some((s) => s.corpSym === corpSym && s.isPresident)
}
