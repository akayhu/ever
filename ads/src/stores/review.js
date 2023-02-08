import { defineStore } from "pinia";
import {
  apiGetQuotationHistory,
  apiGetProductPromoHistory,
  apiGetResourceApprover,
  apiPostResourceAction,
  apiGetResourceSchedule
} from "@/apis/review";
import { EventBus } from "@/utils/eventBus.js";

export const useReviewStore = defineStore("reviewStore", {
  state: () => ({
    loading: false,
    quotationHistory: {},
    productPromoHistory: {},
    approver: [],
    schedule: null
  }),
  actions: {
    // 取得報價單簽核歷程
    getQuotationHistory(payload) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiGetQuotationHistory(payload)
          .then(response => {
            let apiResponse = response.data.response;
            this.quotationHistory = apiResponse;
            resolve(apiResponse);
          })
          .catch(error => {
            console.log("getQuotationHistory", error);
            console.log("payload", payload);
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 取得底價促案簽核歷程
    getProductPromoHistory(payload) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiGetProductPromoHistory(payload)
          .then(response => {
            let apiResponse = response.data.response;
            this.productPromoHistory = apiResponse;
            resolve(apiResponse);
          })
          .catch(error => {
            console.log("getProductPromoHistory", error);
            console.log("payload", payload);
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 依來源查詢目前可簽核人員
    getResourceApprover(payload) {
      return new Promise((resolve, reject) => {
        apiGetResourceApprover(payload)
          .then(response => {
            let apiResponse = response.data.response;
            this.approver = apiResponse;
            resolve(apiResponse);
          })
          .catch(error => {
            console.log("getResourceApprover", error);
            console.log("payload", payload);
            reject(error);
          });
      });
    },
    // 同意或駁回指定的表單
    postResourceAction(payload) {
      EventBus.$emit("loadingShow");
      return new Promise((resolve, reject) => {
        apiPostResourceAction(payload)
          .then(response => {
            let apiResponse = response.data.response;
            resolve(apiResponse);
          })
          .catch(error => {
            console.log("postResourceAction", error);
            console.log("payload", payload);
            reject(error);
          })
          .finally(() => {
            EventBus.$emit("loadingHide");
          });
      });
    },
    // 取得目前表單簽核進度
    getResourceSchedule(payload) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiGetResourceSchedule(payload)
          .then(response => {
            let apiResponse = response.data.response;
            this.schedule = apiResponse;
            resolve(apiResponse);
          })
          .catch(error => {
            console.log("getResourceSchedule", error);
            console.log("payload", payload);
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    }
  }
});
