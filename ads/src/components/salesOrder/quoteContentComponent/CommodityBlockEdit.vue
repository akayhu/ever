<template>
  <div
    :id="`product_block_${product.tempId}`"
    :class="{
      booking_edit: editing && editType
    }"
    class="booking_main"
  >
    <div class="w-100">
      <div class="booking_content">
        <div class="booking_left_content">
          <div>
            <div>商品名稱<span class="necessary">*</span></div>
            <div class="product_name">
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
                @value-changed="onChangeProduct"
                @set-history-record="searchedProductOptions = $event"
              />
              <icon
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
                class="ml-2"
              />
            </div>
          </div>
          <div>
            <div>執行期間<span class="necessary">*</span></div>
            <div class="booking_datePicker">
              <DatePicker
                ref="datePicker"
                :getSearchTime="getTime"
                :itemIndex="1"
                :dateItemIndex="1"
                :disabled="!product.productName"
              />
              <div v-if="v$.quotationDate.$error" class="error_message">
                請輸入執行期間
              </div>
            </div>
          </div>
          <div class="booking_block">
            <div>數量<span class="necessary">*</span></div>
            <div class="booking_quantity">
              <div class="booking_quantity_content">
                <input
                  v-restrict.number
                  v-model.number="product.quantity"
                  placeholder="- -"
                  widthType="78"
                  class="mr-3"
                  :class="{
                    error_message_border: v$.quantity.$error
                  }"
                  :disabled="!product.productName"
                  @keypress="isNumber($event)"
                  @focus="$event.target.select()"
                  @blur="onChangePrice"
                />
                <SelectDropdown
                  class="input_field"
                  :options="unitOptions"
                  :value="unitLabel"
                  :optionsAllData="true"
                  @value-changed="onChangeUnit"
                />
                <span class="ml-7 mr-4">贈送</span>
                <SwitchCheckbox
                  v-model="product.free"
                  @change.native="onChangeFree"
                />
              </div>
              <div v-if="v$.quantity.$error" class="error_message">
                {{ v$.quantity.$errors[0].$message }}
              </div>
            </div>
          </div>
          <div
            v-if="product.productName && quantityNotMatch"
            class="booking_quantity_warning"
          >
            <icon iconName="icon-info-warmgray" size="14" class="mr-1" />
            <span>數量與執行期間不符，系統將不自動預約檔期</span>
          </div>
        </div>
        <div
          class="booking_center_content"
          :class="{ loading: isPriceLoading }"
        >
          <div>
            <span>
              <div class="d-inline">成交金額(未稅)</div>
              <div class="necessary d-inline">*</div>
            </span>
            <span>
              <input
                v-restrict.number
                v-model.number="product.price"
                widthType="122"
                placeholder="請輸入"
                :class="{ error_message_border: v$.price.$error }"
                :disabled="
                  isPriceLoading ||
                    !product.quotationStartDate ||
                    !product.quantity ||
                    product.free > 0
                "
                @focus="$event.target.select()"
                @blur="onChangePrice"
                @keyup.enter="onChangePrice"
              />
              <div v-if="v$.price.$error" class="pl-0 error_message">
                {{ v$.price.$errors[0].$message }}
              </div>
            </span>
            <span class="unit">元</span>
          </div>
          <div>
            <span>成交單價(未稅)</span>
            <span>{{ unitPriceLabel }}</span>
            <span class="unit">元/天</span>
          </div>
          <div>
            <span>牌價(未稅)</span>
            <span>{{ marketPriceLabel }}</span>
            <span class="unit">元/天</span>
          </div>
          <div>
            <span>商品折扣</span>
            <span>{{ product.discountPercentage || "- -" }}</span>
            <span class="unit">折</span>
          </div>
          <div class="flex-wrap">
            <span>底價(未稅)</span>
            <span>{{ floorPriceLabel }}</span>
            <span class="unit">元/天</span>
            <span
              v-if="!product.free && product.price < product.floorPrice"
              class="waring pl-0 mt-1 w-100 text-right"
              >成交價低於底價</span
            >
          </div>
          <Loading v-if="isPriceLoading" class="loading_container" />
        </div>
        <div v-if="status === 'edit'" class="booking_right_content">
          <!-- 編輯狀態刪除 -->
          <div>
            <icon
              iconName="btn-close"
              @click.native.stop="removeProduct"
              size="16"
            />
          </div>
        </div>
      </div>
      <!-- 草稿狀態新增、刪除 -->
      <div v-if="!editType" class="booking_create">
        <div class="ml-auto">
          <icon
            iconName="icon-icon-expand-more-x"
            size="28"
            @click.native.stop="removeProduct"
          />
          <icon
            v-if="canCreate"
            iconName="icon-icon-expand-less"
            size="28"
            class="ml-2"
            :class="{ not_allow: !product.productName }"
            @click.native="createProduct"
          />
        </div>
      </div>
    </div>

    <SettingSale
      ref="settingSale"
      :product="product"
      :settingSaleStatus="isSettingOpened"
      :closeSettingSale="closeSettingSaleDialog"
      :saveSetting="saveSetting"
    />
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref } from "vue";
import { useProductStore } from "@/stores/product.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { calcDiffDays } from "@/utils/report/util.js";
import { round } from "@/utils/quotation.js";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import DatePicker from "@/components/DatePicker.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import SettingSale from "@/components/share/SettingSale.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    SelectDropdown,
    SwitchCheckbox,
    DatePicker,
    SettingSale,
    Loading
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
    status: {
      type: String,
      default: "create"
    },
    editType: {
      type: String,
      default: ""
    },
    editing: {
      type: Boolean,
      default: false
    },
    canCreate: {
      type: Boolean
    }
  },
  setup(props) {
    const salesOrderStore = useSalesOrderStore();
    const productStore = useProductStore();
    const isHover = ref(false);
    const isSettingOpened = ref(false);
    const settingSale = ref(null);
    const datePicker = ref([]);
    const isPriceLoading = ref(false);

    const rules = computed(() => {
      let productRule = {
        quotationDate: {},
        quantity: {},
        price: {}
      };

      if (props.product.productName) {
        productRule.quotationDate = {
          required: () =>
            props.product.quotationStartDate && props.product.quotationEndDate
        };
        productRule.quantity = {
          required: helpers.withMessage("請輸入數量", required),
          number: helpers.withMessage(
            "請輸入正確數字",
            val => Number(val) > 0 && Number(val) <= 10000
          ),
          quantityGtDuration: helpers.withMessage(
            "數量大於執行期間",
            () => realQuantity.value <= computingDays.value
          )
        };
        productRule.price = {
          number: helpers.withMessage(
            "請輸入正確數字",
            val => Number(val) >= 0 && Number(val) <= 1000000000
          )
        };

        if (salesOrderStore.quotationData.stage === 1) {
          productRule.price = {
            ...productRule.price,
            ...{
              required: helpers.withMessage("請輸入金額", required),
              format: helpers.withMessage(
                "請輸入正確數字",
                () =>
                  (props.product.free == 0 && props.product.price > 0) ||
                  props.product.free == 1
              )
            }
          };
        }
      }

      return productRule;
    });

    const v$ = useVuelidate(rules, props.product, {
      $autoDirty: true
    });

    // 牌價(未稅)
    const marketPriceLabel = computed(() => {
      return props.product.marketPrice?.toLocaleString() ?? "- -";
    });
    // 成交單價(未稅)
    const unitPriceLabel = computed(() => {
      return props.product.unitPrice?.toLocaleString() ?? "- -";
    });
    // 底價(未稅)
    const floorPriceLabel = computed(() => {
      return props.product.floorPrice?.toLocaleString() ?? "- -";
    });

    // 商品名稱
    const searchedProductOptions = ref([]);
    const selectedProduct = computed(() => {
      if (!props.product.productName) return "";
      return (
        searchedProductOptions.value.find(
          option => option.value === props.product.productId
        )?.label ?? ""
      );
    });

    // 單位選項
    const unitOptions = ref([
      { label: "週", value: "WEEK" },
      { label: "天", value: "DAY" }
    ]);
    // 單位轉換中文
    const unitLabel = computed(() => {
      if (props.product.unit === "DAY") return "天";
      else if (props.product.unit === "WEEK") return "週";
    });

    // 計算天數
    const computingDays = computed(() => {
      if (!props.product.quotationStartDate || !props.product.quotationEndDate)
        return 0;
      return calcDiffDays(
        props.product.quotationStartDate,
        props.product.quotationEndDate
      );
    });

    // 計算週
    // const computingWeek = computed(() => {
    //   if (!product.quotationStartDate || !product.quotationEndDate) return 0;
    //   return Math.floor(
    //     calcDiffDays(product.quotationStartDate, product.quotationEndDate) / 7
    //   );
    // });

    // 實際數量
    const realQuantity = computed(() => {
      if (props.product.unit === "WEEK") return props.product.quantity * 7;
      else return props.product.quantity;
    });

    // 數量、日期不符合
    const quantityNotMatch = computed(() => {
      // if (product.unit === "WEEK") {
      //   return computingWeek.value !== realQuantity.value;
      // } else {
      //   return computingDays.value !== realQuantity.value;
      // }
      return computingDays.value !== realQuantity.value;
    });

    // 新增專案內的商品
    const createProduct = async () => {
      if (!props.product.productName) return;
      const newId = salesOrderStore.createProduct(props.project.tempId);

      await nextTick();

      let anchor = document.querySelector(`#product_block_${newId}`);

      window.scrollTo({
        top: anchor.offsetTop,
        behavior: "smooth"
      });
    };

    // 刪除專案內的商品
    const removeProduct = () => {
      salesOrderStore.removeProduct(props.project.tempId, props.product.tempId);
    };

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
    const onChangeProduct = data => {
      if (!data) return;
      props.product.productId = data.value;
      props.product.productName = data.label;
      props.product.type = data.type;
      props.product.marketPrice = round(
        data.listPriceTaxFree / data.actualQuantity,
        1
      );
      props.product.floorPrice = data.floorPrice;
      onChangePrice();
    };

    // 執行期間
    const getTime = time => {
      props.product.quotationStartDate = time.searchTimeStart;
      props.product.quotationEndDate = time.searchTimeEnd;
    };

    // 輸入爲數字
    const isNumber = evt => {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    };

    // 切換單位
    const onChangeUnit = data => {
      props.product.unit = data.value;
      onChangePrice();
    };

    // 更改贈送
    const onChangeFree = e => {
      if (e.target.checked) {
        props.product.price = 0;
        onChangePrice();
      }
    };

    // 更改金額
    const onChangePrice = async () => {
      if (
        !props.product.quotationStartDate ||
        !props.product.quantity ||
        !props.product.price
      )
        return;
      if (props.product.price > 1000000000) props.product.price = 1000000000;
      let params = {
        free: props.product.free ? 1 : 0,
        price: props.product.price || 0,
        productId: props.product.productId,
        quantity: props.product.quantity,
        unit: props.product.unit
      };
      isPriceLoading.value = true;
      try {
        salesOrderStore.getCalPrice();
        const priceInfo = await productStore.getCalculatePrice(params);
        props.product.marketPrice = priceInfo.marketPrice;
        props.product.floorPrice = priceInfo.floorPrice;
        props.product.unitPrice = round(priceInfo.unitPrice, 1);
        props.product.discountPercentage = priceInfo.discountPercentage;
      } catch (err) {
        props.product.price = 0;
      } finally {
        isPriceLoading.value = false;
      }
    };

    // 打開設定銷用內容
    const openSettingSaleDialog = () => {
      if (!props.product.productName) return;
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
      let tempProduct = salesOrderStore.getSpecifiedProduct(
        props.project.tempId,
        props.product.tempId
      );

      if (!tempProduct) return;

      Object.entries(data).forEach(([key, value]) => {
        tempProduct[key] = value;
      });
    };

    onMounted(() => {
      if (props.product.quotationStartDate) {
        datePicker.value.dateValue = [
          props.product.quotationStartDate,
          props.product.quotationEndDate
        ];
      }
    });

    return {
      v$,
      isHover,
      isSettingOpened,
      settingSale,
      datePicker,
      isPriceLoading,
      marketPriceLabel,
      unitPriceLabel,
      floorPriceLabel,
      searchedProductOptions,
      selectedProduct,
      unitOptions,
      unitLabel,
      computingDays,
      // computingWeek,
      realQuantity,
      quantityNotMatch,
      createProduct,
      removeProduct,
      productSuggest,
      onChangeProduct,
      getTime,
      isNumber,
      onChangeUnit,
      onChangeFree,
      onChangePrice,
      openSettingSaleDialog,
      closeSettingSaleDialog,
      saveSetting
    };
  }
};
</script>

