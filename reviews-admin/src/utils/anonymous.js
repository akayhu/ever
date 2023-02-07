const anonymousType = Object.freeze({
  1: "仙人掌",
  2: "薰衣草",
  3: "含羞草",
  4: "向日葵",
  5: "楓葉",
  6: "孟宗竹",
  7: "蒲公英",
  8: "山茶花"
});

// 匿名字
export const anonymousName = (anonymousNumber, typeId) => {
  const anonymousName = anonymousType[anonymousNumber] || anonymousType[1];
  const typeName = getTypeDisplayName(typeId);
  return `${anonymousName}${typeName}`;
};
// 投票顯示方式與評論不一樣
export const anonymousVoteName = anonymousNumber => {
  const anonymousName = anonymousType[anonymousNumber] || anonymousType[1];
  return `匿名${anonymousName}`;
};
export const TYPEID_MAP = Object.freeze({
  FULL_TIME: 1,
  INTERVIEW: 2,
  PART_TIME: 3,
  INTERN: 4
});

// typeID對應
export const TYPEID_NAME_MAP = Object.freeze({
  [TYPEID_MAP.FULL_TIME]: "正職員工",
  [TYPEID_MAP.INTERVIEW]: "面試者",
  [TYPEID_MAP.PART_TIME]: "工讀生",
  [TYPEID_MAP.INTERN]: "實習生"
});
// 在顯示名稱的時候，與填寫時的身份名稱略有不同
export const TYPEID_DISPLAY_NAME_MAP = Object.freeze(
  Object.assign({}, TYPEID_NAME_MAP, { 1: "員工" })
);

export const getTypeIdName = id => {
  const name = TYPEID_NAME_MAP[id];
  return name || TYPEID_NAME_MAP[TYPEID_MAP.FULL_TIME];
};

export const getTypeDisplayName = id => {
  const name = TYPEID_DISPLAY_NAME_MAP[id];
  return name || TYPEID_DISPLAY_NAME_MAP[TYPEID_MAP.FULL_TIME];
};

export const checkIsTypeInterview = type => {
  return type === TYPEID_MAP.INTERVIEW;
};
