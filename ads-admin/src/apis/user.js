import req from "./https";

// 登入
export const login = () => {
  return (document.location.href = `https:${process.env.VUE_APP_API_DOMAIN_URL}admin/auth/login?relayState=/loginhome`);
};

// 登出
export const logout = () => {
  return (document.location.href = `https:${process.env.VUE_APP_API_DOMAIN_URL}admin/auth/logout?relayState=/`);
};

// 後台使用者登入資訊
export const apiGetAuthAdminStatus = () => {
  return req("get", "/admin/auth/status", null, "getAuthAdminStatus");
};
