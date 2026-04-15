import { defaults } from './defaults.js'

export const g1822mx = {
  ...defaults,

  titleId: 'g1822mx',
  title: '1822MX',
  subtitle: 'The Railways of Mexico',
  designer: 'Scott Peterson',
  location: 'Mexico',
  minPlayers: 2,
  maxPlayers: 5,

  bankCash: 12000,
  startingCash: { 2: 750, 3: 500, 4: 375, 5: 300 },
  certLimit: { 2: 27, 3: 16, 4: 13, 5: 10 },
  currencyFormat: '$',

  capitalization: 'incremental',
  floatPercent: 20,
  mustSellInBlocks: true,
  nextSRPlayerOrder: 'most_cash',

  // Single-row market
  market: [
    ['5y','10y','15y','20y','25y','30y','35y','40y','45y','50p','60xp','70xp','80xp','90xp','100xp','110','120','135','150','165','180','200','220','245','270','300','330','360','400','450','500','550','600e'],
  ],

  phases: [
    { name: '1', trainLimit: { minor: 2, major: 4 }, tiles: ['yellow'], operatingRounds: 1 },
    { name: '2', on: '2', trainLimit: { minor: 2, major: 4 }, tiles: ['yellow'], operatingRounds: 2 },
    { name: '3', on: '3', trainLimit: { minor: 2, major: 4 }, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: { minor: 1, major: 3 }, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: { minor: 1, major: 2 }, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '6', on: '6', trainLimit: { minor: 1, major: 2 }, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '7', on: '7', trainLimit: { minor: 1, major: 2 }, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
  ],

  trains: [
    { name: 'L', distance: 1, price: 60, rustsOn: '3', num: 22, variants: [{ name: '2', price: 120, rustsOn: '4' }] },
    { name: '3', distance: 3, price: 200, rustsOn: '6', num: 7 },
    { name: '4', distance: 4, price: 300, rustsOn: '7', num: 4 },
    { name: '5', distance: 5, price: 500, num: 2, events: ['close_concessions'] },
    { name: '6', distance: 6, price: 600, num: 3, events: ['full_capitalisation'] },
    { name: '7', distance: 7, price: 750, num: 20, variants: [{ name: 'E', price: 1000 }], events: ['close_ndem'] },
  ],

  corporations: [
    // Majors
    { sym: 'FCM', name: 'Ferrocarril Mexicano', tokens: [0,100], color: '#e51c00', type: 'major', floatPercent: 20, coordinates: 'N23' },
    { sym: 'MC', name: 'Mexican Central Railway', tokens: [0,100], color: '#000000', type: 'major', floatPercent: 20, coordinates: 'N23' },
    { sym: 'CHP', name: 'Chihuahua-Pacific Railway', tokens: [0,100], color: '#ff7b93', textColor: '#000', type: 'major', floatPercent: 20, coordinates: 'F15' },
    { sym: 'FNM', name: 'Ferrocarriles Nacionales de Mexico', tokens: [0,100], color: '#850040', type: 'major', floatPercent: 20, coordinates: 'N23' },
    { sym: 'MIR', name: 'Mexican International Railroad', tokens: [0,100], color: '#ff3600', type: 'major', floatPercent: 20, coordinates: 'F21' },
    { sym: 'FCP', name: 'Ferrocarril del Pacifico', tokens: [0,100], color: '#fab506', textColor: '#000', type: 'major', floatPercent: 20, coordinates: 'D9' },
    { sym: 'IRM', name: 'Interoceanic Railway of Mexico', tokens: [0,100], color: '#004c6c', type: 'major', floatPercent: 20, coordinates: 'N23' },
    { sym: 'NDEM', name: 'N de M (National)', tokens: [0,0,0,0,0,0,0,0,0,0], color: '#525600', type: 'national', shares: [10,10,10] },

    // Minors (24 total)
    { sym: '1', name: 'FC Sonora-Baja California', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'B1' },
    { sym: '2', name: 'Rio Grande, Sierra Madre & Pacific', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'D15' },
    { sym: '3', name: 'FC Nacozari', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'E8' },
    { sym: '4', name: 'FC Parral y Durango', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'F13' },
    { sym: '5', name: 'FC Coahuila y Zacatecas', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'G22' },
    { sym: '6', name: 'Sinaloa & Durango Railroad', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'H11' },
    { sym: '7', name: 'Monterrey Mineral & Terminal', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'I22' },
    { sym: '8', name: 'FC Nacional de la Baja California', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'J9' },
    { sym: '9', name: 'Southern Pacific of Mexico', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'J13' },
    { sym: '10', name: 'Potosi Central Railroad', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'K20' },
    { sym: '11', name: 'Guadalajara to Tepic & Mazatlan', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'L17' },
    { sym: '12', name: 'FC Guanajuato a San Luis', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'L19' },
    { sym: '13', name: 'FC San Marcos a Huajapan', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'L19' },
    { sym: '14', name: 'FC Cazadero y Solis', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'N23' },
    { sym: '15', name: 'FC San Gregorio', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'N23' },
    { sym: '16', name: 'FC Atlamaxac', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'N25' },
    { sym: '17', name: 'Cia del FC de Mexico a Puebla', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'N25' },
    { sym: '18', name: 'Ferrocarril Mexicano (minor)', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'N25' },
    { sym: '19', name: 'Cordoba & Huatusco Railroad', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'N27' },
    { sym: '20', name: 'FC Interoceanico de Acapulco', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'P23' },
    { sym: '21', name: 'FC Oaxaca a Ejutla', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'P27' },
    { sym: '22', name: 'FC Unidos de Yucatan', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'O32' },
    { sym: '23', name: 'FC Merida a Valladolid', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'L37' },
    { sym: '24', name: 'Northern Railroad of Guatemala', tokens: [0], color: '#aaa', textColor: '#000', type: 'minor', floatPercent: 100, shares: [100], coordinates: 'Q34' },
  ],

  pregame: [{ id: 'bidbox', label: 'Bid Box Auction', type: 'bidbox' }],

  companies: [
    // Concessions
    { sym: 'C1', name: 'Concession: FCM', value: 100, revenue: 10, desc: 'Concession for Ferrocarril Mexicano.' },
    { sym: 'C2', name: 'Concession: MC', value: 100, revenue: 10, desc: 'Concession for Mexican Central Railway.' },
    { sym: 'C3', name: 'Concession: CHP', value: 100, revenue: 10, desc: 'Concession for Chihuahua-Pacific Railway.' },
    { sym: 'C4', name: 'Concession: FNM', value: 100, revenue: 10, desc: 'Concession for Ferrocarriles Nacionales de Mexico.' },
    { sym: 'C5', name: 'Concession: MIR', value: 100, revenue: 10, desc: 'Concession for Mexican International Railroad.' },
    { sym: 'C6', name: 'Concession: FCP', value: 100, revenue: 10, desc: 'Concession for Ferrocarril del Pacifico.' },
    { sym: 'C7', name: 'Concession: IRM', value: 100, revenue: 10, desc: 'Concession for Interoceanic Railway of Mexico.' },
    // Privates
    { sym: 'P1', name: 'BLWC (5-Train)', value: 0, revenue: 5, desc: 'Comes with a 5-train.' },
    { sym: 'P2', name: 'MCSL (Permanent 2T)', value: 0, revenue: 0, desc: 'Comes with a permanent 2-train.' },
    { sym: 'P3', name: 'IGT (Permanent 3/2T)', value: 0, revenue: 0, desc: 'Comes with a permanent 3/2-train.' },
    { sym: 'P4', name: 'MCST (Permanent LT)', value: 0, revenue: 0, desc: 'Comes with a permanent L-train.' },
    { sym: 'P5', name: 'Pullman', value: 0, revenue: 10, desc: 'Pullman car — doubles one train\'s revenue.' },
    { sym: 'P6', name: 'Pullman', value: 0, revenue: 10, desc: 'Pullman car — doubles one train\'s revenue.' },
    { sym: 'P7', name: 'Double Cash', value: 0, revenue: 10, desc: 'Receive double cash when used.' },
    { sym: 'P14', name: 'Mail Contract', value: 0, revenue: 10, desc: '$10 per city visited.' },
    { sym: 'P15', name: 'Mail Contract', value: 0, revenue: 10, desc: '$10 per city visited.' },
  ],
}
