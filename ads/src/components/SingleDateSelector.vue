<template>
  <div class="wrap">
    <span>
      <span v-for="(item, index) in dates" :key="item">
        <span
          :class="{ focus: item === selectedDate }"
          class="date"
          @click="changeDate(item)"
          >{{ item.substr(5, 5) }}</span
        >
        <span v-if="index !== dates.length - 1" class="comma">、</span>
      </span>
    </span>
    <div class="d-inline-block">
      <button
        @click="changeWeek('prev')"
        :disabled="disabledPrev"
        class="bg-transparent border-0 p-0"
      >
        <icon iconName="icon-arrow-left" :disabled="disabledPrev" />
      </button>
      <button
        @click="changeWeek('next')"
        :disabled="disabledNext"
        class="bg-transparent border-0 p-0"
      >
        <icon iconName="icon-arrow-right" :disabled="disabledNext" />
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getDatesString } from "@/utils/dateFormat.js";

export default {
  name: "SingleDateSelector",
  props: {
    formatString: {
      type: String,
      default: "YYYY/MM/DD"
    },
    limitStartDate: {
      type: [String, Date, Object],
      default: ""
    },
    limitEndDate: {
      type: [String, Date, Object],
      default: ""
    },
    startDate: {
      type: [String, Date, Object],
      default: ""
    },
    endDate: {
      type: [String, Date, Object],
      default: ""
    },
    selectedDate: {
      type: String,
      default: ""
    }
  },
  computed: {
    dates() {
      return getDatesString(this.startDate, this.endDate, this.formatString);
    },
    disabledPrev() {
      const limitStartDate = moment(this.limitStartDate).format(
        this.formatString
      );
      return this.dates.indexOf(limitStartDate) > -1;
    },
    disabledNext() {
      const limitEndDate = this.limitEndDate
        ? moment(this.limitEndDate).format(this.formatString)
        : this.today.format(this.formatString);
      return this.dates.indexOf(limitEndDate) > -1;
    }
  },
  data() {
    return {
      today: moment()
    };
  },
  methods: {
    changeDate(date) {
      this.$emit("changeDate", date);
    },
    changeWeek(actionType) {
      this.$emit("changeWeek", actionType);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  display: inline-block;

  span {
    font-weight: bold;
    color: #00b2ba;
    cursor: pointer;

    .date {
      padding: 4px;

      &.focus {
        background-color: #e1fafa;
      }
    }

    .comma {
      color: #333;
    }
  }
}
</style>
