import { describe, it, expect } from 'vitest'
import { createRoundTracker, roundLabel, advanceRound, currentPregameStep } from '../src/engine/roundTracker.js'
import { createPhaseManager } from '../src/engine/phase.js'

const phases1830 = [
  { name: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
  { name: '3', on: '3', trainLimit: 4, tiles: ['yellow', 'green'], operatingRounds: 2 },
]

function makeTracker(pregameSteps = []) {
  return createRoundTracker({ roundSequence: null }, pregameSteps)
}

describe('roundTracker', () => {
  it('starts in pregame when steps exist', () => {
    const rt = makeTracker([{ id: 'auction', label: 'Private Auction', type: 'waterfall' }])
    expect(rt.inPregame).toBe(true)
    expect(rt.pregameIndex).toBe(0)
    expect(roundLabel(rt)).toBe('Private Auction')
  })

  it('starts in SR1 when no pregame steps', () => {
    const rt = makeTracker([])
    expect(rt.inPregame).toBe(false)
    expect(rt.type).toBe('stock')
    expect(roundLabel(rt)).toBe('SR 1')
  })

  it('advances from pregame to SR1', () => {
    const rt = makeTracker([{ id: 'auction', label: 'Auction', type: 'waterfall' }])
    const pm = createPhaseManager(phases1830)
    advanceRound(rt, pm)

    expect(rt.inPregame).toBe(false)
    expect(rt.type).toBe('stock')
    expect(rt.srNumber).toBe(1)
    expect(roundLabel(rt)).toBe('SR 1')
  })

  it('advances SR → OR → SR correctly in phase 2 (1 OR)', () => {
    const rt = makeTracker([])
    const pm = createPhaseManager(phases1830) // Phase 2: 1 OR

    expect(roundLabel(rt)).toBe('SR 1')

    advanceRound(rt, pm) // SR1 → OR1.1
    expect(rt.type).toBe('operating')
    expect(roundLabel(rt)).toBe('OR 1.1')

    advanceRound(rt, pm) // OR1.1 → SR2 (only 1 OR in phase 2)
    expect(rt.type).toBe('stock')
    expect(rt.srNumber).toBe(2)
  })

  it('handles multiple ORs per set in later phases', () => {
    const rt = makeTracker([])
    const pm = createPhaseManager(phases1830)
    pm.currentIndex = 1 // Phase 3: 2 ORs

    advanceRound(rt, pm) // SR1 → OR1.1
    expect(roundLabel(rt)).toBe('OR 1.1')

    advanceRound(rt, pm) // OR1.1 → OR1.2
    expect(roundLabel(rt)).toBe('OR 1.2')

    advanceRound(rt, pm) // OR1.2 → SR2
    expect(rt.type).toBe('stock')
    expect(rt.srNumber).toBe(2)
  })

  it('currentPregameStep returns the step during pregame', () => {
    const step = { id: 'auction', label: 'Auction', type: 'waterfall' }
    const rt = makeTracker([step])

    expect(currentPregameStep(rt)).toEqual(step)

    const pm = createPhaseManager(phases1830)
    advanceRound(rt, pm)
    expect(currentPregameStep(rt)).toBeNull()
  })

  it('sets round guidance on advance', () => {
    const rt = makeTracker([])
    const pm = createPhaseManager(phases1830)

    expect(rt.roundGuidance).toBeUndefined() // initial SR1 has no guidance set yet

    advanceRound(rt, pm) // → OR
    expect(rt.roundGuidance).toContain('Operating Round')

    advanceRound(rt, pm) // → SR2
    expect(rt.roundGuidance).toContain('Stock Round')
  })
})

describe('fixed sequence', () => {
  it('follows a fixed round sequence', () => {
    const rt = createRoundTracker({
      roundSequence: ['SR1', 'OR1', 'OR2', 'SR2', 'OR3'],
    }, [])

    const pm = createPhaseManager(phases1830)

    expect(roundLabel(rt)).toBe('SR1') // fixed sequence returns raw entry
    advanceRound(rt, pm)
    expect(roundLabel(rt)).toBe('OR1')
    advanceRound(rt, pm)
    expect(roundLabel(rt)).toBe('OR2')
    advanceRound(rt, pm)
    expect(roundLabel(rt)).toBe('SR2')
  })
})
