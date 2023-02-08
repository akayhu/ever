<template>
  <div class="project_board_apply">
    <div>
      <switch-tabs
        :tabs-data="selectedOption"
        :value="isOnlyFocus ? 'focus' : 'all'"
        styleType="tertiary"
        @select-tab="handleChangeJobType($event.key)"
      >
        <router-link
          :to="{ path: '/maintain_new', query: settingLinkQuery }"
          target="_blank"
          >去設定<icon iconName="icon-arrow-right-disable"
        /></router-link>
      </switch-tabs>
    </div>

    <div v-if="summary.status === 0 && isOnlyFocus" class="no_result">
      無符合資料，請切換條件：時間或設定網頁曝光職缺...等！
    </div>

    <div v-else>
      <div class="date_range">
        <div class="mr-7 font-weight-bold">數據區間</div>
        <DatePicker
          ref="date_picker"
          :getSearchTime="setTime"
          :maxDay="31"
          :dateRange="[projectSummary.startDate, projectSummary.endDate]"
          :clearable="true"
          :changeAction="handleChangePeriod"
        />
      </div>

      <div class="project_date_interval_selector">
        <span
          @click="changeIntervalType('period', 3)"
          :class="{ focus: dateType === 'period' }"
        >
          區間
        </span>
        <span
          @click="changeIntervalType('week', 2)"
          :class="{ focus: dateType === 'week' }"
        >
          週
        </span>
        <span
          @click="changeIntervalType('day', 1)"
          :class="{ focus: dateType === 'day' }"
        >
          日
        </span>
      </div>

      <div class="project_board_apply_info ad_board d-flex">
        <div
          class="project_board_apply_info_title pr-7 flex-shrink-0"
          :class="{ 'extra-padding': summary.boards.length > 0 }"
        >
          廣告版位
        </div>
        <div class="project_board_apply_info_content d-flex flex-wrap">
          <template v-if="summary.boards.length > 0">
            <tag
              class="mr-1 mb-2"
              v-for="(board, index) in summary.boards"
              :key="index"
              :content="`${board.siteName}/${board.channelName}/${board.name}`"
              :isDisable="true"
            />
          </template>
          <span class="no_board" v-else>無</span>
        </div>
      </div>

      <div class="project_date_interval">
        <div v-if="dateType === 'period'" class="d-flex align-items-center">
          <div class="mr-7 font-weight-bold">廣告區間</div>
          <span>{{ dataInterval.startDate }} ~ {{ dataInterval.endDate }}</span>
        </div>
        <div v-else-if="dateType === 'week'" class="d-flex align-items-center">
          <div class="mr-7 font-weight-bold">廣告週間</div>
          <el-select
            v-model="selectedWeekIndex"
            placeholder="請選擇"
            @change="handleDateUpdate"
          >
            <el-option
              v-for="item in periodWeeks"
              :key="item.index"
              :label="`週 ${item.startDate} ~ ${item.endDate}`"
              :value="item.index"
            >
            </el-option>
          </el-select>
          <icon
            iconName="icon-info-warmgray"
            size="16"
            v-tooltip="{
              offset: 5,
              content: '時間可依週切換',
              placement: 'right',
              trigger: 'hover'
            }"
            class="mr-3"
          />
          <span class=""
            >{{ periodWeeks[selectedWeekIndex].startDate }} ~
            {{ periodWeeks[selectedWeekIndex].endDate }}</span
          >

          <div class="control_week pr-2">
            <button
              class="bg-transparent border-0 p-0"
              :style="{
                cursor: !canGoNext ? 'not-allowed' : 'pointer'
              }"
              :disabled="!canGoNext"
              @click="updateCurrentWeek('next')"
            >
              <icon iconName="icon-arrow-left" :disabled="!canGoNext" />
            </button>
            <button
              class="bg-transparent border-0 p-0"
              :style="{
                cursor: !canGoPrev ? 'not-allowed' : 'pointer'
              }"
              :disabled="!canGoPrev"
              @click="updateCurrentWeek('prev')"
            >
              <icon iconName="icon-arrow-right" :disabled="!canGoPrev" />
            </button>
          </div>
        </div>
        <div v-else-if="dateType === 'day'">
          <div class="d-flex align-items-center">
            <div class="mr-7 font-weight-bold">廣告單日</div>
            <el-select
              v-model="selectedWeekIndex"
              placeholder="請選擇"
              @change="handleDateUpdate"
            >
              <el-option
                v-for="item in periodWeeks"
                :key="item.index"
                :label="`週 ${item.startDate} ~ ${item.endDate}`"
                :value="item.index"
              >
              </el-option>
            </el-select>
          </div>
          <div class="duration days pr-2">
            <span v-for="(item, index) in dayArray" :key="index">
              <span
                @click="handleChangeDay(index)"
                :class="{ focus: item.startDate === selectedDate }"
                >{{ `${item.startDate.substr(5, 5)}` }}</span
              >
              <span v-if="index !== dayArray.length - 1" class="comma">、</span>
            </span>
            <div class="control_week pr-2">
              <button
                class="bg-transparent border-0 p-0"
                :style="{
                  cursor: !canGoNext ? 'not-allowed' : 'pointer'
                }"
                :disabled="!canGoNext"
                @click="updateCurrentWeek('next')"
              >
                <icon iconName="icon-arrow-left" :disabled="!canGoNext" />
              </button>
              <button
                class="bg-transparent border-0 p-0"
                :style="{
                  cursor: !canGoPrev ? 'not-allowed' : 'pointer'
                }"
                :disabled="!canGoPrev"
                @click="updateCurrentWeek('prev')"
              >
                <icon iconName="icon-arrow-right" :disabled="!canGoPrev" />
              </button>
              <icon
                iconName="icon-info-warmgray"
                size="16"
                v-tooltip="{
                  offset: 5,
                  content: '時間可依週切換，點選單日可觀看數據',
                  placement: 'right',
                  trigger: 'hover'
                }"
                class="mr-3"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="project_board_apply_summary d-flex mt-6">
        <div class="project_board_apply_summary_total pl-5">
          <span>Total</span>
        </div>
        <div class="project_board_apply_summary_imp">
          <span class="mr-1">應徵數</span>
          <span>{{ summary.applyCount }}</span>
        </div>
        <div class="project_board_apply_summary_click">
          <span class="mr-1">瀏覽數</span>
          <span>{{ summary.viewCount }}</span>
        </div>
      </div>

      <div v-if="tableData.length > 0">
        <div class="download">
          <span>報表格式</span>
          <label class="ad-radio-label">
            <input
              v-model="getFilterExtension"
              value="csv"
              type="radio"
              name="text"
            />
            <span class="ad-radio"></span>csv
          </label>
          <label class="ad-radio-label">
            <input
              v-model="getFilterExtension"
              value="xlsx"
              type="radio"
              name="text"
            />
            <span class="ad-radio"></span>xlsx
          </label>
          <button
            :class="
              canGenerateReport && tableData.length > 0
                ? 'button_bg_white_small'
                : 'button_bg_white_small_disable'
            "
            :disabled:="!canGenerateReport || tableData.length === 0"
            @click="generateReport"
          >
            產生報表
          </button>
        </div>
        <div class="project_board_apply_table">
          <div class="project_board_apply_table_header_row">
            <div
              v-for="(header, index) in projectApplyTitle"
              :key="header.key"
              :class="`project_board_apply_table_header_content_${header.key}`"
            >
              <div>
                {{ header.label }}
                <span v-if="index === 0">
                  <icon
                    iconName="icon-info-warmgray"
                    size="16"
                    v-tooltip="{
                      offset: 5,
                      content: '超連結為職缺刊登現況',
                      placement: 'right',
                      trigger: 'hover'
                    }"
                  />
                </span>
                <span v-if="index === 2">
                  <icon
                    iconName="icon-info-warmgray"
                    size="16"
                    v-tooltip="{
                      offset: 5,
                      content: '廣告曝光當時狀態',
                      placement: 'right',
                      trigger: 'hover'
                    }"
                  />
                </span>
              </div>
            </div>
          </div>
          <template>
            <div
              v-for="(data, index) in tableData"
              :key="index"
              class="project_board_apply_table_body_row"
            >
              <div class="project_board_apply_table_body_content_jobName">
                <a
                  :href="getJobUrl(data.jobCode)"
                  rel="noopener noreferrer"
                  target="_blank"
                  v-tooltip="{
                    trigger: 'hover',
                    placement: 'bottom-start',
                    offset: 5,
                    content: data.jobName
                  }"
                >
                  {{ data.jobName }}
                </a>
              </div>
              <div class="project_board_apply_table_body_content_jobNo">
                {{ data.jobNo }}
              </div>
              <div class="project_board_apply_table_body_content_turnonDate">
                {{ data.turnonDate }}
              </div>
              <div class="project_board_apply_table_body_content_status">
                {{ data.status ? "刊登中" : "已關閉" }}
              </div>
              <div class="project_board_apply_table_body_content_applyCount">
                {{ data.applyCount | numberCommaFormat }}
              </div>
              <div class="project_board_apply_table_body_content_viewCount">
                {{ data.viewCount | numberCommaFormat }}
              </div>
              <div class="project_board_apply_table_body_content_turnonDays">
                {{ data.turnonDays | numberCommaFormat }}
              </div>
              <div class="project_board_apply_table_body_content_focus">
                <icon v-if="data.focus" iconName="icon-line-on" />
              </div>
            </div>
          </template>
        </div>
        <Pages
          v-if="tableData.length > 0"
          class="mt-6"
          v-bind="pageProp"
          @pageChange="onPageChange"
        />
      </div>

      <div v-else>
        <div class="no_result border_top">
          無符合資料，請切換條件：時間或設定網頁曝光職缺...等！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  projectApplyTitle,
  applySelectedOption as selectedOption
} from "@/utils/report/closeReport/util";
import Pages from "@/components/Pages.vue";
import {
  GETTERS_TYPE,
  ACTIONS_TYPE,
  MUTATIONS_TYPE
} from "@/store/modules/report/closeReport";
import { createNamespacedHelpers } from "vuex";
import Tag from "@/components/share/Tag.vue";
import DatePicker from "@/components/DatePicker.vue";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import { getPeriod } from "@/utils/report/closeReport/util.js";
const {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} = createNamespacedHelpers("report/closeReport");
import { Message } from "element-ui";

