<template>
  <section class="section" :class="{ after_search_section: isSearchFoled }">
    <div :class="{ w0: isSearchFoled, w100: !isSearchFoled }">
      <h2 class="mb-6">查詢委刊單</h2>
      <div class="d-flex align-items-center">
        <label class="mr-7">訂單單號</label>
        <input
          v-model.lazy="orderId"
          @keyup.enter="getQuotationData"
          @change="getQuotationData"
          placeholder="請輸入訂單單號"
          widthType="220"
        />
        <label class="ml-7 mr-7">專案</label>
        <SelectDropdown
          v-if="!searchLoading"
          @value-changed="setSelectedProject($event)"
          :value="selectedProject"
          :options="searchedProjectOptions"
          :disabled="!orderId"
          :optionsAllData="true"
          :placeholder="
            searchedProjectOptions.length < 1 ? '請先輸入訂單單號' : '請選擇'
          "
        />
        <Loading v-if="searchLoading" size="30" />
        <button
          class="button_bg_blue_large"
          @click="search"
          :disabled="!selectedProject"
        >
          確定
        </button>
      </div>
    </div>

    <div
      class="after_search_block"
      :class="{ w0: !isSearchFoled, w100: isSearchFoled }"
    >
      <div class="expand_btn" @click="isSearchFoled = !isSearchFoled">
        <span class="icon_bg mb-2">
          <img src="@/assets/icon/icon-icon-search-number.svg" />
        </span>
        <span>查詢</span>
        <img src="@/assets/icon/icon-arrow-right.svg" class="arrow_button" />
      </div>
      <div class="content_block">
        <div class="content_wrapper">
          <div class="title">
            <img
              src="@/assets/icon/icon-icon-note.svg"
              class="mr-1"
            />檔期CUE表內容<img
              src="@/assets/icon/ic-help-outline.svg"
              class="ml-1"
            />
          </div>
          <div class="status_content">
            <span>狀態顯示</span>
            <span CUE="total" class="status"></span>
            <span>總金額</span>
            <span CUE="current" class="status"></span>
            <span>目前拉CUE金額</span>
            <span CUE="used" class="status"></span>
            <span>已拉CUE金額</span>
            <span CUE="overload" class="status"></span>
            <span>超過金額</span>
          </div>
        </div>
        <div class="progress_wrapper">
          <Loading v-if="pullCueStore.progressBarLoading" />
          <ProgressBar
            v-if="!pullCueStore.progressBarLoading"
            title="牌價金額"
            :lumpSum="cuePriceInformation.totalMarketPriceIncludeTax"
            :alreadyPulledCue="
              cuePriceInformation.totalCueMarketPriceIncludeTax
            "
            :currentlyCue="
              cuePriceInformation.currentAppendMarketPriceIncludeTax
            "
            :remainingPrice="cuePriceInformation.remainingMarketPriceIncludeTax"
            :overPrice="cuePriceInformation.overMarketPriceIncludeTax"
          />
          <Loading v-if="pullCueStore.progressBarLoading" />
          <ProgressBar
            v-if="!pullCueStore.progressBarLoading"
            title="成交價金額"
            :lumpSum="cuePriceInformation.totalPriceIncludeTax"
            :alreadyPulledCue="cuePriceInformation.totalCuePriceIncludeTax"
            :currentlyCue="cuePriceInformation.currentAppendPriceIncludeTax"
            :remainingPrice="cuePriceInformation.remainingPriceIncludeTax"
            :overPrice="cuePriceInformation.overPriceIncludeTax"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from "@/router/useRouter.js";
import { ref, computed, onMounted } from "vue";
import { usePullCueStore } from "@/stores/pullCue.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import ProgressBar from "@/components/cueManagement/ProgressBar.vue";
import Loading from "@/components/Loading.vue";

const props = defineProps({
  changeType: {
    type: Function,
    default: () => {}
  },
  changeQuotationId: {
    type: Function,
    default: () => {}
  },
  changeProductData: {
    type: Function,
    default: () => {}
  }
});

