<template>
  <section>
    <h2>{{ title }}</h2>
    <div class="select_type">
      <label class="ad-radio-label">
        <input
          v-model="type"
          :value="1"
          :disabled="$route.path === '/productedit'"
          @change="changeType"
          type="radio"
          name="type"
        />
        <span class="ad-radio"></span>banner廣告
      </label>
      <label class="ad-radio-label">
        <input
          v-model="type"
          :value="2"
          :disabled="$route.path === '/productedit'"
          @change="changeType"
          type="radio"
          name="type"
        />
        <span class="ad-radio"></span>專案型
      </label>
    </div>
    <div class="product_name_block">
      <div class="product_name_top_block">
        <span>商品<span class="necessary">*</span></span>
        <span v-if="$route.path !== '/productedit'" class="w480">
          <SelectDropdown
            data-e2e="product"
            @value-changed="setSelectedProduct($event)"
            :value="formData.selectedProduct.name"
            :options="formData.searchedProductOptions"
            :asncSearchCb="productSearch"
            :filterable="true"
            :remote="true"
            :optionsAllData="true"
            :class="{
              error_message_border: v$.$error && v$.selectedProduct.name.$error
            }"
            placeholder="請輸入商品"
          />
        </span>
        <span v-if="$route.path === '/productedit'">
          {{ formData.selectedProduct.name }}
        </span>
        <button
          v-if="$route.path !== '/productedit' && !synchronizeLoading"
          @click="synchronizedProducts"
          class="synchronized_products button_bg_white_medium"
        >
          手動同步商品
        </button>
        <span
          v-if="$route.path !== '/productedit' && synchronizeLoading"
          class="loading"
        >
          <Loading :size="24" />
        </span>
        <img
          v-if="$route.path !== '/productedit' && !synchronizeLoading"
          v-tooltip="{
            content: '當您找不到商品請手動同步商品',
            placement: 'right',
            triggers: ['hover']
          }"
          src="@/assets/icon/icon-info-warmgray.svg"
        />
      </div>
      <div class="product-error">
        <ValidationError :vData="v$.selectedProduct.name" text="請選擇商品" />
      </div>
    </div>

    <!-- 若資料都已清空，獨立新增的按鈕 -->
    <div
      v-if="formData.productData.boards.length < 1 && type === '1'"
      class="creat_button_block"
    >
      <span @click="creatProduct(0)" class="creat_button"> + </span>
    </div>

    <div v-if="type === '1'">
      <div v-for="(item, index) in formData.productData.boards" :key="item.id">
        <div class="website_block">
          <ProductBoard
            @changeBoardsData="changeBoardsData"
            @changeSort="changeSort"
            @changeQuantity="changeQuantity"
            :item="item"
            :index="index"
            :productCode="formData.productData.productCode"
            :disabled="formData.productData.boards.length < 2"
            :v="v$.productData.boards"
          />
        </div>
        <div class="edit_button_block">
          <img
            @click="deleteWebsite(index)"
            src="@/assets/icon/material-icons-black-expand-more-x.svg"
          />
          <img
            v-if="formData.productData.boards.length === index + 1"
            @click="creatProduct(item.id + 1)"
            src="@/assets/icon/material-icons-black-expand-less.svg"
          />
        </div>
      </div>
    </div>

    <div class="button_block">
      <button @click="handleCancel" class="button_bg_white_large">取消</button>
      <button @click="handleSave" class="button_bg_blue_large">儲存</button>
    </div>

    <Dialog
      v-if="added"
      :showDialog="added"
      title="已新增商品。"
      content="您已完成新增商品。"
    />

    <Dialog
      v-if="showBind"
      :closeFunc="closeBindDialog"
      :showDialog="showBind"
      title="此商品已與版位綁定"
      content="此商品已與版位綁定設定過，本次修改會異動商品與版位設定"
    />
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import useMixins from "@/mixins/useMixins.js";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Dialog from "@/components/Dialog.vue";
import ProductBoard from "@/components/productEdit/ProductBoard.vue";
import ValidationError from "@/components/ValidationError.vue";
import Loading from "@/components/Loading.vue";
import SelectDropdown from "@/components/SelectDropdown.vue";
import { EventBus } from "@/utils/eventBus.js";
import { encodeHandler } from "@/utils/keywordEncode";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/storesPinia/product.js";

