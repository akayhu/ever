<template>
  <div class="close_report">
    <div class="close_report_wrapper_title">報表管理</div>
    <section>
      <h2 class="mb-6">企業結案報告設定</h2>
      <div class="search_company_block">
        <div class="mr-7">選擇企業</div>
        <div class="mr-7">
          <SelectDropdown
            data-e2e="company"
            class="select_dropdown"
            :value="selectedCompany.name"
            :filterable="true"
            :remote="true"
            :hasIcon="true"
            :options="searchedOptions"
            :placeholder="'請選擇---'"
            :asncSearchCb="companySuggestSearch"
            :type="'getFilterCustomerSuggest'"
            @value-changed="setSelectedCompany($event)"
            @set-history-record="searchedOptions = $event"
          />
        </div>
        <!-- <div class="mr-12">
          <DatePicker
            :changeAction="getTime"
            placeholder="年"
            type="year"
            format="yyyy"
          />
        </div> -->
      </div>

      <div class="project_datetime_range">
        <div class="mr-7 fw-bold">專案區間</div>
        <div>
          <DatePicker
            ref="date_picker"
            :disabled="!selectedCompany.id"
            :getSearchTime="setTime"
            :selectedDateAfter="false"
          />
        </div>
      </div>

      <div class="project_selection mb-6">
        <div class="mr-7 fw-bold">選擇專案</div>
        <div>
          <SelectDropdown
            @value-changed="setSelectedProject($event)"
            :value="selectedProject.name"
            :options="searchedProjects"
            :disabled="searchedProjects.length > 0 ? false : true"
            :optionsAllData="true"
            placeholder="請選擇"
          />
        </div>
      </div>

      <div class="text-center">
        <button
          v-show="showCompnayBtn"
          :disabled="!isSubmitAble"
          class="button_bg_blue_large"
          @click="submit(false)"
        >
          確定
        </button>
      </div>
    </section>
    <section v-if="isTableShow" class="close_report_query_table mt-6">
      <close-report-table :defaultTab="defaultTab" />
    </section>
  </div>
</template>

<script>
import CloseReportTable from "./CloseReportTable.vue";
import DatePicker from "@/components/DatePicker.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import {
  apiGetFilterCustomerSuggest,
  apiGetFilterProjectSuggest
} from "@/apis/report";
import {
  stringifyObjQuery,
  stringifyAryQuery,
  parseObjQuery,
  parseAryQuery
} from "@/utils/queryString";
import { MUTATIONS_TYPE } from "@/store/modules/report/closeReport";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("report/closeReport");

