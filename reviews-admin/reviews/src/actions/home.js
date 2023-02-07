import { apiGetReviewsList } from "@/apis/reviews";
import { apiGetVotesList } from "@/apis/votes";
import reviewsData from "@/mockData/reviewsData";
import votesData from "@/mockData/votesData";

export const GET_HOME_REVIEWS_LIST = "GET_HOME_REVIEWS_LIST";
export const GET_HOME_VOTES_LIST = "GET_HOME_VOTES_LIST";

export const actions = {
  // 首頁評論列表資料
  getHomeReviewsList({ commit }, payload) {
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_HOME_REVIEWS_LIST, reviewsData.items);
    }
    apiGetReviewsList(payload).then(response => {
      let apiResponse = response.data.response.items || [];
      commit(GET_HOME_REVIEWS_LIST, apiResponse);
    });
  },
  // 首頁投票列表資料
  getHomeVotesList({ commit }, payload) {
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_HOME_VOTES_LIST, votesData.items);
    }
    apiGetVotesList(payload).then(response => {
      let apiResponse = response.data.response.items || [];
      commit(GET_HOME_VOTES_LIST, apiResponse);
    });
  }
};
