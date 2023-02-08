<template>
  <div class="wrapper">
    <div class="block_title">
      <img class="mr-1" src="@/assets/icon/icon-icon-apply.svg" />合約內容
    </div>
    <div class="word word_title">訂單單號</div>
    <div class="word mb-3">
      {{ quotationData.orderId || "- -" }}
    </div>
    <div class="word word_title">執行時間</div>
    <div class="word mb-6">
      {{
        quotationData.orderExecutionStartDate
          ? `${quotationData.orderExecutionStartDate} ~ ${quotationData.orderExecutionEndDate}`
          : "- -"
      }}
    </div>
    <div class="word word_title">商品類型</div>

    <!-- banner 廣告 -->
    <div class="commodity_title">
      <img
        v-if="bannerQuotationProject.cueProducts.length > 0"
        class="mr-1"
        src="@/assets/icon/icon-icon-apply-ad.svg"
      />
      <img
        v-else
        class="mr-1"
        src="@/assets/icon/icon-icon-apply-ad-normal.svg"
      />
      banner廣告
    </div>

    <div v-if="cueBannerLoading" class="loading"><Loading /></div>
    <div v-if="!cueBannerLoading">
      <div
        v-for="item in bannerQuotationProject.cueProducts"
        :key="item.productId"
        @click="handleProductType(1, item, 'banner')"
        :class="{ active: item.productId === productFocus }"
        class="product_card"
      >
        <div class="title">
          <span
            v-tooltip="{
              placement: 'right',
              content: item.productName,
              offset: 5,
              trigger: 'hover'
            }"
            >{{ item.productName }}</span
          >
          <span>${{ item.price.toLocaleString() }}</span>
        </div>
        <div class="mb-3">{{ item.startDate }} ~ {{ item.endDate }}</div>
        <div class="content">
          <div>已拉CUE</div>
          <div>
            <div
              :style="`width: ${(item.arrangeDays / item.totalDays) * 100}%;`"
            ></div>
          </div>
          <div>
            <span>{{ item.arrangeDays }}</span
            >/{{ item.totalDays }}天
          </div>
        </div>
      </div>
    </div>

    <!-- 其他類型廣告 -->
    <div class="commodity_title">
      <img
        v-if="otherQuotationProject.cueProjectServices.length > 0"
        class="mr-1"
        src="@/assets/icon/icon-icon-apply-ad.svg"
      />
      <img
        v-else
        class="mr-1"
        src="@/assets/icon/icon-icon-apply-ad-normal.svg"
      />
      其他類型
    </div>

    <div v-if="cueProjectLoading" class="loading"><Loading /></div>
    <div v-if="!cueProjectLoading">
      <div
        v-for="item in otherQuotationProject.cueProjectServices"
        :key="`other${item.id}`"
        @click="handleProductType(2, item, 'project')"
        :class="{ active: item.id === otherProductFocus }"
        class="product_card"
      >
        <div
          v-if="item.canDelete"
          @click.stop="deleteCueOption(item.id)"
          class="delete_icon mb-1"
        >
          <icon iconName="icon-delete-big" size="16" />
        </div>
        <div class="title">
          <span
            v-tooltip="{
              placement: 'right',
              content: item.externalName,
              offset: 5,
              trigger: 'hover'
            }"
            >{{ item.externalName }}</span
          >
          <span>${{ item.priceIncludeTax.toLocaleString() }}</span>
        </div>
        <div class="mb-3">{{ item.startDate }} ~ {{ item.endDate }}</div>
        <div class="content">
          <div>已拉CUE</div>
          <div>
            <div
              :style="`width: ${(item.consumption / item.quantity) * 100}%;`"
            ></div>
          </div>
          <div>
            <span>{{ item.consumption }}</span
            >/{{ item.quantity }}天
          </div>
        </div>
      </div>
    </div>

    <!-- 訂單成立才可新增 -->
    <div
      v-if="!cueProjectLoading && otherQuotationProject.projectAvailable"
      class="create"
    >
      <img
        @click.prevent="() => openCloseCreateOtherTypes(true)"
        src="@/assets/icon/icon-icon-expand-less.svg"
      />
    </div>

    <Modal
      :isShow="createOtherTypes"
      @close="() => openCloseCreateOtherTypes(false)"
      title="新增其他類型"
      width="810"
    >
      <template #body>
        <AddAnotherType
          :closeCreateOtherTypes="() => openCloseCreateOtherTypes(false)"
        />
      </template>
    </Modal>

    <Dialog
      v-if="confirmDeletion"
      @dialogCancel="confirmDeletion = !confirmDeletion"
      @dialogConfirm="deleteCueProject"
      :isShow="confirmDeletion"
      title="您確定要將此筆資料做刪除？"
      content="確認資料更動狀態。"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePullCueStore } from "@/stores/pullCue.js";
import { useProductStore } from "@/stores/product.js";
import AddAnotherType from "@/components/cueManagement/AddAnotherType.vue";
import Modal from "@/components/share/Modal.vue";
import Loading from "@/components/Loading.vue";
import Dialog from "@/components/Dialog.vue";

