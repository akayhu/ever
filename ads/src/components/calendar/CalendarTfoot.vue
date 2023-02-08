<template>
  <!-- 備取內容 -->
  <tbody>
    <tr class="first-child">
      <th>
        <div class="row no-gutters justify-content-between align-items-center">
          <div class="col-auto">備取</div>
          <div class="col-auto">
            <icon class="" iconName="icon-person-3" size="20" />
            <icon
              class="drop-down"
              :class="{ 'drop-down-active': prepareRowShow }"
              @click.native="showPrepare()"
              iconName="arrow-drop-down"
              size="20"
            />
          </div>
        </div>
      </th>
      <CalendarTfootPrepare
        v-for="(monthItem, prepareIndex) in monthData"
        :key="prepareIndex"
        :monthItem="monthItem"
        :readySlot="readySlot"
      />
    </tr>
    <tr
      v-for="(layouItem, index) in prepareInformation"
      :key="index"
      v-show="prepareRowShow"
    >
      <th></th>
      <CalendarTfootTd
        v-for="(monthItem, monthItemIndex) in monthData"
        :key="makeKeyUnique(layouItem, monthItem, `${index}-${monthItemIndex}`)"
        :mapKey="getLayouMapKey(monthItem)"
        position="foot"
        :monthItem="monthItem"
        :monthItemIndex="monthItemIndex"
        :layouItem="layouItem"
        :canEdit="boardInfo.canEdit"
      />
    </tr>
    <tr>
      <th></th>
      <CalendarTfootBookingTd
        v-for="(monthItem, bookingIndex) in monthData"
        :monthItem="monthItem"
        :key="bookingIndex"
        :todayYear="todayYear"
        :todayMonth="todayMonth"
        :todayDay="todayDay"
        :boardName="boardInfo.boardName"
        :boardId="boardInfo.boardId"
        :canEdit="boardInfo.canEdit"
      />
    </tr>
  </tbody>
</template>

<script>
import CalendarTfootPrepare from "./CalendarTfootPrepare.vue";
import CalendarTfootTd from "./CalendarTbodyTd.vue";
import CalendarTfootBookingTd from "./CalendarTfootBookingTd.vue";
import { dateFormatter } from "@/utils/dateFormat";

export default {
  name: "CalendarTfoot",
  props: {
    monthData: {
      type: Array,
      required: true
    },
    prepareInformation: {
      type: Array,
      required: true
    },
    readySlot: {
      type: Object,
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
    mapKey: {
      type: String,
      default: ""
    }
  },
  provide() {
    return {
      boardIndex: this.boardIndex
    };
  },
  data() {
    return {
      prepareRowShow: false
    };
  },
  components: {
    CalendarTfootPrepare,
    CalendarTfootTd,
    CalendarTfootBookingTd
  },
  methods: {
    showPrepare() {
      this.prepareRowShow = !this.prepareRowShow;
    },
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
@import "~scss/mixin/animate";

tr {
  th {
    background-color: #fff;
    border-bottom: 0;
    width: 194px;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.67px;
    color: #333;
    vertical-align: middle;
    text-align: left;
    font-weight: normal;
  }

  &.first-child {
    th {
      background-color: #d2f2f4;
    }
  }
}

@include drop-down-animate;
</style>
