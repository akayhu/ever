import {
  apiGetReviews,
  apiGetReviewsDetail,
  apiPatchReviewsDetail,
  apiGetReviewsSearch,
  apiGetReviewsAccuses,
  apiPatchReviewsAccuse,
  apiGetBossReplyRecord,
  apiDeleteBossReply
} from "@/apis/reviews";
import router from "@/layouts/defaultLayout";
import { apiGetLogSearch } from "@/apis/log";

export const GET_REVIEWS_LIST = "GET_REVIEWS_LIST";
export const GET_REVIEWS_DETAIL = "GET_REVIEWS_DETAIL";
export const CLEAR_REVIEWS = "CLEAR_REVIEWS";
export const PATCH_REVIEWS_DETAIL = "PATCH_REVIEWS_DETAIL";
export const GET_REVIEWS_SEARCH = "GET_REVIEWS_SEARCH";
export const CHANGE_SEARCH_CONDITION = "CHANGE_SEARCH_CONDITION";
export const GET_REVIEWS_ACCUSES = "GET_REVIEWS_ACCUSES";
export const PATCH_REVIEWS_ACCUSE_DETAIL = "PATCH_REVIEWS_ACCUSE_DETAIL";
export const CLEAR_REVIEWS_SEARCH = "CLEAR_REVIEWS_SEARCH";
export const GET_REVIEWS_DETAIL_LOG = "GET_REVIEWS_DETAIL_LOG";
export const CLEAR_REVIEWS_DETAIL_LOG = "CLEAR_REVIEWS_DETAIL_LOG";
export const GET_BOSS_REPLY_RECORD = "GET_BOSS_REPLY_RECORD";

// 評論審核初始值
const reviewsListInit = {
  currentPage: 1,
  hasMorePages: false,
  items: [],
  lastPage: 1,
  loadingEnd: false,
  perPage: "10",
  total: 0
};

// 評論查詢初始值
const reviewsSearchListInit = {
  currentPage: 1,
  hasMorePages: false,
  items: [],
  lastPage: 1,
  loadingEnd: true,
  perPage: "10",
  total: 0
};

// 搜尋條件初始值
const reviewsSearchConditionInit = {
  perPage: 10,
  page: 1,
  createStart: "",
  createEnd: "",
  auditState: "",
  custno: "",
  bossReply: 1,
  isVerify: 1,
  id: "",
  pid: ""
};

// 申訴列表初始值
const reviewsAccusesList = {
  currentPage: 1,
  hasMorePages: false,
  items: [],
  lastPage: 1,
  perPage: "10",
  total: 0,
  loadingEnd: false
};

// 評論詳細頁 Log
const reviewsDetailLogInit = {
  total: 0,
  perPage: 20,
  currentPage: 0,
  lastPage: 0,
  hasMorePages: false,
  items: []
};

// 老闆回覆紀錄初始值
const reviewsBossReplyRecordInit = {
  total: 0,
  perPage: 10,
  currentPage: 1,
  hasMorePages: false,
  items: []
};

const state = {
  reviews: {
    // 評論審核
    reviewsList: reviewsListInit,
    // 評論詳細頁
    reviewsDetail: {},
    // 評論詳細頁過往審核
    reviewsDetailLog: reviewsDetailLogInit,
    // 評論查詢
    reviewsSearchList: reviewsSearchListInit,
    // 申訴列表
    reviewsAccusesList: reviewsAccusesList,
    // 搜尋條件
    reviewsSearchCondition: reviewsSearchConditionInit,
    // 老闆回覆紀錄
    reviewsBossReplyRecord: reviewsBossReplyRecordInit
  }
};

