import { defaults } from './defaults.js'

export const g1858 = {
  ...defaults,
  titleId: 'g1858', title: '1858', subtitle: 'The Railways of Iberia', designer: 'Ian D. Wilson',
  location: 'Iberia', minPlayers: 2, maxPlayers: 6,
  bankCash: { 2: 8000, 3: 12000, 4: 12000, 5: 12000, 6: 12000 },
  startingCash: { 2: 500, 3: 500, 4: 375, 5: 300, 6: 250 },
  certLimit: { 2: 21, 3: 21, 4: 16, 5: 13, 6: 11 },
  currencyFormat: 'Pt', capitalization: 'incremental', floatPercent: 40, sellBuyOrder: 'sell_buy',
  market: [
    ['0c','50','60','65','70p','80p','90p','100p','110p','120p','135p','150p','165','180','200','220','245','270','300'],
  ],
  phases: [
    { name: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 2 },
    { name: '3', on: '4H', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '6H', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5E', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '6', on: '6E', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '7', on: '7E', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
  ],
  trains: [
    { name: '2H', distance: 2, price: 100, rustsOn: '6E', num: 10 },
    { name: '4H', distance: 4, price: 200, rustsOn: '7E', num: 6, variants: [{ name: '2M', price: 100 }] },
    { name: '6H', distance: 6, price: 300, num: 4, variants: [{ name: '3M', price: 200 }] },
    { name: '5E', distance: 5, price: 500, num: 3, variants: [{ name: '4M', price: 400 }] },
    { name: '6E', distance: 6, price: 650, num: 2, variants: [{ name: '5M', price: 550 }] },
    { name: '7E', distance: 7, price: 800, num: 2, variants: [{ name: '6M', price: 700 }] },
    { name: '5D', distance: 5, price: 1100, num: 99, availableOn: '7' },
  ],
  corporations: [
    { sym: 'A', name: 'Andalucian Railway', tokens: [0,20,20], color: '#3751dc', floatPercent: 40 },
    { sym: 'AVT', name: 'Almanza, Valencia and Tarragona Railway', tokens: [0,20,20], color: '#18a6d8', floatPercent: 40 },
    { sym: 'MZA', name: 'Madrid, Zaragoza and Alicante Railway', tokens: [0,20,20], color: '#fff114', textColor: '#000', floatPercent: 40 },
    { sym: 'N', name: 'Northern Railway', tokens: [0,20,20], color: '#000000', floatPercent: 40 },
    { sym: 'RP', name: 'Royal Portuguese Railway', tokens: [0,20,20], color: '#e51f2e', floatPercent: 40 },
    { sym: 'TBF', name: 'Tarragona, Barcelona and France Railway', tokens: [0,20,20], color: '#59227f', floatPercent: 40 },
    { sym: 'W', name: 'Western Railway', tokens: [0,20,20], color: '#109538', floatPercent: 40 },
    { sym: 'ZPB', name: 'Zaragoza, Pamplona and Barcelona Railway', tokens: [0,20,20], color: '#ff7700', floatPercent: 40 },
  ],

  pregame: [{ id: 'auction', label: 'Private Auction', type: 'english' }],

  companies: [
    { sym: 'B&M', name: 'Barcelona and Mataró Railway', value: 115, revenue: 23, desc: 'Can start a public company in Barcelona.' },
    { sym: 'M&A', name: 'Madrid and Aranjuez Railway', value: 125, revenue: 25, desc: 'Can start a public company in Madrid.' },
    { sym: 'P&L', name: 'Porto and Lisbon Railway', value: 110, revenue: 22, desc: 'Can start a public company in Porto.' },
    { sym: 'V&J', name: 'Valencia and Jativa Railway', value: 100, revenue: 20, desc: 'Can start a public company in Valencia.' },
    { sym: 'L&C', name: 'Lisbon and Carregado Railway', value: 90, revenue: 18, desc: 'Can start a public company in Lisboa.' },
    { sym: 'M&V', name: 'Madrid and Valladolid Railway', value: 120, revenue: 24, desc: 'Can start a public company in Madrid or Valladolid.' },
    { sym: 'M&Z', name: 'Madrid and Zaragoza Railway', value: 95, revenue: 19, desc: 'Can start a public company in Zaragoza.' },
    { sym: 'C&S', name: 'Córdoba and Seville Railway', value: 105, revenue: 21, desc: 'Can start a public company in Sevilla or Córdoba.' },
    { sym: 'H&G', name: 'Havana and Güines Railway', value: 30, revenue: 10, desc: 'Cannot be used to start a public company.' },
    { sym: 'R&T', name: 'Reus and Tarragona Railway', value: 60, revenue: 12, desc: 'Cannot start a public company.' },
  ],
}
