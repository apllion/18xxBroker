// Depot — train supply, purchasing, and rusting.

let nextTrainId = 1

export function createDepot(trainDefs, playerCount) {
  // Build the full supply of trains
  const upcoming = []
  for (const def of trainDefs) {
    let count
    if (typeof def.num === 'number') count = def.num
    else if (typeof def.num === 'object' && def.num !== null) count = def.num[playerCount] ?? 99
    else count = 99
    for (let i = 0; i < count; i++) {
      upcoming.push({
        id: `train_${nextTrainId++}`,
        name: def.name,
        distance: def.distance,
        price: def.price,
        rustsOn: def.rustsOn || null,
        availableOn: def.availableOn || null,
        discount: def.discount || null,
        events: def.events || [],
      })
    }
  }
  return {
    upcoming,
    discarded: [],
  }
}

export function availableTrains(depot, currentPhase) {
  // Trains are available if they don't have an availableOn requirement,
  // or if the phase that makes them available has been reached
  return depot.upcoming.filter((t) => {
    if (!t.availableOn) return true
    // Check if we've reached the phase where this train becomes available
    // This is simplified — the phase name must match or be past the availableOn
    return false // Will be made available when the triggering phase is reached
  })
}

export function buyTrainFromDepot(depot, trainName) {
  const idx = depot.upcoming.findIndex((t) => t.name === trainName && !t.availableOn)
  if (idx === -1) return null
  return depot.upcoming.splice(idx, 1)[0]
}

export function buyAvailableTrain(depot, trainName) {
  const idx = depot.upcoming.findIndex((t) => t.name === trainName)
  if (idx === -1) return null
  return depot.upcoming.splice(idx, 1)[0]
}

export function rustTrains(state, triggerTrainName) {
  // Find all trains across all corps that rust on this train name
  const rusted = []
  for (const corp of state.corporations) {
    const toRust = corp.trains.filter((t) => t.rustsOn === triggerTrainName)
    if (toRust.length > 0) {
      corp.trains = corp.trains.filter((t) => t.rustsOn !== triggerTrainName)
      rusted.push(...toRust.map((t) => ({ ...t, corpSym: corp.sym })))
    }
  }
  return rusted
}

export function nextAvailableTrains(depot) {
  // Group by name, return first of each available type
  const seen = new Set()
  const result = []
  for (const t of depot.upcoming) {
    if (!seen.has(t.name) && !t.availableOn) {
      seen.add(t.name)
      result.push(t)
    }
  }
  return result
}

export function remainingCount(depot, trainName) {
  return depot.upcoming.filter((t) => t.name === trainName).length
}
