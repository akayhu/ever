import { apiGetAccountSearch, apiGetAccountId } from "@/apis/account";

export const actions = {
  // 依身分查詢使用者
  getAccountSearch({}, payload) {
    return new Promise(resolve => {
      apiGetAccountSearch(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getAccountSearch", error);
          console.log("payload", payload);
        });
    });
  },
  getAccountId({}, payload) {
    return new Promise(resolve => {
      apiGetAccountId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getAccountId", error);
          console.log("payload", payload);
        });
    });
  }
};

export default {
  namespaced: true,
  actions
};
