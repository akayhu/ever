import { defineStore } from "pinia";
import {
  apiPostInventoryActivate,
  apiDeleteInventory,
  apiGetInventoryLatestDate,
  apiPatchInventoryRestore,
  apiGetInventoryDates
} from "@/apis/inventory";

const state = () => ({
  inventoryDate: {
    id: null,
    year: null,
    startDate: null,
    endDate: null,
    createDate: null
  },
  dates: [],
  inventorySettingsLoading: false,
  inventoryRecordLoading: false,
  inventoryRecordHistory: false
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
  getInventoryLatestDate() {
    this.inventorySettingsLoading = true;
    this.inventoryRecordLoading = true;
    return new Promise((resolve, reject) => {
      apiGetInventoryLatestDate()
        .then(response => {
          let apiResponse = response.data.response;
          this.inventoryDate = apiResponse;
          this.inventorySettingsLoading = false;
          this.inventoryRecordLoading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getInventoryLatestDate", error);
          reject(error);
        })
        .finally(() => {
          this.inventorySettingsLoading = false;
          this.inventoryRecordLoading = false;
        });
    });
  },
  // 將盤點使用需求欄位還原預設
  patchInventoryRestore(payload) {
    this.inventorySettingsLoading = true;
    return new Promise((resolve, reject) => {
      apiPatchInventoryRestore(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.inventorySettingsLoading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchInventoryRestore", error);
          reject(error);
        })
        .finally(() => {
          this.inventorySettingsLoading = false;
        });
    });
  },
  // 取得所有盤點區間
  getInventoryDates() {
    this.inventoryRecordHistory = true;
    return new Promise((resolve, reject) => {
      apiGetInventoryDates()
        .then(response => {
          let apiResponse = response.data.response;
          this.dates = apiResponse;
          this.inventoryRecordHistory = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getInventoryDates", error);
          reject(error);
        })
        .finally(() => {
          this.inventoryRecordHistory = false;
        });
    });
  }
};

export const useAuthorityInventoryStore = defineStore("authorityInventory", {
  state,
  actions
});
