// 成交單價 = 小計 / 天數 (四捨五入)
export const transactionPrice = (price, days) =>
  round(Number(Number(price) / Number(days)), 1);

// 折扣 = 10 * (成交單價 / 牌價) (四捨五入 小數點第一位)
export const discount = (unitPrice, marketPrice) =>
  round(10 * (Number(unitPrice) / Number(marketPrice)), 1);

export const round = (value, precision) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};
