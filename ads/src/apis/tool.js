import req from "./https";

// 查詢小工具-查詢素材
export const apiGetToolMaterialId = params => {
  return req("get", `/tool/material/${params.id}`, params, "getToolMaterialId");
};

// 查詢小工具-查詢檔期
export const apiGetToolReservationId = params => {
  return req(
    "get",
    `/tool/reservation/${params.id}`,
    params,
    "getToolReservationId"
  );
};
