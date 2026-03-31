import { defaults } from './defaults.js'

export const g22mars = {
  ...defaults,
  titleId: 'g22mars', title: '22Mars', subtitle: 'Convict Camps, Mining, and Space Tourism', designer: 'Örjan Wennman', wip: true,
  location: 'Mars', minPlayers: 2, maxPlayers: 4,

  bankCash: 6000,
  startingCash: { 2: 350, 3: 260, 4: 225 },
  certLimit: { 2: 15, 3: 12, 4: 9 },
  currencyFormat: 'c',

  capitalization: 'incremental',
  floatPercent: 20, // Floats on CEO share purchase
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_share',
  marketShareLimit: 100,

  // Dividend: >0 and <2x price = right 1, >=2x price = right 2
  // Withhold: left 1 (down if at left edge). Not allowed at 35.
  // No route: left 1
  // Sold-out: up at end of SR
  dividendMovement: 'standard', // double jump at 2x

  // Taxes at start of each SR: 10c per share above 2 in same corp
  taxes: { perShareAbove2: 10 },

  // 5 shares per corp, all 20%
  shares: [20, 20, 20, 20, 20],

  market: [
    ['90','100','110','120','130','145','160','175','195','215','235','255','275','300e'],
    ['80','90','100','110','120','130','145','160','175','195','215','235','255'],
    ['70','80','90','100','110','120','130','145','160','175','195','215'],
    ['60p','70','80','90','100','110','120','130','145','160','175'],
    ['50','60p','70','80','90p','100','110','120','130','145'],
    ['45','50','55','65','75','85','95','105'],
    ['40','45','50','55','65','75'],
    ['35r','40r','45r','50r'],
    ['0c'],
  ],

  phases: [
    { name: '2', trainLimit: 3, tiles: ['yellow'], operatingRounds: 2 },
    { name: '3', on: '3', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: 3, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '7', on: '7', trainLimit: 3, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
    { name: '8', on: '8', trainLimit: 3, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
  ],

  trains: [
    { name: '2', distance: 2, price: 110, rustsOn: '4', num: 6 },
    { name: '3', distance: 3, price: 180, rustsOn: '5', num: 4 },
    { name: '4', distance: 4, price: 280, rustsOn: '7', num: 3 },
    { name: '5', distance: 5, price: 400, rustsOn: '8', num: 3 },
    { name: '7', distance: 6, price: 520, num: 4, desc: 'Runs 6 stops, doubles first OR last stop value.' },
    { name: '8', distance: 6, price: 660, num: 5, desc: 'Runs 6 stops, doubles BOTH first and last stop.' },
  ],

  corporations: [
    { sym: 'TRE', name: 'The Redline Express', tokens: [0,0,0,0], color: '#FB0007' },
    { sym: 'SMC', name: 'Space Minerals Corporation', tokens: [0,0,0,0], color: '#0B5453' },
    { sym: 'NWC', name: 'The New World Corporation', tokens: [0,0,0,0], color: '#D0D0D0', textColor: '#000' },
    { sym: 'PL', name: 'The Paradise Line', tokens: [0,0,0,0], color: '#BF5206' },
    { sym: 'MS', name: 'The Mars Shuttle', tokens: [0,0,0,0], color: '#18C0FF', textColor: '#000' },
    { sym: 'SRC', name: 'The Star Rail Corporation', tokens: [0,0,0,0], color: '#000000' },
    { sym: 'IG', name: 'Intergalactic', tokens: [0,0,0,0], color: '#6B006D' },
    { sym: 'REX', name: 'The Robot Express', tokens: [0,0,0,0], color: '#FFFF0B', textColor: '#000' },
  ],

  pregame: [{ id: 'priority', label: 'Priority Auction', type: 'priority' }],

  // Permit cards (act like privates — bought in auction, pay revenue each OR)
  companies: [
    { sym: 'MAA', name: 'Mining Area Alpha', value: 15, revenue: 5,
      desc: 'Exclusive rights to build/run in Mining Area Alpha hex. Assign to corp.' },
    { sym: 'MAG', name: 'Mining Area Gamma', value: 15, revenue: 5,
      desc: 'Exclusive rights to build/run in Mining Area Gamma hex. Assign to corp.' },
    { sym: 'LT', name: 'Labor Transports', value: 15, revenue: 5,
      desc: '+10c bonus per train stop at Robot Factory, AAP, or Paradise City. Removed on revolt.' },
    { sym: 'PC', name: 'Paradise City', value: 20, revenue: 5,
      desc: 'Place white T token (+10c) in colony hex without M or C.' },
    { sym: 'RF', name: 'Robot Factory', value: 20, revenue: 5,
      desc: 'Place white RF token (+10c) in hex with M or C colony.' },
    { sym: 'TA', name: 'Train Availability', value: 20, revenue: 5,
      desc: 'Remove one 2/3/4/5 train from the train pool.' },
    { sym: 'PH', name: 'Prototype Hyperdrive', value: 20, revenue: 5,
      desc: 'Assigned train gets +1 free outpost stop per run. Assign to corp.' },
    { sym: 'AAP', name: 'Android Amusement Park', value: 25, revenue: 5,
      desc: 'Place AAP tile on outpost hex as free extra tile lay. Assign to corp.' },
    { sym: 'GD', name: 'Government Decision', value: 25, revenue: 5,
      desc: 'Relocate any colony token (except T) of a corp you own shares in.' },
    { sym: 'IP', name: 'Infrastructure Push', value: 25, revenue: 5,
      desc: 'Upgrade a tile one level above current phase. Cannot upgrade to black.' },
  ],

  // Fixed round sequence
  roundSequence: ['SR1','OR1','OR2','SR2','OR3','OR4','SR3','OR5','OR6','SR4','OR7','OR8','SR5','OR9','OR10','OR11'],

  gameEndCheck: {
    fixed_round: 'current_or', // ends after OR11
    stockMarket: 'current_or', // 300 triggers end
  },

  // Revolt mechanic (OR7-OR10, random timing)
  revolt: { firstCheck: 'OR7', guaranteedBy: 'OR10' },
}
