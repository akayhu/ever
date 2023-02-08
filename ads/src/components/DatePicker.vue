<template>
  <el-date-picker
    v-model="dateValue"
    :editable="false"
    :picker-options="pickerOptions"
    :disabled="disabled"
    :type="type"
    :format="format"
    :value-format="format"
    :clearable="clearable"
    :class="{ selceted: isSelected }"
    :placeholder="placeholder"
    unlink-panels
    align="right"
    range-separator="~"
    start-placeholder="開始日期"
    end-placeholder="结束日期"
    @blur="rawStartDay = ''"
    @change="changeAction(dateValue)"
  >
  </el-date-picker>
</template>

<script>
import moment from "moment";
import {
  date,
  getToday,
  getThisYear,
  getAfterOctober,
  getDiffDay,
  getDateFormat
} from "@/utils/dateFormat";

const perdayMilliSec = 1000 * 60 * 60 * 24; // 毫秒 * 秒 * 分 * 天

export default {
  name: "DatePicker",
  data() {
    let self = this;
    return {
      rawStartDay: "",
      dateValue: "",
      pickerOptions: {
        disabledDate(time) {
          let condition = false;
          const rangeStart =
            self.dateRange.length > 0 ? moment(self.dateRange[0]) : null;
          const rangeEnd =
            self.dateRange.length > 0 ? moment(self.dateRange[1]) : null;

          // 過今年 10 月可選到明年底，未過今年 10 月只能選到今年底
          // 今天之前不能選
          if (self.reservation) {
            const date = new Date();
            const thisYear = getThisYear();
            const afterOctober = getAfterOctober();
            const selectableTime = moment(
              `${afterOctober ? thisYear + 1 : thisYear}-12-31`
            ).valueOf();
            const yesterday = date.setTime(date.getTime() - perdayMilliSec);
            condition =
              time.getTime() < yesterday || time.getTime() > selectableTime;
          }
          // 可否選今天之後
          else if (!self.selectedDateAfter) {
            const dayBeforeThisDay = moment(getToday()).valueOf();
            condition = time.getTime() > dayBeforeThisDay;
          }
          // 只能選本週與後兩週
          else if (self.thisWeekAndNextTwoWeeks) {
            const limitStartDay = moment(date)
              .startOf("isoweek")
              .valueOf();
            const limitEndDay = moment(date)
              .add(2, "weeks")
              .endOf("isoWeek")
              .valueOf();
            condition =
              time.getTime() < limitStartDay || time.getTime() > limitEndDay;
          }
          // 行事曆日期選取範圍
          else if (self.calendarDateRange) {
            const thisYear = getThisYear();
            const beforeDate = moment(
              `${thisYear - self.calendarBeforeRangeYear}-01-1`
            );
            const afterDate = moment(
              `${thisYear + self.calendarAfterRangeYear}-12-1`
            );
            condition =
              time.getTime() < beforeDate || time.getTime() > afterDate;
          }

          // 限制日期可以選的最大範圍
          if (self.maxDay !== -1 && self.rawStartDay) {
            let dayAfterStartDay =
              self.rawStartDay.getTime() + (self.maxDay - 1) * perdayMilliSec;
            if (rangeEnd && dayAfterStartDay > rangeEnd.valueOf())
              dayAfterStartDay = rangeEnd.valueOf();

            let dayBeforeStartDay =
              self.rawStartDay.getTime() - (self.maxDay - 1) * perdayMilliSec;
            if (rangeStart && dayBeforeStartDay < rangeStart.valueOf())
              dayBeforeStartDay = rangeStart.valueOf();
            return (
              condition ||
              time.getTime() > dayAfterStartDay ||
              time.getTime() < dayBeforeStartDay
            );
          }
          // 只能選日期區間內
          else if (self.dateRange.length > 0) {
            const time1 = moment(self.dateRange[0]);
            const time2 = moment(self.dateRange[1]);
            const beforeDate = moment.min(time1, time2);
            const afterDate = moment.max(time1, time2);
            return (
              condition ||
              time.getTime() < beforeDate.valueOf() ||
              time.getTime() > afterDate.valueOf()
            );
          } else {
            return condition;
          }
        },
        onPick(time) {
          let startDay;
          let endDay;
          if (time.minDate) self.rawStartDay = time.minDate;
          startDay = getDateFormat(time.minDate, "YYYY/MM/DD");
          if (time.maxDate) endDay = getDateFormat(time.maxDate, "YYYY/MM/DD");

          // 要抓走期天數
          if (time.maxDate && self.schedule) {
            // 相差天數
            const diffDay = getDiffDay(startDay, endDay, "/") + 1;
            const searchTime = {
              searchTimeStart: startDay,
              searchTimeEnd: endDay,
              itemIndex: self.itemIndex,
              dateItemIndex: self.dateItemIndex
            };
            self.dateValue = [startDay, endDay];
            if (self.getSearchTime) self.getSearchTime(searchTime);

            if (
              (self.itemIndex || self.itemIndex === 0) &&
              (self.dateItemIndex || self.dateItemIndex === 0)
            ) {
              self.schedule(
                String(diffDay),
                self.itemIndex,
                self.dateItemIndex,
                {
                  timeStart: startDay,
                  timeEnd: endDay
                }
              );
            } else {
              self.schedule(String(diffDay), {
                timeStart: startDay,
                timeEnd: endDay
              });
            }
          } else {
            // 只取起始結束時間
            if (time.maxDate && self.getSearchTime) {
              const searchTime = {
                searchTimeStart: startDay,
                searchTimeEnd: endDay
              };
              self.getSearchTime(searchTime);
            }
          }
        }
      }
    };
  },
  props: {
    type: {
      type: String,
      default: "daterange"
    },
    format: {
      type: String,
      default: "yyyy/MM/dd"
    },
    calendarDateRange: {
      type: Boolean,
      default: false
    },
    calendarBeforeRangeYear: {
      type: Number,
      default: 0
    },
    calendarAfterRangeYear: {
      type: Number,
      default: 0
    },
    getSearchTime: {
      type: Function,
      default: () => null
    },
    itemIndex: {
      type: Number
    },
    dateItemIndex: {
      type: Number
    },
    schedule: {
      type: Function
    },
    timeDay: {
      type: String
    },
    dateInterval: {
      type: Array
    },
    monthDateInterval: {
      type: String
    },
    placeholder: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    reservation: {
      type: Boolean,
      default: false
    },
    selectedDateAfter: {
      type: Boolean,
      default: true
    },
    maxDay: {
      type: Number,
      default: -1
    },
    changeAction: {
      type: Function,
      default: () => null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    thisAndNextWeek: {
      type: Boolean,
      default: false
    },
    dateRange: {
      type: Array,
      default: () => []
    }
  },
  beforeMount() {
    const { dateInterval, monthDateInterval } = this;
    if (dateInterval) {
      this.dateValue = dateInterval;
    } else if (monthDateInterval) {
      this.dateValue = monthDateInterval;
    }
  },
  computed: {
    isSelected() {
      return !!this.dateValue;
    }
  },
  watch: {
    // 走期多少天連動
    timeDay(newValue) {
      const { itemIndex, dateItemIndex, getSearchTime } = this;
      let startDay = "";
      let endDay = "";

      if (this.dateValue && !newValue) {
        this.dateValue = "";
      } else {
        if (this.dateValue && newValue) startDay = this.dateValue[0];
        if (!this.dateValue) startDay = moment().format("YYYY/MM/DD");
        endDay = moment(startDay)
          .add(newValue - 1, "days")
          .format("YYYY/MM/DD");
        this.dateValue = [startDay, endDay];
      }

      const searchTime = {
        searchTimeStart: startDay,
        searchTimeEnd: endDay,
        itemIndex,
        dateItemIndex
      };

      if (getSearchTime) getSearchTime(searchTime);
    },
    monthDateInterval(newValue) {
      this.dateValue = newValue;
    }
  }
};
</script>

<style>
.el-date-editor--month input.el-input__inner {
  padding-left: 30px !important;
  padding-right: 10px !important;
}
.el-picker-panel__content .el-year-table a,
.el-picker-panel__content .el-month-table a {
  font-size: 12px;
}
.el-picker-panel__content .el-month-table a:hover {
  text-decoration: none;
}
</style>
<style lang="scss" scoped>
@import "~scss/component/variables";

.el-range-editor {
  background-color: $gray-300 !important;
  color: $gray-600;
  border-color: $gray-400;

  ::v-deep {
    input {
      background-color: $gray-300 !important;
      color: $gray-600;
    }

    .el-range-separator {
      color: $gray-600;
    }

    .el-input__icon {
      color: $gray-600;
    }
  }

  &:hover {
    border-color: $gray-400;
  }

  &.is-active {
    border-color: $blue-turquoise !important;
  }

  &.selceted {
    ::v-deep .el-range-separator {
      color: $black;
    }
  }

  &.is-disabled {
    background-color: #f9f9f9 !important;
    color: $gray-400;

    ::v-deep input {
      background-color: #f9f9f9 !important;
      color: $gray-400;
    }

    &.is-active {
      border-color: $gray-400 !important;
    }
  }
}
</style>
