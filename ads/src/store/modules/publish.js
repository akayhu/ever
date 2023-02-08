import { apiPostPublishId, apiDeletePublishId } from "@/apis/publish";

export const actions = {
  // 緊急上架
  postPublishId({}, payload) {
    return new Promise(resolve => {
      apiPostPublishId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postPublishId", error);
          console.log("payload", payload);
        });
    });
  },
  // 緊急下架
  deletePublishId({}, payload) {
    return new Promise(resolve => {
      apiDeletePublishId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deletePublishId", error);
          console.log("payload", payload);
        });
    });
  }
};

export default {
  namespaced: true,
  actions
};
