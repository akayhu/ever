import {
  actions,
  GET_HOME_REVIEWS_LIST,
  GET_HOME_VOTES_LIST
} from "@/actions/home";

export const state = {
  home: {
    reviewsList: [],
    votesList: []
  }
};

export const mutations = {
  [GET_HOME_REVIEWS_LIST](state, payload) {
    state.home.reviewsList = payload;
  },
  [GET_HOME_VOTES_LIST](state, payload) {
    state.home.votesList = payload;
  }
};

export const getters = {
  getHomeData: state => state.home
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
