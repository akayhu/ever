import router from "@/layouts/defaultLayout";

export const CHANGE_NOW_ROUTER_PATH = "CHANGE_NOW_ROUTER_PATH";
export const CHANGE_NOW_ROUTER_HISTORY_NAME = "CHANGE_NOW_ROUTER_HISTORY_NAME";
export const CHANGE_SEALING_STATION = "CHANGE_SEALING_STATION";
export const TOGGLE_SEALING_STATION = "TOGGLE_SEALING_STATION";

export const actions = {
  changeNowRouterPath({ commit }, payload) {
    commit(CHANGE_NOW_ROUTER_PATH, payload);
  },
  changeNowRouterHistoryName({ commit }, payload) {
    commit(CHANGE_NOW_ROUTER_HISTORY_NAME, payload);
  },
  changeSealingStation({ commit }) {
    commit(CHANGE_SEALING_STATION);
    // 導封站
    router.replace({
      name: "sealingStation"
    });
  },
  toggleIsSealingStation({ commit }, payload) {
    commit(TOGGLE_SEALING_STATION, payload);
  }
};
