<template>
  <div>
    <div class="proofs_wrapper_title">廣告上刊管理</div>

    <section class="proofs_wrapper">
      <h2 class="mb-6">廣告樣張</h2>

      <div class="ad_date">
        <label>日期</label>
        <span>
          <DatePicker
            ref="date_picker"
            :dateInterval="[dateInterval.start, dateInterval.end]"
            :getSearchTime="getTime"
            :thisWeekAndNextTwoWeeks="true"
            :maxDay="7"
          />
        </span>
      </div>

      <div class="ad_interval">
        <label>廣告單日</label>
        <SingleDateSelector
          :limitStartDate="thisWeekStartDate"
          :limitEndDate="nextWeekEndDate"
          :startDate="dateInterval.start"
          :endDate="dateInterval.end"
          :selectedDate="selectedDate"
          @changeDate="changeDate"
          @changeWeek="updateCurrentWeek"
        >
          <icon
            class="ml-1"
            iconName="icon-info-warmgray"
            size="16"
            v-tooltip="{
              offset: 5,
              content: '時間可依週切換，點選單日可觀看數據',
              placement: 'right',
              trigger: 'hover'
            }"
          />
        </SingleDateSelector>
      </div>

      <SwitchDevices
        @changeDevice="resetBoardInfo"
        @changeChannel="getChannelInfo"
        @changeBoard="selectBoard"
        @reset="resetBoardInfo"
        :canActiveBoards="false"
        :boardsFromData="boardsInfo"
      ></SwitchDevices>

      <div v-show="isLoading" class="loading">
        <Loading />
      </div>

      <div class="preview" v-if="!isLoading && showPreviewContent">
        <template v-if="proofPreviewData.length > 0">
          <div class="preview_title">預覽廣告</div>
          <ProofsBlock
            :ref="`board_${proof[0].boardId}`"
            v-for="proof in boards"
            :key="proof[0].id"
            :proof="proof"
          />
        </template>
        <div v-else class="no_data">該頻道目前無樣張</div>
      </div>

      <GoTop />
    </section>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters, mapMutations, mapActions } from "vuex";
import DatePicker from "@/components/DatePicker.vue";
import SwitchDevices from "@/components/share/SwitchDevices.vue";
import Loading from "@/components/Loading.vue";
import ProofsBlock from "@/components/proofs/ProofsBlock.vue";
import GoTop from "@/components/GoTop.vue";
import SingleDateSelector from "@/components/SingleDateSelector.vue";
import { MUTATIONS_TYPE } from "@/store/modules/proof";

const FORMAT_STRING = "YYYY/MM/DD";

