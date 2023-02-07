import { apiGetVotesList } from "@/apis/votes";
import votesData from "@/mockData/votesData";
import router from "@/layouts/defaultLayout";

export const GET_VOTES_LIST = "GET_VOTES_LIST";
export const CLEAR_VOTES_LIST = "CLEAR_VOTES_LIST";

export const actions = {
  // 投票列表資料
  getVotesList({ commit }, payload) {
    commit(CLEAR_VOTES_LIST);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_VOTES_LIST, votesData);
    }
    apiGetVotesList(payload).then(response => {
      let apiResponse = response.data.response || [];
      if (apiResponse.items.length < 1) {
        router.replace({
          name: "page404"
        });
      }
      commit(GET_VOTES_LIST, apiResponse);
    });
  }
};
