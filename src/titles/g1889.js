import { defaults } from './defaults.js'

export const g1889 = {
  ...defaults,

  titleId: 'g1889',
  title: '1889',
  subtitle: 'Shikoku 1889',
  designer: 'Yasutaka Ikeda',
  location: 'Japan',
  minPlayers: 2,
  maxPlayers: 6,

  bankCash: 7000,
  startingCash: { 2: 420, 3: 420, 4: 420, 5: 390, 6: 390 },
  certLimit: { 2: 25, 3: 19, 4: 14, 5: 12, 6: 11 },
  currencyFormat: '¥',

  floatPercent: 50,
  mustSellInBlocks: true,
  ebuyPresSwap: false,
  ebuyFromOthers: 'never',

  market: [
    ['75','80','90','100p','110','125','140','155','175','200','225','255','285','315','350'],
    ['70','75','80','90p','100','110','125','140','155','175','200','225','255','285','315'],
    ['65','70','75','80p','90','100','110','125','140','155','175','200'],
    ['60','65','70','75p','80','90','100','110','125','140'],
    ['55','60','65','70p','75','80','90','100'],
    ['50y','55','60','65p','70','75','80'],
    ['45y','50y','55','60','65','70'],
    ['40y','45y','50y','55','60'],
    ['30o','40y','45y','50y'],
    ['20o','30o','40y','45y'],
    ['10o','20o','30o','40y'],
  ],

  phases: [
    { name: '2', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
    { name: '3', on: '3', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '6', on: '6', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: 'D', on: 'D', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
  ],

  trains: [
    { name: '2', distance: 2, price: 80, rustsOn: '4', num: 6 },
    { name: '3', distance: 3, price: 180, rustsOn: '6', num: 5 },
    { name: '4', distance: 4, price: 300, rustsOn: 'D', num: 4 },
    { name: '5', distance: 5, price: 450, num: 3, events: ['close_companies'] },
    { name: '6', distance: 6, price: 630, num: 2 },
    { name: 'D', distance: 999, price: 1100, num: 99, availableOn: '6', discount: { '4': 300, '5': 300, '6': 300 } },
  ],

  corporations: [
    { sym: 'AR', name: 'Awa Railroad', tokens: [0,40], color: '#37383a', coordinates: 'K8', floatPercent: 50 },
    { sym: 'IR', name: 'Iyo Railway', tokens: [0,40], color: '#f48221', coordinates: 'E2', floatPercent: 50 },
    { sym: 'SR', name: 'Sanuki Railway', tokens: [0,40], color: '#76a042', coordinates: 'I2', floatPercent: 50 },
    { sym: 'KO', name: 'Takamatsu & Kotohira Electric Railway', tokens: [0,40], color: '#d81e3e', coordinates: 'K4', floatPercent: 50 },
    { sym: 'TR', name: 'Tosa Electric Railway', tokens: [0,40,40], color: '#00a993', coordinates: 'F9', floatPercent: 50 },
    { sym: 'KU', name: 'Tosa Kuroshio Railway', tokens: [0], color: '#0189d1', coordinates: 'C10', floatPercent: 50 },
    { sym: 'UR', name: 'Uwajima Railway', tokens: [0,40,40], color: '#6f533e', coordinates: 'B7', floatPercent: 50 },
  ],

  pregame: [{ id: 'auction', label: 'Private Auction', type: 'waterfall' }],

  variants: {
    'beginner': {
      label: 'Beginner Mode',
      desc: 'Simplified privates distributed randomly. Reduced private set based on player count. Abilities neutered.',
    },
  },

  companies: [
    { sym: 'TR', name: 'Takamatsu E-Railroad', value: 20, revenue: 5,
      desc: 'Blocks Takamatsu (K4) while owned by a player.' },
    { sym: 'MF', name: 'Mitsubishi Ferry', value: 30, revenue: 5,
      desc: 'Player owner may place the port tile on a coastal town (B11, G10, I12, or J9).' },
    { sym: 'ER', name: 'Ehime Railway', value: 40, revenue: 10,
      desc: 'When sold to a corporation, selling player may immediately place a green tile on Ohzu (C4). Blocks C4 while owned by a player.' },
    { sym: 'SMR', name: 'Sumitomo Mines Railway', value: 50, revenue: 15,
      desc: 'Owning corporation may ignore building cost for mountain hexes.' },
    { sym: 'DR', name: 'Dougo Railway', value: 60, revenue: 15,
      desc: 'Owning player may exchange for a 10% share of Iyo Railway from the IPO.' },
    { sym: 'SIR', name: 'South Iyo Railway', value: 80, revenue: 20,
      desc: 'No special abilities.' },
    { sym: 'UTF', name: 'Uno-Takamatsu Ferry', value: 150, revenue: 30, minPlayers: 4,
      desc: 'Does not close while owned by a player. Revenue increases to ¥50 when phase 5 begins.' },
  ],
}
