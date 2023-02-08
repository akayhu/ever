<template>
  <div class="progress_bar_wrapper">
    <div class="progress_bar_title mr-2">{{ title }}</div>
    <div class="progress_bar_block">
      <!-- 超過金額 -->
      <div class="exceed_amount_block">
        <div
          v-if="isExceed"
          class="exceed_amount_bar"
          :style="`width: ${handleExceedAmount}%`"
        ></div>
        <div
          v-if="isExceed"
          class="exceed_amount_word"
          :style="`left: ${handleExceedAmount}%`"
        >
          <div>已超過 ${{ overPrice.toLocaleString() }}</div>
        </div>
      </div>

      <!-- 總金額 -->
      <div class="lump_sum_block">
        <div
          class="lump_sum_bar"
          :style="`width: ${isExceed ? 90 : 100}%`"
        ></div>
        <div class="lump_sum_word" :style="`right: ${isExceed ? 10 : 0}%`">
          <div>
            總金額${{ lumpSum > 0 ? lumpSum.toLocaleString() : lumpSum }}
          </div>
        </div>
      </div>

      <!-- 目前拉 cue 金額 -->
      <div class="currently_cue_amount_block">
        <div
          class="currently_cue_amount_bar"
          :style="`width: ${!isExceed ? handleCurrentlyCue : 90}%`"
        ></div>
        <div
          class="currently_cue_amount_word"
          :style="`left: ${!isExceed ? handleCurrentlyCue : 90}%`"
        >
          <div>
            目前拉cue ${{
              currentlyCue > 0 ? currentlyCue.toLocaleString() : currentlyCue
            }}
          </div>
        </div>
      </div>

      <!-- 已拉 cue 金額 -->
      <div class="already_cue_amount_block">
        <div
          class="already_cue_amount_bar"
          :style="`width: ${handleAlreadyPulledCue}%`"
        ></div>
        <div
          class="already_cue_amount_word"
          :style="`left: ${handleAlreadyPulledCue}%`"
        >
          <div>
            ${{
              alreadyPulledCue > 0
                ? alreadyPulledCue.toLocaleString()
                : alreadyPulledCue
            }}
            <span class="remaining"
              >/ 剩餘 ${{
                remainingPrice > 0
                  ? remainingPrice.toLocaleString()
                  : remainingPrice
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="progress_bar_change_history">
      <span v-if="isExceed" class="has_exceeded ml-1 mr-3">已超過金額</span>
      <span
        v-if="title === '牌價金額' && cueTotalMarketPriceHistory.length > 0"
        class="change_history ml-1"
      >
        變更歷程
        <div class="change_history_block">
          <span class="title">拉CUE變更歷程</span>
          <ul>
            <li>
              <div>1. 原總牌價</div>
              <div>
                {{
                  cueTotalMarketPriceHistory[0].originTotalMarketPrice.toLocaleString()
                }}
                元
              </div>
              <div></div>
            </li>
            <li
              v-for="(item, index) in cueTotalMarketPriceHistory"
              :key="index"
            >
              <div>{{ `${index + 2}. 變更後總牌價` }}</div>
              <div>{{ item.totalMarketPrice.toLocaleString() }} 元</div>
              <div>{{ item.changeDate }}</div>
            </li>
          </ul>
        </div>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUpdated } from "vue";
import { usePullCueStore } from "@/stores/pullCue.js";

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  // 總金額
  lumpSum: {
    type: Number,
    default: 0
  },
  // 目前拉 cue 金額
  currentlyCue: {
    type: Number,
    default: 0
  },
  // 已拉 cue 金額
  alreadyPulledCue: {
    type: Number,
    default: 0
  },
  // 剩餘可拉 cue 金額
  remainingPrice: {
    type: Number,
    default: 0
  },
  // 超過金額
  overPrice: {
    type: Number,
    default: 0
  }
});
const pullCueStore = usePullCueStore();
const cueTotalMarketPriceHistory = computed(
  () => pullCueStore.cueTotalMarketPriceHistory
);
const isExceed = ref(false);
const handleExceedAmount = ref(0);
const handleCurrentlyCue = ref(0);
const handleAlreadyPulledCue = ref(0);

const updateProgressBar = () => {
  if (props.overPrice > 0) {
    isExceed.value = true;
    handleExceedAmount.value = 100;
  } else {
    isExceed.value = false;
    handleExceedAmount.value = 0;
  }
  handleAlreadyPulledCue.value = (props.alreadyPulledCue / props.lumpSum) * 100;
  handleCurrentlyCue.value =
    (props.currentlyCue / props.lumpSum) * 100 + handleAlreadyPulledCue.value;
};

onUpdated(() => {
  updateProgressBar();
});

updateProgressBar();
</script>

