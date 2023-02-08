<template>
  <div :class="{ contract_bar: fixed, contract_bar_no_fixed: !fixed }">
    <div class="contract_bar_main">
      <div class="contract_bar_main_left">
        <h2>簽核{{ title }}</h2>
      </div>
      <div class="contract_bar_main_right">
        <div class="contract_bar_content_top">
          <div class="content_top">
            <span class="title">簽核進度</span>
            <span class="status">{{ subtitle || title }}簽核中</span>
            <span v-if="showHistory && historyLink" class="history">
              <router-link
                :to="`${historyLink}/${id}`"
                target="_blank"
                rel="noopener noreferrer"
                title="簽核歷程"
                >簽核歷程</router-link
              >
            </span>
          </div>

          <div v-if="openBlock" class="content_bottom">
            <div class="schedule_bar_block">
              <ContracBar :id="id" :reviewType="reviewType" />
            </div>
            <div class="description_block">
              <div class="mr-2">說明：</div>
              <div class="w-680">
                <el-input
                  v-model="description"
                  :autosize="{ minRows: 5 }"
                  show-word-limit
                  type="textarea"
                  placeholder="請輸入"
                  maxlength="1500"
                  class="input_field"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="contract_button">
          <button @click="action(false)" class="button_bg_white_large mr-4">
            駁回
          </button>
          <button @click="action(true)" class="button_bg_white_large">
            核准
          </button>
          <img
            v-if="openBlock"
            @click="changeOpenBlock"
            src="@/assets/icon/icon-arrow-up.svg"
            class="ml-5"
          />
          <img
            v-if="!openBlock"
            @click="changeOpenBlock"
            src="@/assets/icon/icon-arrow-down.svg"
            class="ml-5"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useReviewStore } from "@/stores/review";
import ContracBar from "@/components/share/ContractReview/ContracBar.vue";

const props = defineProps({
  title: {
    type: String,
    default: "報價單"
  },
  subtitle: {
    type: String
  },
  fixed: {
    type: Boolean,
    default: true
  },
  showHistory: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    required: true
  },
  reviewType: {
    type: String,
    required: true
  },
  actionCallback: {
    type: Function
  }
});

let openBlock = ref(false);
let description = ref(null);
const reviewStore = useReviewStore();
const linkMap = {
  QUOTATION: "/signOffProcess",
  CUE_CHANGE: null,
  PRODUCT_PROMO: "/productPromoHistory"
};
const historyLink = computed(() => linkMap[props.reviewType]);

// 收合
const changeOpenBlock = () => {
  openBlock.value = !openBlock.value;
};

// 核准 or 駁回
const action = async actionType => {
  const params = {
    id: props.id,
    agree: actionType,
    note: description.value,
    type: props.reviewType
  };
  await reviewStore.postResourceAction(params);
  if (props.actionCallback) props.actionCallback();
};
</script>

<style lang="scss" scoped>
.contract_bar {
  background-color: #fff;
  position: fixed;
  z-index: 1999;
  top: 71px;
  width: 100%;
  left: 0;
  box-shadow: 0 2px 4px 0 rgba(221, 221, 221, 0.5);

  &_no_fixed {
    background-color: #fff;
    width: 100%;
    box-shadow: 0 2px 4px 0 rgba(221, 221, 221, 0.5);
  }
}

.contract_bar_main {
  width: 1440px;
  margin: 0 auto;
  padding: 16px 20px 16px 16px;
  display: flex;
  align-items: flex-start;

  .contract_bar_main_left {
    h2 {
      margin-left: 64px;
      margin-right: 100px;
      width: 190px;
    }
  }

  .contract_bar_main_right {
    display: flex;
    align-items: flex-start;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: 1.38px;

    .contract_bar_content_top {
      .content_top {
        min-height: 39px;
        display: flex;
        align-items: center;

        .title {
          color: #292929;
          margin-right: 8px;
        }

        .status {
          font-size: 16px;
          font-weight: bold;
          line-height: 1.38;
          letter-spacing: 1.38px;
          color: #00afb8;
        }

        .history {
          color: #00afb8;
          padding-left: 12px;
          margin-left: 12px;
          border-left: 1px solid #ddd;
        }
      }

      .content_bottom {
        .legal_block {
          display: flex;
          align-items: center;

          .content {
            padding: 0 4px;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.38;
            letter-spacing: 1.38px;
            color: #292929;
          }
        }

        .schedule_bar_block {
          padding-left: 73px;
        }

        .description_block {
          margin-top: 44px;
          display: flex;

          .w-680 {
            width: 680px;
          }

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

    .contract_button {
      button {
        width: 120px;
      }

      img {
        cursor: pointer;
      }
    }
  }
}
</style>
