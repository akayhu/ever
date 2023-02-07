import { login } from "@/apis/user";

const loginStatusMiddleware = ({ to, from, next, store }) => {
  const currentLoginStatus = store.getters["user/userLoginStatus"];
  if (currentLoginStatus === 2) return next();
  store.dispatch("user/getUserLoginStatus").then(loginStatus => {
    loginRedirect(loginStatus, to, from, next);
  });
};

const loginRedirect = (loginStatus, to, from, next) => {
  switch (loginStatus) {
    case 0:
      return next(`${to.path}/login`);
    case 1:
      return login(to.path);
    case 2:
      return next();
    default:
      return next("/error/404");
  }
};

export default loginStatusMiddleware;
