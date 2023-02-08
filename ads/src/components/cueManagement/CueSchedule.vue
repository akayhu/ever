<template>
  <div class="wrapper">
    <div class="title_block mb-6">
      <img src="@/assets/icon/icon-icon-note.svg" />
      <div class="title ml-1 mr-2">檔期CUE表內容</div>
    </div>

    <div class="reserve_title mb-3">
      <div class="mr-1">商品類型</div>
      <div>
        {{ type === 1 ? "banner廣告" : type === 2 ? "其他類商品" : "- -" }}
      </div>
      <div class="ml-7 mr-1">
        {{ type === 2 ? "商品名稱" : "檔期預約版位" }}
      </div>
      <div>
        {{ productData?.productName || "- -" }}
      </div>
      <div
        v-if="productIdBoardList.length > 0 && type === 1"
        class="joint_sales_main ml-3"
      >
        <img src="@/assets/icon/icon-icon-linksame_blue.svg" />
        <div class="joint_sales_block">
          聯售版位
          <ul>
            <li v-for="item in productIdBoardList" :key="item.id">
              <p>
                {{ item.device }} / {{ item.siteName }} /
                {{ item.channelName }} / {{ item.name }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="pull_cue_title mb-4">拉CUE項目</div>
    <div class="divider_arrow mb-3"></div>

    <div v-if="pullCueStore.notPullCueLoading" class="loading"><Loading /></div>

    <div v-if="showBannerCue">
      <div
        v-if="
          notPullCueQuotationProjectReservation.content.length > 0 &&
            !pullCueStore.notPullCueLoading &&
            type === 1
        "
        class="checkbox_block pt-4 pb-4"
      >
        <div>
          <input type="checkbox" id="checkAll" v-model="checkAll" />
          <label for="checkAll"><span></span>全選</label>
        </div>
        <div class="count">
          共<span class="ml-1 mr-1">{{
            notPullCueQuotationProjectReservation.totalElements
          }}</span
          >筆
        </div>
      </div>

      <!-- banner廣告 -->
      <div
        v-if="
          type === 1 &&
            notPullCueQuotationProjectReservation.content.length > 0 &&
            !pullCueStore.notPullCueLoading
        "
      >
        <BannerADItem
          v-for="(item, index) in notPullCueQuotationProjectReservation.content"
          :key="index"
          :index="index"
          :item="item"
          :pullCue="pullCue"
          :offCheckedCancelPullCueCheckbox="offCheckedCancelPullCueCheckbox"
          :productData="productData"
        />
      </div>

      <!-- 其他類型 -->
      <div
        v-if="
          type === 2 &&
            prepareProjService.hasOwnProperty('startDate') &&
            !pullCueStore.notPullCueLoading
        "
      >
        <PullCueBoard :pullCue="pullCue" />
      </div>
    </div>

    <div
      class="collapse mt-3 mb-3"
      :class="showBannerCue ? 'arrow_up' : 'arrow_down'"
      @click="quotationProjectNextPage('notPullCue')"
    ></div>

    <div class="commodity_price mb-2">
      <label class="mr-9">共 {{ pullCueStore.notPullCueLength }} 項</label>
      <label>目前拉CUE成交金額</label>
      <span v-if="!totalTaxLoading" class="price">
        ${{ cuePriceInformation.currentAppendPriceIncludeTax || "- -" }}
      </span>
      <span v-if="totalTaxLoading" class="price"><Loading size="16"/></span>
    </div>

    <div class="commodity_price mb-2">
      <label>目前拉CUE總牌價</label>
      <span v-if="!totalTaxLoading" class="price light_blue">
        ${{ cuePriceInformation.currentAppendMarketPriceIncludeTax || "- -" }}
      </span>
      <span v-if="totalTaxLoading" class="price"><Loading size="16"/></span>
    </div>

    <div v-if="cuePriceInformation.warning" class="commodity_price">
      <label>
        ＊預約檔期總牌價 ${{
          cuePriceInformation.totalReserveMarketPriceIncludeTax
        }}
        已大於CUE表總牌價
      </label>
    </div>

    <div class="pull_cue_title mb-2 mt-6">已拉CUE檔期版位</div>
    <div class="divider_arrow mb-3"></div>

    <div v-if="pullCueStore.pullCueLoading" class="loading">
      <Loading />
    </div>

    <div
      v-if="
        showCueTable &&
          pullCueQuotationProjectReservation.content.length > 0 &&
          !pullCueStore.pullCueLoading
      "
    >
      <div class="pull_cue_count mt-4">
        共<span class="ml-1 mr-1">{{
          pullCueQuotationProjectReservation.content.length
        }}</span
        >筆
      </div>

      <!-- 已拉CUE檔期版位 -->
      <CueTableContent
        v-for="(item, index) in pullCueQuotationProjectReservation.content"
        :key="index"
        :index="index"
        :item="item"
        :offCheckedCancelNotPullCueCheckbox="offCheckedCancelNotPullCueCheckbox"
      />
    </div>

    <div
      class="collapse mt-3"
      :class="showCueTable ? 'arrow_up' : 'arrow_down'"
      @click="quotationProjectNextPage('pullCue')"
    ></div>

    <div class="commodity_price mb-2">
      <label class="mr-9">
        共 {{ pullCueQuotationProjectReservation.content.length }} 項
      </label>
      <label>已拉CUE成交金額</label>
      <span class="price">
        $ {{ cuePriceInformation.totalCuePriceIncludeTax || "- -" }}
      </span>
    </div>

    <div class="commodity_price">
      <label>已拉CUE總牌價</label>
      <span class="price light_blue">
        $ {{ cuePriceInformation.totalCueMarketPriceIncludeTax || "- -" }}
      </span>
    </div>

    <div class="button_block mt-6">
      <button
        class="button_bg_blue_large mr-7"
        @click="() => openCloseApplyForAChange(true)"
        :disabled="disableApplyForAChangeBtn"
      >
        申請變更
      </button>
      <button
        @click="submit"
        data-test="pullCue-submit"
        class="button_bg_blue_large mb-4"
        :disabled="disablePullCueStatusBtn"
      >
        確認
      </button>
    </div>

    <div
      v-if="
        cuePriceInformation.overMarketPriceIncludeTax > 0 ||
          cuePriceInformation.overPriceIncludeTax > 0
      "
      class="prompt_text mt-2"
    >
      成交價或總牌價已超出上限
    </div>
    <div
      v-if="pullCueStore.quotationData.id && disableApplyForAChangeBtn"
      class="prompt_text mt-2"
    >
      {{
        cuePriceInformation.changeMarketPrice
          ? "申請變更中，如需調整請抽單或待簽核完成"
          : "無進行中專案，目前無法拉CUE"
      }}
    </div>

    <Modal
      :isShow="showApplyForAChange"
      @close="() => openCloseApplyForAChange(false)"
      title="申請變更"
      width="810"
    >
      <template #body>
        <div class="apply_for_a_change_main">
          <div class="text_block">
            <div>原訂單總牌價 (含稅)</div>
            <div>
              ${{
                cuePriceInformation.totalMarketPriceIncludeTax.toLocaleString()
              }}
            </div>
          </div>
          <div class="text_block">
            <div>變更總牌價上限 (含稅)</div>
            <div class="mr-7">
              <input
                v-model="marketPriceIncludeTax"
                type="text"
                widthType="122"
                placeholder="請輸入"
              />
            </div>
            <div>
              變更後折扣<span class="ml-4 mr-1">{{
                marketPriceIncludeTax
                  ? `${round(
                      cuePriceInformation.totalPriceIncludeTax /
                        marketPriceIncludeTax,
                      1
                    )}`
                  : "- -"
              }}</span
              >折
            </div>
          </div>
          <div class="text_block">
            <div>變更原因</div>
            <div class="note">
              <el-input
                v-model="reason"
                :autosize="{ minRows: 4 }"
                type="textarea"
                placeholder="請輸入"
                maxlength="1000"
                class="input_field"
                show-word-limit
              />
            </div>
          </div>
        </div>
        <div class="button">
          <button
            class="button_bg_blue_large"
            @click="confirmApplication"
            :disabled="disableMarketPriceBtn"
          >
            確定
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePullCueStore } from "@/stores/pullCue.js";
import { useProductStore } from "@/stores/product.js";
import { round } from "@/utils/quotation";
import BannerADItem from "@/components/cueManagement/BannerADItem.vue";
import PullCueBoard from "@/components/cueManagement/PullCueBoard.vue";
import CueTableContent from "@/components/cueManagement/CueTableContent.vue";
import Loading from "@/components/Loading.vue";
import Modal from "@/components/share/Modal.vue";

