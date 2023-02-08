<template>
  <div
    class="quotation_main"
    :class="{ quotation_amount_open: switchOpen }"
    :style="cssVar"
  >
    <div class="quotation_amount">
      <div>
        <div class="quotation_amount_title">報價單金額</div>
        <div class="quotation_amount_main quotation_amount_constent">
          <div class="quotation_amount_main_left">
            <img
              v-if="canEdit"
              src="@/assets/icon/icon-icon-refresh.svg"
              class="mr-1"
              @click="salesOrderStore.calculateTotalMarketPrice"
            />訂單總牌價(未稅)<span class="necessary">*</span>
          </div>
          <div class="quotation_amount_main_right">
            <input
              v-if="canEdit"
              v-model.number="salesOrderStore.quotationData.totalMarketPrice"
              placeholder="請輸入"
              widthType="78"
              @focus="$event.target.select()"
              @blur="salesOrderStore.getCalPrice"
              @keyup.enter="salesOrderStore.getCalPrice"
            />
            <span v-else class="mr-1">{{
              salesOrderStore.quotationData.totalMarketPrice?.toLocaleString()
            }}</span>
            元
          </div>
        </div>
        <div
          v-if="v$.totalMarketPrice.$error"
          class="error_message text-right mr-4"
        >
          {{ v$.totalMarketPrice.$errors[0].$message }}
        </div>
        <div class="quotation_amount_main quotation_amount_constent">
          <div
            class="quotation_amount_main_left"
            :class="{ signOffView: isSignView }"
          >
            訂單折扣
          </div>
          <div class="quotation_amount_main_right">
            <span class="mr-1">{{
              salesOrderStore.discountPercentageLabel
            }}</span
            >折
          </div>
        </div>
        <div class="quotation_amount_main quotation_amount_constent">
          <div
            class="quotation_amount_main_left"
            :class="{ signOffView: isSignView }"
          >
            訂單成交金額(未稅)
          </div>
          <div class="quotation_amount_main_right">
            <span class="mr-1">{{ salesOrderStore.totalPriceLabel }}</span
            >元
          </div>
        </div>
        <div class="quotation_amount_main quotation_amount_constent">
          <div class="quotation_amount_main_left">訂單成交金額(含稅)</div>
          <div class="quotation_amount_main_right">
            <span class="mr-1">{{
              salesOrderStore.totalPriceIncludeTaxLabel
            }}</span
            >元
          </div>
        </div>
      </div>
      <div v-if="switchOpen && showContent && lastQuotation.totalPrice > 0">
        <div
          class="quotation_amount_title"
          :class="{ signOffView: isSignView }"
        >
          舊客上一張訂單
        </div>
        <div class="quotation_amount_main quotation_amount_constent">
          <div class="quotation_amount_main_left">訂單折扣</div>
          <div class="quotation_amount_main_right">
            <span class="mr-1">{{ lastQuotation.discountPercentageLabel }}</span
            >折
          </div>
        </div>
        <div class="quotation_amount_main quotation_amount_constent">
          <div class="quotation_amount_main_left">訂單成交金額(未稅)</div>
          <div class="quotation_amount_main_right">
            <span class="mr-1">{{ lastQuotation.totalPrice }}</span
            >元
          </div>
        </div>
      </div>
      <div
        v-if="
          switchOpen && showContent && isViewForm && systemNoteList.length > 0
        "
      >
        <div
          class="quotation_amount_title"
          :class="{ signOffView: isSignView }"
        >
          系統備註
        </div>
        <ul>
          <template>
            <li v-for="note in systemNoteList" :key="note.id">
              {{ note.note }}
            </li>
          </template>
        </ul>
      </div>
    </div>
    <span
      v-if="lastQuotation.totalPrice > 0 || isViewForm"
      class="switch"
      @click="openQuotationAmount"
    >
      <img
        v-if="!switchOpen"
        src="@/assets/icon/icon-icons-black-chevron-right.svg"
      />
      <img v-else src="@/assets/icon/icon-icons-black-chevron-left.svg" />
    </span>
  </div>
</template>