export default {
  name: "Proofs",
  components: {
    DatePicker,
    SwitchDevices,
    Loading,
    ProofsBlock,
    GoTop,
    SingleDateSelector
  },
  data() {
    return {
      today: moment(new Date()),
      thisWeekStartDate: moment(new Date()).startOf("isoweek"),
      nextWeekEndDate: moment(new Date())
        .add(2, "weeks")
        .endOf("isoweek"),
      dateInterval: { start: "", end: "" },
      selectedDate: "",
      channelInfo: {},
      device: {},
      isLoading: false
    };
  },
  created() {
    this.initDate();
  },
  computed: {
    ...mapGetters("proof", ["proofPreviewData"]),
    dates() {
      return this.getDates();
    },
    weekNumber() {
      return moment(this.dateInterval.start, FORMAT_STRING).isoWeek();
    },
    showPreviewContent() {
      return this.selectedDate && Object.keys(this.channelInfo).length > 0;
    },
    boards() {
      let boardClassification = this.proofPreviewData.reduce((acc, curr) => {
        if (acc.length < 1) {
          acc.push([curr]);
        } else {
          for (let i = 0; i < acc.length; i++) {
            if (acc[i][0].boardId === curr.boardId) {
              acc[i].push(curr);
            }
          }
          if (acc[acc.length - 1][0].boardId !== curr.boardId) {
            acc.push([curr]);
          }
        }

        return acc;
      }, []);
      return boardClassification;
    },
    boardsInfo() {
      return this.boards.map(boards => {
        return {
          device: boards[0].device,
          channelId: boards[0].channelId,
          channelName: boards[0].channelName,
          boardId: boards[0].boardId,
          boardName: boards[0].boardName
        };
      });
    }
  },
  methods: {
    ...mapActions("proof", ["getProofPreview"]),
    ...mapMutations("proof", {
      updatePreviewData: MUTATIONS_TYPE.UPDATE_PROOF_PRVIEW
    }),
    initDate() {
      const today = moment();
      this.dateInterval = {
        end: today
          .clone()
          .endOf("isoweek")
          .format(FORMAT_STRING),
        start: today
          .clone()
          .startOf("isoweek")
          .format(FORMAT_STRING)
      };
      if (this.$route.query.selectedDate)
        this.selectedDate = this.$route.query.selectedDate;
      else this.selectedDate = today.format(FORMAT_STRING);
    },
    getTime(time) {
      this.dateInterval.start = time.searchTimeStart;
      this.dateInterval.end = time.searchTimeEnd;
    },
    getDates() {
      let result = [];
      const start = moment(this.dateInterval.start);
      const end = moment(this.dateInterval.end);
      const diff = end.diff(start, "days");
      for (let i = 0; i <= diff; i++) {
        result.push(start.format(FORMAT_STRING));
        start.add(1, "day");
      }
      return result;
    },
    changeDate(day) {
      this.selectedDate = day;
      this.getProof();
    },
    updateCurrentWeek(type) {
      const start = moment(this.dateInterval.start);
      const newWeek =
        type === "prev"
          ? start.clone().subtract(1, "weeks")
          : start.clone().add(1, "weeks");

      let newStartDate = newWeek.clone().startOf("isoweek");
      let newEndDate = newWeek.clone().endOf("isoweek");

      if (newStartDate > this.nextWeekEndDate)
        newStartDate = this.nextWeekEndDate;
      else if (newStartDate < this.thisWeekStartDate)
        newStartDate = this.thisWeekStartDate;

      if (newEndDate > this.nextWeekEndDate) newEndDate = this.nextWeekEndDate;
      else if (newEndDate < this.thisWeekStartDate)
        newEndDate = this.thisWeekStartDate;

      this.dateInterval.start = newStartDate.format(FORMAT_STRING);
      this.dateInterval.end = newEndDate.format(FORMAT_STRING);

      this.selectedDate = "";
      this.$refs["date_picker"].dateValue = [
        this.dateInterval.start,
        this.dateInterval.end
      ];
      this.changeDate(this.dateInterval.start);
    },
    resetBoardInfo(device) {
      if (device) this.device = device;
      this.channelInfo = {};
      this.updatePreviewData([]);
    },
    getChannelInfo({ channel }) {
      this.channelInfo = channel;
      this.getProof();
    },
    async getProof() {
      if (this.channelInfo.channelId && this.selectedDate) {
        this.isLoading = true;
        const params = {
          channelId: this.channelInfo.channelId,
          publishDate: this.selectedDate
        };
        await this.getProofPreview(params);
        this.isLoading = false;

        this.$router
          .push({
            path: "proofs",
            query: {
              selectedDate: this.selectedDate,
              device: this.device,
              siteId: this.channelInfo.siteId,
              channelId: this.channelInfo.channelId
            }
          })
          .catch(() => {});
      }
    },
    selectBoard(board) {
      const el = document.querySelector(`#${board.device}_${board.boardId}`);
      if (!el) return;

      this.$refs[`board_${board.boardId}`][0].openCollaspe();
      this.$nextTick(function() {
        window.scrollTo({
          top: el.offsetTop - 70,
          behavior: "smooth"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.proofs_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.proofs_wrapper {
  line-height: 1.38;
  letter-spacing: 1.38px;

  .ad_date,
  .ad_interval {
    label {
      width: 70px;
      margin-right: 28px;
      margin-bottom: 24px;
    }

    span {
      font-weight: bold;
      color: #00b2ba;
      cursor: pointer;

      .date {
        padding: 4px;

        &.focus {
          background-color: #e1fafa;
        }
      }

      .comma {
        color: #333;
      }
    }
  }

  .preview {
    margin-top: 16px;
    color: #2d2d2d;

    .preview_title {
      font-weight: bold;
      margin-bottom: 24px;
    }
  }

  .no_data {
    text-align: center;
    margin: 60px 0;
    color: #ea475b;
  }
}
</style>
