import { apiGetBoardSuggest } from "@/apis/board";
import {
  apiGetProductBoardSuggest,
  apiGetProductsByBoard
} from "@/apis/product";

export const actions = {
  // 版位名稱推薦
  getBoardSuggest({}, payload) {
    return new Promise(resolve => {
      apiGetBoardSuggest(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getBoardSuggest", error);
          console.log("payload", payload);
        });
    });
  },

  // 版位名稱推薦商品
  getProductBoardSuggest({}, payload) {
    return new Promise(resolve => {
      apiGetProductBoardSuggest(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductBoardSuggest", error);
          console.log("payload", payload);
        });
    });
  },

  // 以版位編號查詢商品
  getProductsByBoard({}, payload) {
    return new Promise(resolve => {
      apiGetProductsByBoard(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductsByBoard", error);
          console.log("payload", payload);
        });
    });
  }
};

export default {
  namespaced: true,
  actions
};
