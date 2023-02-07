export const LEADER_BOARD_KEY_LIST = [
  "SALARY",
  "COMPANY",
  "WORKING_CONDITIONS",
  "CULTURE",
  "CAREER_OPPORTUNITE",
  "WORK_BALANCE"
];

export const LEADER_BOARD_TYPE = Object.freeze({
  //薪水領多少
  SALARY: "salary",
  //環境超Chill
  WORKING_CONDITIONS: "workingconditions",
  //氣氛好開心
  CULTURE: "culture",
  //人人都說好
  COMPANY: "company",
  //未來無極限
  CAREER_OPPORTUNITE: "careeropportunite",
  //穩定不是夢
  WORK_BALANCE: "workbalance"
});

export const LEADER_BOARD_NAME_REF = Object.freeze({
  SALARY: {
    routeName: "salary",
    displayName: "薪水領多少"
  },
  WORKING_CONDITIONS: {
    routeName: "workplace",
    displayName: "環境超Chill"
  },
  CULTURE: {
    routeName: "feeling",
    displayName: "氣氛好開心"
  },
  COMPANY: {
    routeName: "company",
    displayName: "人人都說好"
  },
  CAREER_OPPORTUNITE: {
    routeName: "career",
    displayName: "未來無極限"
  },
  WORK_BALANCE: {
    routeName: "balance",
    displayName: "穩定不是夢"
  }
});

// 植物的 id map
export const PLANT_ID_MAP = Object.freeze({
  1: "仙人掌",
  2: "薰衣草",
  3: "含羞草",
  4: "向日葵",
  5: "楓葉",
  6: "孟宗竹",
  7: "蒲公英",
  8: "山茶花"
});

// 評論的 type id
export const TYPEID_MAP = Object.freeze({
  ALL: 0,
  INTERVIEW: 2,
  FULL_TIME: 1,
  PART_TIME: 3,
  INTERN: 4
});

// 評論的篩選 map
export const TYPEID_GROUP_NAME_MAP = Object.freeze({
  [TYPEID_MAP.ALL]: "全部",
  [TYPEID_MAP.FULL_TIME]: "正職工作",
  [TYPEID_MAP.INTERVIEW]: "面試",
  [TYPEID_MAP.PART_TIME]: "打工",
  [TYPEID_MAP.INTERN]: "實習"
});

// 評價表單 map
export const TYPEID_FORM_NAME_MAP = Object.freeze({
  [TYPEID_MAP.INTERVIEW]: "面試者",
  [TYPEID_MAP.FULL_TIME]: "正職員工",
  [TYPEID_MAP.INTERN]: "實習生",
  [TYPEID_MAP.PART_TIME]: "工讀生"
});

// 評論列表 map
export const TYPEID_DISPLAY_NAME_MAP = Object.freeze(
  Object.assign({}, TYPEID_FORM_NAME_MAP, { 1: "員工" })
);
