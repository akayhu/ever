import { createRouter, createWebHistory } from "vue-router";

// views
import Home from "@/views/Home.vue";
import LoginHome from "@/views/LoginHome.vue";
import UserInfo from "@/views/UserInfo.vue";
import UserEdit from "@/views/UserEdit.vue";
import UserLog from "@/views/UserLog.vue";
import WebList from "@/views/WebList.vue";
import WebPageEdit from "@/views/WebPageEdit.vue";
import WebADEdit from "@/views/WebADEdit.vue";
import Product from "@/views/Product.vue";
import ProductEdit from "@/views/ProductEdit.vue";
import Authority from "@/views/Authority.vue";
import SetConditions from "@/views/SetConditions.vue";
import ConditionEdit from "@/views/ConditionEdit.vue";
import AuthorityInventory from "@/views/AuthorityInventory.vue";
import Tools from "@/views/Tools.vue";
import Page403 from "@/views/Page403.vue";
import Page404 from "@/views/Page404.vue";
import Page500 from "@/views/Page500.vue";
import Page503 from "@/views/Page503.vue";
// Middleware
import pipelineMiddleware from "@/middleware/pipeline";
import commonMiddleware from "@/middleware/common";
import roleMiddleware from "@/middleware/role";
import accountAddMiddleware from "@/middleware/accountAdd";
import accountListMiddleware from "@/middleware/accountList";
import accountEditMiddleware from "@/middleware/accountEdit";
import siteListMiddleware from "@/middleware/siteList";
import siteEditMiddleware from "@/middleware/siteEdit";
import channelEditMiddleware from "@/middleware/channelEdit";
import boardAddMiddleware from "@/middleware/boardAdd";
import boardEditMiddleware from "@/middleware/boardEdit";
import userLogMiddleware from "@/middleware/userLog";
import productListMiddleware from "@/middleware/productList";
import productAddMiddleware from "@/middleware/productAdd";
import productEditMiddleware from "@/middleware/productEdit";

