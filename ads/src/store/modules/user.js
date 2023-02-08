import { apiGetAuthStatus } from "@/apis/user";
import { setConfig } from "@/utils/rollbar.js";

export const GET_AUTH_STATUS = "GET_AUTH_STATUS";

export const actions = {
  // 前台使用者登入狀態
  getAuthStatus({ commit }) {
    return new Promise(resolve => {
      apiGetAuthStatus()
        .then(response => {
          let apiResponse = response.data.response;
          commit(GET_AUTH_STATUS, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getAuthStatus", error);
        });
    });
  }
};

export const state = {
  user: {
    // 是否在可登入時間，晚上 11:30 ~ 00:10 無法登入操作
    accessible: true,
    // 員工編號
    accountId: "",
    // 允許預約的網站
    allowedSite: [],
    // 資料權限
    dataPermission: [],
    // 員工AD帳號
    logonId: "",
    // 員工姓名
    name: "",
    // 身分角色
    // 1:PM
    // 11:Salesperson(整召業務), 12:Planner(整召企劃), 13:Operator(整召營運), 14:Manager(整召主管)
    // 21:JB-VM(產品VM), 22:JB-MGR(產品主管), 23:JB-PM(產品PM)
    role: "",
    // 特殊權限
    specialPermission: [],
    // 登入狀態(0:未登入,1:已登入無權限,2:已登入有權限)
    type: 0
  }
};

export const mutations = {
  [GET_AUTH_STATUS](state, payload) {
    setConfig(payload);
    let accessible = state.user.accessible;
    state.user = { accessible, ...payload };
  }
};

export const getters = {
  getUserStatus: state => state.user
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
