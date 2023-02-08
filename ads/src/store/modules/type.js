// actions type key
export const typeActionsType = {
  RESET_BOARD_ID_TYPE: "RESET_BOARD_ID_TYPE"
};

export const actions = {
  // 清除狀態
  resetBoardIdType({ commit }) {
    commit(typeActionsType.RESET_BOARD_ID_TYPE);
  }
};

export const state = {
  type: {
    boardIdType: {
      groupList: []
    }
  }
};

export const mutations = {
  [typeActionsType.RESET_BOARD_ID_TYPE](state) {
    state.type.boardIdType = {};
  }
};

export const getters = {
  getType: state => state.type
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
