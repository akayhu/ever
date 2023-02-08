import { defineStore } from "pinia";
import {
  apiGetFilterCustomerSuggest,
  apiGetFilterProjectSuggest,
  apiPostExcelJobSetting,
  apiGetMaintainJobSetting,
  apiPostMaintainJobSetting,
  apiPutMaintainJobSetting,
  apiGetMaintainActivityPage
} from "@/apis/report";
import { getDatesString } from "@/utils/dateFormat";
import { calcDays, calcWeeks, testDateBetween } from "@/utils/report/util";

const maintainDataInit = {
  // 使用者可否編輯
  canEdit: true,
  // 內容
  content: [],
  // 客戶編號
  customerId: "",
  // 是否為最後一頁
  last: true,
  // 第幾頁
  number: "",
  // 這一頁回傳幾筆
  numberOfElements: "",
  // 曝光職缺查詢或廣告日期起訖曝光職缺查詢或廣告日期起訖
  period: { start: "", end: "" },
  // 專案編號
  projectId: "",
  // 曝光職缺查詢或廣告日期起訖曝光職缺查詢或廣告日期起訖
  request: { start: "", end: "" },
  // 一頁幾筆
  size: 100,
  // 總共筆數
  totalElements: 1,
  // 總頁數
  totalPages: 1,
  // Loading
  loading: false,
  // 第一次取資料
  firstGetData: false
};

const activityDataInit = {
  // 內容
  content: [],
  // 總頁數
  totalPages: 1,
  // 總共筆數
  totalElements: 1,
  // 是否為最後一頁
  last: true,
  // 一頁幾筆
  size: 20,
  // 第幾頁
  page: 1,
  // 這一頁回傳幾筆
  numberOfElements: "",
  // Loading
  loading: false,
  // 第一次取資料
  firstGetData: false
};

const state = () => ({
  currentTab: "job_setting",
  selectedProject: { name: "", id: 0, selfProject: false },
  selectedCompany: { name: "", id: 0 },
  selectedDate: { start: "", end: "" },
  maintainData: { ...maintainDataInit },
  activityData: { ...activityDataInit }
});

const getters = {
  getTotalWeek(state) {
    const startDate = state.selectedProject.startDate;
    const endDate = state.selectedProject.endDate;
    const ary = calcWeeks(startDate, endDate);
    if (ary % 4 !== 0) {
      const gap = Math.ceil(ary.length / 4) * 4 - ary.length;
      return [
        ...ary,
        ...new Array(gap).fill(0).map(() => ({ start: "", end: "" }))
      ];
    } else {
      return ary;
    }
  },
  getTotalDay(state) {
    const startDate = state.selectedProject.startDate;
    const endDate = state.selectedProject.endDate;
    const ary = calcDays(startDate, endDate);
    if (ary % 7 !== 0) {
      const gap = Math.ceil(ary.length / 7) * 7 - ary.length;
      return [
        ...ary,
        ...new Array(gap).fill(0).map(() => ({ start: "", end: "" }))
      ];
    } else {
      return ary;
    }
  },
  getTableDateWeekData(state) {
    const totalWeeks = this.getTotalWeek;
    const ary = state.activityData.content;
    return ary.map(item => {
      return {
        exposureList: totalWeeks.map(week => {
          return {
            start: week.start,
            end: week.end,
            isExposure: item.date.reduce((acc, date) => {
              if (
                week.start &&
                week.end &&
                testDateBetween(week.start, week.end, date)
              ) {
                acc = true;
              }
              return acc;
            }, false)
          };
        })
      };
    });
  },
  getTableDateDayData(state) {
    const totalDays = this.getTotalDay;
    const ary = state.activityData.content;
    return ary.map(item => {
      return {
        exposureList: totalDays.map(day => {
          return {
            start: day.start,
            startSign: day.startSign,
            isExposure: item.date.reduce((acc, date) => {
              if (day.startSign && day.startSign === date) {
                acc = true;
              }
              return acc;
            }, false)
          };
        })
      };
    });
  }
};

