import {
  actions,
  CHANGE_SEARCH_KEYWORD,
  POST_COMPANY_AUTOCOMPLETE,
  GET_SEARCH_COMPANY_LIST,
  CLEAR_SEARCH
} from "@/actions/search";

const searchListInit = {
  items: [],
  total: 0,
  lastPage: 0,
  hasMorePages: false,
  currentPage: 1,
  perPage: "10",
  loadingEnd: false
};

export const state = {
  search: {
    keywordList: [],
    searchCompanyList: searchListInit
  }
};

export const mutations = {
  [CHANGE_SEARCH_KEYWORD](state) {
    state.search.keywordList = [];
  },
  [POST_COMPANY_AUTOCOMPLETE](state, payload) {
    state.search.keywordList = payload;
  },
  [GET_SEARCH_COMPANY_LIST](state, payload) {
    state.search.searchCompanyList = payload;
    state.search.searchCompanyList.loadingEnd = true;
  },
  [CLEAR_SEARCH](state) {
    state.search.keywordList = [];
    state.search.searchCompanyList = searchListInit;
  }
};

export const getters = {
  getSearchData: state => state.search
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
