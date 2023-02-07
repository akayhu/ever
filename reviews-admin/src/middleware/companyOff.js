const companyOffMiddleware = ({ to, from, next, store }) => {
  const userLogin = store.getters["user/getUserData"].isLogin;
  let query = {
    perPage: 10,
    page: 1
  };

  if (userLogin) {
    if (to.query.page && to.query.page !== from.query.page) {
      query.page = to.query.page;
    }
    store.dispatch("company/getCompanyOffLists", query);
    return next();
  } else {
    return next("/");
  }
};

export default companyOffMiddleware;
