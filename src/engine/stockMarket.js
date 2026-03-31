// StockMarket — parse cells, track corp positions, move prices.

// Parse a market cell string. Conventions from 18xx.games:
//   "100p" = par price, "40y" = yellow, "30o" = orange, "25b" = brown, "0c" = close
//   1880: "115B" = bonus, "130W" = bonus+1, "150X" = bonus+2, "180Y" = bonus+3, "200Z" = bonus+4
//   1860: "54p" = par, "40r" = reserved, "7i" = initial, "340e" = endgame
//   1849: "306u" = unlimited, "216z" = zone, "144x" = extra
export function parseCell(cellStr) {
  if (!cellStr || cellStr === '') return null
  const match = cellStr.match(/^(\d+)([a-zA-Z]*)$/)
  if (!match) return null
  const price = parseInt(match[1], 10)
  const modifier = match[2] || ''
  const modLower = modifier.toLowerCase()
  return {
    price,
    canPar: modLower.includes('p'),
    zone: modLower.includes('y') ? 'yellow'
        : modLower.includes('o') ? 'orange'
        : modLower.includes('b') && !modifier.includes('B') ? 'brown'
        : modLower.includes('c') ? 'close'
        : modLower.includes('e') ? 'endgame'
        : modLower.includes('i') ? 'initial'
        : modLower.includes('r') ? 'reserved'
        : modifier.includes('B') ? 'bonus'
        : modifier.includes('W') ? 'bonus'
        : modifier.includes('X') ? 'bonus'
        : modifier.includes('Y') ? 'bonus'
        : modifier.includes('Z') ? 'bonus'
        : 'normal',
    modifier,
  }
}

export function createStockMarket(marketDef) {
  const grid = marketDef.map((row) => row.map(parseCell))
  return {
    grid,
    corpPositions: {}, // { [corpSym]: { row, col } }
  }
}

export function parPrices(market) {
  const prices = []
  for (let row = 0; row < market.grid.length; row++) {
    for (let col = 0; col < market.grid[row].length; col++) {
      const cell = market.grid[row][col]
      if (cell && cell.canPar) {
        prices.push({ price: cell.price, row, col })
      }
    }
  }
  return prices.sort((a, b) => a.price - b.price)
}

export function priceAt(market, row, col) {
  const cell = market.grid[row]?.[col]
  return cell ? cell.price : null
}

export function corpPrice(market, corpSym) {
  const pos = market.corpPositions[corpSym]
  if (!pos) return null
  return priceAt(market, pos.row, pos.col)
}

export function placeCorpOnMarket(market, corpSym, row, col) {
  market.corpPositions[corpSym] = { row, col }
}

// --- Single-step primitives ---

function stepRight(market, pos) {
  const row = market.grid[pos.row]
  if (pos.col < row.length - 1 && row[pos.col + 1]) {
    pos.col++
    return true
  }
  return false
}

function stepLeft(market, pos) {
  if (pos.col > 0 && market.grid[pos.row][pos.col - 1]) {
    pos.col--
    return true
  }
  return false
}

function stepDown(market, pos) {
  if (pos.row >= market.grid.length - 1) return false
  const nextRow = market.grid[pos.row + 1]
  let col = Math.min(pos.col, nextRow.length - 1)
  while (col >= 0 && !nextRow[col]) col--
  if (col >= 0) {
    pos.row++
    pos.col = col
    return true
  }
  return false
}

function stepUp(market, pos) {
  if (pos.row <= 0) return false
  const prevRow = market.grid[pos.row - 1]
  let col = Math.min(pos.col, prevRow.length - 1)
  while (col >= 0 && !prevRow[col]) col--
  if (col >= 0) {
    pos.row--
    pos.col = col
    return true
  }
  return false
}

// --- High-level movement used by actions ---

// Move right N times (e.g., after paying dividends)
export function moveRight(market, corpSym, steps = 1) {
  const pos = market.corpPositions[corpSym]
  if (!pos) return
  for (let i = 0; i < steps; i++) {
    if (!stepRight(market, pos)) break
  }
}

