import {
  apiGetClosingProjectSummary,
  apiGetClosingProjectBoardAdSummary,
  apiGetClosingProjectBoardAdData,
  apiGetClosingProjectJobApplyDataSummary,
  apiGetClosingProjectJobApplyDataPeriodSummary,
  apiGetClosingProjectJobApplyData,
  apiGetFilterBoard,
  apiGetMaintainJobSettingCount,
  apiGetMaintainJobSettingReportStatus,
  apiRenderAdvertisingReport,
  apiRenderJobapplyReport
} from "@/apis/report";

import { close_report_actions as uploadMaterialActions } from "../../share/uploadMaterial/actions";
import { mutations as uploadMaterialMutations } from "../../share/uploadMaterial/mutations";
import { state as uploadMaterialState } from "../../share/uploadMaterial/state";

export const ACTIONS_TYPE = {
  GET_FILTER_BOARD: "getFilterBoard",
  GET_CLOSING_PROJECT_SUMMARY: "getClosingProjectSummary",
  GET_CLOSING_PROJECT_BOARD_AD_DATA: "getClosingProjectBoardAdData",
  GET_CLOSING_PROJECT_BOARD_AD_SUMMARY: "getClosingProjectBoardAdSummary",
  GET_CLOSING_PROJECT_JOB_APPLY_DATA_SUMMARY:
    "getClosingProjectJobApplyDataSummary",
  GET_CLOSING_PROJECT_JOB_APPLY_DATA_PERIOD_SUMMARY:
    "getClosingProjectJobApplyDataPeriodSummary",
  GET_CLOSING_PROJECT_JOB_APPLY_DATA: "getClosingProjectJobApplyData",
  GET_MAINTAIN_JOB_SETTING_COUNT: "getMaintainJobSettingCount",
  GET_MAINTAIN_JOB_SETTING_STATUS: "getMaintainJobSettingStatus",
  GENERATE_AD_REPORT: "generateAdReport",
  GENERATE_JOBAPPLY_REPORT: "generateJobapplyReport"
};

export const MUTATIONS_TYPE = {
  UPDATE_SELECTED_DATE: "updateSelectedDate",
  UPDATE_SELECTED_DAY_DATE: "updateSelectedDayDate",
  UPDATE_SELECTED_COMPANY: "updateSelectedCompany",
  UPDATE_SELECTED_PROJECT: "updateSelectedProject",
  UPDATE_ISLOADING: "updateIsLoading",
  UPDATE_IS_HEADER_LOADING: "updateIsHeaderLoading",
  UPDATE_PROJECT_SUMMARY: "updateProjectSummary",
  UPDATE_PROJECT_BOARD_AD: "updateProjectBoardAd",
  UPDATE_PROJECT_BOARD_APPLY: "updateProjectBoardApply",
  UPDATE_FILTER_BOARD: "updateFilterBoard",
  RESET_PAGE_STATE: "resetPageState",
  RESET_PROJECT_BOARD_AD: "resetProjectBoardAd",
  RESET_PROJECT_BOARD_AD_DATA: "resetProjectBoardAdData",
  RESET_PROJECT_BOARD_APPLY: "resetProjectBoardApply"
};

export const GETTERS_TYPE = {
  GET_IS_CLOSING_PROJECT_SUMMARY_QUERY_UPDATED:
    "getIsClosingProjectSummaryQueryUpdated",
  GET_IS_CLOSING_PROJECT_BOARD_AD_QUERY_UPDATED:
    "getIsClosingProjectBoardAdQueryUpdated",
  GET_IS_CLOSING_PROJECT_BOARD_APPLY_QUERY_UPDATED:
    "getIsClosingProjectBoardApplyQueryUpdated",
  GET_IS_CLOSING_PROJECT_BOARD_AD_SET_INTERVAL:
    "getIsClosingProjectBoardAdSetInterval",
  GET_IS_CLOSING_PROJECT_BOARD_APPLY_SET_INTERVAL:
    "getIsClosingProjectBoardApplySetInterval"
};

export const projectSummaryShape = {
  applyGrowthRateHigh: 0,
  applyGrowthRateLow: 0,
  boardApplyConvertionRate: 0,
  click: 0,
  cpa: 0,
  cpc: 0,
  cpm: 0,
  ctr: 0,
  customerId: 0,
  customerName: "",
  days: 0,
  focusJobApplyCount: 0,
  impression: 0,
  price: 0,
  projectId: 0,
  projectName: "",
  startDate: "",
  endDate: "",
  intervalDate: []
};

