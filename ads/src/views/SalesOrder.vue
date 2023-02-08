<template>
  <div>
    <div v-show="!isLoading">
      <!-- 簽核進度(送簽者) -->
      <Contract
        v-if="route.name === 'SignOffViewSalesOrder'"
        title="報價單"
        :showHistory="true"
        :id="route.params.salesOrderId"
        reviewType="QUOTATION"
        :actionCallback="contractAction"
      />

      <div class="add_quotation_title">
        <div>
          {{
            route.name !== "GeneralViewSalesOrder" ||
            route.name !== "SignOffViewSalesOrder"
              ? "建立報價單"
              : "訂單成立"
          }}
        </div>
      </div>

      <!-- 上方右側選單列 -->
      <TopRightAction :validate="validate" :resetValidation="resetValidation" />

      <!-- 左側選單 -->
      <QuotationLeft />

      <div class="quotation_content">
        <!-- 簽核進度(申請者) -->
        <div
          v-if="
            salesOrderStore.quotationData.audit === 1 &&
              route.name === 'GeneralViewSalesOrder'
          "
          class="sign_off_progress"
        >
          <span class="title">簽核進度</span>
          <div class="schedule">
            進度
            <div class="schedule_content_main">
              <div class="schedule_content">
                <div class="title mb-6">
                  簽核進度<span>{{ statusLabel }}</span>
                </div>
                <div class="title">
                  法務簽核
                  <template v-if="legalStatus">
                    <icon :iconName="legalStatus.icon"></icon>
                    <span class="d-inline-block legal_content">
                      {{ legalStatus.label }}
                    </span>
                  </template>
                </div>
                <ContracBar
                  reviewType="QUOTATION"
                  :id="route.params.salesOrderId"
                />
              </div>
            </div>
          </div>
          <span>
            <router-link
              :to="`/signOffProcess/${route.params.salesOrderId}`"
              target="_blank"
              rel="noopener noreferrer"
              title="簽核歷程"
              >簽核歷程</router-link
            >
          </span>
        </div>

        <div class="quotation_right">
          <!-- 報價單基本資料 -->
          <BasicInformation />

          <!-- 報價內容 -->
          <QuotationContent v-if="route.name !== 'CreatedSalesOrder'" />

          <!-- 匯出套用合約 -->
          <ExportApplyContract v-if="route.name !== 'CreatedSalesOrder'" />
        </div>
      </div>
    </div>

    <div id="componentDialog"></div>

    <!-- 確認是否離開 -->
    <Dialog
      ref="confirmDialog"
      @dialogCancel="showConfirm = false"
      @dialogConfirm="showConfirm = false"
      :isShow="showConfirm"
      :cancelButton="true"
      title="注意"
      content="資料尚未儲存，確定要離開此頁嗎?"
    />

    <GoTop />
  </div>
</template>

<script>
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import { useRoute } from "@/router/useRouter.js";
import { useVuelidate } from "@vuelidate/core";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useReviewStore } from "@/stores/review.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import QuotationLeft from "@/components/salesOrder/QuotationLeft.vue";
import TopRightAction from "@/components/salesOrder/TopRightAction.vue";
import BasicInformation from "@/components/salesOrder/BasicInformation.vue";
import QuotationContent from "@/components/salesOrder/QuotationContent.vue";
import ExportApplyContract from "@/components/salesOrder/ExportApplyContract.vue";
import Dialog from "@/components/Dialog.vue";
import GoTop from "@/components/GoTop.vue";
import Contract from "@/components/share/ContractReview/Contract.vue";
import ContracBar from "@/components/share/ContractReview/ContracBar.vue";

