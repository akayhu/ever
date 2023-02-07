import Vue from "vue";
import Vuex from "vuex";
import user from "@/mutations/user";
import mockData from "@/mutations/mockData";
import reviews from "@/mutations/reviews";
import votes from "@/mutations/votes";
import company from "@/mutations/company";
import log from "@/mutations/log";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    mockData,
    user,
    reviews,
    votes,
    company,
    log
  },
  // 嚴格模式，禁止直接修改 state
  strict: process.env.NODE_ENV !== "production"
});
