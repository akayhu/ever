<template>
  <td
    :class="getIsExpire ? 'slash' : !monthItem.month ? 'empty_date' : ''"
    @click="openEdit"
  >
    <CalendarEdit
      v-if="!getIsExpire && openCalendarEdit && editShow"
      :itemDate="monthItem"
      :closeEdit="closeEdit"
      :creation="creation"
      :boardId="boardId"
    />
    <div v-if="monthItem.month" :class="getIsExpire ? 'slash' : 'add'">
      {{ !getIsExpire ? "+" : "" }}
    </div>
  </td>
</template>

<script>
import CalendarEdit from "./CalendarEdit.vue";
import { EventBus } from "@/utils/eventBus.js";
import { dateFormatter } from "@/utils/dateFormat";
import moment from "moment";
import { mapActions, mapState } from "vuex";

export default {
  name: "CalendarTfootBookingTd",
  data() {
    return {
      openCalendarEdit: false,
      editShow: false,
      creation: {}
    };
  },
  props: {
    monthItem: {
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
    boardName: {
      type: String,
      required: true
    },
    boardId: {
      type: Number,
      required: true
    },
    canEdit: {
      type: Boolean,
      required: true
    }
  },
  components: {
    CalendarEdit
  },
  created() {
    EventBus.$on("closeEdit", () => {
      this.openCalendarEdit = false;
    });
    EventBus.$on("closeEditStyle", () => {
      this.editShow = false;
    });
  },
  computed: {
    ...mapState({
      selectProject: state => state.calendar.selectProject
    }),
    getIsExpire() {
      return (
        moment(
          dateFormatter(
            this.monthItem.year,
            this.monthItem.month,
            this.monthItem.day
          )
        ).isBefore(
          moment(dateFormatter(this.todayYear, this.todayMonth, this.todayDay))
        ) || !this.canEdit
      );
    }
  },
  methods: {
    ...mapActions("product", ["getProductBoardSuggest"]),
    openEdit(e) {
      if (!this.canEdit) return;
      if (!this.selectProject?.value) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        EventBus.$emit("focusAutoComplete");
        EventBus.$emit("focusAutoCompleteMessage");
        return;
      }
      // 打開編輯視窗
      e.stopPropagation();
      this.getProductBoardSuggest({
        keyword: this.boardName,
        checkPermission: false
      }).then(resp => {
        const boardInfo = resp.filter(x => x.boardId == this.boardId)[0];
        this.creation = {
          boardName: boardInfo.name,
          productId: boardInfo.productList[0].id,
          productName: boardInfo.productList[0].name,
          productOptions: boardInfo.productList.map(product => ({
            ...product,
            value: product.id,
            label: product.name
          }))
        };
        if (!this.openCalendarEdit) {
          EventBus.$emit("closeEditStyle");
          this.openCalendarEdit = true;
        }

        if (!this.editShow) {
          EventBus.$emit("closeEditStyle");
          this.editShow = true;
        }
      });
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
td {
  width: 20px;
  height: 20px;
  border: 1px solid #fff;
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
  position: relative;
  line-height: 1;
  letter-spacing: 0.56px;
  background-color: #e8e8e8;
  color: #fff;
  cursor: pointer;

  &.slash {
    cursor: initial;
  }

  &.empty_date {
    background-color: #e8e8e8;
  }

  div {
    &.slash {
      height: 0px;
      border: 1px solid #c2c2c2;
      width: 23px;
      transform: rotate(140deg);
      -o-transform: rotate(140deg);
      -moz-transform: rotate(140deg);
      -webkit-transform: rotate(140deg);
      position: absolute;
      top: 8px;
      left: -1px;
      cursor: initial;
    }

    &.add {
      width: 20px;
      height: 16px;
      line-height: 16px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
