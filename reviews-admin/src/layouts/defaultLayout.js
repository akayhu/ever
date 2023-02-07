import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import ReviewList from "@/views/ReviewList.vue";
import ReviewVote from "@/views/ReviewVote.vue";
import ReviewDetail from "@/views/ReviewDetail.vue";
import ReviewComplain from "@/views/ReviewComplain.vue";
import SearchReview from "@/views/SearchReview.vue";
import SearchVote from "@/views/SearchVote.vue";
import VoteDetail from "@/views/VoteDetail.vue";
import ReviewComplainDetail from "@/views/ReviewComplainDetail";
import CompanyOff from "@/views/CompanyOff.vue";
import Log from "@/views/Log.vue";
import Account from "@/views/Account.vue";
import EditAccount from "@/views/EditAccount.vue";
import CreatAccount from "@/views/CreatAccount.vue";
import Page404 from "@/views/Page404.vue";
import Page500 from "@/views/Page500.vue";
// Middleware
import pipelineMiddleware from "@/middleware/pipeline";
import commonMiddleware from "@/middleware/common";
import reviewsListMiddleware from "@/middleware/reviewsList";
import votesListMiddleware from "@/middleware/votesList";
import searchReviewsListMiddleware from "@/middleware/searchReviewsList";
import searchVotesListMiddleware from "@/middleware/searchVotesList";
import userMiddleware from "@/middleware/user";
import reviewsAccusesListMiddleware from "@/middleware/reviewsAccusesList";
import companyOffMiddleware from "@/middleware/companyOff";
import logMiddleware from "@/middleware/log";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      // 登入首頁、內頁架構
      path: "/",
      name: "Home",
      component: Home,
      props: true,
      children: [
        {
          // 評論審核
          path: "/review_list",
          name: "ReviewList",
          component: ReviewList,
          props: route => ({
            page: route.query.page
          }),
          meta: {
            middleware: [commonMiddleware, reviewsListMiddleware]
          }
        },
        {
          // 投票審核
          path: "/review_vote",
          name: "ReviewVote",
          component: ReviewVote,
          meta: {
            middleware: [commonMiddleware, votesListMiddleware]
          }
        },
        {
          // 投票審核內容
          path: "/vote_detail/:voteId",
          name: "VoteDetail",
          component: VoteDetail,
          meta: {
            middleware: [commonMiddleware]
          }
        },
        {
          // 申訴審核
          path: "/review_complain",
          name: "ReviewComplain",
          component: ReviewComplain,
          meta: {
            middleware: [commonMiddleware, reviewsAccusesListMiddleware]
          }
        },
        {
          // 申訴審核內容
          path: "/review_complain/:complainId",
          name: "ReviewComplainDetail",
          component: ReviewComplainDetail,
          meta: {
            middleware: [commonMiddleware]
          }
        },
        {
          // 評論審核內容
          path: "/review_detail/:reviewId",
          name: "ReviewDetail",
          component: ReviewDetail,
          meta: {
            middleware: [commonMiddleware]
          }
        },
        {
          // 評論查詢
          path: "/search_review",
          name: "SearchReview",
          component: SearchReview,
          meta: {
            middleware: [commonMiddleware, searchReviewsListMiddleware]
          }
        },
        {
          // 投票查詢
          path: "/search_vote",
          name: "SearchVote",
          component: SearchVote,
          meta: {
            middleware: [commonMiddleware, searchVotesListMiddleware]
          }
        },
        {
          // 公司下架
          path: "/company_off",
          name: "CompanyOff",
          component: CompanyOff,
          meta: {
            middleware: [commonMiddleware, companyOffMiddleware]
          }
        },
        {
          // 審核紀錄
          path: "/log",
          name: "Log",
          component: Log,
          meta: {
            middleware: [commonMiddleware, logMiddleware]
          }
        },
        {
          // 帳號權限
          path: "/account",
          name: "Account",
          component: Account,
          meta: {
            middleware: [commonMiddleware, userMiddleware]
          }
        },
        {
          // 新增帳號
          path: "/creat_account",
          name: "CreatAccount",
          component: CreatAccount,
          meta: {
            middleware: [commonMiddleware]
          }
        },
        {
          // 編輯帳號
          path: "/edit_account",
          name: "EditAccount",
          component: EditAccount,
          meta: {
            middleware: [commonMiddleware]
          }
        }
      ],
      meta: {
        middleware: [commonMiddleware]
      }
    },
    {
      // 404頁
      path: "/error/404",
      name: "Page404",
      component: Page404
    },
    {
      // 500頁
      path: "/error/500",
      name: "Page500",
      component: Page500
    },
    { path: "/*", redirect: "/error/404" }
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
