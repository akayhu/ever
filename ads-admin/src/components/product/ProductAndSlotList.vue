<template>
  <section class="product_and_slot_list_block">
    <div class="ad_product_title_main">
      <h2>商品與版位關聯</h2>
      <button
        v-if="getUserAuthority.productEdit"
        @click="handleCreate"
        class="button_bg_white_large"
      >
        + 新增
      </button>
    </div>

    <div v-if="productListLoading" class="loading">
      <Loading />
    </div>

    <div v-if="productList.length < 1 && !productListLoading" class="no_data">
      無商品與版位關聯列表資料
    </div>

    <div
      v-if="productList.length > 0 && !productListLoading"
      class="productList_title"
    >
      <div>商品名稱</div>
      <div><span v-if="type === '1'">廣告版位</span></div>
      <div>
        <span @click="getProductSort" class="status">
          狀態<img src="@/assets/icon/icon-move.svg" />
        </span>
      </div>
      <div><span v-if="type === '1'">編輯</span></div>
    </div>

    <template v-if="productList.length > 0 && !productListLoading">
      <div
        v-for="(item, index) in productList"
        :key="index"
        :class="{ last: productList.length - 1 === index }"
        class="productList_content"
      >
        <div class="product_detail">{{ item.name }}</div>
        <div class="product_detail">
          <div v-if="type === '1'">
            <div
              v-for="(boardListItem, boardListIndex) in item.boardList"
              :key="boardListIndex"
            >
              {{ boardListItem.device }}{{ boardListItem.siteName }}/{{
                boardListItem.channelName
              }}/{{ boardListItem.name }}
            </div>
          </div>
        </div>
        <div>{{ item.status ? "生效中" : "未生效/已失效" }}</div>
        <div>
          <img
            v-if="type === '1' && getUserAuthority.productEdit"
            @click="handleEdit(item.id)"
            src="@/assets/icon/edit.svg"
            class="pointer"
          />
          <img
            v-if="type === '1' && !getUserAuthority.productEdit"
            src="@/assets/icon/edit-disable.svg"
          />
        </div>
      </div>
    </template>
    <Pages
      v-if="productList.length > 0"
      :pageData="productListData"
      path="product"
    />

    <div class="bottom_create_block">
      <button
        v-if="getUserAuthority.productEdit"
        @click="handleCreate"
        class="button_bg_white_large"
      >
        + 新增
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import useMixins from "@/mixins/useMixins.js";
import Loading from "@/components/Loading.vue";
import Pages from "@/components/Pages.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useProductStore } from "@/storesPinia/product.js";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const productStore = useProductStore();
const { user } = storeToRefs(userStore);
const { storeProductList } = storeToRefs(productStore);
const { jump } = useMixins();
const getUserStatus = computed(() => user.value);
const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
const productListData = computed(() => storeProductList.value);
const productListLoading = computed(() => storeProductList.value.loading);
const productList = computed(() => storeProductList.value.content);
const sort = ref("status_desc");
const type = computed(() => route.query.type || "1");

// 變更狀態列表
const getProductSort = () => {
  const page = route.query.page;

  sort.value === "status_desc"
    ? (sort.value = "status_asc")
    : (sort.value = "status_desc");

  const query = {
    page: page || 1,
    sort: sort.value
  };

  router.push({ query }).catch(() => {});
};

// 新增
const handleCreate = () => {
  jump("/productadd", `type=${route.query?.type || "1"}`);
};

// 修改
const handleEdit = id => {
  jump("/productedit", `productId=${id}&type=${route.query?.type || "1"}`);
};
</script>

<style lang="scss" scoped>
.product_and_slot_list_block {
  margin-top: 24px;

  .loading {
    text-align: center;
    padding: 150px 0;
  }

  .no_data {
    text-align: center;
    color: #a9a9a9;
    font-size: 20px;
    margin: 150px 0;
  }

  .ad_product_title_main {
    display: flex;
    margin-bottom: 24px;
    justify-content: space-between;
    align-items: center;
  }

  .productList_title {
    > div {
      padding-bottom: 16px;
    }
  }

  .productList {
    &_title,
    &_content {
      display: grid;
      grid-template-columns: 540px 448px 140px 48px;

      > div {
        padding-left: 12px;
        align-items: center;
        letter-spacing: 1px;
        border-bottom: 1px solid #eee;
        line-height: 1.48;

        &.product_detail {
          padding: 12px;
        }

        span,
        img {
          cursor: pointer;
        }

        &:nth-child(1),
        &:nth-child(3),
        &:nth-child(4) {
          display: inline-flex;
        }

        &:nth-child(4) {
          padding-left: 6px;
        }
      }
    }
    &_title {
      font-weight: bold;
    }
    &_content {
      &.last {
        margin-bottom: 24px;
      }
      &:hover {
        > div {
          background-color: #e6f9fa;
        }
      }
    }
  }

  .bottom_create_block {
    text-align: right;
    margin-top: 24px;
  }
}
</style>