export const actions = {
  // 評論列表
  getReviewsList({ commit }, payload) {
    commit(CLEAR_REVIEWS);
    apiGetReviews(payload).then(response => {
      let apiResponse = response.data.response;
      commit(GET_REVIEWS_LIST, apiResponse);
    });
  },
  // 評論內容
  getReviewsDetail({ commit }, id) {
    commit(CLEAR_REVIEWS);
    apiGetReviewsDetail({ id }).then(response => {
      let apiResponse = response.data.response;
      commit(GET_REVIEWS_DETAIL, apiResponse);
    });
  },
  // 評論內容 Log
  getReviewsDetailLog({ commit }, payload) {
    commit(CLEAR_REVIEWS_DETAIL_LOG);
    apiGetLogSearch(payload).then(response => {
      let apiResponse = response.data.response;
      commit(GET_REVIEWS_DETAIL_LOG, apiResponse);
    });
  },
  // 審核評論內容
  patchReviewsDetail({ commit }, payload) {
    apiPatchReviewsDetail(payload).then(() => {
      router.replace({
        name: "ReviewList"
      });
    });
  },
  // 申訴列表
  getReviewsAccuses({ commit }, payload) {
    commit(CLEAR_REVIEWS);
    apiGetReviewsAccuses(payload).then(response => {
      let apiResponse = response.data.response;
      commit(GET_REVIEWS_ACCUSES, apiResponse);
    });
  },
  // 申訴評論內容
  patchReviewsAccuseDetail({ commit }, payload) {
    apiPatchReviewsAccuse(payload).then(response => {
      router.replace({
        name: "ReviewComplain"
      });
    });
  },
  // 老闆回覆紀錄
  getBossReplyRecord({ commit }, payload) {
    apiGetBossReplyRecord(payload).then(response => {
      commit(GET_BOSS_REPLY_RECORD, response.data.response);
    });
  },
  // 刪除老闆回覆
  deleteBossReply({ dispatch }, payload) {
    let { id, reviewId } = payload;
    apiDeleteBossReply({ id }).then(response => {
      if (response.data.response) dispatch("getReviewsDetail", reviewId);
    });
  },
  // 查詢評論列表
  getReviewsSearch({ commit }, payload) {
    commit(CLEAR_REVIEWS);
    apiGetReviewsSearch(payload).then(response => {
      commit(GET_REVIEWS_SEARCH, response.data.response);
    });
  },
  // 查詢條件
  changeSearchCondition({ commit }, payload) {
    commit(CHANGE_SEARCH_CONDITION, payload);
  },
  // 資料清空
  clearReviews({ commit }) {
    commit(CLEAR_REVIEWS_SEARCH);
  }
};

export const mutations = {
  [GET_REVIEWS_LIST](state, payload) {
    state.reviews.reviewsList = payload;
    state.reviews.reviewsList.loadingEnd = true;
    state.reviews.reviewsSearchList.loadingEnd = true;
  },
  [GET_REVIEWS_DETAIL](state, payload) {
    state.reviews.reviewsDetail = payload || {};
    state.reviews.reviewsSearchList.loadingEnd = true;
  },
  [GET_REVIEWS_SEARCH](state, payload) {
    state.reviews.reviewsSearchList = payload;
    state.reviews.reviewsSearchList.loadingEnd = true;
  },
  [CHANGE_SEARCH_CONDITION](state, payload) {
    state.reviews.reviewsSearchCondition = payload;
  },
  [GET_REVIEWS_ACCUSES](state, payload) {
    state.reviews.reviewsAccusesList = payload;
    state.reviews.reviewsAccusesList.loadingEnd = true;
    state.reviews.reviewsSearchList.loadingEnd = true;
  },
  [GET_BOSS_REPLY_RECORD](state, payload) {
    state.reviews.reviewsBossReplyRecord = payload;
  },
  [CLEAR_REVIEWS_SEARCH](state) {
    state.reviews.reviewsSearchList = { items: [] };
    state.reviews.reviewsSearchList.loadingEnd = true;
  },
  [CLEAR_REVIEWS](state) {
    state.reviews.reviewsList = reviewsListInit;
    state.reviews.reviewsDetail = {};
    state.reviews.reviewsSearchList = reviewsSearchListInit;
    state.reviews.reviewsSearchList.loadingEnd = false;
    state.reviews.reviewsAccusesList = reviewsAccusesList;
    state.reviews.reviewsBossReplyRecord = reviewsBossReplyRecordInit;
  },
  [GET_REVIEWS_DETAIL_LOG](state, payload) {
    state.reviews.reviewsDetailLog = payload;
  },
  [CLEAR_REVIEWS_DETAIL_LOG](state) {
    state.reviews.reviewsDetailLog = reviewsDetailLogInit;
  }
};

export const getters = {
  getReviewsData: state => state.reviews
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
