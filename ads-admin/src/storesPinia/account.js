import { defineStore } from "pinia";
import {
  apiPostAccount,
  apiGetAccount,
  apiGetAccountId,
  apiPutAccountId,
  apiDeleteAccountId,
  apiGetPhoneUser,
  apiGetAccountRecommend,
  apiGetAccountSearch
} from "@/apis/account";
import { apiPutToolSwitchRole } from "@/apis/tool";

const accountListInit = {
  // 資料列表
  content: [],
  // 總頁數
  totalPages: 1,
  // 總共筆數
  totalElements: 1,
  // 是否為最後一頁
  last: true,
  // 一頁幾筆
  size: 10,
  // 第幾頁
  page: 1,
  // 這一頁回傳幾筆
  numberOfElements: 1,
  // loading 狀態
  loading: false
};

const accountIdInit = {
  // 帳號
  logonId: "",
  // 姓名
  name: "",
  // 員工編號
  accountId: "",
  // 狀態
  status: 0,
  // 職務類別(身分)
  role: 23,
  // 是否緊急上下架
  emergency: false,
  // 可預約廣告的網站清單
  allowedSite: []
};

const state = () => ({
  accountList: accountListInit,
  storeAccountId: accountIdInit
});

const getters = {};

const actions = {
  // 清除會員資料
  clearAccount() {
    this.storeAccountId = accountIdInit;
  },
  // 新增會員資料
  postAccount(payload) {
    return new Promise((resolve, reject) => {
      apiPostAccount(payload)
        .then(response => {
          let apiResponse = response.data.response;
          if (apiResponse) resolve(apiResponse);
        })
        .catch(error => {
          reject(error);
          console.log("postAccount", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得會員資料列表
  getAccountList(payload) {
    this.accountList = accountListInit;
    this.accountList.loading = true;
    return new Promise(resolve => {
      apiGetAccount(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.accountList = apiResponse;
          this.accountList.loading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getAccountList", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得會員資料
  getAccountId(payload) {
    this.storeAccountId = accountIdInit;
    return new Promise(resolve => {
      apiGetAccountId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.storeAccountId = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getAccountId", error);
          console.log("payload", payload);
        });
    });
  },
  // 更新會員資料
  putAccountId(payload) {
    return new Promise(resolve => {
      apiPutAccountId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          if (apiResponse) {
            resolve(apiResponse);
          }
        })
        .catch(error => {
          console.log("putAccountId", error);
          console.log("payload", payload);
        });
    });
  },
  // 刪除會員資料
  deleteAccountId(payload) {
    return new Promise(resolve => {
      apiDeleteAccountId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          if (apiResponse) {
            resolve(apiResponse);
          }
        })
        .catch(error => {
          console.log("deleteAccountId", error);
          console.log("payload", payload);
        });
    });
  },
  // 查詢公司分機表
  getPhoneUser(payload) {
    return new Promise((resolve, reject) => {
      apiGetPhoneUser(payload)
        .then(response => {
          let apiResponse = response.data.response;
          if (apiResponse) {
            resolve(apiResponse);
          }
        })
        .catch(error => {
          console.log("getPhoneUser", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 根據輸入資訊查詢使用者
  getAccountRecommend(payload) {
    return new Promise(resolve => {
      apiGetAccountRecommend(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getAccountRecommend", error);
          console.log("payload", payload);
        });
    });
  },
  // 依身分查詢使用者
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
  // 切換使用者身分
  putToolSwitchRole(payload) {
    return new Promise(resolve => {
      apiPutToolSwitchRole(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("putToolSwitchRole", error);
          console.log("payload", payload);
        });
    });
  }
};

export const useAccountStore = defineStore("account", {
  state,
  getters,
  actions
});
