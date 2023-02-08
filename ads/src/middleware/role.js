// 角色權限 role Middleware
// 1:系統管理者(super-user)
// 11:Salesperson(整召業務), 12:Planner(整召企劃), 13:Operator(整召營運), 14:Manager(整召主管)
// 21:JB-VM(產品VM), 22:JB-MGR(產品主管), 23:JB-PM(產品PM)
import store from "@/store";
import { rollbarError } from "@/utils/rollbar.js";

const roleMiddleware = ({ to, next, done }) => {
  const userData = store.getters["user/getUserStatus"];
  const userRole = userData.role;
  const conscriptArr = [11, 12, 13, 14];
  const conscriptCantToPath = ["/cushion"];
  const conscriptPlanningCantToPath = ["/pjmanage", "/newpj", "/editpj"];
  const jbpmCantToPath = ["/report"];
  const resData = {
    data: "",
    config: {
      url: "/internal/auth/status",
      data: ""
    }
  };

  // 整召都無權限進墊檔廣告
  if (
    conscriptArr.indexOf(userRole) !== -1 &&
    conscriptCantToPath.indexOf(to.path) !== -1
  ) {
    rollbarError(resData, "getAuthStatus", "403 權限不足");
    return next("/error/403");
  }
  // 整召企劃無權限進專案及版位維護
  else if (
    userRole === 12 &&
    conscriptPlanningCantToPath.indexOf(to.path) !== -1
  ) {
    rollbarError(resData, "getAuthStatus", "403 權限不足");
    return next("/error/403");
  }
  // JB-PM 無權限進企業結案報告
  else if (userRole === 23 && jbpmCantToPath.indexOf(to.path) !== -1) {
    rollbarError(resData, "getAuthStatus", "403 權限不足");
    return next("/error/403");
  }
  // 都有權限
  else {
    return done();
  }
};

export default roleMiddleware;
