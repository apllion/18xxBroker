import { defaults } from './defaults.js'

export const g1846 = {
  ...defaults,

  titleId: 'g1846',
  title: '1846',
  subtitle: 'The Race for the Midwest',
  designer: 'Thomas Lehmann',
  location: 'Midwest, USA',
  minPlayers: 2,
  maxPlayers: 5,

  bankCash: { 2: 7000, 3: 6500, 4: 7500, 5: 9000 },
  startingCash: { 2: 600, 3: 400, 4: 400, 5: 400 },
  // Nested cert limit: { playerCount: { corpCount: limit } }
  certLimit: {
    2: { 5: 19, 4: 16 },
    3: { 5: 14, 4: 11 },
    4: { 6: 12, 5: 10, 4: 8 },
    5: { 7: 11, 6: 10, 5: 8, 4: 6 },
  },
  currencyFormat: '$',

  capitalization: 'incremental',
  floatPercent: 20,
  sellBuyOrder: 'sell_buy',
  sellMovement: 'left_block_pres',
  poolShareDrop: 'down_block',
  sellAfter: 'p_any_operate',
  mustSellInBlocks: true,
  ebuyFromOthers: 'never',
  ebuyDepotCheapest: false,
  ebuyMustIssueBefore: true,

  gameEndCheck: {
    bankrupt: 'immediate',
    bank: 'full_or',
    allClosed: 'immediate',
  },

  // Single-row market
  market: [
    ['0c','10','20','30','40p','50p','60p','70p','80p','90p','100p','112p','124p','137p','150p','165','180','195','212','230','250','270','295','320','345','375','405','440','475','510','550'],
  ],

  phases: [
    { name: 'I', trainLimit: 4, tiles: ['yellow'], operatingRounds: 2 },
    { name: 'II', on: '4', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: 'III', on: '5', trainLimit: 3, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: 'IV', on: '6', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
  ],

  trains: [
    { name: '2', distance: 2, price: 80, rustsOn: '6', num: 7 },
    { name: '4', distance: 4, price: 180, num: 6, variants: [{ name: '3/5', price: 160 }] },
    { name: '5', distance: 5, price: 500, num: 5, variants: [{ name: '4/6', price: 450 }], events: ['close_companies'] },
    { name: '6', distance: 6, price: 800, num: 9, variants: [{ name: '7/8', price: 900 }], events: ['remove_bonuses','remove_reservations'] },
  ],

  corporations: [
    { sym: 'PRR', name: 'Pennsylvania Railroad', tokens: [0,80,80,80,80], color: '#FF0000', coordinates: 'F20', floatPercent: 20 },
    { sym: 'NYC', name: 'New York Central Railroad', tokens: [0,80,80,80], color: '#110a0c', coordinates: 'D20', floatPercent: 20 },
    { sym: 'B&O', name: 'Baltimore & Ohio Railroad', tokens: [0,80,80,80], color: '#025aaa', coordinates: 'G19', floatPercent: 20 },
    { sym: 'C&O', name: 'Chesapeake & Ohio Railroad', tokens: [0,80,80,80], color: '#ADD8E6', textColor: '#000', coordinates: 'I15', floatPercent: 20 },
    { sym: 'ERIE', name: 'Erie Railroad', tokens: [0,80,80,80], color: '#FFF500', textColor: '#000', coordinates: 'E21', floatPercent: 20 },
    { sym: 'GT', name: 'Grand Trunk Railway', tokens: [0,80,80], color: '#f58121', coordinates: 'B16', floatPercent: 20 },
    { sym: 'IC', name: 'Illinois Central Railroad', tokens: [0,80,80,80], color: '#32763f', coordinates: 'K3', floatPercent: 20,
      desc: 'Receives initial subsidy of 1x par value on float.' },
    // Minors
    { sym: 'MS', name: 'Michigan Southern', tokens: [0], color: '#ffc0cb', textColor: '#000', coordinates: 'C15', type: 'minor', floatPercent: 100 },
    { sym: 'BIG4', name: 'Big 4', tokens: [0], color: '#00ffff', textColor: '#000', coordinates: 'G9', type: 'minor', floatPercent: 100 },
  ],

  pregame: [{ id: 'draft', label: 'Secret Draft', type: 'draft' }],
  draftStyle: 'secret', // 1846: secret pick from visible pool, reveal at end

  variants: {
    '2p': {
      label: '2-Player Variant',
      desc: 'Different draft (2p distribution), max 70% ownership, final train triggers one more full OR set. Reduced train counts.',
      autoForPlayers: [2],
      maxOwnership: 70,
      gameEndCheck: {
        bankrupt: 'immediate',
        bank: 'full_or',
        allClosed: 'immediate',
        finalTrain: 'one_more_full_or_set',
      },
      trains: [
        { name: '2', distance: 2, price: 80, rustsOn: '6', num: 7 },
        { name: '4', distance: 4, price: 180, num: 5, variants: [{ name: '3/5', price: 160 }] },
        { name: '5', distance: 5, price: 500, num: 3, variants: [{ name: '4/6', price: 450 }], events: ['close_companies'] },
        { name: '6', distance: 6, price: 800, num: 4, variants: [{ name: '7/8', price: 900 }], events: ['remove_bonuses','remove_reservations'] },
      ],
    },
  },

  companies: [
    { sym: 'MS', name: 'Michigan Southern', value: 60, revenue: 0,
      desc: 'Starts with $60, a 2-train, and a token in Detroit (C15). Operates first. Splits dividends with owner.' },
    { sym: 'BIG4', name: 'Big 4', value: 40, revenue: 0,
      desc: 'Starts with $40, a 2-train, and a token in Indianapolis (G9). Operates after MS. Splits dividends with owner.' },
    { sym: 'C&WI', name: 'Chicago and Western Indiana', value: 60, revenue: 10,
      desc: 'Reserves a token slot in Chicago (D6). Owning corp may place an extra token there for free.' },
    { sym: 'MAIL', name: 'Mail Contract', value: 80, revenue: 0,
      desc: 'Adds $10 bonus for each city visited by a single train of the owning corp. Never closes once purchased by a corp.' },
    { sym: 'TBC', name: 'Tunnel Blasting Company', value: 60, revenue: 20,
      desc: 'Reduces mountain tile cost by $20 for owning corp.' },
    { sym: 'MPC', name: 'Meat Packing Company', value: 60, revenue: 15,
      desc: 'Adds $30 bonus to St. Louis (I1) or Chicago (D6) for owning corp.' },
    { sym: 'SC', name: 'Steamboat Company', value: 40, revenue: 10,
      desc: 'Adds port bonus ($40 to Wheeling/Holland, $20 to Chicago Conn./Toledo/St. Louis). Reassignable each OR.' },
    { sym: 'LSL', name: 'Lake Shore Line', value: 40, revenue: 15,
      desc: 'Owning corp may make an extra free green tile upgrade of Cleveland (E17) or Toledo (D14).' },
    { sym: 'MC', name: 'Michigan Central', value: 40, revenue: 15,
      desc: 'Owning corp may lay up to two extra free yellow tiles in B10 and B12.' },
    { sym: 'O&I', name: 'Ohio & Indiana', value: 40, revenue: 15,
      desc: 'Owning corp may lay up to two extra free yellow tiles in F14 and F16.' },
    { sym: 'BT', name: 'Boomtown', value: 40, revenue: 10,
      desc: 'Adds $20 bonus to Cincinnati (H12) for owning corp.' },
    { sym: 'LM', name: 'Little Miami', value: 40, revenue: 15,
      desc: 'Owning corp may lay/upgrade extra free tiles to connect Cincinnati (H12) to Dayton (G13).' },
  ],
}
