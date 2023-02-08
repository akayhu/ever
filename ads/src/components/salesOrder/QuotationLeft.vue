<template>
  <aside class="quotation_left">
    <div
      class="quotation_menu mb-4"
      :class="{ focus: currentAnchor === 'basic_information' }"
      @click="toAnchor('basic_information', 115)"
    >
      基本資料
    </div>
    <div
      class="quotation_menu mb-4"
      :class="{ focus: currentAnchor === 'quote_content' }"
      @click="toAnchor('quote_content', 115)"
    >
      報價內容(專案及檔期)
    </div>
    <div
      class="quotation_menu mb-4"
      :class="{ focus: currentAnchor === 'export_contract' }"
      @click="toAnchor('export_contract', 115)"
    >
      匯出套印合約
    </div>
    <QuotationAmount v-if="$route.name !== 'CreatedSalesOrder'" />
  </aside>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import useScrollAnchor from "@/composables/useScrollAnchor";
import QuotationAmount from "./quoteContentComponent/QuotationAmount.vue";

export default defineComponent({
  components: {
    QuotationAmount
  },
  setup() {
    const { currentAnchor, toAnchor, observerEvent } = useScrollAnchor();

    onMounted(() => {
      document.querySelectorAll(".section_container").forEach(el => {
        observerEvent({ rootMargin: "-49% 0px -49% 0px" }, null).observe(el);
      });
    });

    return {
      currentAnchor,
      toAnchor
    };
  }
});
</script>

<style lang="scss" scoped>
.quotation_left {
  width: 268px;
  position: sticky;
  top: 87px;
  float: left;
  margin-top: 18px;
  z-index: 3;

  .quotation_menu {
    border-radius: 8px;
    border: solid 1px #e2e1e1;
    background-color: #fff;
    padding: 24px 0 24px 24px;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #797979;
    position: relative;
    cursor: pointer;

    &.focus {
      color: #00afb8;

      &::after {
        content: "";
        position: absolute;
        z-index: 2;
        right: -13px;
        top: 38%;
        width: 0;
        height: 0;
        border: 7px solid;
        border-color: transparent transparent transparent #fff;
      }

      &::before {
        content: "";
        position: absolute;
        right: -14px;
        top: 38%;
        width: 0;
        height: 0;
        border: 7px solid;
        border-color: transparent transparent transparent #e2e1e1;
      }
    }
  }
}
</style>
