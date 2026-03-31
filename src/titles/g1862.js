import { defaults } from './defaults.js'

export const g1862 = {
  ...defaults,
  titleId: 'g1862', title: '1862', subtitle: 'Railway Mania in the Eastern Counties', designer: 'Mike Hutton',
  location: 'Eastern Counties, England', minPlayers: 2, maxPlayers: 8,
  bankCash: 15000,
  startingCash: { 2: 1200, 3: 800, 4: 600, 5: 480, 6: 400, 7: 345, 8: 300 },
  certLimit: { 2: 25, 3: 18, 4: 13, 5: 11, 6: 10, 7: 9, 8: 8 },
  currencyFormat: '£', capitalization: 'full', floatPercent: 50, sellBuyOrder: 'sell_buy', sellAfter: 'round',
  // Shares: 30% president + 7x10%
  shares: [30, 10, 10, 10, 10, 10, 10, 10],
  // Single-row market
  market: [
    ['0c','7i','14i','20i','26i','31i','36i','40','44','47','50','52','54p','56r','58p','60r','62p','65r','68p','71r','74p','78r','82p','86r','90p','95r','100p','105r','110r','116r','122r','128r','134r','142r','150r','158r','166r','174r','182r','191r','200r','210i','220i','232i','245i','260i','275i','292i','310i','330i','350i','375i','400j','430j','460j','495j','530j','570j','610j','655j','700j','750j','800j','850j','900j','950j','1000e'],
  ],
  phases: [
    { name: 'A', trainLimit: 3, tiles: ['yellow'], operatingRounds: 1 },
    { name: 'B', on: 'B', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: 'C', on: 'C', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: 'D', on: 'D', trainLimit: 3, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: 'E', on: 'E', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: 'F', on: 'F', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: 'G', on: 'G', trainLimit: 3, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: 'H', on: 'H', trainLimit: 3, tiles: ['yellow','green','brown'], operatingRounds: 3 },
  ],
  trains: [
    { name: 'A', distance: 99, price: 100, rustsOn: 'C', num: 7 },
    { name: 'B', distance: 99, price: 200, rustsOn: 'E', num: 6 },
    { name: 'C', distance: 99, price: 280, rustsOn: 'F', num: 4 },
    { name: 'D', distance: 99, price: 360, rustsOn: 'G', num: 3 },
    { name: 'E', distance: 99, price: 500, num: 3 },
    { name: 'F', distance: 99, price: 600, num: 2 },
    { name: 'G', distance: 99, price: 700, num: 1 },
    { name: 'H', distance: 99, price: 800, num: 99, events: ['lner_trigger'] },
  ],
  corporations: [
    { sym: 'E&H', name: 'Ely & Huntingdon', tokens: [0,0,0], color: '#d81e3e', coordinates: 'C8' },
    { sym: 'ECR', name: 'Eastern Counties Railway', tokens: [0,0,0], color: '#237333', coordinates: 'D13' },
    { sym: 'ENR', name: 'East Norfolk Railway', tokens: [0,0,0], color: '#f48221', coordinates: 'F3' },
    { sym: 'ESR', name: 'East Suffolk Railway', tokens: [0,0,0], color: '#025aaa', coordinates: 'F11' },
    { sym: 'EUR', name: 'Eastern Union Railway', tokens: [0,0,0], color: '#FFF500', textColor: '#000', coordinates: 'E12' },
    { sym: 'FDR', name: 'Felixstowe Dock & Railway', tokens: [0,0,0], color: '#800080', coordinates: 'G12' },
    { sym: 'I&B', name: 'Ipswich & Bury Railway', tokens: [0,0,0], color: '#ADD8E6', textColor: '#000', coordinates: 'D9' },
    { sym: 'L&D', name: 'Lynn & Dereham Railway', tokens: [0,0,0], color: '#474548', coordinates: 'D5' },
    { sym: 'L&E', name: 'Lynn & Ely Railway', tokens: [0,0,0], color: '#00a993', coordinates: 'C6' },
    { sym: 'L&H', name: 'Lynn & Hunstanton Railway', tokens: [0,0,0], color: '#d88e39', coordinates: 'C4' },
    { sym: 'N&B', name: 'Norwich & Brandon Railway', tokens: [0,0,0], color: '#95c054', coordinates: 'E8' },
    { sym: 'N&E', name: 'Northern & Eastern Railway', tokens: [0,0,0], color: '#7b352a', coordinates: 'B13' },
    { sym: 'N&S', name: 'Norfolk & Suffolk Joint Railway', tokens: [0,0,0], color: '#0189d1', coordinates: 'H7' },
    { sym: 'Y&N', name: 'Yarmouth & Norwich Railway', tokens: [0,0,0], color: '#d1232a', coordinates: 'H5' },
    { sym: 'NGC', name: 'Newmarket & Great Chesterford', tokens: [0,0,0], color: '#32763f', coordinates: 'C10' },
    { sym: 'SVR', name: 'Colchester, Stour Valley, Sudbury & Halstead', tokens: [0,0,0], color: '#6f533e', coordinates: 'D11' },
    { sym: 'WNR', name: 'West Norfolk Railway', tokens: [0,0,0], color: '#ff1493', coordinates: 'E2' },
    { sym: 'W&F', name: 'Wells & Fakenham Railway', tokens: [0,0,0], color: '#76a042', coordinates: 'E4' },
    { sym: 'WVR', name: 'Waveney Valley Railway', tokens: [0,0,0], color: '#37383a', coordinates: 'G8' },
    { sym: 'WStI', name: 'Wisbech, St Ives & Cambridge Junction', tokens: [0,0,0], color: '#008080', coordinates: 'B5' },
  ],

  pregame: [{ id: 'auction', label: 'Private Auction', type: 'waterfall' }],

  variants: {
    'short_game': {
      label: 'Short Game',
      desc: 'Fewer A-trains (6) and B-trains (5). Faster game.',
      trains: [
        { name: 'A', distance: 99, price: 100, rustsOn: 'C', num: 6 },
        { name: 'B', distance: 99, price: 200, rustsOn: 'E', num: 5 },
        { name: 'C', distance: 99, price: 280, rustsOn: 'F', num: 4 },
        { name: 'D', distance: 99, price: 360, rustsOn: 'G', num: 3 },
        { name: 'E', distance: 99, price: 500, num: 3 },
        { name: 'F', distance: 99, price: 600, num: 2 },
        { name: 'G', distance: 99, price: 700, num: 1 },
        { name: 'H', distance: 99, price: 800, num: 99, events: ['lner_trigger'] },
      ],
    },
    'long_game': {
      label: 'Long Game',
      desc: 'More C-trains (5) and D-trains (4). Longer game.',
      trains: [
        { name: 'A', distance: 99, price: 100, rustsOn: 'C', num: 7 },
        { name: 'B', distance: 99, price: 200, rustsOn: 'E', num: 6 },
        { name: 'C', distance: 99, price: 280, rustsOn: 'F', num: 5 },
        { name: 'D', distance: 99, price: 360, rustsOn: 'G', num: 4 },
        { name: 'E', distance: 99, price: 500, num: 3 },
        { name: 'F', distance: 99, price: 600, num: 2 },
        { name: 'G', distance: 99, price: 700, num: 1 },
        { name: 'H', distance: 99, price: 800, num: 99, events: ['lner_trigger'] },
      ],
    },
  },

  companies: [],
}
