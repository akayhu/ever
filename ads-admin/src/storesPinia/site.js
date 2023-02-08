import { defineStore } from "pinia";
import {
  apiGetSite,
  apiPostSite,
  apiPatchSite,
  apiGetSiteId,
  apiDeleteSiteId,
  apiGetSiteSuggest
} from "@/apis/site";

const siteInit = {
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
  // loading
  loading: false
};

const siteIdInit = {
  // 網站下的頻道數量
  channelCount: 0,
  // 新增時間
  createDate: "",
  // 載具(PC, MOBILE, APP)
  device: "",
  // 網站編號
  id: 0,
  // 網站名稱
  name: "",
  // 網站狀態(false:下線, true:上線)
  status: true,
  // 更新時間
  updateDate: "",
  // 網站位址
  url: ""
};

const state = () => ({
  deviceTag: "PC",
  siteList: siteInit,
  siteId: siteIdInit
});

const getters = {};

const actions = {
  // 新增網站
  postSite(payload) {
    return new Promise(resolve => {
      apiPostSite(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postSite", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得單筆網站資訊
  getSiteId(payload) {
    return new Promise(resolve => {
      apiGetSiteId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.siteId = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getSiteId", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得網站資訊
  getSite(payload) {
    this.siteList = siteInit;
    this.siteList.loading = true;
    return new Promise(resolve => {
      apiGetSite(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.siteList = apiResponse;
          this.siteList.loading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getSite", error);
          console.log("payload", payload);
        });
    });
  },
  // 修改網站
  patchSite(payload) {
    return new Promise((resolve, reject) => {
      apiPatchSite(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchSite", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得搜尋網站列表
  getSearchSiteList(payload) {
    this.siteList = siteInit;
    this.siteList.loading = true;
    return new Promise(resolve => {
      apiGetSiteSuggest(payload)
        .then(response => {
          let apiResponse = response.data.response;
          apiGetSiteId({ siteId: apiResponse[0].id }).then(response => {
            let apiResponseSiteId = response.data.response;
            this.siteList.content = [];
            this.siteList.content.push(apiResponseSiteId);
            this.siteList.loading = false;
            resolve(apiResponseSiteId);
          });
        })
        .catch(error => {
          console.log("getSearchSiteList", error);
          console.log("payload", payload);
        });
    });
  },
  // 網站下拉選單
  getSiteMenu(payload) {
    return new Promise(resolve => {
      apiGetSite(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getSiteMenu", error);
          console.log("payload", payload);
        });
    });
  },
  // 刪除網站
  deleteSiteId(payload) {
    return new Promise(resolve => {
      apiDeleteSiteId(payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log("deleteSiteId", error);
          console.log("payload", payload);
        });
    });
  },
  // 清除網站列表
  clearSite() {
    this.siteList = siteInit;
    this.siteList.loading = true;
  },
  // 更改 tag
  postChangeDeviceTag(payload) {
    this.deviceTag = payload;
  }
};

export const useSiteStore = defineStore("site", { state, getters, actions });
