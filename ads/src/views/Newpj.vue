<template>
  <div class="newpj_main">
    <!-- 新增預約專案、專案內容 -->
    <ProjectContent
      @createProjectId="createProjectId"
      @editProject="resetCollasped"
      :newPjServiceValue="newPjServiceValue"
      :projectId="getProjectId"
      :changePropsStatus="changeStatus"
    />

    <!-- 新增版位 -->
    <AddSlot
      v-if="newPjServiceValue === 'createPerfection'"
      :newPjServiceValue="newPjServiceValue"
      :projectId="getProjectId"
      :customerId="getCustomerId"
      :projectStatus="status"
      :usageArray="usageArray"
    />

    <!-- 篩選功能 -->
    <section v-if="newPjServiceValue !== 'create'" class="filter">
      <div class="filter_content">
        <SelectDropdown
          @value-changed="setSelectedFilterBoard($event)"
          @set-history-record="selectedFilterBoardOptions = $event"
          :value="selectedFilterBoard"
          :options="selectedFilterBoardOptions"
          :asncSearchCb="filterBoardSuggest"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          :clearable="true"
          :type="'getReservationProjectSuggest'"
          placeholder="版位"
        />
      </div>
      <div class="filter_content">
        <SelectDropdown
          @value-changed="setSelectedUsageType($event)"
          :value="usageType"
          :options="usageTypeOptions"
          :optionsAllData="true"
          :clearable="true"
          placeholder="特殊銷用"
        />
      </div>
      <div class="filter_content">
        <SelectDropdown
          @value-changed="setSelectedFilterStatus($event)"
          :value="filterStatus"
          :options="filterStatusOptions"
          :optionsAllData="true"
          :clearable="true"
          placeholder="狀態"
        />
      </div>
      <div class="filter_content">
        <DatePicker
          ref="date_picker"
          :getSearchTime="getTime"
          :clearable="true"
          :changeAction="dateValue => clearOrder(dateValue)"
        />
      </div>
      <div class="filter_content">
        <button @click="searchFilterBoard" class="button_bg_blue_smaller">
          篩選
        </button>
      </div>
    </section>

    <section
      v-if="
        newPjServiceValue !== 'create' &&
          !getReservationReadyData &&
          !getReservationNotReadyData &&
          !getReservationNotReadyLoading &&
          !getReservationReadyLoading
      "
      class="no_reserved_layout"
    >
      <div>
        <span>無</span>預約版位<icon
          v-tooltip="{
            placement: 'right-start',
            offset: 5,
            content: tooltipContent,
            trigger: 'hover',
            classes: ['calendar-question-mark']
          }"
          iconName="ic-help-outline"
          size="16"
        />
      </div>
    </section>

    <section
      v-if="
        getReservationReadyData &&
          !getReservationNotReadyData &&
          getCaseClosedAndVoidStatus &&
          !getReservationNotReadyLoading
      "
      class="make_an_appointment"
    >
      <div>
        您已<span class="prepare">預約備取</span>版位如下：<span>無</span
        ><icon
          v-tooltip="{
            placement: 'right-start',
            offset: 5,
            content: tooltipContent,
            trigger: 'hover',
            classes: ['calendar-question-mark']
          }"
          iconName="ic-help-outline"
          size="16"
        />
      </div>
    </section>

    <div
      v-if="getReservationNotReadyLoading && getCaseClosedAndVoidStatus"
      class="loading_block"
    >
      <Loading />
    </div>

    <section
      v-if="getReservationNotReadyData && !getReservationNotReadyLoading"
      class="make_an_appointment available"
    >
      <div>
        您已<span class="prepare">預約備取</span>版位如下：<icon
          v-tooltip="{
            placement: 'right-start',
            offset: 5,
            content: tooltipContent,
            trigger: 'hover',
            classes: ['calendar-question-mark']
          }"
          iconName="ic-help-outline"
          size="16"
        />
        <span class="float-right" @click.prevent="toggleReservation(0)">
          {{ isNotReadyCollasped ? "展開聯售版位" : "收合聯售版位" }}
          <icon
            :iconName="
              isNotReadyCollasped ? 'icon-arrow-down' : 'icon-arrow-up'
            "
          />
        </span>
      </div>
      <table cellpadding="0" cellspacing="0" class="mt-6 mb-6">
        <thead class="list_title">
          <tr>
            <th>版位名稱</th>
            <th>開始時間</th>
            <th>結束時間</th>
            <th>特殊銷用</th>
            <th>狀態</th>
            <th :colspan="getCaseClosedAndVoidStatus ? '2' : ''">
              {{ getCaseClosedAndVoidStatus ? "編輯" : "檢視" }}
            </th>
          </tr>
        </thead>
        <MakeItem
          v-for="item in reservationNotReadyData.content"
          :key="item.reservationId"
          :data="item"
          :customerId="getCustomerId"
          :projectId="getProjectId"
          distinguish="notReady"
          :show-procedure="true"
          :usageArray="usageArray"
          :isCollapsed="isNotReadyCollasped"
          @getListData="searchFilterBoard"
        />
      </table>

      <Pages
        v-if="reservationNotReadyData.content.length > 0"
        :pageData="reservationNotReadyData"
        :reloadPage="false"
        :displayActionQuery="{
          size: 20,
          projectId: getProjectId,
          type: 0,
          boardId: selectedFilterBoardId,
          startDate,
          endDate,
          grouping: isNotReadyCollasped
        }"
        path="editpj"
        befaoreDisplayAction="reservation/resetNotReservation"
        displayAction="reservation/getReservation"
      />
    </section>

    <section
      v-if="
        !getReservationReadyData &&
          getReservationNotReadyData &&
          !getReservationReadyLoading
      "
      class="no_reserved_layout"
    >
      <div>
        您已<span>預約成功</span>版位如下：<span>無</span
        ><icon
          v-tooltip="{
            placement: 'right-start',
            offset: 5,
            content: tooltipContent,
            trigger: 'hover',
            classes: ['calendar-question-mark']
          }"
          iconName="ic-help-outline"
          size="16"
        />
      </div>
    </section>

    <div v-if="getReservationReadyLoading" class="loading_block">
      <Loading />
    </div>

    <section
      v-if="getReservationReadyData && !getReservationReadyLoading"
      class="no_reserved_layout"
    >
      <div>
        您已<span>預約成功</span>版位如下：<icon
          v-tooltip="{
            placement: 'right-start',
            offset: 5,
            content: tooltipContent,
            trigger: 'hover',
            classes: ['calendar-question-mark']
          }"
          iconName="ic-help-outline"
          size="16"
        />
        <span class="float-right" @click.prevent="toggleReservation(1)">
          {{ isReadyCollasped ? "展開聯售版位" : "收合聯售版位" }}
          <icon
            :iconName="isReadyCollasped ? 'icon-arrow-down' : 'icon-arrow-up'"
          />
        </span>
      </div>
      <table cellpadding="0" cellspacing="0" class="mt-6 mb-6">
        <thead class="list_title">
          <tr>
            <th>版位名稱</th>
            <th>開始時間</th>
            <th>結束時間</th>
            <th>特殊銷用</th>
            <th>狀態</th>
            <th :colspan="getCaseClosedAndVoidStatus ? '2' : ''">
              {{ getCaseClosedAndVoidStatus ? "編輯" : "檢視" }}
            </th>
          </tr>
        </thead>
        <MakeItem
          v-for="item in reservationIsReadyData.content"
          :key="item.reservationId"
          :data="item"
          :customerId="getCustomerId"
          :projectId="getProjectId"
          :show-procedure="true"
          :usageArray="usageArray"
          :isCollapsed="isReadyCollasped"
          @getListData="searchFilterBoard"
        />
      </table>

      <Pages
        v-if="reservationIsReadyData.content.length > 0"
        :pageData="reservationIsReadyData"
        :reloadPage="false"
        :displayActionQuery="getPageAdmissionQuery"
        path="editpj"
        befaoreDisplayAction="reservation/resetIsReservation"
        displayAction="reservation/getReservation"
      />
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AddSlot from "@/components/newpj/AddSlot.vue";
import MakeItem from "@/components/newpj/MakeItem.vue";
import newPjMachine from "./stateMachine/newPj";
import Loading from "@/components/Loading.vue";
import Pages from "@/components/Pages.vue";
import ProjectContent from "@/components/newpj/ProjectContent.vue";
import SelectDropdown from "@/components/share/SelectDropdown";
import DatePicker from "@/components/DatePicker.vue";

