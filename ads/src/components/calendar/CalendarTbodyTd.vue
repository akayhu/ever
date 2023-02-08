<template>
  <td
    :class="{ pointer: canEdit }"
    v-bind="getTDSetting"
    :PR="getPRName"
    @click="openEdit"
  >
    <div
      v-if="getIsStart"
      v-tooltip="{
        offset: 5,
        content: `${getProjectName}-${getUserName}(${layouItem.layouMap[mapKey].detail.projectOwner})`,
        placement: 'bottom-start',
        trigger: 'hover'
      }"
      :style="{ width: getUserNameWidth }"
      class="text"
    >
      <div v-if="isIconShow" class="icon-circle" :BG="getIconBG">
        <div v-if="getReserveStatus >= 2">
          {{ getReserveStatus > 4 ? 3 : getReserveStatus - 1 }}
        </div>
        <icon v-else iconName="calendar-icon-p-w" size="16" />
      </div>
      <span class="text-truncate">{{
        `${getProjectName}-${getUserName}(${layouItem.layouMap[mapKey].detail.projectOwner})`
      }}</span>
    </div>
    <CalendarEdit
      v-if="getPRName && openCalendarEdit && getIsStart && editShow && canEdit"
      :itemDate="monthItem"
      :closeEdit="closeEdit"
      :layouItem="layouItem"
      :mapKey="mapKey"
    />
  </td>
</template>

<script>
import CalendarEdit from "./CalendarEdit.vue";
import { EventBus } from "@/utils/eventBus.js";
import { holiday } from "@/utils/nationalHoliday.js";
import { getSatSunAttr } from "@/utils/dateProcessing.js";
import { mapState } from "vuex";

const position = {
  body: "body",
  foot: "foot"
};

