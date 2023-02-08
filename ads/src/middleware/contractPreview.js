import store from "@/store";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import localStorageService from "@/utils/localStorageData";

const contractPreviewMiddleware = async ({ to, next, done }) => {
  const userLogin = store.getters["user/getUserStatus"].type;
  if (userLogin === 2) {
    const salesOrderStore = useSalesOrderStore();
    const { getQuotationId } = salesOrderStore;
    const id = to.params.contractId;

    try {
      salesOrderStore.quotationData = localStorageService.handleLocalStorage(
        "getItem",
        "quotation"
      );
      if (
        salesOrderStore.quotationData === null ||
        id != salesOrderStore.quotationData.id
      ) {
        await getQuotationId({ id });
      }
    } catch (err) {
      console.log("err", err);
      return next("/");
    }
    return done();
  } else {
    return next("/");
  }
};

export default contractPreviewMiddleware;
