<template>
  <div
    :id="`otherQuote_block_${product.tempId}`"
    :class="{
      commodity_booking_edit:
        $route.name === 'EditSalesOrder' && product.type !== 'draft'
    }"
    class="commodity_main"
  >
    <div class="w-100">
      <div class="commodity_content">
        <div class="commodity_left_content">
          <div>
            <span>
              <div class="d-inline">商品名稱</div>
              <div class="necessary d-inline">*</div>
            </span>
            <span>
              <SelectDropdown
                :value="product.productName"
                :options="searchedProductOptions"
                placeholder="請輸入"
                :asncSearchCb="productSuggest"
                :filterable="true"
                :remote="true"
                :optionsAllData="true"
                :disabled="product.id ? true : false"
                type="getOtherProductRecommend"
                @value-changed="onChangeProduct"
                @set-history-record="searchedProductOptions = $event"
              />
            </span>
          </div>
          <div>
            <span>
              <div class="d-inline">對外名稱</div>
              <div class="necessary d-inline">*</div>
            </span>
            <span>
              <input
                v-model="product.externalName"
                :disabled="!product.productName"
                placeholder="請輸入"
                widthType="380"
              />
              <div v-if="v$.externalName.$error" class="error_message">
                {{ v$.externalName.$errors[0].$message }}
              </div>
            </span>
          </div>
          <div>
            <span>
              <div class="d-inline">執行期間</div>
              <div class="necessary d-inline">*</div>
            </span>
            <span>
              <DatePicker
                class="input_field"
                ref="datePicker"
                :getSearchTime="getTime"
                :itemIndex="1"
                :dateItemIndex="1"
                :disabled="!product.productName"
              />
              <div v-if="v$.quotationDate.$error" class="error_message">
                請輸入執行期間
              </div>
            </span>
          </div>
          <div>
            <span>
              <div class="d-inline">數量</div>
              <div class="necessary d-inline">*</div>
            </span>
            <span>
              <input
                v-restrict.number
                v-model="product.quantity"
                :disabled="!product.productName"
                placeholder="- -"
                widthType="60"
                class="mr-3"
                @focus="$event.target.select()"
                @blur="onChangePrice"
                @keyup.enter="onChangePrice"
              />
              <span class="ml-7 mr-4">贈送</span>
              <SwitchCheckbox
                v-model="product.free"
                :disabled="!product.productName"
                @change.native="onChangeFree"
              />
              <div v-if="v$.quantity.$error" class="error_message">
                {{ v$.quantity.$errors[0].$message }}
              </div>
            </span>
          </div>
          <div>
            <span>內容</span>
            <span>
              <el-input
                v-model="product.note"
                :autosize="{ minRows: 4 }"
                :disabled="!product.productName"
                type="textarea"
                placeholder="請輸入"
                maxlength="500"
                class="input_field"
                show-word-limit
              />
            </span>
          </div>
        </div>
        <div class="commodity_center_content">
          <div>
            <span>成交金額(未稅)<span class="necessary">*</span></span>
            <span>
              <input
                v-restrict.number
                v-model.number="product.price"
                :disabled="
                  !product.productName ||
                    isPriceLoading ||
                    !product.quotationStartDate ||
                    !product.quantity ||
                    product.free > 0
                "
                widthType="122"
                placeholder="請輸入"
                @focus="$event.target.select()"
                @blur="onChangePrice"
                @keyup.enter="onChangePrice"
              />
              <div v-if="v$.price.$error" class="pl-0 error_message">
                {{ v$.price.$errors[0].$message }}
              </div>
            </span>
          </div>
          <div>
            <span>成交單價(未稅)</span>
            <span>{{ unitPriceLabel }}</span>
            <span class="unit">元/天</span>
          </div>
          <div>
            <span>
              <div class="d-inline">牌價(未稅)</div>
              <div class="necessary d-inline">*</div>
            </span>
            <span>
              <input
                v-restrict.number
                v-model.number="product.marketPrice"
                :disabled="
                  !product.productName ||
                    isPriceLoading ||
                    !product.quotationStartDate ||
                    !product.quantity ||
                    product.free > 0
                "
                widthType="122"
                placeholder="請輸入"
                @focus="$event.target.select()"
                @blur="onChangePrice"
                @keyup.enter="onChangePrice"
              />
              <div v-if="v$.marketPrice.$error" class="pl-0 error_message">
                {{ v$.marketPrice.$errors[0].$message }}
              </div>
            </span>
          </div>
          <div>
            <span>成本小計(未稅)</span>
            <span>
              <input
                v-restrict.number
                v-model.number="product.costPrice"
                :disabled="
                  !product.productName ||
                    isPriceLoading ||
                    !product.quotationStartDate ||
                    !product.quantity ||
                    product.free > 0
                "
                widthType="122"
                placeholder="請輸入"
                @focus="$event.target.select()"
                @blur="onChangePrice"
                @keyup.enter="onChangePrice"
              />
              <div v-if="v$.costPrice.$error" class="pl-0 error_message">
                {{ v$.costPrice.$errors[0].$message }}
              </div>
            </span>
          </div>
          <div>
            <span>成本佔比</span>
            <span>{{ costPercentLabel }}</span>
            <span class="unit">%</span>
          </div>
          <Loading v-if="isPriceLoading" class="loading_container" />
        </div>
        <div v-if="status !== 'create'" class="commodity_right_content">
          <div>
            <icon
              iconName="btn-close"
              size="16"
              @click.native.stop="removeProduct"
            />
          </div>
        </div>
      </div>
      <div class="booking_create" v-if="status === 'draft'">
        <icon
          iconName="icon-icon-expand-more-x"
          @click="deleteOtherQuote(product.tempId)"
        />
        <icon
          v-if="canCreate"
          iconName="icon-icon-expand-less"
          class="ml-2"
          :disabled="!product.productName"
          @click="createProduct"
        />
      </div>
    </div>

    <!-- 草稿狀態新增、刪除 -->
    <div class="booking_create">
      <div class="ml-auto">
        <icon
          v-if="status === 'create'"
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
</template>

