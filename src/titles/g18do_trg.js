import { defaults } from './defaults.js'

export const g18do_trg = {
  ...defaults,

  titleId: 'g18do_trg', wip: true,
  title: '18DO TRG',
  subtitle: 'Dortmund — The Railway Game',
  designer: 'Wolfram Janich & Michael Scharf',
  location: 'Dortmund, Germany',
  minPlayers: 3,
  maxPlayers: 5,

  bankCash: 9000,
  startingCash: { 3: 375, 4: 340, 5: 320 },
  certLimit: { 3: 17, 4: 13, 5: 10 },
  currencyFormat: 'M',

  floatPercent: 50,
  capitalization: 'full',
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_share',
  marketShareLimit: 50,

  // Per-player max ownership varies: 3p=70%, 4-5p=60%
  maxOwnership: { 3: 70, 4: 60, 5: 60 },

  // 2D stock market grid
  // Movement: withhold=left (bottom if at edge), pay<price=none, pay>=price=right, pay>=3x=right2, sell=down/share, sold-out=up
  market: [
    ['380','350','320','290','265','240','220','200','180','165','150','135','120','110','100','90','80','75','70'],
    ['260','240','220','200','180','165','150','135','120','110','100','90','80','75','70','65'],
    ['165','150','135','120','110','100p','90p','80p','75p','70','65','60'],
    ['100','90','80','75','70','65p','60p','55p','50'],
    ['70','65','60','55','50','40'],
    ['60','55','50','40','20'],
  ],

  phases: [
    { name: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
    { name: '3', on: '3', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '6', on: '6', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '8', on: '8', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 3 },
  ],

  trains: [
    { name: '2', distance: 2, price: 80, rustsOn: '4', num: 7 },
    { name: '3', distance: 3, price: 180, rustsOn: '6', num: 5 },
    { name: '4', distance: 4, price: 300, rustsOn: '8', num: 3, events: ['final_run_on_rust'] },
    { name: '5', distance: 5, price: 450, num: 2 },
    { name: '6', distance: 6, price: 630, num: 3 },
    { name: '8', distance: 8, price: 800, num: 6, availableOn: '6' },
  ],

  corporations: [
    { sym: 'BME', name: 'Bergisch-Märkische Eisenbahn', tokens: [0,30,30,30,30,30], color: '#d81e3e', coordinates: 'I10',
      desc: 'May buy a train before laying tile in first OR.' },
    { sym: 'CME', name: 'Cöln-Mindener Eisenbahn', tokens: [0,30,30,30,30,30], color: '#237333', coordinates: 'A2',
      desc: 'May buy a train before laying tile in first OR.' },
    { sym: 'RhE', name: 'Rheinische Eisenbahn', tokens: [0,30,30,30,30,30], color: '#025aaa', coordinates: 'H1',
      desc: 'May buy a train before laying tile in first OR.' },
    { sym: 'KWE', name: 'Königlich-Westfälische Eisenbahn', tokens: [0,30,30,30], color: '#FFF500', textColor: '#000', coordinates: 'C20',
      desc: 'Free coal mine siding token (value 10) at start of first OR.' },
    { sym: 'DGEE', name: 'Dortmund-Gronau-Enscheder Eisenbahn', tokens: [0,30,30], color: '#f48221', coordinates: 'A18',
      desc: 'Available after KWE is founded.' },
    { sym: 'DHB', name: 'Dortmunder Hafenbahn', tokens: [0,30,30], color: '#474548', coordinates: 'C8',
      shares: [20, 20, 10, 10, 10, 10, 10, 10],
      desc: 'Available after DGEE is founded.' },
    { sym: 'HHW', name: 'Dortmunder Hansabahn', tokens: [0,30,30], color: '#95c054', coordinates: 'H19',
      desc: 'Available after DGEE is founded. Cannot transport export beer. Trains may pass blocked steel mill hexes.' },
  ],

  pregame: [{ id: 'auction', label: 'Starting Round', type: 'english' }],

  companies: [
    { sym: 'PB1', name: 'Privatbrauerei Nr. 1', value: 20, revenue: 5,
      desc: 'Buying player receives 2 beer cubes placed on certificate.' },
    { sym: 'PB2', name: 'Privatbrauerei Nr. 2', value: 40, revenue: 10,
      desc: 'Reserves a station place on Dortmund City. Railway may build station at normal cost. Reservation expires in grey phase.' },
    { sym: 'PB3', name: 'Privatbrauerei Nr. 3', value: 60, revenue: 15,
      desc: 'Railway may build station on Dortmund City at 50% discount. Marker then removed.' },
    { sym: 'PB4', name: 'Privatbrauerei Nr. 4', value: 80, revenue: 20,
      desc: 'Railway gets +10 Mark income for every route with beer transport.' },
    { sym: 'PB5', name: 'Privatbrauerei Nr. 5', value: 100, revenue: 25,
      desc: 'Railway may transport 1 additional beer cube per OR. Can use type 3 or type 4 trains for beer transport.' },
  ],

  // TRG-specific: dividend movement rules
  // withhold: left 1 (down if at left edge)
  // pay > 0 but < price: no movement
  // pay >= price but < 3x: right 1
  // pay >= 3x price: right 2
  dividendMovement: 'trg_triple_jump',

  gameEndCheck: {
    bank: 'full_or',
  },
}
