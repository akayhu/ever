import { ElMessage } from "element-plus";
import router from "@/router/index";
import { logout } from "@/apis/user";

/**
 * 錯誤 message 消息提示函數
 * @param {*} message
 */
//
export const tip = message => {
  ElMessage.error(message);
};

/**
 * 401 跳轉回首頁
 */
export const toLogout = () => {
  logout();
};

/**
 * 跳轉到 403 error page
 * 權限不足
 */
export const toPage403 = () => {
  router.replace({
    name: "Page403"
  });
};

/**
 * 跳轉到 404 error page
 * 找不到任何頁面
 */
export const toPage404 = () => {
  router.replace({
    name: "Page404"
  });
};

/**
 * 跳轉到 500 error page
 * 伺服器異常
 */
export const toPage500 = () => {
  router.replace({
    name: "Page500"
  });
};

/**
 * 跳轉到 503 error page
 * 封站
 */
export const toPage503 = () => {
  router.replace({
    name: "Page503"
  });
};
