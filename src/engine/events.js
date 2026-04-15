// Game events — human-readable descriptions and guidance for train/phase events.
// The companion app doesn't enforce these, but shows prompts when they trigger.

export const EVENT_INFO = {
  // Common
  close_companies: {
    label: 'Close Private Companies',
    desc: 'All private companies close immediately. Remove revenue and special abilities.',
    auto: true, // handled by engine
  },

  // 1861 / 1867 nationalization
  trainless_nationalization: {
    label: 'Trainless Nationalization Check',
    desc: 'Any major corporation without trains may be nationalized. The president chooses: nationalize (transfer all assets to the national railway) or decline.',
    prompt: true,
  },
  nationalize_companies: {
    label: 'Private Companies Nationalized',
    desc: 'All remaining private companies are closed.',
    auto: true,
  },
  minors_nationalized: {
    label: 'All Minors Nationalized',
    desc: 'All remaining minor corporations are absorbed into the national railway. Transfer trains, tokens, cash, and treasury.',
    prompt: true,
  },
  green_minors_available: {
    label: 'Green Minors Available',
    desc: 'Minor corporations on green hexes may now be started.',
  },
  majors_can_ipo: {
    label: 'Major Corporations Available',
    desc: 'Major corporations may now be IPO\'d in stock rounds.',
  },
  minors_cannot_start: {
    label: 'No New Minors',
    desc: 'No new minor corporations may be started from this point.',
  },

  // 18SJ nationalization
  nationalization: {
    label: 'Nationalization',
    desc: 'SJ (national railway) may acquire corporations. Check nationalization rules.',
    prompt: true,
  },

  // 1822 / 1822MX
  close_concessions: {
    label: 'Close Concessions',
    desc: 'All remaining concessions close. Unconverted concessions are removed.',
  },
  full_capitalisation: {
    label: 'Full Capitalisation',
    desc: 'All corporations now receive full capitalisation when they float.',
  },
  close_ndem: {
    label: 'Close NdeM',
    desc: 'The NdeM national railway closes.',
  },

  // 1846
  remove_bonuses: {
    label: 'Remove Bonuses',
    desc: 'Meat Packing and Steamboat bonuses are removed.',
  },
  remove_reservations: {
    label: 'Remove Reservations',
    desc: 'All remaining home city reservations are removed.',
  },

  // 1849
  green_par: {
    label: 'Green Par Prices Unlocked',
    desc: 'Higher par prices are now available.',
  },
  brown_par: {
    label: 'Brown Par Prices Unlocked',
    desc: 'The highest par prices are now available.',
  },
  earthquake: {
    label: 'Earthquake!',
    desc: 'Check earthquake rules for this title.',
    prompt: true,
  },

  // 1860
  fishbourne_to_bank: {
    label: 'Fishbourne to Bank',
    desc: 'The Fishbourne private returns to the bank.',
  },
  relax_cert_limit: {
    label: 'Certificate Limit Relaxed',
    desc: 'Certificate limits are relaxed from this point.',
  },
  southern_forms: {
    label: 'Southern Railway Forms',
    desc: 'The Southern Railway national corporation forms.',
    prompt: true,
  },

  // 1862
  lner_trigger: {
    label: 'LNER Trigger',
    desc: 'The LNER formation is triggered. Check merger rules.',
    prompt: true,
  },

  // 1880
  float_30: { label: 'Float at 30%', desc: 'Corporations now float at 30% sold.' },
  float_40: { label: 'Float at 40%', desc: 'Corporations now float at 40% sold.' },
  float_60: { label: 'Float at 60%', desc: 'Corporations now float at 60% sold.' },
  permit_b: { label: 'Permit B Available', desc: 'Permit B concessions are now available.' },
  permit_c: { label: 'Permit C Available', desc: 'Permit C concessions are now available.' },
  permit_d: { label: 'Permit D Available', desc: 'Permit D concessions are now available.' },
  communist_takeover: {
    label: 'Communist Takeover',
    desc: 'Foreign investors are removed. Check specific rules.',
    prompt: true,
  },
  stock_exchange_reopens: {
    label: 'Stock Exchange Reopens',
    desc: 'The stock exchange reopens for trading.',
  },
  token_cost_doubled: {
    label: 'Token Cost Doubled',
    desc: 'Token placement costs are doubled from this point.',
  },

  // 1847AE
  must_exchange_investor_companies: {
    label: 'Exchange Investor Companies',
    desc: 'All investor companies must now be exchanged for shares.',
    prompt: true,
  },

  // 18DO TRG
  final_run_on_rust: {
    label: 'Final Run on Rust',
    desc: 'Rusting trains get one final run before being removed.',
    prompt: true,
  },

  // 1867
  train_trade_allowed: {
    label: 'Train Trading Allowed',
    desc: 'Corporations may now freely trade trains between each other.',
  },

  // General
  signal_end_game: {
    label: 'End Game Triggered',
    desc: 'The game end condition has been triggered. Check end-game rules.',
    prompt: true,
  },
  full_cap: {
    label: 'Full Capitalisation',
    desc: 'Corporations now receive full capitalisation when floating.',
  },
  remove_tokens: {
    label: 'Remove Tokens',
    desc: 'Certain tokens are removed from the board.',
  },
}

// Get event info, with fallback for unknown events
export function getEventInfo(eventName) {
  return EVENT_INFO[eventName] || {
    label: eventName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    desc: `Game event: ${eventName}`,
  }
}

// Get all events for a train purchase
export function getTrainEvents(title, trainName) {
  const train = title.trains?.find((t) => t.name === trainName)
  if (!train?.events) return []
  return train.events.map((e) => getEventInfo(e))
}
