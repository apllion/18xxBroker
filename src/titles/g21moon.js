import { defaults } from './defaults.js'

export const g21moon = {
  ...defaults,
  titleId: 'g21moon', title: '21 Moon', subtitle: 'Lunar Railways', designer: 'Jonas Jones and Scott Petersen',
  location: 'The Moon', minPlayers: 2, maxPlayers: 5,
  bankCash: 12000, startingCash: { 2: 600, 3: 540, 4: 410, 5: 340 }, certLimit: { 2: 18, 3: 15, 4: 12, 5: 10 },
  currencyFormat: '₡', capitalization: 'incremental', floatPercent: 50, sellBuyOrder: 'sell_buy',
  market: [
    ['','','','','','','','','','','','','','','330','360','395','430'],
    ['','','100','110','120','130','140','150','160','175','195','215','240','265','295','325','360','395'],
    ['70','80','90p','100','110','120','130','140','150','160','175','190','215','235','260','285','315','345'],
    ['60','70','80p','90','100','110','120','130','140','150','160','175','190','200','220','250','275','300'],
    ['50','60','70p','80','90','100','110','120','130','140','150','160','175','190'],
    ['40','50','60p','70','80','90','100','110','120','130','140','150'],
    ['0c','40','50','60','70','80','90','100','110','120'],
  ],
  phases: [
    { name: '2', trainLimit: 2, tiles: ['yellow'], operatingRounds: 2 },
    { name: '3', on: '3', trainLimit: 2, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '4', on: '4', trainLimit: 2, tiles: ['yellow','green'], operatingRounds: 2 },
    { name: '5', on: '5', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '6', on: '6', trainLimit: 2, tiles: ['yellow','green','brown'], operatingRounds: 2 },
    { name: '10', on: '10', trainLimit: 2, tiles: ['yellow','green','brown','gray'], operatingRounds: 2 },
  ],
  trains: [
    { name: '2', distance: 2, price: 120, rustsOn: '5', num: 5 },
    { name: '3', distance: 3, price: 150, rustsOn: '6', num: 4 },
    { name: '4', distance: 4, price: 240, rustsOn: '10', num: 3 },
    { name: '5', distance: 5, price: 500, num: 2 },
    { name: '6', distance: 6, price: 540, num: 2 },
    { name: '10', distance: 10, price: 730, num: 14 },
  ],
  corporations: [
    { sym: 'SSF', name: 'Shamsum Solar Farms', tokens: [0,25,50], color: '#f7955b', coordinates: 'D12' },
    { sym: 'SWP', name: 'Suijin Water Plants', tokens: [0,25,50], color: '#00aeef', coordinates: 'C7' },
    { sym: 'HMQ', name: 'Hematite Low-G Mining and Quarry', tokens: [0,25,50,75,100], color: '#ed1c24', coordinates: 'D2' },
    { sym: 'VH', name: 'Varuna Hydroculture', tokens: [0,25,50,75], color: '#ffcc4e', textColor: '#000', coordinates: 'G7' },
    { sym: 'ITC', name: 'International Tritium Consortum', tokens: [0,25,50,75,100], color: '#a368ab', coordinates: 'I5' },
    { sym: 'LG', name: 'Lunar Geodynamics', tokens: [0,25,50,75], color: '#57bd7d', coordinates: 'I11' },
    { sym: 'KR', name: 'Kiviuq Rovertech', tokens: [0,25,50,75,100], color: '#b59588', coordinates: 'K9' },
  ],

  pregame: [],

  companies: [
    { sym: 'OLS', name: 'Old Landing Site', value: 30, revenue: 0, desc: 'Place black SD token on mineral resource hex. When sold to corp, replaced by corp token.' },
    { sym: 'UNC', name: 'UN Contract', value: 30, revenue: 5, desc: 'When bought by company, president may add/remove a train to/from depot. Closes company.' },
    { sym: 'SBC', name: 'Space Bridge Company', value: 40, revenue: 10, desc: 'Owning corp can build/upgrade across the rift. ₡60 bonus when rift connected. Closes.' },
    { sym: 'RL', name: 'Research Lab', value: 60, revenue: 10, desc: 'Owning corp may place +20 marker on mineral or Home Base hex. Closes.' },
    { sym: 'T', name: 'Terminal', value: 80, revenue: 15, desc: 'Owning corp may teleport place the T tile + cheapest supply depot. Closes.' },
    { sym: 'TC', name: 'Tunnel Company', value: 100, revenue: 15, desc: 'Take one free share from pool (once). Mountain terrain discounted to ₡10. Closes on exchange.' },
  ],
}
