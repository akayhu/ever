import req from "./https";

// 解譯 app action URI
export const apiAppDecode = params => {
  return req("post", "/app/ad/parameter/decode", params, "appDecode");
};
