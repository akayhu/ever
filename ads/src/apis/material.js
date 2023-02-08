import req from "./https";

// 新增素材
export const apiPostMaterial = params => {
  return req("post", "/material", params, "postMaterial");
};

// 刪除素材
export const apiDeleteMaterial = params => {
  return req(
    "delete",
    `/material/${params.materialId}/reservation/${params.reservationId}`,
    null,
    "deleteMaterial"
  );
};

// 取得單一素材
export const apiGetSingleMaterial = params => {
  return req("get", `/material/${params}`, params, "getSingleMaterial");
};

// 修改素材
export const apiPutMaterial = params => {
  return req("put", `/material/${params.materialId}`, params, "putMaterial");
};

// 取得正式素材列表
export const apiGetMaterialFinalReservation = params => {
  return req(
    "get",
    `/material/final/reservation/${params.reservationId}`,
    null,
    "getMaterialFinalReservation"
  );
};

// 取得圖片上傳路徑
export const apiGetMaterialPresignedurl = params => {
  return req(
    "get",
    "/material/presignedurl",
    params,
    "getMaterialPresignedurl"
  );
};

// 取得素材
export const apiGetMaterialReservation = params => {
  return req(
    "get",
    `/material/reservation/${params.reservationId}`,
    params,
    "getMaterialReservation"
  );
};

// 上傳壓縮檔
export const apiPostMaterialUploadZip = params => {
  return req(
    "post",
    `/material/upload/zip/${params.id}`,
    params.file,
    "postMaterialUploadZip"
  );
};

// 取得可複製素材選項
export const apiGetMaterialReservationGrouping = params => {
  return req(
    "get",
    "/material/reservation-grouping",
    params,
    "getMaterialReservationGrouping"
  );
};

// 複製素材
export const apiPostMaterialDuplicate = params => {
  return req("post", "/material/duplicate", params, "postMaterialDuplicate");
};
