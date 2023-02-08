import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import {
  updateApiInWatchList,
  deleteApiInWatchList,
  getApiInWatchList
} from "@/apis/config/index.js";

export const MUTATIONS_TYPE = {
  UPDATE_LAST_API_LIST: "UPDATE_LAST_API_LIST"
};

export const GETTERS_TYPE = {
  GET_API_IN_LAST_API_LIST: "GET_API_IN_LAST_API_LIST"
};

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    ...modules
  },
  strict: process.env.NODE_ENV !== "production",
  state: {
    lastApiList: []
  },
  mutations: {
    [MUTATIONS_TYPE.UPDATE_LAST_API_LIST](state, payload) {
      const { type, param } = payload;
      if (type === "update") {
        state.lastApiList = updateApiInWatchList(state.lastApiList)(param);
      } else if (type === "delete") {
        state.lastApiList = deleteApiInWatchList(state.lastApiList)(param);
      }
    }
  },
  getters: {
    [GETTERS_TYPE.GET_API_IN_LAST_API_LIST]: state => payload => {
      return getApiInWatchList(state.lastApiList)(payload);
    }
  }
});

export const useStore = () => store;

export default store;
