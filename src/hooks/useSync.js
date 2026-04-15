// P2P sync via Trystero (WebRTC over Nostr relays).
// Ported from many-tapes-calculator. No server needed.

import { useState, useEffect, useRef, useCallback } from 'react'
import { joinRoom } from 'trystero/nostr'

const APP_ID = '18xx-broker-v1'

// Actions that are purely local UI and should not be broadcast
const LOCAL_ONLY = new Set([])

// Silent actions (turn nav) still need to sync but don't log
const ALL_SYNC = true // we sync everything from gameStore

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function getSharedState(game) {
  if (!game) return null
  return {
    titleId: game.title.titleId,
    playerNames: game.originalPlayerNames || game.players.map((p) => p.name),
    userVariant: game.title.activeVariant?.id || null,
    actionLog: game.actionLog.map((e) => e.action),
    createdAt: game.createdAt,
    // Include turn state for immediate sync
    turnQueue: game.turnQueue,
    turnIndex: game.turnIndex,
    srPassed: game.srPassed,
    priorityDeal: game.priorityDeal,
  }
}

const ROOM_KEY = '18xxBroker_room'

function saveRoomInfo(code, isCreator) {
  try { localStorage.setItem(ROOM_KEY, JSON.stringify({ code, isCreator })) } catch {}
}
function loadRoomInfo() {
  try { return JSON.parse(localStorage.getItem(ROOM_KEY)) } catch { return null }
}
function clearRoomInfo() {
  try { localStorage.removeItem(ROOM_KEY) } catch {}
}

