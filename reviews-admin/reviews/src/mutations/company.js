import {
  actions,
  GET_COMPANY_DATA,
  CLEAR_COMPANY_DATA,
  CHANGE_COMPANY_COMPANY_NAME,
  CHANGE_COMPANY_CUSTNO,
  CLEAR_COMPANY_STATUS,
  GET_COMPANY_REVIEWS_LIST,
  CLEAR_COMPANY_REVIEWS_LIST,
  GET_COMPANY_REVIEWS_DETAIL,
  CLEAR_COMPANY_REVIEWS_DETAIL,
  CLEAR_COMPANY_VOTES_LIST,
  GET_COMPANY_VOTES_LIST,
  CLEAR_COMPANY_VOTES_DETAIL,
  GET_COMPANY_VOTES_DETAIL,
  GET_COMPANY_JOBS,
  CHANGE_VOTES_HAS_VOTE,
  CHANGE_OPEN_VOTE_LIGHTBOX,
  CHANGE_OPEN_VOTE_LOGIN_LIGHTBOX,
  CHANGE_CLOSE_VOTE_LOGIN_LIGHTBOX,
  CHANGE_CLOSE_VOTE_LIGHTBOX,
  GET_REVIEWS_INTERESTED_LIST,
  CLEAR_REVIEWS_INTERESTED_LIST,
  GET_VOTES_INTERESTED_LIST,
  CLEAR_VOTES_INTERESTED_LIST,
  VOTES_LOADING_TRUE,
  VOTES_LOADING_FALSE,
  GET_COMPANY_COMPARE,
  CLEAN_COMPANY_COMPARE
} from "@/actions/company";

const companyInit = {
  companyLogo: "",
  companyName: "",
  custno: null,
  isPublic: 0,
  reviewCount: 0,
  voteCount: 0,
  scoreOverall: 0,
  reviewItems: [],
  listedStock: null
};

const reviewsListInit = {
  items: [],
  total: 0,
  lastPage: 1,
  hasMorePages: false,
  currentPage: 1,
  loadingEnd: false,
  perPage: "10"
};

const reviewsInterestedList = {
  items: [],
  total: 0,
  lastPage: 1,
  hasMorePages: false,
  currentPage: 1,
  perPage: "6"
};

const votesListInit = {
  items: [],
  total: 0,
  lastPage: 1,
  hasMorePages: false,
  currentPage: 1,
  loadingEnd: false,
  perPage: "10"
};

const votesInterestedList = {
  items: [],
  total: 0,
  lastPage: 1,
  hasMorePages: false,
  currentPage: 1,
  perPage: "6"
};

const init = {
  companyData: companyInit,
  reviewsList: reviewsListInit,
  reviewsInterestedList: reviewsInterestedList,
  reviewsDetail: {},
  votesList: votesListInit,
  votesInterestedList: votesInterestedList,
  votesDetail: {},
  votesHasVote: false,
  openVoteLightbox: false,
  openVoteLoginLightbox: false,
  votesLoading: false,
  jobs: {
    joblist: []
  }
};

const state = {
  company: init,
  compareResult: []
};

export const mutations = {
  // 公司專業資料
  [GET_COMPANY_DATA](state, payload) {
    state.company.companyData = payload || {};
  },
  // 公司專業評論列表
  [GET_COMPANY_REVIEWS_LIST](state, payload) {
    state.company.reviewsList = payload || {};
    state.company.reviewsList.loadingEnd = true;
  },
  // 公司專業感興趣的評論列表
  [GET_REVIEWS_INTERESTED_LIST](state, payload) {
    state.company.reviewsInterestedList = payload || {};
  },
  // 公司專業評論詳細內容
  [GET_COMPANY_REVIEWS_DETAIL](state, payload) {
    state.company.reviewsDetail = payload || {};
  },
  // 公司專業投票列表
  [GET_COMPANY_VOTES_LIST](state, payload) {
    state.company.votesList = payload || {};
    state.company.votesList.loadingEnd = true;
  },
  // 公司專業感興趣的投票列表
  [GET_VOTES_INTERESTED_LIST](state, payload) {
    state.company.votesInterestedList = payload || {};
  },
  // 公司專業投票詳細內容
  [GET_COMPANY_VOTES_DETAIL](state, payload) {
    state.company.votesDetail = payload || {};
  },
  // 公司專頁公司名
  [CHANGE_COMPANY_COMPANY_NAME](state, payload) {
    state.company.companyData.companyName = payload;
  },
  // 工作機會
  [GET_COMPANY_JOBS](state, payload) {
    state.company.jobs = payload || { joblist: [] };
  },
  // 變更公司專業 custno
  [CHANGE_COMPANY_CUSTNO](state, payload) {
    state.company.companyData.custno = payload;
  },
  // 變更是否有投過票
  [CHANGE_VOTES_HAS_VOTE](state) {
    state.company.votesHasVote = true;
  },
  // 未登入打開 lightbox
  [CHANGE_OPEN_VOTE_LOGIN_LIGHTBOX](state) {
    state.company.openVoteLoginLightbox = true;
  },
  // 未登入關閉 lightbox
  [CHANGE_CLOSE_VOTE_LOGIN_LIGHTBOX](state) {
    state.company.openVoteLoginLightbox = false;
  },
  // 無投票權限 lightbox 打開
  [CHANGE_OPEN_VOTE_LIGHTBOX](state) {
    state.company.openVoteLightbox = true;
  },
  // 無投票權限 lightbox 關閉
  [CHANGE_CLOSE_VOTE_LIGHTBOX](state) {
    state.company.openVoteLightbox = false;
  },
  // 清空公司專業資訊
  [CLEAR_COMPANY_DATA](state) {
    state.company.companyData = companyInit;
    state.company.jobs = {
      joblist: []
    };
  },
  // 清空公司專業評論列表
  [CLEAR_COMPANY_REVIEWS_LIST](state) {
    state.company.reviewsList = reviewsListInit;
  },
  // 清空公司專業感興趣評論列表
  [CLEAR_REVIEWS_INTERESTED_LIST](state) {
    state.company.reviewsInterestedList = reviewsInterestedList;
  },
  // 清空公司專業投票列表
  [CLEAR_COMPANY_VOTES_LIST](state) {
    state.company.votesList = votesListInit;
  },
  // 清空公司專業感興趣投票列表
  [CLEAR_VOTES_INTERESTED_LIST](state) {
    state.company.votesInterestedList = votesInterestedList;
  },
  // 清空公司專業評論詳細頁內容
  [CLEAR_COMPANY_REVIEWS_DETAIL](state) {
    state.company.reviewsDetail = {};
  },
  // 清空公司專業投票詳細頁內容
  [CLEAR_COMPANY_VOTES_DETAIL](state) {
    state.company.votesDetail = {};
    state.company.votesHasVote = false;
  },
  // 還原公司專業初始狀態
  [CLEAR_COMPANY_STATUS](state) {
    state.company = init;
  },
  // 投票 loading 打開
  [VOTES_LOADING_TRUE](state) {
    state.company.votesLoading = true;
  },
  // 投票 loading 關閉
  [VOTES_LOADING_FALSE](state) {
    state.company.votesLoading = false;
  },
  // 公司專業投票詳細內容
  [GET_COMPANY_COMPARE](state, payload) {
    state.compareResult = payload || [];
  },
  // 清除公司比較資料
  [CLEAN_COMPANY_COMPARE](state) {
    state.compareResult = [];
  }
};

export const getters = {
  getCompanyData: state => state.company
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