const actions = {
  // 切換 tab 標籤
  updateCurrentTab(payload) {
    this.currentTab = payload;
  },
  // 更新企業
  updateSelectedCompany(payload) {
    this.selectedCompany = { ...payload };
  },
  // 更新專案區間
  updateSelectedDate(payload) {
    this.selectedDate = { ...payload };
  },
  // 更新專案
  updateSelectedProject(payload) {
    this.selectedProject = { ...payload };
  },
  // 依關鍵字與廣告區間篩選有曝光的企業(客戶)
  getFilterCustomerSuggest(payload) {
    return new Promise(resolve => {
      apiGetFilterCustomerSuggest(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getFilterCustomerSuggest", error);
          console.log("payload", payload);
        });
    });
  },
  // 依企業與廣告區間篩選專案
  getFilterProjectSuggest(payload) {
    return new Promise(resolve => {
      apiGetFilterProjectSuggest(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getFilterProjectSuggest", error);
          console.log("payload", payload);
        });
    });
  },
  // 企業資料維護-網頁職缺設定上傳與查詢
  postExcelJobSetting(payload) {
    return new Promise((resolve, reject) => {
      apiPostExcelJobSetting(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postExcelJobSetting", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 查詢專案下設定之職缺資訊(含設定)
  getMaintainJobSetting(payload) {
    this.maintainData = { ...maintainDataInit };
    this.maintainData.loading = true;
    return new Promise(resolve => {
      apiGetMaintainJobSetting(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.maintainData = apiResponse;
          this.maintainData.loading = false;
          this.maintainData.firstGetData = true;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getMaintainJobSetting", error);
          console.log("payload", payload);
        });
    });
  },
  // 清空職缺設定資訊
  clearMaintainJobSetting() {
    this.maintainData = { ...maintainDataInit };
  },
  // 新增專案網頁曝光職缺(日期區間)
  postMaintainJobSetting(payload) {
    this.maintainData.loading = true;
    return new Promise(resolve => {
      apiPostMaintainJobSetting(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postMaintainJobSetting", error);
          console.log("payload", payload);
        });
    });
  },
  // 刪除專案網頁曝光職缺(日期區間)
  putMaintainJobSetting(payload) {
    this.maintainData.loading = true;
    return new Promise(resolve => {
      apiPutMaintainJobSetting(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("putMaintainJobSetting", error);
          console.log("payload", payload);
        });
    });
  },
  // 更新曝光職缺內容(不從API取得，畫面直接更新)
  updateMaintainJobSetting(payload) {
    payload.data.forEach(item => {
      const jobNo = item.jobNo;
      const periodString = getDatesString(item.start, item.end, "YYYY/MM/DD");
      const jobInfo = this.maintainData.content.find(j => j.jobNo === jobNo);
      if (jobInfo) {
        jobInfo.setting.forEach((settingContent, index) => {
          if (periodString.indexOf(settingContent.date) > -1) {
            jobInfo.setting.splice(index, 1, {
              ...settingContent,
              choice: payload.choice
            });
          }
        });
      }
    });
  },
  // 取企業資料維護-活動頁查詢
  getMaintainActivityPage(payload) {
    if (!this.activityData.firstGetData) this.activityData.firstGetData = true;
    this.activityData.loading = true;
    return new Promise(resolve => {
      apiGetMaintainActivityPage({
        porjId: this.selectedProject.id,
        page: payload,
        size: 20
      })
        .then(response => {
          let apiResponse = response.data.response;
          this.activityData = { ...apiResponse, loading: true };
          this.activityData.loading = false;
          this.activityData.firstGetData = true;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getMaintainActivityPage", error);
          console.log("payload", payload);
        });
    });
  }
};

export const useMaintainStore = defineStore("maintain", {
  state,
  getters,
  actions
});
