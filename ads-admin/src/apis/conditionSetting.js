import req from "./https";

// 取得條件列表
export const apiGetConditions = params => {
  if (!params) params = {};
  params.page = 1;
  params.size = 100;
  return req("get", "/condition/", params, "getConditions");
};

// 取得條件資訊
export const apiGetConditionById = id => {
  return req("get", `/condition/${id}`, null, "getConditionById");
};

// 新增條件
export const apiPostCondition = params => {
  return req("post", "/condition/", params, "postCondition");
};

// 修改條件
export const apiPutCondition = params => {
  return req(
    "put",
    `/condition/${params.conditionId}/`,
    params,
    "putCondition"
  );
};

// 刪除條件
export const apiDeleteCondition = id => {
  return req("delete", `/condition/${id}/`, null, "deleteCondition");
};