const { route, router } = useRoute();
const pullCueStore = usePullCueStore();
const cuePriceInformation = computed(() => pullCueStore.cuePriceInformation);
const {
  getPullCueQuotationId,
  getCueBannerId,
  setProjectId,
  postCuePriceInformation,
  getCueQuotationProjectId,
  getCueTotalMarketPriceHistory,
  resetData
} = pullCueStore;
const isSearchFoled = ref(false);
const quotationId = ref(null);
const orderId = ref(null);
const selectedProject = ref(null);
const searchedProjectOptions = ref([]);
const selectedProjectId = ref(null);
const searchLoading = ref(false);

const setSelectedProject = data => {
  selectedProject.value = searchedProjectOptions.value.find(
    option => option.name === data.name
  ).label;
  selectedProjectId.value = data.value;
  setProjectId({ projectId: data.value });
};

const getQuotationData = () => {
  resetData();
  router.push({ name: "CueManagement" }).catch(() => {});
  if (!orderId.value) return;
  props.changeType(null);
  props.changeProductData({ productName: null });
  searchLoading.value = true;
  selectedProject.value = null;
  getPullCueQuotationId({ orderId: orderId.value })
    .then(res => {
      quotationId.value = res.id;
      props.changeQuotationId(res.id);
      searchedProjectOptions.value = res.projectList
        .filter(p => p.type === 0)
        .map(item => {
          return {
            value: item.id,
            label: item.name
          };
        });
      router.push({ params: { salesOrderId: orderId.value } }).catch(() => {});
      searchLoading.value = false;
    })
    .catch(() => {
      searchLoading.value = false;
    });
};

const search = () => {
  Promise.all([
    getCueBannerId({ id: selectedProjectId.value }),
    getCueQuotationProjectId({ id: selectedProjectId.value }),
    getCueTotalMarketPriceHistory({ quotationId: quotationId.value }),
    postCuePriceInformation({
      quotationId: quotationId.value,
      requestTrialCalculation: {
        trailCalcProjectServices: [],
        trailCalcReservations: []
      }
    })
  ]).then(() => {
    isSearchFoled.value = true;
  });
};

onMounted(() => {
  orderId.value = route.params.salesOrderId;
  getQuotationData();
});
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

$total: #ddd;
$current: #c0f893;
$used: #8debc8;
$overload: #ea475b;
$status-colors: (
  (
    "total": $total,
    // 總金額
      "current": $current,
    // 目前拉CUE金額
      "used": $used,
    // 已拉CUE金額
      "overload": $overload,
    // 超過金額
  )
);

.el-select {
  width: 220px;
}

.section {
  display: flex;
  position: sticky;
  top: 70px;
  z-index: 10;
  border: solid 1px #e2e1e1;

  &.after_search_section {
    padding: 10px 0;
  }
}

.after_search_block {
  display: flex;

  .expand_btn {
    height: 143px;
    width: 128px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #00afb8;
    font-size: 16px;
    font-weight: bold;
    border-right: 1.5px solid #e2e1e1;
    position: relative;
    margin-right: 36px;

    .icon_bg {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #f6f6f6;
      box-shadow: inset 0 1px 3px 0 rgba(169, 169, 169, 0.1);
    }

    .arrow_button {
      position: absolute;
      display: inline-flex;
      align-items: center;
      width: 24px;
      height: 40px;
      padding: 8px 0;
      border: 1px solid #e2e1e1;
      border-left: 0px;
      right: -16px;
      background: #fff;
      border-radius: 0 4px 4px 0;
      top: 50%;
      margin-top: -20px;
    }
  }

  .content_block {
    margin: 6px 0;
    width: 100%;

    .content_wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 52px;

      .title {
        @include font-common(20px, $font-weight-bold);
        display: inline-flex;
        margin-right: 28px;
      }

      .status_content {
        @include font-common(14px, $font-weight-normal, $gray-900);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .status {
        @each $color, $value in $status-colors {
          &[CUE="#{$color}"] {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
            background-color: $value;
          }
        }
      }
    }

    .progress_wrapper {
      display: flex;
      justify-content: space-around;
      min-width: 1000px;
    }
  }
}

.button_bg_blue_large {
  margin-left: 63px;
}

.w0 {
  transition: width 0.3s ease-out;
  width: 0px;
  height: 0px;
  overflow: hidden;
}

.w100 {
  transition: width 0.3s ease-out;
  width: 100%;
  height: auto;
}

.focus {
  border: solid 1px #00afb8;
}
</style>
