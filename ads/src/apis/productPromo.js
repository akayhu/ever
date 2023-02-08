import req from "./https";
import { arrayChangeStrQuery, filterQueries } from "@/utils/queryString";

// 取得底價促案列表
export const apiGetProductPromo = params => {
  const auditList = arrayChangeStrQuery("auditList", params.auditList);
  return req(
    "get",
    `/component/product/promo?${auditList}`,
    filterQueries(params, ["auditList"]),
    "getProductPromo"
  );
};

// 新增/編輯底價促案
export const apiPutProductPromo = params => {
  return req(
    "put",
    `/component/product/promo?year=${params.year}&quarter=${params.quarter}`,
    params.requestProductPromo,
    "putProductPromo"
  );
};

// 取得底價促案
export const apiGetProductPromoId = params => {
  return req(
    "get",
    `/component/product/promo/${params.id}`,
    params,
    "getProductPromoId"
  );
};

// 異動促案狀態
export const apiPatchProductPromoIdAction = params => {
  return req(
    "patch",
    `/component/product/promo/${params.id}/${params.action}`,
    params,
    "putProductPromo"
  );
};

// 取得並套用底價促案
export const apiGetProductPromoIdApplyId = params => {
  return req(
    "get",
    `/component/product/promo/${params.id}/apply/${params.applyId}`,
    params,
    "getProductPromoIdApplyId"
  );
};

// 取得新增的底價促案
export const apiGetProductPromoNew = params => {
  return req(
    "get",
    `/component/product/promo/new`,
    params,
    "getProductPromoNew"
  );
};
