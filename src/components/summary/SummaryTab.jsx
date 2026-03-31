import { useGameStore } from '../../store/gameStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { formatCurrency } from '../../utils/currency.js'
import { allNetWorths } from '../../engine/rules/netWorth.js'
import { gameEndWarnings } from '../../engine/rules/gameEnd.js'
import { certLimitWarnings } from '../../engine/rules/certLimit.js'
import { currentPhase } from '../../engine/phase.js'

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

      {/* Game Info */}
      <div className="bg-broker-surface rounded-lg p-3 text-sm text-broker-text">
        <div>Phase: <span className="font-medium text-white">{phase.name}</span></div>
        <div>Operating Rounds: {phase.operatingRounds}</div>
        <div>Train Limit: {typeof phase.trainLimit === 'number' ? phase.trainLimit : JSON.stringify(phase.trainLimit)}</div>
      </div>

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

      {/* Action Log */}
      <div className="bg-broker-surface rounded-lg p-3">
        <button
          onClick={toggleLog}
          className="text-xs text-broker-text-muted font-medium uppercase mb-2 w-full text-left"
        >
          Log ({game.actionLog.length} actions) {showLog ? '▼' : '▶'}
        </button>
        {showLog && (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {[...game.actionLog].reverse().map((entry) => (
              <div key={entry.id} className="text-xs text-broker-text-muted py-0.5 border-t border-broker-border">
                {entry.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
