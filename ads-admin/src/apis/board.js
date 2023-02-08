import req from "./https";

// 新增版位
export const apiPostBoard = params => {
  return req(
    "post",
    `/component/site/${params.siteId}/channel/${params.channelId}`,
    params,
    "postBoard"
  );
};

// 修改版位
export const apiPatchBoard = params => {
  return req(
    "patch",
    `/component/site/${params.siteId}/channel/${params.channelId}`,
    params,
    "patchBoard"
  );
};

// 取得版位資訊
export const apiGetBoard = params => {
  return req(
    "get",
    `/component/site/${params.siteId}/channel/${params.channelId}/board`,
    params,
    "getBoard"
  );
};

// 取得單筆版位資訊
export const apiGetBoardId = params => {
  return req(
    "get",
    `/component/site/${params.siteId}/channel/${params.channelId}/board/${params.boardId}`,
    params,
    "getBoardId"
  );
};

// 刪除版位
export const apiDeleteBoardId = params => {
  return req(
    "delete",
    `/component/site/${params.siteId}/channel/${params.channelId}/board/${params.boardId}`,
    params,
    "deleteBoardId"
  );
};

// 版位名稱推薦
export const apiGetBoardSuggest = params => {
  return req(
    "get",
    `/component/site/${params.siteId}/channel/${params.channelId}/board/suggest?keyword=${params.keyword}`,
    null,
    "getBoardSuggest"
  );
};

// 取得所有版位資訊
export const apiGetAllBoard = () => {
  return req("get", "/component/board", null, "getAllBoard");
};

// 修改版位排序值
export const apiPatchBoardSort = params => {
  return req("patch", "/component/board", params, "patchBoardSort");
};
