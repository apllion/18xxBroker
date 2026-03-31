import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTitle } from '../../titles/index.js'
import { useGameStore } from '../../store/gameStore.js'
import { formatCurrency } from '../../utils/currency.js'
import { getSelectableVariants, getAutoVariants } from '../../engine/variants.js'

export default function PlayerSetup() {
  const { titleId } = useParams()
  const navigate = useNavigate()
  const startGame = useGameStore((s) => s.startGame)

  const title = getTitle(titleId)
  const [playerNames, setPlayerNames] = useState(['', ''])
  const [selectedVariant, setSelectedVariant] = useState(null)

  const playerCount = playerNames.filter((n) => n.trim()).length
  const startingCash = title.startingCash[playerCount] || title.startingCash[title.minPlayers]
  const certLimit = typeof title.certLimit === 'object'
    ? title.certLimit[playerCount]
    : title.certLimit
  const bankCash = typeof title.bankCash === 'number'
    ? title.bankCash
    : (title.bankCash[playerCount] || Object.values(title.bankCash)[0])

  const canStart = playerCount >= title.minPlayers && playerCount <= title.maxPlayers
  const fmt = (n) => formatCurrency(n, title.currencyFormat)

  // Variants
  const selectableVariants = getSelectableVariants(title)
  const autoVariants = canStart ? getAutoVariants(title, playerCount) : []

  function addPlayer() {
    if (playerNames.length < title.maxPlayers) {
      setPlayerNames([...playerNames, ''])
    }
  }

  function removePlayer(idx) {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== idx))
    }
  }

  function updateName(idx, name) {
    const updated = [...playerNames]
    updated[idx] = name
    setPlayerNames(updated)
  }

  function handleStart() {
    const names = playerNames.filter((n) => n.trim()).map((n) => n.trim())
    if (names.length < title.minPlayers) return
    startGame(titleId, names, selectedVariant)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <button
        onClick={() => navigate('/')}
        className="self-start text-broker-text-muted hover:text-broker-gold mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-1">{title.title}</h1>
      <p className="text-broker-text-muted mb-6">{title.subtitle}</p>

      <div className="w-full max-w-md space-y-3">
        {playerNames.map((name, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => updateName(idx, e.target.value)}
              placeholder={`Player ${idx + 1}`}
              className="flex-1 bg-broker-surface border border-broker-border rounded px-3 py-2 text-white placeholder-broker-text-muted focus:outline-none focus:border-gray-500"
            />
            {playerNames.length > 2 && (
              <button
                onClick={() => removePlayer(idx)}
                className="text-broker-text-muted hover:text-red-400 px-2"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {playerNames.length < title.maxPlayers && (
          <button
            onClick={addPlayer}
            className="w-full border border-dashed border-broker-border rounded py-2 text-broker-text-muted hover:text-broker-gold hover:border-broker-gold-dim"
          >
            + Add player
          </button>
        )}
      </div>

      {/* Auto-applied variants */}
      {autoVariants.length > 0 && (
        <div className="w-full max-w-md mt-4 space-y-1">
          {autoVariants.map((v) => (
            <div key={v.id} className="bg-broker-green/30 border border-blue-800 rounded px-3 py-2 text-sm text-broker-gold">
              <span className="font-medium">{v.label}</span>
              {v.desc && <span className="text-blue-400 ml-1">— {v.desc}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Selectable variants */}
      {selectableVariants.length > 0 && (
        <div className="w-full max-w-md mt-4">
          <div className="text-xs text-broker-text-muted font-medium uppercase mb-2">Optional Variants</div>
          <div className="space-y-1">
            {selectableVariants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(selectedVariant === v.id ? null : v.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm border transition-colors ${
                  selectedVariant === v.id
                    ? 'bg-broker-green border-broker-gold text-white'
                    : 'bg-broker-surface border-broker-border text-broker-text hover:border-broker-gold-dim'
                }`}
              >
                <div className="font-medium">{v.label}</div>
                {v.desc && <div className="text-xs text-broker-text-muted mt-0.5">{v.desc}</div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {canStart && (
        <div className="mt-6 text-sm text-broker-text-muted space-y-1">
          <div>Starting cash: {fmt(startingCash)} each</div>
          <div>Bank: {fmt(bankCash)}</div>
          <div>Cert limit: {typeof certLimit === 'number' ? certLimit : '—'}</div>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={!canStart}
        className="mt-8 bg-broker-green-light hover:bg-broker-green disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-lg text-lg transition-colors"
      >
        Start Game
      </button>
    </div>
  )
}
