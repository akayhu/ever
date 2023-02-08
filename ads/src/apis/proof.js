import req from "./https";

// 取得樣張截圖
export const apiGetProofSnapshot = params => {
  return req("get", `/proof/?${params}`, null, "getProofSnapshot");
};

// 取得樣張預覽
export const apiGetProofPreview = params => {
  return req("get", `/proof/preview`, params, "getProofPreview");
};

// 重新產生一般樣張預覽
export const apiRerenderMaterialPreview = materialId => {
  return req(
    "get",
    `/proof/material/${materialId}`,
    null,
    "rerenderMaterialPreview"
  );
};

// 重新產生墊檔樣張預覽
export const apiRerenderCushionPreview = params => {
  return req(
    "get",
    `/proof/material/${params.materialId}/board/${params.boardId}`,
    null,
    "rerenderCushionPreview"
  );
};

// 重新產生樣張截圖（後端爲非同步排程處理）
export const apiRerenderProofSnapshot = id => {
  return req("get", `/proof/shelf/${id}`, null, "rerenderProofSnapshot");
};
