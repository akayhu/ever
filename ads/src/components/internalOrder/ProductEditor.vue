<template>
  <div :class="{ bg_blue: isGroup }">
    <div class="w-100 content">
      <div class="product_info">
        <div class="left">
          <div class="data_row align-items-center">
            <div class="data_col">
              <label class="label_field">商品名稱</label>
            </div>
            <div class="data_col w380">
              <div class="d-flex align-items-center">
                <SelectDropdown
                  :value="product.productName"
                  :options="searchedProductOptions"
                  placeholder="請輸入"
                  :asncSearchCb="productSuggest"
                  :filterable="true"
                  :remote="true"
                  :optionsAllData="true"
                  :disabled="product.id ? true : false"
                  type="getProductRecommend"
                  @value-changed="changePrduct"
                  @set-history-record="searchedProductOptions = $event"
                />
              </div>
            </div>
            <icon
              class="ml-2"
              :iconName="
                isHover
                  ? 'icon-more-icon-managerment-hover'
                  : 'icon-more-icon-managerment'
              "
              v-tooltip="{
                content: '設定特殊銷用等資訊',
                offset: 5,
                placement: 'right',
                trigger: 'hover'
              }"
              :disabled="!product.productName"
              @mouseover.native="isHover = true"
              @mouseout.native="isHover = false"
              @click.native="openSettingSaleDialog"
            />
          </div>
          <div class="data_row">
            <div class="data_col">
              <label class="label_field">執行期間</label>
            </div>
            <div class="data_col w380">
              <DatePicker
                ref="datePicker"
                class="w-100"
                :getSearchTime="getTime"
                :dateInterval="[
                  product.quotationStartDate,
                  product.quotationEndDate
                ]"
              />
            </div>
          </div>
          <div class="data_row">
            <label class="label_field">數量</label>
            <span class="label_viewer"
              >{{ computingDays }} <span class="qty_unit_label">天</span></span
            >
          </div>
        </div>
        <div class="right">
          <div class="mb-2">
            <span>小計(未稅)</span>
            <span>
              <strong>{{ product.price === 0 ? "0" : "- -" }}</strong> 元
            </span>
          </div>
          <div>
            <span>牌價(未稅)</span>
            <span>
              <strong>{{ marketPriceLabel }}</strong> 元
            </span>
          </div>
        </div>
        <div v-if="editMode === 'edit'" class="mr-3 align-self-center">
          <icon
            @click.native.stop="removeProduct"
            iconName="btn-close"
            size="16"
          />
        </div>
      </div>
    </div>

    <div v-if="editMode === 'create'" class="icon_actions action_button">
      <div @click.stop="removeProduct">
        <icon iconName="icon-x-border" size="28" />
      </div>
      <div
        v-if="showAddBtn"
        :class="{ disabled: disabledAdd }"
        class="ml-2"
        @click.stop="addProduct"
      >
        <icon iconName="icon-icon-expand-less" />
      </div>
    </div>

    <SettingSale
      ref="settingSale"
      :product="product"
      :settingSaleStatus="isSettingOpened"
      :closeSettingSale="closeSettingSaleDialog"
      :saveSetting="saveSetting"
      :type="project.type"
    />
  </div>
</template>

<script>
import { computed, ref, nextTick } from "vue";
import { numberOnly } from "@/directives/numberOnly.js";
import { calcDiffDays } from "@/utils/report/util.js";
import useVuelidate from "@vuelidate/core";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useProductStore } from "@/stores/product.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import SettingSale from "@/components/share/SettingSale.vue";
import { round } from "@/utils/quotation.js";

