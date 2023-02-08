<template>
  <div>
    <div class="project_date_interval_selector">
      <span
        @click="changeDate('interval')"
        :class="{ focus: intervalType === 'interval' }"
      >
        區間
      </span>
      <span
        @click="changeDate('week')"
        :class="{ focus: intervalType === 'week' }"
      >
        週
      </span>
      <span
        @click="changeDate('day')"
        :class="{ focus: intervalType === 'day' }"
      >
        日
      </span>
    </div>
    <div class="interval_date">
      <div class="advertising_interval">
        廣告區間：
        <span v-if="intervalType === 'interval'">{{ showIntervalDate }}</span>
        <span v-else-if="intervalType === 'week'">{{ showWeekDate }}</span>
        <span v-else>
          <span v-for="(item, index) in showDayDate" :key="index">
            <span
              @click="changeDay(item, index)"
              :class="{ focus: index === currentlyShowDayCount }"
              >{{ item.substr(5, 5) }}</span
            >
            <span v-if="index !== showDayDate.length - 1" class="comma"
              >、</span
            >
          </span>
        </span>
      </div>
      <div v-if="intervalType !== 'interval'" class="control_week pr-2">
        <button
          @click="updateCurrentWeek('prev')"
          :disabled="currentlyShowCount === 0"
          class="bg-transparent border-0 p-0"
        >
          <icon
            iconName="icon-arrow-left"
            :disabled="currentlyShowCount === 0"
          />
        </button>
        <button
          @click="updateCurrentWeek('next')"
          :disabled="currentlyShowCount === weekCount - 1"
          class="bg-transparent border-0 p-0"
        >
          <icon
            iconName="icon-arrow-right"
            :disabled="currentlyShowCount === weekCount - 1"
          />
        </button>
      </div>
      <div v-if="intervalType !== 'interval'" class="control_warning">
        <icon
          iconName="icon-info-warmgray"
          size="16"
          v-tooltip="{
            offset: 5,
            content: '時間可依週切換',
            placement: 'right',
            trigger: 'hover'
          }"
        />
      </div>
    </div>
    <div v-if="!isLoading" class="project_summary">
      <content-block class="ad_position_block p-5">
        <div class="content_header d-flex" slot="header">
          <icon iconName="icon-gear" />
          <div class="ml-1">廣告版位</div>
        </div>
        <div class="content_detail d-flex mt-5 ml-7" slot="content">
          <div class="single_block">
            <div>廣告版位瀏覽數</div>
            <div class="content_detail_number">
              {{ projectSummary.impression | numberCommaFormat }}
            </div>
          </div>
          <div class="single_block">
            <div>廣告點擊數</div>
            <div class="content_detail_number">
              {{ projectSummary.click | numberCommaFormat }}
            </div>
          </div>
          <div class="single_block">
            <div>CTR</div>
            <div class="content_detail_number">
              <span>{{ projectSummary.ctr }}</span>
              <span class="number_affix">%</span>
            </div>
          </div>
        </div>
      </content-block>
      <content-block class="act_page_block ml-5 p-5 ">
        <div class="content_header d-flex" slot="header">
          <icon iconName="icon-gear" />
          <div class="ml-1">活動網頁</div>
        </div>
        <div class="content_detail d-flex mt-5 ml-7" slot="content">
          <div class="single_block">
            <div>廣告活動頁瀏覽數</div>
            <div class="content_detail_number empty">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </content-block>
      <content-block class="proactive_apply_block p-5">
        <div class="content_header d-flex" slot="header">
          <icon iconName="icon-gear" />
          <div class="ml-1">主動應徵</div>
        </div>
        <div class="content_detail d-flex mt-5 ml-7" slot="content">
          <div class="single_block flex-reset">
            <div>網頁曝光職缺主應數</div>
            <div class="content_detail_number">
              {{ projectSummary.focusJobApplyCount | numberCommaFormat }}
            </div>
          </div>
          <div class="single_block flex-35">
            <div>平均廣告後單週主應成長率</div>
            <div class="content_detail_number">
              <span v-if="intervalType === 'interval'">
                <span>{{ projectSummary.applyGrowthRateLow }}</span>
                <span class="number_affix">%</span>
                <span class="number_tilde mx-1">~</span>
                <span>{{ projectSummary.applyGrowthRateHigh }}</span>
                <span class="number_affix">%</span>
              </span>
              <span v-else class="content_detail_number empty">
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
          <div class="single_block flex-reset">
            <div>版位主應轉換率</div>
            <div class="content_detail_number">
              <span>{{ projectSummary.boardApplyConvertionRate }}</span>
              <span class="number_affix">%</span>
            </div>
          </div>
          <div class="single_block flex-reset">
            <div>活動頁主應轉換率</div>
            <div class="content_detail_number empty">
              <span></span>
              <span></span>
              <!-- <span></span>
            <span class="number_affix"></span> -->
            </div>
          </div>
        </div>
      </content-block>
      <content-block class="cost_calculation_block p-5">
        <div class="content_header d-flex" slot="header">
          <icon iconName="icon-gear" />
          <div class="ml-1">成本計算</div>
        </div>
        <div class="content_detail d-flex mt-5 ml-7" slot="content">
          <div class="single_block">
            <div class="specific_info">
              <span>CPM</span>
              <span class="specific_info_expand ml-1"
                >(Cost-Per 1000 impression)</span
              >
            </div>
            <div>每千次曝光成本</div>
            <div class="content_detail_number">
              <span class="number_affix dollar_sign">$</span>
              <span class="ml-1">{{
                projectSummary.cpm | numberCommaFormat
              }}</span>
            </div>
          </div>
          <div class="single_block">
            <div class="specific_info">
              <span>CPC</span>
              <span class="specific_info_expand ml-1">(Cost-Per Click)</span>
            </div>
            <div>每次點擊成本</div>
            <div class="content_detail_number">
              <span class="number_affix dollar_sign">$</span>
              <span class="ml-1">{{
                projectSummary.cpc | numberCommaFormat
              }}</span>
            </div>
          </div>
          <div class="single_block">
            <div class="specific_info">
              <span>CPA</span>
              <span class="specific_info_expand ml-1">(Cost-Per action)</span>
            </div>
            <div>每個主應成本</div>
            <div class="content_detail_number">
              <span class="number_affix dollar_sign">$</span>
              <span class="ml-1">{{
                projectSummary.cpa | numberCommaFormat
              }}</span>
            </div>
          </div>
        </div>
      </content-block>
    </div>
    <div class="loading" v-if="isLoading">
      <Loading />
    </div>
  </div>
