import { describe, it, expect } from 'vitest'
import { createGame } from '../src/engine/setup.js'
import { applyAction } from '../src/engine/actions.js'
import { getTitle } from '../src/titles/index.js'

// Replay = create fresh game + apply actions from log.
// This is the core mechanism for: undo, load game, sync on join, replay UI.
// These tests verify that replaying a sequence of actions produces identical state.

function make1830(playerCount = 3) {
  const title = getTitle('g1830')
  return createGame(title, Array.from({ length: playerCount }, (_, i) => `P${i + 1}`))
}

function replayFrom(game) {
  const title = getTitle(game.title.titleId)
  const playerNames = game.originalPlayerNames || game.players.map((p) => p.name)
  const userVariant = game.title.activeVariant?.id || null
  const fresh = createGame(title, playerNames, userVariant)
  fresh.createdAt = game.createdAt

  for (const entry of game.actionLog) {
    applyAction(fresh, entry.action)
  }
  return fresh
}

function compareState(a, b) {
  // Compare the meaningful game state (not timestamps/ids in log)
  expect(a.players.map((p) => ({ name: p.name, cash: p.cash, shares: p.shares, privates: p.privates })))
    .toEqual(b.players.map((p) => ({ name: p.name, cash: p.cash, shares: p.shares, privates: p.privates })))
  expect(a.bank.cash).toBe(b.bank.cash)
  expect(a.corporations.map((c) => ({ sym: c.sym, cash: c.cash, parPrice: c.parPrice, ipoed: c.ipoed, floated: c.floated, ipoShares: c.ipoShares, trains: c.trains.map((t) => t.name) })))
    .toEqual(b.corporations.map((c) => ({ sym: c.sym, cash: c.cash, parPrice: c.parPrice, ipoed: c.ipoed, floated: c.floated, ipoShares: c.ipoShares, trains: c.trains.map((t) => t.name) })))
  expect(a.companies.map((c) => ({ sym: c.sym, ownerId: c.ownerId, closed: c.closed })))
    .toEqual(b.companies.map((c) => ({ sym: c.sym, ownerId: c.ownerId, closed: c.closed })))
  expect(a.roundTracker.type).toBe(b.roundTracker.type)
  expect(a.roundTracker.srNumber).toBe(b.roundTracker.srNumber)
  expect(a.roundTracker.inPregame).toBe(b.roundTracker.inPregame)
  expect(a.priorityDeal).toBe(b.priorityDeal)
  expect(a.actionLog.length).toBe(b.actionLog.length)
}

describe('replay from action log', () => {
  it('replays an empty game', () => {
    const game = make1830()
    const replayed = replayFrom(game)
    compareState(game, replayed)
  })

  it('replays private purchases', () => {
    const game = make1830()
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 })
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p1', companySym: 'CS', price: 40 })
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p2', companySym: 'DH', price: 70 })

    const replayed = replayFrom(game)
    compareState(game, replayed)
  })

  it('replays a full sequence: auction → SR → par → buy shares', () => {
    const game = make1830()

    // Pregame purchases
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 })
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p1', companySym: 'CS', price: 40 })

    // Advance to SR1
    applyAction(game, { type: 'ADVANCE_ROUND' })

    // Par PRR
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })

    // Buy shares
    applyAction(game, { type: 'BUY_SHARE', playerId: 'p1', corpSym: 'PRR', source: 'ipo' })
    applyAction(game, { type: 'BUY_SHARE', playerId: 'p2', corpSym: 'PRR', source: 'ipo' })

    // Advance to OR
    applyAction(game, { type: 'ADVANCE_ROUND' })

    const replayed = replayFrom(game)
    compareState(game, replayed)
  })

  it('replays player order changes', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_PLAYER_ORDER', order: ['p2', 'p0', 'p1'] })
    applyAction(game, { type: 'SET_PRIORITY', playerId: 'p1' })

    const replayed = replayFrom(game)
    expect(replayed.players[0].name).toBe('P3')
    expect(replayed.priorityDeal).toBe('p1')
    compareState(game, replayed)
  })

  it('replays corporation removal', () => {
    const game = make1830()
    applyAction(game, { type: 'REMOVE_CORPORATION', corpSym: 'B&M' })

    const replayed = replayFrom(game)
    expect(replayed.corporations).toHaveLength(7)
    expect(replayed.corporations.find((c) => c.sym === 'B&M')).toBeUndefined()
    compareState(game, replayed)
  })

  it('replays dividends and withhold', () => {
    const game = make1830()
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })
    applyAction(game, { type: 'PAY_DIVIDEND', corpSym: 'PRR', totalRevenue: 80 })
    applyAction(game, { type: 'WITHHOLD_DIVIDEND', corpSym: 'PRR', totalRevenue: 60 })

    const replayed = replayFrom(game)
    compareState(game, replayed)
  })

  it('replays train purchases', () => {
    const game = make1830()
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })
    const corp = game.corporations.find((c) => c.sym === 'PRR')
    corp.cash = 5000 // cheat cash for testing

    applyAction(game, { type: 'BUY_TRAIN', corpSym: 'PRR', trainName: '2', price: 80 })
    applyAction(game, { type: 'BUY_TRAIN', corpSym: 'PRR', trainName: '2', price: 80 })

    // Replay can't cheat cash — but the action log captures what happened
    // The replayed game will have different corp cash since we cheated.
    // This test verifies the action log structure is replayable.
    const replayed = replayFrom(game)
    expect(replayed.actionLog.length).toBe(game.actionLog.length)
  })
})

