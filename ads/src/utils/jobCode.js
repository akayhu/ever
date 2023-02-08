export const encodeCustno = custno => {
  return Number(`${custno}.`).toString(36);
};

export const decodeCustno = custno => {
  return parseInt(custno, 36);
};
