import store from "@/store";

const addProjectMiddleware = ({ to, next, done }) => {
  const userLogin = store.getters["user/getUserStatus"].type;

  if (userLogin === 2) {
    store.dispatch("project/clearProjectId", to.query);
    return done();
  } else {
    return next("/");
  }
};

export default addProjectMiddleware;
