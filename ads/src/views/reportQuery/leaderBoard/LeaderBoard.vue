<template>
  <div class="leader_report">
    <div class="leader_report_wrapper_title">成效排行榜</div>

    <section class="leader_report_panel_control panel_control">
      <h2 class="mb-6">查詢成效排行榜</h2>
      <div class="controller">
        <!-- 選擇區間 -->
        <div class="controller_item mt-6">
          <div>選擇區間</div>
          <div class="date_picker position-relative">
            <DatePicker
              ref="date_picker"
              :dateInterval="[selectedDate.start, selectedDate.end]"
              :getSearchTime="setSelectedDate"
              :selectedDateAfter="false"
            />
          </div>
        </div>
        <!-- 選擇版位 -->
        <div class="controller_item mt-6">
          <div>選擇版位</div>
          <div class="select_dropdown position-relative">
            <SelectDropdown
              value=""
              :disabled="!isBoardDropDownSelectable"
              :filterable="true"
              :remote="true"
              :hasIcon="true"
              :options="searchedBoardOptions"
              :placeholder="'請選擇---'"
              :asncSearchCb="boardSuggestSearch"
              :type="'GetFilterBoardSuggest'"
              @value-changed="
                updateSearchedResult($event, 'searchedBoard', 'add')
              "
              @set-history-record="searchedBoardOptions = $event"
            />
          </div>
        </div>
        <div
          v-if="searchedBoard.length > 0"
          class="selected_position_group d-flex flex-wrap"
        >
          <div
            ref="positionGroup"
            class="selected_position d-flex justify-content-center align-items-center px-2"
            v-for="(board, index) in searchedBoard"
            :key="index"
            @click="updateSearchedResult(board.id, 'searchedBoard', 'remove')"
          >
            <span>{{ board.name }}</span>
            <icon iconName="icon-16-delete-icon-delete-green" size="16" />
          </div>
        </div>
        <!-- 選擇企業 -->
        <div class="controller_item mt-6">
          <div>選擇企業</div>
          <div class="select_dropdown position-relative">
            <SelectDropdown
              value=""
              :disabled="!isCompanyDropDownSelectable"
              :filterable="true"
              :remote="true"
              :hasIcon="true"
              :options="searchedCompanyOptions"
              :placeholder="'請選擇---'"
              :asncSearchCb="companySuggestSearch"
              :type="'getFilterCustomerSuggest'"
              @value-changed="
                updateSearchedResult($event, 'searchedCompany', 'add')
              "
              @set-history-record="searchedCompanyOptions = $event"
            />
          </div>
        </div>
        <div
          v-if="searchedCompany.length > 0"
          class="selected_position_group d-flex flex-wrap"
        >
          <div
            ref="positionGroup"
            class="selected_position d-flex justify-content-center align-items-center px-2"
            v-for="(company, index) in searchedCompany"
            :key="index"
            @click="
              updateSearchedResult(company.id, 'searchedCompany', 'remove')
            "
          >
            <span> {{ company.name }} </span>
            <icon iconName="icon-16-delete-icon-delete-green" size="16" />
          </div>
        </div>
        <!-- 送出 -->
        <div class="button_block">
          <button
            class="button_bg_blue_large"
            :disabled="!isSubmitAble"
            @click="submit(false)"
          >
            確定
          </button>
        </div>
      </div>
    </section>
    <!-- 比較欄位 -->
    <section v-if="isTableShow" class="leader_report_query_table mt-6">
      <leader-board-table :defaultTab="defaultTab" />
      <GoTop />
    </section>
  </div>
</template>

<script>
import LeaderBoardTable from "./LeaderBoardTable.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import {
  stringifyObjQuery,
  stringifyAryQuery,
  parseAryQuery,
  parseObjQuery
} from "@/utils/queryString";
import { MUTATIONS_TYPE } from "@/store/modules/report/leaderBoard";
import { createNamespacedHelpers } from "vuex";
import moment from "moment";
import {
  apiGetFilterBoardSuggest,
  apiGetFilterCustomerSuggest
} from "@/apis/report";
import GoTop from "@/components/GoTop.vue";
const { mapMutations } = createNamespacedHelpers("report/leaderBoard");

