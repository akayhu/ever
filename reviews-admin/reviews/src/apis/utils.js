import { Message } from "element-ui";
import router from "@/layouts/defaultLayout";
import { login } from "@/apis/user";

/**
 * 錯誤 message 消息提示函數
 * @param {*} message
 */
//
export const tip = message => {
  Message.error(message);
};

/**
 * 跳轉回首頁
 * 攜帶當前的頁面路由，登入完成後跳轉回原本頁面
 */
export const toLogin = path => {
  login(path);
};

/**
 * 跳轉到 404 error page
 * 攜帶當前的頁面路由，點擊連結後跳轉回原本的頁面
 */
export const toPage404 = () => {
  router.replace({
    name: "page404"
  });
};

/**
 * 跳轉到 500 error page
 */
export const toPage500 = () => {
  router.replace({
    name: "page500"
  });
};
