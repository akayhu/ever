import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useAccountStore } from "@/storesPinia/account.js";

const accountListMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const { getAccountList } = useAccountStore();
  const { user } = storeToRefs(userStore);
  const userLogin = user.value.type;
  const query = {
    size: 20,
    page: to.query.page || 1,
    order: to.query.order || "desc"
  };

  if (userLogin === 2) {
    getAccountList(query);
    return done();
  } else {
    return next("/");
  }
};

export default accountListMiddleware;
