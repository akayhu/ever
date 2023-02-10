import req from "./https";

// 儲存盤點結果
export const apiPatchInventory = params => {
  return req("patch", `/inventory`, params, "patchInventory");
};

// 年度盤點環境使用需求, 填寫頁面
export const apiGetInventoryId = params => {
  return req("get", `/inventory/${params.id}`, params, "getInventoryId");
};

// 取得最新盤點日期區間
export const apiGetInventoryLatestDate = () => {
  return req("get", `/inventory/latestDate`, null, "getInventoryLatestDate");
};
