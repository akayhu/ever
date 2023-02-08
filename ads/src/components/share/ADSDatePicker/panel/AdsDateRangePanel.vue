<template>
  <transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div
      v-show="visible"
      class="el-picker-panel el-date-picker el-popper ads-picker"
      :class="[
        {
          'has-sidebar': $slots.sidebar || shortcuts,
          'has-time': showTime
        },
        popperClass
      ]"
    >
      <div class="el-picker-panel__body-wrapper">
        <div class="picker-close-panel" @click="$emit('closePanel')">
          <div>&#x2715;</div>
        </div>
        <div v-if="allJobText" class="allJobText">
          全部職缺<span>{{ allJobText }}</span
          >設定
        </div>
        <slot name="sidebar" class="el-picker-panel__sidebar"></slot>
        <div class="el-picker-panel__sidebar" v-if="shortcuts">
          <button
            type="button"
            class="el-picker-panel__shortcut"
            v-for="(shortcut, key) in shortcuts"
            :key="key"
            @click="handleShortcutClick(shortcut)"
          >
            {{ shortcut.text }}
          </button>
        </div>
        <div class="el-picker-panel__body">
          <div
            class="el-date-range-picker__header"
            :class="{
              'el-date-picker__header--bordered':
                currentView === 'year' || currentView === 'month'
            }"
          >
            <button
              type="button"
              @click="leftPrevYear"
              v-show="!disableArrow"
              class="el-picker-panel__icon-btn el-icon-d-arrow-left"
            ></button>
            <button
              type="button"
              @click="leftPrevMonth"
              v-show="currentView === 'date' && !disableArrow"
              class="el-picker-panel__icon-btn el-icon-arrow-left"
            ></button>
            <button
              type="button"
              @click="leftNextYear"
              v-show="!disableArrow"
              class="el-picker-panel__icon-btn el-icon-d-arrow-right"
            ></button>
            <button
              type="button"
              v-show="currentView === 'date' && !disableArrow"
              @click="leftNextMonth"
              class="el-picker-panel__icon-btn el-icon-arrow-right"
            ></button>
            <span v-if="disableArrow">{{ yearLabel }}</span>
            <span
              v-else
              @click="currentView = 'year'"
              role="button"
              class="el-date-picker__header-label"
              >{{ yearLabel }}</span
            >
            <span v-if="disableArrow">{{
              t(`el.datepicker.month${leftMonth + 1}`)
            }}</span>
            <span
              v-else
              @click="currentView = 'month'"
              v-show="currentView === 'date'"
              role="button"
              class="el-date-picker__header-label"
              :class="{ active: currentView === 'month' }"
              >{{ t(`el.datepicker.month${leftMonth + 1}`) }}</span
            >
          </div>
          <div class="el-picker-panel__content">
            <date-table
              v-show="currentView === 'date'"
              selection-mode="range"
              :date="leftDate"
              :default-value="defaultValue"
              :min-date="minDate"
              :max-date="maxDate"
              :range-state="rangeState"
              :disabled-date="disabledDate"
              :active-range="activeRange"
              :cell-class-name="cellClassName"
              @changerange="handleChangeRange"
              :first-day-of-week="firstDayOfWeek"
              @pick="handleRangePick"
            >
            </date-table>
            <year-table
              v-show="currentView === 'year'"
              @pick="handleYearPick"
              :value="value"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="leftDate"
              :disabled-date="disabledDate"
            >
            </year-table>
            <month-table
              v-show="currentView === 'month'"
              @pick="handleMonthPick"
              :value="value"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="leftDate"
              :disabled-date="disabledDate"
            >
            </month-table>
          </div>
        </div>
      </div>
      <div class="el-picker-panel__footer" v-show="currentView === 'date'">
        <div v-if="minVisibleDate" class="picker-selected-range">
          <span>{{ minVisibleDate }}</span>
          <span> ~ </span>
          <span>{{ maxVisibleDate }}</span>
          <p>
            共 <span>{{ selectedTotalDays }}</span> 天
          </p>
        </div>
        <button
          class="button_bg_white_medium mt-2"
          :class="{ button_bg_white_medium_disable: btnDisabled }"
          @click="handleConfirm(false)"
        >
          確定
        </button>
      </div>
      <div class="ads-popper-arrow"></div>
    </div>
  </transition>
