// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// 避免調用兩次 `next`
// 登入 Middleware
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";

const commonMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const { getAuthStatus } = userStore;
  const { user } = storeToRefs(userStore);
  const userAuthStatusType = user.value.type;

  // 0:未登入, 1:已登入無權限, 2:已登入有權限
  if (userAuthStatusType === 2 && to.path !== "/") {
    return done();
  } else if (userAuthStatusType === 2 && to.path === "/") {
    // 若已登入，首頁為登入後首頁
    return next("/loginhome");
  }

  // store 未存入登入狀態時(例如：直衝網址與第一次登入)
  getAuthStatus().then(authStatus => {
    if (authStatus.type === 1) {
      return next("/error/403");
    } else if (authStatus.type === 2 && to.path === "/") {
      return next("/loginhome");
    } else if (authStatus.type === 0 && to.path !== "/") {
      return next("/");
    } else {
      return done();
    }
  });
};

export default commonMiddleware;
