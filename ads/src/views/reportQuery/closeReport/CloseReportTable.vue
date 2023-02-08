<template>
  <div ref="close_report_table" id="close_report_table">
    <template v-if="!isHeaderLoading">
      <div class="table_header">
        <span class="company_name">{{ projectSummary.customerName }}</span>
        <span> 廣告成效報告</span>
      </div>
      <div class="report_summary mt-6">
        <div class="date_duration">
          <span>廣告區間</span>
          <span class="detail_date">
            <span class="start_date">{{ projectSummary.startDate }}</span>
            <span class="date_tilde mx-2">~</span>
            <span class="end_date">{{ projectSummary.endDate }}</span>
          </span>
          <span class="total_days ml-2">(共 {{ projectSummary.days }} 天)</span>
        </div>
        <div class="advertising_amount mt-6">
          <span>廣告金額</span>
          <span class="total_amount">{{
            projectSummary.price | numberCommaFormat
          }}</span>
          <span class="ml-2 font-weight-normal">元(含稅)</span>
        </div>
      </div>
    </template>
    <div class="header_loading" v-else>
      <span></span>
      <span class="mt-5"></span>
      <span class="mt-5"></span>
    </div>

    <div class="switch_tabs mt-8 position-relative">
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
    <GoTop />
  </div>
</template>

<script>
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import TabProjectSummary from "./TabProjectSummary.vue";
import TabProjectBoardAd from "./TabProjectBoardAd.vue";
import TabProjectBoardApply from "./TabProjectBoardApply.vue";
import Loading from "@/components/Loading.vue";
import { ACTIONS_TYPE as UPLPAD_MATERIAL_ACTIONS_TYPE } from "@/store/share/uploadMaterial/actions";
import { tabsData } from "@/utils/report/closeReport/util";
import { createNamespacedHelpers } from "vuex";
import {
  ACTIONS_TYPE,
  MUTATIONS_TYPE,
  GETTERS_TYPE
} from "@/store/modules/report/closeReport";
import GoTop from "@/components/GoTop.vue";
const {
  mapState,
  mapActions,
  mapGetters,
  mapMutations
} = createNamespacedHelpers("report/closeReport");

let unsubscribe = null;