let msgInstance = null;

export default {
  name: "TabProjectBoardApply",
  data() {
    return {
      projectApplyTitle,
      selectedOption,
      selectedWeekIndex: 0,
      selectedDate: ""
    };
  },
  components: {
    Pages,
    Tag,
    DatePicker,
    SwitchTabs
  },
  computed: {
    ...mapState({
      summary: state => state.projectBoardApply.summary,
      tableData: state => state.projectBoardApply.table.data,
      currentPage: state => state.projectBoardApply.table.page.current,
      totalEl: state => state.projectBoardApply.table.page.total,
      isOnlyFocus: state => state.projectBoardApply.filter.isOnlyFocus,
      extension: state => state.projectBoardApply.filter.extension,
      selectedProject: state => state.selectedProject,
      projectSummary: state => state.projectSummary,
      filterStartDate: state => state.projectBoardApply.filter.startDate,
      filterEndDate: state => state.projectBoardApply.filter.endDate,
      dataInterval: state => state.projectBoardApply.query,
      dateType: state => state.projectBoardApply.query.dateType,
      periodWeeks: state => state.projectBoardApply.filter.periodWeeks,
      canGenerateReport: state =>
        state.projectBoardApply.filter.canGenerateReport,
      type: state => state.projectBoardApply.query.type,
      filterExtension: state => state.projectBoardApply.filter.extension
    }),
    ...mapGetters({
      isClosingProjectBoardApplySetInterval:
        GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_APPLY_SET_INTERVAL
    }),
    getFilterExtension: {
      get() {
        return this.filterExtension;
      },
      set(newVal) {
        this.updateProjectBoardApply({
          key: "filter",
          val: { extension: newVal }
        });
      }
    },
    pageProp() {
      const { currentPage, totalEl } = this;
      return {
        reloadPage: false,
        pageData: {
          page: currentPage,
          totalPages: Math.ceil(totalEl / 100),
          totalElements: totalEl
        },
        isUsedEmit: true
      };
    },
    selectedLabel() {
      return this.selectedOption.filter(
        item => item.value === this.isOnlyFocus
      )[0].label;
    },
    canGoPrev() {
      return this.selectedWeekIndex !== 0;
    },
    canGoNext() {
      return this.selectedWeekIndex !== this.periodWeeks.length - 1;
    },
    dayArray() {
      if (this.periodWeeks.length === 0) return [];
      const startDate = this.periodWeeks[this.selectedWeekIndex].startDate;
      const endDate = this.periodWeeks[this.selectedWeekIndex].endDate;

      return getPeriod(startDate, endDate, "days");
    },
    settingLinkQuery() {
      const query = {
        selectedDate: this.$route.query.selectedDate,
        selectedCompany: this.$route.query.selectedCompany,
        selectedProject: this.$route.query.selectedProject,
        searchedProjects: this.$route.query.searchedProjects
      };
      return query;
    }
  },
  methods: {
    ...mapMutations({
      updateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING,
      updateSelectedDayDate: MUTATIONS_TYPE.UPDATE_SELECTED_DAY_DATE,
      updateProjectBoardApply: MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY,
      resetProjectBoardApply: MUTATIONS_TYPE.RESET_PROJECT_BOARD_APPLY
    }),
    ...mapActions({
      getClosingProjectJobApplyDataSummary:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA_SUMMARY,
      getClosingProjectJobApplyDataPeriodSummary:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA_PERIOD_SUMMARY,
      getClosingProjectJobApplyData:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA,
      getMaintainJobSettingStatus: ACTIONS_TYPE.GET_MAINTAIN_JOB_SETTING_STATUS,
      generateJobapplyReport: ACTIONS_TYPE.GENERATE_JOBAPPLY_REPORT
    }),
    // 取數據列表
    async getSummaryAndTableData({ isOnlyFocus }) {
      const { updateIsLoading, getClosingProjectJobApplyData } = this;
      updateIsLoading(true);
      try {
        await this.getMaintainJobSettingStatus();
        await this.getClosingProjectJobApplyDataPeriodSummary({
          filter: {
            isOnlyFocus
          }
        });
        await getClosingProjectJobApplyData({
          page: 1
        });
        updateIsLoading(false);
        if (this.tableData.length === 0) this.scrollToTableContent();
        if (
          this.isClosingProjectBoardApplySetInterval &&
          this.$refs["date_picker"]
        ) {
          this.$nextTick(() => {
            this.$refs["date_picker"].dateValue = [
              this.dataInterval.startDate,
              this.dataInterval.endDate
            ];
          });
        }
      } catch (e) {
        updateIsLoading(false);
        console.log(e);
      }
    },
    // 取表格資料
    async getTableData({ page }) {
      const { updateIsLoading, getClosingProjectJobApplyData } = this;
      updateIsLoading(true);
      try {
        await getClosingProjectJobApplyData({
          page
        });
        updateIsLoading(false);
      } catch (e) {
        updateIsLoading(false);
        console.log(e);
      }
    },
    // 換頁
    async onPageChange({ page }) {
      await this.getTableData({
        page
      });
      this.$nextTick(() => {
        this.$emit("pageChange");
      });
    },
    // 廣告週間切換
    updateCurrentWeek(type) {
      if (type === "prev") {
        this.selectedWeekIndex === 0 ? 0 : this.selectedWeekIndex--;
      } else if (type === "next") {
        this.selectedWeekIndex === this.periodWeeks.length - 1
          ? this.selectedWeekIndex
          : this.selectedWeekIndex++;
      }
      this.handleDateUpdate();
    },
    // 切換職缺種類
    handleChangeJobType(val) {
      const selectedTab = this.selectedOption.find(item => item.key === val);
      this.getSummaryAndTableData({
        isOnlyFocus: selectedTab.value
      });

      localStorage.setItem(
        "TabProjectBoardApplyIsOnlyFocus",
        selectedTab.value
      );
    },
    getJobUrl(jobno) {
      return `https://www.${process.env.VUE_APP_DOMAIN}.com.tw/job/${jobno}`;
    },
    // 選擇數據區間的事件
    async setTime(time) {
      const { searchTimeStart, searchTimeEnd } = time;
      try {
        this.updateProjectBoardApply({
          key: "query",
          val: {
            startDate: searchTimeStart,
            endDate: searchTimeEnd
          }
        });
        this.calculateIntervalWeeks();
        await this.handleDateUpdate();
      } catch (error) {
        console.error(error);
      }
    },
    // 切換區間、週、日
    changeIntervalType(type, reportType) {
      this.updateProjectBoardApply({
        key: "query",
        val: { dateType: type, type: reportType }
      });
      if (this.periodWeeks.length === 0) this.calculateIntervalWeeks();
      this.handleDateUpdate();
    },
    // 計算週的下拉選項
    calculateIntervalWeeks() {
      // 有選擇區間，週選項以數據區間開頭起始
      if (this.isClosingProjectBoardApplySetInterval) {
        this.updateProjectBoardApply({
          key: "filter",
          val: {
            periodWeeks: getPeriod(
              this.dataInterval.startDate,
              this.dataInterval.endDate,
              "week",
              true
            )
          }
        });
      }
      // 無選擇區間，週選項以週一起始
      else {
        this.updateProjectBoardApply({
          key: "filter",
          val: {
            periodWeeks: getPeriod(
              this.dataInterval.startDate,
              this.dataInterval.endDate,
              "isoweek",
              true
            )
          }
        });
      }
      this.selectedWeekIndex = 0;
      this.selectedDate = this.dayArray[0].startDate;
    },
    // 更新state資料並呼叫API
    async handleDateUpdate() {
      this.updateProjectBoardApply({
        key: "filter",
        val: { selectedWeekIndex: this.selectedWeekIndex }
      });
      if (this.dateType === "period") {
        this.updateProjectBoardApply({
          key: "query",
          val: { type: 3 }
        });
        this.updateProjectBoardApply({
          key: "filter",
          val: {
            startDate: this.dataInterval.startDate,
            endDate: this.dataInterval.endDate
          }
        });
        this.getSummaryAndTableData({
          isOnlyFocus: this.isOnlyFocus
        });
      } else if (this.dateType === "week") {
        this.updateProjectBoardApply({
          key: "query",
          val: { type: 2 }
        });
        this.handleChangeWeek();
      } else if (this.dateType === "day") {
        this.updateProjectBoardApply({
          key: "query",
          val: { type: 1 }
        });
        this.handleChangeDay(0);
      }
    },
    // 切換週選項的事件
    handleChangeWeek() {
      const startDate = this.periodWeeks[this.selectedWeekIndex].startDate;
      const endDate = this.periodWeeks[this.selectedWeekIndex].endDate;
      this.updateProjectBoardApply({
        key: "filter",
        val: { startDate, endDate }
      });
      this.selectedDate = this.dayArray[0].startDate;
      this.getSummaryAndTableData({
        isOnlyFocus: this.isOnlyFocus
      });
    },
    // 選擇日期的事件
    handleChangeDay(index) {
      this.selectedDate = this.dayArray[index].startDate;
      this.updateProjectBoardApply({
        key: "filter",
        val: { startDate: this.selectedDate, endDate: this.selectedDate }
      });

      this.getSummaryAndTableData({
        weekStart: this.selectedDate,
        weekEnd: this.selectedDate,
        isOnlyFocus: this.isOnlyFocus
      });
    },
    // 捲動至表格內容
    scrollToTableContent() {
      this.$nextTick(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth"
        });
      });
    },
    // 清除數據區間觸發事件
    handleChangePeriod(dateValue) {
      if (dateValue === null) {
        this.resetProjectBoardApply();
        let defualtType = localStorage.getItem(
          "TabProjectBoardApplyIsOnlyFocus"
        );
        this.updateProjectBoardApply({
          key: "filter",
          val: {
            isOnlyFocus: defualtType === null ? true : defualtType === "true"
          }
        });
        this.updateProjectBoardApply({
          key: "query",
          val: { hasEnterDate: false }
        });
        this.getSummaryAndTableData({
          isOnlyFocus: this.isOnlyFocus
        });
      } else {
        this.updateProjectBoardApply({
          key: "query",
          val: { hasEnterDate: true }
        });
      }
    },
    // 產生主應報表
    async generateReport() {
      if (!this.canGenerateReport || this.tableData.length == 0) return;
      const id = await this.generateJobapplyReport();
      if (msgInstance) {
        msgInstance.close();
      }
      msgInstance = Message({
        dangerouslyUseHTMLString: true,
        message: `報表產生中，欲下載請至<a href='/downloadReport?id=${id}&tabType=Jobapply' rel='noopener noreferrer' target='_blank'>下載報表</a>。`,
        center: true,
        customClass: "copy_link_message_box",
        iconClass: "",
        duration: 0,
        offset: 100,
        showClose: "true"
      });

      msgInstance.$el.querySelector("a").onclick = () => {
        msgInstance.close();
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/report/table";

$table_width_config: (
  jobName: 442px,
  jobNo: 122px,
  turnonDate: 136px,
  status: 87px,
  applyCount: 90px,
  viewCount: 90px,
  turnonDays: 86px,
  focus: 117px
);

.project_board_apply {
  .report_type {
    display: flex;
    align-items: center;
    margin-bottom: 34px;

    > span {
      margin-right: 8px;
      @include font-common(18px, $font-weight-bold);
      line-height: 1.22;
      letter-spacing: 1.55px;
    }

    > img {
      margin-right: 10px;
    }

    .switcher {
      padding: 3px 24px;
      font-size: 18px;
      color: #393939;
      border: 1px solid $gray-500;
      cursor: pointer;

      &.switcher_all {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: none;
      }

      &.switcher_exposure {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-left: none;
      }

      &.active {
        color: $blue-turquoise;
        border: 1px solid $blue-turquoise;
        background-color: $blue-lake-light;
      }
    }
  }

  .divider_arrow {
    position: relative;
    margin-bottom: 24px;
    height: 1px;
    background-color: #d6d6d6;

    &::after {
      content: "";
      position: absolute;
      z-index: 1;
      top: -7px;
      left: calc(50%);
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      background-color: #fff;
      border-bottom: 1px solid #d6d6d6;
      border-right: 1px solid #d6d6d6;
    }
  }

  .not_setting {
    @include font-common(18px, $font-weight-normal, #8f8f8f);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 80px;
    margin-bottom: 80px;
  }

  .date_range {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  .date_switch {
    margin-bottom: 24px;
    display: flex;

    span {
      border: solid 1px #ddd;
      padding: 0 20px;
      font-size: 18px;
      position: relative;
      cursor: pointer;
      line-height: 1.6;

      &:nth-child(1) {
        padding: 0 11px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }

      &:nth-child(2) {
        left: -1px;
      }

      &:nth-child(3) {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        left: -2px;
      }

      &.focus {
        color: #00afb8;
        font-weight: bold;
        border: solid 1px #00afb8;
        background-color: #e6f9fa;
        z-index: 1;
      }
    }
  }

  .project_board_apply_info {
    letter-spacing: 1px;
    margin-top: 24px;
    margin-bottom: 24px;

    .project_board_apply_info_title {
      box-sizing: content-box;
      @include font-common(16px, $font-weight-bold);
    }

    .project_board_apply_info_content {
      flex: 1 1 auto;
      @include font-common(16px, $font-weight-normal);

      ::v-deep .el-select {
        width: 290px;
        margin-right: 12px;
      }
    }

    &.week {
      .duration {
        color: $blue-lake;

        &.days {
          cursor: pointer;

          .focus {
            font-weight: bold;
            background-color: #e1fafa;
            padding: 4px;
            line-height: 1;
          }

          span {
            display: inline-block;
          }
        }
      }

      .comma {
        color: #333;
      }

      .control_week {
        button {
          outline: none;
        }
      }
    }

    &.ad_board {
      .project_board_apply_info_title {
        &.extra-padding {
          padding-top: 2px;
        }
      }
      .project_board_apply_info_content {
        .no_board {
          color: $blue-text;
          font-weight: bold;
        }
      }
    }
  }

  .project_board_apply_summary {
    > div {
      padding-right: 30px;
      position: relative;
      line-height: 60px;

      &:first-child:before {
        content: "";
        display: inline-block;
        border-width: 10px 10px 10px 0;
        border-color: transparent transparent $white transparent;
        border-style: solid;
        position: absolute;
        top: 53%;
        transform: translateY(-50%) rotate(-135deg);
        right: 13px;
        z-index: 1;
      }

      &:first-child::after {
        content: "";
        display: inline-block;
        border-width: 10px 10px 10px 0;
        border-color: transparent transparent $gray-500 transparent;
        border-style: solid;
        position: absolute;
        top: 53%;
        transform: translateY(-50%) rotate(-135deg);
        right: 12px;
      }

      &:nth-child(2)::after {
        width: 1px;
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -14px;
        background-color: $gray-500;
      }

      > span:nth-child(1) {
        @include font-common(16px, $font-weight-normal);
      }

      > span:nth-child(2) {
        @include font-common(20px, $font-weight-normal, $blue-lake);
      }
    }
  }

  .project_board_apply_control_select {
    ::v-deep .el-select {
      width: 112px;
    }
  }

  .download {
    > span {
      font-weight: bold;
      margin-right: 12px;
    }

    text-align: right;

    .button_bg_white_small,
    .button_bg_white_small_disable {
      height: 32px;
      width: 80px;
      font-size: 14px;
    }
  }

  .project_board_apply_table {
    margin-top: 20px;
    @include table_width($table_width_config);

    .project_board_apply_table_header_content_jobName {
      line-height: 1;
    }

    .project_board_apply_table_header_content_status {
      line-height: 1;
    }

    .project_board_apply_table_body_content_focus {
      > img {
        display: block;
        margin: auto;
      }
    }

    .project_board_apply_table_body_content_jobName {
      a {
        text-decoration: none;
        outline: medium none;
      }
    }

    .project_board_apply_table_body_content_jobName {
      a {
        text-decoration: none;
        outline: medium none;
      }
    }
  }

  .no_result {
    @include font-common(18px, $font-weight-normal, #8f8f8f);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    margin-bottom: 80px;
    padding-top: 80px;
  }

  .border_top {
    border-top: 1px solid #d6d6d6;
  }
}
</style>
