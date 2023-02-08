import {
  apiPutExposure,
  apiGetExposureReservation,
  apiDeleteExposureReservation
} from "@/apis/exposure";

export const actions = {
  // 修改曝光時間素材對應
  putExposure({}, payload) {
    return new Promise(resolve => {
      apiPutExposure(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("putExposure", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得曝光時間素材對應
  getExposureReservation({}, payload) {
    return new Promise(resolve => {
      apiGetExposureReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getExposureReservation", error);
          console.log("payload", payload);
        });
    });
  },
  // 清除所有曝光時間素材對應
  deleteExposureReservation({}, payload) {
    return new Promise(resolve => {
      apiDeleteExposureReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deleteExposureReservation", error);
          console.log("payload", payload);
        });
    });
  }
};

export default {
  namespaced: true,
  actions
};
