import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useAccountStore } from "@/storesPinia/account.js";

const accountEditMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { getAccountId } = useAccountStore();
  const userLogin = user.value.type;

  if (userLogin === 2) {
    getAccountId(to.query).then(() => {
      return done();
    });
  } else {
    return next("/");
  }
};

export default accountEditMiddleware;
