import {
  apiGetBoardCompare,
  apiGetCompanyCompare,
  apiGetMaterialCompare,
  apiGetBoardByDayCompare,
  apiGetBoardByDayCompareSummary
} from "@/apis/report";
import { calcWeeks, calcDiffDays } from "@/utils/report/util";

import { leader_board_actions as uploadMaterialActions } from "../../share/uploadMaterial/actions";
import { mutations as uploadMaterialMutations } from "../../share/uploadMaterial/mutations";
import { state as uploadMaterialState } from "../../share/uploadMaterial/state";

export const ACTIONS_TYPE = {
  GET_BOARD_COMPARE: "getBoardCompare",
  GET_COMPANY_COMPARE: "getCompanyCompare",
  GET_MATERIAL_COMPARE: "getMaterialCompare",
  GET_BOARD_BY_DAY_COMPARE: "getBoardByDayCompare",
  GET_BOARD_BY_DAY_COMPARE_SUMMARY: "getBoardByDayCompareSummary"
};

export const MUTATIONS_TYPE = {
  UPDATE_SELECTED_DATE: "updateSelectedDate",
  UPDATE_SELECTED_BOARD: "updateSelectedBoard",
  UPDATE_SELECTED_COMPANY: "updateSelectedCompany",
  UPDATE_ISLOADING: "updateIsLoading",
  UPDATE_BOARD_COMPARE: "updateBoardCompare",
  UPDATE_COMPANY_COMPARE: "updateCompanyCompare",
  UPDATE_MATERIAL_COMPARE: "updateMaterialCompare",
  UPDATE_BOARD_BY_DAY_COMPARE: "updateBoardByDayCompare",
  RESET_PAGE_STATE: "resetPageState"
};

export const GETTERS_TYPE = {
  GET_WEEK_START_TO_END: "getWeekStartToEnd",
  GET_WEEK_START_TO_END_REVERSE: "getWeekStartToEndReverse",
  GET_DAY_START_TO_END: "getDayStartToEnd",
  GET_IS_BOARD_COMPARE_QUERY_UPDATED: "getIsBoardCompareQueryUpdated",
  GET_IS_MATERIAL_COMPARE_QUERY_UPDATED: "getIsMaterialCompareQueryUpdated",
  GET_IS_COMPANY_COMPARE_QUERY_UPDATED: "getIsCompanyCompareQueryUpdated",
  GET_IS_BOARD_BY_DAY_COMPARE_QUERY_UPDATED:
    "getIsBoardByDayCompareQueryUpdated"
};

export const pageState = () => {
  return {
    isLoading: false,
    selectedDate: { start: "", end: "" },
    selectedBoard: [],
    selectedCompany: [],
    boardCompare: {
      data: [],
      page: {
        current: 0,
        total: 0
      },
      filter: {
        sort: {
          type: "",
          orderBy: ""
        }
      },
      query: {
        startDate: "",
        endDate: ""
      },
      isFetched: false
    },
    companyCompare: {
      data: [],
      page: {
        current: 0,
        total: 0
      },
      filter: {
        duration: {
          start: "",
          end: ""
        },
        sort: {
          type: "",
          orderBy: ""
        }
      },
      query: {
        boardIds: "",
        customerIds: "",
        startDate: "",
        endDate: ""
      },
      isFetched: false
    },
    materialCompare: {
      data: [],
      page: {
        current: 0,
        total: 0
      },
      filter: {
        duration: {
          start: "",
          end: ""
        },
        sort: {
          type: "",
          orderBy: ""
        }
      },
      query: {
        boardIds: "",
        customerIds: "",
        startDate: "",
        endDate: ""
      },
      isFetched: false
    },
    boardByDayCompare: {
      summary: {
        imression: 0,
        click: 0,
        ctr: 0,
        sources: []
      },
      data: [],
      page: {
        current: 0,
        total: 0
      },
      filter: {
        board: {
          id: "",
          device: ""
        }
      },
      query: {
        startDate: "",
        endDate: ""
      },
      isFetched: false
    }
  };
};

const state = {
  ...pageState(),
  ...uploadMaterialState()
};

