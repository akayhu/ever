const logListMiddleware = ({ to, from, next, store }) => {
  const userLogin = store.getters["user/getUserData"].isLogin;
  const allAccounts = store.getters["user/getUserData"].allAccount;
  const logCondition = store.getters["log/getLogData"].logSearchCondition;
  const accountsQuery = {
    perPage: 30,
    page: 1
  };

  let logQuery = {
    perPage: 10,
    page: 1,
    createStart: logCondition.createStart,
    createEnd: logCondition.createEnd,
    entityId: logCondition.entityId,
    entityType: logCondition.entityType,
    accountId: logCondition.accountId
  };

  if (!logQuery.createStart) delete logQuery.createStart;
  if (!logQuery.createEnd) delete logQuery.createEnd;
  if (!logQuery.entityId) delete logQuery.entityId;
  if (!logQuery.entityType) delete logQuery.entityType;
  if (!logQuery.accountId) delete logQuery.accountId;

  if (userLogin) {
    if (to.query.page && to.query.page !== from.query.page) {
      logQuery.page = to.query.page;
    }
    if (allAccounts.length < 1) {
      store.dispatch("user/getAllAccounts", accountsQuery);
    }
    store.dispatch("log/getLogSearchList", logQuery);
    store.dispatch("log/setLogSearchCondition", logQuery);
    return next();
  } else {
    return next("/");
  }
};

export default logListMiddleware;