<style lang="scss" scoped>
.waring {
  color: #ea475b;
  font-size: 14px;
  font-weight: bold;
}

.booking_main {
  display: flex;
}

.booking_content {
  padding: 16px 0 16px 12px;
  border-bottom: 1px solid #ddd;
  display: flex;

  .booking_left_content {
    width: 583px;

    > div {
      display: flex;
      align-items: flex-start;
      padding-bottom: 16px;

      &.booking_block {
        align-items: flex-start;

        > div {
          &:nth-child(1) {
            padding-top: 10px;
          }
        }
      }

      > div {
        &:nth-child(1) {
          width: 98px;
          padding: 8px 20px 0 0;
          text-align: right;
        }

        &.product_name {
          ::v-deep .el-select {
            width: 380px;
          }

          img {
            cursor: pointer;
          }
        }

        &.booking_datePicker {
          ::v-deep .el-date-editor {
            width: 380px;
          }
        }

        &.booking_quantity {
          ::v-deep .el-select {
            width: 60px;
          }

          .booking_quantity_content {
            display: inline-flex;
            align-items: center;
          }
        }
      }

      &:nth-child(3) {
        padding-bottom: 0;
      }
    }

    .booking_quantity_warning {
      display: flex;
      align-items: center;
      padding-top: 16px;
      padding-bottom: 0;
      @include font-common(14px, $font-weight-normal, $gray-700);
    }
  }

  .booking_center_content {
    position: relative;
    width: 306px;
    &.loading {
      opacity: 0.5;
    }

    .loading_container {
      position: absolute;
      top: 0%;
      left: 60%;
    }

    .unit {
      min-width: 36px;
      margin-left: auto;
      @include font-common(14px, $font-weight-normal, $gray-700);
      text-align: right;
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      margin-top: 8px;
      margin-left: auto;

      &:nth-child(1) {
        margin-top: 0;
      }

      span {
        &:first-child {
          font-weight: bold;
          width: 140px;
          padding-right: 20px;
          text-align: right;
        }

        &:nth-child(2) {
          flex: 1;
          text-align: right;
          margin-right: 8px;
        }
      }
    }
  }
}

.booking_create {
  display: flex;
  justify-content: space-between;
  padding: 16px 0 16px 12px;

  img {
    cursor: pointer;
  }

  .not_allow {
    cursor: not-allowed;
  }
}

.booking_right_content {
  display: inline-flex;
  align-items: center;
  width: 28px;
  margin-left: 12px;

  img {
    cursor: pointer;
  }
}
</style>
