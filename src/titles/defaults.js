// Shared defaults — titles spread from this and override what differs.

export const defaults = {
  capitalization: 'full',
  currencyFormat: '$',
  floatPercent: 60,

  // Stock rules
  sellBuyOrder: 'sell_buy',
  sellMovement: 'down_share',
  poolShareDrop: 'none',
  sellAfter: 'first_sr',
  mustSellInBlocks: false,

  // Emergency buy
  ebuyPresSwap: true,
  ebuyFromOthers: 'never',
  ebuyMustIssueBefore: false,
  ebuyDepotCheapest: true,

  // Game end
  gameEndCheck: {
    bankrupt: 'immediate',
    bank: 'full_or',
  },

  // Share structure (default: 20% president + 8x 10%)
  shares: [20, 10, 10, 10, 10, 10, 10, 10, 10],

  // Market share limit (percent in pool before no more can be sold)
  marketShareLimit: 50,
}
