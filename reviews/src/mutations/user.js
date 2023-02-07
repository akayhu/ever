import {
  actions,
  GET_USER_LOGIN_STATUS,
  GET_USER_BROWSES_COMPANY
} from "@/actions/user";

/* loginStatus
0: 未登入
1: 登入 104 其他服務, 未登 reviews
2: 已登入 reviews
*/
export const state = {
  user: {
    loginStatus: process.env.VUE_APP_ENV === "development" ? 0 : 0,
    browsesCompany: []
  }
};

export const mutations = {
  [GET_USER_LOGIN_STATUS](state, payload) {
    state.user.loginStatus = payload;
  },
  [GET_USER_BROWSES_COMPANY](state, payload) {
    state.user.browsesCompany = payload;
  }
};

export const getters = {
  getUserData: state => state.user,
  userLoginStatus: state => state.user.loginStatus,
  isLoginForInfo: state => {
    // 這邊的判斷是為了給登入後才能顯示的資料所使用，在他站登入跟 reviews 登入都可以觀看
    const status = state.user.loginStatus;
    return status === 1 || status === 2;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
