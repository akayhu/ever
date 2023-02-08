import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useSiteStore } from "@/storesPinia/site.js";
import { useChannelStore } from "@/storesPinia/channel.js";

const cheenlEditMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const siteStore = useSiteStore();
  const channelStore = useChannelStore();
  const { user } = storeToRefs(userStore);
  const { getSiteId } = siteStore;
  const { getChannelId } = channelStore;
  const userLogin = user.value.type;

  if (userLogin === 2) {
    Promise.all([getSiteId(to.query), getChannelId(to.query)]).then(() => {
      return done();
    });
  } else {
    return next("/");
  }
};

export default cheenlEditMiddleware;
