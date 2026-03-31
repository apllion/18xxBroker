import { defaults } from './defaults.js'

export const g1830 = {
  ...defaults,

  titleId: 'g1830',
  title: '1830',
  subtitle: 'Railways & Robber Barons',
  designer: 'Francis Tresham',
  location: 'NE USA and SE Canada',
  minPlayers: 2,
  maxPlayers: 6,

  bankCash: 12000,
  startingCash: { 2: 1200, 3: 800, 4: 600, 5: 480, 6: 400 },
  certLimit: { 2: 28, 3: 20, 4: 16, 5: 13, 6: 11 },
  currencyFormat: '$',

  sellBuyOrder: 'sell_buy_sell',

  market: [
    ['60y','67','71','76','82','90','100p','112','126','142','160','180','200','225','250','275','300','325','350'],
    ['53y','60y','66','70','76','82','90p','100','112','126','142','160','180','200','220','240','260','280','300'],
    ['46y','55y','60y','65','70','76','82p','90','100','111','125','140','155','170','185','200'],
    ['39o','48y','54y','60y','66','71','76p','82','90','100','110','120','130'],
    ['32o','41o','48y','55y','62','67','71p','76','82','90','100'],
    ['25b','34o','42o','50y','58y','65','67p','71','75','80'],
    ['18b','27b','36o','45o','54y','63','67','69','70'],
    ['10b','20b','30b','40o','50y','60y','67','68'],
    ['','10b','20b','30b','40o','50y','60y'],
    ['','','10b','20b','30b','40o','50y'],
    ['','','','10b','20b','30b','40o'],
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
    { name: 'D', distance: 999, price: 1100, num: 20, availableOn: '6', discount: { '4': 300, '5': 300, '6': 300 } },
  ],

  corporations: [
    { sym: 'PRR', name: 'Pennsylvania Railroad', tokens: [0,40,100,100], color: '#32763f', coordinates: 'H12' },
    { sym: 'NYC', name: 'New York Central Railroad', tokens: [0,40,100,100], color: '#474548', coordinates: 'E19' },
    { sym: 'CPR', name: 'Canadian Pacific Railroad', tokens: [0,40,100,100], color: '#d1232a', coordinates: 'A19' },
    { sym: 'B&O', name: 'Baltimore & Ohio Railroad', tokens: [0,40,100], color: '#025aaa', coordinates: 'I15' },
    { sym: 'C&O', name: 'Chesapeake & Ohio Railroad', tokens: [0,40,100], color: '#ADD8E6', textColor: '#000', coordinates: 'F6' },
    { sym: 'ERIE', name: 'Erie Railroad', tokens: [0,40,100], color: '#FFF500', textColor: '#000', coordinates: 'E11' },
    { sym: 'NYNH', name: 'New York, New Haven & Hartford Railroad', tokens: [0,40], color: '#d88e39', coordinates: 'G19' },
    { sym: 'B&M', name: 'Boston & Maine Railroad', tokens: [0,40], color: '#95c054', coordinates: 'E23' },
  ],

  pregame: [{ id: 'auction', label: 'Private Auction', type: 'waterfall' }],

  companies: [
    { sym: 'SV', name: 'Schuylkill Valley', value: 20, revenue: 5,
      desc: 'No special abilities. Blocks G15 while owned by a player.' },
    { sym: 'CS', name: 'Champlain & St.Lawrence', value: 40, revenue: 10,
      desc: 'A corporation owning the CS may lay a free tile on hex B20.' },
    { sym: 'DH', name: 'Delaware & Hudson', value: 70, revenue: 15,
      desc: 'A corporation owning the DH may place a tile and token in F16 for $120 mountain cost.' },
    { sym: 'MH', name: 'Mohawk & Hudson', value: 110, revenue: 20,
      desc: 'May be exchanged for a 10% share of NYC.' },
    { sym: 'CA', name: 'Camden & Amboy', value: 160, revenue: 25,
      desc: 'Purchaser immediately receives a 10% share of PRR stock.' },
    { sym: 'BO', name: 'Baltimore & Ohio', value: 220, revenue: 30,
      desc: 'Owner receives the President\'s certificate of B&O. Closes when B&O buys its first train. Cannot be sold to a corporation.' },
  ],
}
