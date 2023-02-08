import store from "@/store";

const pjmanageListMiddleware = ({ next, done }) => {
  const userLogin = store.getters["user/getUserStatus"].type;

  if (userLogin === 2) {
    store.dispatch("project/clearProjectList");
    return done();
  } else {
    return next("/");
  }
};

export default pjmanageListMiddleware;