const pageState = () => {
  return {
    isLoading: false,
    isHeaderLoading: false,
    selectedDate: { start: "", end: "" },
    selectedDayDate: { startEndDate: "" },
    selectedCompany: { id: 0, name: "" },
    selectedProject: { id: 0, name: "" },
    filterBoard: [],
    projectSummary: {
      ...projectSummaryShape,
      query: {
        projectId: 0
      },
      isFetched: false
    },
    projectBoardAd: {
      filter: {
        boardId: 0,
        startDate: "",
        endDate: "",
        periodWeeks: [],
        extension: "csv",
        canGenerateReport: true
      },
      summary: {
        impression: 0,
        click: 0,
        ctr: 0
      },
      table: {
        data: [],
        page: {
          current: 0,
          total: 0
        },
        filter: {
          isByMaterial: true
        },
        isFetched: false
      },
      query: {
        projectId: 0,
        startDate: "",
        endDate: "",
        dateType: "period"
      },
      project: {
        boards: []
      }
    },
    projectBoardApply: {
      filter: {
        isOnlyFocus: true,
        extension: "csv",
        startDate: "",
        endDate: "",
        type: 4,
        canGenerateReport: true,
        periodWeeks: [],
        selectedWeekIndex: 0
      },
      summary: {
        boards: [],
        applyCount: 0,
        viewCount: 0,
        jobSettingCount: 0,
        status: 2
      },
      table: {
        data: [],
        page: {
          current: 0,
          total: 0
        },
        isFetched: false
      },
      query: {
        projectId: 0,
        startDate: "",
        endDate: "",
        dateType: "period",
        type: 3,
        hasEnterDate: false
      }
    }
  };
};

const state = {
  ...pageState(),
  ...uploadMaterialState()
};

