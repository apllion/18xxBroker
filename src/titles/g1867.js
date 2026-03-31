import { defaults } from './defaults.js'

export const g1867 = {
  ...defaults,

  titleId: 'g1867',
  title: '1867',
  subtitle: 'Railways of Canada',
  designer: 'Ian D. Wilson',
  location: 'Canada',
  minPlayers: 2,
  maxPlayers: 6,

  bankCash: 15000,
  startingCash: { 2: 420, 3: 420, 4: 315, 5: 252, 6: 210 },
  certLimit: { 2: 21, 3: 21, 4: 16, 5: 13, 6: 11 },
  currencyFormat: '$',

  capitalization: 'incremental',
  floatPercent: 20,
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_block_pres',
  sellAfter: 'operate',
  mustSellInBlocks: false,
  ebuyDepotCheapest: false,

  gameEndCheck: {
    bank: 'current_or',
    finalPhase: 'one_more_full_or_set',
  },

  // Column market (single column)
  market: [
    ['35','40','45','50x','55x','60x','65x','70p','80p','90p','100pC','110pC','120pC','135pC','150zC','165zCm','180z','200z','220','245','270','300','330','360','400','440','490','540'],
  ],

  phases: [
    { name: '2', trainLimit: { minor: 2 }, tiles: ['yellow'], operatingRounds: 2 },
    { name: '3', on: '3', trainLimit: { minor: 2, major: 4 }, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: { minor: 1, major: 3 }, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: { minor: 1, major: 3 }, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '6', on: '6', trainLimit: { minor: 1, major: 2 }, tiles: ['yellow','green','brown'], operatingRounds: 2 },
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
    { name: '8', distance: 8, price: 1000, num: 99, events: ['minors_nationalized','trainless_nationalization','train_trade_allowed'],
      discount: { '5': 275, '6': 325, '7': 400, '8': 500 } },
    { name: '2+2', distance: 2, price: 600, num: 99, availableOn: '8',
      desc: 'Multiplier: runs route twice.' },
    { name: '5+5E', distance: 5, price: 1500, num: 99, availableOn: '8',
      desc: 'Multiplier: offboard only, runs twice.' },
  ],

  corporations: [
    // Majors (available from phase 4)
    { sym: 'CNR', name: 'Canadian Northern Railway', tokens: [0,20,40], color: '#3c7b5c', type: 'major', floatPercent: 20 },
    { sym: 'CPR', name: 'Canadian Pacific Railway', tokens: [0,20,40], color: '#ef4223', type: 'major', floatPercent: 20 },
    { sym: 'C&O', name: 'Chesapeake and Ohio Railway', tokens: [0,20,40], color: '#0189d1', type: 'major', floatPercent: 20 },
    { sym: 'GTR', name: 'Grand Trunk Railway', tokens: [0,20,40], color: '#d75500', type: 'major', floatPercent: 20 },
    { sym: 'GWR', name: 'Great Western Railway', tokens: [0,20,40], color: '#00008b', type: 'major', floatPercent: 20 },
    { sym: 'ICR', name: 'Intercolonial Railway', tokens: [0,20,40], color: '#7b352a', type: 'major', floatPercent: 20 },
    { sym: 'NTR', name: 'National Transcontinental Railway', tokens: [0,20,40], color: '#3c7b5c', type: 'major', floatPercent: 20 },
    { sym: 'NYC', name: 'New York Central Railroad', tokens: [0,20,40], color: '#772282', type: 'major', floatPercent: 20 },

    // Minors (available from start, 100% single share)
    { sym: 'BBG', name: 'Buffalo, Brantford, and Goderich', tokens: [0], color: '#7c7b8c', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'BO', name: 'Brockville and Ottawa', tokens: [0], color: '#009595', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'CS', name: 'Canada Southern', tokens: [0], color: '#4cb5d2', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'CV', name: 'Credit Valley Railway', tokens: [0], color: '#0097df', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'KP', name: 'Kingston and Pembroke', tokens: [0], color: '#0097df', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'LPS', name: 'London and Port Stanley', tokens: [0], color: '#7c7b8c', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'OP', name: 'Ottawa and Prescott', tokens: [0], color: '#d30869', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'SLA', name: 'St. Lawrence and Atlantic', tokens: [0], color: '#7c7b8c', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'TGB', name: 'Toronto, Grey, and Bruce', tokens: [0], color: '#00008b', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'TN', name: 'Toronto and Nipissing', tokens: [0], color: '#7b352a', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'AE', name: 'Algoma Eastern Railway', tokens: [0], color: '#d75500', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'CA', name: 'Canada Atlantic Railway', tokens: [0], color: '#772282', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'NO', name: 'New York and Ottawa', tokens: [0], color: '#d75500', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'PM', name: 'Pere Marquette Railway', tokens: [0], color: '#4cb5d2', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'QLS', name: 'Quebec and Lake St. John', tokens: [0], color: '#0189d1', type: 'minor', floatPercent: 100, shares: [100] },
    { sym: 'THB', name: 'Toronto, Hamilton and Buffalo', tokens: [0], color: '#d75500', type: 'minor', floatPercent: 100, shares: [100] },

    // National
    { sym: 'CN', name: 'Canadian National', tokens: [0,0,0,0,0,0,0,0], color: '#ef4223', type: 'national', shares: [100] },
  ],

  pregame: [{ id: 'bidbox', label: 'Bid Box Auction', type: 'bidbox' }],

  variants: {
    'grid_market': {
      label: 'Grid Stock Market',
      desc: 'Use the 2D grid market from 1861 instead of the default 1D column.',
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
    },
  },

  companies: [
    { sym: 'C&SL', name: 'Champlain & St. Lawrence', value: 30, revenue: 10,
      desc: 'No special abilities.' },
    { sym: 'NFB', name: 'Niagara Falls Bridge', value: 45, revenue: 15,
      desc: 'Corp gains $10 extra revenue for each route through Buffalo.' },
    { sym: 'MB', name: 'Montreal Bridge', value: 60, revenue: 20,
      desc: 'Corp gains $10 extra revenue for each route through Montreal.' },
    { sym: 'QB', name: 'Quebec Bridge', value: 75, revenue: 25,
      desc: 'Corp gains $10 extra revenue for each route through Quebec.' },
    { sym: 'SCT', name: 'St. Clair Tunnel', value: 90, revenue: 30,
      desc: 'Corp gains $10 extra revenue for each route through Detroit.' },
  ],
}
