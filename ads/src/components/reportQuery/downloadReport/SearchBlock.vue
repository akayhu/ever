<template>
  <section>
    <h2 class="mb-6">查詢下載報表</h2>

    <div class="data_row">
      <div class="mr-7">選擇企業</div>
      <div class="mr-7">
        <SelectDropdown
          class="select_w480"
          :value="routeQuery.selectedCompany.label"
          :filterable="true"
          :remote="true"
          :options="searchedCompanyOptions"
          :placeholder="'請選擇企業'"
          :asncSearchCb="companySuggestSearch"
          :optionsAllData="true"
          :type="'getFilterCustomerSuggest'"
          :clearable="true"
          @value-changed="setSelectedCompany($event)"
          @set-history-record="searchedCompanyOptions = $event"
        />
      </div>

      <div class="mr-7">產生報表人員</div>
      <div>
        <SelectDropdown
          class="select_w220"
          :value="routeQuery.selectedAccount.label"
          :options="searchedAccountOptions"
          :placeholder="'請選擇人員'"
          :asncSearchCb="accountSuggestSearch"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          :clearable="true"
          @value-changed="setSelectedAccount($event)"
        />
      </div>
    </div>

    <div class="data_row">
      <div class="mr-7">數據區間</div>
      <div class="select_w480 mr-7">
        <DatePicker
          class="select_w400"
          ref="date_picker"
          :getSearchTime="setTime"
          :selectedDateAfter="false"
          :clearable="true"
          :changeAction="handleChangePeriod"
        />
      </div>

      <div class="mr-7 label">報表狀態</div>
      <div>
        <SelectDropdown
          class="select_w220"
          @value-changed="setSelectedStatus($event)"
          :value="routeQuery.selectedStatus.label"
          :options="statusOptions"
          :clearable="true"
          placeholder="請選擇狀態"
        />
      </div>
    </div>

    <div class="data_row">
      <div class="mr-7">選擇專案</div>
      <div class="mr-6">
        <SelectDropdown
          class="select_w480"
          placeholder="請選擇專案"
          :value="routeQuery.selectedProject.label"
          :options="searchedProjectOptions"
          :asncSearchCb="projectRecommendSearch"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          :clearable="true"
          :type="'getProjectRecommend'"
          @value-changed="setSelectedProject($event)"
          @set-history-record="searchedProjectOptions = $event"
        />
      </div>
    </div>

    <div class="text-center mt-6">
      <button class="button_bg_blue_large" @click="submit">
        確定
      </button>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted, reactive, onUnmounted } from "vue";
import { useRoute } from "@/router/useRoute.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import { stringifyObjQuery, parseObjQuery } from "@/utils/queryString";
import { useStore } from "@/store/index.js";
// import useSelectCompany from "@/composables/useSelectCompany.js";
// import useSelectProject from "@/composables/useSelectProject.js";
import { apiGetFilterCustomerSuggest } from "@/apis/report";
import { apiGetProjectRecommend } from "@/apis/project";
// import useSelectValue from "@/composables/useSelectValue.js";
import { useDownloadReportStore } from "@/stores/report/download.js";

