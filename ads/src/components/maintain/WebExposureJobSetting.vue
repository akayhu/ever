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

    <div class="project_selection">
      <div class="mr-7 fw-bold">選擇專案</div>
      <div>
        <SelectDropdown
          :value="selectedProject.name"
          :options="projectOptions"
          :disabled="!selectedDate.start"
          placeholder="請選擇專案"
          @value-changed="setSelectedProject($event)"
        />
      </div>
    </div>

    <div v-if="noMatchProject" class="no_match_project">
      此專案區間無符合的專案
    </div>

    <div class="project_search_btn mt-6">
      <button
        :disabled="!selectedProject.id"
        @click="searchCompany"
        class="button_bg_blue_large"
      >
        確定
      </button>
    </div>

    <div v-if="getMaintainData.loading" class="mainitain_loading">
      <Loading />
    </div>

    <div v-if="showDataTable && !getMaintainData.loading">
      <div class="expose_setting mt-6">
        <div class="mr-3 fw-bold">職缺設定曝光時間</div>
        <icon class="image_info mr-1" iconName="icon-info-warmgray" size="16" />
        <span class="info_span">時間可依年、月份、週切換</span>
      </div>

      <div class="maintain_table_download_link pt-6 pb-6">
        <div class="data_top">
          <div class="date_switch">
            <span
              @click="changeDate('month')"
              :class="{ focus: dateSwitch === 'month' }"
              >月</span
            >
            <span
              @click="changeDate('week')"
              :class="{ focus: dateSwitch === 'week' }"
              >週</span
            >
            <div class="date_sort ml-7">
              排序
              <el-select
                v-model="query.settingFirst"
                placeholder="請選擇"
                @change="changeSettingFirst"
              >
                <el-option
                  v-for="item in settingFirstOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="upload_block">
            <span class="mr-3">上傳excel匯入</span>
            <input
              @change="uploadFile($event)"
              :disabled="!getMaintainData.canEdit"
              accept=".xlsx"
              ref="uploadExcel"
              class="file-upload"
              type="file"
            />
            <span
              v-if="!uploadExcelFileLoading"
              class="file_upload mr-2"
              :class="{
                disabled: !getMaintainData.canEdit,
                group: getMaintainData.canEdit
              }"
              @click="fileClick('uploadFileSelf')"
            >
              <icon
                :iconName="
                  getMaintainData.canEdit
                    ? `icon-photo-empty-blue`
                    : `icon-camera-disable`
                "
                size="16"
                class="mr-1"
                :class="{ 'group-hover:filter-hover': getMaintainData.canEdit }"
              />
              上傳檔案
            </span>
            <span v-if="uploadExcelFileLoading" class="mr-12 ml-10">
              <Loading :size="30" />
            </span>
            <img
              class="mr-1"
              src="@/assets/icon/icon-info-warmgray.svg"
              v-tooltip="{
                placement: 'right',
                content: `<div>*上傳excel匯入</div>
                  <div>*最大限制10MB</div> 
                  <div>*可上傳的檔案格式：xlsx,xls</div>`,
                offset: 5,
                trigger: 'hover'
              }"
            />
            <a
              class="file_format"
              href="/jobs_upload_sample_file.xlsx"
              rel="noopener noreferrer"
              title="檔案格式"
              >檔案格式</a
            >
          </div>
        </div>
        <div v-if="uploadExcelFileError" class="data_error mt-2">
          資料有誤，請重新上傳！
        </div>
      </div>

      <!-- 曝光職缺行事曆 -->
      <div class="mb-6">
        <!-- 切換年、月份 -->
        <CalendarSwitchYearMonth
          :changeSwitchState="changeSwitchState"
          :year="selectYear"
          :month="selectMonth"
          :switchDesignatedDate="switchDesignatedDate"
          :periodData="getMaintainData.period"
          :weeksShowTwoYears="weeksShowTwoYears"
          :weeksShowTwoMonths="weeksShowTwoMonths"
          :disableToPrev="disableToPrev"
          :disableToNext="disableToNext"
          @changeDate="changeSpecifiedDate"
        />
        <!-- 月份內容 -->
        <CalendarMonthContent
          v-if="dateSwitch === 'month'"
          :monthData="monthData"
          :maintainData="getMaintainData"
          :changeSwitchState="changeSwitchState"
          :year="selectYear"
          :month="selectMonth"
          :prevCurrentNextMonthData="prevCurrentNextMonthData"
          :haveDays="haveDays"
          @createJobSetting="createJobSetting"
          @deleteJobSetting="deleteJobSetting"
        />
        <!-- 週內容 -->
        <CalendarWeekContent
          v-if="dateSwitch === 'week'"
          :weekData="weekData"
          :maintainData="getMaintainData"
          :changeSwitchState="changeSwitchState"
          :disableToPrev="disableToPrev"
          :disableToNext="disableToNext"
          :crossMonth="weeksShowTwoMonths.showTwoMonths"
          @createJobSetting="createJobSetting"
          @deleteJobSetting="deleteJobSetting"
        />
      </div>

      <Pages
        v-if="getMaintainData.content.length > 0"
        :pageData="getMaintainData"
        :isUsedEmit="true"
        :reloadPage="false"
        @pageChange="changePages"
      />
    </div>

    <GoTop v-if="getMaintainData.content.length > 0" />
  </div>
