import store from "@/store";

const cushionMiddleware = async ({ next, done }) => {
  const userLogin = store.getters["user/getUserStatus"].type;
  const orderPcData = store.getters["order/GET_CURRENT_DATA"].pc.content;

  if (userLogin === 2) {
    if (orderPcData.length < 1) {
      await store.dispatch("order/addDevice", "pc");
    }
    return done();
  } else {
    return next("/");
  }
};

export default cushionMiddleware;
