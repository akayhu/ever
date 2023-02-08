import req from "./https";

// 依報價單號查詢簽核歷史記錄
export const apiGetQuotationHistory = params => {
  return req(
    "get",
    `review/quotation/${params.id}/history`,
    params,
    "getQuotationHistory"
  );
};

// 依促案編號查詢簽核歷史記錄
export const apiGetProductPromoHistory = params => {
  return req(
    "get",
    `review/productPromo/${params.id}/history`,
    params,
    "getProductPromoHistory"
  );
};

// 依來源編號查詢目前可簽核人員
export const apiGetResourceApprover = params => {
  return req(
    "get",
    `/review/resource/${params.id}/approver`,
    params,
    "getResourceApprover"
  );
};

// 同意或駁回指定的表單
export const apiPostResourceAction = params => {
  return req(
    "post",
    `review/resource/${params.id}/decide?type=${params.type}`,
    params,
    "postResourceAction"
  );
};

// 依來源編號與類型查詢目前簽核進度
export const apiGetResourceSchedule = params => {
  return req(
    "get",
    `review/resource/${params.id}/schedule`,
    params,
    "getResourceSchedule"
  );
};