</template>

<script>
import { ref, computed, onMounted, toRefs } from "vue";
import { useMaintainStore } from "@/stores/maintain.js";
import { useRoute } from "@/router/useRoute.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import CalendarSwitchYearMonth from "@/components/maintain/CalendarSwitchYearMonth.vue";
import CalendarMonthContent from "@/components/maintain/CalendarMonthContent.vue";
import CalendarWeekContent from "@/components/maintain/CalendarWeekContent.vue";
import { getDaysInYearMonth } from "@/utils/dateProcessing.js";
import {
  getThirtyOneGridDate,
  getWeekPeriod,
  getFirstDate,
  getLastDate
} from "@/utils/dateFormat";
import {
  stringifyObjQuery,
  parseObjQuery,
  stringifyAryQuery,
  parseAryQuery
} from "@/utils/queryString";
import { Message } from "element-ui";
import moment from "moment";
import Loading from "@/components/Loading.vue";
import Pages from "@/components/Pages.vue";
import GoTop from "@/components/GoTop.vue";

const FORMAT_STRING = "YYYY/MM/DD";

export default {
  components: {
    DatePicker,
    SelectDropdown,
    CalendarSwitchYearMonth,
    CalendarMonthContent,
    CalendarWeekContent,
    Loading,
    Pages,
    GoTop
  },
  setup() {
    const { route, router } = useRoute();
    const monthData = ref([]);
    const weekData = ref([]);
    const switchState = ref("month");
    const weeksShowTwoYears = ref({
      showTwoYears: false,
      weekFirstYear: "",
      weekNextYear: ""
    });
    const weeksShowTwoMonths = ref({
      showTwoMonths: false,
      weekFirstMonth: "",
      weekNextMonth: ""
    });
    const selectedCompany = ref({ name: "", id: 0 });
    const selectedDate = ref({ start: "", end: "" });
    const searchedOptions = ref([]);
    const selectedProject = ref({ name: "", id: 0, selfProject: false });
    const projectOptions = ref([]);
    const dateSwitch = ref("month");
    const selectYear = ref("");
    const selectMonth = ref("");
    const haveDays = ref("");
    const noMatchProject = ref(false);
    const uploadExcelFile = ref(null);
    const uploadExcelFileLoading = ref(false);
    const uploadExcelFileError = ref(false);
    const query = ref({
      projectId: "",
      start: "",
      end: "",
      page: 1,
      size: 100,
      settingFirst: false
    });
    const settingFirstOptions = ref([
      {
        value: false,
        label: "職缺代碼由小→大"
      },
      {
        value: true,
        label: "重點職缺在前"
      }
    ]);
    const showDataTable = ref(false);
    const date_picker = ref(null);
    const uploadExcel = ref(null);
    const maintainStore = useMaintainStore();
    const {
      updateCurrentTab,
      updateSelectedCompany,
      updateSelectedDate,
      updateSelectedProject,
      getFilterCustomerSuggest,
      getFilterProjectSuggest,
      postExcelJobSetting,
      clearMaintainJobSetting,
      getMaintainJobSetting,
      postMaintainJobSetting,
      putMaintainJobSetting,
      updateMaintainJobSetting
    } = maintainStore;
    const { maintainData } = toRefs(maintainStore);
    const getMaintainData = computed(() => maintainData.value);
    const disableToPrev = computed(() => {
      if (dateSwitch.value === "week") {
        return weekData.value.some(
          item =>
            new Date(item.date).getTime() ===
            new Date(getMaintainData.value.period.start).getTime()
        );
      } else {
        let startDate = new Date(getMaintainData.value.period.start);
        return (
          selectMonth.value === startDate.getMonth() + 1 &&
          selectYear.value === startDate.getFullYear()
        );
      }
    });
    const disableToNext = computed(() => {
      if (dateSwitch.value === "week") {
        return weekData.value.some(
          item =>
            new Date(item.date).getTime() ===
            new Date(getMaintainData.value.period.end).getTime()
        );
      } else {
        let endDate = new Date(getMaintainData.value.period.end);
        return (
          selectMonth.value === endDate.getMonth() + 1 &&
          selectYear.value === endDate.getFullYear()
        );
      }
    });

    onMounted(() => {
      const routeQuery = route.query;
      if (
        routeQuery.selectedDate &&
        routeQuery.selectedCompany &&
        routeQuery.selectedProject &&
        routeQuery.searchedProjects
      ) {
        selectedCompany.value = parseObjQuery(routeQuery.selectedCompany);
        selectedProject.value = parseObjQuery(routeQuery.selectedProject);
        selectedDate.value = parseObjQuery(routeQuery.selectedDate);
        projectOptions.value = parseAryQuery(routeQuery.searchedProjects);
        date_picker.value.dateValue = [
          selectedDate.value.start,
          selectedDate.value.end
        ];
        query.value.projectId = selectedProject.value.id;
        initCalendar();
        searchCompany();
      }
    });

    const initCalendar = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const days = getDaysInYearMonth(year, month);
      clearMaintainJobSetting();
      selectYear.value = year;
      selectMonth.value = month;
      haveDays.value = days;
      prevCurrentNextMonthData(year, month, days);
      weekData.value = getWeekPeriod();
    };

    // 取切換上下月後的整月日期
    const prevCurrentNextMonthData = (year, month, days) => {
      monthData.value = getThirtyOneGridDate(year, month, days);
    };

    // 上方確定鈕
    const searchCompany = () => {
      updateSelectedDate(selectedDate.value);
      updateSelectedCompany(selectedCompany.value);
      updateSelectedProject(selectedProject.value);
      updateCurrentTab("job_setting");
      router
        .push({
          path: "maintain_new",
          query: {
            selectedDate: stringifyObjQuery(selectedDate.value),
            selectedCompany: stringifyObjQuery(selectedCompany.value),
            selectedProject: stringifyObjQuery(selectedProject.value),
            searchedProjects: stringifyAryQuery(projectOptions.value),
            currentTab: "job_setting"
          }
        })
        .catch(() => {});

      showDataTable.value = true;
      initCalendar();
      changeDate("month");
    };

    const getWeekData = dateString => {
      weekData.value = getWeekPeriod(dateString);
      selectYear.value = new Date(dateString).getFullYear();
      selectMonth.value = new Date(dateString).getMonth() + 1;
      query.value.start = weekData.value[0].date;
      query.value.end = weekData.value[weekData.value.length - 1].date;
      getMaintainJobSetting(query.value);
    };

    // 計算某年某月有幾天再取整月日期
    const getMonthData = () => {
      const days = getDaysInYearMonth(selectYear.value, selectMonth.value);
      haveDays.value = days;
      prevCurrentNextMonthData(selectYear.value, selectMonth.value, days);
      const newDate = moment([selectYear.value, selectMonth.value - 1]);
      query.value.start = getFirstDate(newDate, "month", FORMAT_STRING);
      query.value.end = getLastDate(newDate, "month", FORMAT_STRING);
      getMaintainJobSetting(query.value);
    };

    // 清除顯示雙年份
    const resetWeekShowsTwoYears = () => {
      weeksShowTwoYears.value.showTwoYears = false;
      weeksShowTwoYears.value.weekFirstYear = "";
      weeksShowTwoYears.value.weekNextYear = "";
    };

    // 清除顯示雙月份
    const resetWeekShowsTwoMonths = () => {
      weeksShowTwoMonths.value.showTwoMonths = false;
      weeksShowTwoMonths.value.weekFirstMonth = "";
      weeksShowTwoMonths.value.weekNextMonth = "";
    };

    const handleWeekShowsTwoMonths = () => {
      let firstYearOfTheWeek = weekData.value[0].year;
      let lastYearOfTheWeek = weekData.value[weekData.value.length - 1].year;
      let firstMonthOfTheWeek = weekData.value[0].month;
      let lastMonthOfTheWeek = weekData.value[weekData.value.length - 1].month;
      firstYearOfTheWeek !== lastYearOfTheWeek
        ? weekShowsTwoYears(firstYearOfTheWeek, lastYearOfTheWeek)
        : resetWeekShowsTwoYears();
      firstMonthOfTheWeek !== lastMonthOfTheWeek
        ? weekShowsTwoMonths(firstMonthOfTheWeek, lastMonthOfTheWeek)
        : resetWeekShowsTwoMonths();
    };

    // 顯示雙年份
    const weekShowsTwoYears = (firstYear, nextYear) => {
      weeksShowTwoYears.value.showTwoYears = true;
      weeksShowTwoYears.value.weekFirstYear = firstYear;
      weeksShowTwoYears.value.weekNextYear = nextYear;
    };

    // 顯示雙月份
    const weekShowsTwoMonths = (firstMonth, nextMonth) => {
      weeksShowTwoMonths.value.showTwoMonths = true;
      weeksShowTwoMonths.value.weekFirstMonth = firstMonth;
      weeksShowTwoMonths.value.weekNextMonth = nextMonth;
    };

    // 搜尋選擇企業
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
      resetCompany();
      resetDate();
      resetProject();
      clearMaintainJobSetting();
      const findVal = searchedOptions.value.find(
        option => option.id === companyId
      );
      if (!findVal) return;
      selectedCompany.value = {
        name: `${findVal.name}(${findVal.id})`,
        id: findVal.id
      };
    };

    // 清空選擇企業內容
    const resetCompany = () => {
      selectedCompany.value = { name: "", id: 0 };
    };

    // 清空廣告區間
    const resetDate = () => {
      date_picker.value.dateValue = [];
      selectedDate.value = { start: "", end: "" };
    };

    // 清空選擇專案內容
    const resetProject = () => {
      projectOptions.value = [];
      selectedProject.value = { name: "", id: 0, selfProject: false };
      noMatchProject.value = false;
    };

    // 取日期選擇器時間
    const setTime = async time => {
      resetProject();
      selectedDate.value = {
        start: time.searchTimeStart,
        end: time.searchTimeEnd
      };
      const responseData = await getFilterProjectSuggest({
        customerId: selectedCompany.value.id,
        start: selectedDate.value.start,
        end: selectedDate.value.end
      });
      if (responseData.length > 0) {
        noMatchProject.value = false;
        projectOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: `${item.name}(${item.id})`
          };
        });
      } else {
        noMatchProject.value = true;
      }
    };

    // 選擇專案
    const setSelectedProject = projectId => {
      const findVal = projectOptions.value.find(
        option => option.id === projectId
      );
      if (!findVal) return;
      selectedProject.value = {
        name: `${findVal.name}(${findVal.id})`,
        id: findVal.id,
        selfProject: findVal.selfProject,
        startDate: findVal.startDate,
        endDate: findVal.endDate
      };
      query.value.projectId = selectedProject.value.id;
      dateSwitch.value = "";
    };

    // 切換月或週
    const changeDate = dataType => {
      dateSwitch.value = dataType;
      resetWeekShowsTwoYears();
      resetWeekShowsTwoMonths();
      if (dataType === "week") {
        let dateString = `${selectYear.value}/${selectMonth.value}/1`;
        if (moment(dateString).isBefore(getMaintainData.value.period.start))
          dateString = getMaintainData.value.period.start;
        getWeekData(dateString);
        handleWeekShowsTwoMonths();
        return;
      } else {
        getMonthData();
      }
    };

    // 切換上個月資料判斷，切換月為 0 時，為去年 12 月
    const changeDatePrevMonth = () => {
      if (dateSwitch.value === "week") {
        let firstDate = moment(weekData.value[weekData.value.length - 1].date)
          .clone()
          .subtract(1, "months")
          .startOf("month")
          .format(FORMAT_STRING);
        if (
          moment(firstDate).isBefore(getMaintainData.value.period.start, "day")
        )
          firstDate = getMaintainData.value.period.start;

        getWeekData(firstDate);
        return;
      }
      selectMonth.value -= 1;
      if (selectMonth.value === 0) {
        selectYear.value -= 1;
        selectMonth.value = 12;
      }
      getMonthData();
    };

    // 切換下個月資料判斷，切換月為 13 時，為明年 1 月
    const changeDateNextMonth = () => {
      if (dateSwitch.value === "week") {
        let firstDate = moment(weekData.value[weekData.value.length - 1].date)
          .clone()
          .add(1, "months")
          .startOf("month")
          .format(FORMAT_STRING);
        if (moment(firstDate).isAfter(getMaintainData.value.period.end, "day"))
          firstDate = getMaintainData.value.period.end;

        getWeekData(firstDate);
        return;
      }

      selectMonth.value += 1;
      if (selectMonth.value === 13) {
        selectYear.value += 1;
        selectMonth.value = 1;
      }
      getMonthData();
    };

    const changeDatePrevWeek = () => {
      let lastWeekDate = moment(weekData.value[0].date)
        .clone()
        .subtract(7, "days")
        .format(FORMAT_STRING);
      getWeekData(lastWeekDate);
    };

    const changeDateNextWeek = () => {
      let nextWeekDate = moment(weekData.value[weekData.value.length - 1].date)
        .clone()
        .add(7, "days")
        .format(FORMAT_STRING);
      getWeekData(nextWeekDate);
    };

    // 切換月份
    const switchMonth = type => {
      type === "prev" ? changeDatePrevMonth() : changeDateNextMonth();
    };

    const switchWeek = type => {
      type === "prev" ? changeDatePrevWeek() : changeDateNextWeek();
    };

    const changeSwitchState = (type, actionType) => {
      switchState.value = type;
      type === "week" ? switchWeek(actionType) : switchMonth(actionType);
      resetWeekShowsTwoYears();
      resetWeekShowsTwoMonths();
      if (dateSwitch.value === "week") handleWeekShowsTwoMonths();
    };

    const changeSpecifiedDate = val => {
      if (moment(val).isBefore(getMaintainData.value.period.start, "day"))
        val = new Date(getMaintainData.value.period.start);

      if (dateSwitch.value === "week") {
        getWeekData(moment(val).format(FORMAT_STRING));
        resetWeekShowsTwoYears();
        resetWeekShowsTwoMonths();
        handleWeekShowsTwoMonths();
        return;
      }

      selectYear.value = val.getFullYear();
      selectMonth.value = val.getMonth() + 1;
      getMonthData();
    };

    // 切換指定日期
    const switchDesignatedDate = (year, month, dateString) => {
      selectYear.value = year;
      selectMonth.value = month;
      if (dateSwitch.value === "month") getMonthData();
      else {
        getWeekData(dateString);
        resetWeekShowsTwoYears();
        resetWeekShowsTwoMonths();
      }
    };

    // 上傳檔案
    const uploadFile = event => {
      if (!event.target.files[0]) return;
      uploadExcelFileLoading.value = true;
      uploadExcelFile.value = event.target.files[0];
      uploadExcelFileError.value = false;
      fileUploadSubmit();
    };

    // 上傳檔案送出
    const fileUploadSubmit = async () => {
      let formData = new FormData();
      formData.append("start", selectedDate.value.start);
      formData.append("end", selectedDate.value.end);
      formData.append("file", uploadExcelFile.value);
      try {
        let resData = await postExcelJobSetting({
          customerId: selectedCompany.value.id,
          projectId: selectedProject.value.id,
          formData
        });
        if (resData > 0) {
          Message({
            message: "檔案已上傳",
            center: true,
            customClass: "copy_link_message_box",
            iconClass: "",
            offset: 100
          });
        } else {
          uploadExcelFileError.value = true;
        }
      } catch (e) {
        uploadExcelFileError.value = true;
      } finally {
        uploadExcelFileLoading.value = false;
        uploadExcelFile.value = null;
      }
    };

    const fileClick = () => {
      if (!getMaintainData.value.canEdit) return;
      uploadExcel.value.click();
    };

    // 換頁
    const changePages = ({ page }) => {
      query.value.page = page;
      dateSwitch.value === "week"
        ? getWeekData(moment(weekData.value[0].date).format(FORMAT_STRING))
        : getMonthData();
    };

    // 新增設定
    const createJobSetting = val => {
      const params = {
        projectId: selectedProject.value.id,
        data: val
      };
      updateMaintainJobSetting({ data: val, choice: true });
      postMaintainJobSetting(params);
    };

    // 刪除設定
    const deleteJobSetting = val => {
      const params = {
        projectId: selectedProject.value.id,
        data: val
      };
      updateMaintainJobSetting({ data: val, choice: false });
      putMaintainJobSetting(params);
    };

    // 切換排序
    const changeSettingFirst = () => {
      dateSwitch.value === "month" ? changeDate("month") : changeDate("week");
    };

    return {
      monthData,
      weekData,
      weeksShowTwoYears,
      weeksShowTwoMonths,
      selectedCompany,
      selectedDate,
      searchedOptions,
      selectedProject,
      projectOptions,
      dateSwitch,
      selectYear,
      selectMonth,
      haveDays,
      noMatchProject,
      uploadExcelFileLoading,
      uploadExcelFileError,
      query,
      settingFirstOptions,
      showDataTable,
      getMaintainData,
      disableToPrev,
      disableToNext,
      prevCurrentNextMonthData,
      companySuggestSearch,
      setSelectedCompany,
      setTime,
      setSelectedProject,
      switchDesignatedDate,
      uploadFile,
      fileClick,
      changePages,
      createJobSetting,
      deleteJobSetting,
      changeSettingFirst,
      changeSpecifiedDate,
      changeSwitchState,
      searchCompany,
      date_picker,
      uploadExcel,
      changeDate
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

.no_match_project {
  color: #ea475b;
  margin-top: 6px;
  padding-left: 111px;
}

.project_search_btn {
  text-align: center;
}

.mainitain_loading {
  margin: 100px 0;
}

.expose_setting {
  display: flex;
  align-items: center;
  @include font-common(16px, $font-weight-bold);

  .image_info {
    vertical-align: text-bottom;
  }

  .info_span {
    @include font-common(14px, $font-weight-normal, #7e7e7e);
  }
}

.no_data {
  color: #fd223d;
  text-align: center;
  letter-spacing: 1px;
  margin: 150px 0;
}

.maintain_table_download_link {
  @include font-common(16px, $font-weight-normal);
  width: 1180px;
  background-color: #fff;
  position: sticky;
  top: 60px;
  z-index: 5;

  .data_top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .date_switch {
      font-size: 18px;
      color: #393939;
      display: flex;
      align-items: center;

      span {
        padding: 3px 20px;
        border: 1px solid #ddd;
        cursor: pointer;
        height: 30px;

        &:nth-child(1) {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          border-right: 0px;
        }

        &:nth-child(2) {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          border-left: 0px;
        }

        &.focus {
          border: solid 1px #00afb8;
          background-color: #e6f9fa;
          color: #00afb8;
          font-weight: bold;
        }
      }

      .date_sort {
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 16px;

        ::v-deep .el-select {
          width: 180px;
          margin-left: 8px;
        }
      }
    }

    .upload_block {
      display: flex;
      align-items: center;

      .file-upload {
        display: none;
      }

      .file_upload {
        border-radius: 4px;
        border: dashed 1px #00afb8;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.43;
        color: #00afb8;
        padding: 8px 12px;
        display: inline-flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          border: dashed 1px #39c8d0;
          color: #39c8d0;
          background-color: #e6f9fa;
        }

        &.disabled {
          cursor: not-allowed;
          color: #a9a9a9;
          border-color: #a9a9a9;
          font-weight: normal;

          &:hover {
            background-color: #fff;
          }
        }
      }

      .file_format {
        font-size: 14px;
        font-weight: bold;
      }

      .excel_name {
        color: #1654b9;
        cursor: pointer;
      }

      .button_bg_white_small {
        height: 32px;
        font-size: 14px;
      }
    }
  }

  .data_error {
    text-align: right;
    color: #ea475b;
  }
}
</style>
