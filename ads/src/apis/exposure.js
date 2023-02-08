import req from "./https";

// 修改曝光時間素材對應
export const apiPutExposure = params => {
  return req("put", "/exposure", params, "putExposure");
};

// 取得曝光時間素材對應
export const apiGetExposureReservation = params => {
  return req(
    "get",
    `/exposure/reservation/${params.reservationId}`,
    null,
    "getExposureReservation"
  );
};

// 清除所有曝光時間素材對應
export const apiDeleteExposureReservation = params => {
  return req(
    "delete",
    `/exposure/reservation/${params.reservationId}`,
    params,
    "deleteExposureReservation"
  );
};
