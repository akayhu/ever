import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useAccountStore } from "@/storesPinia/account.js";

const accountAddMiddleware = ({ next, done }) => {
  const userStore = useUserStore();
  const { clearAccount } = useAccountStore();
  const { user } = storeToRefs(userStore);
  const userLogin = user.value.type;

  if (userLogin === 2) {
    clearAccount();
    return done();
  } else {
    return next("/");
  }
};

export default accountAddMiddleware;
