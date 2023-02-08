import { defineStore } from "pinia";
import {
  apiGetConditions,
  apiGetConditionById,
  apiPostCondition,
  apiPutCondition,
  apiDeleteCondition
} from "@/apis/conditionSetting";

const conditionDataInit = {
  conditionList: [],
  loading: false
};

const state = () => ({
  storeConditionData: conditionDataInit
});

const getters = {};

const actions = {
  // 取得條件列表
  getConditions(payload) {
    return new Promise((resolve, reject) => {
      apiGetConditions(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getConditionDataById", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得條件資訊
  getConditionById(payload) {
    this.storeConditionData = { ...conditionDataInit };
    this.storeConditionData.loading = true;
    return new Promise((resolve, reject) => {
      apiGetConditionById(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.storeConditionData = apiResponse;
          this.storeConditionData.loading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getConditionDataById", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 新增條件
  createCondition(payload) {
    return new Promise((resolve, reject) => {
      apiPostCondition(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("createCondition", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 修改條件
  editCondition(payload) {
    return new Promise((resolve, reject) => {
      apiPutCondition(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("editCondition", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 刪除條件
  deleteCondition(payload) {
    return new Promise((resolve, reject) => {
      apiDeleteCondition(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deleteCondition", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  }
};

export const useConditionSettingStore = defineStore("conditionSetting", {
  state,
  getters,
  actions
});
