import req from "./https";

// 取得型態列表
export const apiGetType = () => {
  return req("get", "/type/", null, "getType");
};

// 取得型態設定
export const apiGetBoardIdType = params => {
  return req(
    "get",
    `/type/${params.typeId}/boardId/${params.boardId}`,
    params,
    "getBoardIdType"
  );
};
