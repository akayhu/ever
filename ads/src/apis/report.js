import req from "./https";
import { filterQueries } from "@/utils/queryString";

// 依關鍵字與廣告區間篩選有曝光的企業(客戶)
export const apiGetFilterCustomerSuggest = params => {
  return req(
    "get",
    `/report/filter/customer/suggest?keyword=${encodeURIComponent(
      params.keyword
    )}`,
    filterQueries(params, ["keyword"]),
    "getFilterCustomerSuggest"
  );
};

// 依關鍵字與廣告區間篩選有曝光的版位
export const apiGetFilterBoardSuggest = params => {
  return req(
    "get",
    `/report/filter/board/suggest?keyword=${encodeURIComponent(
      params.keyword
    )}`,
    filterQueries(params, ["keyword"]),
    "getFilterBoardSuggest"
  );
};

// 依企業與廣告區間篩選專案
export const apiGetFilterProjectSuggest = params => {
  return req(
    "get",
    "/report/filter/project/suggest",
    params,
    "getFilterProjectSuggest"
  );
};

// 依專案編號查詢有曝光的版位
export const apiGetFilterBoard = params => {
  return req("get", "/report/filter/board", params, "getFilterBoard");
};

// 成效排行榜-版位比較查詢
export const apiGetBoardCompare = params => {
  return req(
    "get",
    "/report/leaderboard/board-compare",
    params,
    "getBoardCompare"
  );
};

// 成效排行榜-企業版位比較查詢
export const apiGetCompanyCompare = params => {
  return req(
    "get",
    "/report/leaderboard/customer-compare",
    params,
    "getCompanyCompare"
  );
};

// 成效排行榜-素材版位比較查詢
export const apiGetMaterialCompare = params => {
  return req(
    "get",
    "/report/leaderboard/material-compare",
    params,
    "getMaterialCompare"
  );
};

// 成效排行榜-版位逐日數據
export const apiGetBoardByDayCompareSummary = params => {
  return req(
    "get",
    "/report/leaderboard/board-daily/summary",
    params,
    "getBoardByDayCompareSummary"
  );
};

// 成效排行榜-版位逐日數據
export const apiGetBoardByDayCompare = params => {
  return req(
    "get",
    "/report/leaderboard/board-daily/board-compare",
    params,
    "getBoardByDayCompare"
  );
};

// 企業結案報告-總表
export const apiGetClosingProjectSummary = params => {
  return req(
    "get",
    `/report/closing-project/project/${params.porjId}/summary`,
    params,
    "getClosingProjectSummary"
  );
};

// 企業結案報告-廣告數據版位總計
export const apiGetClosingProjectBoardAdSummary = params => {
  return req(
    "get",
    `/report/closing-project/project/${params.porjId}/board/${params.boardId}/summary`,
    params,
    "getClosingProjectBoardAdSummary"
  );
};

// 企業結案報告-廣告版位數據列表
export const apiGetClosingProjectBoardAdData = params => {
  return req(
    "get",
    `/report/closing-project/project/${params.porjId}/board/${params.boardId}/advertisingData`,
    params,
    "getClosingProjectBoardAdData"
  );
};

// 企業結案報告-應徵數據控制器
export const apiGetClosingProjectJobApplyDataSummary = params => {
  return req(
    "get",
    `/report/closing-project/project/${params.porjId}/jobApplyData/summary`,
    params,
    "getClosingProjectJobApplyDataSummary"
  );
};

// 企業結案報告:區間應徵數據總計
export const apiGetClosingProjectJobApplyDataPeriodSummary = params => {
  return req(
    "get",
    `/report/closing-project/project/${params.porjId}/jobApplyData/period-summary`,
    params,
    "getClosingProjectJobApplyDataPeriodSummary"
  );
};

// 企業結案報告-應徵數據
export const apiGetClosingProjectJobApplyData = params => {
  return req(
    "get",
    `/report/closing-project/project/${params.porjId}/jobApplyData`,
    params,
    "getClosingProjectJobApplyData"
  );
};

// 企業資料維護-活動頁查詢
export const apiGetMaintainActivityPage = params => {
  return req(
    "get",
    `/report/maintain/project/${params.porjId}/activityPage`,
    params,
    "getMaintainActivityPage"
  );
};

//企業資料維護-查詢專案下設定之職缺數量
export const apiGetMaintainJobSettingCount = params => {
  return req(
    "get",
    `/report/maintain/project/${params.projectId}/job-setting-count`,
    params,
    "getMaintainJobSettingCount"
  );
};

//企業資料維護-查詢網頁曝光設定與報表狀態
export const apiGetMaintainJobSettingReportStatus = params => {
  return req(
    "get",
    `/report/maintain/project/${params.projectId}/job-setting-report-status`,
    params,
    "getMaintainJobSettingReportStatus"
  );
};

// 企業資料維護-網頁職缺設定上傳與查詢
export const apiPostExcelJobSetting = params => {
  return req(
    "post",
    `/report/file/customer/${params.customerId}/project/${params.projectId}/jobSetting`,
    params.formData,
    "postExcelJobSetting"
  );
};

// 查詢專案下設定之職缺資訊(含設定)
export const apiGetMaintainJobSetting = params => {
  return req(
    "get",
    `/report/maintain/project/${params.projectId}/job-setting`,
    params,
    "getMaintainJobSetting"
  );
};

// 新增專案網頁曝光職缺(日期區間)
export const apiPostMaintainJobSetting = params => {
  return req(
    "post",
    `/report/maintain/project/${params.projectId}/job-setting`,
    params.data,
    "postMaintainJobSetting"
  );
};

// 刪除專案網頁曝光職缺(日期區間)
export const apiPutMaintainJobSetting = params => {
  return req(
    "put",
    `/report/maintain/project/${params.projectId}/job-setting`,
    params.data,
    "putMaintainJobSetting"
  );
};

// 產生結案報告:廣告數據綜合版本
export const apiRenderAdvertisingReport = params => {
  return req(
    "post",
    "report/file/download/closing-project/advertising-complete-data",
    params,
    "renderAdvertisingReport"
  );
};

// 產生結案報告:主應數據各種版本
export const apiRenderJobapplyReport = params => {
  return req(
    "post",
    "report/file/download/closing-project/jobapply-complete-data",
    params,
    "renderJobapplyReport"
  );
};

// 報表製作列表查詢
export const apiGetReportProcessList = params => {
  return req(
    "get",
    `/report/file/report-proccess-list`,
    params,
    "getReportProcessList"
  );
};

// 報表製作狀況查詢
export const apiGetReportStatus = tokens => {
  const params = tokens.map(item => `queueIds=${item}`).join("&");
  return req(
    "get",
    `/report/file/report-status?${params}`,
    tokens,
    "getReportStatus"
  );
};
