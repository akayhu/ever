<template>
  <div>
    <div class="sign_off_quotation_title">簽核報價單</div>
    <section class="mt-4">
      <div class="history_title">簽核歷程</div>

      <SwitchTabs
        :tabs-data="tabs"
        :value="currentTab"
        :loading="loading"
        @select-tab="changeTab($event.key)"
        styleType="secondary"
      />

      <Loading v-if="loading" class="p-10" />
      <div v-else>
        <div class="tag pl-6 pr-6">
          <span
            v-for="item in history.segmentGroups"
            :key="item.groupId"
            :class="{ focus: item.groupId === segmentId }"
            @click="changeSegment(item.groupId)"
            >{{ item.groupId }}</span
          >
        </div>

        <div v-if="specifiedSegment" class="pl-6 pr-6">
          <!-- 申請人 -->
          <div class="applicant_block group_header mt-6 pb-6">
            <div class="data-row mb-4">
              <label>報價單號</label>
              <span>{{ history.orderId || route.params.id }}</span>
            </div>
            <div class="data-row mb-4">
              <label>申請人</label>
              <span>{{ specifiedSegment.reporter.empName }}</span>
            </div>
            <div class="d-flex mb-4">
              <div class="data-row">
                <label>流程開始時間</label>
                <span>{{
                  specifiedSegment.startDate
                    ? specifiedSegment.startDate
                    : "- -"
                }}</span>
              </div>
              <div class="data-row ml-12">
                <label>流程結束時間</label>
                <span>{{
                  specifiedSegment.endDate ? specifiedSegment.endDate : "- -"
                }}</span>
              </div>
            </div>
            <div
              v-if="specifiedSegment.terminateType === 2"
              class="data-row mb-4"
            >
              <label>抽單時間</label>
              <span>{{ specifiedSegment.endDate }}</span>
            </div>
            <div v-if="specifiedSegment.terminateType === 0" class="data-row">
              <label>駁回時間</label>
              <span>{{ specifiedSegment.endDate }}</span>
            </div>
          </div>

          <div
            v-for="segment in specifiedSegment.segments"
            :key="segment.processId"
          >
            <div
              v-for="(record, index) in segment.records"
              :key="index"
              class="applicant_block block pb-6"
              :class="{
                legal_block: record.tag === 'TL1',
                draw: specifiedSegment.revokeReason
              }"
            >
              <div class="data-row mb-4">
                <label> {{ record.tag === "TL1" ? "法務" : "" }}簽核人 </label>
                <!-- <span>{{ approver(segment.records, index) }}</span> -->
                <span
                  >{{
                    record.approver?.empName ||
                      record.allowedApprover[0].empName
                  }}
                  {{
                    record.approver &&
                    record.approver.empId !== record.allowedApprover[0].empId
                      ? "(代)"
                      : ""
                  }}</span
                >
                <!-- <span>{{ record.approver.empName }}</span> -->
              </div>
              <div class="data-row mb-4">
                <label>送簽時間</label>
                <span>{{ record.requestDate || "- -" }}</span>
              </div>
              <div class="data-row mb-4">
                <label>簽核時間</label>
                <span>{{ record.reviewDate || "- -" }}</span>
              </div>
              <div class="data-row mb-4">
                <label>簽核結果</label>
                <span>{{ resultLabel[record.result] || "- -" }}</span>
              </div>
              <div class="data-row">
                <label>說明</label>
                <span class="ml-20">{{ record.note || "- -" }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="specifiedSegment.revokeReason"
            class="applicant_block pt-4 pb-6"
          >
            <div class="draw_description">
              <div class="mb-3 title">抽單說明</div>
              <div class="description">
                {{ specifiedSegment.revokeReason }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, onMounted } from "vue";
import { useRoute } from "@/router/useRouter.js";
import { useReviewStore } from "@/stores/review";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import Loading from "@/components/Loading.vue";

const { route } = useRoute();
const reviewStore = useReviewStore();
const { quotationHistory: history, loading } = toRefs(reviewStore);

const resultLabel = {
  0: "駁回",
  1: "核准"
};
const currentTab = ref("1");
const segmentId = ref(null);

const specifiedSegment = computed(() =>
  history.value.segmentGroups?.find(item => item.groupId === segmentId.value)
);

const tabs = computed(() => {
  let weight = history.value.quotationStage;
  const result = [];
  if (history.value.quotationAudit === 1) weight++;

  if (weight >= 2) {
    result.push({
      key: "1",
      label: "報價簽核"
    });
  }
  if (weight >= 3) {
    result.push({
      key: "2",
      label: "轉訂單簽核"
    });
  }
  if (weight >= 4) {
    result.push({
      key: "3",
      label: "作廢簽核"
    });
  }
  return result;
});

const changeTab = val => {
  currentTab.value = val;
  init();
};

const changeSegment = val => {
  if (val === segmentId.value) return;

  segmentId.value = val;
};

const init = async () => {
  await reviewStore.getQuotationHistory({
    id: route.params.id,
    quotationStage: currentTab.value
  });
  if (history.value.segmentGroups && history.value.segmentGroups.length > 0) {
    segmentId.value = history.value.segmentGroups[0].groupId;
  }
};

onMounted(() => {
  if (!route.params.id) return;
  init();
});
</script>

<style lang="scss" scoped>
.sign_off_quotation_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
}

section {
  .history_title {
    font-size: 20px;
    font-weight: bold;
    line-height: 1.4;
    letter-spacing: 1.4px;
    color: #292929;
    margin-bottom: 40px;
  }

  .tag {
    margin-top: 28px;

    span {
      font-size: 14px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.43;
      letter-spacing: 1.43px;
      color: #00afb8;
      border-radius: 12px;
      border: solid 1px #39c8d0;
      padding: 4px 8px;
      cursor: pointer;
      margin-right: 8px;

      &.focus {
        background-color: #39c8d0;
        color: #fff;
      }

      &:hover {
        background-color: #e6f9fa;
        border: solid 1px #e6f9fa;
        color: #00afb8;
      }

      &:nth-child(1):not(:last-child) {
        position: relative;
        margin-right: 16px;

        &::after {
          content: " ";
          display: inline-flex;
          align-items: center;
          right: -10px;
          height: 26px;
          border-right: 1px solid #ddd;
          position: absolute;
        }
      }
    }
  }

  .applicant_block {
    border-bottom: 1px solid #d6d6d6;

    &:last-child {
      border-bottom: 0;
    }

    &.block {
      padding-top: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #d6d6d6;
    }

    .data-row {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #292929;
      display: flex;

      label {
        width: 115px;
      }

      span {
        color: #7e7e7e;
      }
    }

    &.group_header {
      .data-row label {
        width: 133px;
      }
    }

    &.draw {
      position: relative;

      &::after {
        content: "";
        position: absolute;
        z-index: 1;
        bottom: -6px;
        left: calc(50%);
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
        background-color: #fff;
        border-bottom: 1px solid #d6d6d6;
        border-right: 1px solid #d6d6d6;
      }
    }

    .draw_description {
      background-color: #f2f2f2;
      padding: 12px;

      .title {
        font-size: 16px;
        font-weight: bold;
        color: #292929;
      }

      .description {
        font-size: 16px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.38;
        letter-spacing: 1.38px;
        color: #7e7e7e;
      }
    }
  }

  .legal_block {
    background-color: #e6f9fa;
    padding: 24px 16px;

    .block {
      padding: 0;
      border: 0;
    }
  }
}
</style>
