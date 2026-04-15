import { describe, it, expect } from 'vitest'
import { getEventInfo, getTrainEvents } from '../src/engine/events.js'

describe('getEventInfo', () => {
  it('returns known events', () => {
    const info = getEventInfo('close_companies')
    expect(info.label).toBe('Close Private Companies')
    expect(info.desc).toContain('private companies close')
  })

  it('returns fallback for unknown events', () => {
    const info = getEventInfo('something_weird')
    expect(info.label).toBe('Something Weird')
    expect(info.desc).toContain('something_weird')
  })

  it('returns nationalization events', () => {
    const info = getEventInfo('trainless_nationalization')
    expect(info.label).toContain('Nationalization')
    expect(info.prompt).toBe(true)
  })
})

describe('getTrainEvents', () => {
  it('returns events for a train with events', () => {
    const title = {
      trains: [
        { name: '5', distance: 5, price: 450, events: ['close_companies'] },
      ],
    }
    const events = getTrainEvents(title, '5')
    expect(events).toHaveLength(1)
    expect(events[0].label).toBe('Close Private Companies')
  })

  it('returns empty for a train without events', () => {
    const title = {
      trains: [
        { name: '2', distance: 2, price: 80 },
      ],
    }
    expect(getTrainEvents(title, '2')).toEqual([])
  })

  it('returns empty for unknown train', () => {
    const title = { trains: [{ name: '2', price: 80 }] }
    expect(getTrainEvents(title, '99')).toEqual([])
  })
})
