import req from "./https";

// 公司專頁內容
export const apiGetCompanyCustonInfo = data => {
  return req("get", `/companies/${data.custno}/info`);
};

// 搜尋公司 autocomplete
export const apiGetCompaniesAutocomplete = data => {
  return req("get", `/companies/autocomplete`, data);
};

// 搜尋公司列表
export const apiGetCompaniesSearch = data => {
  return req("get", `/companies/search`, data);
};

// 依經歷的公司欄位取得系統建議的公司(含相似公司)
export const apiGetCompaniesCandidate = data => {
  return req("get", "/companies/candidate", data);
};

// 工作機會
export const apiGetCompaniesJobs = data => {
  return req("get", `/companies/${data.custno}/jobs`, data);
};

// 比較公司
export const apiGetCompanyCompare = data => {
  return req("get", `/companies/compare`, data);
};
