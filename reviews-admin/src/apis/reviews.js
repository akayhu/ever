import req from "./https";

// 待審核評論列表
export const apiGetReviews = params => {
  return req("get", "/reviews", params);
};

// 待審核評論詳細頁內容
export const apiGetReviewsDetail = params => {
  return req("get", `/reviews/${params.id}`);
};

// 搜尋評論列表
export const apiGetReviewsSearch = params => {
  return req("get", `/reviews/search`, params);
};

// 申訴列表
export const apiGetReviewsAccuses = params => {
  return req("get", `/reviews/accuses`, params);
};

// 審核評論
export const apiPatchReviewsDetail = params => {
  return req("patch", `/reviews/audit`, params);
};

// 審核申訴
export const apiPatchReviewsAccuse = params => {
  return req("patch", `/reviews/accuse`, params);
};

// 老闆回覆紀錄
export const apiGetBossReplyRecord = params => {
  return req("get", `/reviews/bossReplys`, params);
};

// 刪除老闆回覆
export const apiDeleteBossReply = params => {
  return req("delete", `/reviews/${params.id}/bossReply`);
};
