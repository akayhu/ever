import req from "./https";

// 待審核投票列表
export const apiGetVotes = params => {
  return req("get", "/votes", params);
};

// 待審核投票列表
export const apiGetVotesDetail = params => {
  return req("get", `/votes/${params.id}`, params);
};

// 查詢投票列表
export const apiGetVotesSearch = params => {
  return req("get", "/votes/search", params);
};

// 投票審核
export const apiPatchVotesAudit = params => {
  return req("patch", "/votes/audit", params);
};
