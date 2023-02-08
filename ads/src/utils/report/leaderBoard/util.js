import icon1 from "@/assets/icon/icon-move-01.svg";
import icon2 from "@/assets/icon/icon-move-02.svg";
import icon3 from "@/assets/icon/icon-move-03.svg";
import icon4 from "@/assets/icon/icon-move-04.svg";

//成效排行 - 版位成效
export const boardTableTitle = [
  { label: "載具", key: "device", isSortAble: false },
  { label: "頻道", key: "channel", isSortAble: false },
  { label: "版位", key: "board", isSortAble: false },
  { label: "IMP", key: "impression", isSortAble: true },
  { label: "Click", key: "click", isSortAble: true },
  { label: "CTR", key: "ctr", isSortAble: true }
];

//成效排行 - 企業成效
export const companyTableTitle = [
  { label: "企業", key: "company", isSortAble: false },
  { label: "版位", key: "board", isSortAble: false },
  { label: "上刊時間", key: "duration", isSortAble: false },
  { label: "統計天數", key: "days", isSortAble: false },
  { label: "IMP", key: "impression", isSortAble: true },
  { label: "Click", key: "click", isSortAble: true },
  { label: "CTR", key: "ctr", isSortAble: true },
  { label: "備註", key: "psnotes", isSortAble: false }
];

//成效排行 - 素材成效
export const materialTableTitle = [
  {
    label: "素材",
    key: "material",
    isSortAble: false,
    isWarmShow: false,
    warmText: ""
  },
  {
    label: "企業",
    key: "company",
    isSortAble: false,
    isWarmShow: false,
    warmText: ""
  },
  {
    label: "版位",
    key: "board",
    isSortAble: false,
    isWarmShow: false,
    warmText: ""
  },
  {
    label: "上刊時間",
    key: "duration",
    isSortAble: false,
    isWarmShow: false,
    warmText: ""
  },
  {
    label: "統計天數",
    key: "days",
    isSortAble: false,
    isWarmShow: false,
    warmText: ""
  },
  {
    label: "IMP",
    key: "impression",
    isSortAble: true,
    isWarmShow: false,
    warmText: ""
  },
  {
    label: "Click",
    key: "click",
    isSortAble: true,
    isWarmShow: false,
    warmText: ""
  },
  {
    label: "CTR",
    key: "ctr",
    isSortAble: true,
    isWarmShow: false,
    warmText: ""
  },
  {
    label: "R1",
    key: "r1",
    isSortAble: false,
    isWarmShow: true,
    warmText: "版位主應轉換率"
  },
  {
    label: "R2",
    key: "r2",
    isSortAble: false,
    isWarmShow: true,
    warmText: "活動頁主應轉換率"
  },
  {
    label: "備註",
    key: "psnotes",
    isSortAble: false,
    isWarmShow: false,
    warmText: ""
  }
];

//成效排行 -  各版位逐日
export const boardByDayTableTitle = [
  { label: "日期", key: "date", isSortAble: false },
  { label: "曝光數", key: "impression", isSortAble: false },
  { label: "點擊數", key: "click", isSortAble: false },
  { label: "CTR", key: "ctr", isSortAble: false }
];

export const tabsData = [
  { key: "TabBoardCompare", label: "各版位成效比較(不分企業)" },
  { key: "TabCompanyCompare", label: "各企業成效比較" },
  { key: "TabMaterialCompare", label: "各素材成效比較" },
  { key: "TabBoardByDayCompare", label: "各版位逐日數據" }
];

export const iconList = [
  { icon: icon1, text: "空版PR" },
  { icon: icon2, text: "成效PR" },
  { icon: icon3, text: "其他專案" },
  { icon: icon4, text: "緊急下架" }
];
