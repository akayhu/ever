import req from "./https";
import { filterQueries } from "@/utils/queryString";

// 取得使用者行為紀錄列表
export const apiGetLog = params => {
  if (params.logTypes) {
    return req(
      "get",
      `/log?logTypes=${params.logTypes}`,
      filterQueries(params, ["logTypes"]),
      "getLog"
    );
  } else {
    return req("get", "/log", params, "getLog");
  }
};

// 取得比對結果
export const apiGetLogidCompareResult = params => {
  return req(
    "get",
    `/log/${params.logId}/compare-result`,
    params,
    "getLogidCompareResult"
  );
};

// 取得資料歷史紀錄
export const apiGetLogDataHistory = params => {
  return req("get", "/log/data-history", params, "getLogDataHistory");
};
