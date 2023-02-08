import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useSiteStore } from "@/storesPinia/site.js";

const siteEditMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const siteStore = useSiteStore();
  const { user } = storeToRefs(userStore);
  const { getSiteId } = siteStore;
  const userLogin = user.value.type;

  if (userLogin === 2) {
    getSiteId(to.query).then(() => {
      return done();
    });
  } else {
    return next("/");
  }
};

export default siteEditMiddleware;
