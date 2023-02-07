import { apiGetLeaderBoardTop5, apiGetCompanyBoard } from "@/apis/leaderBoard";
import { encodeCustno } from "@/utils/index";

export const GET_LEADER_BOARD_TOP5 = "GET_LEADER_BOARD_TOP5";
export const GET_LEADER_BOARD = "GET_LEADER_BOARD";
export const CLEAR_BOARD_DATA = "CLEAR_BOARD_DATA";

export const actions = {
  // 首頁排行榜資料
  getLeaderBoardTop5({ commit }) {
    return apiGetLeaderBoardTop5().then(response => {
      const res = response.data.response || {};
      commit(GET_LEADER_BOARD_TOP5, res);
    });
  },
  //公司排行榜
  getLeaderBoard({ commit }, type) {
    commit(CLEAR_BOARD_DATA);
    return apiGetCompanyBoard({ type }).then(response => {
      const res = response.data.response || {};
      const typeData = res[type] || [];
      const result = typeData.map(company => {
        company.custUrl = `${process.env.VUE_APP_104_URL}company/${encodeCustno(
          company.custno
        )}?jobsource=reviews_top`;
        return company;
      });
      return commit(GET_LEADER_BOARD, result);
    });
  }
};
