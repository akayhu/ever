<template>
  <div
    class="booking_main"
    :id="`commodity_block_${product.tempId}`"
    :class="{ edit_open: groupEditing }"
    @mouseover="isHover = true"
    @mouseout="isHover = false"
  >
    <div class="flex-grow-1">
      <div
        class="booking_content_main"
        :class="{
          booking_content_main_view: isViewForm
        }"
      >
        <div
          class="booking_content"
          :class="{ bg_blue: isHover && !groupEditing }"
        >
          <div
            :class="{ booking_left_content_view: isViewForm }"
            class="booking_left_content"
          >
            <div>
              <div>商品名稱</div>
              <div>{{ product.productName }}</div>
            </div>
            <div>
              <div>執行期間</div>
              <div class="booking_datePicker">
                {{
                  haveQuotationDate
                    ? `${product.quotationStartDate} ~
                ${product.quotationEndDate}`
                    : "--"
                }}
              </div>
            </div>
            <div>
              <div>數量</div>
              <div class="booking_quantity">
                {{ product.quantity }}
                <span>{{ unitLabel }}</span>
              </div>
            </div>
            <div>
              <div>贈送</div>
              <div>{{ freeLabel }}</div>
            </div>
          </div>
          <div class="booking_center_content">
            <div :class="{ booking_center_content_view: isViewForm }">
              <span :class="{ left_title_view: isViewForm }"
                >成交金額(未稅)</span
              >
              <span>{{ Number(product.price).toLocaleString() }}</span>
              <span class="unit">元</span>
            </div>
            <div :class="{ booking_center_content_view: isViewForm }">
              <span
                :class="{
                  signOffView: isSignView,
                  left_title_view: isViewForm
                }"
              >
                成交單價(未稅)
              </span>

              <span :class="{ signOffView: isSignView }">{{
                Number(product.unitPrice).toLocaleString()
              }}</span>
              <span class="unit">元/天</span>
            </div>
            <div
              v-if="isSignView && floorPriceNotice"
              class="below_reserve_price"
            >
              <span></span>
              <span :class="{ signOffView: isSignView }">成交價低於底價</span>
            </div>
            <div :class="{ booking_center_content_view: isViewForm }">
              <span :class="{ left_title_view: isViewForm }">牌價(未稅)</span>
              <span>{{ Number(product.marketPrice).toLocaleString() }}</span>
              <span class="unit">元/天</span>
            </div>
            <div :class="{ booking_center_content_view: isViewForm }">
              <span :class="{ left_title_view: isViewForm }">商品折扣</span>
              <span>{{ product.discountPercentage }}</span>
              <span class="unit">折</span>
            </div>
            <div :class="{ booking_center_content_view: isViewForm }">
              <span
                :class="{
                  signOffView: isSignView,
                  left_title_view: isViewForm
                }"
              >
                底價(未稅)
              </span>
              <span>{{ Number(product.floorPrice).toLocaleString() }}</span>
              <span class="unit">元/天</span>
            </div>
          </div>
          <div v-if="isEditForm" class="icon_actions" @click="handleEditing">
            <icon :iconName="isHover ? 'icon-edit-on' : 'edit'" size="28" />
          </div>
        </div>
        <div
          v-if="!groupEditing && groupError"
          class="error_message booking_error"
        >
          此筆資料有誤！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useFormStatus } from "@/composables/quotation/useFormStatus";
import { required } from "@vuelidate/validators";
import { round } from "@/utils/quotation";

export default {
  props: {
    project: {
      type: Object,
      default: () => {}
    },
    product: {
      type: Object,
      required: true
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
    const { isEditForm, isViewForm, isSignView } = useFormStatus();
    const isHover = ref(false);
    const haveQuotationDate = computed(
      () => props.product.quotationStartDate && props.product.quotationEndDate
    );
    const unitLabel = computed(() => {
      if (props.product.unit === "DAY") return "天";
      else if (props.product.unit === "WEEK") return "週";
    });
    const freeLabel = computed(() => {
      const convertLable = { 1: "是", true: "是", 0: "否", false: "否" };
      if (!Array.isArray(props.product.free)) {
        return convertLable[props.product.free];
      }
      let result = props.product.free
        .map(f => convertLable[f])
        .filter((e, i, a) => a.indexOf(e) === i);
      result.length = result.length > 2 ? 2 : result.length;
      return result.join("/");
    });

    const floorPriceNotice = computed(() => {
      if (props.product.unitPrice < props.product.floorPrice) {
        return true;
      }
      return false;
    });

    const rules = {
      productName: { required },
      quantity: { required },
      price: { required }
    };

    return {
      v$: useVuelidate(rules, props.product),
      isHover,
      isEditForm,
      isViewForm,
      isSignView,
      haveQuotationDate,
      unitLabel,
      freeLabel,
      floorPriceNotice,
      round
    };
  }
};
</script>

<style lang="scss" scoped>
.booking_main {
  width: 100%;

  .booking_content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 16px 0 16px 12px;
    border-bottom: 1px solid #ddd;

    &.bg_blue {
      background-color: #e6f9fa;
    }

    .booking_left_content {
      width: 530px;

      &.booking_left_content_view {
        width: 530px;
      }

      > div {
        display: flex;
        padding-bottom: 16px;

        &:last-child {
          padding-bottom: 0;
        }

        > div {
          &:nth-child(1) {
            width: 98px;
            padding-right: 28px;
            text-align: right;
            font-weight: bold;
          }

          &.booking_datePicker {
            ::v-deep .el-date-editor {
              width: 380px;
            }
          }

          &.booking_quantity {
            display: flex;
            align-items: center;
            color: #7e7e7e;

            span {
              margin-left: 4px;
              font-weight: initial;
            }

            ::v-deep .el-select {
              width: 60px;
            }
          }

          &:last-child {
            color: #7e7e7e;
            font-size: 16px;
            font-weight: bold;
            padding-bottom: 0;
          }
        }
      }
    }

    .booking_center_content {
      margin-left: auto;
      min-width: 300px;

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

        .unit {
          min-width: 36px;
          margin-left: auto;
          @include font-common(14px, $font-weight-normal, $gray-700);
          text-align: right;
        }

        > span {
          font-weight: bold;

          &.left_title_view {
            width: 150px !important;
          }

          &:first-child {
            width: 140px;
            padding-right: 28px;
            text-align: right;
          }

          &:nth-child(2) {
            color: #7e7e7e;
            flex: 1;
            text-align: right;
            margin-right: 8px;
          }
        }

        &.below_reserve_price {
          span {
            font-size: 14px;

            &:last-child {
              &::after {
                content: "";
                margin-left: 0;
              }
            }
          }
        }
      }
    }

    .icon_actions {
      display: inline-flex;
      align-items: center;
      width: 28px;
      margin-left: 12px;

      img {
        cursor: pointer;
      }
    }
  }

  .signOffView {
    color: #ea475b !important;
  }
}

.edit_open {
  .booking_content {
    // padding-bottom: 0;
    border-color: transparent;
  }
}

.booking_error {
  font-size: 16px;
  text-align: right;
  margin-top: 16px;
}
</style>
