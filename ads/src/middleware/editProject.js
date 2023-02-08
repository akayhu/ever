import store from "@/store";

const editProjectMiddleware = ({ to, next, done }) => {
  const userLogin = store.getters["user/getUserStatus"].type;

  const reservationQuery = {
    page: to.query.page || 1,
    size: 20,
    projectId: "",
    type: 1
  };

  if (userLogin === 2) {
    store.dispatch("project/getProjectId", to.query).then(projectRes => {
      reservationQuery.projectId = projectRes.projectId;

      // 先清空列表，避免切頁再切回來資料還在
      store.dispatch("reservation/resetReservation");

      // 檔期正取
      store.dispatch("reservation/getReservation", reservationQuery);

      // 檔期備取
      store.dispatch("reservation/getReservation", {
        ...reservationQuery,
        type: 0
      });

      return done();
    });
  } else {
    return next("/");
  }
};

export default editProjectMiddleware;