const routes = [
  {
    // 首頁
    path: "/",
    name: "Home",
    component: Home,
    props: true,
    children: [
      {
        // 登入後首頁
        path: "/loginhome",
        name: "LoginHome",
        component: LoginHome,
        meta: {
          middleware: [commonMiddleware, roleMiddleware]
        }
      },
      {
        // 使用者資料維護
        path: "/userinfo",
        name: "UserInfo",
        component: UserInfo,
        props: true,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, accountListMiddleware],
          activeHeader: "user_management"
        }
      },
      {
        // 使用者資料新增帳號
        path: "/useradd",
        name: "UserAdd",
        component: UserEdit,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, accountAddMiddleware],
          activeHeader: "user_management",
          activeNav: "userinfo"
        }
      },
      {
        // 使用者資料編輯帳號
        path: "/useredit",
        name: "UserEdit",
        component: UserEdit,
        props: true,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, accountEditMiddleware],
          activeHeader: "user_management",
          activeNav: "userinfo"
        }
      },
      {
        // 使用者行為記錄
        path: "/userlog",
        name: "UserLog",
        component: UserLog,
        props: true,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, userLogMiddleware],
          activeHeader: "user_management"
        }
      },
      {
        // 權限盤點
        path: "/authorityInventory",
        name: "AuthorityInventory",
        component: AuthorityInventory,
        props: true,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, userLogMiddleware],
          activeHeader: "user_management"
        }
      },
      {
        // 網站維護
        path: "/weblist",
        name: "WebList",
        component: WebList,
        props: true,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, siteListMiddleware],
          activeHeader: "ad_component_management"
        }
      },
      {
        // 新增網站
        path: "/webadd",
        name: "WebAdd",
        component: WebPageEdit,
        meta: {
          middleware: [commonMiddleware, roleMiddleware],
          activeHeader: "ad_component_management",
          activeNav: "weblist"
        }
      },
      {
        // 編輯網站
        path: "/webedit",
        name: "WebEdit",
        component: WebPageEdit,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, siteEditMiddleware],
          activeHeader: "ad_component_management",
          activeNav: "weblist"
        }
      },
      {
        // 新增頻道
        path: "/channeladd",
        name: "ChannelAdd",
        component: WebPageEdit,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, siteEditMiddleware],
          activeHeader: "ad_component_management",
          activeNav: "weblist"
        }
      },
      {
        // 編輯頻道
        path: "/channeledit",
        name: "ChannelEdit",
        component: WebADEdit,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, channelEditMiddleware],
          activeHeader: "ad_component_management",
          activeNav: "weblist"
        }
      },
      {
        // 新增版位
        path: "/banneradd",
        name: "BannerAdd",
        component: WebADEdit,
        meta: {
          middleware: [
            commonMiddleware,
            roleMiddleware,
            channelEditMiddleware,
            boardAddMiddleware
          ],
          activeHeader: "ad_component_management",
          activeNav: "weblist"
        }
      },
      {
        // 編輯版位
        path: "/banneredit",
        name: "BannerEdit",
        component: WebADEdit,
        meta: {
          middleware: [
            commonMiddleware,
            roleMiddleware,
            channelEditMiddleware,
            boardAddMiddleware,
            boardEditMiddleware
          ],
          activeHeader: "ad_component_management",
          activeNav: "weblist"
        }
      },
      {
        // 廣告與商品設定
        path: "/product",
        name: "Product",
        component: Product,
        props: true,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, productListMiddleware],
          activeHeader: "ad_component_management"
        }
      },
      {
        // 新增商品與版位關聯維護
        path: "/productadd",
        name: "ProductAdd",
        component: ProductEdit,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, productAddMiddleware],
          activeHeader: "ad_component_management",
          activeNav: "product"
        }
      },
      {
        // 編輯商品與版位關聯
        path: "/productedit",
        name: "ProductEdit",
        component: ProductEdit,
        props: true,
        meta: {
          middleware: [commonMiddleware, roleMiddleware, productEditMiddleware],
          activeHeader: "ad_component_management",
          activeNav: "product"
        }
      },
      {
        // 設定條件列表
        path: "/setconditions",
        name: "SetConditions",
        component: SetConditions,
        meta: {
          middleware: [commonMiddleware, roleMiddleware],
          activeHeader: "ad_component_management"
        }
      },
      {
        // 新增條件設定
        path: "/conditionadd",
        name: "ConditionAdd",
        component: ConditionEdit,
        meta: {
          middleware: [commonMiddleware, roleMiddleware],
          activeHeader: "ad_component_management",
          activeNav: "setconditions"
        }
      },
      {
        // 編輯條件設定
        path: "/conditionedit/:id",
        name: "ConditionEdit",
        component: ConditionEdit,
        meta: {
          middleware: [commonMiddleware, roleMiddleware],
          activeHeader: "ad_component_management",
          activeNav: "setconditions"
        }
      },
      {
        // 小工具
        path: "/tools",
        name: "Tools",
        component: Tools,
        meta: {
          middleware: [commonMiddleware, roleMiddleware],
          activeHeader: "tools_management"
        }
      }
    ],
    meta: {
      middleware: [commonMiddleware]
    }
  },
  {
    // 權限查詢表
    path: "/authority",
    name: "Authority",
    component: Authority
  },
  {
    // 401頁，目前無此頁導回首頁
    path: "/error/401",
    redirect: "/"
  },
  {
    // 403頁
    path: "/error/403",
    name: "Page403",
    component: Page403
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
  {
    // 503頁
    path: "/error/503",
    name: "Page503",
    component: Page503
  },
  { path: "/:pathMatch(.*)*", redirect: "/error/404" }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    };
  },
  linkActiveClass: "focus"
});

router.beforeEach((to, from, next) => {
  if (!to.meta?.middleware) return next();
  const middleware = to.meta.middleware;
  const context = { to, from, next };
  return middleware[0]({
    ...context,
    done: pipelineMiddleware(context, middleware, 1)
  });
});

export default router;
