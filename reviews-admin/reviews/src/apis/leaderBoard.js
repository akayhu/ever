import req from "./https";

// 首頁前五排行榜
export const apiGetLeaderBoardTop5 = () => {
  return req("get", "/leaderboard/top5");
};

// 搜尋公司排行榜
export const apiGetCompanyBoard = data => {
  return req("get", `/leaderboard`, data);
};
