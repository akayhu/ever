import { apiGetLogSearch } from "@/apis/log";

export const GET_LOG_SEARCH = "GET_LOG_SEARCH";
export const SET_LOG_SEARCH_CONDITION = "SET_LOG_SEARCH_CONDITION";
export const CLEAR_LOG_SEARCH = "CLEAR_LOG_SEARCH";

// 審核紀錄列表初始值
const logListInit = {
  currentPage: 1,
  hasMorePages: false,
  items: [],
  lastPage: 1,
  perPage: 10,
  total: 0,
  searchLogLoading: false
};

// 審核紀錄搜尋條件初始值
const logSearchConditionInit = {
  perPage: 10,
  page: 1,
  createStart: "",
  createEnd: "",
  entityId: "",
  entityType: "",
  iaccountIdd: ""
};

const state = {
  log: {
    logList: logListInit,
    logSearchCondition: logSearchConditionInit
  }
};

export const actions = {
  getLogSearchList({ commit }, payload) {
    commit(CLEAR_LOG_SEARCH);
    apiGetLogSearch(payload).then(response => {
      let apiResponse = response.data.response;
      commit(GET_LOG_SEARCH, apiResponse);
    });
  },
  setLogSearchCondition({ commit }, payload) {
    commit(SET_LOG_SEARCH_CONDITION, payload);
  }
};

export const mutations = {
  [GET_LOG_SEARCH](state, payload) {
    state.log.logList = payload;
    state.log.logList.searchLogLoading = true;
  },
  [SET_LOG_SEARCH_CONDITION](state, payload) {
    state.log.logSearchCondition = payload;
  },
  [CLEAR_LOG_SEARCH](state) {
    state.log.logList = logListInit;
    state.log.logSearchCondition = logSearchConditionInit;
  }
};

export const getters = {
  getLogData: state => state.log
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
