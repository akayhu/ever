<template>
  <div class="year_month_selection">
    <div>
      <icon
        v-if="!firstDate"
        @click.native="switchFirstMonth()"
        iconName="icon-arrow-left-double"
      />
      <icon
        v-else
        v-tooltip="{
          content: `您選擇的專案區間為${periodData.start}~${periodData.end}`,
          offset: 5,
          placement: 'left',
          trigger: 'hover'
        }"
        iconName="icon-arrow-left-double-disable"
        disabled
      />
      <icon
        v-if="!firstDate"
        @click.native="changeSwitchState('month', 'prev')"
        iconName="icon-arrow-left"
      />
      <icon
        v-else
        v-tooltip="{
          content: `您選擇的專案區間為${periodData.start}~${periodData.end}`,
          offset: 5,
          placement: 'left',
          trigger: 'hover'
        }"
        iconName="icon-arrow-left-disable"
        disabled
      />
      <ADSDatePicker
        v-model="value2"
        align="left"
        type="month"
        placeholder="選擇日期"
        format="yyyy/MM/dd"
        :picker-options="pickerOptions"
        @change="changeDate(value2)"
      >
        <template v-slot:custom_input>
          <div class="year_month">
            <span class="year">
              {{
                weeksShowTwoYears.showTwoYears
                  ? `${weeksShowTwoYears.weekFirstYear} ~ ${weeksShowTwoYears.weekNextYear}`
                  : year
              }}年
            </span>
            <span class="month">
              {{
                weeksShowTwoMonths.showTwoMonths
                  ? `${weeksShowTwoMonths.weekFirstMonth} ~ ${weeksShowTwoMonths.weekNextMonth}`
                  : month
              }}月
            </span>
          </div>
        </template>
      </ADSDatePicker>
      <icon
        v-if="!lastData"
        @click.native="changeSwitchState('month', 'next')"
        iconName="icon-arrow-right"
      />
      <icon
        v-else
        v-tooltip="{
          content: `您選擇的專案區間為${periodData.start}~${periodData.end}`,
          offset: 5,
          placement: 'right',
          trigger: 'hover'
        }"
        iconName="icon-arrow-right-disable"
        disabled
      />
      <icon
        v-if="!lastData"
        @click.native="switchLastMonth()"
        iconName="icon-arrow-right-double"
      />
      <icon
        v-else
        v-tooltip="{
          content: `您選擇的專案區間為${periodData.start}~${periodData.end}`,
          offset: 5,
          placement: 'right',
          trigger: 'hover'
        }"
        iconName="icon-arrow-right-double-disable"
        disabled
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { getDaysInYearMonth } from "@/utils/dateProcessing.js";

export default {
  props: {
    year: {
      type: Number,
      default: 2022
    },
    month: {
      type: Number,
      default: 1
    },
    periodData: {
      type: Object,
      default: () => {}
    },
    switchDesignatedDate: {
      type: Function,
      default: () => {}
    },
    weeksShowTwoYears: {
      type: Object,
      default: () => {}
    },
    weeksShowTwoMonths: {
      type: Object,
      default: () => {}
    },
    changeSwitchState: {
      type: Function,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const value2 = ref("");
    const pickerOptions = ref({
      disabledDate(time) {
        const splitPeriodDataStart = props.periodData.start.split("/");
        const periodStartYear = Number(splitPeriodDataStart[0]);
        const periodStartMonth = Number(splitPeriodDataStart[1]);
        const splitPeriodDataEnd = props.periodData.end.split("/");
        const periodEndYear = Number(splitPeriodDataEnd[0]);
        const periodEndMonth = Number(splitPeriodDataEnd[1]);
        const days = getDaysInYearMonth(periodEndYear, periodEndMonth);
        return (
          new Date(`${periodStartYear}/${periodStartMonth}/1`).getTime() >
            time.getTime() ||
          time.getTime() >
            new Date(`${periodEndYear}/${periodEndMonth}/${days}`).getTime()
        );
      }
    });

    // 最前的專案區間時間
    const firstDate = computed(() => {
      const period = getPeriodSplitData("start");
      return (
        period.periodYear === props.year && period.periodMonth === props.month
      );
    });

    // 最後的專案區間時間
    const lastData = computed(() => {
      const period = getPeriodSplitData("end");
      return (
        period.periodYear === props.year && period.periodMonth === props.month
      );
    });

    // 時間拆分
    const getPeriodSplitData = type => {
      const splitPeriodData =
        type === "start"
          ? props.periodData.start.split("/")
          : props.periodData.end.split("/");
      const periodYear = Number(splitPeriodData[0]);
      const periodMonth = Number(splitPeriodData[1]);
      return { periodYear, periodMonth };
    };

    // 取專案區間第一個月份
    const switchFirstMonth = () => {
      const period = getPeriodSplitData("start");
      props.switchDesignatedDate(
        period.periodYear,
        period.periodMonth,
        props.periodData.start
      );
    };

    // 取專案區間最後一個月
    const switchLastMonth = () => {
      const period = getPeriodSplitData("end");
      props.switchDesignatedDate(
        period.periodYear,
        period.periodMonth,
        props.periodData.end
      );
    };

    // 選擇年月
    const changeDate = val => {
      value2.value = "";
      emit("changeDate", val);
    };

    return {
      value2,
      pickerOptions,
      firstDate,
      lastData,
      switchFirstMonth,
      switchLastMonth,
      changeDate
    };
  }
};
</script>

<style lang="scss" scoped>
.year_month_selection {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  height: 48px;
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 1180px;
  position: sticky;
  top: 146px;
  z-index: 5;

  > div {
    width: 390px;
    margin: 0 auto;
    text-align: center;
    letter-spacing: 1.38px;

    img {
      &:not(.disabled) {
        cursor: pointer;
      }
    }

    .year_month {
      cursor: pointer;

      > span {
        &.year {
          margin: 0 28px;
        }
        &.month {
          margin-right: 28px;
        }
      }
    }
  }
}
</style>
