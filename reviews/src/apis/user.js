import req from "./https";

// 取得登入狀態
export const apiGetAuthStatus = () => {
  return req("get", "/auth/status");
};

// 查詢使用者工作經歷列表(需登入)
export const apiGetUserResumeExp = () => {
  return req("get", "/user/resume/exp");
};

// 紀錄曾經瀏覽過的公司
export const apiGetUserBrowsesCompany = () => {
  return req("get", "/user/browses/company");
};

// 登入
export const login = path => {
  return (document.location.href = `https:${process.env.VUE_APP_API_DOMAIN_URL}auth/login?relayState=${path}`);
};

// 登出
export const logout = path => {
  return (document.location.href = `https:${process.env.VUE_APP_API_DOMAIN_URL}auth/logout?relayState=${path}`);
};

// 取得使用者頭像
export const headShot = () => {
  return req("get", "/user/resume/headShot");
};
