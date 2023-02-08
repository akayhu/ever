// 角色權限 role
// 11:Salesperson(整召業務), 13:Operator(整召營運), 14:Manager(整召主管)
// 三種身分的登入後首頁為 Dashboard，其餘身分的登入後首頁維持為行事曆
import store from "@/store";
import { useAuthorityInventoryStore } from "@/stores/authorityInventory.js";
import { getToday } from "@/utils/dateFormat";
import moment from "moment";

const authorityInventoryMiddleware = ({ next, done }) => {
  const userData = store.getters["user/getUserStatus"];
  const userRole = userData.role;
  const conscriptArr = [11, 13, 14];
  const authorityInventoryStore = useAuthorityInventoryStore();
  const {
    getInventoryLatestInventoryDate,
    getInventoryId
  } = authorityInventoryStore;
  const today = getToday("/");

  Promise.all([
    getInventoryId({ id: userData.accountId }),
    getInventoryLatestInventoryDate()
  ]).then(res => {
    const requirementLogDate = res[0].requirementLogDate;
    const beforeIntervalDay = moment(res[1].startDate, "YYYY/MM/DD")
      .subtract(1, "days")
      .format("YYYY/MM/DD");
    const afterIntervalDay = moment(res[1].endDate, "YYYY/MM/DD")
      .add(1, "days")
      .format("YYYY/MM/DD");

    if (
      !requirementLogDate &&
      moment(today).isBetween(beforeIntervalDay, afterIntervalDay)
    ) {
      return done();
    } else {
      // 若身份為整召業務、整召營運、整召主管，登入後首頁為 dashboard
      // 若其他身份，首頁為登入後首頁
      return conscriptArr.includes(userRole)
        ? next("/dashboard")
        : next("/calendar");
    }
  });
};

export default authorityInventoryMiddleware;
