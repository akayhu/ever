import req from "./https";

// 取得所有企業資訊(上限1000筆)
export const apiGetCustomer = () => {
  return req("get", `/customer`, null, "getCustomer");
};
