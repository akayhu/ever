<template>
  <section class="product_search_block">
    <div class="product_search_main">
      <h2>查詢商品與版位關聯</h2>
    </div>
    <div class="ad_product_search">
      <div class="search">
        <span>查詢條件</span>
        <div>
          <div>
            <label class="ad-radio-label">
              <input
                v-model="type"
                @change="changeType"
                :value="1"
                type="radio"
                name="type"
              />
              <span class="ad-radio"></span>banner廣告
            </label>
            <label class="ad-radio-label">
              <input
                v-model="type"
                @change="changeType"
                :value="2"
                type="radio"
                name="type"
              />
              <span class="ad-radio"></span>專案型
            </label>
          </div>
          <input
            v-model="productOrBoardName"
            placeholder="請輸入商品或版位名稱"
            widthType="480"
            @keyup.enter="searchProduct"
          />
        </div>
      </div>
      <div class="button_block">
        <button @click="searchProduct" class="button_bg_blue_large">
          查詢
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const productOrBoardName = ref("");
const status = ref(false);
const type = ref("1");
const { keyword } = route.query;

if (keyword) productOrBoardName.value = keyword;
type.value = route.query?.type || "1";

// 查詢
const searchProduct = () => {
  const keyword = productOrBoardName.value;
  let query = {
    page: 1,
    type: type.value,
    status: status.value
  };

  if (keyword) {
    query = {
      type: type.value,
      keyword
    };
  }

  router.push({ query }).catch(() => {});
};

// 切換條件
const changeType = () => {
  productOrBoardName.value = "";
  searchProduct();
};

watch(
  () => route.query.type,
  newValue => {
    type.value = newValue || "1";
  }
);
</script>

<style lang="scss" scoped>
.product_search_block {
  .ad_product_search {
    display: flex;
    font-size: 16px;
    color: #333;
    margin-top: 24px;

    .search {
      display: flex;

      > span {
        margin-right: 28px;
      }

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

      input {
        margin-top: 16px;
      }
    }

    .button_block {
      display: inline-flex;
      align-items: flex-end;

      .button_bg_blue_large {
        margin-left: 28px;
      }
    }
  }
}
</style>
