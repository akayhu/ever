import Vue from "vue";
import Vuex from "vuex";
import mockData from "@/mutations/mockData";
import user from "@/mutations/user";
import home from "@/mutations/home";
import reviews from "@/mutations/reviews";
import votes from "@/mutations/votes";
import company from "@/mutations/company";
import search from "@/mutations/search";
import ui from "@/mutations/ui";
import leaderBoard from "@/mutations/leaderBoard";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    mockData,
    user,
    home,
    reviews,
    votes,
    company,
    search,
    ui,
    leaderBoard
  },
  strict: process.env.NODE_ENV !== "production"
});
