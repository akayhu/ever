<template>
  <!-- 版位時間 -->
  <tbody>
    <tr v-for="(layouItem, index) in calendarLayout" :key="index">
      <th>
        <div
          class="row no-gutters align-items-center justify-content-between position-relative"
        >
          <div
            class="col-auto d-flex align-items-center justify-content-center"
          >
            <span class="first">{{ layouItem.layouName }}</span>
          </div>
          <div class="col-auto">
            <span class="last">{{ `${index + 1}/${boardInfo.max}` }}</span>
          </div>
        </div>
      </th>
      <CalendarTbodyTd
        v-for="(monthItem, monthItemIndex) in monthData"
        :key="makeKeyUnique(layouItem, monthItem, `${index}-${monthItemIndex}`)"
        :mapKey="getLayouMapKey(monthItem)"
        :monthItem="monthItem"
        :layouItem="layouItem"
        :canEdit="boardInfo.canEdit"
      />
    </tr>
  </tbody>
</template>

<script>
import CalendarTbodyTd from "./CalendarTbodyTd.vue";
import { dateFormatter } from "@/utils/dateFormat";
import { mapActions, mapGetters, mapState } from "vuex";
import { ACTIONS_TYPE as CALENDAR_ACTIONS } from "@/store/modules/calendar";
import {
  ACTIONS_TYPE as ORDER_ACTIONS_TYPE,
  GETTERS_TYPE as ORDER_GETTERS_TYPE
} from "@/store/modules/order";

export default {
  name: "CalendarTbody",
  components: {
    CalendarTbodyTd
  },
  props: {
    monthData: {
      type: Array,
      required: true
    },
    calendarLayout: {
      type: Array,
      required: true
    },
    channelInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    boardIndex: {
      type: Number,
      required: 0
    },
    boardInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    boardsIds: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    ...mapState({
      boardPreviewData: state => state.calendar.boardPreviewData,
      device: state => state.calendar.device
    }),
    ...mapGetters({
      getCurrentBoards: `order/${ORDER_GETTERS_TYPE.GET_CURRENT_BOARDS}`
    })
  },
  methods: {
    ...mapActions({
      _actGetPreviewData: `calendar/${CALENDAR_ACTIONS.GET_PREVIEW_DATA}`,
      _actGetBoards: `order/${ORDER_ACTIONS_TYPE.GET_BOARDS}`
    }),
    makeKeyUnique(layouItem, monthItem, defaultKey) {
      // 編輯儲存後後端會換掉 reservationId
      return layouItem.layouMap[this.getLayouMapKey(monthItem)]
        ? `rId-${
            layouItem.layouMap[this.getLayouMapKey(monthItem)].detail
              .reservationId
          }-${defaultKey}`
        : defaultKey;
    },
    getLayouMapKey(monthItem) {
      return dateFormatter(monthItem.year, monthItem.month, monthItem.day);
    }
  }
};
</script>

<style lang="scss" scoped>
th {
  width: 194px;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.67px;
  color: #a9a9a9;
  vertical-align: middle;
  text-align: left;
  font-weight: normal;
  border-bottom: solid 1px #e2e1e1;
  cursor: pointer;

  .first {
    color: #333;
    line-height: 16px;
  }

  .last {
    margin-right: 8px;
    font-weight: normal;
    letter-spacing: 1.5px;
  }
}
</style>