export default {
  name: "Newpj",
  components: {
    MakeItem,
    AddSlot,
    Loading,
    Pages,
    ProjectContent,
    SelectDropdown,
    DatePicker
  },
  data() {
    return {
      newPjService: newPjMachine,
      newPjServiceValue: "",
      projectId: 0,
      customerId: "",
      status: 0,
      tooltipContent:
        "根據身分權限，特定功能限制如下 :<br />1.無「網站編輯」權限 : 無法在該網站下預約檔期，或執行「編輯/刪除」等功能。<br />2.「檔期已拉cue」 : 除備註之外，不能編輯其他欄位或刪除檔期。<br />3.專案狀態為「已結案」 : 無法「編輯/刪除」該專案內的檔期。",
      selectedFilterBoard: "",
      selectedFilterBoardId: "",
      selectedFilterBoardOptions: [],
      usageType: "",
      usageTypeVal: "",
      usageTypeOptions: [
        {
          label: "原合約",
          value: 1
        },
        {
          label: "曝光專案",
          value: 2
        },
        {
          label: "舊單PR",
          value: 3
        },
        {
          label: "成效PR",
          value: 4
        }
      ],
      filterStatus: "",
      filterStatusVal: "",
      filterStatusOptions: [
        {
          label: "未拉cue",
          value: 6
        },
        {
          label: "已拉cue",
          value: 2
        },
        {
          label: "已上素材",
          value: 3
        },
        {
          label: "已上架",
          value: 4
        },
        {
          label: "上刊結束",
          value: 5
        }
      ],
      startDate: "",
      endDate: "",
      usageOptions: [
        { value: 0, label: "原合約", hasInput: false },
        {
          value: 1,
          label: "曝光專案",
          hasInput: true,
          key: "usageName",
          field: "usage",
          tooltip: "放指定專案的素材<br>數據歸在該專案內"
        },
        {
          value: 3,
          label: "舊單PR",
          hasInput: true,
          key: "deductionName",
          field: "deduction",
          tooltip: "拉指定專案的Cue<br>扣該專案的錢"
        },
        {
          value: 2,
          label: "成效PR",
          hasInput: false,
          prompt: "(請於備註欄填寫PR原因)"
        }
      ],
      freeProjectUsageOptions: [
        {
          value: 1,
          label: "企業",
          hasInput: true,
          key: "usageName",
          field: "usage"
        },
        { value: 2, label: "內部", hasInput: false }
      ],
      isReadyCollasped: false, // 正取 收合true、展開false
      isNotReadyCollasped: false // 備取 收合true、展開false
    };
  },
  computed: {
    ...mapGetters("project", ["getProjectData"]),
    ...mapGetters("reservation", ["getReservationData"]),
    // 取專案單筆資料內容
    projectIdData() {
      return this.getProjectData.projectId;
    },
    // 取專案 id
    getProjectId() {
      return this.projectIdData.projectId || this.projectId;
    },
    // 取企業編號 id
    getCustomerId() {
      return this.projectIdData.customerId;
    },
    // 取專案狀態
    getProjectStatus() {
      return this.projectIdData.status;
    },
    // 取正取資料
    reservationIsReadyData() {
      return this.getReservationData.reservationIsReady;
    },
    // 取被取資料
    reservationNotReadyData() {
      return this.getReservationData.reservationNotReady;
    },
    // 讀取預約備取資料 loading
    getReservationNotReadyLoading() {
      const { newPjServiceValue, reservationNotReadyData } = this;
      return newPjServiceValue !== "create" && reservationNotReadyData.loading;
    },
    // 讀取預約正取資料 loading
    getReservationReadyLoading() {
      const { newPjServiceValue, reservationIsReadyData } = this;
      return newPjServiceValue !== "create" && reservationIsReadyData.loading;
    },
    // 取被取資料
    getReservationNotReadyData() {
      const { newPjServiceValue, reservationNotReadyData } = this;
      return (
        newPjServiceValue !== "create" &&
        !reservationNotReadyData.loading &&
        reservationNotReadyData.content.length > 0
      );
    },
    // 取正取資料
    getReservationReadyData() {
      const { newPjServiceValue, reservationIsReadyData } = this;
      return (
        newPjServiceValue !== "create" &&
        !reservationIsReadyData.loading &&
        reservationIsReadyData.content.length > 0
      );
    },
    // 取得不等於結案與不等於作廢狀態值
    getCaseClosedAndVoidStatus() {
      const { getProjectStatus } = this;
      return getProjectStatus !== 2 && getProjectStatus !== -1;
    },
    getPageAdmissionQuery() {
      const {
        filterStatusVal,
        getProjectId,
        selectedFilterBoardId,
        startDate,
        endDate
      } = this;
      let query = {
        size: 20,
        type: filterStatusVal,
        projectId: getProjectId,
        boardId: selectedFilterBoardId,
        startDate,
        endDate,
        grouping: this.isReadyCollasped
      };

      return query.type ? query : { ...query, type: 1 };
    },
    usageArray() {
      return this.projectIdData.freeProject === true
        ? this.freeProjectUsageOptions
        : this.usageOptions;
    }
  },
  created() {
    this.newPjService
      .onTransition(state => {
        this.newPjServiceValue = state.value;
      })
      .start();
  },
  methods: {
    ...mapActions("reservation", [
      "getReservation",
      "getReservationProjectSuggest",
      "resetIsReservation",
      "resetNotReservation",
      "resetNotReservationNoData",
      "resetReservation"
    ]),
    changeStatus(value) {
      this.status = value;
    },
    createProjectId(projectId) {
      this.projectId = projectId;
    },
    // 選取篩選版位
    setSelectedFilterBoard(data) {
      if (data) {
        this.selectedFilterBoard = this.selectedFilterBoardOptions.find(
          option => option.id === data.id
        ).label;
        this.selectedFilterBoardId = this.selectedFilterBoardOptions.find(
          option => option.id === data.id
        ).value;
        return;
      }

      this.selectedFilterBoard = "";
      this.selectedFilterBoardId = "";
    },
    // 篩選版位 api
    async filterBoardSuggest(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { getReservationProjectSuggest, getProjectId } = this;
        const responseData = await getReservationProjectSuggest({
          keyword,
          projectId: getProjectId
        });
        this.selectedFilterBoardOptions = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: `${item.device}/${item.channelName}/${item.name}`
          };
        });
      }
    },
    setSelectedUsageType(data) {
      if (data) {
        this.usageType = this.usageTypeOptions.find(
          option => option.value === data.value
        ).label;
        this.usageTypeVal = this.usageTypeOptions.find(
          option => option.value === data.value
        ).value;
      } else {
        this.usageType = "";
        this.usageTypeVal = "";
      }
    },
    // 選取篩選狀態
    setSelectedFilterStatus(data) {
      if (data) {
        this.filterStatus = this.filterStatusOptions.find(
          option => option.value === data.value
        ).label;
        this.filterStatusVal = this.filterStatusOptions.find(
          option => option.value === data.value
        ).value;
      } else {
        this.filterStatus = "";
        this.filterStatusVal = "";
      }
    },
    // 篩選
    searchFilterBoard() {
      const {
        resetReservation,
        getQueryParams,
        getReservationListData,
        resetCollasped
      } = this;
      let query = getQueryParams();
      resetCollasped();
      resetReservation();
      getReservationListData(query);
    },
    // 期間
    getTime(time) {
      this.startDate = time.searchTimeStart;
      this.endDate = time.searchTimeEnd;
    },
    // 清空時間
    clearOrder(dateValue) {
      if (!dateValue) {
        this.startDate = "";
        this.endDate = "";
        this.$refs["date_picker"].dateValue = [this.startDate, this.endDate];
      }
    },
    // 展開收合
    resetCollasped() {
      this.isReadyCollasped = false;
      this.isNotReadyCollasped = false;
    },
    // 收合聯售版位
    toggleReservation(toggleType) {
      const {
        resetIsReservation,
        resetNotReservation,
        getQueryParams,
        getReservationListData
      } = this;

      let query = getQueryParams();

      if (toggleType === 0) {
        this.isNotReadyCollasped = !this.isNotReadyCollasped;
        query.grouping = this.isNotReadyCollasped;
        query.type = 0;
        resetNotReservation();
      } else {
        this.isReadyCollasped = !this.isReadyCollasped;
        query.grouping = this.isReadyCollasped;
        query.type = query.type || 1;
        resetIsReservation();
      }

      getReservationListData(query, true);
    },
    // 清除篩選
    resetSearchFilter() {
      this.setSelectedFilterBoard();
      this.setSelectedFilterStatus();
      this.clearOrder();
      this.isReadyCollasped = false;
      this.isNotReadyCollasped = false;
    },
    getQueryParams() {
      const {
        filterStatusVal,
        getProjectId,
        selectedFilterBoardId,
        startDate,
        endDate,
        usageTypeVal
      } = this;

      let query = {
        page: 1,
        size: 20,
        type: filterStatusVal,
        projectId: getProjectId,
        boardId: selectedFilterBoardId,
        startDate,
        endDate,
        usageType: usageTypeVal
      };

      return query;
    },
    getReservationListData(query, isSpecifiedReservation = false) {
      const { getReservation, resetNotReservationNoData } = this;

      if (isSpecifiedReservation) {
        getReservation(query);
      } else if (query.type) {
        getReservation(query);
        if (query.type === 6) {
          getReservation({
            ...query,
            type: 0,
            grouping: this.isNotReadyCollasped
          });
        } else {
          resetNotReservationNoData();
        }
      } else {
        getReservation({
          ...query,
          type: 0,
          grouping: this.isNotReadyCollasped
        });
        getReservation({ ...query, type: 1, grouping: this.isReadyCollasped });
      }
    }
  }
};
</script>

