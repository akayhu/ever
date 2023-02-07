const searchVotesListMiddleware = ({ to, from, next, store }) => {
  const userLogin = store.getters["user/getUserData"].isLogin;
  const searchCondition =
    store.getters["votes/getVotesData"].votesSearchCondition;

  const searchConditionData = {
    perPage: 10,
    page: 1,
    createStart: searchCondition.createStart,
    createEnd: searchCondition.createEnd,
    auditState: searchCondition.auditState,
    custno: searchCondition.custno,
    id: searchCondition.id,
    pid: searchCondition.pid
  };

  if (!searchConditionData.createStart) delete searchConditionData.createStart;
  if (!searchConditionData.createEnd) delete searchConditionData.createEnd;
  if (!searchConditionData.custno) delete searchConditionData.custno;
  if (!searchConditionData.id) delete searchConditionData.id;
  if (!searchConditionData.pid) delete searchConditionData.pid;

  if (userLogin && !searchConditionData.auditState) {
    return next();
  } else if (userLogin) {
    if (to.query.page && to.query.page !== from.query.page) {
      searchConditionData.page = to.query.page;
      store.dispatch("votes/changeSearchCondition", searchConditionData);
      store.dispatch("votes/getVotesSearch", searchConditionData);
    } else {
      store.dispatch("votes/clearVotes");
    }
    return next();
  } else {
    return next("/");
  }
};

export default searchVotesListMiddleware;
