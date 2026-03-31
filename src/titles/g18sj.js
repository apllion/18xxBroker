import { defaults } from './defaults.js'

export const g18sj = {
  ...defaults,

  titleId: 'g18sj',
  title: '18SJ',
  subtitle: 'Railways in the Frozen North',
  designer: 'Örjan Wennman',
  location: 'Sweden',
  minPlayers: 2,
  maxPlayers: 6,

  bankCash: 10000,
  startingCash: { 2: 1200, 3: 800, 4: 600, 5: 480, 6: 400 },
  // Cert limit depends on number of corps in play
  certLimit: { 2: 39, 3: 26, 4: 20, 5: 16, 6: 13 },
  currencyFormat: 'kr',

  capitalization: 'incremental', // switches to full in phase 5
  floatPercent: 60,
  sellBuyOrder: 'sell_buy_sell',

  gameEndCheck: {
    bankrupt: 'immediate',
    stockMarket: 'current_or',
    bank: 'full_or',
  },

  market: [
    ['82m','90','100p','110','125','140','160','180','200','225','250','275','300','325','350','375e','400e'],
    ['76','82m','90p','100','110','125','140','160','180','200','220','240','260','280','300'],
    ['71','76','82pm','90','100','110','125','140','155','170','185','200'],
    ['67','71','76p','82m','90','100','110','120','140'],
    ['65','67','71p','76','82m','90','100'],
    ['63y','65','67p','71','76','82'],
    ['60y','63y','65','67','71'],
    ['50o','60y','63y','65'],
    ['40b','50o','60y'],
    ['30b','40b','50o'],
    ['20b','30b','40b'],
  ],

  phases: [
    { name: '2', on: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
    { name: '3', on: '3', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2, events: ['nationalization'] },
    { name: '5', on: '5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3, events: ['close_companies','full_cap'] },
    { name: '6', on: '6', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 3, events: ['nationalization'] },
    { name: 'D', on: 'D', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 3, events: ['nationalization'] },
    { name: 'E', on: 'E', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 3 },
  ],

  trains: [
    { name: '2', distance: 2, price: 80, rustsOn: '4', num: 7 },
    { name: '3', distance: 3, price: 180, rustsOn: '6', num: 5 },
    { name: '4', distance: 4, price: 300, rustsOn: 'D', num: 4 },
    { name: '5', distance: 5, price: 530, num: 3, events: ['close_companies','full_cap'] },
    { name: '6', distance: 6, price: 630, num: 2 },
    { name: 'D', distance: 999, price: 1100, num: 20, availableOn: '6',
      discount: { '4': 300, '5': 300, '6': 300 },
      variants: [{ name: 'E', price: 1300 }] },
  ],

  corporations: [
    { sym: 'BJ', name: 'Bergslagernas järnvägar AB', tokens: [0,40,100], color: '#7b352a', coordinates: 'A10' },
    { sym: 'KFJ', name: 'Kil-Fryksdalens Järnväg', tokens: [0,40,100], color: '#ffc0cb', textColor: '#000', coordinates: 'C16' },
    { sym: 'MYJ', name: 'Malmö-Ystads järnväg', tokens: [0,40,100], color: '#FFF500', textColor: '#000', coordinates: 'A2' },
    { sym: 'MÖJ', name: 'Mellersta Östergötlands Järnvägar', tokens: [0,40], color: '#40e0d0', textColor: '#000', coordinates: 'E8' },
    { sym: 'SNJ', name: 'Swedish-Norwegian Railroad Company', tokens: [0,40,100,100], color: '#0000ff', coordinates: 'G26' },
    { sym: 'STJ', name: 'Sundsvall-Torphammars järnväg', tokens: [0,40,100,100], color: '#0a0a0a', coordinates: 'F19' },
    { sym: 'SWB', name: 'Stockholm-Västerås-Bergslagens Järnvägar', tokens: [0,40], color: '#237333', coordinates: 'G10' },
    { sym: 'TGOJ', name: 'Grängesberg-Oxelösunds järnvägar', tokens: [0,40,100,100], color: '#f48221', coordinates: 'D19' },
    { sym: 'UGJ', name: 'Uppsala-Gävle järnväg', tokens: [0,40,100], color: '#00ff00', textColor: '#000', coordinates: 'F13' },
    { sym: 'ÖKJ', name: 'Örebro-Köpings järnvägsaktiebolag', tokens: [0,40], color: '#800080', coordinates: 'C12' },
    { sym: 'ÖSJ', name: 'Östra Skånes Järnvägsaktiebolag', tokens: [0,40,100], color: '#d81e3e', coordinates: 'C2' },
    // Minor
    { sym: 'KHJ', name: 'Köping-Hults järnväg', tokens: [0], color: '#fff', textColor: '#000', coordinates: 'D15', type: 'minor', floatPercent: 100, shares: [100] },
  ],

  pregame: [{ id: 'auction', label: 'Private Auction', type: 'english' }],

  variants: {
    'oscarian_era': {
      label: 'The Oscarian Era',
      desc: 'Full capitalization only (no incremental phase). Can sell shares even if corp not floated.',
      capitalization: 'full',
    },
  },

  companies: [
    { sym: 'FRY', name: 'Frykstadsbanan', value: 20, revenue: 5, desc: 'Blocks hex B17.' },
    { sym: 'NOJ', name: 'Nässjö-Oskarshamns järnväg', value: 20, revenue: 5, desc: 'Blocks hex D9.' },
    { sym: 'GKB', name: 'Göta kanalbolag', value: 40, revenue: 15,
      desc: 'Corp places three Göta kanal bonus tokens (50/30/20) on canal hexes. Bonus added to routes through those hexes.' },
    { sym: 'SB', name: 'Sveabolaget', value: 45, revenue: 15,
      desc: 'May place/shift port token. Adds kr30 to routes through that port.' },
    { sym: 'GC', name: 'The Gellivare Company', value: 70, revenue: 15,
      desc: 'Two extra track lays in E28/F27. Reduced terrain costs in D29/C30. Blocks E28/F27.' },
    { sym: 'MV', name: 'Motala Verkstad', value: 90, revenue: 20,
      desc: 'Corp may buy trains before (instead of after) running routes, once per game.' },
    { sym: 'NOHAB', name: 'Nydqvist och Holm AB', value: 90, revenue: 20,
      desc: 'May buy one train at half price (one-time).' },
    { sym: 'KHJ', name: 'Köping-Hults järnväg', value: 140, revenue: 0,
      desc: 'Controls the KHJ minor. Minor starts with 2-train and token. Splits revenue with owner.' },
    { sym: 'NE', name: 'Nils Ericson', value: 220, revenue: 25,
      desc: 'Receives random president\'s share. May once take priority deal. Cannot be bought by corp. Closes when connected corp buys first train.' },
    { sym: 'AEvR', name: 'Adolf Eugene von Rosen', value: 220, revenue: 30,
      desc: 'Receives president\'s share in ÖKJ. Cannot be bought by corp. Closes when ÖKJ buys first train.' },
  ],
}
