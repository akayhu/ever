import { defineStore } from "pinia";
import {
  apiGetLog,
  apiGetLogidCompareResult,
  apiGetLogDataHistory
} from "@/apis/log";

const logListInit = {
  // 資料列表
  content: [],
  // 總頁數
  totalPages: 1,
  // 總共筆數
  totalElements: 0,
  // 是否為最後一頁
  last: true,
  // 一頁幾筆
  size: 20,
  // 第幾頁
  page: 1,
  // 這一頁回傳幾筆
  numberOfElements: 0,
  // loading
  loading: false
};

const compareResultInit = {
  onlyOnLeft: [],
  onlyOnRight: [],
  differences: []
};

const state = () => ({
  logList: logListInit,
  compareResult: compareResultInit
});

const getters = {};

const actions = {
  // 取得使用者行為紀錄列表
  getLog(payload) {
    this.logList = logListInit;
    this.logList.loading = true;
    return new Promise((resolve, reject) => {
      apiGetLog(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.logList = apiResponse;
          this.logList.loading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getLog", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得比對結果
  getLogidCompareResult(payload) {
    return new Promise((resolve, reject) => {
      apiGetLogidCompareResult(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.compareResult = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getLogidCompareResult", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得資料歷史紀錄
  getLogDataHistory(payload) {
    this.logList = logListInit;
    this.logList.loading = true;
    return new Promise((resolve, reject) => {
      apiGetLogDataHistory(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.logList = apiResponse;
          this.logList.loading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getLogDataHistory", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  }
};

export const useLogStore = defineStore("log", { state, getters, actions });