const props = defineProps({
  type: {
    type: Number,
    default: 0
  },
  boardName: {
    type: String,
    default: ""
  },
  productData: {
    type: Object,
    default: () => {}
  }
});
const productStore = useProductStore();
const pullCueStore = usePullCueStore();
const {
  postCuePriceInformation,
  changeProgressBarLoading,
  patchCueBannerIdReservation,
  getCueBannerIdReservation,
  deleteCueBannerIdReservation,
  getCueBannerId,
  postCueTotalMarketPrice,
  getCueProjectId,
  putCueProjectId,
  changeNotPullCueLoading,
  changePullCueLoading,
  changeCueBannerLoading,
  changeCueProjectLoading,
  getCueQuotationProjectId,
  getProjectAvailableCount
} = pullCueStore;
const productIdBoardList = computed(() => productStore.productId.boardList);
const cuePriceInformation = computed(() => pullCueStore.cuePriceInformation);
const disableApplyForAChangeBtn = computed(() => {
  return cuePriceInformation.value.changeMarketPrice || !projectAvailable.value;
});
const notPullCueQuotationProjectReservation = computed(
  () => pullCueStore.notPullCueQuotationProjectReservation
);
const pullCueQuotationProjectReservation = computed(() => {
  if (props.type === 1) return pullCueStore.pullCueQuotationProjectReservation;
  else return pullCueStore.readyProjServices;
});
const prepareProjService = computed(() => pullCueStore.prepareProjService);
const bannerQuotationProject = computed(
  () => pullCueStore.bannerQuotationProject
);
const otherQuotationProject = computed(
  () => pullCueStore.otherQuotationProject
);
const checkAll = computed({
  get: () =>
    notPullCueQuotationProjectReservation.value.content.every(
      item => item.checked === true
    ),
  set: value => {
    notPullCueQuotationProjectReservation.value.content.forEach(item => {
      item.checked = value;
    });
    pullCue();
    if (value === true) offCheckedCancelPullCueCheckbox();
  }
});
const disablePullCueStatusBtn = computed(
  () => pullCueStore.disabledPullCueStatus
);
const showBannerCue = ref(true);
const showCueTable = ref(true);
const totalTaxLoading = ref(false);
const showApplyForAChange = ref(false);
const reason = ref(null);
const marketPriceIncludeTax = ref(null);
const loading = ref(false);
const disableMarketPriceBtn = computed(
  () =>
    !marketPriceIncludeTax.value ||
    marketPriceIncludeTax.value <
      cuePriceInformation.value.totalMarketPriceIncludeTax ||
    !reason.value ||
    loading.value
);

