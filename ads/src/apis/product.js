import req from "./https";
import { filterQueries } from "@/utils/queryString";

// 取得商品資訊
export const apiGetProduct = params => {
  return req(
    "get",
    `/component/product?keyword=${encodeURIComponent(params.keyword)}`,
    filterQueries(params, ["keyword"]),
    "getProduct"
  );
};

// 版位名稱推薦商品
export const apiGetProductBoardSuggest = params => {
  return req(
    "get",
    `/component/product/board/suggest?keyword=${encodeURIComponent(
      params.keyword
    )}&checkPermission=${params.checkPermission}`,
    null,
    "getProductBoardSuggest"
  );
};

// 以版位編號查詢商品
export const apiGetProductsByBoard = params => {
  return req(
    "get",
    `/component/product/board/${params.boardId}?checkPermission=${params.checkPermission}`,
    null,
    "getProductsByBoard"
  );
};

// 取得商品實際售出價錢資訊
export const apiGetCalculatePrice = params => {
  return req(
    "get",
    `/component/product/calculate/price`,
    params,
    "getCalculatePrice"
  );
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
