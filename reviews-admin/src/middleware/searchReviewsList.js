const searchReviewsListMiddleware = ({ to, from, next, store }) => {
  const userLogin = store.getters["user/getUserData"].isLogin;
  const searchCondition =
    store.getters["reviews/getReviewsData"].reviewsSearchCondition;

  const searchQuery = {
    perPage: 10,
    page: 1,
    createStart: searchCondition.createStart,
    createEnd: searchCondition.createEnd,
    auditState: searchCondition.auditState,
    custno: searchCondition.custno,
    id: searchCondition.id,
    pid: searchCondition.pid
  };

  if (!searchQuery.createStart) delete searchQuery.createStart;
  if (!searchQuery.createEnd) delete searchQuery.createEnd;
  if (!searchQuery.custno) delete searchQuery.custno;
  if (!searchQuery.id) delete searchQuery.id;
  if (!searchQuery.pid) delete searchQuery.pid;

  if (userLogin && !searchQuery.auditState) {
    return next();
  } else if (userLogin) {
    if (to.query.page && to.query.page !== from.query.page) {
      searchQuery.page = to.query.page;
      store.dispatch("reviews/changeSearchCondition", searchQuery);
      store.dispatch("reviews/getReviewsSearch", searchQuery);
    } else {
      store.dispatch("reviews/clearReviews");
    }
    return next();
  } else {
    return next("/");
  }
};

export default searchReviewsListMiddleware;