// 試算目前拉 cue 金額
const pullCue = () => {
  changeProgressBarLoading(true);
  totalTaxLoading.value = true;
  let trailCalcReservations = [];
  let trailCalcProjectServices = [];

  if (props.type === 1) {
    notPullCueQuotationProjectReservation.value.content.forEach(item => {
      if (item.checked) {
        trailCalcReservations.push({
          reservationId: item.reservationId,
          priceIncludeTax: item.priceIncludeTax
        });
      }
    });
  } else {
    trailCalcProjectServices.push({
      cueProjectServiceId: props.productData.projectId,
      priceIncludeTax: Number(pullCueStore.prepareProjService.priceIncludeTax),
      quantity: pullCueStore.prepareProjService.quantity
    });
  }

  const query = {
    quotationId: pullCueStore.quotationData.id,
    requestTrialCalculation: {
      trailCalcReservations,
      trailCalcProjectServices
    }
  };

  postCuePriceInformation(query).then(() => {
    changeProgressBarLoading(false);
    totalTaxLoading.value = false;
  });
};

// 取消已拉 cue 勾勾
const offCheckedCancelPullCueCheckbox = () => {
  if (pullCueStore.pullCueLength > 0)
    pullCueQuotationProjectReservation.value.content.forEach(item => {
      item.checked = false;
    });
};