export default {
  name: "LeaderBoard",
  data() {
    return {
      selectedDate: { start: "", end: "" },
      searchedBoard: [],
      searchedCompany: [],
      searchedBoardOptions: [],
      searchedCompanyOptions: [],
      defaultTab: "",
      isTableShow: false
    };
  },
  components: {
    DatePicker,
    SelectDropdown,
    LeaderBoardTable,
    GoTop
  },
  created() {
    this.selectedDate = {
      end: moment(new Date()).format("YYYY/MM/DD"),
      start: moment(new Date())
        .subtract(29, "days")
        .format("YYYY/MM/DD")
    };
  },
  mounted() {
    if (this.$route.query.searchedBoard && this.$route.query.selectedDate) {
      this.searchedBoard = parseAryQuery(this.$route.query.searchedBoard);
      if (this.$route.query.searchedCompany) {
        this.searchedCompany = parseAryQuery(this.$route.query.searchedCompany);
      }
      this.selectedDate = parseObjQuery(this.$route.query.selectedDate);
      this.defaultTab = this.$route.query.currentTab;
      this.$refs["date_picker"].dateValue = [
        this.selectedDate.start,
        this.selectedDate.end
      ];
      this.submit(true);
    }
  },
  beforeDestroy() {
    this.resetPageState();
  },
  computed: {
    isBoardDropDownSelectable() {
      return (
        this.selectedDate.start &&
        this.selectedDate.end &&
        this.searchedBoard.length < 5
      );
    },
    isCompanyDropDownSelectable() {
      return (
        this.selectedDate.start &&
        this.selectedDate.end &&
        this.searchedCompany.length < 5
      );
    },
    isSubmitAble() {
      return (
        this.selectedDate.start &&
        this.selectedDate.end &&
        this.searchedBoard.length > 0
      );
    }
  },
  methods: {
    ...mapMutations({
      updateSelectedDate: MUTATIONS_TYPE.UPDATE_SELECTED_DATE,
      updateSelectedBoard: MUTATIONS_TYPE.UPDATE_SELECTED_BOARD,
      updateSelectedCompany: MUTATIONS_TYPE.UPDATE_SELECTED_COMPANY,
      uppdateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING,
      resetPageState: MUTATIONS_TYPE.RESET_PAGE_STATE
    }),
    updateSearchedResult(selectedId, updatedKey, type) {
      const action =
        type === "add" ? this.addSearchedResult : this.delSearchedResult;
      const optionKey =
        updatedKey === "searchedBoard"
          ? "searchedBoardOptions"
          : "searchedCompanyOptions";
      action(selectedId, updatedKey, optionKey);
    },
    addSearchedResult(selectedId, updatedKey, optionKey) {
      const findVal = this[optionKey].find(item => item.id === selectedId);
      if (findVal) {
        const updateVal = {
          name: findVal.label,
          id: findVal.id
        };
        if (updatedKey === "searchedBoard") updateVal.device = findVal.device;
        this[updatedKey] = this[updatedKey]
          .concat(updateVal)
          .reduce((acc, item) => {
            if (acc.map(accItem => accItem.id).indexOf(item.id) === -1)
              acc.push(item);
            return acc;
          }, []);
      }
      this[optionKey] = [];
    },
    delSearchedResult(selectedId, updatedKey) {
      this[updatedKey] = this[updatedKey].filter(
        item => item.id !== selectedId
      );
    },
    setSelectedDate(time) {
      const { searchTimeStart: start, searchTimeEnd: end } = time;
      this.selectedDate = { start, end };
      this.searchedBoardOptions = [];
      this.searchedCompanyOptions = [];
    },
    async boardSuggestSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        try {
          const {
            selectedDate: { start, end }
          } = this;
          const {
            data: { response: responseData }
          } = await apiGetFilterBoardSuggest({ start, end, keyword });
          this.searchedBoardOptions = [...responseData].map(item => {
            return {
              ...item,
              value: item.id,
              label: `${item.device}/${item.channelName}/${item.name}`
            };
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    async companySuggestSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        try {
          const {
            selectedDate: { start, end }
          } = this;
          const {
            data: { response: responseData }
          } = await apiGetFilterCustomerSuggest({ start, end, keyword });
          this.searchedCompanyOptions = [...responseData].map(item => {
            return {
              ...item,
              value: item.id,
              label: `${item.name}(${item.id})`
            };
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    updateQuery() {
      this.defaultTab = this.$route.query.currentTab
        ? this.$route.query.currentTab
        : "TabBoardCompare";
      const query = {
        searchedBoard: stringifyAryQuery(this.searchedBoard),
        selectedDate: stringifyObjQuery(this.selectedDate),
        currentTab: this.defaultTab
      };
      if (this.searchedCompany.length > 0) {
        query.searchedCompany = stringifyAryQuery(this.searchedCompany);
      }
      this.$router
        .push({
          path: "leaderboard",
          query
        })
        .catch(() => {});
    },
    submit(ignoreUpdateQuery = false) {
      if (!this.isSubmitAble) return;
      if (this.isTableShow) this.uppdateIsLoading(true);
      this.updateSelectedDate({
        start: this.selectedDate.start,
        end: this.selectedDate.end
      });
      this.updateSelectedBoard(this.searchedBoard);
      this.updateSelectedCompany(this.searchedCompany);
      if (!ignoreUpdateQuery) this.updateQuery();
      if (!this.isTableShow) this.isTableShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "../reportQuery.scss";

.leader_report_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}

.leader_report {
  // 控制面板
  &_panel_control {
    @include font-common(16px);

    .controller_item {
      &:not(:last-child) {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        > div:nth-child(2) {
          margin-left: 28px;
        }
      }

      .select_dropdown {
        cursor: pointer;
        width: 480px;
      }
    }

    .button_block {
      margin-top: 24px;
      text-align: center;
    }
  }
  // 已選擇版位
  .selected_position_group {
    margin-left: 96px;
    max-width: 480px;

    .selected_position {
      @include font-common(14px, $font-weight-normal, $primary);
      min-width: 136px;
      min-height: 24px;
      border-radius: 16.5px;
      background-color: #e6f9fa;
      cursor: pointer;
      margin: 10px 4px 0 0;
      font-weight: bold;

      img {
        margin-left: 2px;
      }
    }
  }
}
</style>
