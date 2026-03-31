import { defaults } from './defaults.js'

export const g1861 = {
  ...defaults,

  titleId: 'g1861',
  title: '1861',
  subtitle: 'Railways of the Russian Empire',
  designer: 'Ian D. Wilson',
  location: 'Russia',
  minPlayers: 2,
  maxPlayers: 6,

  bankCash: 15000,
  startingCash: { 2: 420, 3: 420, 4: 315, 5: 252, 6: 210 },
  certLimit: { 2: 21, 3: 21, 4: 16, 5: 13, 6: 11 },
  currencyFormat: '₽',

  capitalization: 'incremental',
  floatPercent: 20,
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_block_pres',
  sellAfter: 'operate',

  gameEndCheck: {
    bank: 'current_or',
    finalPhase: 'one_more_full_or_set',
  },

  // 2D grid market (default; column market is optional rule)
  market: [
    ['','','','','135','150','165mC','180','200z','220','245','270','300','330','360','400','440','490','540'],
    ['','','','110','120','135','150mC','165z','180z','200','220','245','270','300','330','360','400','440','490'],
    ['','','90','100','110','120','135pmC','150z','165','180','200','220','245','270','300','330','360','400','440'],
    ['','70','80','90','100','110p','120pmC','135','150','165','180','200'],
    ['60','65','70','80','90p','100p','110mC','120','135','150'],
    ['55','60','65','70p','80p','90','100mC','110'],
    ['50','55','60x','65x','70','80'],
    ['45','50x','55x','60','65'],
    ['40','45','50','55'],
    ['35','40','45'],
  ],

  phases: [
    { name: '2', trainLimit: { minor: 2 }, tiles: ['yellow'], operatingRounds: 2 },
    { name: '3', on: '3', trainLimit: { minor: 2, major: 4 }, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: { minor: 1, major: 3 }, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: { minor: 1, major: 3 }, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '6', on: '6', trainLimit: { minor: 1, major: 2 }, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
    { name: '7', on: '7', trainLimit: { minor: 1, major: 2 }, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
    { name: '8', on: '8', trainLimit: { major: 2 }, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
  ],

  trains: [
    { name: '2', distance: 2, price: 100, rustsOn: '4', num: 10 },
    { name: '3', distance: 3, price: 225, rustsOn: '6', num: 7, events: ['green_minors_available'] },
    { name: '4', distance: 4, price: 350, rustsOn: '8', num: 4, events: ['majors_can_ipo','trainless_nationalization'] },
    { name: '5', distance: 5, price: 550, num: 4, events: ['minors_cannot_start'] },
    { name: '6', distance: 6, price: 650, num: 2, events: ['nationalize_companies','trainless_nationalization'] },
    { name: '7', distance: 7, price: 800, num: 2 },
    { name: '8', distance: 8, price: 1000, num: 99, events: ['minors_nationalized','trainless_nationalization'] },
    { name: '2+2', distance: 2, price: 600, num: 99, availableOn: '8' },
    { name: '5+5E', distance: 5, price: 1500, num: 99, availableOn: '8' },
  ],

  corporations: [
    // Majors
    { sym: 'NW', name: 'North Western Railway', tokens: [0,20,40], color: '#000080', type: 'major', floatPercent: 20 },
    { sym: 'SW', name: 'Southwestern Railway', tokens: [0,20,40], color: '#d75500', type: 'major', floatPercent: 20 },
    { sym: 'SE', name: 'Southeastern Railway', tokens: [0,20,40], color: '#772282', type: 'major', floatPercent: 20 },
    { sym: 'MVR', name: 'Moscow, Vindava & Rybinsk Railway', tokens: [0,20,40], color: '#808000', type: 'major', floatPercent: 20 },
    { sym: 'MK', name: 'Moscow & Kazan Railway', tokens: [0,20,40], color: '#7b352a', type: 'major', floatPercent: 20 },
    { sym: 'GRR', name: 'Grand Russian Railway', tokens: [0,20,40], color: '#ef4223', type: 'major', floatPercent: 20 },
    { sym: 'MKN', name: 'Moscow, Kursk & Nizhnii Novgorod', tokens: [0,20,40], color: '#0189d1', type: 'major', floatPercent: 20 },
    { sym: 'MKV', name: 'Moscow, Kiev & Voronezh Railway', tokens: [0,20,40], color: '#3c7b5c', type: 'major', floatPercent: 20 },
    // Minors (16)
    { sym: 'RO', name: 'Riga-Orel Railway', tokens: [0], color: '#009595', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'B4' },
    { sym: 'KB', name: 'Kiev-Brest Railway', tokens: [0], color: '#4cb5d2', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'D14' },
    { sym: 'OK', name: 'Odessa-Kiev Railway', tokens: [0], color: '#0097df', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'D20' },
    { sym: 'KK', name: 'Kiev-Kursk Railway', tokens: [0], color: '#0097df', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'D14' },
    { sym: 'SPW', name: 'St. Petersburg Warsaw', tokens: [0], color: '#0189d1', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'E1' },
    { sym: 'MB', name: 'Moscow-Brest Railway', tokens: [0], color: '#000080', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'E9' },
    { sym: 'KR', name: 'Kharkiv-Rostov Railway', tokens: [0], color: '#772282', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'G15' },
    { sym: 'N', name: 'Nikolaev Railway', tokens: [0], color: '#d30869', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'H8' },
    { sym: 'Y', name: 'Yuzovka Railway', tokens: [0], color: '#f3716d', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'H18' },
    { sym: 'M-K', name: 'Moscow-Kursk Railway', tokens: [0], color: '#d75500', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'H8' },
    { sym: 'MNN', name: 'Moscow-Nizhnii Novgorod', tokens: [0], color: '#ef4223', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'H8' },
    { sym: 'MV', name: 'Moscow-Voronezh Railway', tokens: [0], color: '#b7274c', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'I13' },
    { sym: 'V', name: 'Vladikavkaz Railway', tokens: [0], color: '#7c7b8c', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'I19' },
    { sym: 'TR', name: 'Tsaritsyn-Riga Railway', tokens: [0], color: '#7c7b8c', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'K17' },
    { sym: 'SV', name: 'Samara-Vyazma Railway', tokens: [0], color: '#7c7b8c', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'N10' },
    { sym: 'E', name: 'Ekaterinin Railway', tokens: [0], color: '#000080', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'Q3' },
    // National
    { sym: 'RSR', name: 'Russian State Railway', tokens: [0,0,0,0,0,0,0,0], color: '#fffdd0', textColor: '#000', type: 'national', shares: [100] },
  ],

  pregame: [{ id: 'bidbox', label: 'Bid Box Auction', type: 'bidbox' }],

  variants: {
    'column_market': {
      label: 'Column Stock Market',
      desc: 'Use the 1D column market from 1867 instead of the default 2D grid.',
      market: [
        ['35','40','45','50x','55x','60x','65x','70p','80p','90p','100pC','110pC','120pC','135pC','150zC','165zCm','180z','200z','220','245','270','300','330','360','400','440','490','540'],
      ],
    },
  },

  companies: [
    { sym: 'TSR', name: 'Tsarskoye Selo Railway', value: 30, revenue: 10, desc: 'No special abilities.' },
    { sym: 'BSS', name: 'Black Sea Shipping Company', value: 45, revenue: 15, desc: 'Corp gains ₽10 extra revenue for each route through Odessa.' },
    { sym: 'MYR', name: 'Moscow - Yaroslavl Railway', value: 60, revenue: 20, desc: 'Corp gains ₽10 extra revenue for each route through Moscow.' },
    { sym: 'MRR', name: 'Moscow - Ryazan Railway', value: 75, revenue: 25, desc: 'Corp gains ₽10 extra revenue for each route through Moscow.' },
    { sym: 'WVR', name: 'Warsaw - Vienna Railway', value: 90, revenue: 30, desc: 'Corp gains ₽10 extra revenue for each route through Poland.' },
  ],
}
