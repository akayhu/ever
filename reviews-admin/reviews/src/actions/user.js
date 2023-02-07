import { apiGetAuthStatus, apiGetUserBrowsesCompany } from "@/apis/user";
import seenCompanyData from "@/mockData/seenCompanyData";

export const GET_USER_LOGIN_STATUS = "GET_USER_LOGIN_STATUS";
export const GET_USER_BROWSES_COMPANY = "GET_USER_BROWSES_COMPANY";

export const actions = {
  // 取得登入狀態
  getUserLoginStatus({ commit }) {
    return new Promise(resolve => {
      apiGetAuthStatus().then(res => {
        const loginStatus = res.data.response.type;
        commit(GET_USER_LOGIN_STATUS, loginStatus);
        resolve(loginStatus);
      });
    });
  },
  // 取曾經預覽過的公司
  getUserBrowsesCompany({ commit }) {
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_USER_BROWSES_COMPANY, seenCompanyData);
    }
    apiGetUserBrowsesCompany().then(response => {
      const browsesCompanyData = response.data.response;
      commit(GET_USER_BROWSES_COMPANY, browsesCompanyData);
    });
  }
};
