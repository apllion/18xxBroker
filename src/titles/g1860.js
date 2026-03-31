import { defaults } from './defaults.js'

export const g1860 = {
  ...defaults,

  titleId: 'g1860',
  title: '1860',
  subtitle: 'Railways on the Isle of Wight',
  designer: 'Mike Hutton',
  location: 'Isle of Wight',
  minPlayers: 2,
  maxPlayers: 4,

  bankCash: 10000,
  startingCash: { 2: 1000, 3: 670, 4: 500 },
  certLimit: { 2: 32, 3: 21, 4: 16 },
  currencyFormat: '£',

  floatPercent: 50,
  capitalization: 'full',
  mustSellInBlocks: true,
  sellBuyOrder: 'sell_buy',
  sellAfter: 'any_time',
  ebuyPresSwap: false,
  ebuyFromOthers: 'never',
  marketShareLimit: 100,

  market: [
    ['0c','7i','14i','20i','26i','31i','36i','40r','44r','47r','50r','52r','54p','56r','58p','60r','62p','65r','68p','71r','74p','78r','82p','86r','90p','95r','100p','105','110','116','122','128','134','142','150','158i','166i','174i','182i','191i','200i','210i','220i','230i','240i','250i','260i','270i','280i','290i','300i','310i','320i','330i','340e'],
  ],

  phases: [
    { name: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
    { name: '3', on: '3+2', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4+2', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5+3', trainLimit: 3, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '6', on: '6+3', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '7', on: '7+4', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '8', on: '8+4', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '9', on: '9+5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
  ],

  trains: [
    { name: '2+1', distance: 2, price: 250, rustsOn: '4+2', num: 5 },
    { name: '3+2', distance: 3, price: 300, rustsOn: '6+3', num: 4 },
    { name: '4+2', distance: 4, price: 350, rustsOn: '7+4', num: 3 },
    { name: '5+3', distance: 5, price: 400, rustsOn: '8+4', num: 2 },
    { name: '6+3', distance: 6, price: 500, num: 2, events: ['fishbourne_to_bank'] },
    { name: '7+4', distance: 7, price: 600, num: 1 },
    { name: '8+4', distance: 8, price: 700, num: 1, events: ['relax_cert_limit'] },
    { name: '9+5', distance: 9, price: 800, num: 16, events: ['southern_forms'] },
  ],

  corporations: [
    { sym: 'C&N', name: 'Cowes & Newport', tokens: [0,40,100,100], color: '#00bfff', textColor: '#000', coordinates: 'F2', floatPercent: 50 },
    { sym: 'IOW', name: 'Isle of Wight', tokens: [0,40,100,100], color: '#ff0000', coordinates: 'I3', floatPercent: 50 },
    { sym: 'IWNJ', name: 'Isle of Wight, Newport Junction', tokens: [0,40,100], color: '#000000', coordinates: 'G7', floatPercent: 50 },
    { sym: 'FYN', name: 'Freshwater, Yarmouth & Newport', tokens: [0,40,100], color: '#008000', coordinates: 'B4', floatPercent: 50 },
    { sym: 'NGStL', name: 'Newport, Godshill & St. Lawrence', tokens: [0,40], color: '#ffff00', textColor: '#000', coordinates: 'G9', floatPercent: 50 },
    { sym: 'BHI&R', name: 'Brading Harbour Improvement & Railway', tokens: [0,40], color: '#8b008b', coordinates: 'L6', floatPercent: 50 },
    { sym: 'S&C', name: 'Shanklin & Chale', tokens: [0,40], color: '#00008b', coordinates: 'F12', floatPercent: 50 },
    { sym: 'VYSC', name: 'Ventor, Yarmouth & South Coast', tokens: [0,40], color: '#9acd32', textColor: '#000', coordinates: 'E9', floatPercent: 50 },
  ],

  pregame: [],

  variants: {
    'remove_hexes': {
      label: 'Remove Hexes',
      desc: 'Remove hexes A5, A7, B4, E11 from the map. Add B4 as a city.',
    },
  },

  companies: [
    { sym: 'BHC', name: 'Brading Harbour Company', value: 30, revenue: 5,
      desc: 'Can be exchanged for a share in the BHI&R public company.' },
    { sym: 'YHC', name: 'Yarmouth Harbour Company', value: 50, revenue: 10,
      desc: 'Can be exchanged for a share in the FYN public company.' },
    { sym: 'CMH', name: 'Cowes Marina and Harbour', value: 90, revenue: 20,
      desc: 'Can be exchanged for a share in the C&N public company.' },
    { sym: 'RPSC', name: 'Ryde Pier & Shipping Company', value: 130, revenue: 30,
      desc: 'Can be exchanged for a share in the IOW public company.' },
    { sym: 'FFC', name: 'Fishbourne Ferry Company', value: 200, revenue: 25,
      desc: 'Not available until the first 6+3 train has been purchased. Closes all other private companies.' },
  ],
}
