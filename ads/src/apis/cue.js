import req from "./https";

// Cue表各項金額統計資訊查詢(可進行試算)
export const apiPostCuePriceInformation = params => {
  return req(
    "post",
    `/cue/quotation/${params.quotationId}/priceInformation`,
    params.requestTrialCalculation,
    "apiPostCuePriceInformation"
  );
};

// 變更Cue表可輸入總牌價上限
export const apiPostCueTotalMarketPrice = params => {
  return req(
    "post",
    `/cue/quotation/${params.quotationId}/total-market-price`,
    params.newPrice,
    "apiPostCueTotalMarketPrice"
  );
};

// 取得Cue表可輸入總牌價申請變更資料
export const apiGetCueTotalMarketPriceChangeApplication = params => {
  return req(
    "get",
    `/cue/quotation/${params.quotationId}/totalMarketPrice/changeApplication`,
    params,
    "apiGetCueTotalMarketPriceChangeApplication"
  );
};

// 取得Cue表可輸入總牌價變更歷程
export const apiGetCueTotalMarketPriceHistory = params => {
  return req(
    "get",
    `/cue/quotation/${params.quotationId}/totalMarketPrice/history`,
    params,
    "apiGetCueTotalMarketPriceHistory"
  );
};

// 取得Cue表商品實際售出價錢資訊
export const apiGetProductCalculatePrice = params => {
  return req(
    "get",
    `/cue/quotation/product/calculate/price`,
    params,
    "apiGetProductCalculatePrice"
  );
};
