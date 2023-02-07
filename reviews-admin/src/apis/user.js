import req from "./https";

// 登入
export const login = () => {
  return (document.location.href = `https:${process.env.VUE_APP_API_DOMAIN_URL}admin/auth/login?relayState=/review_list`);
};

// 後台使用者登入狀態
export const apiGetAuthStatus = params => {
  return req("get", "/auth/status", params);
};

// 帳號權限查詢(列表)
export const apiGetAccounts = params => {
  return req("get", "/accounts", params);
};

// 新增帳號
export const apiPostAccounts = params => {
  return req("post", "/accounts", params);
};

// 刪除帳號權限資料
export const apiDeleteAccounts = params => {
  return req("delete", `/accounts/${params.accountId}`);
};

// 修改帳號權限資料
export const apiPatchAccounts = params => {
  return req("patch", `/accounts/${params.accountId}`, params);
};
