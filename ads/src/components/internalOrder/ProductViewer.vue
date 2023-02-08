<template>
  <div class="flex-grow-1">
    <div class="view_container" :class="{ editing: groupEditing }">
      <div class="left">
        <div class="data_row">
          <label class="label_field">商品名稱</label>
          <span class="label_viewer">{{ product.productName }}</span>
        </div>
        <div class="data_row">
          <label class="label_field">執行期間</label>
          <span class="label_viewer">{{
            `${product.quotationStartDate} ~ ${product.quotationEndDate}`
          }}</span>
        </div>
        <div class="data_row">
          <label class="label_field">數量</label>
          <span class="label_viewer"
            >{{ product.quantity }}
            <span class="qty_unit_label">{{ unitLabel }}</span></span
          >
        </div>
      </div>
      <div
        class="right"
        :class="formStatus === 'view' ? 'text_normal' : 'text_small'"
      >
        <div class="mb-3">
          <label class="label_field">小計(未稅)</label>
          <div>
            <span class="font-weight-bold">{{ product.price }}</span>
            <span class="qty_unit_label"> 元</span>
          </div>
        </div>
        <div>
          <label class="label_field">牌價</label>
          <div>
            <span class="font-weight-bold">{{ product.marketPrice }}</span>
            <span class="qty_unit_label"> 元</span>
          </div>
        </div>
        <div v-if="showError" class="error_message">此筆資料有誤</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import useFormStatus from "@/composables/InternalOrder/useFormStatus";

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    groupEditing: {
      type: Boolean,
      default: false
    },
    showError: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { formStatus } = useFormStatus();
    const unitLabel = computed(() =>
      props.product.unit === "DAY" ? "天" : "週"
    );
    return { formStatus, unitLabel };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/orderManage/internalOrder";

.label_field {
  min-width: 70px;
  margin-right: 28px;
}

.view_container {
  display: flex;
  align-items: stretch;
  flex-grow: 1;
  padding: 16px 24px;
  padding-right: 0;

  .qty_unit_label {
    @include font-common(14px);
    color: #7e7e7e;
  }

  .left {
    width: 617px;
  }

  .right {
    text-align: right;
    flex-grow: 1;
    position: relative;
    display: flex;
    flex-direction: column;

    .label_field {
      width: 90px;
    }

    > div {
      display: flex;
      justify-content: space-between;
      align-items: baseline;

      > div {
        color: #7e7e7e;
      }
    }

    &.text_normal {
      font-size: 16px;
    }

    &.text_small {
      font-size: 14px;
    }

    .error_message {
      flex: 1;
      align-items: flex-end;
      align-self: flex-end;
    }
  }

  .icon_wrapper {
    width: 40px;
    align-self: center;

    > img {
      cursor: pointer;
    }
  }
}

.editing {
  border-bottom: none;
}
</style>
