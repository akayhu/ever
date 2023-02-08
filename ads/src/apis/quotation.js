import req from "./https";
import { arrayChangeStrQuery, filterQueries } from "@/utils/queryString";

// 新增報價單/內服單
export const apiPostQuotation = params => {
  return req("post", `/quotation`, params, "postQuotation");
};

// 取得報價單/內服單
export const apiGetQuotationId = params => {
  return req("get", `/quotation/${params.id}`, params, "getQuotationId");
};

// 刪除報價單/內服單
export const apiDeleteQuotationId = params => {
  return req("delete", `quotation/${params.id}`, params, "deleteQuotationId");
};

// 修改報價單/內服單
export const apiPatchQuotationId = params => {
  return req("patch", `/quotation/${params.id}`, params, "patchQuotationId");
};

// 異動報價單/內服單狀態
export const apiPatchAction = params => {
  return req(
    "patch",
    `/quotation/${params.id}/${params.action}`,
    params,
    "apiPatchAction"
  );
};

// 取得報價單金額資訊
export const apiGetCalPrice = params => {
  return req("get", `/quotation/calculate/price`, params, "apiGetCalPrice");
};

// 取得報價單/內服單列表
export const apiGetQuotationFind = params => {
  const typeList = arrayChangeStrQuery("typeList", params.typeList);
  return req(
    "get",
    `/quotation/find?${typeList}`,
    filterQueries(params, ["typeList"]),
    "getQuotationFind"
  );
};

// 儲存聯絡人
export const apiPutContact = params => {
  return req("put", `/quotation/contact/`, params, "putContact");
};

// 取得聯絡人
export const apiGetContact = params => {
  return req(
    "get",
    `/quotation/contact/customer/${params.customerId}/contact/${params.name}`,
    null,
    "getContact"
  );
};

// 刪除聯絡人
export const apiDeleteContact = params => {
  return req(
    "delete",
    `/quotation/contact/customer/${params.customerId}/contact/${params.name}`,
    null,
    "deleteContact"
  );
};

// 取得聯絡人列表
export const apiGetContactFind = params => {
  return req(
    "get",
    `/quotation/contact/find/customer/${params.customerId}`,
    params,
    "getContactFind"
  );
};

// 下載合約
export const apiGetContractId = params => {
  return req(
    "get",
    `/quotation/contract/${params.id}`,
    params,
    "getContractId"
  );
};

// 建立合約
export const apiPostContractId = params => {
  return req(
    "post",
    `/quotation/contract/${params.id}`,
    params,
    "postContractId"
  );
};

// 取得客戶最後一張報價訂單
export const apiGetLastQuotation = params => {
  return req(
    "get",
    `/quotation/last/Quotation/${params.customerId}`,
    params,
    "getLastQuotation"
  );
};

// 取得客戶授信資料
export const apiGetCustomerCredit = params => {
  return req(
    "get",
    `/quotation/customer/${params.customerId}/credit`,
    params,
    "apiGetCustomerCredit"
  );
};

// 取得核決結果
export const apiQuotationPostVerify = params => {
  return req("post", `/quotation/verify`, params, "apiQuotationPostVerify");
};

// 取得檔案上傳路徑
export const apiGetQuotationPresignedurl = params => {
  return req(
    "get",
    "/quotation/attachment/presignedurl",
    params,
    "apiGetQuotationPresignedurl"
  );
};

// 確認檔案上傳完成
export const apiPostQuotationUploadFinished = params => {
  return req(
    "post",
    `/quotation/attachment/upload/ok`,
    params,
    "apiPostQuotationUploadFinished"
  );
};

// 取得已上傳檔案
export const apiGetQuotationAttachment = params => {
  return req(
    "get",
    `/quotation/attachment/quotation/${params.quotationId}`,
    params,
    "apiGetQuotationAttachment"
  );
};

// 刪除檔案
export const apiDeleteQuotationAttachment = params => {
  return req(
    "delete",
    `quotation/attachment/${params.attachmentId}/quotation/${params.quotationId}`,
    params,
    "apiDeleteQuotationAttachment"
  );
};

// 用訂單編號取得報價單/內服單
export const apiGetQuotationOrderId = params => {
  return req(
    "get",
    `/quotation/order/${params.orderId}`,
    params,
    "apiGetQuotationOrderId"
  );
};
