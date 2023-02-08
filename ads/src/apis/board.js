import req from "./https";

// 拿到特定頻道底下有多少個版位
export const apiGetBoard = params => {
  return req(
    "get",
    `/component/site/${params.siteId}/channel/${params.channelId}/board`,
    params,
    "getBoard"
  );
};

// 從版位+型態取得單筆版位資訊(含型態內容)
export const apiGetBoardInfo = params => {
  return req(
    "get",
    `/component/board/${params.boardId}/type/${params.typeId}`,
    params,
    "getBoardInfo"
  );
};

// 版位名稱推薦
export const apiGetBoardSuggest = params => {
  return req(
    "get",
    `/component/board/suggest??keyword=${encodeURIComponent(
      params.keyword
    )}&checkPermission=${params.checkPermission}`,
    params,
    "getBoardSuggest"
  );
};
