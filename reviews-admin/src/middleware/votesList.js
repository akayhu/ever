const votesListMiddleware = ({ to, from, next, store }) => {
  const userLogin = store.getters["user/getUserData"].isLogin;
  let query = {
    perPage: 10,
    page: 1,
    position: "votes"
  };

  if (userLogin) {
    if (to.query.page && to.query.page !== from.query.page) {
      query.page = to.query.page;
    }
    store.dispatch("votes/getVotesList", query);
    return next();
  } else {
    return next("/");
  }
};

export default votesListMiddleware;
