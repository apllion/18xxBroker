import { describe, it, expect } from 'vitest'
import { createGame } from '../src/engine/setup.js'
import { applyAction } from '../src/engine/actions.js'
import { getTitle } from '../src/titles/index.js'

// These tests simulate the multi-player sync scenario:
// - Device A creates a game and plays actions
// - Device B receives the action log and replays it
// - Both must reach identical state
// This is the core guarantee that P2P sync relies on.

function make1830(n = 3) {
  const title = getTitle('g1830')
  return createGame(title, Array.from({ length: n }, (_, i) => `P${i + 1}`))
}

function replayActions(game, actions) {
  const title = getTitle(game.title.titleId)
  const fresh = createGame(title, game.originalPlayerNames)
  fresh.createdAt = game.createdAt
  for (const a of actions) applyAction(fresh, a)
  return fresh
}

describe('sync: full game simulation', () => {
  it('device B joining mid-game via action log replay matches device A', () => {
    // Device A plays a full sequence
    const gameA = make1830()

    const actions = [
      // Auction
      { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 },
      { type: 'BUY_PRIVATE', playerId: 'p1', companySym: 'CS', price: 40 },
      { type: 'BUY_PRIVATE', playerId: 'p2', companySym: 'DH', price: 70 },
      // Advance to SR1
      { type: 'ADVANCE_ROUND' },
      // Set turn queue
      { type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] },
      // Player order
      { type: 'SET_PRIORITY', playerId: 'p0' },
      // Par
      { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 },
      // SR actions
      { type: 'SR_ACTED' },
      { type: 'BUY_SHARE', playerId: 'p1', corpSym: 'PRR', source: 'ipo' },
      { type: 'SR_ACTED' },
      { type: 'SR_PASS', playerId: 'p2' },
      { type: 'NEXT_TURN' },
      // Advance to OR
      { type: 'ADVANCE_ROUND' },
      { type: 'SET_TURN_QUEUE', queue: ['PRR'] },
    ]

    for (const a of actions) applyAction(gameA, a)

    // Device B receives the action log and replays
    const loggedActions = gameA.actionLog.map((e) => e.action)
    const gameB = replayActions(gameA, loggedActions)

    // Logged actions (silent ones excluded)
    expect(gameB.actionLog.length).toBe(gameA.actionLog.length)

    // Game state must match
    expect(gameB.players.map((p) => p.cash)).toEqual(gameA.players.map((p) => p.cash))
    expect(gameB.players.map((p) => p.name)).toEqual(gameA.players.map((p) => p.name))
    expect(gameB.bank.cash).toBe(gameA.bank.cash)
    expect(gameB.priorityDeal).toBe(gameA.priorityDeal)
    expect(gameB.roundTracker.type).toBe(gameA.roundTracker.type)

    // Corp state
    const prrA = gameA.corporations.find((c) => c.sym === 'PRR')
    const prrB = gameB.corporations.find((c) => c.sym === 'PRR')
    expect(prrB.parPrice).toBe(prrA.parPrice)
    expect(prrB.ipoed).toBe(prrA.ipoed)
    expect(prrB.ipoShares).toBe(prrA.ipoShares)
  })

  it('incremental actions applied to both games keep state in sync', () => {
    const gameA = make1830()
    const gameB = make1830()
    gameB.createdAt = gameA.createdAt

    // Simulate: A dispatches, action is broadcast to B, B applies
    function syncAction(action) {
      applyAction(gameA, action)
      applyAction(gameB, action)
    }

    syncAction({ type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 25 })
    syncAction({ type: 'BUY_PRIVATE', playerId: 'p1', companySym: 'CS', price: 40 })
    syncAction({ type: 'SET_PLAYER_ORDER', order: ['p1', 'p0', 'p2'] })
    syncAction({ type: 'ADVANCE_ROUND' })
    syncAction({ type: 'SET_TURN_QUEUE', queue: ['p1', 'p0', 'p2'] })
    syncAction({ type: 'PAR_SHARE', playerId: 'p1', corpSym: 'NYC', parPrice: 82, row: 0, col: 4 })
    syncAction({ type: 'SR_ACTED' })
    syncAction({ type: 'SR_PASS', playerId: 'p0' })
    syncAction({ type: 'SET_PRIORITY', playerId: 'p0' })

    // Verify all state matches
    expect(gameA.players.map((p) => ({ n: p.name, c: p.cash })))
      .toEqual(gameB.players.map((p) => ({ n: p.name, c: p.cash })))
    expect(gameA.bank.cash).toBe(gameB.bank.cash)
    expect(gameA.priorityDeal).toBe(gameB.priorityDeal)
    expect(gameA.turnQueue).toEqual(gameB.turnQueue)
    expect(gameA.turnIndex).toBe(gameB.turnIndex)
    expect(gameA.srPassed).toEqual(gameB.srPassed)
    expect(gameA.actionLog.length).toBe(gameB.actionLog.length)
  })

  it('silent actions (turn nav) are deterministic but not logged', () => {
    const gameA = make1830()
    const gameB = make1830()

    function syncAction(action) {
      applyAction(gameA, action)
      applyAction(gameB, action)
    }

    syncAction({ type: 'SET_TURN_QUEUE', queue: ['p0', 'p1', 'p2'] })
    syncAction({ type: 'NEXT_TURN' })
    syncAction({ type: 'NEXT_TURN' })
    syncAction({ type: 'SR_PASS', playerId: 'p2' })
    syncAction({ type: 'PREV_TURN' })

    // Turn state must match
    expect(gameA.turnIndex).toBe(gameB.turnIndex)
    expect(gameA.srPassed).toEqual(gameB.srPassed)

    // None of these should be in the action log
    expect(gameA.actionLog).toHaveLength(0)
    expect(gameB.actionLog).toHaveLength(0)
  })
})

describe('sync: originalPlayerNames survives reorder', () => {
  it('replaying after SET_PLAYER_ORDER uses original names', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_PLAYER_ORDER', order: ['p2', 'p0', 'p1'] })
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 })

    // Simulate B joining: receives action log
    const loggedActions = game.actionLog.map((e) => e.action)
    const gameB = replayActions(game, loggedActions)

    // Players should be in reordered state
    expect(gameB.players[0].name).toBe('P3')
    // Original names preserved for future replays
    expect(gameB.originalPlayerNames).toEqual(['P1', 'P2', 'P3'])
  })
})
