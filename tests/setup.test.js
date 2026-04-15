import { describe, it, expect } from 'vitest'
import { createGame } from '../src/engine/setup.js'
import { getTitle } from '../src/titles/index.js'

describe('createGame', () => {
  it('creates a valid 1830 game with 3 players', () => {
    const title = getTitle('g1830')
    const game = createGame(title, ['Alice', 'Bob', 'Charlie'])

    expect(game.players).toHaveLength(3)
    expect(game.players[0].name).toBe('Alice')
    expect(game.players[0].cash).toBe(800) // 3p starting cash
    expect(game.bank.cash).toBe(12000 - 800 * 3)
    expect(game.corporations).toHaveLength(8)
    expect(game.companies).toHaveLength(6)
    expect(game.actionLog).toHaveLength(0)
    expect(game.playerOrder).toEqual(['p0', 'p1', 'p2'])
    expect(game.priorityDeal).toBe('p0')
    expect(game.pendingEvents).toEqual([])
  })

  it('creates a valid 1846 game with 4 players', () => {
    const title = getTitle('g1846')
    const game = createGame(title, ['A', 'B', 'C', 'D'])

    expect(game.players).toHaveLength(4)
    expect(game.players[0].cash).toBe(400)
    expect(game.title.capitalization).toBe('incremental')
    expect(game.title.floatPercent).toBe(20)
  })

  it('sets up pregame round tracker', () => {
    const title = getTitle('g1830')
    const game = createGame(title, ['A', 'B'])

    expect(game.roundTracker.inPregame).toBe(true)
    expect(game.roundTracker.pregameSteps).toHaveLength(1)
    expect(game.roundTracker.pregameSteps[0].type).toBe('waterfall')
  })

  it('creates game with no pregame for titles without auction', () => {
    const title = getTitle('g18usa')
    const game = createGame(title, ['A', 'B'])

    expect(game.roundTracker.inPregame).toBe(false)
    expect(game.roundTracker.pregameSteps).toHaveLength(0)
  })

  it('resolves nested cert limits (1846)', () => {
    const title = getTitle('g1846')
    const game = createGame(title, ['A', 'B'])

    expect(typeof game.certLimit).toBe('number')
  })
})
