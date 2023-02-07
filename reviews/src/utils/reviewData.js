import { TYPEID_MAP } from "./enum";
//產生 form 表單的固定資料

/** @description Determines the fullYearList.
 * @param {number} startYear The startYear of the fullYearList.
 * @return {Array} The fullYearList Array
 */

const fullYearList = startYear => {
  const year = new Date().getFullYear();
  const length = year - startYear + 1;
  const yearArr = [];
  for (let i = 0; i < length; i++) {
    yearArr.push({ value: startYear + i, label: startYear + i });
  }
  return yearArr;
};

const fullMonthList = () => {
  const monthArr = [];
  for (let i = 1; i <= 12; i++) monthArr.push({ value: i, label: i });
  return monthArr;
};

const resumeCompanyLists = () => {
  const companyLists = [
    { value: "永慶房屋", label: "永慶房屋" },
    { value: "鴻海", label: "鴻海" },
    { value: "台GG", label: "台GG" },
    { value: "星巴克", label: "星巴克" },
    { value: "家裡蹲", label: "家裡蹲" },
    {
      value: "",
      label: "以上都不是你想評論的公司嗎?"
    }
  ];

  return companyLists;
};

const getAllwageTypes = () => {
  const wageTypes = [
    { value: "hour", label: "時薪" },
    { value: "month", label: "月薪" },
    { value: "year", label: "年薪" }
  ];
  return wageTypes;
};

const monthWageNumber = wageType => {
  const thousandArr = [];
  const tenThousandArr = [];
  switch (wageType) {
    case "thousand":
      for (let i = 0; i <= 9; i++)
        thousandArr.push({ value: i, label: i + "千" });
      return thousandArr;
    case "ten-thousand":
      for (let i = 0; i <= 30; i++)
        tenThousandArr.push({ value: i, label: i + "萬" });
      return tenThousandArr;
    default:
      break;
  }
};

const yearWageNumber = () => {
  const yearlyWageOptionsArr = [
    { value: 1, label: "100萬以下" },
    { value: 2, label: "100~150萬" },
    { value: 3, label: "150~200萬" },
    { value: 4, label: "200~250萬" },
    { value: 5, label: "250~300萬" },
    { value: 6, label: "300萬以上" }
  ];
  return yearlyWageOptionsArr;
};

const plantList = () => {
  const plantArr = [
    { value: 1, label: "仙人掌" },
    { value: 2, label: "薰衣草" },
    { value: 3, label: "含羞草" },
    { value: 4, label: "向日葵" },
    { value: 5, label: "楓葉" },
    { value: 6, label: "孟宗竹" },
    { value: 7, label: "蒲公英" },
    { value: 8, label: "山茶花" }
  ];
  return plantArr;
};

const baseRatingOptions = () => {
  const optionsArr = [
    { value: "wage", label: "薪資福利" },
    { value: "environment", label: "公司環境" },
    { value: "atmosphere", label: "工作氣氛" },
    { value: "vision", label: "公司前景" },
    { value: "stability", label: "工作穩定" }
  ];

  return optionsArr;
};

const moreRatingOptions = () => {
  const optionsArr = [
    { value: "life", label: "兼顧生活" },
    { value: "friendly", label: "主管友善" },
    { value: "promote", label: "升遷機會" },
    { value: "education", label: "教育訓練" },
    { value: "teamwork", label: "團隊合作" }
  ];

  return optionsArr;
};

const initLightBoxData = () => {
  return {
    title: "",
    content: "",
    leftBtnContent: "",
    rightBtnContent: "",
    showCancelBtn: true,
    showConfirmBtn: true,
    leftCallBack: null,
    rightCallBack: null
  };
};

const checkIsTypeInterview = typeId => typeId === TYPEID_MAP.INTERVIEW;

export {
  resumeCompanyLists,
  fullYearList,
  fullMonthList,
  getAllwageTypes,
  monthWageNumber,
  yearWageNumber,
  plantList,
  baseRatingOptions,
  moreRatingOptions,
  initLightBoxData,
  checkIsTypeInterview
};
