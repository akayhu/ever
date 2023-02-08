import {
  apiGetSummary,
  apiGetReservation,
  apiGetExpiredReservation
} from "@/apis/dashboard";
import moment from "moment";

const dateFormat = "YYYY/MM/DD";

const initValue = {
  content: [],
  loadedContents: [],
  totalPages: 0,
  totalElements: 0,
  last: false,
  size: 10,
  page: 0,
  numberOfElements: 0,
  loading: false,
  active: false
};

export const state = {
  unUpload: { ...initValue },
  unCue: { ...initValue },
  expired: { ...initValue }
};

export const getters = {
  isEmpty: state => {
    return Object.values(state).every(res => res && res.content.length === 0);
  },
  getData: state => state
};

export const mutations = {
  updateStateValue(state, payload) {
    state[payload.stateName].loadedContents.push(...payload.content);
    state[payload.stateName] = { ...state[payload.stateName], ...payload };
  },
  resetLoadedContents(state, payload) {
    state[payload.stateName].loadedContents = [];
  },
  setEmptyStatus(state) {
    // state.isEmpty = Object.values(payload).every(value => value === 0);
    state.isEmpty = false;
  },
  activeState(state, payload) {
    // Object.keys(payload).forEach(key => {
    //   if (payload[key]) {
    //     state[key].active = true;
    //   } else {
    //     state[key].active = false;
    //   }
    // });
    state[payload].active = true;
  },
  inactiveState(state, payload) {
    state[payload].active = false;
  }
};

export const actions = {
  // 取得dashboard各區塊總數
  getSummary({ commit }, payload) {
    return new Promise(function(resolve, reject) {
      apiGetSummary(payload)
        .then(response => {
          // let apiResponse = response.data.response;
          // commit("setEmptyStatus", response);
          resolve(response);
        })
        .catch(error => {
          console.error("getSummary", error);
          reject(error);
        });
    });
  },

  // 取得未上傳素材檔期
  getUnUploadReservation({ commit }, payload) {
    return new Promise(function(resolve, reject) {
      let page = payload.page;
      let size = payload.size;
      let startDate = moment(new Date())
        .add(-1, "d")
        .format(dateFormat);
      let endDate = moment(new Date())
        .add(7, "d")
        .format(dateFormat);
      let statuses = "2";
      let query = `page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}&statuses=${statuses}`;

      apiGetReservation(query)
        .then(response => {
          let apiResponse = response.data.response;

          if (apiResponse.totalElements > 0)
            commit("activeState", payload.stateName);
          else commit("inactiveState", payload.stateName);

          apiResponse.content.forEach(item => {
            item.link = `/material?id=${item.orderId}&device=${item.device}&reservationId=${item.reservationId}`;
          });

          if (payload?.page === 1) commit("resetLoadedContents", payload);
          commit("updateStateValue", {
            stateName: payload.stateName,
            ...apiResponse
          });
          resolve(apiResponse);
        })
        .catch(error => {
          console.error("getUnUploadReservation", error);
          reject(error);
        });
    });
  },

  // 取得未拉cue檔期
  getUnCueReservation({ commit }, payload) {
    return new Promise(function(resolve, reject) {
      let page = payload.page;
      let size = payload.size;
      let startDate = moment(new Date())
        .add(-1, "d")
        .format(dateFormat);
      let endDate = moment(new Date())
        .add(7, "d")
        .format(dateFormat);
      let statuses = "0&statuses=1";
      let query = `page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}&statuses=${statuses}`;

      apiGetReservation(query)
        .then(response => {
          let apiResponse = response.data.response;

          if (apiResponse.totalElements > 0)
            commit("activeState", payload.stateName);
          else commit("inactiveState", payload.stateName);

          apiResponse.content.forEach(item => {
            item.link = `/editpj?projectId=${item.projectId}`;
          });
          if (payload?.page === 1) commit("resetLoadedContents", payload);
          commit("updateStateValue", {
            stateName: payload.stateName,
            ...apiResponse
          });
          resolve(response);
        })
        .catch(error => {
          console.error("getUnCueReservation", error);
          reject(error);
        });
    });
  },

  // 取得過期預約未刪除
  getExpiredReservation({ commit }, payload) {
    return new Promise(function(resolve, reject) {
      apiGetExpiredReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;

          if (apiResponse.totalElements > 0)
            commit("activeState", payload.stateName);
          else commit("inactiveState", payload.stateName);

          apiResponse.content.forEach(item => {
            item.link = `/editpj?projectId=${item.projectId}`;
          });
          if (payload?.page === 1) commit("resetLoadedContents", payload);
          commit("updateStateValue", {
            stateName: payload.stateName,
            ...apiResponse
          });
          resolve(apiResponse);
        })
        .catch(error => {
          console.error("getSummary", error);
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
