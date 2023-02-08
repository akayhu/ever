// 角色權限 role Middleware
// 1:系統管理者(super-user)
// 11:Salesperson(整召業務銷售人員), 12:Planner(整召營運企劃), 13:Operator(整召營運同仁), 14:Manager(整召主管)
// 21:JB-VM(產品管理VM), 22:JB-MGR(產品主管), 23:JB-PM(產品管理企劃)
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";

const roleMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const userRole = user.value.role;
  const conscriptArr = [11, 12, 13, 14];
  // JB-VM
  const jbvmCantToPath = [
    "/userinfo", // 使用者資料維護
    "/useradd", // 使用者資料新增帳號
    "/useredit", // 使用者資料編輯帳號
    "/userlog", // 使用者行為記錄
    "/channeladd", // 新增頻道
    "/banneradd", // 新增版位
    "/webedit", // 編輯網站
    "/channeledit", // 編輯頻道
    "/banneredit" // 編輯版位
  ];
  // JB-MGR
  const jbmgrCantToPath = [
    "/userinfo", // 使用者資料維護
    "/useradd", // 使用者資料新增帳號
    "/useredit", // 使用者資料編輯帳號
    "/userlog", // 使用者行為記錄
    "/channeladd", // 新增頻道
    "/banneradd", // 新增版位
    "/webedit", // 編輯網站
    "/channeledit", // 編輯頻道
    "/banneredit", // 編輯版位
    "/productadd", // 新增商品與版位關聯維護
    "/productedit", // 編輯商品與版位關聯
    "/conditionadd" // 新增條件設定
  ];
  // JB-PM
  const jbpmCantToPath = [
    "/userinfo", // 使用者資料維護
    "/useradd", // 使用者資料新增帳號
    "/useredit", // 使用者資料編輯帳號
    "/userlog", // 使用者行為記錄
    "/product", // 廣告與商品設定
    "/productadd", // 新增商品與版位關聯維護
    "/productedit" // 編輯商品與版位關聯
  ];

  // type = 1 無申請權限; 整召都無權限
  if (user.value.type === 1 || conscriptArr.indexOf(userRole) !== -1) {
    return next("/error/403");
  }
  // 產品 VM 權限，預防直衝編輯頁
  else if (userRole === 21 && jbvmCantToPath.indexOf(to.path) !== -1) {
    return next("/error/403");
  }
  // 產品主管權限，預防直衝編輯頁
  else if (userRole === 22 && jbmgrCantToPath.indexOf(to.path) !== -1) {
    return next("/error/403");
  }
  // 產品 PM 權限，預防直衝編輯頁
  else if (userRole === 23 && jbpmCantToPath.indexOf(to.path) !== -1) {
    return next("/error/403");
  }
  // PM 都有權限或其他
  else {
    return done();
  }
};

export default roleMiddleware;
