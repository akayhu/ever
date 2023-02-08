import {
  apiGetReservation,
  apiPostReservation,
  apiDeleteReservation,
  apiPatchReservation,
  apiGetReservationOrder,
  apiGetReservationOrderId,
  apiGetReservationProjectSuggest
} from "@/apis/reservation";

export const GET_RESERVATION_IS_READY = "GET_RESERVATION_IS_READY";
export const GET_RESERVATION_NOT_READY = "GET_RESERVATION_NOT_READY";
export const RESET_RESERVATION = "RESET_RESERVATION";
export const LOADING_RESERVATION = "LOADING_RESERVATION";
export const RESET_IS_RESERVATION = "RESET_IS_RESERVATION";
export const RESET_NOT_RESERVATION = "RESET_NOT_RESERVATION";
export const GET_RESERVATION_ORDER_ID = "GET_RESERVATION_ORDER_ID";
export const GET_RESERVATION_PROJECT_SUGGEST =
  "GET_RESERVATION_PROJECT_SUGGEST";
export const RESET_NOT_RESERVATION_NO_DATA = "RESET_NOT_RESERVATION_NO_DATA";

export const actions = {
  // 依專案查詢預約檔期
  getReservation({ commit }, payload) {
    let page = payload.page;
    let size = payload.size;
    // 備取
    let available = payload.type === 0 ? "&statuses=0" : "";
    // 正取
    let admission =
      payload.type === 1
        ? "&statuses=-1&statuses=1&statuses=2&statuses=3&statuses=4&statuses=5"
        : "";
    // 未拉 cue
    let notPulledCue = payload.type === 6 ? "&statuses=1" : "";
    // 已拉 cue
    let alreadyCue = payload.type === 2 ? "&statuses=2" : "";
    // 已上素材
    let materialUploaded = payload.type === 3 ? "&statuses=3" : "";
    // 已上架
    let shelf = payload.type === 4 ? "&statuses=4" : "";
    // 上刊結束
    let endOfPublication = payload.type === 5 ? "&statuses=5" : "";
    let projectId = payload.projectId ? `&projectId=${payload.projectId}` : "";
    let boardId = payload.boardId ? `&boardId=${payload.boardId}` : "";
    let startDate = payload.startDate ? `&startDate=${payload.startDate}` : "";
    let endDate = payload.endDate ? `&endDate=${payload.endDate}` : "";
    let grouping = payload.grouping ? `&grouping=${payload.grouping}` : "";
    let usageType = payload.usageType ? `&usageType=${payload.usageType}` : "";
    let query = `page=${page}&size=${size}${available}${admission}${notPulledCue}${alreadyCue}${materialUploaded}${shelf}${endOfPublication}${projectId}${boardId}${startDate}${endDate}${grouping}${usageType}`;

    return new Promise((resolve, reject) => {
      apiGetReservation(query)
        .then(response => {
          let apiResponse = response.data.response;
          if (payload.type > 0 || payload.aloneAdmission) {
            // 正取預約版位
            commit(GET_RESERVATION_IS_READY, apiResponse);
          } else {
            // 備取預約版位
            commit(GET_RESERVATION_NOT_READY, apiResponse);
          }
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getReservation", error);
          console.log("payload", query);
          reject(error);
        });
    });
  },
  // 新增預約檔期
  postReservation({}, payload) {
    return new Promise((resolve, reject) => {
      apiPostReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postReservation", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 刪除預約檔期
  deleteReservation({}, payload) {
    return new Promise(resolve => {
      apiDeleteReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deleteReservation", error);
          console.log("payload", payload);
        });
    });
  },
  // 修改預約檔期
  patchReservation({}, payload) {
    return new Promise((resolve, reject) => {
      apiPatchReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchReservation", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 依專案預約者與委刊單期間取得委刊單號
  getReservationOrder({}, payload) {
    return new Promise(resolve => {
      apiGetReservationOrder(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getReservationOrder", error);
          console.log("payload", payload);
        });
    });
  },
  // 依委刊單號取得簡要檔期資訊
  getReservationOrderId({ commit }, payload) {
    return new Promise(resolve => {
      apiGetReservationOrderId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          commit(GET_RESERVATION_ORDER_ID, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getReservationOrderId", error);
          console.log("payload", payload);
        });
    });
  },
  // 依專案和關鍵字查詢版位
  getReservationProjectSuggest({}, payload) {
    return new Promise(resolve => {
      apiGetReservationProjectSuggest(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getReservationProjectSuggest", error);
          console.log("payload", payload);
        });
    });
  },
  // 清空正取與備取列表資料
  resetReservation({ commit }) {
    commit(RESET_RESERVATION);
  },
  // 清空正取列表資料
  resetIsReservation({ commit }) {
    commit(RESET_IS_RESERVATION);
  },
  // 清空備取列表資料
  resetNotReservation({ commit }) {
    commit(RESET_NOT_RESERVATION);
  },
  // 回讀取正備取 loading 狀態，無清空資料
  loadingReservation({ commit }) {
    commit(LOADING_RESERVATION);
  },
  // 清空備取列表資料(不loading)
  resetNotReservationNoData({ commit }) {
    commit(RESET_NOT_RESERVATION_NO_DATA);
  }
};

const reservationIsReadyInit = {
  content: [],
  loading: true
};
const reservationNotReadyInit = {
  content: [],
  loading: true
};

const reservationOrderBoardListInit = [];

export const state = {
  reservationIsReady: reservationIsReadyInit,
  reservationNotReady: reservationNotReadyInit,
  reservationOrderBoardList: reservationOrderBoardListInit
};

export const mutations = {
  [GET_RESERVATION_IS_READY](state, payload) {
    state.reservationIsReady = payload;
    state.reservationIsReady.loading = false;
  },
  [GET_RESERVATION_NOT_READY](state, payload) {
    state.reservationNotReady = payload;
    state.reservationNotReady.loading = false;
  },
  [RESET_RESERVATION](state) {
    state.reservationIsReady = reservationIsReadyInit;
    state.reservationNotReady = reservationNotReadyInit;
    state.reservationIsReady.loading = true;
    state.reservationNotReady.loading = true;
  },
  [RESET_IS_RESERVATION](state) {
    state.reservationIsReady = reservationIsReadyInit;
    state.reservationIsReady.loading = true;
  },
  [RESET_NOT_RESERVATION](state) {
    state.reservationNotReady = reservationNotReadyInit;
    state.reservationNotReady.loading = true;
  },
  [RESET_NOT_RESERVATION_NO_DATA](state) {
    state.reservationNotReady = {
      content: [],
      loading: false
    };
  },
  [LOADING_RESERVATION](state) {
    state.reservationIsReady.loading = true;
    state.reservationNotReady.loading = true;
  },
  [GET_RESERVATION_ORDER_ID](state, payload) {
    state.reservationOrderBoardList = payload;
  }
};

export const getters = {
  getReservationData: state => state
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
