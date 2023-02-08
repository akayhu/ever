import { useSalesOrderListStore } from "@/stores/salesOrderList.js";

const salesOrderListMiddleware = async ({ done }) => {
  const salesOrderListStore = useSalesOrderListStore();
  await salesOrderListStore.$reset();
  return done();
};

export default salesOrderListMiddleware;
