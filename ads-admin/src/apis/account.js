import req from "./https";

// 取得會員資料列表
export const apiGetAccount = params => {
  return req("get", "/account", params, "getAccount");
};

// 新增會員資料
export const apiPostAccount = params => {
  return req("post", "/account", params, "postAccount");
};

// 取得會員資料
export const apiGetAccountId = params => {
  return req("get", `/account/${params.accountId}`, null, "getAccountId");
};

// 更新會員資料
export const apiPutAccountId = params => {
  return req("put", `/account/${params.accountId}`, params, "putAccountId");
};

// 刪除會員資料
export const apiDeleteAccountId = params => {
  return req(
    "delete",
    `/account/${params.accountId}`,
    params,
    "deleteAccountId"
  );
};

// 查詢公司分機表
export const apiGetPhoneUser = params => {
  return req("get", "/account/phoneUser", params, "getPhoneUser");
};

// 根據輸入資訊查詢使用者
export const apiGetAccountRecommend = params => {
  return req("get", "/account/recommend", params, "getAccountRecommend");
};

// 依身分查詢使用者
export const apiGetAccountSearch = params => {
  return req(
    "get",
    `/account/search?keyword=${params.keyword}`,
    null,
    "getAccountSearch"
  );
};
