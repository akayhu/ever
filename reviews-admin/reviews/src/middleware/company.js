import { login } from "@/apis/user";
import { TYPEID_MAP } from "@/utils/enum.js";

const companyMiddleware = ({ to, from, next, store }) => {
  const currentLoginStatus = store.getters["user/userLoginStatus"];
  const name = to.name;
  const custno = to.params.custno;
  const custnoDecode = parseInt(custno, 36);
  const toParamsCustnoDecode = custnoDecode;
  const fromParamsCustnoDecode = from.params.custno
    ? parseInt(from.params.custno, 36)
    : "";
  const reviewsId = to.params.reviewsId;
  const reviewTypeId = to.query.typeId || TYPEID_MAP.ALL;
  const votesId = to.params.votesId;
  const reviewsDetailQuery = {
    id: reviewsId,
    custno: toParamsCustnoDecode
  };
  const reviewsInterestedQuery = {
    perPage: 6,
    page: 1,
    custno: toParamsCustnoDecode,
    excludeReviewId: reviewsId
  };
  const votesInterestedQuery = {
    perPage: 6,
    page: 1,
    custno: toParamsCustnoDecode,
    excludeVoteId: votesId
  };
  const votesDetailQuery = {
    id: votesId,
    custno: toParamsCustnoDecode
  };
  let pageQuery = {
    perPage: 10,
    page: 1,
    custno: toParamsCustnoDecode
  };

  if (to.query.page && to.query.page !== from.query.page) {
    pageQuery.page = to.query.page;
  }

  if (toParamsCustnoDecode !== fromParamsCustnoDecode) {
    store.dispatch("company/getCompanyData", { custno: toParamsCustnoDecode });
    store.dispatch("company/getCompanyJobs", { custno: toParamsCustnoDecode });
  }

  const routerName = {
    // 公司專頁 - 評論列表
    companyReviews: () =>
      store.dispatch("company/getCompanyReviewsList", {
        ...pageQuery,
        typeId: reviewTypeId
      }),
    // 公司專頁 - 投票列表
    companyVotes: () =>
      store.dispatch("company/getCompanyVotesList", pageQuery),
    // 公司專頁 - 評論詳細頁
    singleReview: () => {
      store.dispatch("company/getCompanyReviewsDetail", reviewsDetailQuery);
      store.dispatch(
        "company/getCompanyReviewsInterestedList",
        reviewsInterestedQuery
      );
    },
    // 公司專頁 - 投票詳細頁
    singleVote: () => {
      store.dispatch("company/getCompanyVotesDetail", votesDetailQuery);
      store.dispatch(
        "company/getCompanyVotesInterestedList",
        votesInterestedQuery
      );
      if (currentLoginStatus !== 2) {
        store.dispatch("user/getUserLoginStatus").then(loginStatus => {
          if (loginStatus === 1) {
            login(to.path);
          } else {
            return next();
          }
        });
      }
    }
  };

  store.dispatch("company/changeCompanyCustno", toParamsCustnoDecode);
  routerName[name]();

  return next();
};

export default companyMiddleware;
