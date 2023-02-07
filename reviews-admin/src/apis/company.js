import req from "./https";

// 單筆搜尋公司
export const apiGetCompany = params => {
  return req("get", `/companies/${params.custno}`);
};

// 上下架公司
export const apiPostCompanyOnOff = params => {
  return req("post", `/companies/${params.custno}`, params);
};

// 下架列表
export const apiGetCompanyOffLists = params => {
  return req("get", `/companies`, params);
};
