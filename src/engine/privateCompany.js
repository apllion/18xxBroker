// PrivateCompany — ownership, revenue, closing.

export function createPrivateCompany(def) {
  return {
    sym: def.sym,
    name: def.name,
    value: def.value,
    revenue: def.revenue,
    desc: def.desc,
    ownerId: null,      // player id or corp sym
    ownerType: null,     // 'player' or 'corporation'
    closed: false,
  }
}

export function assignPrivate(company, ownerId, ownerType) {
  company.ownerId = ownerId
  company.ownerType = ownerType
}

export function closePrivate(company) {
  company.closed = true
  company.ownerId = null
  company.ownerType = null
}

export function collectRevenue(state, companySym) {
  const company = state.companies.find((c) => c.sym === companySym)
  if (!company || company.closed || !company.ownerId) return null

  const amount = company.revenue
  if (company.ownerType === 'player') {
    const player = state.players.find((p) => p.id === company.ownerId)
    if (player) {
      player.cash += amount
      state.bank.cash -= amount
    }
  } else if (company.ownerType === 'corporation') {
    const corp = state.corporations.find((c) => c.sym === company.ownerId)
    if (corp) {
      corp.cash += amount
      state.bank.cash -= amount
    }
  }
  return amount
}

export function collectAllRevenue(state) {
  const results = []
  for (const company of state.companies) {
    if (!company.closed && company.ownerId) {
      const amount = collectRevenue(state, company.sym)
      if (amount) {
        results.push({ sym: company.sym, amount, ownerId: company.ownerId })
      }
    }
  }
  return results
}

export function closeAllCompanies(state) {
  for (const company of state.companies) {
    if (!company.closed) {
      closePrivate(company)
    }
  }
  // Also remove from player holdings
  for (const player of state.players) {
    player.privates = []
  }
}
