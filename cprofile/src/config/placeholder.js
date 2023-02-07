/**
 * 各區塊欄位的 placeholder
 */

// 基本資料
const basic = {
  userName: '請輸入您的姓名',
  organization: '點擊輸入公司或單位名稱(限100字數)',
  title: '點擊輸入您的角色或職稱(限100字數)',
  location: '點擊輸入您現居地點(限100字數)',
  introduction: '點擊輸入您的個人簡介，輸入過程中用滑鼠選取文字可以更改文字的樣式(限1500字數)',
};

// 經歷
const experience = {
  companyName: '請輸入公司/單位名稱(必填,限150個字)',
  jobName: '請輸入擔任的職稱/角色(必填,限150個字)',
  jobCategory: '請輸入職務類別(必選)',
  companyCategory: '請選擇產業類別',
  description: '請輸入主要的工作內容',
  sampleText: '限1000個字',
  talentList: '在之中用到哪些技能呢?',
};

// 專案成就
const honor = {
  title: '專案、成就名稱',
  description: '參與內容、擔任角色、負責任務及貢獻',
  talentList: '在之中用到哪些技能呢?',
  startYear: 2016,
  startMonth: 9,
  endYear: 2018,
  endMonth: 6,
};

// 技能專長
const talent = {
  tag: '請輸入專長、技能名稱(必填)',
  description: '請輸入你的技能描述，盡量清楚描述你在此技能的熟練、應用程度，例如語言能夠順常的與外國人口說對話、程式能夠在遇到需求的時候快速轉換成程式結構並且加以實現等',
};

// 作品集
const gallery = {
  title: '作品名稱',
  description: '作品說明',
};

// 學歷
const education = {
  schoolName: '請輸入學校名稱(必填,限100字數)',
  majorName: '請輸入主修或科系(必填,限100字數)',
  degree: '學位程度(必選)',
};

// 客製化
const custom = {
  title: '客製化專區標題(必填)',
  description: '內容描述',
};

// github
const github = {};

// behance
const behance = {};

// plus_activity
const plus_activity = {};

export {
	basic,
	honor,
	experience,
	education,
	talent,
	gallery,
  custom,
  github,
	behance,
  plus_activity,
};