<style lang="scss" scoped>
.progress_bar {
  &_wrapper {
    display: flex;
    align-items: center;
  }

  &_title {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #7e7e7e;
  }

  &_block {
    width: 230px;
    border-radius: 10px;
    border: dashed 1px #ddd;
    height: 16px;
    padding: 0px 2px;
    position: relative;

    > div {
      height: 10px;
      border-radius: 10px;

      &.exceed_amount_block,
      &.lump_sum_block,
      &.currently_cue_amount_block,
      &.already_cue_amount_block {
        display: flex;
        position: relative;

        .exceed_amount_bar,
        .lump_sum_bar,
        .currently_cue_amount_bar,
        .already_cue_amount_bar {
          border-radius: 10px;
        }

        .exceed_amount_word,
        .lump_sum_word,
        .currently_cue_amount_word,
        .already_cue_amount_word {
          position: absolute;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1.23px;
          color: #797979;
          align-items: center;
          border-left: 1px dashed #979797;
          display: none;
          padding-bottom: 24px;
          top: -39px;
          width: 350px;
          height: 36px;

          div {
            background-color: #fff;
            position: absolute;
            left: -9px;
            line-height: 1px;

            &::before {
              content: " ";
              width: 16px;
              height: 16px;
              box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
              border-radius: 50%;
              margin-right: 4px;
              display: inline-block;
              vertical-align: text-bottom;
            }
          }
        }

        .exceed_amount_word,
        .currently_cue_amount_word,
        .already_cue_amount_word {
          div {
            &::after {
              width: 6.8px;
              height: 9px;
              background: initial;
              content: " ";
              position: absolute;
              top: 14px;
              left: 4px;
              border-left: 4px solid transparent;
              border-right: 4px solid transparent;
            }
          }
        }
      }

      &.exceed_amount_block {
        top: 2px;

        &:hover {
          .exceed_amount_word {
            display: inline-flex;
          }
        }

        .exceed_amount_bar {
          background-color: #ea475b;
          z-index: 1;
        }

        .exceed_amount_word {
          div {
            color: #ea475b;

            &::before {
              background-color: #ea475b;
            }
            &::after {
              border-top: 6px solid #ea475b;
            }
          }
        }
      }

      &.lump_sum_block {
        top: -8px;

        .lump_sum_bar {
          background-color: #ddd;
          z-index: 2;
        }

        .lump_sum_word {
          border-left: 0px;
          border-right: 1px dashed #979797;
          width: -webkit-fill-available;
          padding: 20px 0 0;
          display: inline-flex;
          margin-top: 10px;
          top: 0;
          height: 20px;
          text-align: right;
          right: -1px;

          div {
            width: 100%;
            left: 4px;

            &::before {
              content: "";
              width: 0;
              height: 0;
            }

            &::after {
              content: " ";
              width: 7px;
              height: 7px;
              background-color: #ddd;
              vertical-align: initial;
              box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
              border-radius: 50%;
              margin-left: 4px;
              display: inline-block;
            }
          }
        }
      }

      &.currently_cue_amount_block {
        top: -18px;

        &:hover {
          .currently_cue_amount_word {
            display: inline-flex;
          }
        }

        .currently_cue_amount_bar {
          background-color: #b8f786;
          z-index: 3;
        }

        .currently_cue_amount_word {
          div {
            color: #94d163;

            &::before {
              background-color: #b8f786;
            }
            &::after {
              border-top: 6px solid #b8f786;
            }
          }
        }
      }

      &.already_cue_amount_block {
        top: -28px;

        &:hover {
          .already_cue_amount_word {
            display: inline-flex;
          }
        }

        .already_cue_amount_bar {
          background-color: #8debc8;
          z-index: 4;
        }

        .already_cue_amount_word {
          div {
            color: #00afb8;
            line-height: 1.3;

            &::before {
              background-color: #8debc8;
            }
            &::after {
              border-top: 6px solid #8debc8;
            }

            .remaining {
              letter-spacing: 1.23px;
              color: #797979;
            }
          }
        }
      }
    }
  }

  &_change_history {
    font-size: 12px;
    font-weight: bold;
    line-height: 1.67;
    letter-spacing: 1.23px;
    color: #1654b9;
    cursor: pointer;

    .has_exceeded {
      color: #ea475b;
      cursor: initial;
    }

    .change_history {
      font-size: 12px;
      line-height: 1.67;
      letter-spacing: 1.23px;
      color: #1654b9;
      position: relative;
      cursor: pointer;

      &:hover {
        .change_history_block {
          display: block;
        }
      }

      .change_history_block {
        display: none;
        position: absolute;
        left: 68px;
        top: -14px;
        width: 545px;
        padding: 16px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
        border: solid 1px #e2e1e1;
        z-index: 9;

        .title {
          font-size: 16px;
          font-weight: bold;
          color: #292929;
        }

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
          font-size: 16px;
          font-weight: normal;
          line-height: 1.57;
          letter-spacing: 1.23px;
          color: #292929;
          margin: 4px 0 0;

          li {
            padding: 8px 8px 8px 0;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            color: #7e7e7e;

            div {
              &:nth-child(1) {
                color: #292929;
                min-width: 125px;
              }
              &:nth-child(2) {
                text-align: right;
                min-width: 130px;
              }
              &:nth-child(3) {
                font-size: 14px;
                min-width: 152px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
