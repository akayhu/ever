import req from "./https";

// 緊急上架
export const apiPostPublishId = params => {
  return req("post", `/publish/${params.id}`, params, "postPublishId");
};

// 緊急下架
export const apiDeletePublishId = params => {
  return req("delete", `/publish/${params.id}`, params, "deletePublishId");
};
