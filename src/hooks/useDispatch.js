// Returns syncDispatch (broadcasts to peers) when in a room,
// falls back to raw dispatch when offline.

import { useGameStore } from '../store/gameStore.js'
import { useSyncContext } from './SyncContext.jsx'

export function useDispatch() {
  const rawDispatch = useGameStore((s) => s.dispatch)
  const sync = useSyncContext()
  return sync?.syncDispatch || rawDispatch
}
