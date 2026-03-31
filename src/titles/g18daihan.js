import { defaults } from './defaults.js'

export const g18daihan = {
  ...defaults,
  titleId: 'g18daihan', wip: true, title: '1899 Daihan', subtitle: 'Railways of the Korean Empire', designer: 'Geonil',
  location: 'Korean Peninsula', minPlayers: 3, maxPlayers: 5,
  bankCash: 7600,
  startingCash: { 3: 440, 4: 400, 5: 380 },
  certLimit: { 3: 20, 4: 16, 5: 13 },
  currencyFormat: '￦', capitalization: 'full', floatPercent: 50, sellBuyOrder: 'sell_buy',
  // Float: 5 of 10 shares sold from IPO → 10x par goes to corp
  // Par values: 65, 70, 75, 80, 90, 100
  // Stations: par 65-75 = 2 stations, par 80-100 = 3 stations
  // Sell movement: down per share (stays at bottom of column)
  // Withhold: left (down if at leftmost)
  // Dividend: right (up if blocked)
  // Sold-out: up at end of SR
  sellMovement: 'down_share',

  // Stock market — single track per corp on the board
  // Par values in grey boxes
  market: [
    ['65p','70p','75p','80p','90p','100p','110','120','130','140','150','160','170','180','190','200','220','240','260','280','300','330','360','400'],
  ],

  // Phases — based on rules text about train rusting and tile colors
  phases: [
    { name: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
    { name: '3', on: '3', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '6', on: '6', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: 'D', on: 'D', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
  ],

  // Trains — 28 total from components list
  // 2-trains rust on 4, 3-trains rust on 5, 4-trains rust on D
  // D-trains: ￦800 (with scrap), unlimited range
  // D purchase advances stock price 1-3 spaces
  trains: [
    { name: '2', distance: 2, price: 80, rustsOn: '4', num: 6 },
    { name: '3', distance: 3, price: 180, rustsOn: '5', num: 5 },
    { name: '4', distance: 4, price: 300, rustsOn: 'D', num: 4 },
    { name: '5', distance: 5, price: 450, num: 3 },
    { name: '6', distance: 6, price: 630, num: 2 },
    { name: 'D', distance: 999, price: 800, num: 8, events: ['signal_end_game'],
      desc: 'Cost ￦800 if scrapping existing train. Purchase advances stock price 1-3 spaces.' },
  ],

  // 8 corporations (from component list: 8 charters, 72 stock certificates = 8 corps x 9 certs)
  // 10 shares each: 1x President (2 shares) + 8x regular (1 share each)
  corporations: [
    { sym: 'KR', name: 'Gyeongbu Railway', tokens: [0,40,40,40], color: '#d81e3e', coordinates: 'Hanseong',
      desc: 'Korean national railway. Seoul to Busan.' },
    { sym: 'GI', name: 'Gyeongin Railway', tokens: [0,40,40,40], color: '#025aaa', coordinates: 'Incheon',
      desc: 'First Korean railway. Seoul to Incheon.' },
    { sym: 'HN', name: 'Honam Railway', tokens: [0,40,40], color: '#237333', coordinates: 'Daejeon',
      desc: 'Western route to Mokpo.' },
    { sym: 'GW', name: 'Gyeongwon Railway', tokens: [0,40,40], color: '#474548', coordinates: 'Wonsan',
      desc: 'Northern route to Wonsan.' },
    { sym: 'JR', name: 'Japan Railway (Chosen)', tokens: [0,40,40,40], color: '#FFF500', textColor: '#000', coordinates: 'Busan',
      desc: 'Japanese-backed railway.' },
    { sym: 'RR', name: 'Russian Railway (Manchuria)', tokens: [0,40,40,40], color: '#800080', coordinates: 'Sinuiju',
      desc: 'Russian-backed railway from the north.' },
    { sym: 'BH', name: 'Buha Railroad', tokens: [0,40,40], color: '#f48221', coordinates: 'Pyongyang',
      desc: 'Regional railway.' },
    { sym: 'YN', name: 'Yeongnam Railway', tokens: [0,40,40], color: '#00a993', coordinates: 'Daegu',
      desc: 'Regional railway.' },
  ],

  pregame: [{ id: 'auction', label: 'Private Auction', type: 'waterfall' }],

  // 7 private companies
  companies: [
    { sym: 'A', name: 'Seoul Tram', value: 20, revenue: 5,
      desc: 'Hanseong tile cannot be upgraded while this company is not sold or discarded. Auctioned last.' },
    { sym: 'B', name: 'Grain Export Association', value: 50, revenue: 10,
      desc: 'Grants track construction ability. Track must connect to corp\'s existing tracks. Cannot build on resource tiles.' },
    { sym: 'C', name: 'Mining Partnership Co.', value: 50, revenue: 10,
      desc: 'Grants track construction ability. Track must connect to corp\'s existing tracks.' },
    { sym: 'D', name: 'Joseon Mining Company', value: 50, revenue: 10,
      desc: 'Grants track construction ability. Track must connect to corp\'s existing tracks.' },
    { sym: 'E', name: 'Ginseng Public Company', value: 50, revenue: 10,
      desc: 'Grants track construction ability. Track must connect to corp\'s existing tracks.' },
    { sym: 'F', name: 'Park Ki-jong', value: 60, revenue: 15,
      desc: 'Not available for sale to corporation. Can be exchanged for one share of Buha Railroad / Yeongnam Railway IPO stock.' },
    { sym: 'G', name: 'Kyeongin Railway Co.', value: 120, revenue: 30,
      desc: '50% revenue to owner, 50% to bank. When acquired by corp, converts station to corp token + gets 2-train. Rusts at phase 4. Removed if unpurchased at phase 5.' },
  ],

  // Executive cars: 12 tokens that attach to trains for +1 stop range
  executiveCars: { count: 12 },

  // Goods transport: Product Hub tokens on ports/borders
  goodsTransport: true,

  gameEndCheck: {
    bankrupt: 'immediate',
    bank: 'full_or',
    finalTrain: 'current_or', // D-train purchase
  },
}
