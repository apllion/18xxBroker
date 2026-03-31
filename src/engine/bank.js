// Bank — holds cash, tracks broken state.

export function createBank(totalCash) {
  return { cash: totalCash, broken: false }
}

export function transferFromBank(bank, amount) {
  bank.cash -= amount
  if (bank.cash <= 0) bank.broken = true
  return bank
}

export function transferToBank(bank, amount) {
  bank.cash += amount
  return bank
}
