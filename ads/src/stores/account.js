import { defineStore } from "pinia";
import { apiGetAccountSearch, apiGetAccountId } from "@/apis/account";

export const useAccountStore = defineStore("account", {
  actions: {
    getAccountSearch(payload) {
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
    getAccountId(payload) {
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
  }
});
