import { useRef } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { formatCurrency } from '../../utils/currency.js'
import { allNetWorths } from '../../engine/rules/netWorth.js'
import { gameEndWarnings } from '../../engine/rules/gameEnd.js'
import { certLimitWarnings } from '../../engine/rules/certLimit.js'
import { currentPhase } from '../../engine/phase.js'
import { exportGame, importGame } from '../../utils/persistence.js'

export default function SummaryTab() {
  const game = useGameStore((s) => s.game)
  const showLog = useUIStore((s) => s.showLog)
  const toggleLog = useUIStore((s) => s.toggleLog)

  if (!game) return null

  const fmt = (n) => formatCurrency(n, game.title.currencyFormat)
  const netWorths = allNetWorths(game)
  const endWarnings = gameEndWarnings(game)
  const certWarnings = certLimitWarnings(game)
  const phase = currentPhase(game.phaseManager)

  const allWarnings = [...endWarnings, ...certWarnings.map((w) => ({
    type: 'cert_limit',
    message: `${w.name} over cert limit: ${w.count}/${w.limit}`,
  }))]

  const bankTotal = typeof game.title.bankCash === 'number'
    ? game.title.bankCash
    : game.title.bankCash[game.playerCount]
  const bankPct = bankTotal ? Math.max(0, Math.round((game.bank.cash / bankTotal) * 100)) : 0

  return (
    <div className="p-3 space-y-4">
      {/* Warnings */}
      {allWarnings.length > 0 && (
        <div className="space-y-1">
          {allWarnings.map((w, i) => (
            <div key={i} className="bg-red-900/30 border border-red-800 rounded px-3 py-2 text-sm text-red-300">
              {w.message}
            </div>
          ))}
        </div>
      )}

      {/* Net Worth */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Net Worth</div>
        <div className="space-y-2">
          {netWorths.map((nw, i) => (
            <div key={nw.playerId} className="flex items-center gap-2">
              <span className="text-broker-text-muted w-5 text-right text-sm">{i + 1}.</span>
              <span className="font-medium flex-1">{nw.name}</span>
              <span className="text-sm text-broker-text-muted">
                {fmt(nw.cash)} + {fmt(nw.shareValue)} + {fmt(nw.privateValue)}
              </span>
              <span className="font-bold text-lg w-20 text-right">{fmt(nw.total)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bank */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-broker-text-muted font-medium uppercase">Bank</span>
          <span className={`font-medium ${game.bank.broken ? 'text-red-400' : 'text-white'}`}>
            {fmt(game.bank.cash)}
          </span>
        </div>
        <div className="w-full bg-broker-surface-hover rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              bankPct < 20 ? 'bg-red-500' : bankPct < 40 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${bankPct}%` }}
          />
        </div>
        <div className="text-xs text-broker-text-muted mt-1">{bankPct}% remaining</div>
      </div>

      {/* Game Info + Download/Upload */}
      <GameInfo game={game} phase={phase} />

      {/* Corps summary */}
      <div className="bg-broker-surface rounded-lg p-3">
        <div className="text-xs text-broker-text-muted mb-2 font-medium uppercase">Corporations</div>
        <div className="space-y-1 text-sm">
          {game.corporations.map((c) => (
            <div key={c.sym} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="font-medium w-12">{c.sym}</span>
              {c.floated ? (
                <>
                  <span className="text-broker-text-muted">{fmt(c.cash)}</span>
                  <span className="text-broker-text-muted">
                    {c.trains.map((t) => t.name).join(', ') || 'no trains'}
                  </span>
                </>
              ) : c.ipoed ? (
                <span className="text-broker-text-muted">IPO'd</span>
              ) : (
                <span className="text-broker-gold-dim">—</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Log + Replay */}
      <ActionLog game={game} showLog={showLog} toggleLog={toggleLog} />
    </div>
  )
}

function GameInfo({ game, phase }) {
  const loadGame = useGameStore((s) => s.loadGame)
  const fileRef = useRef(null)

  function handleDownload() {
    const json = exportGame(game)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${game.title.titleId}_${new Date(game.createdAt).toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = importGame(reader.result)
        loadGame(data)
      } catch (err) {
        console.error('Failed to import game:', err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="bg-broker-surface rounded-lg p-3 text-sm text-broker-text">
      <div>Phase: <span className="font-medium text-white">{phase.name}</span></div>
      <div>Operating Rounds: {phase.operatingRounds}</div>
      <div>Train Limit: {typeof phase.trainLimit === 'number' ? phase.trainLimit : JSON.stringify(phase.trainLimit)}</div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleDownload}
          className="text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-200 px-3 py-1.5 rounded"
        >
          Download Game
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="text-xs bg-broker-surface-hover hover:bg-broker-surface text-broker-text-muted hover:text-white px-3 py-1.5 rounded"
        >
          Load File
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleUpload} className="hidden" />
      </div>
    </div>
  )
}

function ActionLog({ game, showLog, toggleLog }) {
  const fullLog = useGameStore((s) => s.fullLog)
  const enterReplay = useGameStore((s) => s.enterReplay)
  const exitReplay = useGameStore((s) => s.exitReplay)
  const replayTo = useGameStore((s) => s.replayTo)

  const inReplay = fullLog !== null
  const totalActions = inReplay ? fullLog.length : game.actionLog.length
  const currentIdx = game.actionLog.length - 1

  return (
    <div className="bg-broker-surface rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={toggleLog}
          className="text-xs text-broker-text-muted font-medium uppercase"
        >
          Log ({game.actionLog.length}{inReplay ? `/${totalActions}` : ''} actions) {showLog ? '▼' : '▶'}
        </button>
        {!inReplay && game.actionLog.length > 0 && (
          <button
            onClick={enterReplay}
            className="text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-200 px-2 py-1 rounded"
          >
            Replay
          </button>
        )}
        {inReplay && (
          <button
            onClick={exitReplay}
            className="text-xs bg-amber-800 hover:bg-amber-700 text-white px-2 py-1 rounded"
          >
            Exit Replay
          </button>
        )}
      </div>

      {/* Replay controls */}
      {inReplay && (
        <div className="mb-3 space-y-2">
          <input
            type="range"
            min={-1}
            max={totalActions - 1}
            value={currentIdx}
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10)
              if (idx < 0) replayTo(-1)
              else replayTo(idx)
            }}
            className="w-full accent-blue-500"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={() => replayTo(Math.max(-1, currentIdx - 1))}
              disabled={currentIdx < 0}
              className="text-xs px-2 py-1 rounded bg-broker-surface-hover hover:bg-broker-surface disabled:opacity-30 text-white"
            >
              ◀ Prev
            </button>
            <span className="text-xs text-broker-text-muted">
              {currentIdx < 0 ? 'Start' : `Action ${currentIdx + 1} of ${totalActions}`}
            </span>
            <button
              onClick={() => replayTo(Math.min(totalActions - 1, currentIdx + 1))}
              disabled={currentIdx >= totalActions - 1}
              className="text-xs px-2 py-1 rounded bg-broker-surface-hover hover:bg-broker-surface disabled:opacity-30 text-white"
            >
              Next ▶
            </button>
          </div>
        </div>
      )}

      {showLog && (
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {[...game.actionLog].reverse().map((entry, i) => {
            const idx = game.actionLog.length - 1 - i
            return (
              <div
                key={entry.id}
                onClick={() => inReplay && replayTo(idx)}
                className={`text-xs py-0.5 border-t border-broker-border ${
                  inReplay ? 'cursor-pointer hover:text-white' : ''
                } ${inReplay && idx === currentIdx ? 'text-blue-300 font-medium' : 'text-broker-text-muted'}`}
              >
                <span className="text-broker-text-muted opacity-50 mr-1">{idx + 1}.</span>
                {entry.description}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
