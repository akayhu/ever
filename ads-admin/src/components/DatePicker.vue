<template>
  <div>
    <el-date-picker
      v-model="dateValue"
      :editable="false"
      :picker-options="pickerOptions"
      :disabled="disabled"
      unlink-panels
      type="daterange"
      align="right"
      range-separator="~"
      start-placeholder="開始日期"
      end-placeholder="结束日期"
      value-format="YYYY/MM/DD"
      format="YYYY/MM/DD"
      :clearable="clearable"
      :class="{ selceted: isSelected }"
      @blur="rawStartDay = ''"
      @change="handleChange(dateValue)"
    >
    </el-date-picker>
  </div>
</template>

<script>
import moment from "moment";
import {
  getToday,
  getThisYear,
  getAfterOctober,
  getDiffDay,
  getDateFormat
} from "@/utils/dateFormat";

const perdayMilliSec = 1000 * 60 * 60 * 24; //毫秒 * 秒 * 分 * 天

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
          if (self.reservation) {
            const date = new Date();
            const thisYear = getThisYear();
            const afterOctober = getAfterOctober();
            // 過今年 10 月可選到明年底，未過今年 10 月只能選到今年底
            const selectableTime = moment(
              `${afterOctober ? thisYear + 1 : thisYear}-12-31`
            ).valueOf();
            // 今天之前不能選
            const yesterday = date.setTime(date.getTime() - perdayMilliSec);
            condition =
              time.getTime() < yesterday || time.getTime() > selectableTime;
          } else if (!self.selectedDateAfter) {
            const dayBeforeThisDay = moment(getToday()).valueOf();
            condition = time.getTime() > dayBeforeThisDay;
          }
          // 限制日期可以選的最大範圍
          if (self.maxDay !== -1 && self.rawStartDay) {
            const dayAfterStartDay =
              self.rawStartDay.getTime() + (self.maxDay - 1) * perdayMilliSec;
            const dayBeforeStartDay =
              self.rawStartDay.getTime() - (self.maxDay - 1) * perdayMilliSec;
            return (
              condition ||
              time.getTime() > dayAfterStartDay ||
              time.getTime() < dayBeforeStartDay
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
            self.getSearchTime(searchTime);

            if (
              (self.itemIndex || self.itemIndex === 0) &&
              (self.dateItemIndex || self.dateItemIndex === 0)
            ) {
              self.schedule(
                String(diffDay),
                self.itemIndex,
                self.dateItemIndex
              );
            } else {
              self.schedule(String(diffDay));
            }
          } else {
            // 只取起始結束時間
            if (time.maxDate) {
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
    getSearchTime: {
      type: Function,
      required: true
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
    }
  },
  beforeMount() {
    const { dateInterval } = this;
    if (dateInterval) {
      this.dateValue = dateInterval;
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

      getSearchTime(searchTime);
    }
  },
  methods: {
    handleChange(time) {
      if (time) {
        const { itemIndex, dateItemIndex } = this;
        this.getSearchTime({
          searchTimeStart: time[0],
          searchTimeEnd: time[1],
          itemIndex,
          dateItemIndex
        });
      } else {
        this.$emit("clearAction");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

:deep(.el-range-editor) {
  background-color: $gray-300 !important;
  color: $gray-600;
  border-color: $gray-400;

  input {
    color: $gray-900;
  }

  .el-input__icon {
    color: $gray-600;
  }

  .el-range-separator {
    color: $gray-600;
  }

  &:hover {
    border-color: $gray-400;
  }

  &.is-active {
    border-color: $blue-turquoise !important;
  }

  &.selceted {
    .el-range-separator {
      color: $black;
    }
  }

  &.is-disabled {
    background-color: #f9f9f9 !important;
    color: $gray-400;

    input {
      background-color: #f9f9f9 !important;
      color: $gray-400;
    }

    &.is-active {
      border-color: $gray-400 !important;
    }
  }
}
</style>
