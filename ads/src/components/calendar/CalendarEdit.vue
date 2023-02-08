<template>
  <div class="calendar_edit_main" :calendar_edit_main_left="itemDate.day >= 20">
    <div class="calendar_edit_top_title">
      <div></div>
      <div>
        <span v-if="!isBooking && !isPrepare" class="id"
          >ID：{{ reservationId }}</span
        >
        <span class="close" @click.stop="closeEdit">
          <icon iconName="icon-x-border" />
        </span>
      </div>
    </div>
    <div class="title_block">
      <span class="title">{{
        isBooking || isPrepare ? "版位預約" : "版位預約修改"
      }}</span>
      <span class="createDate">{{ detail.createDate }}</span>
    </div>
    <div class="project_title">
      <div class="d-flex">
        <div class="layout">專案</div>
        <router-link
          v-if="!isPrepare"
          :to="
            `/editpj?projectId=${
              isBooking ? selectProject.projectId : detail.projectId
            }`
          "
          target="_blank"
          :title="isBooking ? selectProject.projectName : projectName"
        >
          <span>{{ isBooking ? selectProject.projectName : projectName }}</span>
        </router-link>
        <div v-else class="layout">
          <span>{{ projectName }}</span>
        </div>
      </div>
      <div v-if="detail.orderId" class="order-id">({{ detail.orderId }})</div>
    </div>
    <div class="calendar_edit_middle">
      <div class="layout_block">
        <div v-if="detail.offDate" class="emergency-text">
          {{ `${detail.offDate} 緊急下架` }}
        </div>
        <div v-if="detail.orderId" class="upload-material">
          <router-link
            :to="
              `/material?id=${detail.orderId}&device=${detail.device}&reservationId=${detail.reservationId}`
            "
            rel="noopener noreferrer"
            target="_blank"
            title="上傳素材"
          >
            <icon iconName="icon-icon-note" />上傳素材
          </router-link>
        </div>
        <div class="d-flex">
          <div class="layout">版位</div>
          <span>{{ boardName }}</span>
        </div>
        <div class="d-flex align-items-baseline product">
          <div class="layout">商品</div>
          <span v-if="layouItem">{{ productName }}</span>
          <span v-else>
            <SelectDropdown
              :value="productName"
              :options="creation.productOptions"
              :optionsAllData="true"
              :wrap="true"
              :disabled="
                !detail.canEditUsage || creation.productOptions.length === 0
              "
              placeholder="請選擇"
              @value-changed="setSelectedProduct($event, index)"
            />
          </span>
        </div>
      </div>
      <div v-if="isSalesOpen" class="for_sale">
        <div class="for_sale_block">
          <!-- 空版 PR -->
          <table
            v-if="salesIsEmptyPR"
            cellpadding="0"
            cellspacing="0"
            class="calendar_layout_table"
          >
            <tr>
              <td>特殊銷用<sup v-if="detail.canEditUsage">*</sup></td>
              <td>
                <label class="ad-radio-label">
                  <input
                    type="radio"
                    v-model="sales"
                    name="text"
                    :value="1"
                    :disabled="!detail.canEditUsage"
                  />
                  <span class="ad-radio"></span>企業
                </label>
              </td>
              <td class="calendar-layout-input">
                <SelectDropdown
                  v-if="!isBooking || selectProject.projectStatus > 0"
                  @value-changed="setSelectedMarketingProject($event)"
                  :value="selectedMarketingProject"
                  :options="selectedMarketingProjectOptions"
                  :asncSearchCb="marketingProjectSuggest"
                  :filterable="true"
                  :remote="true"
                  :optionsAllData="true"
                  :clearable="true"
                  :disabled="!detail.canEditUsage || sales !== 1"
                  placeholder="輸入銷用專案"
                />
              </td>
            </tr>
            <tr
              v-if="showSalesInput && sales == 1 && !selectedMarketingProject"
            >
              <td></td>
              <td></td>
              <td>
                <div class="calendar-layout-input__notify">
                  此為必填欄位
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <label class="ad-radio-label">
                  <input
                    type="radio"
                    v-model="sales"
                    @change="changeGiveaway"
                    name="text"
                    :value="2"
                    id="r2"
                    :disabled="!detail.canEditUsage"
                  />
                  <span class="ad-radio"></span>內部
                </label>
              </td>
              <td></td>
            </tr>
          </table>

          <!-- 一般PR -->
          <table
            v-else
            cellpadding="0"
            cellspacing="0"
            class="calendar_layout_table"
          >
            <tr>
              <td>特殊銷用</td>
              <td>
                <label class="ad-radio-label">
                  <input
                    type="radio"
                    v-model="sales"
                    name="text"
                    :value="0"
                    :disabled="!detail.canEditUsage"
                    @change="changeGiveaway"
                  />
                  <span class="ad-radio"></span>原合約
                </label>
              </td>
              <td class="calendar-layout-input text-right">
                <icon
                  v-if="!salesShow"
                  class="drop-down calendar-layout-input__drop-down"
                  @click.native="openSales"
                  iconName="arrow-drop-down"
                  size="20"
                />
              </td>
            </tr>
            <tr v-show="salesShow">
              <td></td>
              <td>
                <label class="ad-radio-label">
                  <input
                    type="radio"
                    v-model="sales"
                    name="text"
                    :value="1"
                    :disabled="!detail.canEditUsage"
                    @change="changeGiveaway"
                  />
                  <span class="ad-radio"></span>曝光專案
                </label>
                <icon
                  v-tooltip="{
                    placement: 'right',
                    offset: 5,
                    content: '放指定專案的素材<br>數據歸在該專案內',
                    trigger: 'hover'
                  }"
                  iconName="ic-help-outline"
                  class="mr-2"
                  size="16"
                />
              </td>
              <td class="calendar-layout-input">
                <div v-if="!isBooking || selectProject.projectStatus > 0">
                  <SelectDropdown
                    v-if="detail.canEditUsage"
                    @value-changed="setSelectedMarketingProject($event)"
                    :value="selectedMarketingProject"
                    :options="selectedMarketingProjectOptions"
                    :asncSearchCb="marketingProjectSuggest"
                    :filterable="true"
                    :remote="true"
                    :optionsAllData="true"
                    :clearable="true"
                    :disabled="!detail.canEditUsage || sales !== 1"
                    placeholder="輸入銷用專案"
                  />
                  <div
                    v-else-if="sales === 1"
                    class="text-truncate"
                    :title="selectedMarketingProject"
                  >
                    {{ selectedMarketingProject }}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colspan="3"
                v-if="
                  exposureProjectCustomerId &&
                    detail.customerId !== exposureProjectCustomerId
                "
                class="confirm"
              >
                您設定銷用不同企業，送出前請確認
              </td>
            </tr>
            <tr
              v-if="showSalesInput && sales == 1 && !selectedMarketingProject"
              v-show="salesShow"
            >
              <td></td>
              <td></td>
              <td>
                <div class="calendar-layout-input__notify">
                  此為必填欄位
                </div>
              </td>
            </tr>
            <tr v-if="projectType == 0" v-show="salesShow">
              <td></td>
              <td>
                <label class="ad-radio-label">
                  <input
                    type="radio"
                    v-model="sales"
                    name="text"
                    :value="3"
                    :disabled="!detail.canEditUsage"
                    @change="changeGiveaway"
                  />
                  <span class="ad-radio"></span>舊單PR
                </label>
                <icon
                  v-tooltip="{
                    placement: 'right',
                    offset: 5,
                    content: '拉指定專案的Cue<br>扣該專案的錢',
                    trigger: 'hover'
                  }"
                  iconName="ic-help-outline"
                  class="mr-2"
                  size="16"
                />
              </td>
              <td class="calendar-layout-input">
                <div v-if="!isBooking || selectProject.projectStatus > 0">
                  <SelectDropdown
                    v-if="detail.canEditUsage"
                    @value-changed="setOldPRMarketingProject($event)"
                    :value="oldPRMarketingProject"
                    :options="selectedMarketingProjectOptions"
                    :asncSearchCb="marketingProjectSuggest"
                    :filterable="true"
                    :remote="true"
                    :optionsAllData="true"
                    :clearable="true"
                    :disabled="!detail.canEditUsage || sales !== 3"
                    placeholder="輸入銷用專案"
                  />
                  <div
                    v-else-if="sales === 3"
                    class="text-truncate"
                    :title="oldPRMarketingProject"
                  >
                    {{ oldPRMarketingProject }}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colspan="3"
                v-if="
                  oldPRProjectCustomerId &&
                    detail.customerId !== oldPRProjectCustomerId
                "
                class="confirm pt-4"
              >
                您設定銷用不同企業，送出前請確認
              </td>
            </tr>
            <tr
              v-if="
                projectType == 0 &&
                  showSalesInput &&
                  sales == 3 &&
                  !oldPRMarketingProject
              "
              v-show="salesShow"
            >
              <td></td>
              <td></td>
              <td>
                <div class="calendar-layout-input__notify">
                  此為必填欄位
                </div>
              </td>
            </tr>
            <tr v-show="salesShow">
              <td></td>
              <td colspan="2" class="pt-4">
                <label class="ad-radio-label">
                  <input
                    type="radio"
                    v-model="sales"
                    @change="changeGiveaway"
                    name="text"
                    :value="2"
                    id="r2"
                    :disabled="!detail.canEditUsage"
                  />
                  <span class="ad-radio"></span>成效PR </label
                >(請於備註欄填寫PR原因)
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="date">
        <div class="date_block">
          <div class="date_content">
            日期<sup v-if="detail.canEditDate">*</sup>
            <span>
              走期
              <input
                v-if="detail.canEditDate"
                v-model="timeDay"
                v-numberOnly
                type="number"
                placeholder="天數"
                :disabled="!detail.canEditDate || isPrepare"
                :max="maxBookingDays()"
                :oninput="getOnInput(timeDay)"
                @change="changeTimeDay"
              />
              <span class="date_content__day-number" v-else>{{ timeDay }}</span>
              天
            </span>
          </div>
          <div v-if="detail.startDate && detail.endDate">
            <DatePicker
              v-if="detail.canEditDate"
              :getSearchTime="getTime"
              :schedule="changeSchedule"
              :timeDay="timeDay"
              :dateInterval="[detail.startDate, detail.endDate]"
              :disabled="!detail.canEditDate || isPrepare"
              :reservation="true"
            />
            <div v-else class="date_display">
              {{ `${detail.startDate} ~ ${detail.endDate}` }}
            </div>
          </div>
        </div>
      </div>
      <div class="note_block">
        <div class="note">
          <div class="row no-gutters justify-content-between">
            <div class="col-auto">備註</div>
            <div class="col-auto">
              <icon
                class="drop-down"
                :class="{ 'drop-down-active': noteShow }"
                @click.native="showNote"
                iconName="arrow-drop-down"
                size="20"
              />
            </div>
          </div>
          <el-input
            v-show="noteShow"
            type="textarea"
            placeholder="請輸入"
            v-model="textarea"
            maxlength="200"
            show-word-limit
            :disabled="!detail.canEditNote || isPrepare"
            @input="filterValue"
          />
          <div
            v-if="noteRequiredShow"
            class="calendar-layout-input__notify mt10"
          >
            PR 原因為必填
          </div>
        </div>
      </div>
    </div>
    <div class="button_content">
      <button
        v-if="isModify"
        @click="deleteReserve"
        :disabled="!detail.deletable || isPrepare"
        :class="
          !detail.deletable ? 'not-allowed button_bg_white_large_disable' : ''
        "
        class="button_bg_white_small delete"
      >
        刪除檔期
      </button>
      <button
        v-if="isBooking"
        @click.stop="closeEdit"
        class="button_bg_white_small"
      >
        取消
      </button>
      <button
        @click="submitModify"
        class="button_bg_blue_small"
        :class="{ button_bg_blue_smaller_disable: isPrepare }"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script>
