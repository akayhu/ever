import { defineStore } from "pinia";
import { apiGetToolMaterialId, apiGetToolReservationId } from "@/apis/tool";

const actions = {
  // 查詢小工具-查詢素材
  getToolMaterialId(payload) {
    return new Promise((resolve, reject) => {
      apiGetToolMaterialId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getToolMaterialId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 查詢小工具-查詢檔期
  getToolReservationId(payload) {
    return new Promise((resolve, reject) => {
      apiGetToolReservationId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getToolReservationId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  }
};

export const useToolStore = defineStore("tool", { actions });
