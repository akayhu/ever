import { TYPEID_MAP } from "@/utils/enum.js";

const reviewsMiddleware = ({ to, from, next, store }) => {
  let query = {
    perPage: 10,
    page: 1,
    typeId: TYPEID_MAP.ALL
  };

  if (to.query.page && to.query.page !== from.query.page) {
    query.page = to.query.page;
  }
  query.typeId = to.query.typeId || TYPEID_MAP.ALL;

  store.dispatch("user/getUserBrowsesCompany");
  store.dispatch("reviews/getReviewsList", query);
  return next();
};

export default reviewsMiddleware;
