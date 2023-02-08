<template>
  <td
    :date="getSatSunAttr(monthItem)()"
    :nationalHoliday="getHoliday(monthItem)"
    :class="{ empty_date: !monthItem.month }"
    :reservation="getReadySlot(monthItem) ? 'true' : ''"
  >
    {{ getReadySlot(monthItem) }}
  </td>
</template>

<script>
import { getSatSunAttr } from "@/utils/dateProcessing.js";
import { holiday } from "@/utils/nationalHoliday.js";
import { dateFormatter } from "@/utils/dateFormat";

export default {
  name: "CalendarTfootPrepare",
  props: {
    monthItem: {
      type: Object,
      required: true
    },
    readySlot: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      holiday
    };
  },
  computed: {},
  methods: {
    getSatSunAttr,
    getHoliday(item) {
      return this.holiday[dateFormatter(item.year, item.month, item.day)]
        ? "holiday"
        : false;
    },
    getReadySlot(item) {
      return this.readySlot[dateFormatter(item.year, item.month, item.day)];
    }
  }
};
</script>

<style lang="scss" scoped>
td {
  width: 20px;
  height: 20px;
  border: 1px solid #fff;
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
  position: relative;
  line-height: 1;
  letter-spacing: 0.56px;
  color: #333;
  background-color: #f1f1f1;

  &[date="six"],
  &[date="day"],
  &[nationalHoliday="holiday"] {
    background-color: #efecec;
  }
  &[reservation="true"] {
    font-size: 14px;
    color: #50c0c5;
    background-color: #e0fcfd;
  }
  &.empty_date {
    background-color: #e8e8e8;
  }
}
</style>
