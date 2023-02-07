const votesMiddleware = ({ to, from, next, store }) => {
  let query = {
    perPage: 10,
    page: 1
  };

  if (to.query.page && to.query.page !== from.query.page) {
    query.page = to.query.page;
  }

  store.dispatch("user/getUserBrowsesCompany");
  store.dispatch("votes/getVotesList", query);
  return next();
};

export default votesMiddleware;