</template>

<script type="text/babel">
import {
  formatDate,
  parseDate,
  isDate,
  modifyDate,
  modifyTime,
  modifyWithTimeString,
  prevYear,
  nextYear,
  prevMonth,
  nextMonth,
  nextDate,
  extractDateFormat,
  extractTimeFormat,
  changeYearMonthAndClampDate
} from "element-ui/src/utils/date-util";
import Clickoutside from "element-ui/src/utils/clickoutside";
import Locale from "element-ui/src/mixins/locale";
import DateTable from "../table/dateTable.vue";
import YearTable from "../table/yearTable.vue";
import MonthTable from "../table/monthTable.vue";

const calcDefaultValue = defaultValue => {
  if (Array.isArray(defaultValue)) {
    return [new Date(defaultValue[0]), new Date(defaultValue[1])];
  } else if (defaultValue) {
    return [new Date(defaultValue), nextDate(new Date(defaultValue), 1)];
  } else {
    return [new Date(), nextDate(new Date(), 1)];
  }
};

export default {
  mixins: [Locale],

  directives: { Clickoutside },

  computed: {
    btnDisabled() {
      return !(
        this.minDate &&
        this.maxDate &&
        !this.rangeState.selecting &&
        this.isValidValue([this.minDate, this.maxDate])
      );
    },

    leftLabel() {
      return (
        this.leftDate.getFullYear() +
        " " +
        this.t("el.datepicker.year") +
        " " +
        this.t(`el.datepicker.month${this.leftDate.getMonth() + 1}`)
      );
    },

    rightLabel() {
      return (
        this.rightDate.getFullYear() +
        " " +
        this.t("el.datepicker.year") +
        " " +
        this.t(`el.datepicker.month${this.rightDate.getMonth() + 1}`)
      );
    },

    leftYear() {
      return this.leftDate.getFullYear();
    },

    leftMonth() {
      return this.leftDate.getMonth();
    },

    leftMonthDate() {
      return this.leftDate.getDate();
    },

    rightYear() {
      return this.rightDate.getFullYear();
    },

    rightMonth() {
      return this.rightDate.getMonth();
    },

    rightMonthDate() {
      return this.rightDate.getDate();
    },

    minVisibleDate() {
      if (this.dateUserInput.min !== null) return this.dateUserInput.min;
      if (this.minDate) return formatDate(this.minDate, this.dateFormat);
      return "";
    },

    maxVisibleDate() {
      if (this.dateUserInput.max !== null) return this.dateUserInput.max;
      if (this.maxDate || this.minDate)
        return formatDate(this.maxDate || this.minDate, this.dateFormat);
      return "";
    },

    minVisibleTime() {
      if (this.timeUserInput.min !== null) return this.timeUserInput.min;
      if (this.minDate) return formatDate(this.minDate, this.timeFormat);
      return "";
    },

    maxVisibleTime() {
      if (this.timeUserInput.max !== null) return this.timeUserInput.max;
      if (this.maxDate || this.minDate)
        return formatDate(this.maxDate || this.minDate, this.timeFormat);
      return "";
    },

    timeFormat() {
      if (this.format) {
        return extractTimeFormat(this.format);
      } else {
        return "HH:mm:ss";
      }
    },

    dateFormat() {
      if (this.format) {
        return extractDateFormat(this.format);
      } else {
        return "yyyy-MM-dd";
      }
    },

    enableMonthArrow() {
      const nextMonth = (this.leftMonth + 1) % 12;
      const yearOffset = this.leftMonth + 1 >= 12 ? 1 : 0;
      return (
        this.unlinkPanels &&
        new Date(this.leftYear + yearOffset, nextMonth) <
          new Date(this.rightYear, this.rightMonth)
      );
    },

    enableYearArrow() {
      return (
        this.unlinkPanels &&
        this.rightYear * 12 +
          this.rightMonth -
          (this.leftYear * 12 + this.leftMonth + 1) >=
          12
      );
    },

    selectedTotalDays() {
      if (this.btnDisabled) return 0;
      let diff = Math.abs(this.minDate - this.maxDate);
      return diff / (1000 * 60 * 60 * 24) + 1;
    },

    yearLabel() {
      const yearTranslation = this.t("el.datepicker.year");
      if (this.currentView === "year") {
        const startYear = Math.floor(this.leftYear / 10) * 10;
        if (yearTranslation) {
          return (
            startYear +
            " " +
            yearTranslation +
            " - " +
            (startYear + 9) +
            " " +
            yearTranslation
          );
        }
        return startYear + " - " + (startYear + 9);
      }
      return this.leftYear + " " + yearTranslation;
    }
  },

  data() {
    return {
      popperClass: "",
      value: [],
      defaultValue: null,
      defaultTime: null,
      minDate: "",
      maxDate: "",
      leftDate: new Date(),
      rightDate: nextMonth(new Date()),
      rangeState: {
        endDate: null,
        selecting: false,
        row: null,
        column: null
      },
      showTime: false,
      shortcuts: "",
      visible: "",
      disabledDate: "",
      activeRange: "",
      cellClassName: "",
      firstDayOfWeek: 7,
      minTimePickerVisible: false,
      maxTimePickerVisible: false,
      format: "",
      arrowControl: false,
      unlinkPanels: false,
      dateUserInput: {
        min: null,
        max: null
      },
      timeUserInput: {
        min: null,
        max: null
      },
      selectionMode: "range",
      currentView: "date",
      allJobText: "",
      disableArrow: ""
    };
  },

  watch: {
    minDate(val) {
      this.dateUserInput.min = null;
      this.timeUserInput.min = null;
      this.$nextTick(() => {
        if (
          this.$refs.maxTimePicker &&
          this.maxDate &&
          this.maxDate < this.minDate
        ) {
          const format = "HH:mm:ss";
          this.$refs.maxTimePicker.selectableRange = [
            [
              parseDate(formatDate(this.minDate, format), format),
              parseDate("23:59:59", format)
            ]
          ];
        }
      });
      if (val && this.$refs.minTimePicker) {
        this.$refs.minTimePicker.date = val;
        this.$refs.minTimePicker.value = val;
      }
    },

    maxDate(val) {
      this.dateUserInput.max = null;
      this.timeUserInput.max = null;
      if (val && this.$refs.maxTimePicker) {
        this.$refs.maxTimePicker.date = val;
        this.$refs.maxTimePicker.value = val;
      }
    },

    minTimePickerVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.minTimePicker.date = this.minDate;
          this.$refs.minTimePicker.value = this.minDate;
          this.$refs.minTimePicker.adjustSpinners();
        });
      }
    },

    maxTimePickerVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.maxTimePicker.date = this.maxDate;
          this.$refs.maxTimePicker.value = this.maxDate;
          this.$refs.maxTimePicker.adjustSpinners();
        });
      }
    },

    value(newVal) {
      if (!newVal) {
        this.minDate = null;
        this.maxDate = null;
      } else if (Array.isArray(newVal)) {
        this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null;
        this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null;
        if (this.minDate) {
          this.leftDate = this.minDate;
          if (this.unlinkPanels && this.maxDate) {
            const minDateYear = this.minDate.getFullYear();
            const minDateMonth = this.minDate.getMonth();
            const maxDateYear = this.maxDate.getFullYear();
            const maxDateMonth = this.maxDate.getMonth();
            this.rightDate =
              minDateYear === maxDateYear && minDateMonth === maxDateMonth
                ? nextMonth(this.maxDate)
                : this.maxDate;
          } else {
            this.rightDate = nextMonth(this.leftDate);
          }
        } else {
          this.leftDate = calcDefaultValue(this.defaultValue)[0];
          this.rightDate = nextMonth(this.leftDate);
        }
      } else if (isDate(newVal)) {
        this.leftDate = newVal;
        this.rightDate = newVal;
      }
    },

    defaultValue(val) {
      if (val && val.length > 0) {
        const [left, right] = calcDefaultValue(val);
        this.leftDate = left;
        this.rightDate = val && val[1] ? right : nextMonth(this.leftDate);
        this.minDate = this.leftDate;
        this.maxDate = this.rightDate;
      }
    },

    selectionMode(newVal) {
      if (newVal === "month") {
        /* istanbul ignore next */
        if (this.currentView !== "year" || this.currentView !== "month") {
          this.currentView = "month";
        }
      } else if (newVal === "dates") {
        this.currentView = "date";
      }
    }
  },

  methods: {
    handleClear() {
      this.minDate = null;
      this.maxDate = null;
      this.leftDate = calcDefaultValue(this.defaultValue)[0];
      this.rightDate = nextMonth(this.leftDate);
      this.$emit("pick", null);
    },

    handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    },

    handleDateInput(value, type) {
      this.dateUserInput[type] = value;
      if (value.length !== this.dateFormat.length) return;
      const parsedValue = parseDate(value, this.dateFormat);

      if (parsedValue) {
        if (
          typeof this.disabledDate === "function" &&
          this.disabledDate(new Date(parsedValue))
        ) {
          return;
        }
        if (type === "min") {
          this.minDate = modifyDate(
            this.minDate || new Date(),
            parsedValue.getFullYear(),
            parsedValue.getMonth(),
            parsedValue.getDate()
          );
          this.leftDate = new Date(parsedValue);
          if (!this.unlinkPanels) {
            this.rightDate = nextMonth(this.leftDate);
          }
        } else {
          this.maxDate = modifyDate(
            this.maxDate || new Date(),
            parsedValue.getFullYear(),
            parsedValue.getMonth(),
            parsedValue.getDate()
          );
          this.rightDate = new Date(parsedValue);
          if (!this.unlinkPanels) {
            this.leftDate = prevMonth(parsedValue);
          }
        }
      }
    },

    handleDateChange(value, type) {
      const parsedValue = parseDate(value, this.dateFormat);
      if (parsedValue) {
        if (type === "min") {
          this.minDate = modifyDate(
            this.minDate,
            parsedValue.getFullYear(),
            parsedValue.getMonth(),
            parsedValue.getDate()
          );
          if (this.minDate > this.maxDate) {
            this.maxDate = this.minDate;
          }
        } else {
          this.maxDate = modifyDate(
            this.maxDate,
            parsedValue.getFullYear(),
            parsedValue.getMonth(),
            parsedValue.getDate()
          );
          if (this.maxDate < this.minDate) {
            this.minDate = this.maxDate;
          }
        }
      }
    },

    handleYearPick(year) {
      if (this.selectionMode === "year") {
        this.leftDate = modifyDate(this.leftDate, year, 0, 1);
        this.emit(this.leftDate);
      } else {
        this.leftDate = changeYearMonthAndClampDate(
          this.leftDate,
          year,
          this.leftMonth
        );
        // TODO: should emit intermediate value ??
        // this.emit(this.date, true);
        this.currentView = "month";
      }
    },

    handleMonthPick(month) {
      if (this.selectionMode === "month") {
        this.leftDate = modifyDate(this.leftDate, this.year, month, 1);
        this.emit(this.leftDate);
      } else {
        this.leftDate = changeYearMonthAndClampDate(
          this.leftDate,
          this.leftYear,
          month
        );
        // TODO: should emit intermediate value ??
        // this.emit(this.date);
        this.currentView = "date";
      }
    },

    handleTimeInput(value, type) {
      this.timeUserInput[type] = value;
      if (value.length !== this.timeFormat.length) return;
      const parsedValue = parseDate(value, this.timeFormat);

      if (parsedValue) {
        if (type === "min") {
          this.minDate = modifyTime(
            this.minDate,
            parsedValue.getHours(),
            parsedValue.getMinutes(),
            parsedValue.getSeconds()
          );
          this.$nextTick(() => this.$refs.minTimePicker.adjustSpinners());
        } else {
          this.maxDate = modifyTime(
            this.maxDate,
            parsedValue.getHours(),
            parsedValue.getMinutes(),
            parsedValue.getSeconds()
          );
          this.$nextTick(() => this.$refs.maxTimePicker.adjustSpinners());
        }
      }
    },

    handleTimeChange(value, type) {
      const parsedValue = parseDate(value, this.timeFormat);
      if (parsedValue) {
        if (type === "min") {
          this.minDate = modifyTime(
            this.minDate,
            parsedValue.getHours(),
            parsedValue.getMinutes(),
            parsedValue.getSeconds()
          );
          if (this.minDate > this.maxDate) {
            this.maxDate = this.minDate;
          }
          this.$refs.minTimePicker.value = this.minDate;
          this.minTimePickerVisible = false;
        } else {
          this.maxDate = modifyTime(
            this.maxDate,
            parsedValue.getHours(),
            parsedValue.getMinutes(),
            parsedValue.getSeconds()
          );
          if (this.maxDate < this.minDate) {
            this.minDate = this.maxDate;
          }
          this.$refs.maxTimePicker.value = this.minDate;
          this.maxTimePickerVisible = false;
        }
      }
    },

    handleRangePick(val, close = true) {
      const defaultTime = this.defaultTime || [];
      const minDate = modifyWithTimeString(val.minDate, defaultTime[0]);
      const maxDate = modifyWithTimeString(val.maxDate, defaultTime[1]);

      if (this.maxDate === maxDate && this.minDate === minDate) {
        return;
      }
      this.onPick && this.onPick(val);
      this.maxDate = maxDate;
      this.minDate = minDate;

      // workaround for https://github.com/ElemeFE/element/issues/7539, should remove this block when we don't have to care about Chromium 55 - 57
      setTimeout(() => {
        this.maxDate = maxDate;
        this.minDate = minDate;
      }, 10);
      if (!close) return;
      this.handleConfirm(true);
    },

    handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },

    handleMinTimePick(value, visible, first) {
      this.minDate = this.minDate || new Date();
      if (value) {
        this.minDate = modifyTime(
          this.minDate,
          value.getHours(),
          value.getMinutes(),
          value.getSeconds()
        );
      }

      if (!first) {
        this.minTimePickerVisible = visible;
      }

      if (
        !this.maxDate ||
        (this.maxDate && this.maxDate.getTime() < this.minDate.getTime())
      ) {
        this.maxDate = new Date(this.minDate);
      }
    },

    handleMinTimeClose() {
      this.minTimePickerVisible = false;
    },

    handleMaxTimePick(value, visible, first) {
      if (this.maxDate && value) {
        this.maxDate = modifyTime(
          this.maxDate,
          value.getHours(),
          value.getMinutes(),
          value.getSeconds()
        );
      }

      if (!first) {
        this.maxTimePickerVisible = visible;
      }

      if (
        this.maxDate &&
        this.minDate &&
        this.minDate.getTime() > this.maxDate.getTime()
      ) {
        this.minDate = new Date(this.maxDate);
      }
    },

    handleMaxTimeClose() {
      this.maxTimePickerVisible = false;
    },

    // leftPrev*, rightNext* need to take care of `unlinkPanels`
    leftPrevYear() {
      if (this.currentView === "year") {
        this.leftDate = prevYear(this.leftDate, 10);
      } else {
        this.leftDate = prevYear(this.leftDate);
        if (!this.unlinkPanels) {
          this.rightDate = nextMonth(this.leftDate);
        }
      }
      this.$emit("changeYearMonth", this.leftDate);
    },

    leftPrevMonth() {
      this.leftDate = prevMonth(this.leftDate);
      this.$emit("changeYearMonth", this.leftDate);
      if (!this.unlinkPanels) {
        this.rightDate = nextMonth(this.leftDate);
      }
    },

    leftNextYear() {
      if (this.currentView === "year") {
        this.leftDate = nextYear(this.leftDate, 10);
      } else {
        this.leftDate = nextYear(this.leftDate);
      }
      this.$emit("changeYearMonth", this.leftDate);
    },

    leftNextMonth() {
      this.leftDate = nextMonth(this.leftDate);
      this.$emit("changeYearMonth", this.leftDate);
    },

    handleConfirm(visible = false) {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit("pick", [this.minDate, this.maxDate], visible);
      }
    },

    isValidValue(value) {
      return (
        Array.isArray(value) &&
        value &&
        value[0] &&
        value[1] &&
        isDate(value[0]) &&
        isDate(value[1]) &&
        value[0].getTime() <= value[1].getTime() &&
        (typeof this.disabledDate === "function"
          ? !this.disabledDate(value[0]) && !this.disabledDate(value[1])
          : true)
      );
    },

    resetView() {
      // NOTE: this is a hack to reset {min, max}Date on picker open.
      // TODO: correct way of doing so is to refactor {min, max}Date to be dependent on value and internal selection state
      //       an alternative would be resetView whenever picker becomes visible, should also investigate date-panel's resetView
      if (this.minDate && this.maxDate == null)
        this.rangeState.selecting = false;
      this.minDate =
        this.value && isDate(this.value[0]) ? new Date(this.value[0]) : null;
      this.maxDate =
        this.value && isDate(this.value[0]) ? new Date(this.value[1]) : null;

      if (this.selectionMode === "month") {
        this.currentView = "month";
      } else if (this.selectionMode === "year") {
        this.currentView = "year";
      } else {
        this.currentView = "date";
      }
    }
  },

  components: {
    DateTable,
    YearTable,
    MonthTable
  }
};
</script>

