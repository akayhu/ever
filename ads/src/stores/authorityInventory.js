import { defineStore } from "pinia";
import {
  apiPatchInventory,
  apiGetInventoryId,
  apiGetInventoryLatestInventoryDate
} from "@/apis/inventory.js";

const state = () => ({
  inventoryAccount: {
    accountId: null,
    lastLoginDate: null,
    logonId: null,
    name: null,
    requirement: 0,
    requirementLogDate: null,
    status: 0
  },
  inventoryDate: {
    id: null,
    year: null,
    startDate: null,
    endDate: null,
    createDate: null
  }
});

const actions = {
  // 儲存盤點結果
  patchInventory(payload) {
    return new Promise((resolve, reject) => {
      apiPatchInventory(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchInventory", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 年度盤點環境使用需求, 填寫頁面
  getInventoryId(payload) {
    return new Promise((resolve, reject) => {
      apiGetInventoryId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.inventoryAccount = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getInventoryId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得最新盤點日期區間
  getInventoryLatestInventoryDate() {
    return new Promise((resolve, reject) => {
      apiGetInventoryLatestInventoryDate()
        .then(response => {
          let apiResponse = response.data.response;
          this.inventoryDate = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getInventoryLatestInventoryDate", error);
          reject(error);
        });
    });
  }
};

export const useAuthorityInventoryStore = defineStore("authorityInventory", {
  state,
  actions
});
