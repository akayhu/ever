// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// 避免調用兩次 `next`

// 角色權限 role
// 11:Salesperson(整召業務), 13:Operator(整召營運), 14:Manager(整召主管)
// 三種身分的登入後首頁為 Dashboard，其餘身分的登入後首頁維持為行事曆
import store from "@/store";
import { rollbarError } from "@/utils/rollbar.js";
import pinia from "@/stores/index.js";
import useUserStore from "@/stores/user";

const commonMiddleware = ({ to, next, done }) => {
  const userData = store.getters["user/getUserStatus"];
  const userRole = userData.role;
  const conscriptArr = [11, 13, 14];
  const userAuthStatusType = userData.type;
  const userStore = useUserStore(pinia);

  // 0:未登入, 1:已登入無權限, 2:已登入有權限
  if (userAuthStatusType === 2 && to.path !== "/") {
    return done();
  } else if (userAuthStatusType === 2 && to.path === "/") {
    if (conscriptArr.includes(userRole)) {
      // 若身份為整召業務、整召營運、整召主管，登入後首頁為 dashboard
      return next("/dashboard");
    } else {
      // 若已登入，首頁為登入後首頁
      return next("/calendar");
    }
  }

  userStore.getAuthStatus();

  // store 未存入登入狀態時(例如：直衝網址與第一次登入)
  store.dispatch("user/getAuthStatus").then(authStatus => {
    if (authStatus.type === 1) {
      const resData = {
        data: "",
        config: {
          url: "/internal/auth/status",
          data: ""
        }
      };
      rollbarError(resData, "getAuthStatus", "403 權限不足");
      return next("/error/403");
    } else if (authStatus.type === 2 && to.path === "/") {
      if (conscriptArr.includes(authStatus.role)) {
        return next("/dashboard");
      } else {
        return next("/calendar");
      }
    } else if (authStatus.type === 0 && to.path !== "/") {
      return next("/");
    } else {
      return done();
    }
  });
};

export default commonMiddleware;
