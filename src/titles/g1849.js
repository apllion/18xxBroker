import { defaults } from './defaults.js'

export const g1849 = {
  ...defaults,

  titleId: 'g1849',
  title: '1849',
  subtitle: 'The Game of Sicilian Railways',
  designer: 'Federico Vellani',
  location: 'Sicily',
  minPlayers: 3,
  maxPlayers: 5,

  bankCash: 7760,
  startingCash: { 3: 500, 4: 375, 5: 300 },
  certLimit: { 3: 12, 4: 11, 5: 9 },
  currencyFormat: 'L.',

  capitalization: 'incremental',
  floatPercent: 20,
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_per_10',
  poolShareDrop: 'down_block',
  sellAfter: 'operate',
  ebuyFromOthers: 'never',

  // 1849 has a unique share structure: 20/10/10/10/10/10/10/20
  shares: [20, 10, 10, 10, 10, 10, 10, 20],

  market: [
    ['72','83','95','107','120','133','147','164','182','202','224','248','276','306u','340u','377e'],
    ['63','72','82','93','104','116','128','142','158','175','195','216z','240','266u','295u','328u'],
    ['57','66','75','84','95','105','117','129','144x','159','177','196','218','242u','269u','298u'],
    ['54','62','71','80','90','100p','111','123','137','152','169','187','208','230'],
    ['52','59','68p','77','86','95','106','117','130','145','160','178','198'],
    ['47','54','62','70','78','87','96','107','118','131','146','162'],
    ['41','47','54','61','68','75','84','93','103','114','127'],
    ['34','39','45','50','57','63','70','77','86','95'],
    ['27','31','36','40','45','50','56'],
    ['0c','24','27','31'],
  ],

  phases: [
    { name: '4H', trainLimit: 4, tiles: ['yellow'], operatingRounds: 1 },
    { name: '6H', on: '6H', trainLimit: 4, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '8H', on: '8H', trainLimit: 3, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '10H', on: '10H', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '12H', on: '12H', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
    { name: '16H', on: '16H', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 3 },
  ],

  trains: [
    { name: '4H', distance: 4, price: 100, rustsOn: '8H', num: 4 },
    { name: '6H', distance: 6, price: 200, rustsOn: '10H', num: 4, events: ['green_par'] },
    { name: '8H', distance: 8, price: 350, rustsOn: '16H', num: 3 },
    { name: '10H', distance: 10, price: 550, num: 2, events: ['brown_par'] },
    { name: '12H', distance: 12, price: 800, num: 1, events: ['close_companies','earthquake'] },
    { name: '16H', distance: 16, price: 1100, num: 5 },
    { name: 'E', distance: 99, price: 550, num: 6, availableOn: '12H' },
    { name: 'R6H', distance: 6, price: 350, num: 2, availableOn: '16H' },
  ],

  corporations: [
    { sym: 'AFG', name: 'Azienda Ferroviaria Garibaldi', tokens: [0,0,0], color: '#ff0000', coordinates: null, floatPercent: 20,
      desc: 'Choose home token location when floated.' },
    { sym: 'ATA', name: 'Azienda Trasporti Archimede', tokens: [0,0,0], color: '#76a042', coordinates: 'M13', floatPercent: 20 },
    { sym: 'CTL', name: 'Compagnia Trasporti Lilibeo', tokens: [0,0,0], color: '#f9b231', textColor: '#000', coordinates: 'E1', floatPercent: 20 },
    { sym: 'IFT', name: 'Impresa Ferroviaria Trinacria', tokens: [0,0,0], color: '#0189d1', coordinates: 'H12', floatPercent: 20 },
    { sym: 'RCS', name: 'Rete Centrale Sicula', tokens: [0,0,0], color: '#f48221', coordinates: 'C5', floatPercent: 20 },
    { sym: 'SFA', name: 'Società Ferroviaria Akragas', tokens: [0,0,0], color: '#ff1493', textColor: '#000', coordinates: 'J6', floatPercent: 20 },
  ],

  // Pregame: waterfall auction, corps parred in random sequential order
  pregame: [
    { id: 'auction', label: 'Private Auction', type: 'waterfall' },
  ],
  corpOrder: 'sequential_random', // Corps must be parred one at a time in random order
  removeCorps: { 3: 1 },

  variants: {
    'reduced_4p': {
      label: 'Reduced Corps (4p)',
      desc: '5 corporations instead of 6 at 4 players. Cert limit reduced to 9. Fewer trains.',
      autoForPlayers: [],  // Not auto — user must choose
      removeCorps: { 4: 1 },
      certLimit: { 3: 12, 4: 9, 5: 9 },
    },
    'delay_ift': {
      label: 'Delay IFT',
      desc: 'IFT may not be one of the first three corporations. Recommended for newer players.',
      autoForPlayers: [],
    },
  },
  parPriceGates: [
    { price: 68, unlocksOn: null },   // Always available
    { price: 100, unlocksOn: null },   // Always available
    { price: 144, unlocksOn: '6H' },   // Unlocks at 6H phase
    { price: 216, unlocksOn: '10H' },  // Unlocks at 10H phase
  ],

  companies: [
    { sym: 'SCE', name: 'Società Corriere Etnee', value: 20, revenue: 5,
      desc: 'Blocks Acireale (G13) while owned by a player.' },
    { sym: 'SIGI', name: 'Studio di Ingegneria Giuseppe Incorpora', value: 45, revenue: 10,
      desc: 'Owning corporation can lay or upgrade track on mountain/hill/rough hexes at half cost.' },
    { sym: 'CNM', name: 'Compagnia Navale Mediterranea', value: 75, revenue: 15,
      desc: 'Owning corporation may close this to place the +L.20 token on any port.' },
    { sym: 'SMS', name: 'Società Marittima Siciliana', value: 110, revenue: 20,
      desc: 'Owning corporation may close this to teleport to any coastal city, optionally lay/upgrade and place a token.' },
    { sym: 'RSA', name: 'Reale Società d\'Affari', value: 150, revenue: 25,
      desc: 'Owner receives a President\'s certificate. Closes when that corporation buys its first train. Cannot be bought by a corporation.' },
  ],
}