export default {
  name: "CloseReportTable",
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
    TabProjectSummary,
    TabProjectBoardAd,
    TabProjectBoardApply,
    Loading,
    GoTop
  },
  mounted() {
    this.currentTab = this.defaultTab ? this.defaultTab : this.tabsData[0].key;
    this.getTableData(this.currentTab);
    unsubscribe = this.$store.subscribe(async mutation => {
      if (
        mutation.type ===
        `report/closeReport/${MUTATIONS_TYPE.UPDATE_SELECTED_PROJECT}`
      ) {
        this.changeTabValue(this.tabsData[0]);
      }
    });
  },
  beforeDestroy() {
    unsubscribe();
  },
  computed: {
    ...mapState({
      isHeaderLoading: state => state.isHeaderLoading,
      isLoading: state => state.isLoading,
      filterBoard: state => state.filterBoard,
      selectedProject: state => state.selectedProject,
      projectSummary: state => state.projectSummary,
      isProjectSummaryFetched: state => state.projectSummary.isFetched,
      // isProjectBoardAdTableFetched: state =>
      //   state.projectBoardAd.table.isFetched,
      // isProjectBoardApplyTableFetched: state =>
      //   state.projectBoardApply.table.isFetched,
      materialType: state => state.materialType
    }),
    ...mapGetters({
      isClosingProjectSummaryQueryUpdated:
        GETTERS_TYPE.GET_IS_CLOSING_PROJECT_SUMMARY_QUERY_UPDATED
      // isClosingProjectBoardAdQueryUpdated:
      //   GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_AD_QUERY_UPDATED,
      // isClosingProjectBoardApplyQueryUpdated:
      //   GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_APPLY_QUERY_UPDATED
    })
  },
  methods: {
    ...mapMutations({
      updateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING,
      updateIsHedaerLoading: MUTATIONS_TYPE.UPDATE_IS_HEADER_LOADING,
      updateProjectBoardAd: MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD,
      updateProjectBoardApply: MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY,
      resetProjectBoardAd: MUTATIONS_TYPE.RESET_PROJECT_BOARD_AD,
      resetProjectBoardApply: MUTATIONS_TYPE.RESET_PROJECT_BOARD_APPLY
    }),
    ...mapActions({
      getFilterBoard: ACTIONS_TYPE.GET_FILTER_BOARD,
      getClosingProjectSummary: ACTIONS_TYPE.GET_CLOSING_PROJECT_SUMMARY,
      getClosingProjectBoardAdData:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_BOARD_AD_DATA,
      getClosingProjectBoardAdSummary:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_BOARD_AD_SUMMARY,
      getClosingProjectJobApplyDataSummary:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA_SUMMARY,
      getClosingProjectJobApplyDataPeriodSummary:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA_PERIOD_SUMMARY,
      getClosingProjectJobApplyData:
        ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA,
      getMaterialType: UPLPAD_MATERIAL_ACTIONS_TYPE.GET_MATERIAL_TYPE,
      getMaintainJobSettingCount: ACTIONS_TYPE.GET_MAINTAIN_JOB_SETTING_COUNT,
      getMaintainJobSettingStatus: ACTIONS_TYPE.GET_MAINTAIN_JOB_SETTING_STATUS
    }),
    changeTabValue(tab) {
      let tabValue = tab.key;
      this.currentTab = tabValue;
      this.resetProjectBoardAd();
      this.resetProjectBoardApply();
      this.$router
        .push({
          path: "report",
          query: {
            ...this.$route.query,
            currentTab: tabValue
          }
        })
        .catch(() => {});
      this.getTableData(tab.key);
    },
    updateLastQuery() {
      this.lastQuery = {
        selectedDate: { ...this.selectedDate },
        selectedProject: { ...this.selectedProject },
        selectedCompany: { ...this.selectedCompany }
      };
    },
    async getTableData(tab) {
      try {
        if (!this.isLoading) this.updateIsLoading(true);
        if (
          !this.isProjectSummaryFetched ||
          this.isClosingProjectSummaryQueryUpdated
        ) {
          this.updateIsHedaerLoading(true);
          await this.getClosingProjectSummary();
        }
        switch (tab) {
          case "TabProjectBoardAd":
            // if (
            //   this.isClosingProjectBoardAdQueryUpdated ||
            //   !this.isProjectBoardAdTableFetched
            // ) {
            await this.getFilterBoard({});
            let firstPcBoardId,
              firstAppBoardId,
              firstMobileBoardId,
              filterBoardId;
            this.filterBoard.forEach(board => {
              if (board.device === "PC" && !firstPcBoardId) {
                firstPcBoardId = board.id;
              }
              if (board.device === "APP" && !firstAppBoardId) {
                firstAppBoardId = board.id;
              }
              if (board.device === "MOBILE" && !firstMobileBoardId) {
                firstMobileBoardId = board.id;
              }
            });
            filterBoardId = firstPcBoardId
              ? firstPcBoardId
              : firstAppBoardId
              ? firstAppBoardId
              : firstMobileBoardId
              ? firstMobileBoardId
              : null;

            if (filterBoardId) {
              await this.getClosingProjectBoardAdSummary({
                filter: {
                  boardId: filterBoardId
                }
              });
              await this.getClosingProjectBoardAdData({
                filter: {
                  isByMaterial: true
                },
                page: 1
              });
              const filterBoardItem = this.filterBoard.find(
                x => x.id === filterBoardId
              );
              await this.getMaterialType({
                typeId: filterBoardItem.typeId,
                boardId: filterBoardItem.id
              });
            }
            // }
            break;
          case "TabProjectBoardApply":
            // if (
            //   this.isClosingProjectBoardApplyQueryUpdated ||
            //   !this.isProjectBoardApplyTableFetched
            // ) {
            let defualtType = localStorage.getItem(
              "TabProjectBoardApplyIsOnlyFocus"
            );
            // await this.getClosingProjectJobApplyDataSummary({
            //   filter: {
            //     isOnlyFocus:
            //       defualtType === null ? true : defualtType === "true"
            //   }
            // });
            await this.getClosingProjectJobApplyDataPeriodSummary({
              filter: {
                isOnlyFocus:
                  defualtType === null ? true : defualtType === "true"
              }
            });
            await this.getClosingProjectJobApplyData({
              page: 1
            });
            await this.getMaintainJobSettingCount();
            await this.getMaintainJobSettingStatus();
            // }
            break;
          default:
            break;
        }
        this.updateIsHedaerLoading(false);
        this.updateIsLoading(false);
      } catch (error) {
        this.updateIsHedaerLoading(false);
        this.updateIsLoading(false);
        console.log(error);
      }
    },
    pageChange() {
      const headerAndNavHegiht = 70;
      const margin = 20;
      const padding = 20;
      const top =
        this.$refs["close_report_table"].getBoundingClientRect().top +
        window.pageYOffset -
        (headerAndNavHegiht + margin + padding);
      window.scrollTo({ top });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/loading";

#close_report_table {
  min-width: 900px;
  color: #333;
}

.header_loading {
  > span {
    @extend %bar-loading-effect;
    &:first-child {
      width: 600px;
      height: 25px;
    }

    &:nth-child(2) {
      width: 400px;
      height: 20px;
    }

    &:last-child {
      width: 400px;
      height: 20px;
    }
  }
}

.table {
  // 標題
  &_header {
    @include font-common(22px, $font-weight-bold);

    .company_name {
      color: $blue-text;
    }
  }
}

// 區間及金額概要
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

.advertising_amount {
  @include font-common(16px, $font-weight-bold);

  .total_amount {
    margin-left: 26px;
    color: $blue-text;
  }
}

.switch_tabs {
  .switch_tabs_secondary {
    ::v-deep .switch_tabs_element {
      width: 162px;
    }
  }

  .switch_tabs_download {
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    > a {
      > span {
        @include font-common(16px, $font-weight-bold, $link-color);
      }
    }
  }
}

// 內容區塊
.tab_close_report {
  margin: 48px 20px 80px 20px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}
</style>