describe('undo via replay', () => {
  it('undo removes the last action', () => {
    const game = make1830()
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 })
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p1', companySym: 'CS', price: 45 })

    // "Undo" = replay all but last
    const title = getTitle('g1830')
    const undone = createGame(title, ['P1', 'P2', 'P3'])
    undone.createdAt = game.createdAt
    const actions = game.actionLog.slice(0, -1).map((e) => e.action)
    for (const a of actions) applyAction(undone, a)

    expect(undone.actionLog).toHaveLength(1)
    expect(undone.companies.find((c) => c.sym === 'CS').ownerId).toBeNull()
    expect(undone.players[1].cash).toBe(800) // CS purchase undone
    expect(undone.companies.find((c) => c.sym === 'SV').ownerId).toBe('p0') // SV still bought
  })
})

describe('sync: applying remote actions', () => {
  it('two games applying the same actions reach the same state', () => {
    const game1 = make1830()
    const game2 = make1830()
    game2.createdAt = game1.createdAt

    const actions = [
      { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 },
      { type: 'BUY_PRIVATE', playerId: 'p1', companySym: 'CS', price: 40 },
      { type: 'ADVANCE_ROUND' },
      { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 },
      { type: 'BUY_SHARE', playerId: 'p1', corpSym: 'PRR', source: 'ipo' },
      { type: 'SET_PRIORITY', playerId: 'p1' },
    ]

    for (const a of actions) {
      applyAction(game1, a)
      applyAction(game2, a)
    }

    compareState(game1, game2)
  })

  it('action applied to game1 can be sent to game2 and produce same result', () => {
    const game1 = make1830()
    const game2 = make1830()
    game2.createdAt = game1.createdAt

    // Game1 acts, "sends" the action
    const action = { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 25 }
    applyAction(game1, action)

    // Game2 "receives" and applies the same action
    applyAction(game2, action)

    compareState(game1, game2)
  })
})

describe('partial replay for replay UI', () => {
  it('can rebuild state at any point in the action log', () => {
    const game = make1830()
    const actions = [
      { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 },
      { type: 'BUY_PRIVATE', playerId: 'p1', companySym: 'CS', price: 40 },
      { type: 'BUY_PRIVATE', playerId: 'p2', companySym: 'DH', price: 70 },
      { type: 'ADVANCE_ROUND' },
    ]
    for (const a of actions) applyAction(game, a)

    // Replay to action 2 (after SV and CS bought, before DH)
    const title = getTitle('g1830')
    const partial = createGame(title, ['P1', 'P2', 'P3'])
    for (const a of actions.slice(0, 2)) applyAction(partial, a)

    expect(partial.actionLog).toHaveLength(2)
    expect(partial.companies.find((c) => c.sym === 'SV').ownerId).toBe('p0')
    expect(partial.companies.find((c) => c.sym === 'CS').ownerId).toBe('p1')
    expect(partial.companies.find((c) => c.sym === 'DH').ownerId).toBeNull()
    expect(partial.roundTracker.inPregame).toBe(true)
  })
})
