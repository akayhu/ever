import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import Reviews from "@/views/Reviews.vue";
import Votes from "@/views/Votes.vue";
import Search from "@/views/Search.vue";
import Company from "@/views/Company.vue";
import CompanyReviewsVotes from "@/views/CompanyReviewsVotes.vue";
import CompanySingleReview from "@/views/CompanySingleReview.vue";
import CompanySingleVote from "@/views/CompanySingleVote.vue";
import FormReview from "@/views/FormReview.vue";
import FormReviewDone from "@/views/FormReviewDone.vue";
import FormVoteDone from "@/views/FormVoteDone.vue";
import FormLogin from "@/views/FormLogin.vue";
import FormVote from "@/views/FormVote.vue";
import Ranking from "@/views/Ranking.vue";
import LeaderBoard from "@/views/LeaderBoard.vue";
import CompareCompany from "@/views/CompareCompany.vue";
import About from "@/views/About.vue";
import Questions from "@/views/Questions.vue";
import Terms from "@/views/Terms.vue";
import Page404 from "@/views/Page404.vue";
import Page500 from "@/views/Page500.vue";
import SerachPrivate from "@/views/SerachPrivate.vue";
import SealingStation from "@/views/SealingStation.vue";
// metaInfo HOC
import withFetchMetaInfo from "@/utils/withFetchMetaInfo";
import withFetchJsonLd from "@/utils/withFetchJsonLd";
// Middleware
import pipelineMiddleware from "@/middleware/pipeline";
import commonMiddleware from "@/middleware/common";
import homeMiddleware from "@/middleware/home";
import reviewsMiddleware from "@/middleware/reviews";
import searchMiddleware from "@/middleware/search";
import companyMiddleware from "@/middleware/company";
import votesMiddleware from "@/middleware/votes";
import loginStatusMiddleware from "@/middleware/user";
import leaderBoardMiddleware from "@/middleware/leaderBoard";
import compareMiddleware from "@/middleware/compareCompany";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      // 首頁
      path: "/",
      name: "home",
      component: withFetchJsonLd(withFetchMetaInfo(Home)),
      meta: {
        middleware: [commonMiddleware, homeMiddleware]
      }
    },
    {
      // 最新評論列表
      path: "/reviews",
      name: "reviews",
      component: withFetchMetaInfo(Reviews),
      props: route => ({
        page: route.query.page
      }),
      meta: {
        middleware: [commonMiddleware, reviewsMiddleware]
      }
    },
    {
      // 最新投票列表
      path: "/votes",
      name: "votes",
      component: withFetchMetaInfo(Votes),
      props: route => ({
        page: route.query.page
      }),
      meta: {
        middleware: [commonMiddleware, votesMiddleware]
      }
    },
    {
      // 公司搜尋
      path: "/search",
      name: "search",
      component: withFetchMetaInfo(Search),
      props: route => ({
        query: route.query.keyword
      }),
      meta: {
        middleware: [commonMiddleware, searchMiddleware]
      }
    },
    {
      // 低於4.0分
      path: "/search/private",
      name: "serachPrivate",
      component: withFetchMetaInfo(SerachPrivate),
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 公司專頁
      path: "/company",
      name: "company",
      component: Company,
      props: true,
      children: [
        {
          // 評論列表
          path: ":custno/reviews",
          name: "companyReviews",
          component: withFetchJsonLd(withFetchMetaInfo(CompanyReviewsVotes)),
          props: route => ({
            query: route.query.page,
            params: route.params.custno
          }),
          meta: {
            middleware: [commonMiddleware, companyMiddleware]
          }
        },
        {
          // 投票列表
          path: ":custno/votes",
          name: "companyVotes",
          component: withFetchJsonLd(withFetchMetaInfo(CompanyReviewsVotes)),
          props: route => ({
            query: route.query.page,
            params: route.params.custno
          }),
          meta: {
            middleware: [commonMiddleware, companyMiddleware]
          }
        },
        {
          // 單則評論內頁
          path: ":custno/reviews/:reviewsId",
          name: "singleReview",
          component: withFetchJsonLd(withFetchMetaInfo(CompanySingleReview)),
          props: true,
          meta: {
            middleware: [commonMiddleware, companyMiddleware]
          }
        },
        {
          // 單則投票內頁
          path: ":custno/votes/:votesId",
          name: "singleVote",
          component: withFetchJsonLd(withFetchMetaInfo(CompanySingleVote)),
          props: true,
          meta: {
            middleware: [commonMiddleware, companyMiddleware]
          }
        }
      ]
    },
    {
      // 新增評論
      path: "/form/review",
      name: "formReview",
      component: withFetchMetaInfo(FormReview),
      meta: {
        middleware: [commonMiddleware, loginStatusMiddleware]
      }
    },
    {
      // 新增評論完成
      path: "/form/review/done",
      name: "formReviewDone",
      component: withFetchMetaInfo(FormReviewDone),
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 新增評論登入
      path: "/form/review/login",
      name: "formReviewLogin",
      component: FormLogin,
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 新增投票
      path: "/form/vote",
      name: "formVote",
      component: withFetchMetaInfo(FormVote),
      meta: {
        middleware: [commonMiddleware, loginStatusMiddleware]
      }
    },
    {
      // 新增投票
      path: "/form/vote/done",
      name: "formVoteDone",
      component: withFetchMetaInfo(FormVoteDone),
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 新增投票登入
      path: "/form/vote/login",
      name: "formVoteLogin",
      component: FormLogin,
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 評比排行榜
      path: "/top",
      name: "ranking",
      redirect: "/top/salary",
      component: Ranking,
      children: [
        {
          // 比較好公司
          path: "compare/:compare?",
          name: "compare",
          component: withFetchMetaInfo(CompareCompany),
          meta: {
            middleware: [commonMiddleware, compareMiddleware]
          }
        },
        {
          // 排行榜
          path: ":type",
          name: "leaderBoard",
          component: withFetchJsonLd(withFetchMetaInfo(LeaderBoard)),
          meta: {
            middleware: [commonMiddleware, leaderBoardMiddleware]
          }
        }
      ]
    },
    {
      // 關於我們
      path: "/about",
      name: "about",
      component: withFetchMetaInfo(About),
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 常見問題
      path: "/questions",
      name: "questions",
      component: withFetchMetaInfo(Questions),
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 服務條款
      path: "/terms",
      name: "terms",
      component: withFetchMetaInfo(Terms),
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 404頁
      path: "/error/404",
      name: "page404",
      component: withFetchMetaInfo(Page404),
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 500頁
      path: "/error/500",
      name: "page500",
      component: withFetchMetaInfo(Page500),
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 封站頁
      path: "/sealingStation",
      name: "sealingStation",
      component: withFetchMetaInfo(SealingStation)
    },
    {
      // 找不到網頁
      path: "*",
      redirect: {
        name: "page404"
      },
      meta: {
        middleware: [commonMiddleware]
      }
    }
  ],
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    };
  }
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next();
  }

  const middleware = to.meta.middleware;
  const context = {
    to,
    from,
    next,
    store
  };

  return middleware[0]({
    ...context,
    next: pipelineMiddleware(context, middleware, 1)
  });
});

export default router;
