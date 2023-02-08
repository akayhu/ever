import axios from "axios";
import { VM } from "@/main";
import { MUTATIONS_TYPE as ROOT_MUTATIONS_TYPE } from "@/store/index";
import { EventBus } from "@/utils/eventBus.js";
import { rollbarError } from "@/utils/rollbar.js";

import {
  tip,
  toLogout,
  toPage403,
  toPage404,
  toPage500,
  toPage503
} from "./utils";

let actionName = "";

/**
 * 請求失敗的統一處理
 * @param {*} status
 * @param {*} message
 */
const errorHandle = (status, message, response) => {
  switch (status) {
    // 400: 輸入值有誤
    case 400:
      const warningMessage =
        `400 ${response.data?.warning.desc}` || "400 必填欄位未填或其他錯誤";

      rollbarError(response, actionName, warningMessage);
      EventBus.$emit("openErrorDialog", response);
      break;

    // 401: backend session 過期
    case 401:
      rollbarError(response, actionName, "401 token 錯誤或 session 過期");
      toLogout();
      break;

    // 403: 權限不足
    case 403:
      rollbarError(response, actionName, "403 權限不足");
      toPage403();
      break;

    // 404: 請求失敗
    case 404:
      rollbarError(response, actionName, "404 請求失敗");
      toPage404();
      break;

    // 500: 伺服器異常
    case 500:
      rollbarError(response, actionName, "500 伺服器異常");
      toPage500();
      break;

    // 502 503: 封站
    case 502:
    case 503:
      rollbarError(response, actionName, "502 503 封站中");
      toPage503();
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
  timeout: 20000
});

/**
 * request 攔截器
 */
instance.interceptors.request.use(
  config => {
    // 在發送請求之前做某些事
    !VM ||
      VM.$store.commit(ROOT_MUTATIONS_TYPE.UPDATE_LAST_API_LIST, {
        type: "update",
        param: {
          name:
            config.baseURL.replace(/\//, "") +
            "/" +
            config.url.replace(/^\//, ""),
          method: config.method
        }
      });
    return config;
  },
  error => {
    // 請求錯誤時做些事
    console.log("error", error);
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
      console.error("error", error);
      errorHandle(response.status, response.data.error, response);
      return Promise.reject(error);
    }

    // 如果是網路斷線
    if (!window.navigator.onLine) {
      tip("網路出了點問題，請重新連線後重整網頁");
      return;
    }

    // 其他錯誤直接噴錯導500頁
    console.error(error);
    rollbarError(response, actionName, "500 伺服器異常");
    toPage500();
    return Promise.reject(error);
  }
);

/**
 * 封裝請求
 * @param {*} method
 * @param {*} url
 * @param {*} data
 * @param {*} apiActionName
 */
export default function(method, url, data = null, apiActionName = null) {
  actionName = apiActionName;
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
