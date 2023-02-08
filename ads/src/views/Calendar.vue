<template>
  <div>
    <div class="calendar_wrapper_title">檔期預約管理</div>
    <section>
      <div>
        <div class="calendar_title">
          <div>
            <h2>檔期行事曆</h2>
            <icon
              v-tooltip="{
                placement: 'right-start',
                offset: 5,
                content:
                  '根據身分權限，特定功能限制如下 :<br />1.無「網站編輯」權限 : 無法在該網站下預約檔期，或執行「編輯/刪除」等功能。<br />2.無「銷售」或「行銷」版位的編輯權限 : 無法編輯該屬性的版位檔期。',
                trigger: 'hover',
                classes: ['calendar-question-mark']
              }"
              iconName="ic-help-outline"
              size="16"
            />
          </div>
        </div>

        <div
          class="status_display"
          :style="{ marginBottom: statusDisplayBottom }"
        >
          狀態顯示
          <span><span class="circle" color="light-gray"></span>預備中</span>
          <span><span class="circle" color="red"></span>提案中</span>
          <span><span class="circle" color="blue"></span>合約簽回</span>
          <span><span class="circle" color="gray"></span>結案</span>
          <span><span class="circle" color="green"></span>成效PR</span>
          <span><span class="circle" color="yellow"></span>空版PR</span>
          <span><span class="circle" color="pink">1</span>已拉cue</span>
          <span><span class="circle" color="lavender">2</span>已上素材</span>
          <span><span class="circle" color="purple">3</span>已上線</span>
        </div>

        <div
          v-if="hasMarketAuthority"
          class="boardtype_selector d-flex align-items-center"
        >
          <span class="title mr-1">版位類別</span>
          <icon
            class="align-middle mr-8"
            v-tooltip="{
              offset: 5,
              content: '請先選擇銷售或行銷類別',
              placement: 'right',
              trigger: 'hover'
            }"
            iconName="icon-info-warmgray"
            size="16"
          />
          <label class="ad-radio-label">
            <input
              v-model="reserveType"
              value="sales"
              type="radio"
              name="reserve-type"
            />
            <span class="ad-radio"></span>銷售
          </label>
          <label class="ad-radio-label">
            <input
              v-model="reserveType"
              value="market"
              type="radio"
              name="reserve-type"
            />
            <span class="ad-radio"></span>行銷
          </label>
        </div>

        <div class="devices_tab">
          <switch-tabs
            :tabs-data="devices"
            :value="navDevice"
            @select-tab="changeNavTag"
          />
          <div class="whole_page_calendar">
            <div class="mr-2">切換整頁行事曆</div>
            <div class="datePicker_block">
              <DatePicker
                :changeAction="getTime"
                :monthDateInterval="`${selectYear}/${selectMonth}`"
                :calendarDateRange="true"
                :calendarBeforeRangeYear="3"
                :calendarAfterRangeYear="isAfterOctober ? 1 : 0"
                type="month"
                format="yyyy/MM"
              />
            </div>
            <icon
              v-if="
                selectYear > rangeYearBefore + 1 ||
                  (selectYear === rangeYearBefore + 1 && selectMonth > 1)
              "
              iconName="icon-arrow-left"
              @click.native="changeNowMonth('prev')"
            />
            <icon
              v-if="
                selectYear < rangeYearAfter ||
                  (selectYear === rangeYearAfter && selectMonth < 12)
              "
              iconName="icon-arrow-right"
              @click.native="changeNowMonth('next')"
            />
          </div>
        </div>

        <div v-if="getCanEdit" class="search_pj">
          <div>
            <SelectDropdown
              @value-changed="setSelectedPjData($event)"
              @set-history-record="searchedPjDataOptions = $event"
              :value="selectedPjData"
              :options="searchedPjDataOptions"
              :asncSearchCb="pjDataSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              :atCalendar="true"
              placeholder="預約前請先輸入專案名稱"
              class="search_pjData"
              :type="'getProjectRecommend'"
            />
            <icon
              v-tooltip="{
                offset: 5,
                content: '未建立專案者，請點擊右側新增預約專案',
                placement: 'right',
                trigger: 'hover'
              }"
              iconName="icon-info-warmgray"
              size="16"
            />
            <div v-if="showMessage" class="error_message pj_error_message">
              請先填寫此欄位
            </div>
          </div>
          <div>
            <router-link
              to="/newpj"
              rel="noopener noreferrer"
              target="_blank"
              title="新增預約專案"
              class="button_bg_white_large"
            >
              新增預約專案
            </router-link>
          </div>
        </div>
        <div
          v-for="(page, pageIndex) in pages"
          :key="`${page.name}-${page.channelId}-${reserveType}-${pageIndex}`"
          class="calendar_main"
        >
          <div @click="calendarCollapse(page, pageIndex)" class="more_settings">
            <span>{{ page.name }}</span>
            <span>
              <fragment v-if="page[reserveType].isOpen">
                收合
                <icon iconName="icon-arrow-up-border" class="more_icon" />
              </fragment>
              <fragment v-else>
                展開
                <icon
                  iconName="icon-arrow-down-border"
                  style="cursor: pointer;"
                />
              </fragment>
            </span>
          </div>
          <CalendarForm
            ref="form"
            :page="page"
            :reserveType="reserveType"
            :showLoading="page[reserveType].isLoading"
            :pageIndex="pageIndex"
            :channelReservations="page[reserveType].channelReservations"
            :channelPrepares="page[reserveType].channelPrepares"
            :channelReadies="page[reserveType].channelReadies"
            :boardsInfo="page[reserveType].boardsInfo"
            :boardsIds="page[reserveType].boardsIds"
            :wholePageDate="{ selectYear, selectMonth, navDevice }"
          />
        </div>
      </div>
    </section>
    <GoTop />
  </div>
