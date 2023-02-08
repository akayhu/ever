import req from "./https";
import { filterQueries } from "@/utils/queryString";

// 取得商品資訊
export const apiGetProduct = params => {
  return req(
    "get",
    `/component/product?keyword=${params.keyword}`,
    filterQueries(params, ["keyword"]),
    "getProduct"
  );
};

// 新增修改商品
export const apiPutProduct = params => {
  return req("put", "/component/product", params, "putProduct");
};

// 取得單筆商品資訊
export const apiGetProductId = params => {
  return req(
    "get",
    `/component/product/${params.productId}`,
    params,
    "getProductId"
  );
};

// 以版位編號查商品
export const apiGetProductBoard = params => {
  return req(
    "get",
    `/component/product/board/${params.boardId}`,
    params,
    "getProductBoard"
  );
};

// MIS 商品名稱推薦
export const apiGetProductMisSuggest = params => {
  return req(
    "get",
    `/component/product/mis/suggest?keyword=${params.keyword}&type=${params.type}`,
    null,
    "getProductMisSuggest"
  );
};

// 更新 MIS 商品資訊
export const apiPutProductMisSync = () => {
  return req("put", "/component/product/mis/sync", null, "putProductMisSync");
};

// 取得單筆商品資訊
export const apiGetProductCode = params => {
  return req(
    "get",
    `/component/product/code/${params.productCode}`,
    params,
    "apiGetProductCode"
  );
};
