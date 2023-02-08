import { defineStore } from "pinia";
import {
  apiPostInventoryActivate,
  apiDeleteInventory,
  apiGetInventoryLatestInventoryDate,
  apiPatchInventoryRestore
} from "@/apis/inventory";

const state = () => ({
  inventoryDate: {
    id: null,
    year: null,
    startDate: null,
    endDate: null,
    createDate: null
  }
});

const actions = {
  // 年度盤點環境使用需求, 啟動盤點 記錄盤點開始/結束日期, 觸發寄信開口
  postInventoryActivate(payload) {
    return new Promise((resolve, reject) => {
      apiPostInventoryActivate(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postInventoryActivate", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 關閉有異動(不需使用)、未盤點的帳號
  deleteInventory() {
    return new Promise((resolve, reject) => {
      apiDeleteInventory()
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deleteInventory", error);
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
  },
  // 將盤點使用需求欄位還原預設
  patchInventoryRestore() {
    return new Promise((resolve, reject) => {
      apiPatchInventoryRestore()
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchInventoryRestore", error);
          reject(error);
        });
    });
  }
};

export const useAuthorityInventoryStore = defineStore("authorityInventory", {
  state,
  actions
});