</template>

<script>
import CalendarForm from "@/components/calendar/CalendarForm.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import {
  ACTIONS_TYPE as CALENDAR_ACTIONS,
  MUTATIONS_TYPE as CALENDAR_MUTATIONS
} from "@/store/modules/calendar";
import { ACTIONS_TYPE as ORDER_ACTIONS } from "@/store/modules/order";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import GoTop from "@/components/GoTop.vue";
import userAuthority from "@/utils/userAuthority";
import { EventBus } from "@/utils/eventBus.js";
import { devices } from "@/utils/util.js";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import { getAfterOctober } from "@/utils/dateFormat";
import DatePicker from "@/components/DatePicker.vue";

export default {
  name: "Calendar",
  components: {
    CalendarForm,
    SelectDropdown,
    GoTop,
    SwitchTabs,
    DatePicker
  },
  data() {
    return {
      navDevice: "pc",
      searchTimeStart: "",
      searchTimeEnd: "",
      selectedPjData: "",
      searchedPjDataOptions: [],
      showMessage: false,
      selectYear: "",
      selectMonth: "",
      rangeYearBefore: "",
      rangeYearAfter: "",
      isAfterOctober: false,
      devices
    };
  },
  computed: {
    ...mapState({
      order: state => state.order,
      today: state => state.calendar.today,
      yearMonth: state => state.calendar.yearMonth,
      user: state => state.user.user
    }),
    ...mapGetters("calendar", ["pages"]),
    reserveType: {
      get() {
        return this.$store.state.calendar.reserveType;
      },
      set(value) {
        this.$router.push({
          path: "/calendar",
          query: { reserve: value, device: this.$route.query.device }
        });
        this.$refs.form.forEach(x => {
          x.nowYear = this.selectYear;
          x.selectYear = this.selectYear;
          x.nowMonth = this.selectMonth;
          x.selectMonth = this.selectMonth;
        });

        /* 這邊需要一個 action 做初始化的動作。 */
        this.recoverAllIsOpen(value, {
          selectYear: this.selectYear,
          selectMonth: this.selectMonth
        });
      }
    },
    hasMarketAuthority() {
      return [1, 21, 22, 23].indexOf(this.user.role) !== -1;
    },
    statusDisplayBottom() {
      return this.hasMarketAuthority ? "16px" : "32px";
    },
    getCanEdit() {
      return userAuthority[this.user.role].calendarEdit;
    }
  },
  created() {
    EventBus.$on("focusAutoCompleteMessage", () => {
      this.showMessage = true;
      this.searchPjDataInputError();
    });

    this.navDevice = this.$route.query.device || "pc";
  },
  beforeMount() {
    this.initWholePageDate();
  },
  mounted() {
    this._actGetRemark({ month: this.yearMonth });
    const pjData = document.querySelector(".search_pjData");
    const pjDataInput = pjData.getElementsByTagName("input")[0];
    pjDataInput.addEventListener("focusout", () => {
      pjDataInput.classList.remove("error_pj");
      this.showMessage = false;
    });
  },
  methods: {
    ...mapActions({
      _actInsertMonthData: `calendar/${CALENDAR_ACTIONS.INSERT_MONTH_DATA}`,
      _actRecoverIsOpen: `calendar/${CALENDAR_ACTIONS.RECOVER_IS_OPEN}`,
      _actAddDevice: `order/${ORDER_ACTIONS.ADD_DEVICE}`,
      _actGetRemark: `calendar/${CALENDAR_ACTIONS.GET_REMARK}`,
      _actTogglePage: `calendar/${CALENDAR_ACTIONS.TOGGLE_PAGE}`,
      _actGetProjectRecommend: "project/getProjectRecommend"
    }),
    ...mapMutations({
      _mutSelectProject: `calendar/${CALENDAR_MUTATIONS.SELECT_PROJECT}`,
      _mutChangeDevice: `calendar/${CALENDAR_MUTATIONS.CHANGE_DEVICE}`,
      _mutChangeReserveType: `calendar/${CALENDAR_MUTATIONS.CHANGE_RESERVE_TYPE}`,
      _mutTogglePage: `calendar/${CALENDAR_MUTATIONS.TOGGLE_PAGE}`,
      _mutChangeLoading: `calendar/${CALENDAR_MUTATIONS.CHANGE_LOADING}`
    }),
    async pjDataSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { _actGetProjectRecommend } = this;
        const responseData = await _actGetProjectRecommend({ keyword });
        this.searchedPjDataOptions = [...responseData].map(item => {
          return {
            ...item,
            value: item.projectId,
            label: item.projectName
          };
        });
      }
    },
    setSelectedPjData(data) {
      this.showMessage = false;
      this.selectedPjData =
        this.searchedPjDataOptions.find(
          option => option.projectId === data.projectId
        )?.projectName || null;
      this._mutSelectProject({ ...data });
      const pjData = document.querySelector(".search_pjData");
      const pjDataInput = pjData.getElementsByTagName("input")[0];
      pjDataInput.classList.remove("error_pj");
    },
    async changeNavTag(tab) {
      let tag = tab.key;
      try {
        if (this.navDevice == tag) return;
        this._mutChangeDevice(tag);

        this.$router.push({
          path: "/calendar",
          query: { reserve: this.$route.query.reserve, device: tag }
        });

        if (!this.order[tag].initial) {
          // 載具之下的 site/channel 需要初始化。
          EventBus.$emit("loadingShow");
          await this._actAddDevice(
            tag,
            `${this.selectYear}-${this.selectMonth}`
          ).then(() => {
            this.navDevice = tag;
            EventBus.$emit("loadingHide");
          });
        } else {
          // 直接在新切換的載具上面，新增當月資料。(沒有快取之後，每次重拉)
          this._mutChangeLoading(0);
          await this._actRecoverIsOpen({
            reserveType: this.reserveType,
            selectDate: null
          });
          this.navDevice = tag;
          await this.insertMonthData({
            pageIndex: 0,
            yearMonth: `${this.selectYear}-${this.selectMonth}`,
            openFirst: false
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 行事曆展開收合
    async calendarCollapse(page, pageIndex) {
      if (!page[this.reserveType].isOpen) this._mutChangeLoading(pageIndex);
      await this._actTogglePage(pageIndex);
      if (page[this.reserveType].isOpen) {
        this.$refs.form[pageIndex].insertMonthData();
      }
    },
    insertMonthData(payload) {
      this._actInsertMonthData({ ...payload }).then(() => {
        this._mutChangeLoading(payload.pageIndex);
      });
    },
    recoverAllIsOpen(value, selectDate) {
      this._mutChangeLoading(0);
      this._actRecoverIsOpen({
        reserveType: value,
        selectDate
      }).then(() => {
        this._mutChangeLoading(0);
      });
    },
    searchPjDataInputError() {
      const pjData = document.querySelector(".search_pjData");
      const pjDataInput = pjData.getElementsByTagName("input")[0];
      pjDataInput.classList.add("error_pj");
    },
    initWholePageDate() {
      const today = new Date(); // 今天日期;
      const year = today.getFullYear(); // 今年
      const month = today.getMonth(); // 這個月，月份參數從 0 開始算
      const afterOctober = getAfterOctober();
      this.isAfterOctober = afterOctober;
      this.selectYear = year;
      this.selectMonth = month + 1;
      this.rangeYearBefore = year - 4;
      this.rangeYearAfter = afterOctober ? year + 1 : year; // 9 月 15 開始可以預約明年
    },
    // 切換上個月下個月
    async changeNowMonth(type) {
      this._mutChangeLoading(0);
      if (type === "prev") {
        this.selectMonth = this.selectMonth - 1;
        if (this.selectMonth === 0) {
          this.selectYear = this.selectYear - 1;
          this.selectMonth = 12;
        }
      } else {
        this.selectMonth = this.selectMonth + 1;
        if (this.selectMonth === 13) {
          this.selectYear = this.selectYear + 1;
          this.selectMonth = 1;
        }
      }
      await this._actRecoverIsOpen();
      await this.insertMonthData({
        pageIndex: 0,
        yearMonth: `${this.selectYear}-${this.selectMonth}`,
        openFirst: true
      });
    },
    async getTime(time) {
      const splitDay = time.split("/");
      this._mutChangeLoading(0);
      this.selectYear = Number(splitDay[0]);
      this.selectMonth = Number(splitDay[1]);
      await this._actRecoverIsOpen();
      await this.insertMonthData({
        pageIndex: 0,
        openFirst: true,
        yearMonth: `${this.selectYear}-${this.selectMonth}`
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    this._mutChangeDevice("pc");
    this._mutChangeReserveType("sales");
    this._actRecoverIsOpen();
    next();
  }
};
</script>

<style>
.tooltip.calendar-question-mark .tooltip-inner {
  max-width: 700px;
}
</style>

<style lang="scss" scoped>
@import "~scss/views/calendar/status";

.calendar_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 12px;
}

section {
  .calendar_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h2 {
      display: inline-block;
    }

    img {
      vertical-align: initial;
      margin-left: 8px;
    }

    .co_editing {
      font-size: 14px;
      letter-spacing: 0.78px;
      color: #8f8f8f;

      span {
        color: #00afb8;
      }
    }
  }

  .devices_tab {
    position: relative;

    .whole_page_calendar {
      position: absolute;
      display: flex;
      top: 0;
      right: 0;
      align-items: center;
      letter-spacing: 1.38px;

      .datePicker_block {
        width: 110px;
      }

      img {
        cursor: pointer;
      }
    }
  }

  .status_display {
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 1.43px;
    color: #292929;
    text-align: right;
    margin-bottom: 16px;

    > span {
      margin-bottom: 4px;

      span {
        line-height: 1.29;
        color: #8f8f8f;

        &.circle {
          border-radius: 50%;
          width: 15px;
          height: 15px;
          display: inline-block;
          vertical-align: text-bottom;
          box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
          margin: 0 5px 0 10px;
          color: #ffffff;
          font-size: 14px;
          text-align: center;
          line-height: 15px;

          @each $color, $value in $calendar-status-colors {
            &[color="#{$color}"] {
              background-color: #{$value};
            }
          }
        }
      }
    }
  }

  .boardtype_selector {
    line-height: 28px;
    margin-bottom: 24px;

    .title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      letter-spacing: 1.75px;
    }

    input {
      width: 16px;
      height: 16px;
    }
  }

  nav {
    margin-bottom: 24px;

    ul {
      display: flex;
      font-size: 20px;
      line-height: 1.1;
      letter-spacing: 1.13px;
      color: #292929;
      border-bottom: 1px solid #e2e1e1;

      li {
        border-bottom: 4px solid #fff;
        text-align: center;
        min-width: 44px;
        padding: 12px 24px 8px;
        cursor: pointer;

        &:hover {
          color: #39c8d0;
          background-color: #e6f9fa;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-bottom: 4px solid #e6f9fa;
        }

        &.focus {
          color: #00afb8;
          border-bottom: 4px solid #00afb8;
          font-weight: bold;

          &:hover {
            background-color: #fff;
          }
        }
      }
    }
  }

  .search_pj {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;

    .search_pjData {
      width: 480px;
    }

    .button_bg_white_large {
      letter-spacing: 1.33px;
    }

    img {
      margin-left: 12px;
    }

    .pj_error_message {
      font-size: 14px;
    }
  }

  .calendar_main {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .more_settings {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    letter-spacing: 1px;
    color: #333;
    cursor: pointer;

    span {
      &:first-child {
        font-size: 20px;
        color: #00afb8;
      }
    }
  }
}
</style>