export default {
  components: {
    QuotationLeft,
    TopRightAction,
    QuotationContent,
    BasicInformation,
    ExportApplyContract,
    Contract,
    ContracBar,
    Dialog,
    GoTop
  },
  beforeRouteLeave(to, from, next) {
    if (
      this.isFormDirty &&
      this.route.name !== "CreatedSalesOrder" &&
      to.name !== "Page500"
    ) {
      this.showConfirm = true;
      this.$refs.confirmDialog.confirm().then(answer => {
        if (answer) {
          useSalesOrderStore().$reset();
          return next();
        } else {
          return next(false);
        }
      });
      return next(false);
    }
    useSalesOrderStore().$reset();
    return next();
  },
  setup() {
    const { route, router } = useRoute();
    const salesOrderStore = useSalesOrderStore();
    const reviewStore = useReviewStore();
    const v$ = useVuelidate();
    const { statusLabel } = useFormStatus();
    const legalStatus = computed(() => reviewStore.legalStatus);
    const isLoading = computed(() => salesOrderStore.isLoading);
    const isFormDirty = computed(() => v$.value.$anyDirty);
    const showConfirm = ref(false);

    const beforeWindowUnload = e => {
      e.preventDefault();
      if (isFormDirty.value) e.returnValue = "";
    };

    const validate = () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        setTimeout(() => {
          // 等待編輯區塊收合
          nextTick(() => {
            const top =
              document.querySelector(`.error_message`).offsetTop - 150;
            window.scrollTo({ top });
          });
        }, 100);
        return false;
      }
      return true;
    };

    // 簽核或駁回後的動作
    const contractAction = () => {
      router.push("/salesOrderList");
    };

    // 重設 vuelidate 的驗證狀態
    const resetValidation = () => v$.value.$reset();

    onMounted(() => {
      window.addEventListener("beforeunload", beforeWindowUnload);
    });

    onUnmounted(() => {
      window.removeEventListener("beforeunload", beforeWindowUnload);
    });

    return {
      route,
      salesOrderStore,
      statusLabel,
      legalStatus,
      showConfirm,
      isLoading,
      isFormDirty,
      validate,
      resetValidation,
      contractAction
    };
  }
};
</script>

<style lang="scss" scoped>
.add_quotation_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  position: absolute;
  z-index: 6;
}

.quotation_content {
  margin-top: 18px;
  display: flex;
  justify-content: right;
  position: relative;

  .sign_off_progress {
    position: absolute;
    display: flex;
    align-items: center;
    left: 12px;
    top: -54px;
    z-index: 6;

    .title {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.4;
      letter-spacing: 1.4px;
      color: #292929;
      margin-right: 12px;
    }

    .schedule {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #00afb8;
      padding-right: 12px;
      border-right: 1px solid #ddd;
      margin-right: 12px;
      position: relative;
      cursor: pointer;

      &:hover {
        .schedule_content_main {
          display: block;
        }
      }

      .schedule_content_main {
        display: none;
        height: 210px;
        width: 700px;
        position: absolute;
      }

      .schedule_content {
        position: absolute;
        border-radius: 4px;
        padding: 12px 16px;
        background-color: #fff;
        box-shadow: 0 2px 4px 0 #a9a9a9;
        border: solid 1.5px #e2e1e1;
        top: 10px;
        left: -10px;
        min-width: 700px;
        min-height: 200px;

        .title {
          font-size: 16px;
          font-weight: bold;
          line-height: 1.38;
          letter-spacing: 1.38px;
          color: #292929;
          display: flex;
          align-items: center;

          span {
            margin-left: 4px;
            color: #00afb8;
          }

          .legal_content {
            font-size: 16px;
            font-weight: normal;
            line-height: 1.38;
            letter-spacing: 1.38px;
            color: #292929;
          }
        }

        &::after {
          content: "";
          position: absolute;
          z-index: 1;
          top: -8px;
          left: 10px;
          width: 12px;
          height: 12px;
          transform: rotate(-135deg);
          background-color: #fff;
          border-bottom: 1px solid #d6d6d6;
          border-right: 1px solid #d6d6d6;
        }
      }
    }

    span {
      a {
        font-weight: bold;
      }
    }
  }

  .quotation_right {
    width: 1000px;

    .section_container {
      margin-bottom: 20px;
      line-height: 1.38;
      letter-spacing: 1.38px;

      h2 {
        font-size: 20px;
      }
    }
  }
}
</style>