export default {
  components: {
    SelectDropdown,
    DatePicker,
    SettingSale
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    product: {
      type: Object,
      required: true
    },
    showAddBtn: {
      type: Boolean,
      default: false
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    editMode: {
      type: String,
      default: "edit"
    }
  },
  directives: {
    numberOnly
  },
  setup(props) {
    const salesOrderStore = useSalesOrderStore();
    const productStore = useProductStore();
    const selectedProduct = computed(() => {
      if (!props.product.productName) return "";
      return (
        searchedProductOptions.value.find(
          option => option.value === props.product.productId
        )?.label ?? ""
      );
    });
    const unitLabel = computed(() =>
      props.product.unit === "DAY" ? "天" : "週"
    );
    const disabledAdd = computed(() => !props.product.productName);
    // 計算天數
    const computingDays = computed(() => {
      if (!props.product.quotationStartDate || !props.product.quotationEndDate)
        return 0;
      return calcDiffDays(
        props.product.quotationStartDate,
        props.product.quotationEndDate
      );
    });
    // 實際數量
    const realQuantity = computed(() =>
      props.product.unit === "WEEK"
        ? props.product.quantity * 7
        : props.product.quantity
    );
    // 數量、日期不符合
    const quantityNotMatch = computed(
      () => computingDays.value !== realQuantity.value
    );
    // 牌價(未稅)
    const marketPriceLabel = computed(
      () => props.product.marketPrice?.toLocaleString() ?? "- -"
    );
    const rules = computed(() => {
      let productRule = {
        quotationDate: {}
      };

      if (props.product.productName) {
        productRule.quotationDate = {
          required: () =>
            props.product.quotationStartDate && props.product.quotationEndDate
        };
      }

      return productRule;
    });
    const searchedProductOptions = ref([]);
    const settingSale = ref(null);
    const datePicker = ref(null);
    const isHover = ref(false);
    const isSettingOpened = ref(false);
    const v$ = useVuelidate(rules, props.product, { $autoDirty: true });

    const unitOptions = [
      { label: "週", value: "WEEK" },
      { label: "天", value: "DAY" }
    ];

    // 取得商品選項
    const productSuggest = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        try {
          const responseData = await productStore.getProductList(keyword, 1);
          searchedProductOptions.value = [...responseData].map(item => {
            return {
              ...item,
              value: item.id,
              label: item.name
            };
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    // 變更商品
    const changePrduct = data => {
      props.product.productId = data.value;
      props.product.productName = data.label;
      props.product.type = data.type;
      props.product.unit = "DAY";
      props.product.quantity = computingDays.value;
      props.product.marketPrice = round(
        data.listPriceTaxFree / data.actualQuantity,
        1
      );
      props.product.floorPrice = data.floorPrice;
      // 內服單是不計價的，所以小計都是 0
      props.product.price = 0;
    };

    // 變更執行時間
    const getTime = d => {
      if (d) {
        props.product.quotationStartDate = d.searchTimeStart;
        props.product.quotationEndDate = d.searchTimeEnd;
        props.product.quantity = computingDays.value;
        props.product.unit = "DAY";
      }
    };

    // 變更單位
    const changeUnit = data => {
      props.product.unit = data.value;
    };

    // 刪除商品
    const removeProduct = () => {
      salesOrderStore.removeProduct(
        props.product.projectId,
        props.product.tempId
      );
      datePicker.value.dateValue = "";
    };

    // 新增商品
    const addProduct = () => {
      if (disabledAdd.value) return;
      const id = salesOrderStore.createProduct(props.product.projectId);
      setTimeout(() => {
        nextTick(() => {
          const focusElement = document.querySelector(`#new_product_${id}`);
          if (!focusElement) return;
          window.scrollTo({
            top: focusElement.offsetTop - 130,
            behavior: "smooth"
          });
        });
      }, 100);
    };

    // 打開設定銷用內容
    const openSettingSaleDialog = () => {
      isSettingOpened.value = true;
      settingSale.value.init();
    };

    // 關閉設定銷用內容
    const closeSettingSaleDialog = () => {
      isSettingOpened.value = false;
    };

    // 設定商品銷用
    const saveSetting = data => {
      isSettingOpened.value = false;
      Object.entries(data).forEach(([key, value]) => {
        props.product[key] = value;
      });
    };

    return {
      searchedProductOptions,
      selectedProduct,
      datePicker,
      v$,
      unitOptions,
      unitLabel,
      settingSale,
      isSettingOpened,
      isHover,
      disabledAdd,
      quantityNotMatch,
      computingDays,
      getTime,
      changeUnit,
      removeProduct,
      addProduct,
      openSettingSaleDialog,
      closeSettingSaleDialog,
      saveSetting,
      changePrduct,
      productSuggest,
      marketPriceLabel
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/orderManage/internalOrder";

.label_field {
  margin-right: 28px;
}

.content {
  // width: 100%;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  border-bottom: 1px solid #ddd;
}

.bg_blue {
  background-color: #e6f9fa;
  padding-bottom: 24px;

  ::v-deep {
    .el-input,
    .el-input__inner,
    input {
      background-color: #fff !important;
    }
  }
}

.product_info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0 16px 24px;
  flex-grow: 1;

  .data_row {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .label_field {
    min-width: 70px;
  }

  ::v-deep img {
    cursor: pointer;
  }

  .right {
    margin-top: 12px;
    flex-basis: 200px;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      @include font-common(14px, $font-weight-bold);
    }

    span {
      @include font-common(14px, $font-weight-normal);
    }
  }

  .error_qty {
    flex: 0 0 100%;
    margin-left: 90px;
  }
}

.action_button {
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
