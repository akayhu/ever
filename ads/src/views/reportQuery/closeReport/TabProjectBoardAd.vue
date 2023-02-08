<template>
  <div class="project_board_ad">
    <switch-tabs
      :value="selectedDevice"
      :tabs-data="deviceTabs"
      :style-type="'tertiary'"
      @select-tab="updateSelectedDevice($event.key)"
    />
    <div class="data_date_range">
      <div class="mr-7 font-weight-bold">數據區間</div>
      <DatePicker
        ref="date_picker"
        :getSearchTime="setTime"
        :dateRange="[projectSummary.startDate, projectSummary.endDate]"
        :clearable="true"
        :changeAction="handleChangePeriod"
      />
    </div>
    <div class="project_date_interval_selector">
      <span
        @click="changeIntervalType('period')"
        :class="{ focus: dateType === 'period' }"
      >
        區間
      </span>
      <span
        @click="changeIntervalType('week')"
        :class="{ focus: dateType === 'week' }"
      >
        週
      </span>
      <span
        @click="changeIntervalType('day')"
        :class="{ focus: dateType === 'day' }"
      >
        日
      </span>
    </div>

    <div class="project_board_ad_boards mb-4 d-flex align-items-baseline">
      <div
        class="project_board_apply_info_title mr-7 font-weight-bold flex-shrink-0"
      >
        廣告版位
      </div>
      <div class="d-flex flex-wrap">
        <template v-if="currentDeviceBoard.length > 0">
          <Tag
            v-for="board in currentDeviceBoard"
            :key="board.id"
            :content="`${board.siteName}/${board.channelName}/${board.name}`"
            :isActive="board.id === boardId"
            @onTagClick="updateCurrentBoard(board)"
            class="mr-1 mt-2"
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

    <div class="project_board_ad_summary d-flex mt-6">
      <div class="project_board_ad_summary_total pl-5">
        <span>Total</span>
      </div>
      <div class="project_board_ad_summary_imp">
        <span class="mr-1">IMP</span>
        <span>{{ summary.impression | numberCommaFormat }}</span>
      </div>
      <div class="project_board_ad_summary_click">
        <span class="mr-1">CLICK</span>
        <span>{{ summary.click | numberCommaFormat }}</span>
      </div>
      <div class="project_board_ad_summary_ctr">
        <span class="mr-1">CTR</span>
        <span>{{ summary.ctr }}%</span>
      </div>
    </div>
    <div
      class="project_board_ad_control_select mt-6 d-flex justify-content-end align-items-center "
    >
      <span class="word">
        <icon
          :iconName="
            present === 'word'
              ? 'icon-icon-li-more-on'
              : 'icon-icon-li-more-off'
          "
          @click.native="changePresentIcon('word')"
        />
      </span>
      <span class="preview">
        <icon
          :iconName="
            present === 'preview' ? 'icon-icon-li-on' : 'icon-icon-li-off'
          "
          @click.native="changePresentIcon('preview')"
        />
      </span>
      <select-dropdown
        :value="selectedLabel"
        :filterable="false"
        :remote="false"
        :options="selectedOption"
        @value-changed="onDropDownSelect"
      />
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
    </div>
    <div class="project_board_ad_table">
      <div class="project_board_ad_table_header_row">
        <div
          v-for="header in adDataTableTitle"
          :key="header.key"
          :class="`project_board_ad_table_header_content_${header.key}`"
        >
          <div>{{ header.label }}</div>
        </div>
      </div>
      <template v-if="tableData.length > 0">
        <div
          v-for="(data, index) in tableData"
          :key="index"
          class="project_board_ad_table_body_row"
        >
          <div class="project_board_ad_table_body_content_date">
            {{ data.date }}
          </div>
          <div class="project_board_ad_table_body_content_impression">
            {{ data.impression | numberCommaFormat }}
          </div>
          <div class="project_board_ad_table_body_content_click">
            {{ data.click | numberCommaFormat }}
          </div>
          <div class="project_board_ad_table_body_content_ctr">
            {{ data.ctr }}%
          </div>
          <div class="project_board_ad_table_body_content_materialId">
            <div v-if="data.materialId && data.materialTitle">
              <div v-if="present === 'word'" class="word_section">
                <icon
                  @click.native.prevent="
                    openMaterialPreview(data.materialId, data.typeId, data.date)
                  "
                  v-tooltip="{
                    placement: 'bottom-start',
                    offset: 5,
                    content: `${data.materialTitle} (ID:${data.materialId})`,
                    trigger: 'hover'
                  }"
                  iconName="demo-icon-p"
                  class="pr-2"
                />
                <span
                  @click.prevent="
                    openMaterialPreview(data.materialId, data.typeId, data.date)
                  "
                  v-tooltip="{
                    placement: 'bottom-start',
                    offset: 5,
                    content: `${data.materialTitle} (ID:${data.materialId})`,
                    trigger: 'hover'
                  }"
                >
                  {{ data.materialTitle }} (ID:{{ data.materialId }})
                </span>
              </div>
              <div v-else class="preview_section">
                <div class="preview_section_link">
                  <a
                    v-tooltip="{
                      placement: 'bottom-start',
                      offset: 5,
                      content: `${data.materialTitle} (ID:${data.materialId})`,
                      trigger: 'hover'
                    }"
                    class="text-truncate mb-3"
                    href="javascript:;"
                    @click.prevent="
                      openMaterialPreview(
                        data.materialId,
                        data.typeId,
                        data.date
                      )
                    "
                    >{{ data.materialTitle }} (ID:{{ data.materialId }})
                  </a>
                  <div class="materialId_link">
                    <div
                      class="project_board_ad_table_body_content_url"
                      :class="`body_content_url_${index}`"
                      @mouseenter="toolTipIndexHandler(index)"
                      @mouseleave.stop="toolTipIndexHandler(-1)"
                    >
                      <v-popover
                        :open="activeToolTipIndex === index"
                        :trigger="'manual'"
                        :offset="5"
                        :container="`.body_content_url_${index}`"
                        placement="right"
                        popoverClass="light"
                        v-if="data.link"
                      >
                        <icon iconName="icon-link" />
                        <template slot="popover">
                          <div class="popover_link">
                            <div
                              class="popover_link_anchor"
                              v-for="(link, index) in data.link"
                              :key="index"
                            >
                              <a :href="link" target="_blank">
                                {{ link }}
                              </a>
                              <div
                                class="popover_link_icon"
                                @click="copyLink(link)"
                              >
                                <icon iconName="icon-link" />
                              </div>
                            </div>
                          </div>
                        </template>
                      </v-popover>
                    </div>
                  </div>
                </div>
                <div class="preview_image_block">
                  <div class="preview_image_default">
                    <img
                      :src="data.previewUrl[0]"
                      :class="{
                        preview_image_w600: data.imgWidth > 600,
                        preview_image_h200: data.imgHeight > 200
                      }"
                      alt="snapshot_preview"
                    />
                  </div>
                </div>
                <div v-if="data.previewUrl.length === 0" class="preview_empty">
                  <img
                    src="@/assets/icon/demo-icon-p.svg"
                    alt="preview_empty"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="board_by_day_compare_table_body_no_result">
        無符合資料，請切換時間條件！
      </div>
    </div>
    <Pages
      class="mt-6"
      v-if="tableData.length > 0"
      v-bind="pageProp"
      @pageChange="onPageChange"
    />
    <GoTop />
    <PreviewPopup
      v-model="showPreviewPopup"
      :hasTitle="false"
      :materialId="previewMaterialId"
      apiPath="material"
      :boardInfo="materialType"
    />
  </div>
