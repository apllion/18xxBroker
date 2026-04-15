import { describe, it, expect } from 'vitest'
import { createGame } from '../src/engine/setup.js'
import { applyAction } from '../src/engine/actions.js'
import { getTitle } from '../src/titles/index.js'

function make1830(playerCount = 3) {
  const title = getTitle('g1830')
  return createGame(title, Array.from({ length: playerCount }, (_, i) => `Player${i + 1}`))
}

describe('BUY_PRIVATE', () => {
  it('transfers cash from player to bank and assigns ownership', () => {
    const game = make1830()
    const p = game.players[0]
    const c = game.companies[0] // SV, value 20

    applyAction(game, { type: 'BUY_PRIVATE', playerId: p.id, companySym: 'SV', price: 25 })

    expect(p.cash).toBe(800 - 25)
    expect(game.bank.cash).toBe(12000 - 800 * 3 + 25)
    expect(c.ownerId).toBe(p.id)
    expect(c.ownerType).toBe('player')
    expect(p.privates).toContain('SV')
    expect(game.actionLog).toHaveLength(1)
  })

  it('logs the action with description', () => {
    const game = make1830()
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 })

    expect(game.actionLog[0].description).toContain('Player1')
    expect(game.actionLog[0].description).toContain('SV')
  })
})

describe('PAR_SHARE', () => {
  it('pars a corporation and deducts president share cost', () => {
    const game = make1830()
    const parPrice = 100
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice, row: 0, col: 6 })

    const corp = game.corporations.find((c) => c.sym === 'PRR')
    const player = game.players[0]

    expect(corp.parPrice).toBe(100)
    expect(corp.ipoed).toBe(true)
    expect(corp.ipoShares).toBe(80) // 100 - 20% president
    expect(player.cash).toBe(800 - 200) // 20% of 100 = 200
    expect(player.shares).toHaveLength(1)
    expect(player.shares[0].corpSym).toBe('PRR')
    expect(player.shares[0].isPresident).toBe(true)
  })
})

describe('BUY_SHARE', () => {
  it('buys from IPO', () => {
    const game = make1830()
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })
    applyAction(game, { type: 'BUY_SHARE', playerId: 'p1', corpSym: 'PRR', source: 'ipo' })

    const player1 = game.players[1]
    const corp = game.corporations.find((c) => c.sym === 'PRR')

    expect(player1.shares).toHaveLength(1)
    expect(player1.shares[0].percent).toBe(10)
    expect(corp.ipoShares).toBe(70) // 80 - 10
  })
})

describe('SELL_SHARES', () => {
  it('sells shares to market pool', () => {
    const game = make1830()
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })
    applyAction(game, { type: 'BUY_SHARE', playerId: 'p1', corpSym: 'PRR', source: 'ipo' })

    const before = game.players[1].cash
    applyAction(game, { type: 'SELL_SHARES', playerId: 'p1', corpSym: 'PRR', percent: 10 })

    expect(game.players[1].shares).toHaveLength(0)
    expect(game.players[1].cash).toBeGreaterThan(before)
  })
})

describe('PAY_DIVIDEND', () => {
  it('distributes revenue to shareholders', () => {
    const game = make1830()
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })

    const cashBefore = game.players[0].cash
    applyAction(game, { type: 'PAY_DIVIDEND', corpSym: 'PRR', totalRevenue: 100 })

    // Player0 has 20% → gets 10 * 2 = 20
    expect(game.players[0].cash).toBe(cashBefore + 20)
  })
})

describe('WITHHOLD_DIVIDEND', () => {
  it('sends revenue to corp treasury', () => {
    const game = make1830()
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })

    const corp = game.corporations.find((c) => c.sym === 'PRR')
    const cashBefore = corp.cash
    applyAction(game, { type: 'WITHHOLD_DIVIDEND', corpSym: 'PRR', totalRevenue: 100 })

    expect(corp.cash).toBe(cashBefore + 100)
  })
})

