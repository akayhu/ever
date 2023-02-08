<template>
  <div>
    <div class="search_company_block mb-6">
      <div class="mr-7">選擇企業</div>
      <div class="mr-7">
        <SelectDropdown
          :value="selectedCompany.name"
          :filterable="true"
          :remote="true"
          :hasIcon="true"
          :options="searchedOptions"
          placeholder="請選擇企業"
          :type="'getFilterCustomerSuggest'"
          :asncSearchCb="companySuggestSearch"
          @value-changed="setSelectedCompany($event)"
          @set-history-record="searchedOptions = $event"
        />
      </div>
    </div>

    <div class="project_datetime_range mb-6">
      <div class="mr-7 fw-bold">廣告區間</div>
      <div>
        <DatePicker
          ref="date_picker"
          :disabled="!selectedCompany.id"
          :getSearchTime="setTime"
        />
      </div>
    </div>

    <div class="project_datetime_range mb-6">
      <div class="fw-bold">
        選擇專案
        <img
          src="@/assets/icon/icon-info-warmgray.svg"
          v-tooltip="{
            placement: 'right',
            content: '請先選擇企業與廣告區間方可選擇專案',
            offset: 5,
            trigger: 'hover'
          }"
        />
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <Loading />
    </div>

    <div class="project_block mb-6" v-show="isSelectedProjectBlockShow">
      <template v-if="!isLoading && searchedProjects.length > 0">
        <span v-for="project in searchedProjects" :key="project.id">
          <span>
            <div class="project_item">
              <Radio
                :name="'selectedProject'"
                :bindValue="project"
                :tooltip="true"
                :content="project.name"
                v-model="selectedProject"
              />
            </div>
          </span>
        </span>
      </template>
      <p v-if="!isLoading && searchedProjects.length < 1">無搜尋結果</p>
    </div>

    <div class="button_block">
      <button
        @click="submit()"
        class="button_bg_blue_large"
        :disabled="!isSubmitable"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useMaintainStore } from "@/stores/maintain.js";
import { useRoute } from "@/router/useRoute.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import Radio from "@/components/share/Radio.vue";
import Loading from "@/components/Loading.vue";
import {
  stringifyObjQuery,
  parseObjQuery,
  stringifyAryQuery
} from "@/utils/queryString";

export default {
  components: {
    SelectDropdown,
    DatePicker,
    Radio,
    Loading
  },
  setup() {
    const { router, route } = useRoute();
    const maintainStore = useMaintainStore();
    const {
      getFilterCustomerSuggest,
      getFilterProjectSuggest,
      updateSelectedDate,
      updateCurrentTab,
      updateSelectedCompany,
      updateSelectedProject,
      getMaintainActivityPage
    } = maintainStore;
    const isSelectedProjectBlockShow = computed(() => {
      return (
        isOpenSelectedProject.value &&
        selectedDate.value.start &&
        selectedDate.value.end &&
        selectedCompany.value.name &&
        selectedCompany.value.id
      );
    });
    const isSubmitable = computed(
      () => selectedProject.value.id && selectedProject.value.name
    );
    const selectedCompany = ref({ name: "", id: 0 });
    const searchedOptions = ref([]);
    const selectedDate = ref({ start: "", end: "" });
    const searchedProjects = ref([]);
    const selectedProject = ref({ name: "", id: 0, selfProject: false });
    const isOpenSelectedProject = ref(false);
    const isLoading = ref(false);
    const date_picker = ref(null);

    onMounted(async () => {
      const routeQuery = route.query;
      if (
        routeQuery.selectedDate &&
        routeQuery.selectedCompany &&
        routeQuery.selectedProject
      ) {
        selectedCompany.value = parseObjQuery(routeQuery.selectedCompany);
        selectedDate.value = parseObjQuery(routeQuery.selectedDate);
        date_picker.value.dateValue = [
          selectedDate.value.start,
          selectedDate.value.end
        ];
        await getFilterProjectSuggestData();
        selectedProject.value = parseObjQuery(routeQuery.selectedProject);
        submit();
      }
    });

    // 選擇企業 AC
    const companySuggestSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const responseData = await getFilterCustomerSuggest({ keyword });
        searchedOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: `${item.name}(${item.id})`
          };
        });
      }
    };

    // 選擇企業
    const setSelectedCompany = companyId => {
      reset();
      const findVal = searchedOptions.value.find(
        option => option.id === companyId
      );
      if (!findVal) return;
      selectedCompany.value = {
        name: `${findVal.name}(${findVal.id})`,
        id: findVal.id
      };
    };

    // 清空資料回預設
    const reset = () => {
      selectedCompany.value = { name: "", id: 0 };
      selectedDate.value = { start: "", end: "" };
      selectedProject.value = { name: "", id: 0, selfProject: false };
      date_picker.value.dateValue = [];
      searchedProjects.value = [];
    };

    // 廣告區間
    const setTime = time => {
      selectedDate.value = {
        start: time.searchTimeStart,
        end: time.searchTimeEnd
      };
      getFilterProjectSuggestData();
    };

    // 取專案
    const getFilterProjectSuggestData = async () => {
      isLoading.value = true;
      const responseData = await getFilterProjectSuggest({
        customerId: selectedCompany.value.id,
        start: selectedDate.value.start,
        end: selectedDate.value.end
      });
      searchedProjects.value = [...responseData];
      selectedProject.value = { name: "", id: 0, selfProject: false };
      isOpenSelectedProject.value = true;
      isLoading.value = false;
    };

    // 確定
    const submit = () => {
      updateSelectedDate(selectedDate.value);
      updateSelectedCompany(selectedCompany.value);
      updateSelectedProject(selectedProject.value);
      updateCurrentTab("activity_query");
      getMaintainActivityPage(1);
      router
        .push({
          path: "maintain_new",
          query: {
            selectedDate: stringifyObjQuery(selectedDate.value),
            selectedCompany: stringifyObjQuery(selectedCompany.value),
            selectedProject: stringifyObjQuery(selectedProject.value),
            searchedProjects: stringifyAryQuery(searchedProjects.value),
            currentTab: "activity_query"
          }
        })
        .catch(() => {});
    };

    return {
      selectedCompany,
      searchedOptions,
      companySuggestSearch,
      setSelectedCompany,
      setTime,
      searchedProjects,
      isSelectedProjectBlockShow,
      isSubmitable,
      selectedProject,
      isLoading,
      submit,
      date_picker
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.search_company_block {
  display: flex;
  align-items: center;
  @include font-common(16px, $font-weight-bold);

  > div {
    &:nth-child(2) {
      width: 480px;
    }
    &:nth-child(3) {
      width: 130px;
    }
  }
}

.project_datetime_range {
  display: flex;
  align-items: center;
  @include font-common(16px, $font-weight-bold);

  ::v-deep {
    .el-date-editor--daterange {
      width: 100%;
    }
  }

  > div {
    &:nth-child(2) {
      width: 400px;
    }
  }
}

.loading {
  text-align: center;
  margin: 50px 0;
}

.project_block {
  display: flex;
  flex-wrap: wrap;

  .project_item {
    width: 299px;
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

  > div:nth-child(n + 4) {
    margin-top: 10px;
  }

  p {
    color: $red;
  }
}

.button_block {
  text-align: center;
}
</style>