<style>
.filter el-input input {
  height: 40px;
}
.filter .el-range-editor.el-input__inner {
  width: 280px;
}
</style>

<style lang="scss" scoped>
.newpj_main {
  .filter {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 24px;

    .filter_content {
      &:nth-child(1) {
        width: 336px;
      }
      &:nth-child(2),
      &:nth-child(3) {
        width: 122px;
      }
      &:nth-child(4) {
        width: 280px;
      }
      &:nth-child(5) {
        margin-right: 130px;
      }
    }
  }

  .no_reserved_layout,
  .make_an_appointment {
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 1px;
    color: #333;
    margin-top: 24px;

    &.available {
      border: 1px solid #ea475b;
    }

    .prepare {
      color: #ed2b6d;
    }

    .float-right {
      font-size: 16px;
      font-weight: bold;
      color: #0e66c7;
      margin-top: 7px;
      cursor: pointer;

      img {
        vertical-align: middle;
        margin-left: 0;
      }
    }

    span {
      color: #00b2ba;
    }

    img {
      vertical-align: initial;
      margin-left: 8px;
    }

    table {
      width: 100%;

      thead {
        &.list_title {
          tr {
            th {
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 1.13px;
              color: #000;
              border-bottom: 1px solid #eee;
              height: 48px;
              padding: 10px 12px;

              &:last-child {
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}

.loading_block {
  text-align: center;
  margin: 50px 0;
}
</style>