<script>
import { ref, computed, nextTick, onMounted } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useProductStore } from "@/stores/product.js";
import { round } from "@/utils/quotation.js";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, helpers } from "@vuelidate/validators";
import DatePicker from "@/components/DatePicker.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    DatePicker,
    SwitchCheckbox,
    SelectDropdown,
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
    canCreate: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const salesOrderStore = useSalesOrderStore();
    const productStore = useProductStore();
    // 商品名稱
    const searchedProductOptions = ref([]);
    const datePicker = ref([]);
    const isPriceLoading = ref(false);
    const selectedProduct = computed(() => {
      if (!props.product.productName) return "";
      return (
        searchedProductOptions.value.find(
          option => option.value === props.product.productId
        )?.label ?? ""
      );
    });

    // 取得商品選項
    const productSuggest = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        try {
          const responseData = await productStore.getProductList(keyword, 2);
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

    const rules = computed(() => {
      let productRule = {
        externalName: {},
        quotationDate: {},
        quantity: {},
        price: {},
        marketPrice: {},
        costPrice: {}
      };

      if (props.product.productName) {
        productRule.externalName = {
          maxLength: helpers.withMessage("字數超過上限", maxLength(20))
        };
        productRule.quotationDate = {
          required: () =>
            props.product.quotationStartDate && props.product.quotationEndDate
        };
        productRule.quantity = {
          required: helpers.withMessage("請輸入數量", required),
          number: helpers.withMessage(
            "請輸入正確數字",
            val => Number(val) > 0 && Number(val) <= 10000000
          )
        };
        productRule.price = {
          number: helpers.withMessage(
            "請輸入正確數字",
            val => Number(val) >= 0 && Number(val) <= 1000000000
          )
        };
        productRule.marketPrice = {
          number: helpers.withMessage(
            "請輸入正確數字",
            val => Number(val) >= 0 && Number(val) <= 1000000000
          )
        };
        productRule.costPrice = {
          number: helpers.withMessage(
            "請輸入正確數字",
            val => Number(val) >= 0 && Number(val) <= 1000000000
          )
        };

        if (salesOrderStore.quotationData.stage === 1) {
          productRule.externalName.required = helpers.withMessage(
            "請輸入此欄位",
            required
          );
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
      props.product.externalName = data.name;
      onChangePrice();
    };

    // 更改贈送
    const onChangeFree = e => {
      if (e.target.checked) {
        props.product.price = 0;
        props.product.costPrice = 0;
        onChangePrice();
      }
    };

    // 更改成交金額
    const onChangePrice = async () => {
      if (
        !props.product.quotationStartDate ||
        !props.product.quantity ||
        props.product.price === null ||
        props.product.marketPrice === null ||
        props.product.costPrice === null
      )
        return;

      if (props.product.price > 1000000000) props.product.price = 1000000000;
      if (props.product.marketPrice > 1000000000)
        props.product.marketPrice = 1000000000;
      if (props.product.costPrice > 1000000000)
        props.product.costPrice = 1000000000;
      let params = {
        free: props.product.free ? 1 : 0,
        price: props.product.price || 0,
        productId: props.product.productId,
        quantity: props.product.quantity,
        unit: props.product.unit,
        marketPrice: props.product.marketPrice,
        costPrice: props.product.costPrice,
        floorPrice: props.product.floorPrice
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

    // 執行期間
    const getTime = time => {
      props.product.quotationStartDate = time.searchTimeStart;
      props.product.quotationEndDate = time.searchTimeEnd;
    };

    // 成交單價(未稅)
    const unitPriceLabel = computed(() => {
      return props.product.unitPrice?.toLocaleString() ?? "- -";
    });

    // 成本佔比(未稅)
    const costPercentLabel = computed(() => {
      if (props.product.price <= 0) return "- -";
      else
        return round(
          (props.product.costPrice / props.product.price) * 100,
          1
        ).toLocaleString();
    });

    // 新增其他類型商品
    const createProduct = async () => {
      if (!props.product.productName) return;
      const newId = salesOrderStore.createOtherProduct(props.project.tempId);

      await nextTick();
      let anchor = document.querySelector(`#otherQuote_block_${newId}`);
      window.scrollTo({
        top: anchor.offsetTop,
        behavior: "smooth"
      });
    };

    // 刪除專案內的商品
    const removeProduct = () => {
      salesOrderStore.removeProduct(props.project.tempId, props.product.tempId);
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
      searchedProductOptions,
      selectedProduct,
      unitPriceLabel,
      costPercentLabel,
      datePicker,
      isPriceLoading,
      productSuggest,
      onChangeFree,
      onChangeProduct,
      onChangePrice,
      getTime,
      createProduct,
      removeProduct
    };
  }
};
</script>

<style lang="scss" scoped>
.commodity_main {
  display: flex;
  flex-wrap: wrap;

  .commodity_content {
    padding: 16px 0 16px 12px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;

    .commodity_left_content {
      width: 583px;

      > div {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        span {
          &:nth-child(1) {
            width: 98px;
            padding-right: 12px;
            text-align: right;
          }

          ::v-deep .el-select {
            width: 380px;
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

            ::v-deep .el-date-editor {
              width: 380px;
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
      position: relative;

      .loading_container {
        position: absolute;
        top: -23%;
        left: 60%;
      }

      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        margin-top: 8px;

        &:nth-child(1) {
          margin-top: 0;

          span {
            &:last-child {
              &::after {
                content: "";
                margin-left: 0;
              }
            }
          }
        }

        span {
          &:first-child {
            font-weight: bold;
            width: 140px;
            padding-right: 28px;
            text-align: right;
          }
          &:nth-child(2) {
            flex: 1;
            text-align: right;
          }
        }
      }
    }

    .unit {
      min-width: 38px;
      margin-left: auto;
      @include font-common(14px, $font-weight-normal, $gray-700);
      text-align: right;
    }
  }

  .booking_create {
    width: 100%;
    text-align: right;
    padding-top: 16px;

    img {
      cursor: pointer;
    }

    .not_allow {
      cursor: not-allowed;
    }
  }

  .commodity_right_content {
    display: inline-flex;
    align-items: center;

    > div {
      width: 40px;
      text-align: center;

      img {
        cursor: pointer;
      }
    }
  }
}
</style>
