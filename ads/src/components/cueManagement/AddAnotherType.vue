<template>
  <div>
    <div class="other_types_main">
      <div class="other_types_block">
        <div>商品名稱<span class="necessary">*</span></div>
        <div class="product_block">
          <SelectDropdown
            :value="otherTypesData.productName"
            :options="searchedProductOptions"
            placeholder="請輸入"
            :asncSearchCb="productSuggest"
            :filterable="true"
            :remote="true"
            :optionsAllData="true"
            type="getProductRecommend"
            @value-changed="onChangeProduct"
            @set-history-record="searchedProductOptions = $event"
          />
        </div>
      </div>
      <div class="other_types_block">
        <div>對外名稱<span class="necessary">*</span></div>
        <div>
          <input
            v-model="otherTypesData.externalName"
            type="text"
            widthType="480"
            placeholder="請輸入"
          />
        </div>
      </div>
      <div class="other_types_block">
        <div>執行期間<span class="necessary">*</span></div>
        <div>
          <DatePicker ref="date_Picker" :getSearchTime="getTime" />
        </div>
      </div>
      <div class="other_types_block">
        <div>購買數量<span class="necessary">*</span></div>
        <div class="d-flex align-items-center">
          <input
            v-model="otherTypesData.quantity"
            type="text"
            widthType="122"
            placeholder="請輸入"
          />
          <SelectDropdown
            class="input_field ml-2"
            :options="unitOptions"
            :value="unitLabel"
            :optionsAllData="true"
            @value-changed="onChangeUnit"
          />
          <span class="ml-7 mr-4">贈送</span>
          <SwitchCheckbox v-model="otherTypesData.free" />
        </div>
      </div>
      <div class="other_types_block">
        <div>成交金額(未稅)<span class="necessary">*</span></div>
        <div>
          <input
            v-model="otherTypesData.priceIncludeTax"
            type="text"
            widthType="122"
            placeholder="請輸入"
          />
        </div>
        <div>成交單價(未稅)</div>
        <div>
          {{
            otherTypesData.priceIncludeTax && otherTypesData.quantity
              ? `${otherTypesData.priceIncludeTax / otherTypesData.quantity}`
              : "- -"
          }}<span class="ml-2 unit">元/天</span>
        </div>
      </div>
      <div class="other_types_block">
        <div>牌價(未稅)<span class="necessary">*</span></div>
        <div>
          <input
            v-model="otherTypesData.marketPriceIncludeTax"
            type="text"
            widthType="122"
            placeholder="請輸入"
          />
        </div>
      </div>
      <div class="other_types_block">
        <div>成本小計(未稅)<span class="necessary">*</span></div>
        <div>
          <input
            v-model="otherTypesData.costPriceIncludeTax"
            type="text"
            widthType="122"
            placeholder="請輸入"
          />
        </div>
      </div>
      <div class="other_types_block">
        <div>成本佔比</div>
        <div>
          {{
            otherTypesData.costPriceIncludeTax && otherTypesData.priceIncludeTax
              ? `${round(
                  (otherTypesData.costPriceIncludeTax /
                    otherTypesData.priceIncludeTax) *
                    100,
                  1
                )}`
              : "- -"
          }}%
        </div>
      </div>
      <div class="other_types_block note_block">
        <div>備註</div>
        <div class="note">
          <el-input
            v-model="otherTypesData.note"
            :autosize="{ minRows: 4 }"
            type="textarea"
            placeholder="請輸入"
            maxlength="1500"
            class="input_field"
            show-word-limit
          />
        </div>
      </div>
    </div>
    <button
      class="button_bg_blue_large"
      :disabled="
        !otherTypesData.productName ||
          !otherTypesData.externalName ||
          !otherTypesData.quantity ||
          !otherTypesData.priceIncludeTax ||
          !otherTypesData.costPriceIncludeTax ||
          !otherTypesData.startDate ||
          !otherTypesData.marketPriceIncludeTax
      "
      @click="saveOtherTypes"
    >
      確定
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePullCueStore } from "@/stores/pullCue.js";
import { useProductStore } from "@/stores/product.js";
import { round } from "@/utils/quotation";
import DatePicker from "@/components/DatePicker.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";

const props = defineProps({
  closeCreateOtherTypes: {
    type: Function,
    default: () => {}
  }
});
const pullCueStore = usePullCueStore();
const productStore = useProductStore();
const { postCueProjectId, getCueQuotationProjectId } = pullCueStore;
const productId = computed(() => pullCueStore.projectId);
const projectId = computed(() => pullCueStore.otherQuotationProject.projectId);
// 單位轉換中文
const unitLabel = computed(() => {
  if (otherTypesData.value.unit === "DAY") return "天";
  else if (otherTypesData.value.unit === "WEEK") return "週";
});

const otherTypesData = ref({
  productName: null,
  externalName: null,
  startDate: null,
  endDate: null,
  quantity: null,
  priceIncludeTax: null,
  marketPriceIncludeTax: null,
  costPriceIncludeTax: null,
  note: null,
  unit: "WEEK",
  free: false,
  productId: null,
  projectId: projectId.value
});
const searchedProductOptions = ref([]);

const unitOptions = [
  { label: "週", value: "WEEK" },
  { label: "天", value: "DAY" }
];

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

// 變更商品
const onChangeProduct = data => {
  if (!data) return;
  otherTypesData.value.productId = data.value;
  otherTypesData.value.productName = data.label;
};

// 切換單位
const onChangeUnit = data => {
  otherTypesData.value.unit = data.value;
};

// 執行時間
const getTime = time => {
  otherTypesData.value.startDate = time.searchTimeStart;
  otherTypesData.value.endDate = time.searchTimeEnd;
};

// 確定
const saveOtherTypes = () => {
  postCueProjectId(otherTypesData.value).then(() => {
    getCueQuotationProjectId({ id: productId.value });
    props.closeCreateOtherTypes();
  });
};
</script>

<style lang="scss" scoped>
.other_types_main {
  width: 710px;
  border-bottom: 1px solid #eee;
  padding-bottom: 32px;
  margin: 10px auto 30px;

  .other_types_block {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #333;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .product_block {
      width: 480px;
    }

    &.note_block {
      align-items: flex-start;

      > div {
        &:nth-child(1) {
          padding-top: 4px;
        }
      }
    }

    > div {
      &:nth-child(1) {
        width: 130px;
        margin-right: 28px;
      }
      &:nth-child(3) {
        margin: 0 28px;
      }

      &.note {
        width: 570px;

        .input_field {
          width: 100%;

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

      .input_field {
        width: 70px;
      }

      .unit {
        color: #7e7e7e;
        font-size: 14px;
      }
    }
  }
}

button {
  display: block;
  margin: 0 auto;
}
</style>
