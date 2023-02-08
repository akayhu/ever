import req from "./https";

// 取得網站資訊(含網站下拉選單)
export const apiGetSite = params => {
  return req("get", "/component/site", params, "getSite");
};

// 新增網站
export const apiPostSite = params => {
  return req("post", "/component/site", params, "postSite");
};

// 修改網站
export const apiPatchSite = params => {
  return req("patch", "/component/site", params, "patchSite");
};

// 取得單筆網站資訊
export const apiGetSiteId = params => {
  return req("get", `/component/site/${params.siteId}`, params, "getSiteId");
};

// 刪除網站
export const apiDeleteSiteId = params => {
  return req(
    "delete",
    `/component/site/${params.siteId}`,
    params,
    "deleteSiteId"
  );
};

// 網站名稱推薦
export const apiGetSiteSuggest = params => {
  return req(
    "get",
    `/component/site/suggest?keyword=${params.keyword}&device=${params.device}`,
    null,
    "getSiteSuggest"
  );
};
