import { defaults } from './defaults.js'

export const g18do_hsb = {
  ...defaults,

  titleId: 'g18do_hsb', wip: true,
  title: '18DO HSB',
  subtitle: 'Dortmund — Heat, Sweat & Beer',
  designer: 'Wolfram Janich & Michael Scharf',
  location: 'Dortmund, Germany',
  minPlayers: 3,
  maxPlayers: 5,

  bankCash: 13000,
  startingCash: { 3: 465, 4: 465, 5: 465 },
  certLimit: { 3: 26, 4: 19, 5: 18 },
  currencyFormat: 'M',

  floatPercent: 50,
  capitalization: 'full',
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_share',
  marketShareLimit: 50,
  maxOwnership: { 3: 70, 4: 60, 5: 60 },

  // HSB uses two linear stock market tracks (railways + breweries)
  // Both have same values. Includes bankruptcy space.
  market: [
    ['250','220','200','180','160','145','130','115','100','90','80','75','70','56','60','55','50','40','30','10'],
  ],

  phases: [
    { name: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1,
      breweryLimit: { minor: 3 } },
    { name: '3', on: '3', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2,
      breweryLimit: { minor: 3, corp: 4 } },
    { name: '4', on: '4', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2,
      breweryLimit: { minor: 2, corp: 3 } },
    { name: '5', on: '5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 2,
      breweryLimit: { minor: 1, corp: 2 } },
    { name: '6', on: '6', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3,
      breweryLimit: { minor: 1, corp: 2 } },
    { name: '8', on: '8', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 3,
      breweryLimit: { minor: 1, corp: 2 } },
  ],

  // Capex cards (dual-use: train for railways, BAK for breweries)
  trains: [
    { name: '2', distance: 2, price: 10, rustsOn: '4', num: { 3: 14, 4: 18, 5: 22 } },
    { name: '3', distance: 3, price: 15, rustsOn: '6', num: { 3: 8, 4: 11, 5: 13 } },
    { name: '4', distance: 4, price: 20, rustsOn: '8', num: { 3: 1, 4: 6, 5: 10 }, events: ['final_run_on_rust'] },
    { name: '5', distance: 5, price: 30, num: { 3: 5, 4: 6, 5: 7 } },
    { name: '6', distance: 6, price: 50, num: { 3: 12, 4: 14, 5: 15 } },
    { name: '8', distance: 8, price: 30, num: 12, availableOn: '6' },
  ],

  // Railway corporations (same as TRG)
  // For 3-4 players: HHW not used
  corporations: [
    { sym: 'BME', name: 'Bergisch-Märkische Eisenbahn', tokens: [0,30,30,30,30,30], color: '#d81e3e', coordinates: 'I10', type: 'railway' },
    { sym: 'CME', name: 'Cöln-Mindener Eisenbahn', tokens: [0,30,30,30,30,30], color: '#237333', coordinates: 'A2', type: 'railway' },
    { sym: 'RhE', name: 'Rheinische Eisenbahn', tokens: [0,30,30,30,30,30], color: '#025aaa', coordinates: 'H1', type: 'railway' },
    { sym: 'KWE', name: 'Königlich-Westfälische Eisenbahn', tokens: [0,30,30,30], color: '#FFF500', textColor: '#000', coordinates: 'C20', type: 'railway' },
    { sym: 'DGEE', name: 'Dortmund-Gronau-Enscheder Eisenbahn', tokens: [0,30,30], color: '#f48221', coordinates: 'A18', type: 'railway' },
    { sym: 'DHB', name: 'Dortmunder Hafenbahn', tokens: [0,30,30], color: '#474548', coordinates: 'C8', type: 'railway',
      shares: [20, 20, 10, 10, 10, 10, 10, 10] },
    { sym: 'HHW', name: 'Dortmunder Hansabahn', tokens: [0,30,30], color: '#95c054', coordinates: 'H19', type: 'railway',
      minPlayers: 5, desc: '5 players only.' },

    // Brewery corporations (available after green phase)
    { sym: 'DUB', name: 'Dortmunder Union-Brauerei', tokens: [0], color: '#c8a23c', type: 'brewery',
      shares: [30, 10, 10, 10, 10, 10, 20] },
    { sym: 'DAB', name: 'Dortmunder Actien-Brauerei', tokens: [0], color: '#8b4513', type: 'brewery',
      shares: [20, 20, 20, 10, 10, 10, 10] },
    { sym: 'RIT', name: 'Ritter-Brauerei', tokens: [0], color: '#006400', type: 'brewery',
      shares: [30, 10, 10, 10, 10, 10, 20] },
    { sym: 'KRO', name: 'Kronen-Brauerei Dortmund', tokens: [0], color: '#8b0000', type: 'brewery',
      shares: [30, 10, 10, 10, 10, 10, 20] },
    { sym: 'STI', name: 'Stifts-Brauerei', tokens: [0], color: '#4b0082', type: 'brewery',
      shares: [40, 10, 10, 10, 10, 20] },
    { sym: 'DHB-B', name: 'Dortmunder Hansa-Brauerei', tokens: [0], color: '#2f4f4f', type: 'brewery',
      shares: [30, 10, 10, 10, 10, 10, 10, 10],
      minPlayers: 5, desc: '5 players only.' },
  ],

  pregame: [{ id: 'purchase', label: 'Buy Small Breweries', type: 'purchase' }],

  // Small breweries (bought during starting round, one per player)
  companies: [
    { sym: 'B1', name: 'Brauerei Ross & Co.', value: 80, revenue: 0,
      desc: 'Small brewery. Starting equipment: 2x BEC-1.' },
    { sym: 'B2', name: 'Privatbrauerei Kronen', value: 90, revenue: 0,
      desc: 'Small brewery. Starting equipment: 3x BEC-1.' },
    { sym: 'B3', name: 'Tremonia Brauerei F. Lehmnkuhl', value: 100, revenue: 0,
      desc: 'Small brewery. Starting equipment: 1x BEC-2.' },
    { sym: 'B4', name: 'Borussia Brauerei', value: 120, revenue: 0,
      desc: 'Small brewery. Starting equipment: 1x BEC-1, 1x BEC-2.' },
    { sym: 'B5', name: 'Bürgerliches Brauhaus Eduard Frantzen', value: 135, revenue: 0,
      desc: 'Small brewery. Starting equipment: 1x BEC-1, 1x BEC-2.' },
    { sym: 'B6', name: 'Quellen-Brauerei', value: 155, revenue: 0,
      desc: 'Small brewery. Starting equipment: 2x BEC-1, 1x BEC-2.' },
    { sym: 'B7', name: 'Dampfbierbrauerei Herberz & Co.', value: 165, revenue: 0,
      desc: 'Small brewery. Starting equipment: 2x BEC-2.' },
    { sym: 'B8', name: 'Dortmunder Löwenbrauerei', value: 185, revenue: 0,
      desc: 'Small brewery. Starting equipment: 1x BEC-1, 2x BEC-2.' },
  ],

  // HSB: fixed game length, no bank-break trigger
  gameEndCheck: {
    fixed_round: 'current_or',
  },
  fixedRounds: 6,

  // Beer market segment income values
  beerMarket: {
    segments: [
      { id: 1, regularIncome: 15, newIncome: 10 },
      { id: 2, regularIncome: 20, newIncome: 15 },
      { id: 3, regularIncome: 30, newIncome: 20 },
      { id: 4, regularIncome: 45, newIncome: 30 },
      { id: 5, regularIncome: 60, newIncome: 45 },
      { id: 6, regularIncome: 100, newIncome: 60 },
    ],
    exportIncome: 100,
    initialStock: { 3: 8, 4: 8, 5: 10 },
  },
}
