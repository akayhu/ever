<template>
  <div>
    <h2 class="mb-2">拉CUE</h2>
    <SearchBlock
      :changeQuotationId="changeQuotationId"
      :changeProductData="changeProductData"
      :changeType="changeType"
      class="mb-3"
    />
    <main class="d-flex">
      <ContractSidebar
        :changeType="changeType"
        :changeProductData="changeProductData"
        :productData="productData"
        :quotationId="quotationId"
      />
      <CueSchedule :productData="productData" :type="type" />
    </main>
    <GoTop />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SearchBlock from "@/components/cueManagement/SearchBlock.vue";
import ContractSidebar from "@/components/cueManagement/ContractSidebar.vue";
import CueSchedule from "@/components/cueManagement/CueSchedule.vue";
import GoTop from "@/components/GoTop.vue";

const type = ref(null);
const productData = ref({
  productId: 0,
  productName: null,
  projectId: 0,
  cueProjectServiceId: 0
});
const quotationId = ref(0);

const changeProductData = data => {
  productData.value.productId = data.productId || 0;
  productData.value.productName = data.productName || null;
  productData.value.projectId = data.projectId || 0;
  productData.value.cueProjectServiceId = data.cueProjectServiceId || 0;
};

const changeQuotationId = id => {
  quotationId.value = id;
};

const changeType = num => {
  type.value = num;
};
</script>
