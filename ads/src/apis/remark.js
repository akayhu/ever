import req from "./https";

// 查詢指定月份的備註
export const apiGetRemark = params => {
  return req("get", "/remark", params, "getRemark");
};

// 新增或異動備註
export const apiPostRemark = params => {
  return req("post", "/remark", params, "postRemark");
};

// 刪除指定日期的備註
export const apiDeleteRemark = params => {
  return req("delete", "/remark", params, "deleteRemark");
};
