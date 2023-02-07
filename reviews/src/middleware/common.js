import router from "@/layouts/defaultLayout";

const commonMiddleware = ({ to, next, store }) => {
  // 封站入口
  if (
    window.reviewsAnnouncement &&
    window.reviewsAnnouncement.openAnnouncement
  ) {
    store.dispatch("ui/changeSealingStation");
    router.push({ path: "/sealingStation" }).catch(() => {});
  } else {
    store.dispatch("ui/changeNowRouterPath", to.path);
    store.dispatch("ui/changeNowRouterHistoryName", to.name);
    store.dispatch("user/getUserLoginStatus");
    return next();
  }
};

export default commonMiddleware;