const route = useRoute();
const { jump } = useMixins();
const productStore = useProductStore();
const { productId } = storeToRefs(productStore);
const { getProductMisSuggest, putProduct, getProductCode, putProductMisSync } =
  productStore;

const getProductIdData = computed(() => productId.value);
const title = ref("商品與版位關聯維護");
const added = ref(false);
const formData = reactive({
  selectedProduct: { name: "", productCode: "" },
  searchedProductOptions: [],
  productData: {
    boards: [],
    productCode: "",
    name: "",
    status: false,
    floorPrice: 10000
  }
});
const synchronizeLoading = ref(false);
const type = ref(route.query.type || "1");
const showBind = ref(false);
const rules = {
  selectedProduct: { name: { required } },
  productData: {
    boards: {
      $each: helpers.forEach({
        device: { required },
        siteId: { required },
        channelId: { required },
        boardId: { required },
        quantity: { required },
        sortValue: {
          required: (value, index, array) => {
            return array.boards.some(board => board.sortValue.length !== 0);
          }
        }
      })
    }
  }
};
const v$ = useVuelidate(rules, formData);

onMounted(() => {
  if (route.path === "/productedit") title.value = "編輯商品與版位關聯";
  productDataInit(getProductIdData.value);
});

const productDataInit = data => {
  formData.productData.name = data.name;
  formData.productData.productCode = data.productCode;
  formData.selectedProduct.name = data.name;
  formData.selectedProduct.productCode = data.productCode;

  if (data.boardList.length > 0) {
    data.boardList.forEach((item, index) => {
      formData.productData.boards.push({
        id: index,
        device: item.device,
        siteId: item.siteId,
        siteName: item.siteName,
        channelId: item.channelId,
        channelName: item.channelName,
        boardId: item.id,
        boardName: item.name,
        edit: true,
        sortValue: [item.sort],
        quantity: item.quantity
      });
    });
  } else {
    formData.productData.boards.push({
      id: 0,
      device: "",
      siteId: null,
      siteName: "",
      channelId: null,
      channelName: "",
      boardId: null,
      boardName: "",
      edit: false,
      sortValue: [1],
      quantity: null
    });
  }
};

const setSelectedProduct = async data => {
  const productInput = document.querySelector(
    ".product_name_top_block .el-input__inner"
  );
  productInput.classList.remove("error_message_border");
  formData.selectedProduct = {
    ...formData.searchedProductOptions.find(
      option => option.value === data.value
    )
  };
  await getProductCode({ productCode: data.productCode }).then(res => {
    productInput.blur();
    formData.productData.boards = [];
    if (res.id) {
      showBind.value = true;
      nextTick(() => {
        productDataInit(res);
      });
    } else {
      nextTick(() => {
        productDataInit({
          boardList: [],
          productCode: data.productCode,
          name: data.name
        });
      });
    }
  });
};

const productSearch = async keyword => {
  if (!keyword) return;
  if (keyword.length >= 2) {
    const responseData = await getProductMisSuggest({
      keyword: encodeHandler(keyword),
      type: type.value
    });
    formData.searchedProductOptions = [...responseData].map(item => {
      return {
        ...item,
        value: item.productCode,
        label: item.name
      };
    });
  }
};

// 新增商品版位
const creatProduct = id => {
  formData.productData.boards.push({
    id,
    device: "",
    siteId: null,
    siteName: "",
    channelId: null,
    channelName: "",
    boardId: null,
    boardName: "",
    edit: false,
    sortValue: [],
    quantity: null
  });
};