// Move left N times (e.g., after withholding)
export function moveLeft(market, corpSym, steps = 1) {
  const pos = market.corpPositions[corpSym]
  if (!pos) return
  for (let i = 0; i < steps; i++) {
    if (!stepLeft(market, pos)) break
  }
}

// Move down N times (e.g., shares sold)
export function moveDown(market, corpSym, steps = 1) {
  const pos = market.corpPositions[corpSym]
  if (!pos) return
  for (let i = 0; i < steps; i++) {
    if (!stepDown(market, pos)) break
  }
}

// Move up N times (e.g., sold-out corps)
export function moveUp(market, corpSym, steps = 1) {
  const pos = market.corpPositions[corpSym]
  if (!pos) return
  for (let i = 0; i < steps; i++) {
    if (!stepUp(market, pos)) break
  }
}

// --- Dividend-based movement ---
// dividendMovement config:
//   undefined / 'standard': withhold=left, pay<price=right1, pay>=price=right2
//   'trg_triple_jump': withhold=left(down if at edge), pay<price=none, pay>=price=right1, pay>=3x=right2
// Returns positive for right moves, -1 for left, -2 for down
export function moveDividend(market, corpSym, perShare, dividendMovement) {
  const pos = market.corpPositions[corpSym]
  if (!pos) return 0
  const currentPrice = priceAt(market, pos.row, pos.col)
  if (!currentPrice) return 0

  if (dividendMovement === 'trg_triple_jump') {
    // 18DO TRG rules:
    // withhold: left 1 (if at left edge, down 1)
    // pay > 0 but < price: no movement
    // pay >= price but < 3x: right 1 (up if at right edge)
    // pay >= 3x: right 2
    if (perShare <= 0) {
      if (!stepLeft(market, pos)) stepDown(market, pos)
      return -1
    }
    if (perShare < currentPrice) return 0
    if (perShare >= currentPrice * 3) {
      let moved = 0
      if (stepRight(market, pos)) moved++
      if (stepRight(market, pos)) moved++
      return moved
    }
    // >= price but < 3x
    if (stepRight(market, pos)) return 1
    if (stepUp(market, pos)) return 1
    return 0
  }

  // Standard rules (most 18xx):
  // withhold: left 1
  // pay > 0: right 1. If perShare >= currentPrice: right 2 (double jump)
  if (perShare <= 0) {
    stepLeft(market, pos)
    return -1
  }

  const jumps = perShare >= currentPrice ? 2 : 1
  let moved = 0
  for (let i = 0; i < jumps; i++) {
    if (stepRight(market, pos)) moved++
  }
  return moved
}

// --- Sell movement (title-aware) ---
// sellMovement config: 'down_share' | 'down_per_10' | 'left_block_pres' | 'down_block' | 'none'
export function moveSell(market, corpSym, percentSold, sellMovement = 'down_share') {
  const pos = market.corpPositions[corpSym]
  if (!pos) return

  if (sellMovement === 'none') return

  const shares = Math.floor(percentSold / 10)

  switch (sellMovement) {
    case 'down_share':
    case 'down_per_10':
      // One space down per 10% sold
      for (let i = 0; i < shares; i++) {
        stepDown(market, pos)
      }
      break

    case 'down_block':
      // Move down once regardless of how many sold
      stepDown(market, pos)
      break

    case 'left_share':
      // Move left per share
      for (let i = 0; i < shares; i++) {
        stepLeft(market, pos)
      }
      break

    case 'left_block':
    case 'left_block_pres':
      // Move left once regardless
      stepLeft(market, pos)
      break

    default:
      // Default: down per share
      for (let i = 0; i < shares; i++) {
        stepDown(market, pos)
      }
      break
  }
}

// --- Sold-out check ---
// A corp is sold out if 0% remains in IPO and market pool
export function isSoldOut(corp) {
  return corp.ipoShares <= 0 && corp.marketShares <= 0
}

// Move sold-out corps up at end of OR set
export function moveSoldOutCorps(market, corporations) {
  const moved = []
  for (const corp of corporations) {
    if (corp.floated && isSoldOut(corp)) {
      const pos = market.corpPositions[corp.sym]
      if (pos && stepUp(market, pos)) {
        moved.push(corp.sym)
      }
    }
  }
  return moved
}
