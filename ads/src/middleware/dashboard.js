import store from "@/store";

const dashboardMiddleware = ({ next, done }) => {
  const userData = store.getters["user/getUserStatus"];
  const userRole = userData.role;
  const conscriptArr = [11, 13, 14];

  if (conscriptArr.includes(userRole)) {
    return done();
  } else {
    // 若非整召業務、整召營運、整召主管，則無法進 Dashboard，回行事曆
    return next("/calendar");
  }
};

export default dashboardMiddleware;