// 刪除商品版位，只剩一筆則清空資料
const deleteWebsite = index => {
  if (formData.productData.boards.length < 2) {
    const productDataValidation = v$.value.productData.boards;
    EventBus.emit("resetProductBoardData");
    productDataValidation.$reset();
  } else {
    let flag = false;
    if (formData.productData.boards[index].sortValue.length > 0) {
      flag = true;
    }
    formData.productData.boards.splice(index, 1);
    if (flag) formData.productData.boards[0].sortValue = [1];
  }
};

// 取消
const handleCancel = () => {
  jump("/product");
};

// 完成新增
const handleSave = () => {
  const productAcDataValidation = v$.value.selectedProduct;
  productAcDataValidation.$touch();
  const productDataValidation = v$.value.productData.boards;

  if (type.value === "1") productDataValidation.$touch();

  if (v$.value.$error) return;

  if (!productAcDataValidation.name.$error) {
    if (!productDataValidation.$error) {
      formData.productData.boards.forEach(
        board => (board.sort = board.sortValue.length > 0 ? 1 : 0)
      );
    }
    putProduct(formData.productData).then(() => {
      added.value = true;
      setTimeout(() => {
        added.value = false;
        jump("/product");
      }, 3000);
    });
  }
};

// 選擇欄位後的值
const changeBoardsData = (index, value, type) => {
  formData.productData.boards[index][type] = value;
};

// 同步商品
const synchronizedProducts = () => {
  synchronizeLoading.value = true;
  putProductMisSync().then(() => {
    synchronizeLoading.value = false;
  });
};

// 勾選主版位
const changeSort = (index, value) => {
  formData.productData.boards.forEach(item => (item.sortValue = []));
  if (value?.length > 0) formData.productData.boards[index].sortValue = [1];
};

// 輸入預約數
const changeQuantity = (index, value) => {
  formData.productData.boards[index].quantity = value;
};

// 切換類型
const changeType = () => {
  const productAcDataValidation = v$.value.selectedProduct;
  const productDataValidation = v$.value.productData.boards;
  productAcDataValidation.$reset();
  productDataValidation.$reset();
  formData.selectedProduct.name = "";
};

// 關閉商品已綁定版位提示 Dialog
const closeBindDialog = () => {
  showBind.value = false;
};
</script>

<style lang="scss" scoped>
section {
  .select_type {
    margin-top: 24px;

    label {
      cursor: pointer;
      vertical-align: middle;
      letter-spacing: 1.38px;

      span {
        margin-right: 8px;
      }

      &:nth-child(2) {
        margin-left: 80px;
      }
    }
  }

  .product_name_block {
    font-size: 18px;
    letter-spacing: 1px;
    color: #333;
    margin-top: 24px;
    border-bottom: 1px solid #d6d6d6;
    padding-bottom: 24px;

    .product_name_top_block {
      display: flex;
      align-items: center;

      :deep(input) {
        width: 480px;
      }
    }

    span {
      margin-right: 9px;

      &.w480 {
        width: 480px;
      }
    }

    .synchronized_products {
      margin-left: 20px;
      margin-right: 12px;
    }

    .product-error {
      padding-left: 65px;
    }
  }

  .loading {
    .loading_wrapper {
      margin-left: 20px;
    }
  }

  .website_block {
    padding: 24px 0;
    border-bottom: 1px solid #e2e1e1;
  }

  .creat_button_block {
    text-align: right;
    padding-top: 9px;

    span {
      &.creat_button {
        width: 26px;
        height: 26px;
        border: solid 1px #eee;
        background-color: #fff;
        display: inline-flex;
        justify-content: center;
        line-height: 1.3;
        vertical-align: middle;
        font-size: 22px;
        letter-spacing: 0.78px;
        color: #7e7e7e;
        cursor: pointer;
      }
    }
  }

  .edit_button_block {
    text-align: right;
    padding-top: 8px;

    img {
      cursor: pointer;

      &:last-child {
        margin-left: 12px;
      }
    }
  }

  .button_block {
    text-align: center;
    margin-top: 24px;

    button {
      &:first-child {
        margin-right: 20px;
      }
    }
  }
}
</style>