const actions = {
  async [ACTIONS_TYPE.GET_FILTER_BOARD]({ commit, state }, payload) {
    const { filter } = payload;
    const {
      data: { response: responseData }
    } = await apiGetFilterBoard({
      projectIds: state.selectedProject.id,
      start: filter?.startDate ?? "",
      end: filter?.endDate ?? ""
    });
    commit(MUTATIONS_TYPE.UPDATE_FILTER_BOARD, responseData);

    if (
      responseData.length > 0 &&
      !responseData.some(
        board => board.id === state.projectBoardAd.filter.boardId
      )
    ) {
      commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
        key: "filter",
        val: {
          boardId: responseData[0].id
        }
      });
    }

    if (!filter || (!filter.startDate && !filter.endDate)) {
      commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
        key: "query",
        val: {
          dateType: "period",
          startDate: state.projectSummary.startDate,
          endDate: state.projectSummary.endDate
        }
      });

      commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
        key: "filter",
        val: { startDate: "", endDate: "" }
      });

      commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
        key: "project",
        val: { boards: responseData }
      });
    }
  },
  async [ACTIONS_TYPE.GET_CLOSING_PROJECT_SUMMARY]({ commit, state }, payload) {
    let query = {
      porjId: state.selectedProject.id,
      start: payload && payload.start ? payload.start : "",
      end: payload && payload.end ? payload.end : ""
    };

    if (!query.start) delete query.start;
    if (!query.end) delete query.end;

    const {
      data: { response: responseData }
    } = await apiGetClosingProjectSummary(query);

    commit(MUTATIONS_TYPE.UPDATE_PROJECT_SUMMARY, {
      ...responseData,
      query: {
        projectId: state.selectedProject.id
      },
      isFetched: true
    });
    commit(MUTATIONS_TYPE.RESET_PROJECT_BOARD_AD);
    commit(MUTATIONS_TYPE.RESET_PROJECT_BOARD_APPLY);
  },
  async [ACTIONS_TYPE.GET_CLOSING_PROJECT_BOARD_AD_SUMMARY](
    { commit, state },
    payload
  ) {
    const {
      filter: { boardId: payloadBoardId }
    } = payload;
    const {
      data: { response: responseData }
    } = await apiGetClosingProjectBoardAdSummary({
      porjId: state.selectedProject.id,
      boardId: payloadBoardId || state.projectBoardAd.filter.boardId,
      start: state.projectBoardAd.filter.startDate,
      end: state.projectBoardAd.filter.endDate
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
      key: "summary",
      val: {
        click: responseData.click,
        ctr: responseData.ctr,
        impression: responseData.impression
      }
    }),
      commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
        key: "filter",
        val: {
          boardId: payloadBoardId
        }
      }),
      commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
        key: "query",
        val: {
          projectId: state.selectedProject.id
        }
      });
  },
  async [ACTIONS_TYPE.GET_CLOSING_PROJECT_BOARD_AD_DATA]({ commit }, payload) {
    if (!state.projectBoardAd.filter.boardId) return;
    const {
      filter: { isByMaterial: payloadIsByMaterial },
      page
    } = payload;
    const {
      data: { response: responseData }
    } = await apiGetClosingProjectBoardAdData({
      page,
      size: 30,
      byMaterial: payloadIsByMaterial,
      porjId: state.selectedProject.id,
      boardId: state.projectBoardAd.filter.boardId,
      start: state.projectBoardAd.filter.startDate,
      end: state.projectBoardAd.filter.endDate
    });

    let customizedTableData = responseData.content.slice();

    customizedTableData.forEach((item, index) => {
      let customizedImg = new Image();
      customizedImg.src = item.previewUrl[0];
      customizedImg.onload = () => {
        customizedTableData[index].imgWidth = customizedImg.width;
        customizedTableData[index].imgHeight = customizedImg.height;
      };
    });

    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
      key: "table",
      val: {
        data: customizedTableData || responseData.content,
        page: {
          page: responseData.page,
          totalElements: responseData.totalElements,
          totalPages: responseData.totalPages
        },
        filter: {
          isByMaterial: payloadIsByMaterial
        },
        isFetched: true
      }
    });
  },
  async [ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA_SUMMARY](
    { commit, state },
    payload
  ) {
    const {
      filter: { week: payloadWeek, isOnlyFocus: payloadIsOnlyFocus }
    } = payload;
    const param = payloadWeek
      ? {
          start: payloadWeek.start,
          end: payloadWeek.end
        }
      : {};
    const {
      data: { response: responseData }
    } = await apiGetClosingProjectJobApplyDataSummary({
      porjId: state.selectedProject.id,
      onlyFocus: payloadIsOnlyFocus,
      ...param
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "summary",
      val: {
        applyCount: responseData.applyCount,
        viewCount: responseData.viewCount,
        boards: responseData.boards
      }
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "filter",
      val: {
        week: {
          dataStart: responseData.dataStart,
          dataEnd: responseData.dataEnd,
          previousStart: responseData.previousStart,
          previousEnd: responseData.previousEnd,
          currentStart: responseData.currentStart,
          currentEnd: responseData.currentEnd,
          nextStart: responseData.nextStart,
          nextEnd: responseData.nextEnd,
          touchStart: responseData.touchStart,
          touchEnd: responseData.touchEnd
        },
        isOnlyFocus: payloadIsOnlyFocus
      }
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "query",
      val: {
        projectId: state.selectedProject.id
      }
    });
  },
  async [ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA_PERIOD_SUMMARY](
    { commit, state, getters },
    payload
  ) {
    const {
      filter: { isOnlyFocus: payloadIsOnlyFocus }
    } = payload;

    const params = {
      porjId: state.selectedProject.id,
      onlyFocus: payloadIsOnlyFocus
    };

    if (
      getters[GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_APPLY_SET_INTERVAL] ||
      state.projectBoardApply.query.dateType !== "period"
    ) {
      params.periodStart = state.projectBoardApply.filter.startDate;
      params.periodEnd = state.projectBoardApply.filter.endDate;
    }

    const {
      data: { response: responseData }
    } = await apiGetClosingProjectJobApplyDataPeriodSummary(params);
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "summary",
      val: {
        applyCount: responseData.applyCount,
        viewCount: responseData.viewCount,
        boards: responseData.boards
      }
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "filter",
      val: {
        isOnlyFocus: payloadIsOnlyFocus
      }
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "query",
      val: {
        projectId: state.selectedProject.id
      }
    });
  },
  async [ACTIONS_TYPE.GET_CLOSING_PROJECT_JOB_APPLY_DATA](
    { commit, state, getters },
    payload
  ) {
    if (
      !state.projectBoardApply.filter.startDate ||
      !state.projectBoardApply.filter.endDate
    )
      return;
    const { page } = payload;
    const {
      data: { response: responseData }
    } = await apiGetClosingProjectJobApplyData({
      page,
      size: 100,
      onlyFocus: state.projectBoardApply.filter.isOnlyFocus,
      porjId: state.selectedProject.id,
      startDate:
        !getters[
          GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_APPLY_SET_INTERVAL
        ] && state.projectBoardApply.query.dateType === "period"
          ? ""
          : state.projectBoardApply.filter.startDate,
      endDate:
        !getters[
          GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_APPLY_SET_INTERVAL
        ] && state.projectBoardApply.query.dateType === "period"
          ? ""
          : state.projectBoardApply.filter.endDate
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "table",
      val: {
        data: responseData.content,
        page: {
          current: responseData.page,
          total: responseData.totalElements
        },
        isFetched: true
      }
    });
  },
  async [ACTIONS_TYPE.GET_MAINTAIN_JOB_SETTING_COUNT](
    { commit, state },
    payload
  ) {
    const {
      data: { response: jobSettingCount }
    } = await apiGetMaintainJobSettingCount({
      projectId: state.selectedProject.id
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "summary",
      val: {
        jobSettingCount
      }
    });
  },
  async [ACTIONS_TYPE.GET_MAINTAIN_JOB_SETTING_STATUS](
    { commit, state },
    payload
  ) {
    const {
      data: { response: status }
    } = await apiGetMaintainJobSettingReportStatus({
      projectId: state.selectedProject.id
    });
    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "summary",
      val: {
        status
      }
    });
  },
  async [ACTIONS_TYPE.GENERATE_AD_REPORT]({ commit, state }) {
    const params = {
      projectId: state.projectBoardAd.query.projectId,
      start: state.projectBoardAd.filter.startDate ?? "",
      end: state.projectBoardAd.filter.endDate ?? "",
      ext: state.projectBoardAd.filter.extension,
      byMaterial: +state.projectBoardAd.table.filter.isByMaterial
    };

    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD, {
      key: "filter",
      val: { canGenerateReport: false }
    });

    try {
      const res = await apiRenderAdvertisingReport(params);
      return res.data.response;
    } catch (err) {
      console.log("generateAdReport error", err);
      console.log("payload", params);
    }
  },
  async [ACTIONS_TYPE.GENERATE_JOBAPPLY_REPORT]({ commit, state }) {
    const startDate = () => {
      return state.projectBoardApply.query.type === 1 ||
        state.projectBoardApply.query.type === 2
        ? state.projectBoardApply.filter.periodWeeks[
            state.projectBoardApply.filter.selectedWeekIndex
          ].startDate
        : state.projectBoardApply.filter.startDate;
    };

    const endDate = () => {
      return state.projectBoardApply.query.type === 1 ||
        state.projectBoardApply.query.type === 2
        ? state.projectBoardApply.filter.periodWeeks[
            state.projectBoardApply.filter.selectedWeekIndex
          ].endDate
        : state.projectBoardApply.filter.endDate;
    };

    const statusType = () => {
      return state.projectBoardApply.query.type === 1 ||
        state.projectBoardApply.query.type === 2 ||
        state.projectBoardApply.query.hasEnterDate
        ? state.projectBoardApply.query.type
        : state.projectBoardApply.filter.type;
    };

    const params = {
      projectId: state.projectBoardApply.query.projectId,
      start: startDate(),
      end: endDate(),
      ext: state.projectBoardApply.filter.extension,
      onlyFocus: state.projectBoardApply.filter.isOnlyFocus,
      type: statusType()
    };

    commit(MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY, {
      key: "filter",
      val: { canGenerateReport: false }
    });

    try {
      const res = await apiRenderJobapplyReport(params);
      return res.data.response;
    } catch (err) {
      console.log("generateJobapplyReport error", err);
      console.log("payload", params);
    }
  },
  ...uploadMaterialActions
};

