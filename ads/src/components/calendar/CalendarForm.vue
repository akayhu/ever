<template>
  <div ref="calendarForm">
    <div v-if="showLoading" class="loading">
      <Loading />
    </div>
    <div v-if="page[reserveType].isOpen && !showLoading" class="calendar_form">
      <div v-if="channelReservations.length > 0">
        <div class="date_block">
          <span></span>
          <span>{{ nowYear }}年 {{ nowMonth }}月</span>
          <span>
            <div class="datePicker_block">
              <DatePicker
                :changeAction="getTime"
                :monthDateInterval="`${nowYear}/${nowMonth}`"
                :calendarDateRange="true"
                :calendarBeforeRangeYear="3"
                :calendarAfterRangeYear="isAfterOctober ? 1 : 0"
                type="month"
                format="yyyy/MM"
              />
            </div>
            <icon
              v-if="
                nowYear > rangeYearBefore + 1 ||
                  (nowYear === rangeYearBefore + 1 && nowMonth > 1)
              "
              iconName="icon-arrow-left"
              @click.native="changeNowMonth('prev')"
            />
            <icon
              v-if="
                nowYear < rangeYearAfter ||
                  (nowYear === rangeYearAfter && nowMonth < 12)
              "
              iconName="icon-arrow-right"
              @click.native="changeNowMonth('next')"
            />
          </span>
        </div>
        <table cellpadding="0" cellspacing="0">
          <!-- 日期、星期幾 -->
          <CalendarThead
            :monthData="monthData"
            :todayYear="todayYear"
            :todayMonth="todayMonth"
            :todayDay="todayDay"
          />
          <fragment v-for="(board, index) in calendars" :key="index">
            <!-- 版位時間 -->
            <CalendarTbody
              :monthData="monthData"
              :calendarLayout="board"
              :boardIndex="index"
              :boardInfo="boardsInfo[index]"
              :boardsIds="boardsIds"
              :channelInfo="calendar[calendar.device].pages[pageIndex]"
            />
            <!-- 備取內容 -->
            <CalendarTfoot
              :monthData="monthData"
              :prepareInformation="prepares[index]"
              :readySlot="getReadyData(index)"
              :todayYear="todayYear"
              :todayMonth="todayMonth"
              :todayDay="todayDay"
              :boardInfo="boardsInfo[index]"
              :boardIndex="index"
            />
          </fragment>
        </table>
      </div>
      <div
        v-else
        class="no-reserve d-flex justify-content-center align-items-center"
      >
        目前此頻道無可預約版位
      </div>
    </div>
  </div>
</template>

<script>
import CalendarThead from "./CalendarThead.vue";
import CalendarTbody from "./CalendarTbody.vue";
import CalendarTfoot from "./CalendarTfoot.vue";
import { EventBus } from "@/utils/eventBus.js";
import {
  layoutMapping,
  getDaysInYearMonth,
  severalForMapping
} from "@/utils/dateProcessing.js";
import {
  MonthFormat,
  getAfterOctober,
  getThirtyOneGridDate
} from "@/utils/dateFormat";
import moment from "moment";
import { mapActions, mapMutations, mapState } from "vuex";
import debounce from "lodash/debounce";
import {
  ACTIONS_TYPE as CALENDAR_ACTIONS,
  MUTATIONS_TYPE as CALENDAR_MUTATIONS
} from "@/store/modules/calendar";
import Loading from "@/components/Loading.vue";
import DatePicker from "@/components/DatePicker.vue";

