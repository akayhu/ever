import req from "./https";

// 拿到特定站點底下有多少個頻道
export const apiGetChannel = params => {
  return req(
    "get",
    `component/site/${params.siteId}/channel`,
    params,
    "getChannel"
  );
};

// 拿到(所有/特定)裝置底下所有站點的所有頻道
export const apiGetAllChannels = params => {
  return req("get", `/component/site/0/channel`, params, "getAllChannels");
};