// 取消未拉 cue 勾勾
const offCheckedCancelNotPullCueCheckbox = () => {
  if (pullCueStore.notPullCueLength > 0) {
    notPullCueQuotationProjectReservation.value.content.forEach(item => {
      item.checked = false;
    });
    pullCue();
  }
};

// 一起開始 Reloading
const togetherReloadingStart = () => {
  changeNotPullCueLoading(true);
  changePullCueLoading(true);
  changeProgressBarLoading(true);
};

// 一起結束 Reloading
const togetherReloadingEnd = () => {
  changeNotPullCueLoading(false);
  changePullCueLoading(false);
  changeProgressBarLoading(false);
};

// Banner 型重讀資料
const reLoadingBannerData = () => {
  let query = {
    id: bannerQuotationProject.value.projectId,
    page: 1,
    productId: props.productData.productId,
    size: 20,
    status: 0
  };
  Promise.all([
    getCueBannerId({ id: pullCueStore.projectId }),
    postCuePriceInformation({
      quotationId: pullCueStore.quotationData.id,
      requestTrialCalculation: {
        trailCalcProjectServices: [],
        trailCalcReservations: []
      }
    }),
    // status: 1 為已拉 cue, 未帶為未拉 cue
    getCueBannerIdReservation(query),
    getCueBannerIdReservation({ ...query, status: 1 })
  ]).then(() => {
    togetherReloadingEnd();
  });
};

// 確認
const submit = () => {
  if (props.type === 1) {
    // Banner 型拉 cue
    togetherReloadingStart();
    changeCueBannerLoading(true);
    if (pullCueStore.notPullCueLength > 0) {
      let requestCueReservations = [];
      notPullCueQuotationProjectReservation.value.content.forEach(item => {
        if (item.checked) {
          requestCueReservations.push({
            free: item.free,
            groupId: item.groupId,
            note: item.note,
            priceIncludeTax: item.priceIncludeTax
          });
        }
      });
      patchCueBannerIdReservation({
        quotationId: pullCueStore.quotationData.id,
        requestCueReservations
      })
        .then(() => {
          reLoadingBannerData();
        })
        .catch(() => {
          togetherReloadingEnd();
          changeCueBannerLoading(false);
        });
    } else {
      // Banner 型取消拉 cue
      let groupId = [];
      pullCueQuotationProjectReservation.value.content.forEach(item => {
        if (item.checked) {
          groupId.push(item.groupId);
        }
      });
      deleteCueBannerIdReservation({
        quotationId: pullCueStore.quotationData.id,
        groupId
      })
        .then(() => {
          reLoadingBannerData();
        })
        .catch(() => {
          togetherReloadingEnd();
          changeCueBannerLoading(false);
        });
    }
  } else {
    // 專案型拉 cue
    togetherReloadingStart();
    changeCueProjectLoading(true);
    const query = {
      quotationId: pullCueStore.quotationData.id,
      id: props.productData.projectId,
      modifyCueProjectService: {
        free: prepareProjService.value.free,
        note: prepareProjService.value.note,
        priceIncludeTax: Number(prepareProjService.value.priceIncludeTax),
        quantity: Number(prepareProjService.value.quantity)
      }
    };
    putCueProjectId(query).then(() => {
      let query = {
        id: props.productData.projectId,
        page: 1,
        projectId: otherQuotationProject.value.projectId,
        size: 20
      };
      Promise.all([
        getCueQuotationProjectId({ id: pullCueStore.projectId }),
        getCueProjectId(query),
        postCuePriceInformation({
          quotationId: pullCueStore.quotationData.id,
          requestTrialCalculation: {
            trailCalcProjectServices: [],
            trailCalcReservations: []
          }
        })
      ]).then(() => {
        togetherReloadingEnd();
      });
    });
  }
};

