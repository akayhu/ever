import axios from "axios";
import { tip, toLogin, toPage404, toPage500 } from "./utils";
import store from "@/store";
import router from "@/layouts/defaultLayout";

/**
 * 請求失敗的統一處理
 * @param {*} status
 * @param {*} message
 */
const errorHandle = (status, message, url, method) => {
  switch (status) {
    // 400: 輸入值有誤
    case 400:
      if (url.indexOf("/api/votes") !== -1) {
        // 投票已登入但無權限投票
        store.dispatch("company/changeOpenVoteLightbox");
      } else {
        tip(message);
        toPage404();
      }
      break;

    // 401: backend session 過期 => 移到 checkLogin 去判斷
    case 401:
      if (url.indexOf("/api/votes") !== -1 && method === "put") {
        // 投票未登入，打開 lightbox
        store.dispatch("company/changeOpenVoteLoginLightbox");
      } else {
        // tip(message);
        toLogin(`${window.location.pathname}`);
      }
      break;

    // 403: 請求失敗
    case 403:
      tip(message);
      break;

    // 404: 請求失敗
    case 404:
      if (url.indexOf("/api/companies") !== -1 && url.indexOf("/info") !== -1) {
        // 公司專頁，只要是 404 都導到還在搜集分數頁
        router.replace({
          name: "serachPrivate"
        });
      } else {
        toPage404();
      }
      break;

    // 500: 伺服器異常
    case 500:
      // 未登入點投票
      if (url.indexOf("/api/votes") !== -1) {
        store.dispatch("votes/changeOpenVoteLightbox");
        return;
      }

      // 工作機會 too many requests 機制，送空內容不導 error 500 頁
      if (url.match("/jobs") !== null) {
        store.dispatch("company/emptyDataCompanyJobs");
        return;
      }

      toPage500();
      break;

    // 503: 封站
    case 503:
      store.dispatch("ui/changeSealingStation");
      break;

    default:
      console.log(`response 沒有攔截到的錯誤：${message}}`);
  }
};

/**
 * axios 的實例
 */
const instance = axios.create({
  baseURL:
    process.env.VUE_APP_ENV === "development"
      ? "/api"
      : `https:${process.env.VUE_APP_API_DOMAIN_URL}api`,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true,
  crossDomain: true,
  timeout: 10000
});

/**
 * request 攔截器
 */
instance.interceptors.request.use(
  config => {
    // 在發送請求之前做某些事
    return config;
  },
  error => {
    // 請求錯誤時做些事
    return Promise.reject(error);
  }
);

/**
 * response 攔截器
 */
instance.interceptors.response.use(
  response => {
    // 對數據做些事
    return response;
  },
  error => {
    // 請求錯誤做些事
    const { response } = error;

    // 成功發出請求且收到 response，但有 error
    if (response) {
      errorHandle(
        response.status,
        response.data.error,
        response.config.url,
        response.config.method
      );
      return Promise.reject(error);
    }

    // 如果是網路斷線
    if (!window.navigator.onLine) {
      tip("網路出了點問題，請重新連線後重整網頁");
      return;
    }

    // 工作機會 timeout 機制，送空內容不導頁
    if (
      error.message === "timeout of 10000ms exceeded" &&
      error.config.url.match("/jobs") !== null
    ) {
      store.dispatch("company/emptyDataCompanyJobs");
      return;
    }

    // 可能是跨網域，或是程式問題，一律導封站
    store.dispatch("ui/changeSealingStation");
    return Promise.reject(error);
  }
);

/**
 * 封裝請求
 * @param {*} method
 * @param {*} url
 * @param {*} data
 */
export default function(method, url, data = null) {
  method = method.toLowerCase();
  switch (method) {
    case "post":
      return instance.post(url, data);
    case "get":
      return instance.get(url, { params: data });
    case "delete":
      return instance.delete(url, { params: data });
    case "put":
      return instance.put(url, data);
    default:
      console.log(`未知的 method: ${method}`);
      return false;
  }
}
