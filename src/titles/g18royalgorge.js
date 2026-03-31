import { defaults } from './defaults.js'

export const g18royalgorge = {
  ...defaults,
  titleId: 'g18royalgorge', title: '18 Royal Gorge', subtitle: 'The Royal Gorge Wars', designer: 'Kayla Ross & Denman Scofield',
  location: 'Fremont County, Colorado', minPlayers: 2, maxPlayers: 4,
  bankCash: 99999, startingCash: { 2: 800, 3: 550, 4: 400 }, certLimit: { 2: 20, 3: 14, 4: 10 },
  currencyFormat: '$', capitalization: 'incremental', floatPercent: 20, sellBuyOrder: 'sell_buy',
  market: [
    ['30','35','40','45','50','55','60p','65p','70p','80p','90x','100x','110x','120x','130z','145z','160z','180z','200','220','240','260','280','310e','340e','380e','420e','460e'],
  ],
  phases: [
    { name: 'Yellow', trainLimit: 2, tiles: ['yellow'], operatingRounds: 2 },
    { name: 'Green', on: '3+', trainLimit: 2, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: 'Brown', on: '4+', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: 'Silver', on: '5+', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
  ],
  trains: [
    { name: '2+', distance: 2, price: 80, rustsOn: '4+', num: 4 },
    { name: '3+', distance: 3, price: 180, rustsOn: '6x2', num: 4 },
    { name: '4+', distance: 4, price: 400, num: 3 },
    { name: '5+', distance: 5, price: 500, num: 2 },
    { name: '6x2', distance: 6, price: 650, num: 99 },
  ],
  corporations: [
    { sym: 'RG', name: 'Denver & Rio Grande Western', tokens: [0,40,60,80], color: '#d81e3e', coordinates: 'L2' },
    { sym: 'SF', name: 'Santa Fe Railroad', tokens: [0,40,60,80], color: '#800080', coordinates: 'O15' },
    { sym: 'KP', name: 'Kansas Pacific Railway', tokens: [0,40,60,80], color: '#808080', coordinates: 'O5' },
    { sym: 'SPP', name: 'Denver, South Park & Pacific Railroad', tokens: [0,40,60,80], color: '#f48221', coordinates: 'B6' },
    { sym: 'PAV', name: 'Pueblo and Arkansas Valley Railroad', tokens: [0,40,60,80], color: '#025aaa', coordinates: 'L14' },
    { sym: 'NO', name: 'Denver & New Orleans', tokens: [0,40,60], color: '#000', coordinates: 'L8' },
    { sym: 'CM', name: 'Colorado Midland Railway', tokens: [0,40,60], color: '#237333', coordinates: 'B2' },
    { sym: 'S', name: 'Silverton Railway', tokens: [0,40,60], color: '#fff', textColor: '#000', coordinates: 'C17' },
    { sym: 'FCC', name: 'Florence & Cripple Creek Railroad', tokens: [0,40], color: '#FFF500', textColor: '#000', coordinates: 'I13' },
    { sym: 'CSCC', name: 'CS & Cripple Creek District', tokens: [0,40], color: '#32763f', coordinates: 'K7' },
    { sym: 'CS', name: 'Colorado & Southern', tokens: [0,40], color: '#110a0c', coordinates: 'J2' },
    { sym: 'CF&I', name: 'Colorado Fuel & Iron', tokens: [], color: '#808080', type: 'metal', shares: [10,10,10,10,10,10,10,10,10,10] },
    { sym: 'VGC', name: 'Victor Gold Company', tokens: [], color: '#ffd700', textColor: '#000', type: 'metal', shares: [10,10,10,10,10,10,10,10,10,10] },
  ],

  pregame: [{ id: 'auction', label: 'Private Auction', type: 'english' }],

  companies: [
    { sym: 'Y1', name: 'St. Cloud Hotel', value: 50, revenue: 5, desc: 'Hotel token. $20 revenue per stop.' },
    { sym: 'Y4', name: 'William Palmer', value: 75, revenue: 5, desc: '10% Rio Grande + 10% CF&I. Cannot sell to corp.' },
    { sym: 'Y5', name: 'Colorado State Prison', value: 70, revenue: 10, desc: 'Build in terrain at 1/2 price.' },
    { sym: 'G1', name: 'Doc Holliday', value: 55, revenue: 10, desc: 'Acquires 2 debt tokens during Treaty of Boston.' },
    { sym: 'G3', name: 'Hanging Bridge Lease', value: 50, revenue: 10, desc: 'Run through Royal Gorge by paying 10% dividend to Rio Grande.' },
    { sym: 'G4', name: 'Florence Oil Fields', value: 75, revenue: 0, desc: 'Green Phase: $25 revenue per OR. Cannot close.' },
    { sym: 'B1', name: 'Silver Mines', value: 70, revenue: 0, desc: 'Brown Phase: $25 revenue per OR. Never closes.' },
    { sym: 'B4', name: 'Gold Miner', value: 20, revenue: 0, desc: 'Acts as 20% share of Victor Gold Company.' },
  ],
}
