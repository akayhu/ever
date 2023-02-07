import { apiGetReviewsList } from "@/apis/reviews";
import reviewsData from "@/mockData/reviewsData";

export const GET_REVIEWS_LIST = "GET_REVIEWS_LIST";
export const CLEAR_REVIEWS_LIST = "CLEAR_REVIEWS_LIST";
export const SET_LOADING_STATUS = "SET_LOADING_STATUS";

export const actions = {
  // 評論列表資料
  getReviewsList({ commit }, payload) {
    commit(CLEAR_REVIEWS_LIST);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_REVIEWS_LIST, reviewsData);
    }

    commit(SET_LOADING_STATUS, true);
    apiGetReviewsList(payload).then(response => {
      let apiResponse = response.data.response || [];

      commit(SET_LOADING_STATUS, false);
      commit(GET_REVIEWS_LIST, apiResponse);
    });
  }
};
