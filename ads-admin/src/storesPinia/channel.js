import { defineStore } from "pinia";
import {
  apiGetChannel,
  apiPostChannel,
  apiPatchChannel,
  apiGetChannelId,
  apiDeleteChannelId,
  apiGetChannelSuggest
} from "@/apis/channel";

const channelIdInit = {
  // 頻道下的版位數量
  boardCount: 0,
  // 新增時間
  createDate: "",
  // 頻道編號
  id: 0,
  // 頻道名稱
  name: "",
  // 網站編號
  siteId: 0,
  // 頻道狀態(false:下線, true:上線)
  status: true,
  // 更新時間
  updateDate: ""
};

const state = () => ({
  channelId: channelIdInit
});

const getters = {};

const actions = {
  // 取得頻道資訊
  getChannel(payload) {
    return new Promise(resolve => {
      apiGetChannel(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getChannel", error);
          console.log("payload", payload);
        });
    });
  },
  // 新增頻道
  postChannel(payload) {
    return new Promise(resolve => {
      apiPostChannel(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postChannel", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得單筆頻道資訊
  getChannelId(payload) {
    return new Promise(resolve => {
      apiGetChannelId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.channelId = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getChannelId", error);
          console.log("payload", payload);
        });
    });
  },
  // 修改頻道
  patchChannel(payload) {
    return new Promise(resolve => {
      apiPatchChannel(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchChannel", error);
          console.log("payload", payload);
        });
    });
  },
  // 頻道下拉選單
  getChannelMenu(payload) {
    const channelMenuQuery = {
      siteId: payload.siteId,
      status: true
    };
    return new Promise(resolve => {
      apiGetChannel(channelMenuQuery)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getChannelMenu", error);
          console.log("payload", payload);
        });
    });
  },
  // 刪除頻道
  deleteChannelId(payload) {
    return new Promise(resolve => {
      apiDeleteChannelId(payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log("deleteChannelId", error);
          console.log("payload", payload);
        });
    });
  },
  // 頻道名稱推薦
  getChannelSuggest(payload) {
    return new Promise(resolve => {
      apiGetChannelSuggest(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getChannelSuggest", error);
          console.log("payload", payload);
        });
    });
  }
};

export const useChannelStore = defineStore("channel", {
  state,
  getters,
  actions
});
