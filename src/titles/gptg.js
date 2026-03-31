import { defaults } from './defaults.js'

export const gptg = {
  ...defaults,

  titleId: 'gptg', wip: true,
  title: 'PTG',
  subtitle: 'Pocket Train Game',
  designer: 'Jonas Jones',
  location: 'Generic',
  minPlayers: 2,
  maxPlayers: 4,

  bankCash: 99999, // Not specified — effectively unlimited
  startingCash: { 2: 500, 3: 400, 4: 300 }, // Placeholder — rules say "distribute based on player count"
  certLimit: { 2: 99, 3: 99, 4: 99 }, // Unlimited share ownership per rules
  currencyFormat: '$',

  capitalization: 'incremental', // Floats on CEO share purchase
  floatPercent: 20, // CEO share = 20%, company floats immediately
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_share', // One row down per share sold
  marketShareLimit: 100, // No pool limit mentioned

  // Fixed 7 rounds
  gameEndCheck: { fixed_round: 'current_or' },
  fixedRounds: 7,

  // Stock market — share prices $50-$180, par prices $80-$110
  // Movement: right if rev >= 0.5x price, right 2 if rev >= 3x, left if rev < 0.5x or withhold
  // Up if can't go right, down if can't go left. Sold-out = up at end of round.
  // Bottom red row = no CEO salary
  dividendMovement: 'ptg_triple',
  market: [
    ['180','180','180','180','180','180','180'],
    ['160','160','160','160','160','160','160'],
    ['140','140','140','140','140','140','140'],
    ['120','120','120','120','120','120','120'],
    ['110p','110','110','110','110','110','110'],
    ['100p','100','100','100','100','100','100'],
    ['90p','90','90','90','90','90','90'],
    ['80p','80','80','80','80','80','80'],
    ['70','70','70','70','70','70','70'],
    ['60','60','60','60','60','60','60'],
    ['50r','50r','50r','50r','50r','50r','50r'],
  ],

  phases: [
    { name: 'Yellow', trainLimit: 2, tiles: ['yellow'], operatingRounds: 1 },
    { name: 'Green', on: 'Green', trainLimit: 2, tiles: ['yellow','green'], operatingRounds: 1 },
    { name: 'Brown', on: 'Brown', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 1 },
    { name: 'Grey', on: 'Grey', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 1 },
    { name: 'Black', on: 'Black', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 1 },
    { name: 'Renovated', on: 'RenGreen', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 1 },
  ],

  trains: [
    { name: 'Yellow', distance: 2, price: 120, rustsOn: 'Brown', num: 4 },
    { name: 'Green', distance: 3, price: 170, rustsOn: 'Grey', num: 4 },
    { name: 'Brown', distance: 4, price: 290, rustsOn: 'Black', num: 2 },
    { name: 'Grey', distance: 6, price: 440, num: 2 },
    { name: 'Black', distance: 99, price: 560, num: 3 },
    { name: 'RenGreen', distance: 3, price: 300, num: 4, availableOn: 'Black',
      desc: 'Renovated green trains. Available after last black train sold.' },
  ],

  // 8 companies, all identical structure
  // 5 shares: 1x CEO (20%) + 4x regular (20%). Merged = 10x 10%.
  shares: [20, 20, 20, 20, 20],

  corporations: [
    { sym: 'RED', name: 'Red Company', tokens: [0,10], color: '#d81e3e', floatPercent: 20 },
    { sym: 'BLU', name: 'Blue Company', tokens: [0,10], color: '#0189d1', floatPercent: 20 },
    { sym: 'GRN', name: 'Green Company', tokens: [0,10], color: '#237333', floatPercent: 20 },
    { sym: 'YEL', name: 'Yellow Company', tokens: [0,10], color: '#FFF500', textColor: '#000', floatPercent: 20 },
    { sym: 'PUR', name: 'Purple Company', tokens: [0,10], color: '#800080', floatPercent: 20 },
    { sym: 'BLK', name: 'Black Company', tokens: [0,10], color: '#333333', floatPercent: 20 },
    { sym: 'WHT', name: 'White Company', tokens: [0,10], color: '#cccccc', textColor: '#000', floatPercent: 20 },
    { sym: 'GRY', name: 'Grey Company', tokens: [0,10], color: '#808080', floatPercent: 20 },
  ],

  pregame: [{ id: 'priority', label: 'Priority Auction', type: 'priority' }],

  // No private companies in PTG — strategy cards are player-held, not tracked as companies
  companies: [],

  // PTG-specific rules
  ceoIncome: 10, // $10 per round per CEO share
  taxThresholds: [
    { minPercent: 60, maxPercent: 70, tax: 20 },
    { minPercent: 80, maxPercent: 90, tax: 40 },
    { minPercent: 100, maxPercent: 100, tax: 60 },
  ],
  mergerAllowed: true, // From brown phase onwards
  topBonusRounds: { 6: 30, 7: 50 }, // Extra dividend per share if in green box during rounds 6-7
}
