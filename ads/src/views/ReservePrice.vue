<template>
  <div>
    <h2 class="mb-2">底價促案</h2>
    <div class="tab">
      <div @click="setTabType(1)" :class="{ focus: tabType === 1 }">
        底價查詢
      </div>
      <div></div>
      <div @click="setTabType(2)" :class="{ focus: tabType === 2 }">
        版位成效
      </div>
    </div>
    <section class="mb-3">
      <div class="title">
        {{ tabType === 1 ? "查詢底價促案" : "查詢版位成效" }}
      </div>
      <div class="search_year">
        <span class="mr-4">年度</span>
        <span class="mr-10">
          <el-date-picker
            v-model="year"
            @change="quarter = 1"
            type="year"
            placeholder="請輸入"
          />
        </span>
        <span>
          <button
            class="button_bg_blue_large"
            @click="searchYear"
            :disabled="!year"
          >
            確認
          </button>
        </span>
      </div>
    </section>

    <div class="created_button mt-6 mb-6">
      <button
        v-if="tabType === 1"
        class="button_bg_white_large"
        @click="setShowBlock('ReservePriceSetting')"
      >
        新增底價
      </button>
      <button
        v-if="tabType === 2"
        class="button_bg_white_large"
        @click="setShowBlock('BoardEffect')"
      >
        新增版位成效
      </button>
    </div>

    <!-- 版位成效_查看模式(VM版) -->
    <ResultsViewVM
      v-if="tabType === 2 && showBlock === 'ResultsViewVM'"
      :year="year"
    />

    <!-- 新增版位成效_編輯模式(VM版切割版) -->
    <BoardEffect v-if="showBlock === 'BoardEffect'" />

    <!-- 底價查詢_查看模式(Hana版切割版) -->
    <ResultsViewHana
      v-if="tabType === 1 && showBlock === 'ResultsViewHana'"
      :setShowBlock="setShowBlock"
      :year="year"
    />

    <!-- 底價查詢_編輯模式(Hana版切割版) -->
    <ReservePriceSetting v-if="showBlock === 'ReservePriceSetting'" />

    <GoTop />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect.js";
import ResultsViewVM from "@/components/reservePrice/ResultsViewVM.vue";
import BoardEffect from "@/components/reservePrice/BoardEffect.vue";
import ReservePriceSetting from "@/components/reservePrice/ReservePriceSetting.vue";
import ResultsViewHana from "@/components/reservePrice/ResultsViewHana.vue";
import GoTop from "@/components/GoTop.vue";
import moment from "moment";
import { getThisYear } from "@/utils/dateFormat.js";

const productPromoEffectStore = useProductPromoEffectStore();
const {
  getProductEffect,
  changeQuarter,
  getProductPromo,
  resettingProductPromoEffectList,
  getProductPromoId,
  changeProductPromoListId,
  getProductPromoNew
} = productPromoEffectStore;
const productPromoListData = computed(
  () => productPromoEffectStore.productPromoListData
);
const productPromo = computed(() => productPromoEffectStore.productPromo);
const year = ref(`${getThisYear()}`);
const quarter = ref(`${moment().quarter()}`);
const tabType = ref(1);
const showBlock = ref(null);

// 查詢
const searchYear = async () => {
  await resettingProductPromoEffectList();
  const query = {
    year: year.value.length === 4 ? year.value : year.value.getFullYear(),
    quarter: quarter.value,
    auditList: [4, 5]
  };
  if (tabType.value === 1) {
    showBlock.value = "ResultsViewHana";
    changeQuarter(1);
    await getProductPromo(query);
    // 預設打開最新生效日
    if (productPromoListData.value.length > 0) {
      await getProductPromoId({ id: productPromoListData.value[0].id });
      changeProductPromoListId(productPromoListData.value[0].id);
    }
  } else {
    showBlock.value = "ResultsViewVM";
    delete query.auditList;
    await getProductEffect(query);
  }
};

// 新增底價/版位成效
const setShowBlock = async (type, promoNew = true) => {
  showBlock.value = type;

  if (type === "ReservePriceSetting") {
    if (promoNew) {
      // 新增底價
      await resettingProductPromoEffectList();
      await getProductPromoNew({
        year: getThisYear(),
        quarter: moment().quarter()
      });
      await getProductPromoId({ id: productPromo.value.applyId }, true);
    } else {
      await getProductPromoId({
        id: productPromoEffectStore.editProductPromoId
      });
    }
  }
};

// 切換底價查詢/版位成效
const setTabType = type => {
  tabType.value = type;
  showBlock.value = null;
};

onMounted(() => {
  searchYear();
});
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  align-items: center;
  margin: 16px 0;

  div {
    cursor: pointer;
    font-size: 20px;
    line-height: 1.4;
    letter-spacing: 1.4px;
    color: #292929;
    padding: 10px 24px;

    &:nth-child(2) {
      padding: 0;
      border-right: 1px solid #eee;
      height: 28px;
    }

    &.focus {
      color: #00afb8;
    }
  }
}

.title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 28px;
}

.search_year {
  display: flex;
  align-items: center;
}

.created_button {
  text-align: right;
}
</style>
