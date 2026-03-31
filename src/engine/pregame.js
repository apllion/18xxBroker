// Pregame — filter corps/companies by player count, define pregame steps.
// Each title can define:
//   pregame: [{ id, label, type }]  — steps before SR1
//   corporations[].minPlayers / maxPlayers — availability by player count
//   companies[].minPlayers / maxPlayers — availability by player count
//   removeCorps: { [playerCount]: count } — random corps to remove
//   parPriceGates: [{ price, unlocksOn }] — phase-gated par prices

// Filter corporations for the given player count
export function filterCorporations(title, playerCount) {
  let corps = title.corporations.filter((c) => {
    if (c.minPlayers && playerCount < c.minPlayers) return false
    if (c.maxPlayers && playerCount > c.maxPlayers) return false
    return true
  })

  // Handle random corp removal (1849: remove 1 at 3p or 4p-reduced)
  if (title.removeCorps) {
    const removeCount = title.removeCorps[playerCount] || 0
    if (removeCount > 0) {
      // Don't actually remove randomly here — that's a table decision.
      // Mark them as "may be removed" so the UI can show a hint.
      // The actual removal is done via action.
    }
  }

  return corps
}

// Filter companies/privates for the given player count
export function filterCompanies(title, playerCount) {
  return title.companies.filter((c) => {
    if (c.minPlayers && playerCount < c.minPlayers) return false
    if (c.maxPlayers && playerCount > c.maxPlayers) return false
    return true
  })
}

// Get the pregame steps for a title (defaults if not specified)
export function getPregameSteps(title) {
  if (title.pregame) return title.pregame

  // Default: if there are companies, there's an auction
  if (title.companies && title.companies.length > 0) {
    return [{ id: 'auction', label: 'Private Auction', type: 'auction' }]
  }

  return []
}

// Get available par prices for the current phase (for phase-gated titles like 1849)
export function getAvailableParPrices(title, phaseManager, stockMarket) {
  if (!title.parPriceGates) {
    // Standard: all par prices from market
    const { parPrices } = require('./stockMarket.js')
    return parPrices(stockMarket)
  }

  // Phase-gated: only prices whose gate has been reached
  const currentPhase = phaseManager.phases[phaseManager.currentIndex]
  const phaseIndex = phaseManager.currentIndex

  // Collect all par prices that are unlocked
  const unlocked = new Set()
  for (const gate of title.parPriceGates) {
    if (!gate.unlocksOn) {
      // Always available
      unlocked.add(gate.price)
    } else {
      // Check if we've reached or passed the unlocking phase
      const gatePhaseIdx = phaseManager.phases.findIndex((p) => p.name === gate.unlocksOn)
      if (gatePhaseIdx >= 0 && phaseIndex >= gatePhaseIdx) {
        unlocked.add(gate.price)
      }
    }
  }

  // Filter market par prices to only unlocked ones
  const allPars = []
  for (let row = 0; row < stockMarket.grid.length; row++) {
    for (let col = 0; col < stockMarket.grid[row].length; col++) {
      const cell = stockMarket.grid[row][col]
      if (cell && cell.canPar && unlocked.has(cell.price)) {
        allPars.push({ price: cell.price, row, col })
      }
    }
  }
  return allPars.sort((a, b) => a.price - b.price)
}

// Setup hints — things the UI should display during setup
export function getSetupHints(title, playerCount) {
  const hints = []

  // Player-count dependent corp removal
  if (title.removeCorps && title.removeCorps[playerCount]) {
    hints.push({
      type: 'remove_corps',
      message: `Remove ${title.removeCorps[playerCount]} random corporation(s) from the game`,
    })
  }

  // Random president share (18Ches Cornelius Vanderbilt, 18SJ Nils Ericson)
  const randomPres = title.companies?.filter((c) => c.desc?.includes('random'))
  if (randomPres?.length > 0) {
    for (const c of randomPres) {
      hints.push({
        type: 'random_president',
        message: `${c.name}: assigns a random president's share`,
        companySym: c.sym,
      })
    }
  }

  // AFG home city choice (1849)
  const choosesHome = title.corporations?.filter((c) => c.coordinates === null || c.desc?.includes('Choose home'))
  if (choosesHome?.length > 0) {
    for (const c of choosesHome) {
      hints.push({
        type: 'choose_home',
        message: `${c.sym}: president chooses home city when floating`,
        corpSym: c.sym,
      })
    }
  }

  // Phase-gated par prices
  if (title.parPriceGates) {
    hints.push({
      type: 'par_gates',
      message: 'Par prices unlock as phases advance',
      gates: title.parPriceGates,
    })
  }

  // Corp availability order (1849: random order, one at a time)
  if (title.corpOrder === 'sequential_random') {
    hints.push({
      type: 'corp_order',
      message: 'Corporations must be parred in random order (one at a time)',
    })
  }

  return hints
}
