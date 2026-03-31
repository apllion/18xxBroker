// Variants — apply player-count or user-selected overrides to a title.
// A title defines `variants: { variantId: { ...overrides } }`.
// Variants can be auto-selected (by player count) or user-chosen.

// Resolve which variant applies and return a merged title.
// autoVariants: matched by playerCount condition
// userVariant: explicitly selected by user (e.g., "Off the Rails", "TRG", "HSB")
export function resolveTitle(baseTitle, playerCount, userVariant = null) {
  if (!baseTitle.variants) return { ...baseTitle, activeVariant: null }

  let variant = null
  let variantId = null

  // 1. User-selected variant takes priority
  if (userVariant && baseTitle.variants[userVariant]) {
    variant = baseTitle.variants[userVariant]
    variantId = userVariant
  }

  // 2. Auto-select by player count
  if (!variant) {
    for (const [id, v] of Object.entries(baseTitle.variants)) {
      if (v.autoForPlayers && v.autoForPlayers.includes(playerCount)) {
        variant = v
        variantId = id
        break
      }
    }
  }

  if (!variant) return { ...baseTitle, activeVariant: null }

  // Deep merge: variant overrides base, arrays replace (don't merge)
  const merged = { ...baseTitle }

  for (const [key, value] of Object.entries(variant)) {
    if (key === 'autoForPlayers' || key === 'label' || key === 'desc') continue

    if (Array.isArray(value)) {
      // Arrays replace entirely
      merged[key] = value
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Objects merge shallowly
      merged[key] = { ...baseTitle[key], ...value }
    } else {
      // Scalars replace
      merged[key] = value
    }
  }

  merged.activeVariant = {
    id: variantId,
    label: variant.label || variantId,
    desc: variant.desc || '',
  }

  return merged
}

// Get list of user-selectable variants for a title
export function getSelectableVariants(title) {
  if (!title.variants) return []
  return Object.entries(title.variants)
    .filter(([, v]) => !v.autoForPlayers) // Only manually selectable
    .map(([id, v]) => ({
      id,
      label: v.label || id,
      desc: v.desc || '',
    }))
}

// Get list of auto variants (for display — "this variant was auto-applied")
export function getAutoVariants(title, playerCount) {
  if (!title.variants) return []
  return Object.entries(title.variants)
    .filter(([, v]) => v.autoForPlayers && v.autoForPlayers.includes(playerCount))
    .map(([id, v]) => ({
      id,
      label: v.label || id,
      desc: v.desc || '',
    }))
}
