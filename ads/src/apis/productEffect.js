import req from "./https";

// 取得版位成效
export const apiGetProductEffect = params => {
  return req("get", `/component/product/effect`, params, "getEffect");
};

// 更新版位成效
export const apiPutProductEffect = params => {
  return req(
    "put",
    `/component/product/effect?quarter=${params.quarter}&year=${params.year}
  `,
    params.requestProductEffectList,
    "putEffect"
  );
};
