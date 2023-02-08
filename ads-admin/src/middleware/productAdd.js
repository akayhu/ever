import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useProductStore } from "@/storesPinia/product.js";

const productAddMiddleware = ({ next, done }) => {
  const userStore = useUserStore();
  const productStore = useProductStore();
  const { user } = storeToRefs(userStore);
  const { clearProductId } = productStore;
  const userLogin = user.value.type;

  if (userLogin === 2) {
    clearProductId();
    return done();
  } else {
    return next("/");
  }
};

export default productAddMiddleware;
