import { defaults } from './defaults.js'

export const g18rhl = {
  ...defaults,

  titleId: 'g18rhl',
  title: '18Rhl',
  subtitle: 'Rhineland',
  designer: 'Wolfram Janich',
  location: 'Rhineland, Germany',
  minPlayers: 3,
  maxPlayers: 6,

  bankCash: 9000,
  startingCash: { 3: 600, 4: 450, 5: 360, 6: 300 },
  certLimit: { 3: 20, 4: 15, 5: 12, 6: 10 },
  currencyFormat: 'M',

  capitalization: 'full',
  floatPercent: 50,
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_block',
  sellAfter: 'operate',
  ebuyFromOthers: 'never',

  gameEndCheck: { bank: 'full_or' },

  market: [
    ['75','80','90','100p','110','120','135','150','165','180','200','220','240','265','290','320','350'],
    ['70','75','80p','90p','100','110','120','135','150','165','180','200','220','240'],
    ['65','70p','75p','80','90','100','110','120','135','150','165'],
    ['60p','65p','70','75','80','90','100'],
    ['55','60','65','70'],
    ['50','55','60'],
  ],

  phases: [
    { name: '2', on: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
    { name: '3', on: '3', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3, events: ['close_companies'] },
    { name: '6', on: '6', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '8', on: '8', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 3 },
  ],

  trains: [
    { name: '2', distance: 2, price: 100, rustsOn: '4', num: 6 },
    { name: '3', distance: 3, price: 200, rustsOn: '6', num: 5 },
    { name: '4', distance: 4, price: 300, rustsOn: '8', num: 3 },
    { name: '5', distance: 5, price: 500, num: 3, events: ['close_companies'] },
    { name: '6', distance: 6, price: 600, num: 6, availableOn: '5' },
    { name: '8', distance: 8, price: 800, num: 4, availableOn: '6' },
  ],

  corporations: [
    { sym: 'ADR', name: 'Aachen-Düsseldorf-Ruhrorter E.', tokens: [0,60,80], color: '#008000', coordinates: 'K2', floatPercent: 50 },
    { sym: 'BME', name: 'Bergisch-Märkische Eisenbahngesell.', tokens: [0,60,80,100], color: '#8b4513', coordinates: 'F13', floatPercent: 50 },
    { sym: 'CME', name: 'Cöln-Mindener Eisenbahngesellschaft', tokens: [0,60,80,100], color: '#CD5C5C', coordinates: 'I10', floatPercent: 50 },
    { sym: 'DEE', name: 'Düsseldorf Elberfelder Eisenbahn', tokens: [0,60], color: '#ffff00', textColor: '#000', coordinates: 'F9', floatPercent: 50 },
    { sym: 'KEG', name: 'Krefelder Eisenbahngesellschaft', tokens: [0,60], color: '#ffa500', textColor: '#000', coordinates: 'D7', floatPercent: 60,
      shares: [20,10,20,20,10,10,10], desc: 'First two non-president IPO shares are 20% certificates.' },
    { sym: 'GVE', name: 'Gladbach-Venloer Eisenbahn', tokens: [0,60], color: '#808080', coordinates: 'G6', floatPercent: 50 },
    { sym: 'CCE', name: 'Cöln-Crefelder Eisenbahn', tokens: [0,0,80], color: '#0000ff', coordinates: 'E6', floatPercent: 50,
      desc: 'Two home stations (Köln & Krefeld).' },
    { sym: 'RhE', name: 'Rheinische Eisenbahngesellschaft', tokens: [0,60,80,100], color: '#800080', coordinates: 'I10', floatPercent: 50,
      desc: 'Special par/float rules via Private No. 6. Can only par at 70, 75, or 80.' },
  ],

  pregame: [{ id: 'auction', label: 'Private Auction', type: 'english' }],

  variants: {
    'optional_2_train': {
      label: 'Optional 2-Train',
      desc: 'Add a 7th 2-train to the supply.',
    },
    'lower_starting_capital': {
      label: 'Lower Starting Capital',
      desc: 'Total starting capital reduced to M1500. Recommended for 3-4 players.',
      startingCash: { 3: 500, 4: 375, 5: 300, 6: 250 },
    },
    'promotion_tiles': {
      label: 'Promotion Tiles',
      desc: 'Adds extra tiles to the game.',
    },
    'ratingen_variant': {
      label: 'Ratingen Variant',
      desc: 'Based on construction of Angertalbahn (Anger valley railway).',
    },
  },

  companies: [
    { sym: 'PWB', name: 'Prinz Wilhelm-Bahn', value: 20, revenue: 5,
      desc: 'Blocks hex E14. Director may place first tile there.' },
    { sym: 'ATB', name: 'Angertalbahn', value: 20, revenue: 5,
      desc: 'Director may place free tile on E12 in green phase. Closes after use.' },
    { sym: 'KEO', name: 'Konzession Essen-Osterath', value: 30, revenue: 0,
      desc: 'Director may lay orange tile #935 on E8 + free station token. Available from green phase.' },
    { sym: 'Szl', name: 'Seilzuganlage', value: 50, revenue: 15,
      desc: 'Director may place free tile on mountain hex (one-time use).' },
    { sym: 'Tjt', name: 'Trajektanstalt', value: 80, revenue: 20,
      desc: 'Director may upgrade one yellow hex of Köln/Düsseldorf/Duisburg to green for free + optional token.' },
    { sym: 'NLK', name: 'Niederrheinische Licht- und Kraftwerke', value: 120, revenue: 25,
      desc: 'Buyer receives free 10% GVE share. GVE only needs 40% to float.' },
    { sym: 'RhE-P', name: 'Director\'s Certificate of RhE', value: 140, revenue: 0,
      desc: 'Buyer must set RhE par (70/75/80). Three 10% shares go to Bank Pool. Delayed par payment until Köln-Aachen track link.' },
  ],
}
