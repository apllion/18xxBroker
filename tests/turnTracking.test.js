import { describe, it, expect } from 'vitest'
import { createGame } from '../src/engine/setup.js'
import { applyAction } from '../src/engine/actions.js'
import { getTitle } from '../src/titles/index.js'

function make1830(n = 3) {
  const title = getTitle('g1830')
  return createGame(title, Array.from({ length: n }, (_, i) => `P${i + 1}`))
}

describe('SET_TURN_QUEUE', () => {
  it('sets the turn queue and resets index and passes', () => {
    const game = make1830()
    game.turnIndex = 2
    game.srPassed = ['p0']

    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p2', 'p0', 'p1'] })

    expect(game.turnQueue).toEqual(['p2', 'p0', 'p1'])
    expect(game.turnIndex).toBe(0)
    expect(game.srPassed).toEqual([])
  })

  it('is a silent action (not logged)', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })

    expect(game.actionLog).toHaveLength(0)
  })
})

describe('NEXT_TURN', () => {
  it('advances to the next player', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })

    applyAction(game, { type: 'NEXT_TURN' })
    expect(game.turnIndex).toBe(1)

    applyAction(game, { type: 'NEXT_TURN' })
    expect(game.turnIndex).toBe(2)

    applyAction(game, { type: 'NEXT_TURN' })
    expect(game.turnIndex).toBe(0) // wraps
  })

  it('skips passed players', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })
    game.srPassed = ['p1']

    applyAction(game, { type: 'NEXT_TURN' })
    expect(game.turnIndex).toBe(2) // skipped p1
  })

  it('is a silent action', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1'] })
    applyAction(game, { type: 'NEXT_TURN' })

    expect(game.actionLog).toHaveLength(0)
  })
})

describe('PREV_TURN', () => {
  it('goes back to previous player', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })
    game.turnIndex = 2

    applyAction(game, { type: 'PREV_TURN' })
    expect(game.turnIndex).toBe(1)
  })

  it('wraps to end from 0', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })

    applyAction(game, { type: 'PREV_TURN' })
    expect(game.turnIndex).toBe(2)
  })
})

describe('SR_PASS', () => {
  it('adds player to passed list and advances turn', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })

    applyAction(game, { type: 'SR_PASS', playerId: 'p0' })

    expect(game.srPassed).toContain('p0')
    expect(game.turnIndex).toBe(1) // advanced to p1
  })

  it('skips passed players when finding next', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })

    applyAction(game, { type: 'SR_PASS', playerId: 'p0' })
    applyAction(game, { type: 'SR_PASS', playerId: 'p1' })

    expect(game.srPassed).toEqual(['p0', 'p1'])
    expect(game.turnIndex).toBe(2) // only p2 left
  })

  it('does not duplicate a passed player', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1'] })

    applyAction(game, { type: 'SR_PASS', playerId: 'p0' })
    applyAction(game, { type: 'SR_PASS', playerId: 'p0' })

    expect(game.srPassed).toEqual(['p0'])
  })
})

describe('SR_ACTED', () => {
  it('clears all passes and advances turn', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })
    game.srPassed = ['p1', 'p2']
    game.turnIndex = 0

    applyAction(game, { type: 'SR_ACTED' })

    expect(game.srPassed).toEqual([])
    expect(game.turnIndex).toBe(1)
  })
})

describe('turn tracking syncs across replays', () => {
  it('two games with same turn actions reach same state', () => {
    const game1 = make1830()
    const game2 = make1830()

    const actions = [
      { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] },
      { type: 'NEXT_TURN' },
      { type: 'SR_PASS', playerId: 'p1' },
      { type: 'NEXT_TURN' },
      { type: 'SR_ACTED' },
    ]

    for (const a of actions) {
      applyAction(game1, a)
      applyAction(game2, a)
    }

    expect(game1.turnQueue).toEqual(game2.turnQueue)
    expect(game1.turnIndex).toBe(game2.turnIndex)
    expect(game1.srPassed).toEqual(game2.srPassed)
  })
})

describe('edge cases', () => {
  it('NEXT_TURN does nothing on empty queue', () => {
    const game = make1830()
    expect(game.turnQueue).toEqual([])
    applyAction(game, { type: 'NEXT_TURN' })
    expect(game.turnIndex).toBe(0)
  })

  it('SR_ACTED on empty queue does not crash', () => {
    const game = make1830()
    applyAction(game, { type: 'SR_ACTED' })
    expect(game.srPassed).toEqual([])
    expect(game.turnIndex).toBe(0)
  })

  it('all players passing wraps turn index', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })
    applyAction(game, { type: 'SR_PASS', playerId: 'p0' })
    applyAction(game, { type: 'SR_PASS', playerId: 'p1' })
    applyAction(game, { type: 'SR_PASS', playerId: 'p2' })
    // All passed — turnIndex should still be a valid number (no infinite loop)
    expect(game.turnIndex).toBeGreaterThanOrEqual(0)
    expect(game.turnIndex).toBeLessThan(3)
  })
})

describe('REORDER_BY_CASH', () => {
  it('reorders players by most cash (desc)', () => {
    const game = make1830()
    // Give p2 more cash
    game.players[2].cash = 9999

    applyAction(game, { type: 'REORDER_BY_CASH', direction: 'desc' })

    expect(game.players[0].name).toBe('P3')
    expect(game.players[0].cash).toBe(9999)
    expect(game.priorityDeal).toBe('p2')
  })

  it('reorders players by least cash (asc)', () => {
    const game = make1830()
    game.players[0].cash = 9999

    applyAction(game, { type: 'REORDER_BY_CASH', direction: 'asc' })

    expect(game.players[0].name).not.toBe('P1') // P1 had most cash, should be last
    expect(game.players[2].name).toBe('P1')
  })
})
