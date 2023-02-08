// import useOrderStore from "@/stores/internalOrderStore";
import store from "@/store";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus";

const internalOrderMiddleware = async ({ to, next, done }) => {
  const userLogin = store.getters["user/getUserStatus"].type;
  const salesOrderStore = useSalesOrderStore();
  salesOrderStore.$reset();
  const { canEdit } = useFormStatus();

  const id = parseInt(to.params.id);

  if (userLogin === 2) {
    await salesOrderStore.getQuotationId({ id });

    try {
      if (!canEdit.value && to.name === "EditInternalOrder") {
        next(`/internalOrder/view/${id}`);
      } else if (canEdit.value && to.name === "ViewInternalOrder") {
        next(`/internalOrder/edit/${id}`);
      }
    } catch (err) {
      next("/internalOrderList");
    }
    return done();
  } else {
    return next("/");
  }
};

export default internalOrderMiddleware;
