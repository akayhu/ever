import req from "./https";

// 評論列表
export const apiGetReviewsList = data => {
  return req("get", "/reviews", data);
};

// 新增評論
export const apiPostReviews = data => {
  return req("post", "/reviews", data);
};

// 評論詳細內容
export const apiGetReviewsDetail = data => {
  return req("get", `/reviews/${data.id}`, data);
};

// 感興趣的評論列表
export const apiGetReviewsInterested = data => {
  return req("get", `/reviews/interested`, data);
};

// 新增面試評論
export const apiPostInterviewReviews = data => {
  return req("post", "/reviews/interview", data);
};

// 檢查是否有在 30 天內新增面試評論
export const apiGetInterviewReviewStatus = data => {
  return req("get", "/reviews/interview/status", data);
};
