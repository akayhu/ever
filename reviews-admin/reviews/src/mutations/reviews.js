import {
  actions,
  GET_REVIEWS_LIST,
  CLEAR_REVIEWS_LIST,
  SET_LOADING_STATUS
} from "@/actions/reviews";

const init = {
  items: [],
  total: 0,
  lastPage: 1,
  hasMorePages: false,
  currentPage: 1,
  perPage: "10"
};

export const state = {
  reviews: init,
  isLoading: false
};

export const mutations = {
  [GET_REVIEWS_LIST](state, payload) {
    state.reviews = payload;
  },
  [CLEAR_REVIEWS_LIST](state) {
    state.reviews = init;
  },
  [SET_LOADING_STATUS](state, payload) {
    state.isLoading = payload;
  }
};

export const getters = {
  getReviewsData: state => state.reviews,
  isLoading: state => state.isLoading
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
