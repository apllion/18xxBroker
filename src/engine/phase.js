// Phase — track current phase, advance on train purchase.

export function createPhaseManager(phaseDefs) {
  return {
    phases: phaseDefs,
    currentIndex: 0,
  }
}

export function currentPhase(pm) {
  return pm.phases[pm.currentIndex]
}

export function advanceToPhase(pm, phaseName) {
  const idx = pm.phases.findIndex((p) => p.name === phaseName)
  if (idx > pm.currentIndex) {
    pm.currentIndex = idx
    return pm.phases[idx]
  }
  return null
}

// Check if buying a train triggers a phase change
export function phaseForTrain(pm, trainName) {
  return pm.phases.find((p) => p.on === trainName)
}

export function trainLimit(pm, corpType = 'major') {
  const phase = currentPhase(pm)
  if (typeof phase.trainLimit === 'number') return phase.trainLimit
  return phase.trainLimit[corpType] ?? phase.trainLimit.default ?? 4
}

export function operatingRounds(pm) {
  return currentPhase(pm).operatingRounds
}
