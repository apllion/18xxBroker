// BeerMarket — track beer cubes across market segments, deliveries, and income.
// HSB only. Segments 1-6 + export market.
// Each segment has: regularDemand (yellow), newDemand (orange), deliveries (white)

export function createBeerMarket(title, playerCount) {
  if (!title.beerMarket) return null

  const bm = title.beerMarket
  const initialStock = bm.initialStock[playerCount] || 8

  // Segments 1-6
  const segments = bm.segments.map((seg) => ({
    id: seg.id,
    regularIncome: seg.regularIncome,
    newIncome: seg.newIncome,
    regularDemand: 0,   // cubes on yellow demand field
    newDemand: 0,        // cubes on orange demand field
    deliveries: 0,       // cubes on white delivery field
    noDemand: seg.id >= 3, // segments 3-6 start with No Demand markers
  }))

  // Initial setup: segments 1-2 get cubes
  const seg1 = segments.find((s) => s.id === 1)
  const seg2 = segments.find((s) => s.id === 2)
  if (seg1) {
    seg1.regularDemand = playerCount >= 4 ? 4 : 3
    seg1.newDemand = playerCount >= 4 ? 4 : 3
  }
  if (seg2) {
    seg2.regularDemand = playerCount >= 5 ? 4 : 3
    seg2.newDemand = playerCount >= 5 ? 4 : 3
  }

  return {
    segments,
    exportMarket: { cubes: playerCount >= 5 ? 8 : 6 },
    stock: initialStock,
  }
}

// Deliver beer cube from a brewery to a market segment
export function deliverToSegment(beerMarket, segmentId, count = 1) {
  const seg = beerMarket.segments.find((s) => s.id === segmentId)
  if (!seg) return 0

  // Deliver to demand fields: first fill regular (yellow), then new (orange)
  let delivered = 0
  for (let i = 0; i < count; i++) {
    if (seg.regularDemand > 0) {
      seg.regularDemand--
      seg.deliveries++
      delivered++
    } else if (seg.newDemand > 0 && !seg.noDemand) {
      seg.newDemand--
      seg.deliveries++
      delivered++
    }
  }
  return delivered
}

// Deliver to export market
export function deliverToExport(beerMarket, count = 1) {
  const delivered = Math.min(count, beerMarket.exportMarket.cubes)
  beerMarket.exportMarket.cubes -= delivered
  return delivered
}

// Calculate income for a brewery's deliveries this round
export function calculateBreweryIncome(beerMarket, deliveries) {
  // deliveries = [{ segmentId, count, isRegular }]
  let total = 0
  for (const d of deliveries) {
    const seg = beerMarket.segments.find((s) => s.id === d.segmentId)
    if (!seg) continue
    total += d.count * (d.isRegular ? seg.regularIncome : seg.newIncome)
  }
  return total
}

// End of brewery round: advance the beer market
// 1. Remaining cubes on demand fields move to stock
// 2. Cubes on delivery fields move to regular demand (same segment)
// 3. Fill empty orange demand fields from stock (highest segment first)
export function advanceBeerMarket(beerMarket) {
  const results = { movedToStock: 0, movedToDemand: 0, filledFromStock: 0 }

  for (const seg of beerMarket.segments) {
    // Remaining demand cubes go to stock
    results.movedToStock += seg.regularDemand + seg.newDemand
    beerMarket.stock += seg.regularDemand + seg.newDemand
    seg.regularDemand = 0
    seg.newDemand = 0

    // Delivered cubes become regular demand
    seg.regularDemand = seg.deliveries
    results.movedToDemand += seg.deliveries
    seg.deliveries = 0
  }

  // Fill empty orange demand fields from stock (highest segment first)
  for (let i = beerMarket.segments.length - 1; i >= 0; i--) {
    const seg = beerMarket.segments[i]
    if (seg.noDemand) continue
    if (seg.newDemand === 0 && beerMarket.stock > 0) {
      // Fill with 1 cube from stock per empty new demand field
      const fill = Math.min(1, beerMarket.stock)
      seg.newDemand += fill
      beerMarket.stock -= fill
      results.filledFromStock += fill
    }
  }

  return results
}

// Get total cubes on market (for display)
export function totalCubesOnMarket(beerMarket) {
  let total = 0
  for (const seg of beerMarket.segments) {
    total += seg.regularDemand + seg.newDemand + seg.deliveries
  }
  total += beerMarket.exportMarket.cubes
  return total
}

// Remove No Demand marker from a segment (triggered by phase changes)
export function removeNoDemand(beerMarket, segmentId) {
  const seg = beerMarket.segments.find((s) => s.id === segmentId)
  if (seg) seg.noDemand = false
}

// Place No Demand marker on a segment (triggered by phase 8)
export function placeNoDemand(beerMarket, segmentId) {
  const seg = beerMarket.segments.find((s) => s.id === segmentId)
  if (seg) {
    // Cubes on this segment's demand move to stock
    beerMarket.stock += seg.regularDemand + seg.newDemand
    seg.regularDemand = 0
    seg.newDemand = 0
    seg.noDemand = true
  }
}