<script>
import { computed, onMounted, ref, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";

export default {
  setup() {
    const salesOrderStore = useSalesOrderStore();
    const { quotationData, lastQuotation, leftMenuNote } = toRefs(
      salesOrderStore
    );
    const { isViewForm, isSignView, canEdit } = useFormStatus();
    const switchOpen = ref(false);
    const showContent = ref(false);

    const cssVar = computed(() => {
      let count = 1;
      if (lastQuotation.value.totalPrice > 0) count++;
      if (isViewForm.value) count++;

      return { "--width": `${268 * count - 1}px` };
    });

    const systemNoteList = computed(() =>
      leftMenuNote.value.filter(n => !n.confirm)
    );

    const rules = computed(() => {
      let rule = {
        totalMarketPrice: {
          number: helpers.withMessage(
            "請輸入正確數字",
            val => Number(val) > 0 && Number(val) <= 1000000000
          )
        }
      };

      if (quotationData.value.stage === 1) {
        rule.totalMarketPrice.required = helpers.withMessage(
          "請輸入牌價",
          required
        );
      }
      return rule;
    });

    const v$ = useVuelidate(rules, quotationData, {
      $autoDirty: true
    });

    const openQuotationAmount = () => {
      switchOpen.value = !switchOpen.value;
      setTimeout(() => {
        showContent.value = !showContent.value;
      }, 500);
    };

    salesOrderStore.getVerify();

    onMounted(async () => {
      await salesOrderStore.getLastQuotation();
      // 報價單在草稿/編輯時，判斷有舊客上一筆訂單時，則展開顯示停留三秒後收合
      if (canEdit.value && lastQuotation.value.totalPrice > 0) {
        switchOpen.value = true;
        showContent.value = true;
        setTimeout(() => {
          switchOpen.value = false;
          showContent.value = false;
        }, 3000);
      }
    });

    return {
      v$,
      salesOrderStore,
      isViewForm,
      isSignView,
      canEdit,
      switchOpen,
      showContent,
      lastQuotation,
      cssVar,
      systemNoteList,
      openQuotationAmount
    };
  }
};
</script>

<style lang="scss" scoped>
.quotation_main {
  position: relative;
  transition-duration: 0.5s;
  width: 268px;

  &.quotation_amount_open {
    width: var(--width);
  }

  .quotation_amount {
    padding: 23px 0;
    border-radius: 8px;
    border: solid 1px #19b9c0;
    background-color: #fff;
    color: #797979;
    font-size: 14px;
    letter-spacing: 1.43px;
    display: flex;

    > div {
      border-right: 1px solid #d6d6d6;
      width: 266px;
      min-height: 202px;

      &:last-child {
        border-right: 0;
      }
    }

    .quotation_amount_title {
      margin: 0 0 28px 24px;
      font-weight: bold;
      font-size: 16px;
    }

    .quotation_amount_main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;

      &.quotation_amount_constent {
        margin-top: 10px;
      }

      .total_order_price {
        width: 136px;
      }

      .quotation_amount_main_left {
        text-align: right;
        width: 150px;

        img {
          cursor: pointer;
        }
      }

      .quotation_amount_main_right {
        margin-right: 12px;
      }

      .quotation_amount_main_right,
      .quotation_amount_order_right {
        span {
          color: #19b9c0;
        }
      }

      .quotation_amount_order_left {
        text-align: right;
        width: 141px;
      }
    }

    ul {
      margin: 0 14px 0 40px;

      li {
        font-size: 12px;
        line-height: 1.5;
        letter-spacing: 1.29px;
        color: #797979;
        position: relative;
        margin-bottom: 6px;

        &::before {
          content: " ";
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 3px solid #00afb8;
          border-radius: 50%;
          margin-right: 4px;
          position: absolute;
          left: -16px;
          top: 4px;
        }
      }
    }
  }

  .switch {
    position: absolute;
    width: 20px;
    height: 40px;
    background-color: #fff;
    border: 1px solid #19b9c0;
    border-left: 1px solid #fff;
    right: -19px;
    top: 20px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    cursor: pointer;

    img {
      position: relative;
      right: 6px;
      top: 6px;
    }
  }

  .signOffView {
    color: #ea475b;
  }
}
</style>