export default {
  name: "CalendarTbodyTd",
  components: {
    CalendarEdit
  },
  props: {
    layouItem: {
      type: Object,
      required: true
    },
    monthItem: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      default: position.body
    },
    mapKey: {
      type: String,
      default: ""
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      openCalendarEdit: false,
      editShow: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.user
    }),
    isIconShow() {
      return (
        this.getReserveStatus >= 2 || this.getIsSelf
        // 下方是檢測:檔期是否大於一天?
        // && this.layouItem.layouMap[this.mapKey].durationInMonth > 1
      );
    },
    getIconBG() {
      // reserveStatus 檔期狀態(-1:緊急下架, 0:備取, 1:正取, 2:已有委刊單, 3:已上素材, 4:已上線, 5:執行完畢),有權限者才能看到1以上
      if (this.getReserveStatus >= 2) {
        const reserveBG = {
          2: "pink", // 已拉 cue
          3: "lavender", // 已上素材
          4: "purple", // 已上線
          5: "purple" // 執行完畢 顯示成 已上線
        };
        return reserveBG[this.getReserveStatus];
      } else {
        const layouStatusBG = {
          prepare: "light-gray", // 預備中
          proposal: "red", // 提案中
          sign_back: "blue", // 合約簽回
          closed: "gray", // 結案
          effect: "green", // 成效 PR
          empty: "yellow" // 空版PR
        };
        return layouStatusBG[this.getPRName];
      }
    },
    getIsSelf() {
      return this.layouItem.layouMap[this.mapKey]
        ? this.layouItem.layouMap[this.mapKey].selfBooking
        : false;
    },
    getReserveStatus() {
      return this.layouItem.layouMap[this.mapKey]
        ? this.layouItem.layouMap[this.mapKey].reserveStatus
        : false;
    },
    getPRName() {
      return this.layouItem.layouMap[this.mapKey]
        ? this.layouItem.layouMap[this.mapKey].layouStatus
        : false;
    },
    getIsStart() {
      return (
        this.layouItem.layouMap[this.mapKey] &&
        this.layouItem.layouMap[this.mapKey].start
      );
    },
    getIsEnd() {
      return (
        this.layouItem.layouMap[this.mapKey] &&
        this.layouItem.layouMap[this.mapKey].end
      );
    },
    getProjectName() {
      return this.layouItem.layouMap[this.mapKey]
        ? this.layouItem.layouMap[this.mapKey].detail.projectName
        : "";
    },
    getUserName() {
      return this.layouItem.layouMap[this.mapKey]
        ? this.layouItem.layouMap[this.mapKey].userName
        : "";
    },
    getDuration() {
      return this.layouItem.layouMap[this.mapKey]
        ? this.layouItem.layouMap[this.mapKey].durationInMonth
        : 0;
    },
    getDateSix() {
      return this.position === position.body ? "six" : "prepareSix";
    },
    getDateDay() {
      return this.position === position.body ? "day" : "prepareDay";
    },
    getDate() {
      return getSatSunAttr(this.monthItem)({
        six: this.getDateSix,
        sun: this.getDateDay
      });
    },
    getHoliday() {
      return holiday[this.mapKey] ? "holiday" : false;
    },
    getTooltipSetting() {
      return {
        effect: "dark",
        placement: "bottom-start",
        content: this.getUserName
      };
    },
    getTDSetting() {
      return {
        date: this.getDate,
        class: [
          { start: this.getIsStart },
          { end: this.getIsEnd },
          { empty_date: !this.monthItem.month },
          this.position
        ],
        nationalHoliday: this.getHoliday,
        duration: this.getDuration
      };
    },
    getUserNameWidth() {
      return `${22 * this.getDuration - 1}px`;
    }
  },
  created() {
    EventBus.$on("closeEdit", () => {
      this.openCalendarEdit = false;
    });
    EventBus.$on("closeEditStyle", () => {
      this.editShow = false;
    });
  },
  methods: {
    // 打開編輯視窗
    openEdit(e) {
      if (this.user.role == 12) return;
      if (!this.getIsSelf && (this.user.role == 11 || this.user.role == 21))
        return;
      if (!this.canEdit) return;

      e.stopPropagation();
      EventBus.$emit("closeMarked");
      EventBus.$emit("closePreview");
      if (!this.openCalendarEdit) {
        EventBus.$emit("closeEditStyle");
        this.openCalendarEdit = true;
      }
      if (!this.editShow) {
        EventBus.$emit("closeEditStyle");
        this.editShow = true;
      }
    },
    // 關閉編輯視窗
    closeEdit() {
      setTimeout(() => {
        EventBus.$emit("closeEditStyle");
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/views/calendar/prstatus";
@import "~scss/views/calendar/status";

td {
  width: 22px;
  height: 20px;
  border: 1px solid #fff;
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
  // td postion relative 在IE好像會有問題, 驗收有發現再看看
  position: relative;
  line-height: 1;
  letter-spacing: 0.56px;
  color: #333;
  background-color: #f1f1f1;

  @each $color, $value in $calendar-prstatus-colors {
    &[PR="#{$color}"] {
      background-color: #{$value} !important;
      border-left: 0;
      border-right: 0;

      &.start {
        border-left: 1px solid #fff;
      }
      &.end {
        border-right: 1px solid #fff;
      }

      &.pointer {
        cursor: pointer;
      }

      .text {
        position: absolute;
        height: 18px;
        z-index: 2;
        top: 0;
        // left: 3px;
        padding-left: 3px;
        width: max-content;
        min-width: 20px;
        display: flex;
        align-items: center;
        min-height: 18px;
        font-size: 12px;
        span {
          transform: scale(0.9);
          transform-origin: left center;
        }

        .zIndex {
          z-index: 1;
        }
      }
    }
  }

  .icon-circle {
    margin-left: -3px;
    margin-right: 4px;
    $min: 18px;
    min-width: $min;
    min-height: $min;
    border-radius: 50%;
    @each $color, $value in $calendar-status-colors {
      &[BG="#{$color}"] {
        background-color: #{$value};
      }
    }
    div {
      font-size: 12px;
      color: #fff;
      line-height: $min;
    }
  }

  &[date="six"],
  &[date="day"],
  &[nationalHoliday="holiday"] {
    background-color: #efecec;
  }
  &[date="prepareSix"],
  &[date="prepareDay"] {
    background-color: #f3f3f7;
  }
  &.empty_date {
    background-color: #e8e8e8;
  }

  &.foot {
    &[date="six"],
    &[date="day"],
    &[date="prepareSix"],
    &[date="prepareDay"],
    &[nationalHoliday="holiday"] {
      background-color: #f3f3f7;
    }
  }
}
</style>
