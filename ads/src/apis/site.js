import req from "./https";

// 拿到裝置底下有多少個站點
export const apiGetSite = params => {
  return req("get", `/component/site`, params, "getSite");
};
