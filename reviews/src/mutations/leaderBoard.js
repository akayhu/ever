import {
  actions,
  GET_LEADER_BOARD_TOP5,
  GET_LEADER_BOARD,
  CLEAR_BOARD_DATA
} from "@/actions/leaderBoard";

export const state = {
  top5: {},
  currentBoard: []
};

export const mutations = {
  [GET_LEADER_BOARD_TOP5](state, payload) {
    state.top5 = payload;
  },
  [GET_LEADER_BOARD](state, payload) {
    state.currentBoard = payload;
  },
  [CLEAR_BOARD_DATA](state) {
    state.currentBoard = [];
  }
};

export const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
