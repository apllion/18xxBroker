// GameSetup — initialize a full game state from a title + player names.

import { createBank } from './bank.js'
import { createPlayer } from './player.js'
import { createCorporation } from './corporation.js'
import { createStockMarket } from './stockMarket.js'
import { createDepot } from './depot.js'
import { createPhaseManager } from './phase.js'
import { createPrivateCompany } from './privateCompany.js'
import { createBeerMarket } from './beerMarket.js'
import { createRoundTracker } from './roundTracker.js'
import { filterCorporations, filterCompanies, getPregameSteps, getSetupHints } from './pregame.js'
import { resolveTitle } from './variants.js'

export function createGame(baseTitle, playerNames, userVariant = null) {
  const playerCount = playerNames.length

  // Resolve variant overrides (player-count auto or user-selected)
  const title = resolveTitle(baseTitle, playerCount, userVariant)

  // Resolve player-count-dependent values
  const bankCash = typeof title.bankCash === 'number'
    ? title.bankCash
    : title.bankCash[playerCount]

  const startingCash = title.startingCash[playerCount]
  const certLimit = resolveCertLimit(title.certLimit, playerCount)

  const players = playerNames.map((name, i) =>
    createPlayer(`p${i}`, name, startingCash)
  )

  // Filter corps and companies by player count
  const corpDefs = filterCorporations(title, playerCount)
  const companyDefs = filterCompanies(title, playerCount)

  const corporations = corpDefs.map((def) => createCorporation(def, title))
  const companies = companyDefs.map((def) => createPrivateCompany(def))

  const bank = createBank(bankCash - (startingCash * playerCount))
  const stockMarket = createStockMarket(title.market)
  const depot = createDepot(title.trains, playerCount)
  const phaseManager = createPhaseManager(title.phases)

  // Build round tracker with pregame steps
  const pregameSteps = getPregameSteps(title)
  const roundTracker = createRoundTracker(title, pregameSteps)

  // Setup hints for the UI
  const setupHints = getSetupHints(title, playerCount)

  return {
    title,
    playerCount,
    certLimit,
    bank,
    players,
    corporations,
    companies,
    stockMarket,
    depot,
    phaseManager,
    beerMarket: createBeerMarket(title, playerCount),
    roundTracker,
    setupHints,
    actionLog: [],
    createdAt: Date.now(),
  }
}

function resolveCertLimit(certLimitDef, playerCount) {
  const val = certLimitDef[playerCount]
  if (typeof val === 'number') return val
  return val
}
