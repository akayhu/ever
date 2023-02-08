import moment from "moment";

export const adDataTableTitle = [
  { label: "時間", key: "date" },
  { label: "IMP", key: "impression" },
  { label: "Click", key: "click" },
  { label: "CTR", key: "ctr" },
  { label: "曝光素材", key: "materialId" }
  // { label: "URL", key: "url" }
];

//報表標題
export const projectApplyTitle = [
  { label: "職務名稱", key: "jobName" },
  { label: "Jobno", key: "jobNo" },
  { label: "開啟日", key: "turnonDate" },
  { label: "狀態", key: "status" },
  { label: "應徵數", key: "applyCount" },
  { label: "瀏覽數", key: "viewCount" },
  { label: "刊登天數", key: "turnonDays" },
  { label: "網頁曝光職缺", key: "focus" }
];

export const tabsData = [
  { key: "TabProjectSummary", label: "企業結案報告" },
  { key: "TabProjectBoardAd", label: "廣告數據" },
  { key: "TabProjectBoardApply", label: "主應數據" }
];

export const adDeviceTabs = [
  { key: "PC", label: "PC", value: "pc" },
  { key: "APP", label: "APP", value: "app" },
  { key: "MOBILE", label: "Mobile", value: "mobile" }
];

export const adSelectedOption = [
  { value: true, label: "by素材" },
  { value: false, label: "不分素材" }
];

export const applySelectedOption = [
  { value: false, label: "全部職缺", key: "all" },
  { value: true, label: "網頁曝光職缺", key: "focus" }
];

// 取起始日期至結束日期區間日期
export const getPeriod = (
  start,
  end,
  periodType = "isoweek",
  reverse = false
) => {
  let result = [];
  if (!start || !end) return result;

  let startDate = moment(start);
  let endDate = moment(end);

  if (periodType === "isoweek") {
    startDate = startDate
      .clone()
      .subtract(7, "d")
      .startOf("isoWeek");
    endDate = endDate.endOf("isoWeek");

    let index = 0;
    while (startDate <= endDate) {
      const weekLastDate = startDate.clone().endOf("isoWeek");
      result.push({
        index,
        startDate: startDate.format("YYYY/MM/DD"),
        endDate: weekLastDate.format("YYYY/MM/DD")
      });
      index++;
      startDate.add(1, "weeks");
    }
  } else if (periodType === "week") {
    startDate = startDate.subtract(7, "d");
    let index = 0;

    while (startDate <= endDate) {
      result.push({
        index,
        startDate: startDate.format("YYYY/MM/DD"),
        endDate:
          startDate.add(6, "d") > endDate
            ? endDate.format("YYYY/MM/DD")
            : startDate.format("YYYY/MM/DD")
      });
      index++;
      startDate.add(1, "d");
    }
  } else if (periodType === "days") {
    let index = 0;
    while (startDate <= endDate) {
      result.push({
        index,
        startDate: startDate.format("YYYY/MM/DD"),
        endDate: startDate.format("YYYY/MM/DD")
      });
      index++;
      startDate.add(1, "days");
    }
  }

  if (reverse) {
    result = result.reverse();
    result.forEach((item, index) => {
      item.index = index;
    });
    return result;
  }

  return result;
};
