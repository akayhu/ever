import req from "./https";

// PM查看盤點紀錄
export const apiGetInventory = params => {
  return req("get", `/inventory`, params, "getInventory");
};

// 關閉有異動(不需使用)、未盤點的帳號.
export const apiDeleteInventory = () => {
  return req("delete", `/inventory`, null, "getInventory");
};

// 年度盤點環境使用需求, 啟動盤點 記錄盤點開始/結束日期, 觸發寄信開口
export const apiPostInventoryActivate = params => {
  return req("post", `/inventory/activate`, params, "postInventoryActivate");
};

// 取得所有盤點區間
export const apiGetInventoryDates = () => {
  return req("get", `/inventory/dates`, null, "getInventoryDates");
};

// 取得最新盤點日期區間
export const apiGetInventoryLatestDate = () => {
  return req("get", `/inventory/latestDate`, null, "getInventoryLatestDate");
};

// 取得區間時間內尚登入的使用者
export const apiGetInventoryLoginHistory = params => {
  return req(
    "get",
    `/inventory/loginHistory`,
    params,
    "postInventoryLoginHistory"
  );
};

// 將盤點使用需求欄位還原預設
export const apiPatchInventoryRestore = params => {
  return req("patch", `/inventory/restore`, params, "patchInventoryRestore");
};
