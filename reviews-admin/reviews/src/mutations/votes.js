import { actions, GET_VOTES_LIST, CLEAR_VOTES_LIST } from "@/actions/votes";

const init = {
  items: [],
  total: 0,
  lastPage: 1,
  hasMorePages: false,
  currentPage: 1,
  perPage: "10",
  openVoteLightbox: false
};

export const state = {
  votes: init
};

export const mutations = {
  [GET_VOTES_LIST](state, payload) {
    state.votes = payload;
    state.votes.openVoteLightbox = false;
  },
  [CLEAR_VOTES_LIST](state) {
    state.votes = init;
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