<style lang="scss" scoped>
%base-popper {
  position: absolute;
  left: 11px;
  width: 12px;
  height: 12px;
  transform: rotate(45deg);
  background-color: #fff;
}

.el-picker-panel {
  border-radius: 8px;

  &[x-placement^="top"] {
    transform: translateY(-12px);

    .ads-popper-arrow {
      @extend %base-popper;
      bottom: -6px;
      border-bottom: 1px solid #e4e7ed;
      border-right: 1px solid #e4e7ed;
    }
  }

  &[x-placement^="bottom"] {
    transform: translateY(12px);

    .ads-popper-arrow {
      @extend %base-popper;
      top: -6px;
      border-top: 1px solid #e4e7ed;
      border-left: 1px solid #e4e7ed;
    }
  }
}
.el-date-picker {
  width: 340px;
}
.picker-close-panel {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;

  > div {
    margin-right: 24px;
    cursor: pointer;
  }
}
.el-picker-panel__body {
  margin: 0 24px;
  border-bottom: 1px solid #d6d6d6;

  .el-picker-panel__content {
    margin: 16px 0;
  }
}
.el-picker-panel__footer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  border: none;
  padding-top: 16px;
  margin-bottom: 24px;
}
.picker-selected-range {
  display: flex;
  align-items: center;

  span {
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1.58px;
    color: #292929;

    &:nth-child(2) {
      margin: 0 4px;
    }

    &:nth-child(3) {
      margin-right: 12px;
    }
  }

  p {
    font-size: 12px;
    letter-spacing: 1.58px;
    color: #292929;
    margin-bottom: 0;
  }
}
.allJobText {
  font-size: 16px;
  line-height: 1.43;
  letter-spacing: 1.43px;
  color: #000;
  margin: 8px 0 12px 24px;
  font-weight: bold;

  span {
    color: #00afb8;
  }
}
</style>