export function useSync(gameStore) {
  const [roomId, setRoomId] = useState(null)
  const [peerCount, setPeerCount] = useState(0)
  const [status, setStatus] = useState('disconnected')

  const roomRef = useRef(null)
  const sendActionRef = useRef(null)
  const sendStateRef = useRef(null)
  const sendStateReqRef = useRef(null)
  const stateRef = useRef(null)
  const establishedRef = useRef(false)
  const reconnectRef = useRef(null)
  const heartbeatRef = useRef(null)
  const stateReqTimerRef = useRef(null)

  // Keep stateRef current
  const game = gameStore((s) => s.game)
  const rawDispatch = gameStore((s) => s.dispatch)
  const loadGame = gameStore((s) => s.loadGame)
  stateRef.current = game

  const clearReconnect = useCallback(() => {
    if (reconnectRef.current?.timer) clearTimeout(reconnectRef.current.timer)
    reconnectRef.current = null
  }, [])

  const cleanup = useCallback(() => {
    clearReconnect()
    if (heartbeatRef.current) { clearInterval(heartbeatRef.current); heartbeatRef.current = null }
    if (stateReqTimerRef.current) { clearTimeout(stateReqTimerRef.current); stateReqTimerRef.current = null }
    if (roomRef.current) { roomRef.current.leave(); roomRef.current = null }
    sendActionRef.current = null
    sendStateRef.current = null
    sendStateReqRef.current = null
    establishedRef.current = false
    setPeerCount(0)
    setStatus('disconnected')
    setRoomId(null)
  }, [clearReconnect])

  const connect = useCallback((code, isCreator) => {
    // Clean up existing connection
    if (heartbeatRef.current) { clearInterval(heartbeatRef.current); heartbeatRef.current = null }
    if (stateReqTimerRef.current) { clearTimeout(stateReqTimerRef.current); stateReqTimerRef.current = null }
    if (roomRef.current) { roomRef.current.leave(); roomRef.current = null }
    sendActionRef.current = null
    sendStateRef.current = null
    sendStateReqRef.current = null

    setStatus('connecting')
    setRoomId(code)
    saveRoomInfo(code, isCreator)

    if (isCreator) establishedRef.current = true

    if (!reconnectRef.current || reconnectRef.current.code !== code) {
      clearReconnect()
      reconnectRef.current = { code, isCreator, timer: null, delay: 1000 }
    }

    let room
    try {
      room = joinRoom({ appId: APP_ID }, code)
    } catch {
      scheduleReconnect()
      return
    }
    roomRef.current = room

    const [sendAction, onAction] = room.makeAction('action')
    const [sendState, onState] = room.makeAction('state')
    const [sendPing, onPing] = room.makeAction('ping')
    const [sendStateReq, onStateReq] = room.makeAction('stateReq')

    sendActionRef.current = sendAction
    sendStateRef.current = sendState
    sendStateReqRef.current = sendStateReq

    // Heartbeat
    heartbeatRef.current = setInterval(() => {
      if (Object.keys(room.getPeers()).length > 0) sendPing({ t: Date.now() })
    }, 15000)
    onPing(() => {})

    room.onPeerJoin((peerId) => {
      setPeerCount(Object.keys(room.getPeers()).length)
      setStatus('connected')
      if (reconnectRef.current) reconnectRef.current.delay = 1000

      if (establishedRef.current && stateRef.current) {
        sendState(getSharedState(stateRef.current), peerId)
      } else {
        if (stateReqTimerRef.current) clearTimeout(stateReqTimerRef.current)
        stateReqTimerRef.current = setTimeout(() => {
          stateReqTimerRef.current = null
          if (!establishedRef.current && sendStateReqRef.current) {
            sendStateReqRef.current({})
          }
        }, 5000)
      }
    })

    room.onPeerLeave(() => {
      const count = Object.keys(room.getPeers()).length
      setPeerCount(count)
      if (count === 0) {
        setStatus('connecting')
        scheduleReconnect()
      }
    })

    // Receive individual action from peer
    onAction((action) => {
      rawDispatch(action)
    })

    // Receive full state from peer (on join)
    onState((sharedState) => {
      if (stateReqTimerRef.current) {
        clearTimeout(stateReqTimerRef.current)
        stateReqTimerRef.current = null
      }
      establishedRef.current = true
      // Load the game from the shared state
      loadGame({
        titleId: sharedState.titleId,
        playerNames: sharedState.playerNames,
        userVariant: sharedState.userVariant,
        actionLog: sharedState.actionLog.map((a, i) => ({ id: i, action: a, description: '' })),
        createdAt: sharedState.createdAt,
      })
      // Apply turn state after load
      if (sharedState.turnQueue) {
        rawDispatch({
          type: 'SET_TURN_QUEUE',
          queue: sharedState.turnQueue,
          turnIndex: sharedState.turnIndex ?? 0,
          srPassed: sharedState.srPassed ?? [],
        })
      }
    })

    // Respond to state requests
    onStateReq((_data, peerId) => {
      if (establishedRef.current && stateRef.current) {
        sendState(getSharedState(stateRef.current), peerId)
      }
    })
  }, [rawDispatch, loadGame, clearReconnect])

  function scheduleReconnect() {
    const info = reconnectRef.current
    if (!info || info.timer) return
    info.timer = setTimeout(() => {
      info.timer = null
      info.delay = Math.min(info.delay * 1.5, 30000)
      connect(info.code, info.isCreator)
    }, info.delay)
  }

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup])

  // Auto-rejoin on mount
  useEffect(() => {
    const saved = loadRoomInfo()
    if (saved) {
      if (stateRef.current) establishedRef.current = true
      connect(saved.code, saved.isCreator)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Reconnect on tab visibility
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== 'visible') return
      const info = reconnectRef.current
      if (!info) return
      if (info.timer) { clearTimeout(info.timer); info.timer = null }
      info.delay = 1000
      connect(info.code, info.isCreator)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [connect])

  // When game state appears/changes and we have peers, broadcast full state
  // This handles: creator starts game while peers are waiting
  const prevGameRef = useRef(null)
  useEffect(() => {
    if (game && !prevGameRef.current && sendStateRef.current && establishedRef.current) {
      // Game just appeared — send to all peers
      sendStateRef.current(getSharedState(game))
    }
    prevGameRef.current = game
  }, [game])

  // Sync-aware dispatch: dispatches locally + broadcasts to peers
  const syncDispatch = useCallback((action) => {
    rawDispatch(action)
    if (sendActionRef.current && !LOCAL_ONLY.has(action.type)) {
      sendActionRef.current(action)
    }
  }, [rawDispatch])

  const createRoom = useCallback(() => {
    const code = generateRoomCode()
    connect(code, true)
    return code
  }, [connect])

  const joinRoomByCode = useCallback((code) => {
    connect(code.toUpperCase().trim(), false)
  }, [connect])

  const leaveRoom = useCallback(() => {
    clearRoomInfo()
    cleanup()
  }, [cleanup])

  return {
    syncDispatch,
    roomId,
    peerCount,
    status,
    createRoom,
    joinRoom: joinRoomByCode,
    leaveRoom,
  }
}
