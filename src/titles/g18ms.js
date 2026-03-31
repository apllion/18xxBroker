import { defaults } from './defaults.js'

export const g18ms = {
  ...defaults,
  titleId: 'g18ms', title: '18MS', subtitle: 'The Railroads Come to Mississippi', designer: 'Mark Derrick',
  location: 'Mississippi, USA', minPlayers: 2, maxPlayers: 4,

  bankCash: 10000,
  startingCash: { 2: 900, 3: 625, 4: 525 },
  certLimit: { 2: 20, 3: 14, 4: 10 },
  currencyFormat: '$',

  capitalization: 'full',
  floatPercent: 60,
  maxOwnership: 70,

  market: [
    ['65y','70','75','80','90p','100','110','130','150','170','200','230','265','300'],
    ['60y','65y','70p','75p','80p','90','100','110','130','150','170','200','230','265'],
    ['50y','60y','65y','70','75','80','90','100','110','130','150'],
    ['45y','50y','60y','65y','70','75','80'],
    ['40y','45y','50y','60y'],
  ],

  phases: [
    { name: '2', trainLimit: 3, tiles: ['yellow'], operatingRounds: 2 },
    { name: '3', on: '3+', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '6', on: '6', trainLimit: 3, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: 'D', on: '2D', trainLimit: 3, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
  ],

  trains: [
    { name: '2+', distance: 2, price: 80, num: 5, desc: 'Salvage $20 on rust.' },
    { name: '3+', distance: 3, price: 180, num: 4, desc: 'Salvage $30 on rust.' },
    { name: '4+', distance: 4, price: 300, num: 3, desc: 'Salvage $60 on rust.' },
    { name: '5', distance: 5, price: 500, num: 2 },
    { name: '6', distance: 6, price: 550, num: 2, events: ['close_companies','remove_tokens'] },
    { name: '2D', distance: 2, price: 500, num: 4, availableOn: '6', desc: 'Multiplier: runs route value x2. Variant: 4D at $750.' },
    { name: '5D', distance: 5, price: 850, num: 1, availableOn: '6', desc: 'Multiplier: runs route value x2.' },
  ],

  corporations: [
    { sym: 'GMO', name: 'Gulf, Mobile and Ohio Railroad', tokens: [0,40,100,100], color: '#000000', coordinates: 'H6' },
    { sym: 'IC', name: 'Illinois Central Railroad', tokens: [0,40,100], color: '#397641', coordinates: 'A1' },
    { sym: 'L&N', name: 'Louisville and Nashville Railroad', tokens: [0,40,100], color: '#0d5ba5', coordinates: 'C9' },
    { sym: 'Fr', name: 'Frisco', tokens: [0,40,100], color: '#ed1c24', coordinates: 'E1' },
    { sym: 'WRA', name: 'Western Railway of Alabama', tokens: [0,40,100], color: '#c7c4e2', textColor: '#000', coordinates: 'E11' },
  ],

  pregame: [{ id: 'draft', label: 'Draft', type: 'draft' }],

  companies: [
    { sym: 'AGS', name: 'Alabama Great Southern Railroad', value: 30, revenue: 15,
      desc: 'Extra free yellow tile lay adjacent to Birmingham.' },
    { sym: 'BS', name: 'Birmingham Southern Railroad', value: 40, revenue: 10,
      desc: 'Can lay 1–2 extra free yellow tiles.' },
    { sym: 'M&M', name: 'Meridian and Memphis Railway', value: 50, revenue: 15,
      desc: 'Half-price token placement.' },
    { sym: 'MC', name: 'Mississippi Central Railway', value: 60, revenue: 5,
      desc: 'Free 2+ train exchange.' },
    { sym: 'M&O', name: 'Mobile & Ohio Railway', value: 70, revenue: 5,
      desc: '$100 discount on 3+/4+ train purchase.' },
  ],

  // Fixed round game end
  gameEndCheck: { fixed_round: 'current_or' },
}
