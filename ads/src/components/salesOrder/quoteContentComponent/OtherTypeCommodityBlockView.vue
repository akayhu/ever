<template>
  <div
    :id="`otherQuote_block_${product.tempId}`"
    class="commodity_main"
    @mouseover="isHover = true"
    @mouseout="isHover = false"
  >
    <div class="commodity_content pb-4">
      <div class="commodity_left_content">
        <div>
          <span>商品名稱</span>
          <span>{{ product.productName }}</span>
        </div>
        <div>
          <span>對外名稱</span>
          <span>{{ product.externalName || "- -" }}</span>
        </div>
        <div>
          <span>數量</span>
          <span>{{ product.quantity }}</span>
          <span>贈送</span>
          <span>{{ `${product.free === 1 ? "是" : "否"}` }}</span>
        </div>
        <div>
          <span>內容</span>
          <span class="other_quote_remark">{{ product.note || "- -" }}</span>
        </div>
      </div>
      <div class="commodity_center_content">
        <div :class="{ booking_center_content_view: isViewForm }">
          <span>成交小計(未稅)</span>
          <span>{{ Number(product.price).toLocaleString() }}</span>
          <span class="unit">元</span>
        </div>
        <div :class="{ booking_center_content_view: isViewForm }">
          <span
            :class="{
              signOffView: isSignView,
              left_title_view: isViewForm
            }"
            >成交單價(未稅)</span
          >
          <span>{{ Number(product.unitPrice).toLocaleString() }}</span>
          <span class="unit">元/天</span>
        </div>
        <div :class="{ booking_center_content_view: isViewForm }">
          <span>牌價(未稅)</span>
          <span>{{ Number(product.marketPrice).toLocaleString() }}</span>
          <span class="unit">元/天</span>
        </div>
        <div :class="{ booking_center_content_view: isViewForm }">
          <span>成本小計(未稅)</span>
          <span>{{ Number(product.costPrice).toLocaleString() || "- -" }}</span>
          <span class="unit">元</span>
        </div>
        <div :class="{ booking_center_content_view: isViewForm }">
          <span>成本佔比</span>
          <span>{{ costPercentLabel }}</span>
          <span class="unit">%</span>
        </div>
      </div>
      <div
        v-if="$route.name === 'EditSalesOrder'"
        class="commodity_right_content"
      >
        <img
          @click="handleEditing"
          :src="
            isHover
              ? require('@/assets/icon/icon-edit-on.svg')
              : require('@/assets/icon/edit.svg')
          "
        />
      </div>
    </div>
    <div v-if="!groupEditing && groupError" class="error_message booking_error">
      此筆資料有誤！
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useFormStatus } from "@/composables/quotation/useFormStatus";
import { round } from "@/utils/quotation.js";

export default {
  props: {
    project: {
      type: Object,
      require: true
    },
    product: {
      type: Object,
      require: true
    },
    groupEditing: {
      type: Boolean,
      default: false
    },
    groupError: {
      type: Boolean,
      default: false
    },
    handleEditing: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    const { isViewForm, isSignView } = useFormStatus();
    let isHover = ref(false);

    // 成本佔比(未稅)
    const costPercentLabel = computed(() => {
      if (props.product.price <= 0) return "- -";
      else
        return round(
          (props.product.costPrice / props.product.price) * 100,
          1
        ).toLocaleString();
    });

    const rules = {
      productName: { required },
      quantity: { required },
      price: { required }
    };

    return {
      v$: useVuelidate(rules, props.product),
      isHover,
      isViewForm,
      isSignView,
      costPercentLabel
    };
  }
};
</script>

<style lang="scss" scoped>
.commodity_main {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  &:hover {
    background-color: #e6f9fa;
  }

  .commodity_content {
    padding: 16px 0 16px 12px;
    display: flex;
    border-bottom: 1px solid #ddd;
    width: 100%;
    justify-content: space-between;

    .commodity_left_content {
      width: 530px;

      > div {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        span {
          &:nth-child(1) {
            width: 98px;
            text-align: right;
            padding-right: 28px;
            font-weight: bold;
            flex-shrink: 0;
          }
          &:nth-child(2),
          &:nth-child(4) {
            color: #7e7e7e;
            font-weight: bold;
          }
          &:nth-child(3) {
            margin: 0 28px;
            font-weight: bold;
          }

          &.other_quote_remark {
            white-space: pre-wrap;
          }

          .input_field {
            width: 380px;

            ::v-deep textarea {
              background-color: #f3f3f3;
              border: 1px solid #ddd;
              font-size: 16px;
            }

            ::v-deep .el-input__count {
              color: #7e7e7e !important;
              background-color: #f3f3f3 !important;
            }
          }
        }

        &:nth-child(3) {
          span {
            &:nth-child(2) {
              width: 20px;
            }
          }
        }

        &:last-child {
          margin-bottom: 0;
          align-items: flex-start;
        }
      }
    }

    .commodity_center_content {
      margin-left: auto;
      min-width: 300px;

      .unit {
        color: #7e7e7e;
        margin-left: 4px;
        font-weight: initial;
        font-size: 14px;
        min-width: 36px;
        display: inline-block;
        text-align: right;
      }

      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        margin-top: 8px;

        &.booking_center_content_view {
          font-size: 16px;
        }

        &:nth-child(1) {
          margin-top: 0;
        }

        span {
          &:first-child {
            font-weight: bold;
            width: 146px;
            padding-right: 28px;
            text-align: right;
          }

          &:nth-child(2) {
            color: #7e7e7e;
            font-weight: bold;
            flex: 1;
            text-align: right;
          }
        }
      }
      .signOffView {
        color: #ea475b !important;
      }
    }
  }

  .commodity_right_content {
    display: inline-flex;
    align-items: center;

    img {
      cursor: pointer;
      padding-left: 8px;
    }
  }

  .booking_error {
    width: 100%;
    text-align: right;
    margin-top: 16px;
  }
}
</style>
