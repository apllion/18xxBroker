// GameEnd — detect end conditions (advisory).

export function gameEndWarnings(state) {
  const warnings = []

  // Bank broken
  if (state.bank.broken || state.bank.cash <= 0) {
    warnings.push({ type: 'bank_broken', message: 'Bank is broken — game ends after this OR set' })
  }

  // Bank low
  const bankPercent = state.bank.cash / (state.bank.cash + totalPlayerCash(state)) * 100
  if (bankPercent < 20 && !state.bank.broken) {
    warnings.push({ type: 'bank_low', message: `Bank is low: ${state.title.currencyFormat}${state.bank.cash} remaining` })
  }

  // Player bankrupt
  for (const player of state.players) {
    if (player.cash < 0) {
      warnings.push({ type: 'bankrupt', message: `${player.name} has negative cash: ${state.title.currencyFormat}${player.cash}` })
    }
  }

  return warnings
}

function totalPlayerCash(state) {
  return state.players.reduce((sum, p) => sum + p.cash, 0)
}