export default {
  name: "CloseReport",
  data() {
    return {
      searchedOptions: [],
      searchedProjects: [],
      selectedDate: { start: "", end: "" },
      selectedCompany: { name: "", id: 0 },
      selectedProject: { name: "", id: 0 },
      defaultTab: "",
      isOpenSelectedProject: false,
      isTableShow: false,
      showCompnayBtn: true
    };
  },
  components: {
    SelectDropdown,
    DatePicker,
    CloseReportTable
  },
  mounted() {
    if (
      this.$route.query.selectedDate &&
      this.$route.query.selectedCompany &&
      this.$route.query.selectedProject &&
      this.$route.query.searchedProjects
    ) {
      this.selectedCompany = parseObjQuery(this.$route.query.selectedCompany);
      this.selectedProject = parseObjQuery(this.$route.query.selectedProject);
      this.selectedDate = parseObjQuery(this.$route.query.selectedDate);
      this.defaultTab = this.$route.query.currentTab;
      this.searchedProjects = parseAryQuery(this.$route.query.searchedProjects);
      this.$refs["date_picker"].dateValue = [
        this.selectedDate.start,
        this.selectedDate.end
      ];
      this.isOpenSelectedProject = true;
      this.submit(true);
    }
  },
  beforeDestroy() {
    this.resetPageState();
  },
  computed: {
    isSelectedProjectBlockShow() {
      return (
        this.isOpenSelectedProject &&
        this.selectedDate.start &&
        this.selectedDate.end &&
        this.selectedCompany.name &&
        this.selectedCompany.id
      );
    },
    isSubmitAble() {
      return (
        !!this.selectedDate.start &&
        !!this.selectedDate.end &&
        !!this.selectedCompany.name &&
        !!this.selectedCompany.id &&
        !!this.selectedProject.name &&
        !!this.selectedProject.id
      );
    }
  },
  methods: {
    ...mapMutations({
      updateSelectedDate: MUTATIONS_TYPE.UPDATE_SELECTED_DATE,
      updateSelectedCompany: MUTATIONS_TYPE.UPDATE_SELECTED_COMPANY,
      updateSelectedProject: MUTATIONS_TYPE.UPDATE_SELECTED_PROJECT,
      updateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING,
      resetPageState: MUTATIONS_TYPE.RESET_PAGE_STATE
    }),
    async companySuggestSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        try {
          const {
            data: { response: responseData }
          } = await apiGetFilterCustomerSuggest({ keyword });
          this.searchedOptions = [...responseData].map(item => {
            return {
              ...item,
              value: item.id,
              label: `${item.name}(${item.id})`
            };
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    async setTime(time) {
      const { searchTimeStart, searchTimeEnd } = time;
      this.selectedDate = {
        start: searchTimeStart,
        end: searchTimeEnd
      };
      try {
        const {
          data: { response: responseData }
        } = await apiGetFilterProjectSuggest({
          customerId: this.selectedCompany.id,
          start: this.selectedDate.start,
          end: this.selectedDate.end
        });
        this.selectedProject = { name: "", id: 0 };
        this.searchedProjects = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
        this.defaultTab = "TabProjectSummary";
        this.isOpenSelectedProject || (this.isOpenSelectedProject = true);
      } catch (error) {
        console.log(error);
      }
    },
    setSelectedCompany(companyId) {
      if (!companyId) {
        this.selectedCompany = { name: "", id: 0 };
      }

      const findVal = this.searchedOptions.find(
        option => option.id === companyId
      );
      if (!findVal) return;

      this.selectedCompany = {
        name: `${findVal.name}(${findVal.id})`,
        id: findVal.id
      };
      this.$refs["date_picker"].dateValue = [];
      this.selectedDate = { start: "", end: "" };
      this.selectedProject = { name: "", id: 0 };
      this.searchedProjects = [];
      this.defaultTab = "TabProjectSummary";
    },
    setSelectedProject(project) {
      this.selectedProject = project;
      this.defaultTab = "TabProjectSummary";
    },
    updateQuery() {
      this.defaultTab = this.$route.query.currentTab
        ? this.$route.query.currentTab
        : "TabProjectSummary";
      this.$router
        .push({
          path: "report",
          query: {
            selectedDate: stringifyObjQuery(this.selectedDate),
            selectedCompany: stringifyObjQuery(this.selectedCompany),
            selectedProject: stringifyObjQuery(this.selectedProject),
            searchedProjects: stringifyAryQuery(this.searchedProjects),
            currentTab: this.defaultTab
          }
        })
        .catch(() => {});
    },
    submit(ignoreUpdateQuery = false) {
      if (this.isTableShow) {
        this.updateIsLoading(true);
        this.resetPageState();
      }
      this.updateSelectedDate(this.selectedDate);
      this.updateSelectedCompany(this.selectedCompany);
      this.updateSelectedProject(this.selectedProject);
      if (!ignoreUpdateQuery) this.updateQuery();
      if (!this.isTableShow) this.isTableShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.close_report_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}

.search_company_block {
  display: flex;
  align-items: center;
  @include font-common(16px, $font-weight-bold);
  margin-bottom: 24px;

  > div {
    &:nth-child(2) {
      width: 480px;
    }
    &:nth-child(3) {
      width: 130px;
    }
  }
}

.divider {
  position: relative;
  border-top: 1px solid #d6d6d6;
  margin-top: 46px;
  margin-bottom: 26px;
  height: 1px;

  span {
    @include font-common(16px, $font-weight-bold);
    background-color: #fff;
    padding: 0 38px 0 18px;
    position: absolute;
    top: -12px;
    left: 50%;
    margin-left: -89px;

    &::before {
      content: " ";
      display: inline-block;
      border-style: solid;
      border-width: 0 7px 7px 7px;
      border-color: transparent transparent #a9a9a9 transparent;
      position: absolute;
      top: 7px;
      right: 13px;
    }
    &::after {
      content: " ";
      display: inline-block;
      border-style: solid;
      border-width: 0 7px 7px 7px;
      border-color: transparent transparent #fff transparent;
      position: absolute;
      top: 9px;
      right: 13px;
    }
  }
}

.project_datetime_range {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  @include font-common(16px, $font-weight-bold);

  ::v-deep {
    .el-date-editor--daterange {
      width: 100%;
    }
  }

  > div {
    &:nth-child(2) {
      width: 480px;
    }
  }
}

.project_selection {
  display: flex;
  align-items: center;
  @include font-common(16px, $font-weight-bold);

  > div {
    &:nth-child(2) {
      width: 480px;
    }
  }
}

.controller {
  margin-top: 24px;

  .controller_item {
    &:not(:last-child) {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 16px;

      > div:nth-child(2) {
        margin-left: 28px;
      }
    }

    .select_dropdown {
      cursor: pointer;
      width: 480px;
    }
  }

  .select_project {
    margin-top: 32px;

    .title {
      font-size: 16px;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #333;

      img {
        margin-top: -3px;
      }

      span {
        font-size: 14px;
        line-height: 1.43;
        letter-spacing: 1.43px;
        color: #7e7e7e;
      }
    }

    .project_block {
      display: flex;
      flex-wrap: wrap;
      margin-top: 24px;

      .project_item {
        width: 392px;
        height: 24px;
        margin-bottom: 16px;

        label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          width: 280px;
          display: inline-block;
        }
      }

      > p {
        color: $red;
      }
    }
  }

  .button_block {
    margin-top: 24px;
    text-align: center;
  }
}
</style>
