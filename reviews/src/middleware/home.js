const homeMiddleware = ({ to, from, next, store }) => {
  let query = {
    perPage: 10,
    page: 1
  };

  store.dispatch("user/getUserBrowsesCompany");
  store.dispatch("home/getHomeReviewsList", query);
  store.dispatch("home/getHomeVotesList", query);
  return next();
};

export default homeMiddleware;
