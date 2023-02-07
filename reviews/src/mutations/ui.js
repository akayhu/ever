import {
  actions,
  CHANGE_NOW_ROUTER_PATH,
  CHANGE_NOW_ROUTER_HISTORY_NAME,
  CHANGE_SEALING_STATION,
  TOGGLE_SEALING_STATION
} from "@/actions/ui";

export const state = {
  ui: {
    nowRouterPath: "/",
    routerHistoryName: "",
    isSealingStation: false
  }
};

export const mutations = {
  [CHANGE_NOW_ROUTER_PATH](state, payload) {
    state.ui.nowRouterPath = payload;
  },
  [CHANGE_NOW_ROUTER_HISTORY_NAME](state, payload) {
    state.ui.routerHistoryName = payload;
  },
  [CHANGE_SEALING_STATION](state) {
    state.ui.isSealingStation = true;
  },
  [TOGGLE_SEALING_STATION](state, payload) {
    state.ui.isSealingStation = payload.sealingState;
  }
};

export const getters = {
  getUi: state => state.ui
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