// 未/已拉 cue 下一頁與收合
const quotationProjectNextPage = type => {
  const showBlock =
    type === "notPullCue" ? showBannerCue.value : showCueTable.value;
  const contentLength =
    type === "notPullCue"
      ? notPullCueQuotationProjectReservation.value.content.length
      : pullCueQuotationProjectReservation.value.content.length;
  const last =
    type === "notPullCue"
      ? notPullCueQuotationProjectReservation.value.last
      : pullCueQuotationProjectReservation.value.last;
  const pageNumber =
    type === "notPullCue"
      ? notPullCueQuotationProjectReservation.value.number
      : pullCueQuotationProjectReservation.value.number;

  if (contentLength === 0) return;

  let query = {
    id: bannerQuotationProject.value.projectId,
    page: pageNumber,
    productId: props.productData.productId,
    size: 20,
    status: type === "notPullCue" ? 0 : 1
  };

  const loading = loadingType => {
    type === "notPullCue"
      ? changeNotPullCueLoading(loadingType)
      : changePullCueLoading(loadingType);
  };

  const showCloseBlock = showCloseBlockType => {
    type === "notPullCue"
      ? (showBannerCue.value = showCloseBlockType)
      : (showCueTable.value = showCloseBlockType);
  };

  const clearCheckbox = () => {
    type === "notPullCue"
      ? offCheckedCancelNotPullCueCheckbox()
      : offCheckedCancelPullCueCheckbox();
  };

  if (!showBlock) {
    loading(true);
    getCueBannerIdReservation({ ...query, page: 1 }).then(() => {
      loading(false);
    });
    showCloseBlock(true);
    return;
  }

  if (showBlock && !last) {
    query = { ...query, page: pageNumber + 1 };
    loading(true);
    getCueBannerIdReservation(query, true).then(() => {
      loading(false);
    });
    return;
  }

  showCloseBlock(false);
  if (type === "notPullCue") clearCheckbox();
};

// 打開關閉變更申請視窗
const openCloseApplyForAChange = status => {
  showApplyForAChange.value = status;
};

// 確認申請
const confirmApplication = async () => {
  loading.value = true;
  await postCueTotalMarketPrice({
    newPrice: {
      marketPriceIncludeTax: Number(marketPriceIncludeTax.value),
      reason: reason.value
    },
    quotationId: pullCueStore.quotationData.id
  })
    .then(() => {
      loading.value = false;
      marketPriceIncludeTax.value = null;
      reason.value = null;
      openCloseApplyForAChange(false);
    })
    .catch(() => {
      loading.value = false;
    });
};

// 拉 cue 專案數量處理
const getProjectCount = async () => {
  loading.value = true;
  await getProjectAvailableCount({
    quotationId: pullCueStore.quotationData.id
  });
  loading.value = false;
};

// 取得是否為專案都有效
const projectAvailable = computed(() => {
  if (!pullCueStore.quotationData.id) return;
  getProjectCount();
  return pullCueStore.projectAvailable;
});
</script>

