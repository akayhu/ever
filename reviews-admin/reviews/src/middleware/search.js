const searchMiddleware = ({ to, from, next, store }) => {
  let query = {
    perPage: 10,
    page: 1,
    keyword: to.query.keyword
  };

  if (to.query.page && to.query.page !== from.query.page) {
    query.page = to.query.page;
  }

  store.dispatch("user/getUserBrowsesCompany");
  store.dispatch("search/getSearchCompanyList", query);
  return next();
};

export default searchMiddleware;
