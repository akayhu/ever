import {
  apiGetAuthStatus,
  apiGetAccounts,
  apiDeleteAccounts,
  apiPatchAccounts,
  apiPostAccounts
} from "@/apis/user";
import router from "@/layouts/defaultLayout";

export const AUTH_STATUS = "AUTH_STATUS";
export const SET_NOT_LOGIN = "SET_NOT_LOGIN";
export const GET_ACCOUNTS = "GET_ACCOUNTS";
export const POST_ACCOUNTS = "POST_ACCOUNTS";
export const PATCH_ACCOUNTS = "PATCH_ACCOUNTS";
export const CLEAR_ACCOUNTS_LIST = "CLEAR_ACCOUNTS_LIST";
export const EDITE_ACCOUNTS = "EDITE_ACCOUNTS";
export const CLEAR_EDITE_ACCOUNTS = "CLEAR_EDITE_ACCOUNTS";
export const CHANGE_USER_NAME = "CHANGE_USER_NAME";
export const GET_ALL_ACCOUNTS = "GET_ALL_ACCOUNTS";

export const state = {
  user: {
    userId: "",
    userName: "",
    isLogin: false,
    authStatus: "",
    accountsList: {
      loadingEnd: false
    },
    editeAccount: {
      accountId: 0,
      accountName: ""
    },
    allAccount: []
  }
};

export const actions = {
  // 新增帳號
  postAccounts({ commit }, payload) {
    apiPostAccounts(payload).then(() => {
      router
        .replace({
          name: "Account"
        })
        .catch(err => {});
    });
  },
  // 後台使用者登入狀態
  getAuthStatus({ commit }) {
    return new Promise(resolve => {
      apiGetAuthStatus().then(response => {
        let apiResponse = response.data.response;
        if (apiResponse.type === 1) {
          commit(AUTH_STATUS, apiResponse);
        }
        resolve(apiResponse.type);
      });
    });
  },
  // 帳號權限查詢(列表)
  getAccounts({ commit }, payload) {
    commit(CLEAR_ACCOUNTS_LIST);
    apiGetAccounts(payload).then(response => {
      let apiResponse = response.data.response || {};
      commit(GET_ACCOUNTS, apiResponse);
    });
  },
  // 帳號權限(所以列表)，審核紀錄呼叫用
  getAllAccounts({ commit }, payload) {
    apiGetAccounts(payload).then(response => {
      let apiResponse = response.data.response.items || {};
      commit(GET_ALL_ACCOUNTS, apiResponse);
    });
  },
  // 修改帳號取 userName 與 userId action
  editeAccount({ commit }, payload) {
    commit(CLEAR_EDITE_ACCOUNTS);
    commit(EDITE_ACCOUNTS, payload);
  },
  // 修改帳號資料
  patchAccounts({ commit, state }, payload) {
    if (state.user.userId === payload.accountId) {
      commit(CHANGE_USER_NAME, payload.accountName);
    }
    apiPatchAccounts(payload);
    setTimeout(() => {
      router
        .replace({
          name: "Account"
        })
        .catch(err => {});
    }, 400);
  },
  // 刪除帳號權限資料
  deleteAccounts({ state }, payload) {
    apiDeleteAccounts(payload).then(() => {
      if (state.user.userId === payload.accountId) {
        document.location.href = `https:${process.env.VUE_APP_API_DOMAIN_URL}admin/auth/logout`;
      }
    });
  },
  // 未登入
  setNotLogin({ commit }) {
    commit(SET_NOT_LOGIN);
  }
};

export const mutations = {
  [AUTH_STATUS](state, payload) {
    state.user.authStatus = payload.type;
    state.user.userId = payload.id || 9527;
    state.user.userName = payload.name || "審核專員";
    state.user.isLogin = true;
  },
  [CHANGE_USER_NAME](state, accountName) {
    state.user.userName = accountName;
  },
  [GET_ACCOUNTS](state, payload) {
    state.user.accountsList = payload;
    state.user.accountsList.loadingEnd = true;
  },
  [GET_ALL_ACCOUNTS](state, payload) {
    state.user.allAccount = payload;
  },
  [SET_NOT_LOGIN](state) {
    state.user.authStatus = "";
    state.user.userId = "";
    state.user.userName = "";
    state.user.isLogin = false;
    state.user.accountsList = { loadingEnd: false };
  },
  [EDITE_ACCOUNTS](state, payload) {
    state.user.editeAccount = payload;
  },
  [CLEAR_EDITE_ACCOUNTS](state) {
    state.user.editeAccount = {};
  },
  [CLEAR_ACCOUNTS_LIST](state) {
    state.user.accountsList = { loadingEnd: false };
  }
};

export const getters = {
  getUserData: state => state.user
};

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations
};
