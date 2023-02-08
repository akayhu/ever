import store from "@/store";

const calendarMiddleware = async ({ to, next, done }) => {
  const userLogin = store.getters["user/getUserStatus"].type;
  const orderPcData = store.getters["order/GET_CURRENT_DATA"].pc.content;
  const queries = {
    reserve: to.query.reserve || "sales",
    device: to.query.device || "pc"
  };
  store.commit("calendar/changeReserveType", queries.reserve);
  store.commit("calendar/changeDevice", queries.device);
  if (userLogin === 2) {
    if (orderPcData.length < 1) {
      await store.dispatch("order/addDevice", queries.device);
    } else {
      store.dispatch(`calendar/insertMonthData`, {
        pageIndex: 0,
        openFirst: true
      });
    }
    return done();
  } else {
    return next("/");
  }
};

export default calendarMiddleware;
