// RoundTracker — soft game sequence tracking.
// Pregame steps → SR → OR×N → SR pattern (or fixed sequence).
// Always advisory — never blocks actions.

export function createRoundTracker(title, pregameSteps = []) {
  const fixedSeq = title.roundSequence || null

  return {
    // Pregame
    pregameSteps,
    pregameIndex: pregameSteps.length > 0 ? 0 : -1, // -1 = pregame done
    inPregame: pregameSteps.length > 0,

    // Current position (used after pregame)
    type: 'stock',     // 'stock' | 'operating'
    srNumber: 1,
    orSet: 0,
    orInSet: 0,
    orTotal: 0,

    // Fixed sequence (22Mars, PTG, etc.)
    fixedSequence: fixedSeq,
    fixedIndex: 0,

    // Suggestions for UI
    suggestion: null,
  }
}

// Get a human-readable label for the current round
export function roundLabel(tracker) {
  if (tracker.inPregame && tracker.pregameIndex >= 0) {
    const step = tracker.pregameSteps[tracker.pregameIndex]
    return step ? step.label : 'Setup'
  }

  if (tracker.fixedSequence) {
    const entry = tracker.fixedSequence[tracker.fixedIndex]
    if (entry) return entry
    return `Round ${tracker.fixedIndex + 1}`
  }

  if (tracker.type === 'stock') {
    return `SR ${tracker.srNumber}`
  }
  return `OR ${tracker.orSet}.${tracker.orInSet}`
}

// Get current pregame step (null if past pregame)
export function currentPregameStep(tracker) {
  if (!tracker.inPregame || tracker.pregameIndex < 0) return null
  return tracker.pregameSteps[tracker.pregameIndex] || null
}

// Advance to the next round in the sequence.
export function advanceRound(tracker, phaseManager) {
  // If in pregame, advance through pregame steps
  if (tracker.inPregame) {
    if (tracker.pregameIndex < tracker.pregameSteps.length - 1) {
      tracker.pregameIndex++
    } else {
      // Pregame done → enter SR1
      tracker.inPregame = false
      tracker.pregameIndex = -1
      tracker.type = 'stock'
      tracker.srNumber = 1
      tracker.suggestion = null
      tracker.roundGuidance = 'Stock Round — players buy/sell shares in turn order'
    }
    return roundLabel(tracker)
  }

  if (tracker.fixedSequence) {
    return advanceFixed(tracker)
  }
  return advanceStandard(tracker, phaseManager)
}

function advanceFixed(tracker) {
  if (tracker.fixedIndex < tracker.fixedSequence.length - 1) {
    tracker.fixedIndex++
  }
  const entry = tracker.fixedSequence[tracker.fixedIndex] || ''
  parseFixedEntry(tracker, entry)
  return updateSuggestion(tracker)
}

function parseFixedEntry(tracker, entry) {
  if (entry.startsWith('SR')) {
    tracker.type = 'stock'
    tracker.srNumber = parseInt(entry.replace('SR', ''), 10) || tracker.srNumber + 1
    tracker.orInSet = 0
  } else if (entry.startsWith('OR')) {
    tracker.type = 'operating'
    const num = parseInt(entry.replace('OR', ''), 10) || tracker.orTotal + 1
    tracker.orTotal = num
    tracker.orSet = tracker.orSet || 1
    tracker.orInSet++
  }
}

function advanceStandard(tracker, phaseManager) {
  const phase = phaseManager.phases[phaseManager.currentIndex]
  const maxOR = phase?.operatingRounds || 2

  if (tracker.type === 'stock') {
    tracker.type = 'operating'
    tracker.orSet++
    tracker.orInSet = 1
    tracker.orTotal++
  } else if (tracker.orInSet < maxOR) {
    tracker.orInSet++
    tracker.orTotal++
  } else {
    tracker.type = 'stock'
    tracker.srNumber++
    tracker.orInSet = 0
  }

  return updateSuggestion(tracker)
}

function updateSuggestion(tracker) {
  if (tracker.type === 'stock' && tracker.srNumber > 1) {
    tracker.suggestion = {
      action: 'sold_out',
      message: 'End of OR set — check sold-out corps (move up)',
    }
  } else if (tracker.type === 'operating' && tracker.orInSet === 1) {
    tracker.suggestion = {
      action: 'collect_privates',
      message: 'Start of OR set — collect private revenues',
    }
  } else {
    tracker.suggestion = null
  }

  // Round guidance — brief contextual text for current round type
  if (tracker.type === 'stock') {
    tracker.roundGuidance = 'Stock Round — players buy/sell shares in turn order'
  } else if (tracker.type === 'operating') {
    tracker.roundGuidance = 'Operating Round — corporations run in price order'
  } else {
    tracker.roundGuidance = null
  }

  return roundLabel(tracker)
}

// Manual overrides
export function setRound(tracker, type, srNumber, orSet, orInSet) {
  tracker.inPregame = false
  tracker.pregameIndex = -1
  tracker.type = type
  if (srNumber != null) tracker.srNumber = srNumber
  if (orSet != null) tracker.orSet = orSet
  if (orInSet != null) tracker.orInSet = orInSet
  tracker.suggestion = null
}

export function setFixedIndex(tracker, index) {
  if (tracker.fixedSequence && index >= 0 && index < tracker.fixedSequence.length) {
    tracker.inPregame = false
    tracker.fixedIndex = index
    parseFixedEntry(tracker, tracker.fixedSequence[index])
    updateSuggestion(tracker)
  }
}

export function isLastRound(tracker) {
  if (tracker.fixedSequence) {
    return tracker.fixedIndex >= tracker.fixedSequence.length - 1
  }
  return false
}