const actions = {
  async [ACTIONS_TYPE.GET_BOARD_COMPARE]({ commit, state }, payload) {
    const {
      filter: { sort: payloadSort },
      page
    } = payload;
    const {
      data: { response: responseData }
    } = await apiGetBoardCompare({
      page,
      size: 20,
      startDate: state.selectedDate.start,
      endDate: state.selectedDate.end,
      [`sort.${payloadSort.type}`]: payloadSort.orderBy
    });
    commit(MUTATIONS_TYPE.UPDATE_BOARD_COMPARE, {
      data: responseData.content,
      page: {
        current: responseData.page,
        total: responseData.totalElements
      },
      filter: {
        sort: {
          type: payloadSort.type,
          orderBy: payloadSort.orderBy
        }
      },
      query: {
        startDate: state.selectedDate.start,
        endDate: state.selectedDate.end
      },
      isFetched: true
    });
  },
  async [ACTIONS_TYPE.GET_COMPANY_COMPARE]({ commit, state }, payload) {
    const {
      filter: { sort: payloadSort, duration: payloadDuration },
      page
    } = payload;
    const boardIds = state.selectedBoard.map(board => board.id).join();
    const customerIds = state.selectedCompany.map(company => company.id).join();
    const {
      data: { response: responseData }
    } = await apiGetCompanyCompare({
      page,
      size: 20,
      boardIds,
      customerIds,
      startDate: payloadDuration.start,
      endDate: payloadDuration.end,
      [`sort.${payloadSort.type}`]: payloadSort.orderBy
    });
    commit(MUTATIONS_TYPE.UPDATE_COMPANY_COMPARE, {
      data: responseData.content,
      page: {
        current: responseData.page,
        total: responseData.totalElements
      },
      filter: {
        duration: {
          start: payloadDuration.start,
          end: payloadDuration.end
        },
        sort: {
          type: payloadSort.type,
          orderBy: payloadSort.orderBy
        }
      },
      query: {
        startDate: state.selectedDate.start,
        endDate: state.selectedDate.end,
        boardIds,
        customerIds
      },
      isFetched: true
    });
  },
  async [ACTIONS_TYPE.GET_MATERIAL_COMPARE]({ commit, state }, payload) {
    const {
      filter: { sort: payloadSort, duration: payloadDuration },
      page
    } = payload;
    const boardIds = state.selectedBoard.map(board => board.id).join();
    const customerIds = state.selectedCompany.map(company => company.id).join();
    const {
      data: { response: responseData }
    } = await apiGetMaterialCompare({
      page,
      size: 20,
      boardIds: state.selectedBoard.map(board => board.id).join(),
      customerIds: state.selectedCompany.map(company => company.id).join(),
      startDate: payloadDuration.start,
      endDate: payloadDuration.end,
      [`sort.${payloadSort.type}`]: payloadSort.orderBy
    });
    commit(MUTATIONS_TYPE.UPDATE_MATERIAL_COMPARE, {
      data: responseData.content,
      page: {
        current: responseData.page,
        total: responseData.totalElements
      },
      filter: {
        duration: {
          start: payloadDuration.start,
          end: payloadDuration.end
        },
        sort: {
          type: payloadSort.type,
          orderBy: payloadSort.orderBy
        }
      },
      query: {
        startDate: state.selectedDate.start,
        endDate: state.selectedDate.end,
        boardIds,
        customerIds
      },
      isFetched: true
    });
  },
  async [ACTIONS_TYPE.GET_BOARD_BY_DAY_COMPARE_SUMMARY](
    { commit, state },
    payload
  ) {
    const {
      filter: { board: payloadBoard }
    } = payload;
    const {
      data: { response: responseData }
    } = await apiGetBoardByDayCompareSummary({
      boardId: payloadBoard.id,
      startDate: state.selectedDate.start,
      endDate: state.selectedDate.end
    });
    commit(MUTATIONS_TYPE.UPDATE_BOARD_BY_DAY_COMPARE, {
      summary: {
        impression: responseData.impression,
        click: responseData.click,
        ctr: responseData.ctr,
        sources: responseData.sources
      }
    });
  },
  async [ACTIONS_TYPE.GET_BOARD_BY_DAY_COMPARE]({ commit, state }, payload) {
    const {
      filter: { board: payloadBoard },
      page
    } = payload;
    const {
      data: { response: responseData }
    } = await apiGetBoardByDayCompare({
      page,
      size: 20,
      boardId: payloadBoard.id,
      startDate: state.selectedDate.start,
      endDate: state.selectedDate.end
    });
    commit(MUTATIONS_TYPE.UPDATE_BOARD_BY_DAY_COMPARE, {
      data: responseData.content,
      page: {
        current: responseData.page,
        total: responseData.totalElements
      },
      filter: {
        board: {
          id: payloadBoard.id,
          device: payloadBoard.device
        }
      },
      query: {
        startDate: state.selectedDate.start,
        endDate: state.selectedDate.end,
        boardIds: state.selectedBoard.map(board => board.id).join()
      },
      isFetched: true
    });
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
  [MUTATIONS_TYPE.UPDATE_SELECTED_BOARD](state, payload) {
    state.selectedBoard = [...payload];
  },
  [MUTATIONS_TYPE.UPDATE_SELECTED_COMPANY](state, payload) {
    state.selectedCompany = [...payload];
  },
  [MUTATIONS_TYPE.UPDATE_BOARD_COMPARE](state, payload) {
    state.boardCompare = {
      ...state.boardCompare,
      ...payload
    };
  },
  [MUTATIONS_TYPE.UPDATE_COMPANY_COMPARE](state, payload) {
    state.companyCompare = {
      ...state.companyCompare,
      ...payload
    };
  },
  [MUTATIONS_TYPE.UPDATE_MATERIAL_COMPARE](state, payload) {
    state.materialCompare = {
      ...state.materialCompare,
      ...payload
    };
  },
  [MUTATIONS_TYPE.UPDATE_BOARD_BY_DAY_COMPARE](state, payload) {
    state.boardByDayCompare = {
      ...state.boardByDayCompare,
      ...payload
    };
  },
  [MUTATIONS_TYPE.UPDATE_ISLOADING](state, payload) {
    state.isLoading = payload;
  },
  [MUTATIONS_TYPE.RESET_PAGE_STATE](state) {
    Object.assign(state, pageState());
  },
  ...uploadMaterialMutations
};

const getters = {
  [GETTERS_TYPE.GET_WEEK_START_TO_END](state) {
    const {
      selectedDate: { start, end }
    } = state;
    return calcWeeks(start, end);
  },
  [GETTERS_TYPE.GET_WEEK_START_TO_END_REVERSE](state) {
    const {
      selectedDate: { start, end }
    } = state;
    return calcWeeks(start, end, true);
  },
  [GETTERS_TYPE.GET_DAY_START_TO_END](state) {
    const {
      selectedDate: { start, end }
    } = state;
    return calcDiffDays(start, end);
  },
  [GETTERS_TYPE.GET_IS_BOARD_COMPARE_QUERY_UPDATED](state) {
    return (
      state.boardCompare.query.startDate !== state.selectedDate.start ||
      state.boardCompare.query.endDate !== state.selectedDate.end
    );
  },
  [GETTERS_TYPE.GET_IS_COMPANY_COMPARE_QUERY_UPDATED](state) {
    return (
      state.companyCompare.query.startDate !== state.selectedDate.start ||
      state.companyCompare.query.endDate !== state.selectedDate.end ||
      state.companyCompare.query.boardIds !==
        state.selectedBoard.map(board => board.id).join() ||
      state.companyCompare.query.customerIds !==
        state.selectedCompany.map(company => company.id).join()
    );
  },
  [GETTERS_TYPE.GET_IS_MATERIAL_COMPARE_QUERY_UPDATED](state) {
    return (
      state.materialCompare.query.startDate !== state.selectedDate.start ||
      state.materialCompare.query.endDate !== state.selectedDate.end ||
      state.materialCompare.query.boardIds !==
        state.selectedBoard.map(board => board.id).join() ||
      state.materialCompare.query.customerIds !==
        state.selectedCompany.map(company => company.id).join()
    );
  },
  [GETTERS_TYPE.GET_IS_BOARD_BY_DAY_COMPARE_QUERY_UPDATED](state) {
    return (
      state.boardByDayCompare.query.startDate !== state.selectedDate.start ||
      state.boardByDayCompare.query.endDate !== state.selectedDate.end ||
      state.boardByDayCompare.query.boardIds !==
        state.selectedBoard.map(board => board.id).join()
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
