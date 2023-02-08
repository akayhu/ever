import req from "./https";

// 取得型態設定(棄用)
export const apiGetBoardIdType = params => {
  return req(
    "get",
    `/type/${params.typeId}/boardId/${params.boardId}`,
    params,
    "getBoardIdType"
  );
};
