import req from "./https";

// 取得墊檔素材
export const apiGetSpareMaterial = params => {
  return req(
    "get",
    `/spareMaterial/board/${params.boardId}`,
    params,
    "getSpareMaterial"
  );
};

// 修改墊檔素材
export const apiPutSpareMaterial = params => {
  return req(
    "put",
    `/spareMaterial/${params.materialId}`,
    params,
    "putSpareMaterial"
  );
};

// 新增墊檔素材
export const apiPostSpareMaterial = params => {
  return req("post", "/spareMaterial", params, "postSpareMaterial");
};

// 刪除墊檔素材
export const apiDeleteSpareMaterial = params => {
  return req(
    "delete",
    `/spareMaterial/${params.materialId}`,
    params,
    "deleteSpareMaterial"
  );
};

// 取得單一墊檔素材
export const apiGetSingleSpareMaterial = params => {
  return req(
    "get",
    `/spareMaterial/${params}`,
    params,
    "getSingleSpareMaterial"
  );
};

// 取得正式墊檔素材列表
export const apiGetfinalSpareMaterialReservation = params => {
  return req(
    "get",
    `/spareMaterial/final/board/${params.boardId}`,
    params,
    "getfinalSpareMaterialReservation"
  );
};

// 選定一個墊檔素材
export const apiPostSpareMaterialDecision = params => {
  return req(
    "post",
    `/spareMaterial/${params.materialId}/board/${params.boardId}/decision`,
    null,
    "postSpareMaterialDecision"
  );
};

// 取得墊檔圖片上傳位置
export const apiGetSpareMaterialPresignedurl = params => {
  return req(
    "get",
    "/spareMaterial/presignedurl",
    params,
    "getSpareMaterialPresignedurl"
  );
};

// 上傳壓縮檔
export const apiPostSpareMaterialUploadZip = params => {
  return req(
    "post",
    `/spareMaterial/upload/zip/${params.id}`,
    params.file,
    "postSpareMaterialUploadZip"
  );
};
