import req from "./https";

// 登入。登入後先到盤點帳號頁，再從盤點頁 authorityInventoryＭiddleware 判斷是否盤點過
export const login = (path = "/authorityInventory") => {
  return (document.location.href = `https:${process.env.VUE_APP_API_DOMAIN_URL}internal/auth/login?relayState=${path}`);
};

// 登出
export const logout = () => {
  return (document.location.href = `https:${process.env.VUE_APP_API_DOMAIN_URL}internal/auth/logout?relayState=/`);
};

// 前台使用者登入資訊
export const apiGetAuthStatus = () => {
  return req("get", `/internal/auth/status`, null, "getAuthStatus");
};