</template>

<script>
import {
  adDataTableTitle,
  adDeviceTabs,
  adSelectedOption as selectedOption
} from "@/utils/report/closeReport/util";
import Pages from "@/components/Pages.vue";
import Tag from "@/components/share/Tag.vue";
import DatePicker from "@/components/DatePicker.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import GoTop from "@/components/GoTop.vue";
import PreviewPopup from "@/components/preview/PreviewPopup.vue";
import SwitchTabs from "@/components/share/SwitchTabs.vue";

import {
  ACTIONS_TYPE,
  GETTERS_TYPE,
  MUTATIONS_TYPE
} from "@/store/modules/report/closeReport";
import { createNamespacedHelpers } from "vuex";
const {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} = createNamespacedHelpers("report/closeReport");
import { ACTIONS_TYPE as UPLPAD_MATERIAL_ACTIONS_TYPE } from "@/store/share/uploadMaterial/actions";
import { copyLink } from "@/utils/copyLink.js";
import { getPeriod } from "@/utils/report/closeReport/util.js";
import { Message } from "element-ui";

let debouceMouseActionTimer = null;
let msgInstance = null;

export default {
  name: "TabProjectBoardAd",
  data() {
    return {
      adDataTableTitle,
      adDeviceTabs,
      selectedOption,
      selectedDevice: "PC",
      present: "word",
      activeToolTipIndex: -1,
      copyLink,
      showPreviewPopup: false,
      previewMaterialId: null,
      selectedWeekIndex: 0,
      selectedDate: ""
    };
  },
  components: {
    Pages,
    Tag,
    DatePicker,
    SelectDropdown,
    GoTop,
    PreviewPopup,
    SwitchTabs
  },
  computed: {
    ...mapState({
      selectedProject: state => state.selectedProject,
      filterBoard: state => state.filterBoard,
      summary: state => state.projectBoardAd.summary,
      tableData: state => state.projectBoardAd.table.data,
      page: state => state.projectBoardAd.table.page.page,
      totalPages: state => state.projectBoardAd.table.page.totalPages,
      totalElements: state => state.projectBoardAd.table.page.totalElements,
      isByMaterial: state => state.projectBoardAd.table.filter.isByMaterial,
      boardId: state => state.projectBoardAd.filter.boardId,
      materialType: state => state.materialType,
      isProjectBoardAdByMaterial: state =>
        state.projectBoardAd.table.filter.isByMaterial,
      projectSummary: state => state.projectSummary,
      dataInterval: state => state.projectBoardAd.query,
      filterStartDate: state => state.projectBoardAd.filter.startDate,
      filterEndDate: state => state.projectBoardAd.filter.endDate,
      periodWeeks: state => state.projectBoardAd.filter.periodWeeks,
      dateType: state => state.projectBoardAd.query.dateType,
      allBoards: state => state.projectBoardAd.project.boards,
      filterExtension: state => state.projectBoardAd.filter.extension,
      canGenerateReport: state => state.projectBoardAd.filter.canGenerateReport
    }),
    ...mapGetters({
      isClosingProjectBoardAdSetInterval:
        GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_AD_SET_INTERVAL
    }),
    getFilterExtension: {
      get() {
        return this.filterExtension;
      },
      set(newVal) {
        this.updateProjectBoardAd({
          key: "filter",
          val: { extension: newVal }
        });
        this.$refs["date_picker"].dateValue = [
          this.filterStartDate,
          this.filterEndDate
        ];
      }
    },
    pageProp() {
      const { page, totalPages, totalElements } = this;
      return {
        reloadPage: false,
        pageData: { page, totalPages, totalElements },
        isUsedEmit: true
      };
    },
    selectedLabel() {
      return this.selectedOption.filter(
        item => item.value === this.isByMaterial
      )[0].label;
    },
    deviceTabs() {
      return this.adDeviceTabs.map(item => {
        const disabled = !this.filterBoard.some(
          board => board.device === item.key
        );
        return { ...item, disabled };
      });
    },
    currentDeviceBoard() {
      return this.filterDeviceBoard(this.selectedDevice);
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
    }
  },
  destroyed() {
    sessionStorage.removeItem("top");
  },
  watch: {
    selectedProject() {
      this.selectedDevice = "PC";
    },
    isClosingProjectBoardAdSetInterval(newVal) {
      if (!newVal) this.$refs["date_picker"].dateValue = [];
    }
  },
  methods: {
    ...mapMutations({
      updateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING,
      updateProjectBoardAd: MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD,
      resetProjectBoardAd: MUTATIONS_TYPE.RESET_PROJECT_BOARD_AD,
      resetProjectBoardAdData: MUTATIONS_TYPE.RESET_PROJECT_BOARD_AD_DATA
    }),
    ...mapActions({
      getClosingProjectBoardAdData:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_BOARD_AD_DATA,
      getClosingProjectBoardAdSummary:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_BOARD_AD_SUMMARY,
      getMaterialType: UPLPAD_MATERIAL_ACTIONS_TYPE.GET_MATERIAL_TYPE,
      getFilterBoard: ACTIONS_TYPE.GET_FILTER_BOARD,
      generateAdReport: ACTIONS_TYPE.GENERATE_AD_REPORT
    }),
    updateSelectedDevice(device) {
      this.selectedDevice = device;
      this.savePosition();
      if (this.currentDeviceBoard.length > 0)
        this.updateCurrentBoard(this.currentDeviceBoard[0]);
    },
    // 選擇版位
    async updateCurrentBoard(board) {
      this.updateIsLoading(true);
      if (this.present === "preview") this.present = "";
      try {
        await this.getSummaryData(board);
        await this.getTableData({
          page: 1,
          isByMaterial: this.isByMaterial
        });
        await this.getMaterialType({
          typeId: board.typeId,
          boardId: board.id
        });

        if (this.present === "") {
          setTimeout(() => {
            this.present = "preview";
            this.$nextTick(() => this.updateIsLoading(false));
          }, 300);
        } else {
          this.updateIsLoading(false);
        }
      } catch (e) {
        this.updateIsLoading(false);
        console.log(e);
      }
    },
    async getFilterBoardData() {
      this.updateIsLoading(true);

      try {
        await this.getFilterBoard({
          filter: {
            startDate: this.filterStartDate,
            endDate: this.filterEndDate
          }
        });
      } finally {
        this.updateIsLoading(false);
      }

      if (this.currentDeviceBoard.length > 0) {
        const board =
          this.currentDeviceBoard.find(item => item.id === this.boardId) ||
          this.currentDeviceBoard[0];
        await this.updateCurrentBoard(board);
      } else if (this.filterBoard.length > 0) {
        this.updateSelectedDevice(this.filterBoard[0].device);
      } else {
        this.resetProjectBoardAdData();
      }
    },
    async getSummaryData(board) {
      try {
        await this.getClosingProjectBoardAdSummary({
          filter: {
            boardId: board.id || this.boardId
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    async getTableData({ page, isByMaterial }) {
      const { updateIsLoading, getClosingProjectBoardAdData } = this;
      updateIsLoading(true);
      try {
        await getClosingProjectBoardAdData({
          page,
          filter: {
            isByMaterial
          }
        });
        setTimeout(() => {
          this.scrollToTableContent();
        }, 0);
        updateIsLoading(false);
      } catch (e) {
        console.log(e);
        updateIsLoading(false);
      }
    },
    onDropDownSelect(val) {
      this.getTableData({
        page: this.currentPage,
        isByMaterial: val
      });
    },
    async onPageChange({ page }) {
      await this.getTableData({
        page,
        isByMaterial: this.isByMaterial
      });
      this.$nextTick(() => {
        this.$emit("pageChange");
      });
    },
    openMaterialPreview(materialId) {
      if (!materialId) return;
      this.previewMaterialId = materialId;
      this.showPreviewPopup = true;
    },
    toolTipIndexHandler(index) {
      clearTimeout(debouceMouseActionTimer);
      debouceMouseActionTimer = setTimeout(() => {
        this.activeToolTipIndex = index;
      }, 100);
    },
    filterDeviceBoard(device) {
      return this.filterBoard.filter(board => board.device === device);
    },
    changePresentIcon(type) {
      this.present = type;
    },
    // 選擇數據區間的事件
    async setTime(time) {
      const { searchTimeStart, searchTimeEnd } = time;
      try {
        this.updateProjectBoardAd({
          key: "query",
          val: { startDate: searchTimeStart, endDate: searchTimeEnd }
        });
        this.calculateIntervalWeeks();
        await this.handleDateUpdate();
      } catch (error) {
        console.error(error);
      }
    },
    // 計算週間下拉選項
    calculateIntervalWeeks() {
      // 有選擇區間，週選項以數據區間開頭起始
      if (this.isClosingProjectBoardAdSetInterval) {
        this.updateProjectBoardAd({
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
        this.updateProjectBoardAd({
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
    // 切換 區間、週、日
    changeIntervalType(type) {
      this.updateProjectBoardAd({ key: "query", val: { dateType: type } });
      if (this.periodWeeks.length === 0) this.calculateIntervalWeeks();
      this.handleDateUpdate();
    },
    // 更新state資料並呼叫版位API
    handleDateUpdate() {
      this.savePosition();
      if (this.dateType === "period") {
        this.updateProjectBoardAd({
          key: "filter",
          val: {
            startDate: this.dataInterval.startDate,
            endDate: this.dataInterval.endDate
          }
        });
        this.getFilterBoardData();
      } else if (this.dateType === "week") {
        this.handleChangeWeek();
      } else if (this.dateType === "day") {
        this.handleChangeDay(0);
      }
    },
    // 切換週間的事件
    handleChangeWeek() {
      const startDate = this.periodWeeks[this.selectedWeekIndex].startDate;
      const endDate = this.periodWeeks[this.selectedWeekIndex].endDate;
      this.updateProjectBoardAd({
        key: "filter",
        val: { startDate, endDate }
      });
      this.selectedDate = this.dayArray[0].startDate;
      this.getFilterBoardData();
    },
    // 選擇日期的事件
    handleChangeDay(index) {
      this.selectedDate = this.dayArray[index].startDate;
      this.updateProjectBoardAd({
        key: "filter",
        val: { startDate: this.selectedDate, endDate: this.selectedDate }
      });

      this.getFilterBoardData();
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
    // 清除數據區間觸發事件
    handleChangePeriod(dateValue) {
      if (dateValue === null) {
        this.resetProjectBoardAd();
        this.getFilterBoardData();
      }
    },
    // 儲存列表滾動位置
    savePosition() {
      const top = window.scrollY;
      sessionStorage.setItem("top", top);
    },
    // 捲動至表格內容
    scrollToTableContent() {
      this.$nextTick(() => {
        let top = 0;
        if (sessionStorage.getItem("top")) {
          top = sessionStorage.getItem("top");
        } else {
          const tableDom = document.querySelector(
            ".project_board_ad_control_select"
          );
          top = tableDom.offsetTop || 0;
        }
        window.scrollTo({ top });
      });
    },
    // 產生報表
    async generateReport() {
      if (!this.canGenerateReport || this.tableData.length == 0) return;
      const id = await this.generateAdReport();
      if (msgInstance) {
        msgInstance.close();
      }
      msgInstance = Message({
        dangerouslyUseHTMLString: true,
        message: `報表產生中，欲下載請至<a href='/downloadReport?id=${id}' rel='noopener noreferrer' target='_blank'>下載報表</a>。`,
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
  date: 199px,
  impression: 120px,
  click: 120px,
  ctr: 120px,
  materialId: 621px
);

.project_board_ad {
  .data_date_range {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  .project_board_ad_boards {
    > p {
      color: $red;
    }

    .no_board {
      color: $blue-text;
      font-weight: bold;
    }
  }

  .project_board_ad_summary {
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

  .project_board_ad_control_select {
    ::v-deep .el-select {
      width: 96px;
      margin-right: 16px;
    }

    span {
      &.word {
        padding-right: 8px;
        border-right: 1px solid #ddd;
        cursor: pointer;
      }
      &.preview {
        padding: 0 16px 0 8px;
        cursor: pointer;
      }
    }

    .download {
      > span {
        font-weight: bold;
        margin-right: 12px;
      }

      > a {
        > span {
          @include font-common(16px, $font-weight-bold, $link-color);
        }
      }

      .button_bg_white_small {
        height: 32px;
        width: 80px;
        font-size: 14px;

        &_disable {
          height: 32px;
          width: 80px;
          font-size: 14px;
        }
      }
    }
  }

  .project_board_ad_table {
    margin-top: 24px;
    @include table_width($table_width_config);

    .project_board_ad_table_body_content_materialId {
      > div {
        > img {
          transform: translateY(-1.5px);
        }
        > a {
          max-width: 175px;
        }
      }
      .word_section {
        display: flex;
        align-items: center;

        img {
          cursor: pointer;
        }

        span {
          width: 572px;
          line-height: 1;
          cursor: pointer;
          color: #1654b9;
        }
      }
      .preview_section {
        .preview_section_link {
          display: flex;
          align-items: baseline;

          a {
            margin-right: 6px;
          }
        }

        .materialTitle {
          margin-bottom: 12px;
        }

        .materialId_link {
          display: flex;
          align-items: center;

          .materialId {
            width: fit-content;
            margin: 12px 8px 12px 0;
            padding: 2px 12px;
            border-radius: 12px;
            background-color: #eee;
          }

          img {
            width: 24px;
            cursor: pointer;
          }

          .popover_link {
            .popover_link_anchor {
              display: flex;
              align-items: center;

              &:not(:last-child) {
                padding-bottom: 12px;
                border-bottom: 1px solid #eee;
                margin-bottom: 12px;
              }
            }
          }
        }

        .preview_image_block {
          display: flex;

          .preview_image_default {
            border: 1px dotted #d8d8d8;
            background-color: #fff;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;

            &:not(:last-child) {
              margin-right: 12px;
            }

            .preview_image_w600 {
              width: 600px;
            }

            .preview_image_h200 {
              height: 200px;
            }
          }
        }

        .preview_empty {
          width: 150px;
          height: 120px;
          border: 1px solid #d8d8d8;
          background-color: #fff;
          position: relative;

          img {
            position: absolute;
            top: 45%;
            left: 45%;
          }
        }
      }
    }
  }
}
</style>
