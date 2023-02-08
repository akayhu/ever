<template>
  <!-- 日期、星期幾 -->
  <thead>
    <!-- 備註 -->
    <tr>
      <th></th>
      <td
        v-for="(monthItem, monthItemIndex) in monthData"
        :key="`spot-${monthItemIndex}`"
      >
        <span
          v-if="getRemark(monthItem)"
          v-tooltip="{
            offset: 5,
            content: `${getRemark(monthItem)}`,
            placement: 'top-start',
            trigger: 'hover'
          }"
          class="remarks"
        ></span>
      </td>
    </tr>
    <!-- 月份日期 -->
    <tr>
      <th rowspan="2"></th>
      <td
        v-for="(item, index) in monthData"
        :key="index"
        @click.stop="openMarked(item)"
        :class="{ day: item.week }"
        :nationalHoliday="getHoliday(item)"
      >
        <div
          v-if="item.week"
          :class="{
            today:
              item.year === todayYear &&
              item.month === todayMonth &&
              item.day === todayDay
          }"
        >
          <span class="spot"></span>
          <span class="text">{{ item.day }}</span>
          <CalendarMarked :ref="markId(item)" :itemDate="item" />
        </div>
      </td>
    </tr>
    <!-- 星期幾 -->
    <tr>
      <td
        v-for="(item, index) in monthData"
        :key="index"
        :date="getSatSunAttr(item)()"
        :makeUpWork="getWork(item)"
      >
        {{ item.week }}
      </td>
    </tr>
  </thead>
</template>

<script>
import { getSatSunAttr } from "@/utils/dateProcessing.js";
import { holiday, work } from "@/utils/nationalHoliday.js";
import { dateFormatter } from "@/utils/dateFormat";
import CalendarMarked from "./CalendarMarked.vue";
import { mapState } from "vuex";

export default {
  name: "CalendarThead",
  components: {
    CalendarMarked
  },
  props: {
    monthData: {
      type: Array,
      required: true
    },
    todayYear: {
      type: Number
    },
    todayMonth: {
      type: Number
    },
    todayDay: {
      type: Number
    }
  },
  data() {
    return {
      holiday,
      work
    };
  },
  computed: {
    ...mapState({
      remarks: state => state.calendar.remarks
    })
  },
  methods: {
    getSatSunAttr,
    getHoliday(item) {
      return this.holiday[dateFormatter(item.year, item.month, item.day)]
        ? "holiday"
        : false;
    },
    getWork(item) {
      return this.work[dateFormatter(item.year, item.month, item.day)]
        ? "makeUpWork"
        : false;
    },
    getRemark(item) {
      const nowDay = dateFormatter(item.year, item.month, item.day).replaceAll(
        "-",
        "/"
      );
      return this.remarks[nowDay] ? this.remarks[nowDay] : false;
    },
    markId(monthItem) {
      return `marked_${monthItem.year}_${monthItem.month}_${monthItem.day}`;
    },
    // 打開編輯視窗
    openMarked(monthItem) {
      if (!monthItem.week) return;
      this.$refs[this.markId(monthItem)][0].openMarked();
    }
  }
};
</script>

<style lang="scss" scoped>
thead {
  tr {
    &:nth-child(1) {
      td {
        min-height: 14px;
      }
    }
    &:nth-child(3) {
      td {
        color: #a9a9a9;
      }
    }

    th {
      width: 194px;
      font-size: 12px;
      line-height: 1;
      letter-spacing: 0.67px;
      color: #333;
      vertical-align: middle;
      text-align: left;
      border-bottom: 0;
    }

    td {
      width: 22px;
      height: 20px;
      border: 1px solid #fff;
      font-size: 12px;
      text-align: center;
      vertical-align: middle;
      position: relative;
      line-height: 1;
      letter-spacing: 0.56px;
      color: #333;

      &[date="six"],
      &[date="day"],
      &[nationalHoliday="holiday"] {
        background-color: #fff;
        color: #f5b1b1;
      }
      &[makeUpWork="makeUpWork"] {
        color: #a9a9a9;
      }

      &.day {
        cursor: pointer;
        transition: background-color 0.3s ease;
        background-color: #fff;

        &:hover {
          background-color: rgba(237, 200, 200, 0.3);
        }
      }

      div {
        &.today {
          height: 19px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          .text {
            color: #fff;
            z-index: 1;
          }
          .spot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: block;
            background-color: #262626;
            position: absolute;
          }
        }
      }

      .remarks {
        display: inline-block;
        width: 6px;
        height: 6px;
        background-color: #50c0c5;
        border-radius: 50%;
      }
    }
  }
}

.sticky {
  position: fixed;
  top: 50px;
  z-index: 3;

  th {
    text-align: center;
    background-color: #fff;
    font-size: 18px;
  }

  td {
    background-color: #fff;

    &.day:hover {
      background-color: rgba(237, 200, 200);
    }
  }
}
</style>