export default {
  name: "CalendarForm",
  props: {
    page: {
      type: Object,
      required: true
    },
    pageIndex: {
      type: Number,
      default: 0
    },
    channelReservations: {
      type: Array,
      default() {
        return [];
      }
    },
    channelPrepares: {
      type: Array,
      default() {
        return [];
      }
    },
    channelReadies: {
      type: Array,
      default() {
        return [];
      }
    },
    boardsInfo: {
      type: Array,
      default() {
        return [];
      }
    },
    boardsIds: {
      type: Array,
      default() {
        return [];
      }
    },
    reserveType: {
      type: String
    },
    showLoading: {
      type: Boolean
    },
    wholePageDate: {
      type: Object
    }
  },
  provide() {
    return {
      pageIndex: this.pageIndex
    };
  },
  data() {
    return {
      monthData: [],
      nowYear: "",
      selectYear: "",
      rangeYear: "",
      rangeYearBefore: "",
      rangeYearAfter: "",
      selectMonth: "",
      nowMonth: "",
      todayYear: "",
      todayMonth: "",
      todayDay: "",
      isAfterOctober: false
    };
  },
  components: {
    CalendarThead,
    CalendarTbody,
    CalendarTfoot,
    Loading,
    DatePicker
  },
  computed: {
    ...mapState({
      calendar: state => state.calendar
    }),
    calendars() {
      if (this.channelReservations.length > 0) {
        return this.channelReservations.map(board => {
          return [...layoutMapping(this.nowYear, this.nowMonth)(board)];
        });
      } else {
        return [];
      }
    },
    prepares() {
      if (this.channelPrepares.length > 0) {
        return this.channelPrepares.map(board => {
          return [...layoutMapping(this.nowYear, this.nowMonth)(board)];
        });
      } else {
        return [];
      }
    }
  },
  beforeMount() {
    const today = new Date(); // 今天日期;
    const year = today.getFullYear(); // 今年
    const month = today.getMonth(); // 這個月，月份參數從 0 開始算
    const day = today.getDate(); // 今日
    const days = this.getDaysInYearMonth(
      this.wholePageDate.selectYear,
      this.wholePageDate.selectMonth
    );
    const afterOctober = getAfterOctober();
    this.isAfterOctober = afterOctober;
    this.nowYear = this.wholePageDate.selectYear;
    this.selectYear = this.wholePageDate.selectYear;
    this.rangeYear = afterOctober ? 5 : 4;
    this.rangeYearBefore = year - 4;
    this.rangeYearAfter = afterOctober ? year + 1 : year; // 9 月 15 開始可以預約明年
    this.nowMonth = this.wholePageDate.selectMonth;
    this.selectMonth = this.wholePageDate.selectMonth;
    this.todayYear = year;
    this.todayMonth = month + 1;
    this.todayDay = day;
    this.monthData = getThirtyOneGridDate(
      this.wholePageDate.selectYear,
      this.wholePageDate.selectMonth,
      days
    );
  },
  mounted() {
    const body = document.getElementsByTagName("body")[0];
    body.addEventListener("click", this.eventListener);

    const intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const theadElement = entry.target.getElementsByTagName("thead");
          if (theadElement.length < 1) return;

          const thElement = theadElement[0].getElementsByTagName("th");

          if (entry.isIntersecting && entry.boundingClientRect.height > 200) {
            theadElement[0].classList.add("sticky");
            if (thElement.length > 1)
              thElement[1].innerHTML = `${this.nowYear}年 ${this.nowMonth}月`;

            return;
          }

          theadElement[0].classList.remove("sticky");
          if (thElement.length > 1) thElement[1].innerHTML = "";
          EventBus.$emit("closeMarked");
        });
      },
      { rootMargin: "-10% 0px -90% 0px" }
    );
    this.$nextTick(() => {
      const target = this.$refs.calendarForm;
      intersectionObserver.observe(target);
    });
  },
  updated() {
    this.$nextTick(function() {
      EventBus.$emit("loadingHide");
    });
  },
  destroyed() {
    const body = document.getElementsByTagName("body")[0];
    body.removeEventListener("click", this.eventListener);
  },
  watch: {
    wholePageDate(newVal, oldVal) {
      if (
        newVal.selectYear !== oldVal.selectYear ||
        newVal.selectMonth !== oldVal.selectMonth ||
        newVal.navDevice !== oldVal.navDevice
      ) {
        const { calculationYearMonth } = this;
        this.selectYear = newVal.selectYear;
        this.nowYear = newVal.selectYear;
        this.selectMonth = newVal.selectMonth;
        this.nowMonth = newVal.selectMonth;
        calculationYearMonth();
      }
    }
  },
  methods: {
    ...mapActions({
      _actInsertMonthData: `calendar/${CALENDAR_ACTIONS.INSERT_MONTH_DATA}`,
      _actGetRemark: `calendar/${CALENDAR_ACTIONS.GET_REMARK}`
    }),
    ...mapMutations({
      _mutChangeLoading: `calendar/${CALENDAR_MUTATIONS.CHANGE_LOADING}`
    }),
    getReadyData(boardIndex) {
      return this.channelReadies[boardIndex]
        ? severalForMapping(this.channelReadies[boardIndex])
        : {};
    },
    // 切換上個月下個月
    async changeNowMonth(type) {
      await this._mutChangeLoading(this.pageIndex);
      EventBus.$emit("closeEdit");
      EventBus.$emit("closeMarked");
      const { insertBuffer } = this;
      if (type === "prev") {
        this.nowMonth = this.nowMonth - 1;
        this.selectMonth = this.selectMonth - 1;
        if (this.nowMonth === 0) {
          this.nowYear = this.nowYear - 1;
          this.selectYear = this.selectYear - 1;
          this.selectMonth = 12;
          this.nowMonth = 12;
        }
      } else {
        this.nowMonth = this.nowMonth + 1;
        this.selectMonth = this.selectMonth + 1;
        if (this.nowMonth === 13) {
          this.nowYear = this.nowYear + 1;
          this.selectYear = this.selectYear + 1;
          this.nowMonth = 1;
          this.selectMonth = 1;
        }
      }
      insertBuffer();
    },
    // 取得日期
    calculationYearMonth() {
      const days = this.getDaysInYearMonth(this.nowYear, this.nowMonth);
      this.monthData = getThirtyOneGridDate(this.nowYear, this.nowMonth, days);
    },
    insertBuffer: debounce(function() {
      this.insertMonthData();
    }, 1000),
    async insertMonthData() {
      const insertYearMonth = moment(
        `${this.nowYear}-${this.nowMonth}`,
        MonthFormat
      ).format("YYYY-MM");
      await this._actInsertMonthData({
        pageIndex: this.pageIndex,
        yearMonth: insertYearMonth
      }).then(() => {
        this.calculationYearMonth();
        this._mutChangeLoading(this.pageIndex);
      });
      this._actGetRemark({ month: insertYearMonth });
    },
    // 計算某年某月有多少天，月份參數從 0 開始算
    getDaysInYearMonth,
    // 打開版位預約新增/修改的 body 監聽事件
    eventListener() {
      EventBus.$emit("closeEditStyle");
      EventBus.$emit("closeMarked");
      EventBus.$emit("closePreview");
    },
    async getTime(time) {
      await this._mutChangeLoading(this.pageIndex);
      EventBus.$emit("closeEdit");
      EventBus.$emit("closeMarked");
      const { insertBuffer } = this;
      const splitDay = time.split("/");
      this.selectYear = Number(splitDay[0]);
      this.nowYear = Number(splitDay[0]);
      this.selectMonth = Number(splitDay[1]);
      this.nowMonth = Number(splitDay[1]);
      insertBuffer();
    }
  }
};
</script>

<style lang="scss" scoped>
.loading {
  text-align: center;
  margin: 100px 0;
}

.calendar_form {
  margin-top: 24px;

  .date_block {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      &:nth-child(2) {
        margin-left: 170px;
      }

      &:nth-child(3) {
        text-align: right;
        cursor: pointer;
        display: inline-flex;
        align-items: center;

        .datePicker_block {
          width: 110px;
        }

        img {
          width: 24px;
          height: 24px;

          &:nth-child(1) {
            margin-right: 10px;
          }
        }
      }
    }
  }

  table {
    margin: 8px auto 0;
    border-collapse: inherit;

    &:first-child {
      margin-top: 0;
    }
  }

  .no-reserve {
    width: 100%;
    height: 100px;
    background: #f8f8f8;
    font-size: 16px;
    font-weight: normal;
    color: #ea475b;
    margin-bottom: 20px;
  }
}
</style>