const props = defineProps({
  changeType: {
    type: Function,
    default: () => {}
  },
  changeProductData: {
    type: Function,
    default: () => {}
  },
  quotationId: {
    type: Number,
    default: 0
  }
});
const productStore = useProductStore();
const pullCueStore = usePullCueStore();
const { getProductId } = productStore;
const {
  getCueBannerIdReservation,
  deleteCueProjectId,
  getCueQuotationProjectId,
  getCueProjectId,
  postCuePriceInformation,
  changeProgressBarLoading,
  changeNotPullCueLoading,
  changePullCueLoading
} = pullCueStore;
const quotationData = computed(() => pullCueStore.quotationData);
const projectId = computed(() => pullCueStore.projectId);
const bannerQuotationProject = computed(
  () => pullCueStore.bannerQuotationProject
);
const otherQuotationProject = computed(
  () => pullCueStore.otherQuotationProject
);
const cueBannerLoading = computed(() => pullCueStore.cueBannerLoading);
const cueProjectLoading = computed(() => pullCueStore.cueProjectLoading);
const productFocus = ref(null);
const otherProductFocus = ref(null);
const createOtherTypes = ref(false);
const confirmDeletion = ref(false);
const delCueProjectId = ref(null);

// 一起開始 loading
const togetherReloadingStart = () => {
  changeNotPullCueLoading(true);
  changePullCueLoading(true);
  changeProgressBarLoading(true);
};

// 一起結束 loading
const togetherLoadingEnd = () => {
  changeNotPullCueLoading(false);
  changePullCueLoading(false);
  changeProgressBarLoading(false);
};

const handleProductType = (type, item, state) => {
  props.changeType(type);

  // 清除已打勾類型
  pullCueStore.pullCueQuotationProjectReservation.content.forEach(item => {
    item.checked = false;
  });
  pullCueStore.notPullCueQuotationProjectReservation.content.forEach(item => {
    item.checked = false;
  });
  pullCueStore.prepareProjService.checked = false;

  productFocus.value = type === 1 ? item.productId : null;
  otherProductFocus.value = type === 1 ? null : item.id;

  togetherReloadingStart();

  // banner 型
  if (state === "banner") {
    props.changeProductData({
      productId: item.productId,
      productName: item.productName
    });

    let query = {
      id: bannerQuotationProject.value.projectId,
      page: 1,
      productId: item.productId,
      size: 20,
      status: 0
    };

    Promise.all([
      getCueBannerIdReservation(query),
      getCueBannerIdReservation({ ...query, status: 1 }),
      getProductId({ productId: item.productId }),
      postCuePriceInformation({
        quotationId: props.quotationId,
        requestTrialCalculation: {
          trailCalcProjectServices: [],
          trailCalcReservations: []
        }
      })
    ])
      .then(() => {
        togetherLoadingEnd();
      })
      .catch(() => {
        togetherLoadingEnd();
      });
  } else {
    // 專案型
    props.changeProductData({
      projectId: item.id,
      productName: item.productName
    });

    let query = {
      id: item.id,
      page: 1,
      projectId: otherQuotationProject.value.projectId,
      size: 20
    };

    Promise.all([
      getCueProjectId(query),
      postCuePriceInformation({
        quotationId: props.quotationId,
        requestTrialCalculation: {
          trailCalcProjectServices: [],
          trailCalcReservations: []
        }
      })
    ])
      .then(() => {
        togetherLoadingEnd();
      })
      .catch(() => {
        togetherLoadingEnd();
      });
  }
};

// 打開關閉新增其他類型 lightbox
const openCloseCreateOtherTypes = status => {
  createOtherTypes.value = status;
};

// 打開確認是否刪除商品 Dialog
const deleteCueOption = id => {
  delCueProjectId.value = id;
  confirmDeletion.value = true;
};

// 刪除 Cue 表專案型服務
const deleteCueProject = () => {
  const query = {
    projectId: otherQuotationProject.value.projectId,
    cueProjectServiceId: [delCueProjectId.value]
  };
  deleteCueProjectId(query).then(() => {
    getCueQuotationProjectId({ id: projectId.value });
    confirmDeletion.value = false;
  });
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 268px;
  margin-right: 12px;
  padding: 24px 16px;
  background-color: #fff;
  border: solid 1px #e2e1e1;
  border-radius: 8px;

  .block_title {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
}

.word {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 1.38px;
  margin-bottom: 6px;
  color: #19b9c0;

  &_title {
    color: #292929;
  }
}

.commodity {
  &_title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #292929;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    margin-top: 30px;
  }
}

.product_card {
  border-bottom: 2px solid #eee;
  padding: 14px 12px 5px;
  line-height: 1.43;
  letter-spacing: 1.43px;
  color: #292929;
  font-size: 14px;
  cursor: pointer;

  .delete_icon {
    text-align: right;
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
  }

  &.active {
    background-color: #e6f9fa;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: -5px;
      width: 10px;
      height: 10px;
      background-color: #e6f9fa;
      transform: translateY(-50%) rotate(45deg);
    }
  }

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-weight: bold;

    span {
      &:nth-child(1) {
        width: 120px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:nth-child(2) {
        color: #33b3ba;
      }
    }
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      &:nth-child(1),
      &:nth-child(3) {
        color: #7e7e7e;
        word-break: keep-all;
      }
      &:nth-child(2) {
        width: 91px;
        height: 10px;
        background-color: #ddd;
        border-radius: 5px;

        div {
          background-color: #8debc8;
          height: 10px;
          border-radius: 5px;
        }
      }
      &:nth-child(3) {
        span {
          color: #33b3ba;
        }
      }
    }
  }
}

.create {
  text-align: right;
  padding-top: 8px;

  img {
    cursor: pointer;
  }
}

.loading {
  margin: 28px 0;
}
</style>