const mutations = {
  [MUTATIONS_TYPE.UPDATE_SELECTED_DATE](state, payload) {
    state.selectedDate = {
      ...state.selectedDate,
      ...payload
    };
  },
  [MUTATIONS_TYPE.UPDATE_SELECTED_DAY_DATE](state, payload) {
    state.selectedDayDate = {
      ...state.selectedDayDate,
      ...payload
    };
  },
  [MUTATIONS_TYPE.UPDATE_SELECTED_COMPANY](state, payload) {
    state.selectedCompany = { ...payload };
  },
  [MUTATIONS_TYPE.UPDATE_SELECTED_PROJECT](state, payload) {
    state.selectedProject = { ...payload };
  },
  [MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_AD](state, payload) {
    const { key, val } = payload;
    if (state.projectBoardAd[key]) {
      state.projectBoardAd["filter"].canGenerateReport = true;
      state.projectBoardAd[key] = {
        ...state.projectBoardAd[key],
        ...val
      };
    }
  },
  [MUTATIONS_TYPE.UPDATE_PROJECT_BOARD_APPLY](state, payload) {
    const { key, val } = payload;
    if (state.projectBoardApply[key]) {
      state.projectBoardApply["filter"].canGenerateReport = true;
      state.projectBoardApply[key] = {
        ...state.projectBoardApply[key],
        ...val
      };
    }
  },
  [MUTATIONS_TYPE.UPDATE_PROJECT_SUMMARY](state, payload) {
    state.projectSummary = {
      ...state.projectSummary,
      ...payload
    };
  },
  [MUTATIONS_TYPE.UPDATE_FILTER_BOARD](state, payload) {
    state.filterBoard = [...payload];
  },
  [MUTATIONS_TYPE.UPDATE_ISLOADING](state, payload) {
    state.isLoading = payload;
  },
  [MUTATIONS_TYPE.UPDATE_IS_HEADER_LOADING](state, payload) {
    state.isHeaderLoading = payload;
  },
  [MUTATIONS_TYPE.RESET_PAGE_STATE](state) {
    Object.assign(state, pageState());
  },
  [MUTATIONS_TYPE.RESET_PROJECT_BOARD_AD](state) {
    const tableFilter = { ...state.projectBoardAd.table.filter };
    state.projectBoardAd = pageState().projectBoardAd;
    state.projectBoardAd.query.startDate = state.projectSummary.startDate;
    state.projectBoardAd.query.endDate = state.projectSummary.endDate;
    state.projectBoardAd.filter.startDate = "";
    state.projectBoardAd.filter.endDate = "";
    state.projectBoardAd.table.filter = tableFilter;
  },
  [MUTATIONS_TYPE.RESET_PROJECT_BOARD_AD_DATA](state) {
    const tableFilter = { ...state.projectBoardAd.table.filter };
    state.projectBoardAd.table = pageState().projectBoardAd.table;
    state.projectBoardAd.table.filter = tableFilter;
    state.projectBoardAd.summary = pageState().projectBoardAd.summary;
  },
  [MUTATIONS_TYPE.RESET_PROJECT_BOARD_APPLY](state) {
    state.projectBoardApply = pageState().projectBoardApply;
    state.projectBoardApply.query.startDate = state.projectSummary.startDate;
    state.projectBoardApply.query.endDate = state.projectSummary.endDate;
    state.projectBoardApply.filter.startDate = state.projectSummary.startDate;
    state.projectBoardApply.filter.endDate = state.projectSummary.endDate;
  },
  ...uploadMaterialMutations
};

const getters = {
  [GETTERS_TYPE.GET_IS_CLOSING_PROJECT_SUMMARY_QUERY_UPDATED](state) {
    return state.projectSummary.query.projectId !== state.selectedProject.id;
  },
  [GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_AD_QUERY_UPDATED](state) {
    return state.projectBoardAd.query.projectId !== state.selectedProject.id;
  },
  [GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_APPLY_QUERY_UPDATED](state) {
    return state.projectBoardApply.query.projectId !== state.selectedProject.id;
  },
  [GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_AD_SET_INTERVAL](state) {
    return (
      state.projectBoardAd.query.startDate != state.projectSummary.startDate ||
      state.projectBoardAd.query.endDate != state.projectSummary.endDate
    );
  },
  [GETTERS_TYPE.GET_IS_CLOSING_PROJECT_BOARD_APPLY_SET_INTERVAL](state) {
    return (
      state.projectBoardApply.query.startDate !=
        state.projectSummary.startDate ||
      state.projectBoardApply.query.endDate != state.projectSummary.endDate
    );
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
