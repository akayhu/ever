import {
  apiGetVotes,
  apiGetVotesDetail,
  apiGetVotesSearch,
  apiPatchVotesAudit
} from "@/apis/votes";
import router from "@/layouts/defaultLayout";
import { apiGetLogSearch } from "@/apis/log";

export const GET_VOTES_LIST = "GET_VOTES_LIST";
export const GET_VOTES_DETAIL = "GET_VOTES_DETAIL";
export const CLEAR_VOTES = "CLEAR_VOTES";
export const PATCH_VOTES_DETAIL = "PATCH_VOTES_DETAIL";
export const GET_VOTES_SEARCH = "GET_VOTES_SEARCH";
export const CHANGE_SEARCH_CONDITION = "CHANGE_SEARCH_CONDITION";
export const CLEAR_VOTES_SEARCH = "CLEAR_VOTES_SEARCH";
export const GET_VOTES_DETAIL_LOG = "GET_VOTES_DETAIL_LOG";
export const CLEAR_VOTES_DETAIL_LOG = "CLEAR_VOTES_DETAIL_LOG";

// 投票審核初始值
const votesListInit = {
  currentPage: 1,
  hasMorePages: false,
  items: [],
  lastPage: 1,
  perPage: "10",
  total: 0,
  loadingEnd: false
};

// 投票查詢初始值
const votesSearchListInit = {
  currentPage: 1,
  hasMorePages: false,
  items: [],
  lastPage: 1,
  loadingEnd: true,
  perPage: "10",
  total: 0
};

// 投票查詢條件初始值
const votesSearchConditionInit = {
  perPage: 10,
  page: 1,
  createStart: "",
  createEnd: "",
  auditState: "",
  custno: "",
  id: "",
  pid: ""
};

// 投票詳細頁 Log
const votesDetailLogInit = {
  total: 0,
  perPage: 20,
  currentPage: 0,
  lastPage: 0,
  hasMorePages: false,
  items: []
};

export const state = {
  votes: {
    // 投票審核
    votesList: votesListInit,
    // 投票詳細頁
    votesDetail: {},
    // 投票詳細頁 Log
    votesDetailLog: votesDetailLogInit,
    // 投票查詢
    votesSearchList: votesSearchListInit,
    // 搜尋條件
    votesSearchCondition: votesSearchConditionInit
  }
};

export const actions = {
  // 投票列表
  getVotesList({ commit }, payload) {
    commit(CLEAR_VOTES);
    apiGetVotes(payload).then(response => {
      let apiResponse = response.data.response;
      commit(GET_VOTES_LIST, apiResponse);
    });
  },
  // 投票內容
  getVotesDetail({ commit }, id) {
    commit(CLEAR_VOTES);
    apiGetVotesDetail({ id }).then(response => {
      let apiResponse = response.data.response;
      commit(GET_VOTES_DETAIL, apiResponse);
    });
  },
  // 投票內容 Log
  getVotesDetailLog({ commit }, payload) {
    commit(CLEAR_VOTES_DETAIL_LOG);
    apiGetLogSearch(payload).then(response => {
      let apiResponse = response.data.response;
      commit(GET_VOTES_DETAIL_LOG, apiResponse);
    });
  },
  // 審核投票內容
  patchVotesDetail({ commit }, payload) {
    apiPatchVotesAudit(payload).then(() => {
      router.replace({
        name: "ReviewVote"
      });
    });
  },
  // 搜尋投票列表
  getVotesSearch({ commit }, payload) {
    commit(CLEAR_VOTES);
    apiGetVotesSearch(payload).then(response => {
      let apiResponse = response.data.response;
      commit(GET_VOTES_SEARCH, apiResponse);
    });
  },
  // 搜尋條件
  changeSearchCondition({ commit }, payload) {
    commit(CHANGE_SEARCH_CONDITION, payload);
  },
  // 資料清空
  clearVotes({ commit }) {
    commit(CLEAR_VOTES_SEARCH);
  }
};

export const mutations = {
  [GET_VOTES_LIST](state, payload) {
    state.votes.votesList = payload;
    state.votes.votesList.loadingEnd = true;
    state.votes.votesSearchList.loadingEnd = true;
  },
  [GET_VOTES_DETAIL](state, payload) {
    state.votes.votesDetail = payload || {};
    state.votes.votesSearchList.loadingEnd = true;
  },
  [CHANGE_SEARCH_CONDITION](state, payload) {
    state.votes.votesSearchCondition = payload;
  },
  [GET_VOTES_SEARCH](state, payload) {
    state.votes.votesSearchList = payload;
    state.votes.votesSearchList.loadingEnd = true;
  },
  [CLEAR_VOTES_SEARCH](state) {
    state.votes.votesSearchList = { items: [] };
    state.votes.votesSearchList.loadingEnd = true;
  },
  [CLEAR_VOTES](state) {
    state.votes.votesList = votesListInit;
    state.votes.votesDetail = {};
    state.votes.votesSearchList = votesSearchListInit;
    state.votes.votesSearchList.loadingEnd = false;
  },
  [GET_VOTES_DETAIL_LOG](state, payload) {
    state.votes.votesDetailLog = payload;
  },
  [CLEAR_VOTES_DETAIL_LOG](state) {
    state.votes.votesDetailLog = votesDetailLogInit;
  }
};

export const getters = {
  getVotesData: state => state.votes
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
