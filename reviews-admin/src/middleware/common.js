// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// 避免調用兩次 `next`

const commonMiddleware = ({ to, next, store }) => {
  const userData = store.getters["user/getUserData"];
  const storeAuthStatus = userData.authStatus;

  // store 有存入登入狀態時
  if (storeAuthStatus === 0 && to.path !== "/") {
    // 若未登入則導回登入首頁
    store.dispatch("user/setNotLogin");
    return next("/");
  } else if (storeAuthStatus === 1 && to.path !== "/") {
    return next();
  } else if (storeAuthStatus === 1 && to.path === "/") {
    // 若已登入，首頁為評論審核頁
    return next("/review_list");
  }

  // store 未存入登入狀態時(例如：直衝網址與第一次登入)
  store.dispatch("user/getAuthStatus").then(authStatus => {
    if (authStatus === 1 && to.path === "/") {
      return next("/review_list");
    } else if (authStatus === 0 && to.path !== "/") {
      store.dispatch("user/setNotLogin");
      return next({ path: "/" });
    } else {
      return next();
    }
  });
};

export default commonMiddleware;
