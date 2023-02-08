<template>
  <div>
    <div class="quotation_title">管理報價單</div>
    <!-- 查詢報價單 -->
    <InquireOrder />

    <div class="create_quotation_button">
      <router-link
        to="/salesOrder/createdSalesOrder"
        rel="noopener noreferrer"
        target="_blank"
        title="新增報價單"
        class="button_bg_white_large"
      >
        新增報價單
      </router-link>
    </div>

    <!-- 報價單列表 -->
    <QuotationList />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import InquireOrder from "@/components/salesOrderList/InquireOrder.vue";
import QuotationList from "@/components/salesOrderList/QuotationList.vue";

export default defineComponent({
  components: {
    InquireOrder,
    QuotationList
  },
  setup() {
    const salesOrderStore = useSalesOrderStore();
    salesOrderStore.$reset();
  }
});
</script>

<style lang="scss" scoped>
.quotation_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}

.create_quotation_button {
  text-align: right;
  margin-bottom: 24px;
}
</style>
