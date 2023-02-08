import store from "@/store";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useReviewStore } from "@/stores/review";
import useStore from "@/stores/user";
import { useFormStatus } from "@/composables/quotation/useFormStatus";

const editSalesOrderMiddleware = async ({ to, next, done }) => {
  const userLogin = store.getters["user/getUserStatus"].type;
  const salesOrderStore = useSalesOrderStore();
  const reviewStore = useReviewStore();
  const userStore = useStore();
  const { canEdit } = useFormStatus();

  if (userLogin === 2) {
    try {
      if (to.params.salesOrderId != salesOrderStore.quotationData.id)
        await salesOrderStore.getQuotationId({ id: to.params.salesOrderId });

      if (!canEdit.value && to.name === "EditSalesOrder") {
        next(`/salesOrder/generalViewSalesOrder/${to.params.salesOrderId}`);
      } else if (
        salesOrderStore.quotationData.canEdit &&
        canEdit.value &&
        (to.name === "GeneralViewSalesOrder" ||
          to.name === "SignOffViewSalesOrder")
      ) {
        next(`/salesOrder/editSalesOrder/${to.params.salesOrderId}`);
      } else if (
        salesOrderStore.quotationData.audit !== 1 &&
        to.name === "SignOffViewSalesOrder"
      ) {
        next(`/salesOrder/generalViewSalesOrder/${to.params.salesOrderId}`);
      }
    } catch (err) {
      next("/salesOrderList");
    }

    if (salesOrderStore.quotationData.audit === 1) {
      await reviewStore.getResourceApprover({
        id: to.params.salesOrderId,
        type: "QUOTATION"
      });
      if (
        !reviewStore.approver.some(
          item => item.empId === userStore.getUserStatus.accountId
        ) &&
        to.name === "SignOffViewSalesOrder"
      ) {
        next(`/salesOrder/generalViewSalesOrder/${to.params.salesOrderId}`);
      } else if (
        reviewStore.approver.some(
          item => item.empId === userStore.getUserStatus.accountId
        ) &&
        to.name === "GeneralViewSalesOrder"
      ) {
        next(`/salesOrder/SignOffViewSalesOrder/${to.params.salesOrderId}`);
      }
    }
    return done();
  } else {
    return next("/");
  }
};

export default editSalesOrderMiddleware;