<style lang="scss" scoped>
.wrapper {
  flex-grow: 1;
  padding: 24px 20px;
  background-color: #fff;
  border: solid 1px #e2e1e1;
  border-radius: 8px;

  .title_block {
    display: flex;
    align-items: center;

    .title {
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #333;
    }
  }

  .reserve_title {
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #292929;
    display: flex;

    > div {
      &:nth-child(2),
      &:nth-child(4) {
        color: #19b9c0;
      }
    }

    .joint_sales_main {
      position: relative;
      cursor: pointer;
      top: -2px;

      &:hover {
        .joint_sales_block {
          display: block;
        }
      }

      .joint_sales_block {
        display: none;
        position: absolute;
        left: 40px;
        top: -8px;
        width: 340px;
        padding: 16px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
        border: solid 1px #e2e1e1;
        z-index: 9;

        &::after {
          content: "";
          position: absolute;
          z-index: 1;
          top: 13px;
          left: 2px;
          margin-left: -10px;
          width: 14px;
          height: 14px;
          transform: rotate(135deg);
          background-color: #fff;
          border-bottom: 1px solid #d6d6d6;
          border-right: 1px solid #d6d6d6;
        }

        ul {
          font-size: 14px;
          font-weight: normal;
          line-height: 1.57;
          letter-spacing: 1.23px;
          color: #292929;
          margin: 4px 0 0;

          li {
            padding: 8px 8px 8px 0;
            border-bottom: 1px solid #eee;
            display: flex;

            p {
              margin: 0 0 0 10px;
              max-width: 272px;
            }

            &::before {
              content: " ";
              width: 14px;
              height: 14px;
              border-radius: 50%;
              border: solid 4px #00afb8;
              position: relative;
              top: 3px;
            }
          }
        }
      }
    }
  }

  .pull_cue_title {
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #292929;
  }

  .pull_cue_count {
    text-align: right;

    span {
      color: #19b9c0;
    }
  }

  .divider_arrow {
    position: relative;
    margin-bottom: 22px;
    height: 1px;
    background-color: #d6d6d6;

    &::after {
      content: "";
      position: absolute;
      z-index: 1;
      top: -6px;
      left: 50%;
      margin-left: -10px;
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      background-color: #fff;
      border-bottom: 1px solid #d6d6d6;
      border-right: 1px solid #d6d6d6;
    }
  }

  .banner_ad_title {
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #292929;
    border-bottom: 1px solid #eee;
    padding-bottom: 16px;
  }

  .checkbox_block {
    display: flex;
    justify-content: space-between;

    .count {
      span {
        color: #19b9c0;
      }
    }
  }

  .collapse {
    font-size: 14px;
    letter-spacing: 1.43px;
    color: #7e7e7e;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before,
    &::after {
      content: "";
      display: inline-block;
      width: max-content;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      cursor: pointer;
    }

    &.arrow_up {
      &::before {
        content: "收合商品明細";
      }

      &::after {
        border-bottom: 5px solid #000;
      }
    }

    &.arrow_down {
      &::before {
        content: "展開商品明細";
      }

      &::after {
        border-top: 5px solid #000;
      }
    }
  }

  .commodity_price {
    font-size: 14px;
    text-align: right;
    letter-spacing: 1.38px;

    label {
      color: #7e7e7e;
      letter-spacing: 1.43px;
    }

    .price {
      font-weight: bold;
      color: #333;
      width: 104px;
      display: inline-block;
      vertical-align: middle;

      &.light_blue {
        color: #00afb8;
      }
    }
  }

  .button_block {
    text-align: center;
  }
}

.loading {
  margin: 100px 0;
}

.apply_for_a_change_main {
  width: 710px;
  border-bottom: 1px solid #eee;
  padding-bottom: 32px;
  margin: 10px auto 30px;

  .text_block {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #333;
    margin-bottom: 12px;

    &:nth-child(1) {
      div {
        &:nth-child(2) {
          color: #19b9c0;
          font-weight: bold;
        }
      }
    }

    &:nth-child(2) {
      span {
        color: #19b9c0;
      }
    }

    &:nth-child(3) {
      align-items: flex-start;
    }

    > div {
      &:nth-child(1) {
        margin-right: 28px;
      }

      &.note {
        width: 540px;

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
    }
  }
}

.button {
  text-align: center;
}

.prompt_text {
  font-size: 14px;
  text-align: right;
  color: #ea475b;
  line-height: 1.43;
  letter-spacing: 1.43px;
}
</style>
