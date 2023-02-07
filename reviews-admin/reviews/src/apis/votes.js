import req from "./https";

// 投票列表
export const apiGetVotesList = data => {
  return req("get", "/votes", data);
};

// 投票詳細內容
export const apiGetVotesDetail = data => {
  return req("get", `/votes/${data.id}`);
};

// 新增投票
export const apiPostVotes = data => {
  return req("post", "/votes", data);
};

// 投票
export const apiPutVotes = data => {
  return req("put", `/votes/${data.id}`, data.answers);
};

// 感興趣投票列表
export const apiGetVotesInterested = data => {
  return req("get", "/votes/interested", data);
};
