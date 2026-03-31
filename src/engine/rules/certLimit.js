// CertLimit — compute limit and check violations (advisory).

import { playerCertCount } from '../player.js'

export function getCertLimit(state) {
  return state.certLimit
}

export function certLimitWarnings(state) {
  const limit = getCertLimit(state)
  if (typeof limit !== 'number') return [] // nested limits handled by title

  const warnings = []
  for (const player of state.players) {
    const count = playerCertCount(player)
    if (count > limit) {
      warnings.push({
        playerId: player.id,
        name: player.name,
        count,
        limit,
        over: count - limit,
      })
    }
  }
  return warnings
}
