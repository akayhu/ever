<template>
  <div
    class="calendar_edit_main calendar_marked_main"
    :calendar_edit_main_left="itemDate.day >= 20"
    v-show="markedShow"
    @click.stop
  >
    <div class="calendar_edit_top_title">
      <div></div>
      <div>
        <span class="close" @click.stop="closeMarked()">
          <icon iconName="icon-x-border" />
        </span>
      </div>
    </div>
    <div class="title">行事曆日期備註</div>
    <div class="calendar_edit_middle">
      <div class="date">
        <div class="date_block">
          <div class="date_content">
            日期
          </div>
          <div v-if="nowDay">
            <DatePicker
              :getSearchTime="getTime"
              :schedule="changeSchedule"
              :timeDay="timeDay"
              :dateInterval="[nowDay, nowDay]"
            />
          </div>
        </div>
      </div>
      <div class="note_block">
        <div class="note">
          備註
          <el-input
            type="textarea"
            placeholder="請輸入"
            v-model="textarea"
            @input="filterValue"
            maxlength="200"
            show-word-limit
          />
        </div>
      </div>
    </div>
    <div class="button_content">
      <button class="button_bg_blue_small" @click="createRemark">
        確定
      </button>
    </div>
  </div>
</template>

<script>
import DatePicker from "@/components/DatePicker.vue";
import { EventBus } from "@/utils/eventBus.js";
import { ACTIONS_TYPE as CALENDAR_ACTIONS } from "@/store/modules/calendar";
import { mapActions, mapState } from "vuex";
import { dateFormatter } from "@/utils/dateFormat";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";

export default {
  name: "CalendarMarked",
  props: {
    itemDate: {
      type: Object,
      required: true
    }
  },
  components: {
    DatePicker
  },
  data() {
    return {
      timeDay: "",
      timeStart: "",
      timeEnd: "",
      textarea: "",
      markedShow: false,
      nowDay: ""
    };
  },
  created() {
    EventBus.$on("closeMarked", () => {
      this.markedShow = false;
    });
  },
  computed: {
    ...mapState({
      remarks: state => state.calendar.remarks
    })
  },
  methods: {
    ...mapActions({
      _actCreateRemark: `calendar/${CALENDAR_ACTIONS.CREATE_REMARK}`
    }),
    // 期間
    getTime(time) {
      this.timeStart = time.searchTimeStart;
      this.timeEnd = time.searchTimeEnd;
    },
    changeSchedule(diffDay) {
      this.timeDay = diffDay;
    },
    openMarked() {
      EventBus.$emit("closeMarked");
      EventBus.$emit("closeEditStyle");
      EventBus.$emit("closePreview");
      this.markedShow = true;

      const { remarks, itemDate } = this;
      const nowDay = dateFormatter(
        itemDate.year,
        itemDate.month,
        itemDate.day
      ).replaceAll("-", "/");
      this.nowDay = nowDay;
      this.timeStart = nowDay;
      this.timeEnd = nowDay;
      if (Object.keys(remarks).indexOf(nowDay) !== -1) {
        this.textarea = remarks[nowDay];
      }
    },
    closeMarked() {
      this.markedShow = false;
    },
    createRemark() {
      if (!this.timeStart || !this.timeEnd || !this.textarea) return;
      const payload = {
        description: this.textarea,
        startDate: this.timeStart,
        endDate: this.timeEnd
      };
      this._actCreateRemark(payload).then(() => {
        this.closeMarked();
      });
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

.calendar_edit_main.calendar_marked_main {
  top: -26px;

  &::after {
    background-color: #eee;
    top: 25px;
  }
}
</style>
