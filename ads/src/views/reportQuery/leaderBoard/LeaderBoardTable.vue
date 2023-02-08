<template>
  <div ref="leader_board_table" id="leader_board_table">
    <div class="switch_tabs">
      <switch-tabs
        :value="currentTab"
        :tabs-data="tabsData"
        :style-type="'secondary'"
        @select-tab="changeTabValue"
      />
    </div>
    <!-- table -->
    <template>
      <div class="loading" v-show="isLoading">
        <Loading />
      </div>
      <component
        v-show="!isLoading"
        :is="currentTab"
        :tableName="currentTab"
        @pageChange="pageChange"
      />
    </template>
  </div>
</template>

<script>
import SwitchTabs from "@/components/share/SwitchTabs";
import TabCompanyCompare from "./TabCompanyCompare";
import TabMaterialCompare from "./TabMaterialCompare";
import TabBoardCompare from "./TabBoardCompare";
import TabBoardByDayCompare from "./TabBoardByDayCompare";
import Loading from "@/components/Loading";
import { tabsData } from "@/utils/report/leaderBoard/util";
import { createNamespacedHelpers } from "vuex";
import {
  ACTIONS_TYPE,
  GETTERS_TYPE,
  MUTATIONS_TYPE
} from "@/store/modules/report/leaderBoard";
const {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} = createNamespacedHelpers("report/leaderBoard");

const watchList = [
  "report/leaderBoard/" + MUTATIONS_TYPE.UPDATE_SELECTED_DATE,
  "report/leaderBoard/" + MUTATIONS_TYPE.UPDATE_SELECTED_BOARD,
  "report/leaderBoard/" + MUTATIONS_TYPE.UPDATE_SELECTED_COMPANY
];

let unsubscribe = null;

let timer = null;

export default {
  name: "LeaderBoardTable",
  props: {
    defaultTab: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      currentTab: "",
      tabsData
    };
  },
  components: {
    SwitchTabs,
    TabCompanyCompare,
    TabMaterialCompare,
    TabBoardCompare,
    TabBoardByDayCompare,
    Loading
  },
  mounted() {
    this.currentTab = this.defaultTab ? this.defaultTab : tabsData[0].key;
    unsubscribe = this.$store.subscribe(mutation => {
      if (watchList.indexOf(mutation.type) > -1) {
        //debounce for mutilple match mutation
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.getTableData(this.currentTab);
        }, 0);
      }
    });
  },
  beforeDestroy() {
    unsubscribe();
  },
  computed: {
    ...mapState({
      selectedDate: state => state.selectedDate,
      isLoading: state => state.isLoading,
      selectedBoard: state => state.selectedBoard,
      selectedCompany: state => state.selectedCompany,
      isBoardCompareFetched: state => state.boardCompare.isFetched,
      isMaterialCompareFetched: state => state.materialCompare.isFetched,
      isCompanyCompareFetched: state => state.companyCompare.isFetched,
      isBoardByDayCompareFetched: state => state.boardByDayCompare.isFetched
    }),
    ...mapGetters({
      weekStartToEnd: GETTERS_TYPE.GET_WEEK_START_TO_END,
      isBoardCompareQueryUpdated:
        GETTERS_TYPE.GET_IS_BOARD_COMPARE_QUERY_UPDATED,
      isMaterialCompareQueryUpdated:
        GETTERS_TYPE.GET_IS_MATERIAL_COMPARE_QUERY_UPDATED,
      isCompanyCompareQueryUpdated:
        GETTERS_TYPE.GET_IS_COMPANY_COMPARE_QUERY_UPDATED,
      isBoardByDayQueryUpdated:
        GETTERS_TYPE.GET_IS_BOARD_BY_DAY_COMPARE_QUERY_UPDATED
    })
  },
  methods: {
    ...mapMutations({
      uppdateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING
    }),
    ...mapActions({
      getBoardByDayCompare: ACTIONS_TYPE.GET_BOARD_BY_DAY_COMPARE,
      getBoardByDayCompareSummary:
        ACTIONS_TYPE.GET_BOARD_BY_DAY_COMPARE_SUMMARY,
      getBoardCompare: ACTIONS_TYPE.GET_BOARD_COMPARE,
      getCompanyCompare: ACTIONS_TYPE.GET_COMPANY_COMPARE,
      getMaterialCompare: ACTIONS_TYPE.GET_MATERIAL_COMPARE
    }),
    changeTabValue(tab) {
      let tabValue = tab.key;
      this.currentTab = tabValue;
      this.$router
        .push({
          path: "leaderboard",
          query: {
            ...this.$route.query,
            currentTab: tabValue
          }
        })
        .catch(error => {});
    },
    async getTableData(tab) {
      if (!this.isLoading) this.uppdateIsLoading(true);
      try {
        switch (tab) {
          case "TabBoardCompare":
            if (
              !this.isBoardCompareFetched ||
              this.isBoardCompareQueryUpdated
            ) {
              await this.getBoardCompare({
                page: 1,
                filter: {
                  sort: {
                    type: "impression",
                    orderBy: "DESC"
                  }
                }
              });
            }
            break;
          case "TabCompanyCompare":
            if (
              !this.isCompanyCompareFetched ||
              this.isCompanyCompareQueryUpdated
            ) {
              await this.getCompanyCompare({
                page: 1,
                filter: {
                  sort: {
                    type: "impression",
                    orderBy: "DESC"
                  },
                  duration: {
                    start: this.weekStartToEnd[0].start,
                    end: this.weekStartToEnd[0].end
                  }
                }
              });
            }
            break;
          case "TabMaterialCompare":
            if (
              !this.isMaterialCompareFetched ||
              this.isMaterialCompareQueryUpdated
            ) {
              await this.getMaterialCompare({
                page: 1,
                filter: {
                  sort: {
                    type: "impression",
                    orderBy: "DESC"
                  },
                  duration: {
                    start: this.weekStartToEnd[0].start,
                    end: this.weekStartToEnd[0].end
                  }
                }
              });
            }
            break;
          case "TabBoardByDayCompare":
            if (
              !this.isBoardByDayCompareFetched ||
              this.isBoardByDayQueryUpdated
            ) {
              await this.getBoardByDayCompareSummary({
                filter: {
                  board: {
                    id: this.selectedBoard[0].id
                  }
                }
              });
              await this.getBoardByDayCompare({
                page: 1,
                filter: {
                  board: {
                    id: this.selectedBoard[0].id,
                    device: this.selectedBoard[0].device
                  }
                }
              });
            }
            break;
          default:
            break;
        }
        this.uppdateIsLoading(false);
      } catch (e) {
        console.log(e);
        this.uppdateIsLoading(false);
      }
    },
    pageChange() {
      const headerAndNavHegiht = 70;
      const margin = 20;
      const padding = 20;
      const top =
        this.$refs["leader_board_table"].getBoundingClientRect().top +
        window.pageYOffset -
        (headerAndNavHegiht + margin + padding);
      window.scrollTo({ top });
    }
  },
  watch: {
    currentTab(newVal) {
      this.getTableData(newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

#leader_board_table {
  min-width: 900px;
}

.report_summary {
  //廣告區間
  .date_duration {
    @include font-common(16px, $font-weight-bold);

    .detail_date {
      margin-left: 26px;
      color: $blue-text;

      .date_tilde {
        font-weight: normal;
      }
    }
    .total_days {
      @include font-common(16px, $font-weight-normal, $gray-700);
    }
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}
</style>
