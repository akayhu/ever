import { defineStore } from "pinia";
import { apiGetType, apiGetBoardIdType } from "@/apis/type";

const state = () => ({});

const getters = {};

const actions = {
  // 取得型態列表
  getType() {
    return new Promise((resolve, reject) => {
      apiGetType()
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getType", error);
          reject(error);
        });
    });
  },
  // 取得型態設定
  getBoardIdType(payload) {
    return new Promise(resolve => {
      apiGetBoardIdType(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getBoardIdType", error);
          console.log("payload", payload);
        });
    });
  }
};

export const useTypeStore = defineStore("type", { state, getters, actions });
