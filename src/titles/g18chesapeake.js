import { defaults } from './defaults.js'

export const g18chesapeake = {
  ...defaults,

  titleId: 'g18chesapeake',
  title: '18Chesapeake',
  subtitle: 'The Birth of American Railroads',
  designer: 'Scott Petersen',
  location: 'Chesapeake Bay Region, USA',
  minPlayers: 2,
  maxPlayers: 6,

  bankCash: 8000,
  startingCash: { 2: 1200, 3: 800, 4: 600, 5: 480, 6: 400 },
  certLimit: { 2: 20, 3: 20, 4: 16, 5: 13, 6: 11 },
  currencyFormat: '$',

  sellBuyOrder: 'sell_buy',

  market: [
    ['80','85','90','100','110','125','140','160','180','200','225','250','275','300','325','350','375'],
    ['75','80','85','90','100','110','125','140','160','180','200','225','250','275','300','325','350'],
    ['70','75','80','85','95p','105','115','130','145','160','180','200'],
    ['65','70','75','80p','85','95','105','115','130','145'],
    ['60','65','70p','75','80','85','95','105'],
    ['55y','60','65','70','75','80'],
    ['50y','55y','60','65'],
    ['40y','45y','50y'],
  ],

  phases: [
    { name: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
    { name: '3', on: '3', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '6', on: '6', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: 'D', on: 'D', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 3 },
  ],

  trains: [
    { name: '2', distance: 2, price: 80, rustsOn: '4', num: 7 },
    { name: '3', distance: 3, price: 180, rustsOn: '6', num: 6 },
    { name: '4', distance: 4, price: 300, rustsOn: 'D', num: 5 },
    { name: '5', distance: 5, price: 500, num: 3, events: ['close_companies'] },
    { name: '6', distance: 6, price: 630, num: 2 },
    { name: 'D', distance: 999, price: 900, num: 20, availableOn: '6', discount: { '4': 200, '5': 200, '6': 200 } },
  ],

  corporations: [
    { sym: 'PRR', name: 'Pennsylvania Railroad', tokens: [0,40,60,80], color: '#237333', coordinates: 'F2' },
    { sym: 'PLE', name: 'Pittsburgh and Lake Erie Railroad', tokens: [0,40,60], color: '#000000', coordinates: 'A3' },
    { sym: 'SRR', name: 'Strasburg Rail Road', tokens: [0,40], color: '#d81e3e', coordinates: 'H4' },
    { sym: 'B&O', name: 'Baltimore & Ohio Railroad', tokens: [0,40,60], color: '#0189d1', coordinates: 'H6' },
    { sym: 'C&O', name: 'Chesapeake & Ohio Railroad', tokens: [0,40,60,80], color: '#a2dced', textColor: '#000', coordinates: 'G13' },
    { sym: 'LV', name: 'Lehigh Valley Railroad', tokens: [0,40], color: '#FFF500', textColor: '#000', coordinates: 'J2' },
    { sym: 'C&A', name: 'Camden & Amboy Railroad', tokens: [0,40], color: '#f48221', coordinates: 'J6' },
    { sym: 'N&W', name: 'Norfolk & Western Railway', tokens: [0,40,60], color: '#7b352a', coordinates: 'C13' },
  ],

  pregame: [
    { id: 'auction', label: 'Private Auction', type: 'waterfall' },
  ],

  companies: [
    { sym: 'D&R', name: 'Delaware and Raritan Canal', value: 20, revenue: 5,
      desc: 'No special ability. Blocks hex K3 while owned by a player.' },
    { sym: 'C-P', name: 'Columbia - Philadelphia Railroad', value: 40, revenue: 10,
      desc: 'Owning corporation may lay two connected tiles in hexes H2 and I3. Only #8 and #9 tiles may be used.' },
    { sym: 'B&S', name: 'Baltimore and Susquehanna Railroad', value: 50, revenue: 10,
      desc: 'Owning corporation may lay two connected tiles in hexes F4 and G5. Only #8 and #9 tiles may be used.' },
    { sym: 'C&OC', name: 'Chesapeake and Ohio Canal', value: 80, revenue: 15,
      desc: 'Owning corporation may place a tile and free token in hex D2.' },
    { sym: 'B&OR', name: 'Baltimore & Ohio Railroad', value: 100, revenue: 0,
      desc: 'Purchasing player immediately takes a 10% share of the B&O.' },
    { sym: 'CV', name: 'Cornelius Vanderbilt', value: 200, revenue: 30,
      desc: 'Owner receives a random President\'s certificate. Closes when that corporation buys its first train. Cannot be bought by a corporation.' },
  ],

  // Variants
  variants: {
    '2p': {
      label: '2-Player Variant',
      desc: 'President share becomes 30%. Last share of each corp goes to bank.',
      autoForPlayers: [2],
      shares: [30, 10, 10, 10, 10, 10, 10],
    },
  },
}
