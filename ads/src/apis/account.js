import req from "./https";

// 依身分查詢使用者
export const apiGetAccountSearch = params => {
  return req(
    "get",
    `/account/search?keyword=${encodeURIComponent(params.keyword)}`,
    null,
    "getAccountSearch"
  );
};

// 取得會員資料
export const apiGetAccountId = params => {
  return req("get", `/account/${params.accountId}`, null, "getAccountId");
};
