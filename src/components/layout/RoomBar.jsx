import { useState } from 'react'

export default function RoomBar({ roomId, peerCount, status, createRoom, joinRoom, leaveRoom }) {
  const [joinCode, setJoinCode] = useState('')
  const [showJoin, setShowJoin] = useState(false)

  if (roomId) {
    return (
      <div className="bg-broker-surface border-b border-broker-border px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            status === 'connected' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'
          }`} />
          <span className="text-broker-text-muted">Room</span>
          <span className="font-mono font-bold text-white tracking-wider">{roomId}</span>
          <span className="text-broker-text-muted">
            {peerCount > 0 ? `${peerCount + 1} devices` : 'waiting...'}
          </span>
        </div>
        <button
          onClick={leaveRoom}
          className="text-broker-text-muted hover:text-red-300 px-2"
        >
          Leave
        </button>
      </div>
    )
  }

  return (
    <div className="bg-broker-surface border-b border-broker-border px-3 py-1.5 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-broker-text-muted opacity-40" />
        <span className="text-broker-text-muted">Offline</span>
      </div>
      <div className="flex items-center gap-1">
        {showJoin ? (
          <>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="CODE"
              maxLength={6}
              className="w-20 bg-broker-bg border border-broker-border rounded px-2 py-0.5 text-xs text-white font-mono tracking-wider placeholder-broker-text-muted"
              autoFocus
            />
            <button
              onClick={() => { if (joinCode.trim().length >= 4) { joinRoom(joinCode); setShowJoin(false) } }}
              disabled={joinCode.trim().length < 4}
              className="bg-blue-800 hover:bg-blue-700 text-white px-2 py-0.5 rounded disabled:opacity-40"
            >
              Join
            </button>
            <button
              onClick={() => setShowJoin(false)}
              className="text-broker-text-muted hover:text-white px-1"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={createRoom}
              className="bg-broker-green hover:bg-broker-green-light text-broker-gold px-2 py-0.5 rounded"
            >
              Create Room
            </button>
            <button
              onClick={() => setShowJoin(true)}
              className="bg-broker-surface-hover hover:bg-broker-surface text-broker-text-muted hover:text-white px-2 py-0.5 rounded"
            >
              Join
            </button>
          </>
        )}
      </div>
    </div>
  )
}
