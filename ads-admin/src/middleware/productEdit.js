import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useProductStore } from "@/storesPinia/product.js";

const productEditMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const productStore = useProductStore();
  const { user } = storeToRefs(userStore);
  const { getProductId } = productStore;
  const userLogin = user.value.type;

  if (userLogin === 2) {
    // 單筆商品資訊
    if (to.query.productId) {
      getProductId(to.query).then(() => {
        return done();
      });
    } else {
      return done();
    }
  } else {
    return next("/");
  }
};

export default productEditMiddleware;