import DatePicker from "@/components/DatePicker.vue";
import { mapActions, mapState } from "vuex";
import { ACTIONS_TYPE as CALENDAR_ACTIONS } from "@/store/modules/calendar";
import { getMaxBookingDays } from "@/utils/dateFormat";
import moment from "moment";
import SelectDropdown from "@/components/share/SelectDropdown";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";

export default {
  name: "CalendarEdit",
  props: {
    itemDate: {
      type: Object,
      required: true
    },
    closeEdit: {
      type: Function,
      required: true
    },
    layouItem: {
      type: Object
    },
    boardId: {
      type: Number,
      default: 0
    },
    mapKey: {
      type: String,
      default: ""
    },
    creation: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    DatePicker,
    SelectDropdown
  },
  inject: ["pageIndex"],
  data() {
    return {
      sales: 0,
      salesIsEmptyPR: false,
      isSalesOpen: true,
      timeDay: "7",
      timeStart: "",
      timeEnd: "",
      textarea: "",
      salesShow: false,
      noteShow: false,
      noteRequiredShow: false,
      boardName: "",
      productId: "",
      productName: "",
      productOptions: [],
      projectName: "",
      detail: {
        customerId: 0,
        projectId: 0,
        createDate: "",
        startDate: "",
        endDate: "",
        canEditDate: true,
        canEditNote: true,
        canEditUsage: true
      },
      modifyReservation: {
        usage: 0,
        deduction: 0
      },
      reservationId: null,
      projectType: 0,
      selectedMarketingProject: "",
      selectedMarketingProjectOptions: [],
      oldPRMarketingProject: "",
      showSalesInput: false,
      exposureProjectCustomerId: null,
      oldPRProjectCustomerId: null
    };
  },
  computed: {
    ...mapState({
      yearMonth: state => state.calendar.yearMonth,
      selectProject: state => state.calendar.selectProject,
      user: state => state.user.user
    }),
    isModify() {
      return !!this.layouItem;
    },
    isBooking() {
      return !!!this.layouItem;
    },
    isPrepare() {
      return (
        this.layouItem.layouData.findIndex(item => item.sourceType === 1) > -1
      );
    }
  },
  mounted() {
    if (this.layouItem) {
      // 有內容是修改
      const { detail } = this.layouItem.layouMap[this.mapKey];
      this.detail = { ...detail };
      this.boardName = detail.boardName;
      this.productId = detail.productId;
      this.productName = detail.productName;
      this.projectName = detail.projectName;
      this.textarea = detail.note;
      if (detail.note) this.noteShow = true;
      this.timeDay = String(detail.days);
      if (detail.projectType == 1) {
        /* 空版PR */
        this.sales =
          this.detail.usage == 0
            ? 2 // 空版PR, 如果是內部反而sales是value=2
            : 1;
      } else {
        this.sales = 0;
        if (detail.usage > 0) this.sales = 1; // usage > 0 => 有銷用，曝光專案
        if (detail.giveaway) this.sales = 2; // giveaway: true => 成效PR
        if (detail.deduction > 0) this.sales = 3; // deduction > 0 => 舊單PR
        if (this.sales > 0) this.openSales();
      }
      this.salesIsEmptyPR = detail.projectType == 1 ? true : false;
      this.projectType = this.detail.projectType;

      this.modifyReservation.usage = detail.usage;
      this.modifyReservation.deduction = detail.deduction;
      this.reservationId = detail.reservationId;
      if (detail.usage !== 0) {
        // 銷用初始化
        this.selectedMarketingProject = detail.usageDescption;
      }
      if (detail.deduction !== 0) {
        // 銷用初始化
        this.oldPRMarketingProject = detail.deductionDescption;
      }
    } else {
      // 沒有內容是新增檔期
      if (this.selectProject.projectStatus == 0) this.isSalesOpen = false;
      this.salesIsEmptyPR = this.selectProject.projectType == 1 ? true : false;
      this.projectType = this.selectProject.projectType;

      //無內容是新增
      this.boardName = this.creation.boardName;
      this.productId = this.creation.productId;
      this.productName = this.creation.productName;
      this.productOptions = this.creation.productOptions;

      // 初始化走期7天，代表加 6 天
      this.syncDuration(7 - 1);
    }
  },
  methods: {
    ...mapActions("reservation", [
      "postReservation",
      "patchReservation",
      "deleteReservation"
    ]),
    ...mapActions({
      _actInsertMonthData: `calendar/${CALENDAR_ACTIONS.INSERT_MONTH_DATA}`,
      _actGetProjectSearch: "project/getProjectSearch"
    }),
    async marketingProjectSuggest(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { _actGetProjectSearch } = this;
        const responseData = await _actGetProjectSearch({
          keyword,
          customerId: this.isBooking
            ? this.selectProject.customerId
            : this.detail.customerId,
          excludeProject: this.isBooking
            ? this.selectProject.projectId
            : this.detail.projectId
        });
        this.selectedMarketingProjectOptions = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
      }
    },
    setSelectedMarketingProject(data) {
      if (data) {
        this.selectedMarketingProject = this.selectedMarketingProjectOptions.find(
          option => option.id === data.id
        ).name;
        this.modifyReservation.usage = data.id;
        this.exposureProjectCustomerId = data.customerId;
      } else {
        this.selectedMarketingProject = "";
        this.modifyReservation.usage = 0;
      }
    },
    setOldPRMarketingProject(data) {
      if (data) {
        this.oldPRMarketingProject = this.selectedMarketingProjectOptions.find(
          option => option.id === data.id
        ).name;
        this.modifyReservation.deduction = data.id;
        this.oldPRProjectCustomerId = data.customerId;
      } else {
        this.oldPRMarketingProject = "";
        this.modifyReservation.deduction = 0;
      }
    },
    setSelectedProduct(data) {
      this.productId = data.id;
      this.productName = data.name;
    },
    // 期間
    getTime(time) {
      this.timeStart = time.searchTimeStart;
      this.timeEnd = time.searchTimeEnd;
    },
    syncDuration(days) {
      // 預約的都是從「+」那天開始重計，有檔期的則依照檔期資料
      const newStart = this.isBooking
        ? `${this.itemDate.year}/${this.itemDate.month}/${this.itemDate.day}`
        : this.detail.startDate;
      const limitedDays =
        getMaxBookingDays(newStart) < days ? getMaxBookingDays(newStart) : days;
      const newEnd = moment(newStart, "YYYY/MM/DD")
        .add(limitedDays, "days")
        .format("YYYY/MM/DD");
      this.detail.startDate = newStart;
      this.detail.endDate = newEnd;
      this.getTime({
        searchTimeStart: newStart,
        searchTimeEnd: newEnd
      });
    },
    changeTimeDay() {
      this.syncDuration(parseInt(this.timeDay) - 1);
    },
    changeSchedule(diffDay) {
      this.timeDay = diffDay;
    },
    showNote() {
      this.noteShow = !this.noteShow;
    },
    openSales() {
      this.salesShow = true;
    },
    modifyCallBack() {
      this._actInsertMonthData({
        pageIndex: this.pageIndex,
        yearMonth: `${this.itemDate.year}-${this.itemDate.month}`
      });
    },
    deleteReserve() {
      this.deleteReservation({ id: this.detail.reservationId }).then(res => {
        this.closeEdit();
        this.modifyCallBack();
      });
    },
    submitModify() {
      if (this.isPrepare) return;
      if (parseInt(this.timeDay) < 1) return;

      if (this.sales == 1 && this.modifyReservation.usage == 0) {
        this.showSalesInput = true;
        return;
        /*
          projectType == 1, 空版PR
            若是選擇企業, 則 autoComplete 不可以是空值。
          projectType == 0, 曝光專案
            usage 不可以為 0
        */
      }

      // 如果是成效 PR 備註 為必填
      if (this.sales == 2 && !this.textarea) {
        this.noteShow = true;
        this.noteRequiredShow = true;
        return;
      }

      if (
        this.projectType == 0 &&
        this.sales == 3 &&
        this.modifyReservation.deduction == 0
      ) {
        this.showSalesInput = true;
        return;
        // 如果是舊單PR, deduction 不可以為 0
      }

      if (this.isBooking) {
        // 如果是預約，就是新增
        if (!this.timeStart || !this.timeEnd) return;
        const payload = {
          projectId: this.selectProject.projectId,
          reservations: [
            {
              boardId: this.boardId,
              giveaway: this.projectType == 1 ? false : this.sales == 2, // projectType == 1 空版
              periods: [
                {
                  start: this.timeStart,
                  end: this.timeEnd
                }
              ],
              productId: this.productId,
              usage: this.sales == 1 ? this.modifyReservation.usage : 0,
              deduction: this.sales == 3 ? this.modifyReservation.deduction : 0,
              note: this.textarea
            }
          ]
        };
        this.postReservation({ ...payload })
          .then(resp => {
            this.closeEdit();
            this.modifyCallBack();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // 如果不是，就是修改
        const payload = {
          // timeStart: null 代表沒有選過，帶入原值。
          startDate: this.timeStart ? this.timeStart : this.detail.startDate,
          endDate: this.timeEnd ? this.timeEnd : this.detail.endDate,
          giveaway: this.projectType == 1 ? false : this.sales == 2,
          note: this.textarea,
          usage: this.sales == 1 ? this.modifyReservation.usage : 0,
          deduction: this.sales == 3 ? this.modifyReservation.deduction : 0,
          productId: this.productId
        };
        this.patchReservation({
          id: this.detail.reservationId,
          ...payload
        })
          .then(resp => {
            this.closeEdit();
            this.modifyCallBack();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 取走期最多幾天(選擇)
    maxBookingDays(timeStart) {
      return getMaxBookingDays(timeStart) + 1;
    },
    // 取走期最多幾天(手輸入)
    getOnInput(timeDay) {
      const maxDay = getMaxBookingDays(this.detail.startDate) + 1;
      this.timeDay =
        Number(timeDay) > maxDay ? String(maxDay) : String(timeDay);
      if (timeDay.length > 3) timeDay = timeDay.slice(0, 3);
    },
    changeGiveaway() {
      this.selectedMarketingProject = "";
      this.oldPRMarketingProject = "";
      this.selectedMarketingProjectOptions = [];
      this.modifyReservation.usage = 0;
      this.exposureProjectCustomerId = null;
      this.oldPRProjectCustomerId = null;
    },
    // 過濾指定符號
    filterValue() {
      this.textarea = utilsFilterSpecifiedSymbols(this.textarea);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/views/calendar/edit";
@import "~scss/mixin/animate";

.button_bg_white_small.delete {
  width: auto;
  padding-left: 20px;
  padding-right: 20px;
  &.not-allowed {
    cursor: not-allowed;
  }
}

@include drop-down-animate;

sup {
  color: #ea475b;
}

.layout_block {
  .layout {
    min-width: 35px;
  }
  .product span {
    width: 343px;
  }
}

.emergency-text {
  font-size: 14px;
  color: #ea475b;
  font-weight: normal;
  margin-bottom: 16px;
}

.calendar-layout-input {
  max-width: 176px;

  &__notify {
    size: 16px;
    line-height: 22px;
    letter-spacing: 1px;
    color: #ea475b;
    font-weight: normal;
  }

  &__drop-down {
    position: absolute;
    right: 24px;
  }
}

.mt10 {
  margin-top: 10px;
}

.date_content {
  &__day-number {
    font-weight: bold !important;
    margin-right: 18px !important;
    margin-left: 18px !important;
  }
}

.confirm {
  color: #ea475b;
  text-align: right;
  font-size: 14px;
}
</style>