export default {
  components: {
    SelectDropdown,
    DatePicker
  },
  setup() {
    const { route, router } = useRoute();
    const store = useStore();
    const userStatus = computed(() => store.getters["user/getUserStatus"]);
    const downloadStore = useDownloadReportStore();

    const routeQuery = reactive({
      selectedCompany: { id: "", label: "" },
      selectedDate: { start: "", end: "" },
      selectedProject: { id: "", label: "" },
      selectedAccount: { label: "" },
      selectedStatus: { id: "", label: "" }
    });

    const searchedCompanyOptions = ref([]);
    const date_picker = ref(null);
    const searchedAccountOptions = ref([]);
    const searchedProjectOptions = ref([]);
    const statusOptions = ref([
      { id: "0", label: "處理中", value: "0" },
      { id: "1", label: "已完成", value: "1" }
    ]);

    onMounted(async () => {
      if (route.query.selectedAccount) {
        await accountSuggestSearch(route.query.selectedAccount);
        setSelectedAccount({ accountId: route.query.selectedAccount });
      } else {
        routeQuery.selectedAccount = {
          accountId: userStatus.value.accountId,
          label: `${userStatus.value.name}(${userStatus.value.accountId})`,
          logonId: userStatus.value.logonId,
          name: userStatus.value.name
        };
      }

      if (route.query.selectedCompany) {
        routeQuery.selectedCompany = parseObjQuery(route.query.selectedCompany);
      }

      if (route.query.selectedDate) {
        routeQuery.selectedDate = parseObjQuery(route.query.selectedDate);
        date_picker.value.dateValue = [
          routeQuery.selectedDate.start,
          routeQuery.selectedDate.end
        ];
      }

      if (route.query.selectedProject) {
        routeQuery.selectedProject = parseObjQuery(route.query.selectedProject);
      }

      if (route.query.selectedStatus) {
        setSelectedStatus(route.query.selectedStatus);
      }

      if (route.query?.tabType === "Jobapply") {
        downloadStore.routeQuery.currentTab = { key: "2", label: "主應數據" };
      }

      submit();
    });
    // 查詢企業
    const companySuggestSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const {
          data: { response: responseData }
        } = await apiGetFilterCustomerSuggest({ keyword });
        searchedCompanyOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: `${item.name}(${item.id})`
          };
        });
      }
    };
    // 選擇企業
    const setSelectedCompany = data => {
      if (data) {
        routeQuery.selectedCompany = {
          id: data.id,
          label: data.label
        };
      } else {
        routeQuery.selectedCompany = { id: "", label: "" };
      }
      routeQuery.selectedProject = { id: "", label: "" };
      searchedProjectOptions.value = [];
    };
    // 設定數據區間
    const setTime = time => {
      const { searchTimeStart, searchTimeEnd } = time;
      routeQuery.selectedDate = {
        start: searchTimeStart,
        end: searchTimeEnd
      };
    };
    // 清除數據區間觸發事件
    const handleChangePeriod = dateValue => {
      if (dateValue === null) {
        routeQuery.selectedDate = {
          start: "",
          end: ""
        };
      }
    };
    // 取得推薦人員
    const getAccountSearch = async ({ keyword }) => {
      return await store.dispatch("account/getAccountSearch", { keyword });
    };
    // 查詢人員
    const accountSuggestSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const responseData = await getAccountSearch({ keyword });
        searchedAccountOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.accountId,
            label: `${item.name}(${item.accountId})`
          };
        });
      }
    };
    // 選擇人員
    const setSelectedAccount = data => {
      if (data) {
        routeQuery.selectedAccount = searchedAccountOptions.value.find(
          option => option.accountId === data.accountId
        );
      } else {
        routeQuery.selectedAccount = { label: "" };
      }
    };
    // 選擇狀態
    const setSelectedStatus = data => {
      if (data) {
        routeQuery.selectedStatus = statusOptions.value.find(
          option => option.id === data
        );
      } else routeQuery.selectedStatus = { id: "", label: "" };
    };
    // 查詢企業
    const projectRecommendSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const {
          data: { response: responseData }
        } = await apiGetProjectRecommend({ keyword });
        searchedProjectOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.projectId,
            label: item.projectName
          };
        });
      }
    };
    // 選擇專案
    const setSelectedProject = data => {
      if (!data) {
        routeQuery.selectedProject = { id: "", label: "" };
        return;
      } else {
        routeQuery.selectedProject = {
          id: data.value,
          label: data.label
        };
      }
      routeQuery.selectedCompany.id = data.customerId;
      routeQuery.selectedCompany.label = `${data.customerName}(${data.customerId})`;
    };

    const submit = async () => {
      let query = {};

      if (routeQuery.selectedCompany.id) {
        query.selectedCompany = stringifyObjQuery(routeQuery.selectedCompany);
      }
      if (routeQuery.selectedDate.start || routeQuery.selectedDate.end) {
        query.selectedDate = stringifyObjQuery(routeQuery.selectedDate);
      }
      if (routeQuery.selectedAccount.accountId) {
        query.selectedAccount = routeQuery.selectedAccount.accountId;
      }
      if (routeQuery.selectedProject.id) {
        query.selectedProject = stringifyObjQuery(routeQuery.selectedProject);
      }
      if (routeQuery.selectedStatus.id !== "") {
        query.selectedStatus = routeQuery.selectedStatus.id;
      }

      router
        .push({
          path: "downloadReport",
          query: {
            id: route.query.id,
            tabType: route.query.tabType,
            ...query
          }
        })
        .catch(() => {});
      downloadStore.updateRouteQuery(routeQuery);
      await downloadStore.getTableDate();
      downloadStore.fetchData();
    };

    onUnmounted(() => {
      downloadStore.$reset();
    });

    return {
      userStatus,
      searchedCompanyOptions,
      searchedAccountOptions,
      date_picker,
      searchedProjectOptions,
      statusOptions,
      routeQuery,
      companySuggestSearch,
      setSelectedCompany,
      accountSuggestSearch,
      setSelectedAccount,
      setTime,
      handleChangePeriod,
      setSelectedStatus,
      setSelectedProject,
      projectRecommendSearch,
      submit
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.data_row {
  @include font-common(16px, $font-weight-bold);
  display: flex;
  align-items: center;
  margin-bottom: 24px;

  .label {
    min-width: 105px;
  }

  .select_w480 {
    width: 480px;
  }

  .select_w400 {
    width: 400px;
  }

  .select_w220 {
    width: 220px;
  }
}
</style>
