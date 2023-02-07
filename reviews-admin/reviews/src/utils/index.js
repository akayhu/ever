export const companySalaryFormat = value => {
  // 轉換成 xx萬形式，無條件捨去
  return Math.floor(Number(value) / 10000);
};
export const encodeCustno = custno => {
  return Number(`${custno}.`).toString(36);
};

export const decodeCustno = custno => {
  return parseInt(custno, 36);
};

export const formatDecimalNum = value => {
  if (!value) return "";
  return Number(value).toFixed(1);
};