</template>

<script>
import ContentBlock from "@/components/reportQuery/closeReport/ContentBlock";
import { createNamespacedHelpers } from "vuex";
import { ACTIONS_TYPE } from "@/store/modules/report/closeReport";
import Loading from "@/components/Loading";

const { mapState, mapActions } = createNamespacedHelpers("report/closeReport");

export default {
  name: "TabProjectSummary",
  data() {
    return {
      intervalType: "interval",
      intervalDate: [],
      showIntervalDate: "",
      showWeekDate: "",
      showDayDate: [],
      weekCount: 0,
      currentlyShowCount: 0,
      currentlyShowDayCount: 0,
      isLoading: false
    };
  },
  components: {
    Loading,
    ContentBlock
  },
  computed: {
    ...mapState({
      projectSummary: state => {
        return state.projectSummary;
      }
    })
  },
  mounted() {
    const { projectSummary, getClosingProjectSummary, getSetTimeout } = this;
    if (projectSummary.projectId !== 0) {
      this.isLoading = true;
      this.intervalDate = projectSummary.intervalDate;
      this.weekCount = projectSummary.intervalDate.length;
      this.intervalType = "interval";
      this.showIntervalDate = `${projectSummary.startDate} ~ ${projectSummary.endDate}`;
      this.showWeekDate = `${projectSummary.intervalDate[0][0]} ~ ${
        projectSummary.intervalDate[0][
          projectSummary.intervalDate[0].length - 1
        ]
      }`;
      this.showDayDate = projectSummary.intervalDate[0];
      getClosingProjectSummary();
      getSetTimeout();
    }
  },
  methods: {
    ...mapActions({
      getClosingProjectSummary: ACTIONS_TYPE.GET_CLOSING_PROJECT_SUMMARY
    }),
    // 切換區間
    changeDate(type) {
      const { intervalDate, getClosingProjectSummary, getSetTimeout } = this;
      this.isLoading = true;
      this.intervalType = type;
      this.currentlyShowCount = 0;
      this.showWeekDate = `${intervalDate[0][0]} ~ ${
        intervalDate[0][intervalDate[0].length - 1]
      }`;
      this.showDayDate = intervalDate[0];
      switch (type) {
        case "interval":
          getClosingProjectSummary();
          break;
        case "week":
          getClosingProjectSummary({
            start: intervalDate[0][0],
            end: intervalDate[0][intervalDate[0].length - 1]
          });
          break;
        case "day":
          getClosingProjectSummary({
            start: intervalDate[0][0],
            end: intervalDate[0][0]
          });
          break;
      }
      getSetTimeout();
    },
    // 切換週時間
    changeShowWeekDate() {
      const { intervalDate } = this;
      this.showWeekDate = `${intervalDate[this.currentlyShowCount][0]} ~ ${
        intervalDate[this.currentlyShowCount][
          intervalDate[this.currentlyShowCount].length - 1
        ]
      }`;
    },
    // 切換日時間
    changeShowDayDate() {
      const { intervalDate, currentlyShowCount } = this;
      this.showDayDate = intervalDate[currentlyShowCount];
    },
    // 切換下週
    updateCurrentWeek(type) {
      const {
        intervalType,
        changeShowWeekDate,
        changeShowDayDate,
        getClosingProjectSummary,
        intervalDate,
        getSetTimeout
      } = this;

      this.isLoading = true;
      this.currentlyShowDayCount = 0;

      type === "prev"
        ? (this.currentlyShowCount -= 1)
        : (this.currentlyShowCount += 1);

      if (intervalType === "week") {
        changeShowWeekDate();
        getClosingProjectSummary({
          start: intervalDate[this.currentlyShowCount][0],
          end:
            intervalDate[this.currentlyShowCount][
              intervalDate[this.currentlyShowCount].length - 1
            ]
        });
      } else {
        changeShowDayDate();
        getClosingProjectSummary({
          start: intervalDate[this.currentlyShowCount][0],
          end: intervalDate[this.currentlyShowCount][0]
        });
      }
      getSetTimeout();
    },
    // 選單日
    changeDay(day, index) {
      const { getClosingProjectSummary, getSetTimeout } = this;
      this.isLoading = true;
      this.currentlyShowDayCount = index;
      getClosingProjectSummary({
        start: day,
        end: day
      });
      getSetTimeout();
    },
    // 關閉 Loading
    getSetTimeout() {
      setTimeout(() => {
        this.isLoading = false;
      }, 800);
    }
  },
  watch: {
    projectSummary(newVal, oldVal) {
      this.intervalDate = newVal.intervalDate;
      this.weekCount = newVal.intervalDate.length;
      if (oldVal.projectId !== newVal.projectId) this.intervalType = "interval";
      if (!this.showIntervalDate || oldVal.projectId !== newVal.projectId)
        this.showIntervalDate = `${newVal.startDate} ~ ${newVal.endDate}`;
      if (this.weekCount > 0) {
        if (!this.showWeekDate || oldVal.projectId !== newVal.projectId) {
          this.showWeekDate = `${newVal.intervalDate[0][0]} ~ ${
            newVal.intervalDate[0][newVal.intervalDate[0].length - 1]
          }`;
        }
        if (
          this.showDayDate.length === 0 ||
          oldVal.projectId !== newVal.projectId
        )
          this.showDayDate = newVal.intervalDate[0];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/report/table";

.interval_date {
  display: flex;

  .advertising_interval {
    margin: 0 10px 16px 0;
    font-size: 16px;

    span {
      letter-spacing: 1.38px;
      color: #00b2ba;
      line-height: 1.38;

      span {
        display: inline-block;
        cursor: pointer;

        .focus {
          background-color: #e1fafa;
          color: #00b2ba;
          padding: 4px;
        }

        span {
          padding: 0;

          &.comma {
            color: #333;
          }
        }
      }
    }
  }
}

.project_summary {
  display: flex;
  flex-wrap: wrap;
}

.ad_position_block {
  width: 730px;
  height: 160px;
}

.act_page_block {
  width: 428px;
  height: 160px;
}

.proactive_apply_block {
  width: 1178px;
  height: 176px;
  margin-top: 24px;
}

.cost_calculation_block {
  width: 1178px;
  height: 200px;
  margin-top: 24px;
}

.content_header {
  @include font-common(20px, $font-weight-bold);
}

// 內容區塊
.content_detail {
  @include font-common(16px);

  > .single_block {
    flex-grow: 1;
    flex-basis: 33.33%;

    // 數字綴詞統一設定
    .number_tilde {
      @include font-common(16px, $font-weight-normal);
    }

    .number_affix {
      @include font-common(16px, $font-weight-normal);
      margin-left: 4px;
    }

    .dollar_sign {
      margin-left: 0;
    }

    // 每一列上推
    > div:not(:first-child) {
      margin-top: 10px;
    }

    // 額外標題說明

    .specific_info {
      @include font-common(16px, $font-weight-bold);

      &_expand {
        @include font-common(12px, $font-weight-normal);
      }
    }
  }

  > .single_block:not(:first-child) {
    padding-left: 20px;
    border-left: solid 1px $gray-400;
  }

  // 數字樣式設定
  &_number {
    @include font-common(28px, $font-weight-normal, $blue-text);

    &.empty {
      display: flex;
      align-items: center;
      height: 30px;
      span {
        width: 15px;
        height: 2px;
        background-color: $gray-600;
      }
      > span + span {
        margin-left: 6px;
      }
    }
  }

  // 為了有較長區塊特別設定
  $flex45: 45%;

  .flex-35 {
    flex-basis: $flex45;
  }

  .flex-reset {
    flex-basis: calc(100% - #{$flex45}) / 3;
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}
</style>
