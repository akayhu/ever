import { encodeHandler } from "@/utils/keywordEncode";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useProductStore } from "@/storesPinia/product.js";

const productListMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const productStore = useProductStore();
  const { user } = storeToRefs(userStore);
  const { getProductList } = productStore;
  const userLogin = user.value.type;
  const query = {
    size: 20,
    page: to.query.page || 1,
    sort: to.query.sort || "status_desc",
    status: Boolean(to.query.status) || "",
    keyword: to.query.keyword ? encodeHandler(to.query.keyword) : "",
    type: to.query.type || 1
  };

  if (!query.status) delete query.status;

  if (userLogin === 2) {
    getProductList(query);
    return done();
  } else {
    return next("/");
  }
};

export default productListMiddleware;