describe('BUY_TRAIN', () => {
  it('buys a train from depot', () => {
    const game = make1830()
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })

    const corp = game.corporations.find((c) => c.sym === 'PRR')
    const cashBefore = corp.cash
    applyAction(game, { type: 'BUY_TRAIN', corpSym: 'PRR', trainName: '2', price: 80 })

    expect(corp.trains).toHaveLength(1)
    expect(corp.trains[0].name).toBe('2')
    expect(corp.cash).toBe(cashBefore - 80)
  })

  it('triggers close_companies event on 5-train', () => {
    const game = make1830()
    applyAction(game, { type: 'PAR_SHARE', playerId: 'p0', corpSym: 'PRR', parPrice: 100, row: 0, col: 6 })
    // Buy all 2s, 3s, 4s to reach 5-train
    const corp = game.corporations.find((c) => c.sym === 'PRR')
    corp.cash = 10000

    for (let i = 0; i < 6; i++) applyAction(game, { type: 'BUY_TRAIN', corpSym: 'PRR', trainName: '2', price: 80 })
    for (let i = 0; i < 5; i++) applyAction(game, { type: 'BUY_TRAIN', corpSym: 'PRR', trainName: '3', price: 180 })
    for (let i = 0; i < 4; i++) applyAction(game, { type: 'BUY_TRAIN', corpSym: 'PRR', trainName: '4', price: 300 })

    // Assign a private first
    applyAction(game, { type: 'BUY_PRIVATE', playerId: 'p0', companySym: 'SV', price: 20 })
    const sv = game.companies.find((c) => c.sym === 'SV')
    expect(sv.ownerId).toBe('p0')

    applyAction(game, { type: 'BUY_TRAIN', corpSym: 'PRR', trainName: '5', price: 450 })

    // Privates should be closed
    expect(sv.closed).toBe(true)
    expect(sv.ownerId).toBeNull()
    expect(game.pendingEvents).toContain('close_companies')
  })
})

describe('SET_PLAYER_ORDER', () => {
  it('reorders the players array', () => {
    const game = make1830()
    expect(game.players[0].name).toBe('Player1')

    applyAction(game, { type: 'SET_PLAYER_ORDER', order: ['p2', 'p0', 'p1'] })

    expect(game.players[0].name).toBe('Player3')
    expect(game.players[1].name).toBe('Player1')
    expect(game.players[2].name).toBe('Player2')
  })
})

describe('SET_PRIORITY', () => {
  it('sets priority deal', () => {
    const game = make1830()
    applyAction(game, { type: 'SET_PRIORITY', playerId: 'p2' })

    expect(game.priorityDeal).toBe('p2')
  })
})

describe('REMOVE_CORPORATION', () => {
  it('removes a corporation from the game', () => {
    const game = make1830()
    expect(game.corporations).toHaveLength(8)

    applyAction(game, { type: 'REMOVE_CORPORATION', corpSym: 'PRR' })

    expect(game.corporations).toHaveLength(7)
    expect(game.corporations.find((c) => c.sym === 'PRR')).toBeUndefined()
  })
})

describe('ADVANCE_ROUND', () => {
  it('advances from pregame to SR1', () => {
    const game = make1830()
    expect(game.roundTracker.inPregame).toBe(true)

    applyAction(game, { type: 'ADVANCE_ROUND' })

    expect(game.roundTracker.inPregame).toBe(false)
    expect(game.roundTracker.type).toBe('stock')
    expect(game.roundTracker.srNumber).toBe(1)
  })

  it('advances from SR to OR', () => {
    const game = make1830()
    applyAction(game, { type: 'ADVANCE_ROUND' }) // pregame → SR1
    applyAction(game, { type: 'ADVANCE_ROUND' }) // SR1 → OR1.1

    expect(game.roundTracker.type).toBe('operating')
    expect(game.roundTracker.orSet).toBe(1)
    expect(game.roundTracker.orInSet).toBe(1)
  })
})

describe('DISMISS_EVENT', () => {
  it('removes a pending event', () => {
    const game = make1830()
    game.pendingEvents = ['close_companies', 'earthquake']

    applyAction(game, { type: 'DISMISS_EVENT', event: 'close_companies' })

    expect(game.pendingEvents).toEqual(['earthquake'])
  })
})
