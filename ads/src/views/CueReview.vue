<template>
  <div>
    <Contract
      title="CUE表變更"
      subtitle="申請變更"
      :fixed="false"
      :id="id"
      reviewType="CUE_CHANGE"
      :actionCallback="reviewAction"
    ></Contract>
    <main>
      <div class="d-flex">
        <div class="wrapper">
          <div class="block_title">
            <img class="mr-1" src="@/assets/icon/icon-icon-apply.svg" />合約內容
          </div>
          <label class="contract_title">訂單單號</label>
          <div class="value">{{ quotationData.orderId }}</div>
          <label class="contract_title">客戶名稱</label>
          <div class="value">{{ quotationData.customerName }}</div>
          <label class="contract_title">執行時間</label>
          <div class="value">
            {{ quotationData.orderExecutionStartDate }} -
            {{ quotationData.orderExecutionEndDate }}
          </div>
          <label class="contract_title">案件名稱</label>
          <div class="value">{{ quotationData.name }}</div>
          <div class="mb-4">
            <label class="contract_title">業務</label
            ><span class="value ml-1">{{ quotationData.salesInfo.name }}</span>
          </div>
          <label class="contract_title">訂單成交金額</label>
          <div class="mb-4">
            <span class="value">{{
              quotationData.totalPriceIncludeTax?.toLocaleString()
            }}</span>
            <span class="ml-1">元</span>
          </div>
          <div>
            <label class="contract_title">原訂單折扣</label>
            <span class="value ml-1">{{
              quotationData.discountPercentage?.toLocaleString() || "- -"
            }}</span>
            <span class="ml-1">折</span>
          </div>
        </div>

        <div class="wrapper flex-fill">
          <div class="block_title">
            <img
              class="mr-1"
              src="@/assets/icon/icon-icon-note.svg"
            />申請變更內容
          </div>
          <div class="mb-5">
            <span class="change_title mr-4">原訂單總牌價 (含稅)</span>
            <span class="value">{{
              cueApplication?.originTotalMarketPrice || "- -"
            }}</span>
          </div>
          <div class="d-flex mb-5">
            <label class="change_title mr-7">變更總牌價上限 (含稅)</label>
            <span class="value">{{
              cueApplication?.totalMarketPrice || "- -"
            }}</span>
            <div class="ml-32">
              變更後折扣
              <span class="ml-4 value">{{
                round(cueApplication?.discountPercentage * 10, 1) || "- -"
              }}</span>
              <span class="ml-1">折</span>
            </div>
          </div>
          <div class="d-flex">
            <label class="d-inline-block change_title mr-7">變更原因</label>
            <span class="value">{{ cueApplication?.reason }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, toRefs } from "vue";
import { useRoute } from "@/router/useRouter.js";
import Contract from "@/components/share/ContractReview/Contract.vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { usePullCueStore } from "@/stores/pullCue.js";
import { round } from "@/utils/quotation";

const { route, router } = useRoute();
const salesOrderStore = useSalesOrderStore();
const cueStore = usePullCueStore();
const { quotationData } = toRefs(salesOrderStore);
const { cueApplication } = toRefs(cueStore);
const id = route.params.id;

// 簽核或駁回後的動作
const reviewAction = () => {
  router.push("/cueManagement");
};

onMounted(async () => {
  await cueStore.getApplication({ quotationId: id });
  if (!cueApplication.value) {
    router.push("/cueManagement");
  }
  await salesOrderStore.getQuotationId({ id });
});
</script>

<style lang="scss" scoped>
main {
  width: 1280px;
  margin: 0 auto;
  padding: 24px;
}
.wrapper {
  width: 268px;
  margin-right: 12px;
  padding: 24px 16px;
  background-color: #fff;
  border: solid 1px #e2e1e1;
  border-radius: 8px;

  .block_title {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }

  .contract_title {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #292929;
    margin-bottom: 8px;
  }

  .change_title {
    min-width: 70px;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #333;
  }

  .value {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #19b9c0;
    margin-bottom: 16px;
  }

  .ml-32 {
    margin-left: 128px;
  }
}
</style>
