import req from "./https";

// 取得頻道資訊(含頻道下拉選單)
export const apiGetChannel = params => {
  return req(
    "get",
    `/component/site/${params.siteId}/channel`,
    params,
    "getChannel"
  );
};

// 新增頻道(多筆)
export const apiPostChannel = params => {
  return req(
    "post",
    `/component/site/${params[0].siteId}/channel`,
    params,
    "postChannel"
  );
};

// 修改頻道
export const apiPatchChannel = params => {
  return req(
    "patch",
    `/component/site/${params.siteId}/channel`,
    params,
    "patchChannel"
  );
};

// 取得單筆頻道資訊
export const apiGetChannelId = params => {
  return req(
    "get",
    `/component/site/${params.siteId}/channel/${params.channelId}`,
    params,
    "getChannelId"
  );
};

// 刪除頻道
export const apiDeleteChannelId = params => {
  return req(
    "delete",
    `/component/site/${params.siteId}/channel/${params.channelId}`,
    params,
    "deleteChannelId"
  );
};

// 頻道名稱推薦
export const apiGetChannelSuggest = params => {
  return req(
    "get",
    `/component/site/${params.siteId}/channel/suggest?keyword=${params.keyword}`,
    null,
    "getChannelSuggest"
  );
};
