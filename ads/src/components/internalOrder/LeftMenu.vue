<template>
  <div class="internal_order_left mr-3">
    <div
      class="internal_order_menu mb-4"
      :class="{ focus: currentAnchor === 'basic_title' }"
      @click="toAnchor('basic_title', 115)"
    >
      基本資料
    </div>
    <div
      class="internal_order_menu mb-4"
      :class="{ focus: currentAnchor === 'contract_content_title' }"
      @click="toAnchor('contract_content_title', 115)"
    >
      服務內容​(專案及檔期)​
    </div>
    <div v-if="!isDraftForm" class="internal_order_amount">
      <div class="internal_order_title">內服單金額</div>
      <div class="internal_order_main">
        <div class="internal_order_main_left mr-3">訂單總牌價(未稅)</div>
        <div class="internal_order_main_right">
          <div v-if="canEdit">
            <span class="mr-2">
              <input
                type="text"
                v-model.number="salesOrderStore.quotationData.totalMarketPrice"
                placeholder="請輸入"
                :class="{ error_message_border: v$.totalMarketPrice.$error }"
              /> </span
            >元
            <div v-if="v$.totalMarketPrice.$error" class="error_message">
              {{ v$.totalMarketPrice.$errors[0].$message }}
            </div>
          </div>
          <div v-else class="view_status">
            <span>{{
              salesOrderStore.quotationData.totalMarketPrice.toLocaleString()
            }}</span
            >元
          </div>
        </div>
      </div>
      <div class="internal_order_main">
        <div class="internal_order_main_left mr-3">訂單折扣</div>
        <div class="internal_order_main_right">
          <div class="view_status"><span>- -</span>折</div>
        </div>
      </div>
      <div class="internal_order_main">
        <div class="internal_order_main_left mr-3">訂單成交金額(未稅)</div>
        <div class="internal_order_main_right">
          <div class="view_status"><span>0</span>元</div>
        </div>
      </div>
      <div class="internal_order_main">
        <div class="internal_order_main_left mr-3">訂單成交金額(含稅)</div>
        <div class="internal_order_main_right">
          <div class="view_status"><span>0</span>元</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, nextTick, computed } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import useStore from "@/stores/internalOrderStore";
import { useRoute } from "@/router/useRoute.js";
import useScrollAnchor from "@/composables/useScrollAnchor";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";

export default {
  setup() {
    const orderStore = useStore();
    const { route } = useRoute();
    const salesOrderStore = useSalesOrderStore();
    const { currentAnchor, toAnchor, observerEvent } = useScrollAnchor();
    const { isDraftForm, canEditNew } = useFormStatus();
    const quotationData = computed(() => salesOrderStore.quotationData);
    const canEdit = computed(() => canEditNew(quotationData.value).edit);
    const rules = computed(() =>
      quotationData.value.stage === 1
        ? {
            totalMarketPrice: {
              required: helpers.withMessage("請輸入牌價", required)
            }
          }
        : { totalMarketPrice: {} }
    );

    const v$ = useVuelidate(rules, quotationData, {
      $autoDirty: true
    });

    onMounted(() => {
      let hash = route.hash;
      if (hash) {
        nextTick(() => {
          let el = document.querySelector(hash);
          window.scrollTo({
            top: el?.offsetTop - 100
          });
        });
      }

      document.querySelectorAll(".section_container h2").forEach(el => {
        observerEvent({ rootMargin: "0px 0px -50%" }, null).observe(el);
      });
    });

    return {
      v$,
      salesOrderStore,
      orderStore,
      isDraftForm,
      canEdit,
      currentAnchor,
      toAnchor
    };
  }
};
</script>

<style lang="scss" scoped>
.internal_order_left {
  width: 268px;
  position: sticky;
  top: 90px;
  z-index: 5;

  .internal_order_menu {
    display: block;
    border-radius: 8px;
    border: solid 1px #e2e1e1;
    background-color: #fff;
    padding: 24px 0 24px 24px;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #797979;
    text-decoration: none;
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

  .internal_order_amount {
    padding: 24px 12px 72px 24px;
    border-radius: 8px;
    border: solid 1px #19b9c0;
    background-color: #fff;
    color: #797979;

    .internal_order_title {
      margin-bottom: 24px;
      font-size: 16px;
      font-weight: bold;
      color: #797979;
    }

    .internal_order_main {
      display: flex;
      justify-content: right;
      align-items: baseline;
      margin-bottom: 12px;

      .internal_order_main_left {
        font-size: 12px;
        font-weight: bold;
        width: 120px;
        text-align: right;
        letter-spacing: 1.29px;
      }

      .internal_order_main_right {
        font-size: 12px;
        font-weight: normal;

        span {
          color: #19b9c0;
          font-weight: bold;

          input {
            width: 78px;
          }
        }

        .view_status {
          span {
            display: inline-block;
            min-width: 56px;
            margin-right: 8px;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
