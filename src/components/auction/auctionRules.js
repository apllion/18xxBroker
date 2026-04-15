// Auction rules text per pregame type.

export const auctionRules = {
  waterfall: {
    title: 'Waterfall Auction',
    summary: 'All privates are visible. The cheapest can be bought outright; any private can be bid on.',
    steps: [
      'On your turn: buy the cheapest private at face value, bid on any private, or pass.',
      'Bids must be at least face value + 5, or 5 above the current high bid.',
      'Pass = done for this round (you come back next round).',
      'After everyone passes: cheapest private with bids is sold to the high bidder.',
      'If no bids exist, the cheapest private\'s price drops by 5.',
      'If a private drops to 0, the first player takes it for free.',
    ],
  },
  english: {
    title: 'English Auction',
    summary: 'Players select companies to auction. Others bid or pass.',
    steps: [
      'On your turn, pick any company and place an opening bid (min face value).',
      'Other players bid higher or pass. Pass = out for this auction.',
      'Last bidder standing wins at their bid price.',
      'After a win, the next player selects the next company.',
      'If everyone passes without selecting, the cheapest drops by 5.',
    ],
  },
  bidbox: {
    title: 'Bid Box Auction',
    summary: 'Companies are offered one at a time. Players bid or pass.',
    steps: [
      'The cheapest unsold company is offered.',
      'In player order, bid (min face value, or +5 above high bid) or pass.',
      'Pass = permanently out for this company.',
      'Last bidder standing wins at their bid price.',
      'If nobody bids, the price drops by 5.',
      'At price 0, the current player must take it.',
    ],
  },
  draft: {
    title: 'Draft',
    summary: 'Players take turns selecting companies in player order.',
    steps: [
      'In player order, each player selects one available company and pays its face value.',
      'Continue drafting until all companies are chosen or all players have passed.',
      'Some titles allow passing instead of drafting.',
    ],
  },
  priority: {
    title: 'Permit Selection',
    summary: 'Players take turns selecting permits/companies in player order.',
    steps: [
      'In player order, each player selects one available permit and pays its face value.',
      'Continue until all permits are chosen or all players have passed.',
    ],
  },
  purchase: {
    title: 'Purchase Round',
    summary: 'Players purchase companies at face value in turn order.',
    steps: [
      'In player order, each player selects one available company.',
      'Pay the face value to the bank.',
      'Continue until each player has purchased or all companies are taken.',
    ],
  },
}

// Fallback for unknown types
export function getRules(type) {
  return auctionRules[type] || {
    title: 'Pregame',
    summary: 'Complete the pregame setup before starting the first stock round.',
    steps: [],
  }
}
