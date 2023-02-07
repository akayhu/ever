import axios from "axios";
import { tip, toLogin, toPage404, toPage500 } from "./utils";
import store from "@/store";

/**
 * 請求失敗的統一處理
 * @param {*} status
 * @param {*} message
 */
const errorHandle = (status, message, url) => {
  switch (status) {
    // 400: 登入失敗，或其他錯誤
    case 400:
      if (url.indexOf("/api/admin/companies/") !== -1) {
        // 公司下架查詢公司查不到(亂輸入)
        store.dispatch("company/setUndefinedCompany");
      } else {
        tip(message);
      }
      break;

    // 401: backend session 過期 => 移到 checkLogin 去判斷
    case 401:
      tip("登入過期，請重新登入");
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;

    // 403 請求失敗
    case 403:
      tip("權限不足");
      break;

    // 404 請求失敗
    case 404:
      if (url.indexOf("/api/admin/companies/") !== -1) {
        // 公司下架查詢公司查不到
        store.dispatch("company/setUndefinedCompany");
      } else {
        toPage404();
      }
      break;

    // 500 伺服器異常
    case 500:
      if (url.indexOf("/api/admin/companies/") !== -1) {
        // 公司下架查詢公司查不到
        store.dispatch("company/setUndefinedCompany");
      } else {
        toPage500();
      }
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
      ? "/api/admin"
      : `https:${process.env.VUE_APP_API_DOMAIN_URL}api/admin`,
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
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * response 攔截器
 */
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 成功發出請求且收到 response，但有 error
    const { response } = error;

    if (response) {
      errorHandle(response.status, response.data.error, response.config.url);
      return Promise.reject(error);
    }

    // 成功發出請求但沒收到 response
    if (!window.navigator.onLine) {
      // 如果是網路斷線
      tip("網路出了點問題，請重新連線後重整網頁");
      return;
    }

    // 可能是跨網域，或是程式問題
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
    case "patch":
      return instance.patch(url, data);
    default:
      console.log(`未知的 method: ${method}`);
      return false;
  }
}
