import { defineStore } from "pinia";
import {
  apiPostBoard,
  apiPatchBoard,
  apiGetBoard,
  apiGetBoardId,
  apiDeleteBoardId,
  apiGetBoardSuggest,
  apiGetAllBoard,
  apiPatchBoardSort
} from "@/apis/board";

const boardIdInit = {
  // 頻道編號
  channelId: 0,
  // 新增時間
  createDate: "2020-04-27T02:40:31.955Z",
  // 條件設定
  conditionId: 0,
  // 版位編號
  id: 0,
  // 版位名稱
  name: "",
  // 連售套組編號
  packageId: 0,
  // 行銷版位(否:下線, 是:上線)
  promotion: false,
  // 可預約數量(輪播數)
  reserve: "",
  // 版位狀態(false:下線, true:上線)
  status: true,
  // 廣告型態
  typeId: 0,
  // 更新時間
  updateDate: "2020-04-27T02:40:31.956Z"
};

const boardMenuInit = [];

const state = () => ({
  boardId: boardIdInit,
  boardMenu: boardMenuInit
});

const getters = {};

const actions = {
  // 取得版位資訊
  getBoard(payload) {
    return new Promise(resolve => {
      apiGetBoard(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getBoard", error);
          console.log("payload", payload);
        });
    });
  },
  // 新增版位
  postBoard(payload) {
    return new Promise(resolve => {
      apiPostBoard(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postBoard", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得單筆版位資訊
  getBoardId(payload) {
    return new Promise(resolve => {
      apiGetBoardId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.boardId = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getBoardId", error);
          console.log("payload", payload);
        });
    });
  },
  // 修改版位
  patchBoard(payload) {
    return new Promise(resolve => {
      apiPatchBoard(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchBoard", error);
          console.log("payload", payload);
        });
    });
  },
  // 刪除版位
  deleteBoardId(payload) {
    return new Promise(resolve => {
      apiDeleteBoardId(payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log("deleteBoardId", error);
          console.log("payload", payload);
        });
    });
  },
  // 清除單筆版位資料
  clearBoardId() {
    this.boardId = boardIdInit;
  },
  // 取得版位 menu
  getBoardMenu(payload) {
    return new Promise(resolve => {
      apiGetBoard(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getBoardMenu", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得版位名稱推薦
  getBoardSuggest(payload) {
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
  // 取得所有版位資訊
  getAllBoard(payload) {
    return new Promise(resolve => {
      apiGetAllBoard(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getAllBoard", error);
          console.log("payload", payload);
        });
    });
  },
  // 修改版位排序值
  patchBoardSort(payload) {
    return new Promise(resolve => {
      apiPatchBoardSort(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchBoardSort", error);
          console.log("payload", payload);
        });
    });
  }
};

export const useBoardStore = defineStore("board", {
  state,
  getters,
  actions
});
