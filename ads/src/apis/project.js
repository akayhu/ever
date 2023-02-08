import req from "./https";
import { filterQueries } from "@/utils/queryString";

// 選擇企業
export const apiGetCustomerSuggestion = params => {
  return req("get", `/customer/suggestion`, params, "getCustomerSuggestion");
};

export const apiGetCustomerSuggestionKeyword = params => {
  return req(
    "get",
    `/customer/suggestion?keyword=${encodeURIComponent(params.keyword)}`,
    null,
    "getCustomerSuggestionKeyword"
  );
};

// 依推薦結果查詢專案(列表)
export const apiGetProject = params => {
  return req("get", "/project", params, "getProject");
};

// 新增預約專案
export const apiPostProject = params => {
  return req("post", "/project", params, "postProject");
};

// 修改預約專案
export const apiPatchProject = params => {
  return req("patch", `/project/${params.id}`, params, "patchProject");
};

// 依報價單編號查詢可拉Cue的預約專案數
export const apiGetProjectAvailableCount = params => {
  return req(
    "get",
    `/project/availableCount`,
    params,
    "getProjectAvailableCount"
  );
};

// 查詢單筆預約專案
export const apiGetProjectId = params => {
  return req("get", `/project/${params.projectId}`, params, "getProjectId");
};

// 刪除預約專案
export const apiDeleteProjectId = params => {
  return req("delete", `/project/${params.id}`, params, "deleteProjectId");
};

// 依關鍵字推薦專案
export const apiGetProjectRecommend = params => {
  return req(
    "get",
    `/project/recommend?keyword=${encodeURIComponent(params.keyword)}`,
    filterQueries(params, ["keyword"]),
    "getProjectRecommend"
  );
};

// 依關鍵字搜尋專案(預約版位銷用)
export const apiGetProjectSearch = params => {
  return req(
    "get",
    `/project/search?keyword=${encodeURIComponent(params.keyword)}`,
    filterQueries(params, ["keyword"]),
    "getProjectSearch"
  );
};

// 依關鍵字推薦企業或專案
export const apiGetProjectSuggestion = params => {
  return req(
    "get",
    `/project/suggestion?keyword=${encodeURIComponent(params.keyword)}`,
    filterQueries(params, ["keyword"]),
    "getProjectSuggestion"
  );
};
