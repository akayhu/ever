import req from "./https";

// 查尋審核紀錄列表
export const apiGetLogSearch = params => {
  return req("get", "/logs/search", params);
};
