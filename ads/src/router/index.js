import Vue from "vue";
import VueRouter from "vue-router";
// views
import Home from "@/views/Home.vue";
import Calendar from "@/views/Calendar.vue";
import Pjmanage from "@/views/Pjmanage.vue";
import Newpj from "@/views/Newpj.vue";
import Material from "@/views/Material.vue";
import Proofs from "@/views/Proofs.vue";
import Cushion from "@/views/Cushion.vue";
import Maintain from "@/views/Maintain.vue";
import CloseReport from "@/views/reportQuery/closeReport/CloseReport.vue";
import Leaderboard from "@/views/reportQuery/leaderBoard/LeaderBoard.vue";
import ProofsReport from "@/views/reportQuery/proofs/ProofsReport.vue";
import Authority from "@/views/Authority.vue";
import SalesOrderList from "@/views/SalesOrderList.vue";
import SalesOrder from "@/views/SalesOrder.vue";
import InternalOrderList from "@/views/InternalOrderList.vue";
import InternalOrder from "@/views/InternalOrder.vue";
import ReservePrice from "@/views/ReservePrice.vue";
import CueManagement from "@/views/CueManagement.vue";
import CueReview from "@/views/CueReview.vue";
import SmallTools from "@/views/SmallTools.vue";
import Page403 from "@/views/Page403.vue";
import Page404 from "@/views/Page404.vue";
import Page500 from "@/views/Page500.vue";
import Page503 from "@/views/Page503.vue";
import Preview from "@/views/Preview.vue";
import SignOffProcess from "@/views/SignOffProcess.vue";
import ProductPromoHistory from "@/views/ProductPromoHistory.vue";
import Dashboard from "@/views/Dashboard.vue";
import DownloadReport from "@/views/reportQuery/downloadReport/DownloadReport.vue";
import ContractPreview from "@/views/ContractPreview.vue";
import ReservePricePreview from "@/views/ReservePricePreview.vue";
import ReservePriceApproval from "@/views/ReservePriceApproval.vue";
import AuthorityInventory from "@/views/AuthorityInventory.vue";
// Middleware
import pipelineMiddleware from "@/middleware/pipeline";
import commonMiddleware from "@/middleware/common";
import pjmanageListMiddleware from "@/middleware/pjmanageList";
import addProjectMiddleware from "@/middleware/addProject";
import editProjectMiddleware from "@/middleware/editProject";
import roleMiddleware from "@/middleware/role";
import calendarMiddleware from "@/middleware/calendar";
import cushionMiddleware from "@/middleware/cushion";
import dashboardMiddleware from "@/middleware/dashboard";
import editSalesOrderMiddleware from "@/middleware/editSalesOrder";
import contractPreviewMiddleware from "@/middleware/contractPreview";
import internalOrderMiddleware from "@/middleware/internalOrder";
import salesOrderListMiddleware from "@/middleware/salesOrderList";
import authorityInventoryMiddleware from "@/middleware/authorityInventory";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    props: true,
    component: Home,
    children: [
      {
        // ????????????????????????
        path: "/calendar",
        name: "Calendar",
        component: Calendar,
        meta: {
          middleware: [commonMiddleware, calendarMiddleware],
          activeHeader: "ad_appointment_management"
        }
      },
      {
        // ?????????????????????
        path: "/pjmanage",
        name: "Pjmanage",
        component: Pjmanage,
        props: route => ({
          page: route.query.page,
          condition: route.query.condition,
          end: route.query.end,
          start: route.query.start
        }),
        meta: {
          middleware: [
            commonMiddleware,
            roleMiddleware,
            pjmanageListMiddleware
          ],
          activeHeader: "ad_appointment_management"
        }
      },
      {
        // ??????????????????
        path: "/newpj",
        name: "Newpj",
        component: Newpj,
        props: route => ({
          projectId: route.query.projectId,
          page: route.query.page
        }),
        meta: {
          middleware: [commonMiddleware, roleMiddleware, addProjectMiddleware],
          activeHeader: "ad_appointment_management",
          activeNav: "pjmanage"
        }
      },
      {
        // ??????????????????
        path: "/editpj",
        name: "Editpj",
        component: Newpj,
        props: route => ({
          projectId: route.query.projectId,
          page: route.query.page
        }),
        meta: {
          middleware: [commonMiddleware, roleMiddleware, editProjectMiddleware],
          activeHeader: "ad_appointment_management",
          activeNav: "pjmanage"
        }
      },
      {
        // ????????????
        path: "/material",
        name: "Material",
        component: Material,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "ad_management"
        }
      },
      {
        // ????????????
        path: "/proofs",
        name: "Proofs",
        component: Proofs,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "ad_management"
        }
      },
      {
        // ????????????
        path: "/cushion",
        name: "Cushion",
        component: Cushion,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, cushionMiddleware],
          activeHeader: "ad_management"
        }
      },
      {
        // ??????????????????
        path: "/maintain_new",
        name: "MaintainNew",
        redirect: { name: "Maintain" }
      },
      {
        // ?????????????????? - ??????
        path: "/maintain",
        name: "Maintain",
        component: Maintain,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "report_query"
        }
      },
      {
        // ??????????????????
        path: "/report",
        name: "Report",
        component: CloseReport,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "report_query"
        }
      },
      {
        // ???????????????
        path: "/leaderboard",
        name: "Leaderboard",
        component: Leaderboard,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "report_query"
        }
      },
      {
        // ????????????
        path: "/proofsReport",
        name: "ProofsReport",
        component: ProofsReport,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "report_query"
        }
      },
      {
        // ????????????
        path: "/downloadReport",
        name: "DownloadReport",
        component: DownloadReport,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "report_query"
        }
      },
      {
        // ???????????????
        path: "preview",
        name: "Preview",
        component: Preview,
        meta: {
          middleware: [commonMiddleware]
        }
      },
      {
        // ???????????????
        path: "/salesOrderList",
        name: "SalesOrderList",
        component: SalesOrderList,
        meta: {
          middleware: [commonMiddleware, salesOrderListMiddleware],
          activeHeader: "salesOrder_manage"
        }
      },
      {
        // ????????? - ??????
        path: "/salesOrder/createdSalesOrder",
        name: "CreatedSalesOrder",
        component: SalesOrder,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "salesOrderList"
        }
      },
      {
        // ????????? - ??????
        path: "/salesOrder/draftSalesOrder/:salesOrderId",
        name: "DraftSalesOrder",
        component: SalesOrder,
        meta: {
          middleware: [commonMiddleware, editSalesOrderMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "salesOrderList"
        }
      },
      {
        // ????????? - ??????
        path: "/salesOrder/editSalesOrder/:salesOrderId",
        name: "EditSalesOrder",
        component: SalesOrder,
        meta: {
          middleware: [commonMiddleware, editSalesOrderMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "salesOrderList"
        }
      },
      {
        // ????????? - ????????????
        path: "/salesOrder/generalViewSalesOrder/:salesOrderId",
        name: "GeneralViewSalesOrder",
        component: SalesOrder,
        meta: {
          middleware: [commonMiddleware, editSalesOrderMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "salesOrderList"
        }
      },
      {
        // ????????? - ????????????
        path: "/salesOrder/signOffViewSalesOrder/:salesOrderId",
        name: "SignOffViewSalesOrder",
        component: SalesOrder,
        meta: {
          middleware: [commonMiddleware, editSalesOrderMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "salesOrderList"
        }
      },
      {
        // ????????????
        path: "/signOffProcess/:id",
        name: "SignOffProcess",
        component: SignOffProcess,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "salesOrder_manage"
        }
      },
      {
        // ?????????
        path: "/internalOrder",
        name: "InternalOrderList",
        component: InternalOrderList,
        meta: {
          middleware: [commonMiddleware, salesOrderListMiddleware],
          activeHeader: "salesOrder_manage"
        }
      },
      {
        // ???????????????
        path: "/internalOrder/add",
        name: "CreateInternalOrder",
        component: InternalOrder,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "internalOrder"
        }
      },
      {
        // ???????????????
        path: "/internalOrder/edit/:id",
        name: "EditInternalOrder",
        component: InternalOrder,
        meta: {
          middleware: [commonMiddleware, internalOrderMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "internalOrder"
        }
      },
      {
        // ???????????????
        path: "/internalOrder/view/:id",
        name: "ViewInternalOrder",
        component: InternalOrder,
        meta: {
          middleware: [commonMiddleware, internalOrderMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "internalOrder"
        }
      },
      {
        // ????????????
        path: "/reservePrice",
        name: "ReservePrice",
        component: ReservePrice,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "salesOrder_manage",
          activeNav: "reservePrice"
        }
      },
      {
        // ??????????????????
        path: "/productPromoHistory/:id",
        name: "ProductPromoHistory",
        component: ProductPromoHistory,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "salesOrder_manage"
        }
      },
      {
        // cue???
        path: "/cueManagement/:salesOrderId?",
        name: "CueManagement",
        component: CueManagement,
        meta: {
          middleware: [commonMiddleware],
          activeHeader: "cue_management",
          activeNav: "cueManagement"
        }
      },
      {
        // ???????????????
        path: "/smallTools",
        name: "SmallTools",
        component: SmallTools,
        meta: {
          middleware: [commonMiddleware]
        }
      },
      {
        // dashboard
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: {
          middleware: [commonMiddleware, dashboardMiddleware]
        }
      }
    ],
    meta: {
      middleware: [commonMiddleware]
    }
  },
  {
    // cue?????????
    path: "/cuereview/:id",
    name: "CueReview",
    component: CueReview,
    meta: {
      middleware: [commonMiddleware],
      activeHeader: "cue_management",
      activeNav: "cueManagement"
    }
  },
  {
    // ????????????
    path: "/contractPreview/:contractId",
    name: "ContractPreview",
    component: ContractPreview,
    meta: {
      middleware: [commonMiddleware, contractPreviewMiddleware],
      hideHeader: true,
      hideFooter: true
    }
  },
  {
    // ??????_????????????
    path: "/reservePricePreview",
    name: "ReservePricePreview",
    component: ReservePricePreview,
    meta: {
      middleware: [commonMiddleware],
      activeHeader: "salesOrder_manage",
      activeNav: "reservePrice",
      hideHeader: true,
      hideFooter: true
    }
  },
  {
    // ??????????????????
    path: "/reservePriceApproval/:id",
    name: "ReservePriceApproval",
    component: ReservePriceApproval,
    meta: {
      middleware: [commonMiddleware],
      activeHeader: "salesOrder_manage",
      activeNav: "reservePrice"
    }
  },
  {
    // ??????????????????
    path: "/authorityInventory",
    name: "authorityInventory",
    component: AuthorityInventory,
    meta: {
      middleware: [commonMiddleware, authorityInventoryMiddleware]
    }
  },
  {
    // ???????????????
    path: "/authority",
    name: "Authority",
    component: Authority,
    meta: {
      hideFooter: true
    }
  },
  {
    // 401?????????????????????????????????
    path: "/error/401",
    redirect: "/"
  },
  {
    // 403???
    path: "/error/403",
    name: "Page403",
    component: Page403
  },
  {
    // 404???
    path: "/error/404",
    name: "Page404",
    component: Page404
  },
  {
    // 500???
    path: "/error/500",
    name: "Page500",
    component: Page500
  },
  {
    // ?????????
    path: "/error/503",
    name: "Page503",
    component: Page503
  },
  {
    // ????????????????????????404
    path: "*",
    redirect: {
      name: "Page404"
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) return savedPosition;
    return {
      x: 0,
      y: 0
    };
  },
  linkActiveClass: "focus"
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) return next();
  const middleware = to.meta.middleware;
  const context = { to, from, next };
  return middleware[0]({
    ...context,
    done: pipelineMiddleware(context, middleware, 1)
  });
});

export default router;
