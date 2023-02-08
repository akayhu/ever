import { defineStore } from "pinia";
import { apiGetAuthAdminStatus } from "@/apis/user";
import userIdentityModule from "@/utils/userAuthority";
import { setConfig } from "@/utils/rollbar.js";

const state = () => ({
  user: {
    // 是否在可登入時間，晚上 11:30 ~ 00:10 無法登入操作
    accessible: true,
    // 允許預約的網站
    allowedSite: [],
    // 資料權限
    dataPermission: [],
    // 員工AD帳號
    logonId: "",
    // 員工編號
    accountId: "",
    // 員工姓名
    name: "",
    // 身分角色
    // 1:PM
    // 11:Salesperson(整召業務), 12:Planner(整召企劃), 13:Operator(整召營運), 14:Manager(整召主管)
    // 21:JB-VM(產品VM), 22:JB-MGR(產品主管), 23:JB-PM(產品PM)
    role: "",
    // 特殊權限
    specialPermission: [],
    // 登入狀態(0:未登入, 1:已登入無權限, 2:已登入有權限)
    type: 0,
    // 是否已登入
    login: false,
    // 身份可使用的權限
    userAuthority: {}
  }
});

const getters = {};

const actions = {
  getAuthStatus() {
    return new Promise(resolve => {
      apiGetAuthAdminStatus()
        .then(response => {
          let apiResponse = response.data.response;
          this.user = apiResponse;
          this.user.userAuthority = userIdentityModule[apiResponse.role];
          this.user.login = true;
          setConfig(apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getAuthStatus", error);
        });
    });
  }
};

export const useUserStore = defineStore("user", { state, getters, actions });
