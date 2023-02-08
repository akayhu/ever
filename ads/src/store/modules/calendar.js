import { apiGetReservationCalendar } from "@/apis/reservation";
import { apiGetRemark, apiPostRemark } from "@/apis/remark";
// import { layoutMapping } from "@/utils/dateProcessing.js";
import moment from "moment";
import { apiGetfinalSpareMaterialReservation } from "@/apis/spareMaterial";

moment.suppressDeprecationWarnings = true; // 關閉 moment 提示

export const ACTIONS_TYPE = {
  INSERT_MONTH_DATA: "insertMonthData",
  RECOVER_IS_OPEN: "recoverIsOpen",
  CREATE_REMARK: "createRemark",
  GET_REMARK: "getRemark",
  GET_PREVIEW_DATA: "getPreviewData",
  TOGGLE_PAGE: "togglePage"
};

export const MUTATIONS_TYPE = {
  INIT_PAGES: "initPages",
  CHANGE_DEVICE: "changeDevice",
  CHANGE_LOADING: "changeLoading",
  CHANGE_RESERVE_TYPE: "changeReserveType",
  INITIAL_CHANNEL_RESERVATION: "initialChannelReservation",
  CHANGE_CHANNEL_RESERVATION: "changeChannelReservation",
  TOGGLE_PAGE: "togglePage",
  CHANGE_PAGE_ISOPEN: "changePageIsOpen",
  SELECT_PROJECT: "selectProject",
  UPDATE_REMARK: "updateRemark"
};

const today = new Date();
const state = {
  device: "pc",
  reserveType: "sales", // sales or market
  pc: {
    pages: []
  },
  mobile: {
    pages: []
  },
  app: {
    pages: []
  },
  yearMonth: moment(today).format("YYYY-MM"),
  today,
  selectProject: null,
  remarks: {}
};

export const GETTERS = {
  pages: state => {
    const { device } = state;
    return state[device].pages;
  }
};

export const ACTIONS = {
  [ACTIONS_TYPE.INSERT_MONTH_DATA](
    { state, commit },
    { pageIndex, yearMonth, openFirst = false }
  ) {
    if (state[state.device].pages.length === 0) return;
    return new Promise(resolve => {
      const payload = {
        channelId: state[state.device].pages[pageIndex].channelId,
        month: yearMonth || state.yearMonth,
        promotion: state.reserveType == "sales" ? false : true,
        siteId: state[state.device].pages[pageIndex].siteId
      };
      apiGetReservationCalendar(payload)
        .then(resp => {
          commit(MUTATIONS_TYPE.INITIAL_CHANNEL_RESERVATION, { pageIndex });
          if (!resp.data.response) {
            if (openFirst) {
              commit(MUTATIONS_TYPE.CHANGE_PAGE_ISOPEN, {
                pageIndex,
                isOpen: true
              });
            }
            resolve(resp);
            return;
          }

          const { reservations } = resp.data.response;

          const formalData = channelReservationsTransfer(
            reservations,
            "formalData",
            payload.month
          );
          const prepareData = channelReservationsTransfer(
            reservations,
            "prepareData",
            payload.month
          );
          const readyData = readyDataTransfer(reservations);
          const boardsInfo = boardInfoTransfer(reservations);
          const boardsIds = boardsInfo.map(x => x.boardId);
          commit(MUTATIONS_TYPE.CHANGE_CHANNEL_RESERVATION, {
            formalData,
            prepareData,
            readyData,
            pageIndex,
            boardsInfo,
            boardsIds
          });
          if (openFirst) {
            commit(MUTATIONS_TYPE.CHANGE_PAGE_ISOPEN, {
              pageIndex,
              isOpen: true
            });
          }
          resolve(resp);
        })
        .catch(error => {
          console.log("apiGetReservationCalendar", error);
          console.log("payload", payload);
        });
    });
  },
  [ACTIONS_TYPE.RECOVER_IS_OPEN]({ state, commit, dispatch }, newReserveValue) {
    return new Promise(resolve => {
      // 把所有的 開合狀態給“回復”。
      state[state.device].pages.forEach((x, index) => {
        commit(MUTATIONS_TYPE.CHANGE_PAGE_ISOPEN, {
          pageIndex: index,
          isOpen: false
        });
      });
      // 如果是切換 行銷/銷售 額外處理。
      if (newReserveValue?.reserveType) {
        commit(MUTATIONS_TYPE.CHANGE_RESERVE_TYPE, newReserveValue.reserveType);
        dispatch(ACTIONS_TYPE.INSERT_MONTH_DATA, {
          pageIndex: 0,
          yearMonth: newReserveValue?.selectDate
            ? `${newReserveValue.selectDate.selectYear}-${newReserveValue.selectDate.selectMonth}`
            : null,
          openFirst: true
        }).then(() => {
          resolve("all isOpen reset.");
        });
      } else {
        resolve("all isOpen reset.");
      }
    });
  },
  [ACTIONS_TYPE.GET_REMARK]({ state, commit, dispatch }, payload) {
    apiGetRemark(payload)
      .then(resp => {
        commit(MUTATIONS_TYPE.UPDATE_REMARK, resp.data.response);
      })
      .catch(error => {
        console.log("apiGetRemark", error);
        console.log("payload", payload);
      });
  },
  [ACTIONS_TYPE.CREATE_REMARK]({ state, commit, dispatch }, payload) {
    return new Promise(resolve => {
      apiPostRemark(payload)
        .then(resp => {
          commit(MUTATIONS_TYPE.UPDATE_REMARK, resp.data.response);
          resolve("success");
        })
        .catch(error => {
          console.log("apiPostRemark", error);
          console.log("payload", payload);
        });
    });
  },
  [ACTIONS_TYPE.GET_PREVIEW_DATA]({ state, commit, dispatch }, payload) {
    return new Promise(resolve => {
      apiGetfinalSpareMaterialReservation(payload)
        .then(resp => {
          const decided = resp.data.response.filter(x => x.decided == true)[0];
          resolve(decided);
        })
        .catch(error => {
          console.log("apiGetfinalSpareMaterialReservation", error);
          console.log("payload", payload);
        });
    });
  },
  [ACTIONS_TYPE.TOGGLE_PAGE]({ commit }, payload) {
    commit(MUTATIONS_TYPE.TOGGLE_PAGE, payload);
  }
};

export const boardInfoTransfer = reservations => {
  return reservations.map(board => {
    return {
      boardId: board.boardId,
      boardName: board.boardName,
      max: board.max,
      canEdit: board.canEdit
    };
  });
};

export const readyDataTransfer = reservations => {
  return reservations.map(board => {
    return board.readySlot.map(x => {
      return {
        layouEndDay: x.endDay,
        layouEndMonth: x.endMonth,
        layouEndYear: x.endYear,
        layouStartDay: x.startDay,
        layouStartMonth: x.startMonth,
        layouStartYear: x.startYear,
        several: x.several
      };
    });
  });
};

// 轉換成 layoutMapping 可以轉換的格式。
export const channelReservationsTransfer = (
  reservations,
  dataType,
  thisMonth
) => {
  /*
    "prepare": $prepare, // 預備中
    "proposal": $proposal, // 提案中
    "sign_back": $sign_back, // 合約簽回
    "closed": $closed, // 結案 或 作廢
    "effect": $effect, // 成效 PR
    "empty": $empty, // 空版PR
  */
  const srorceType = ["reserve", "prepare"];
  const usage = ["common", "effect", "empty"];
  const project = ["proposal", "sign_back", "closed"];
  const boards = reservations.map(board => {
    return board[dataType].length > 0
      ? board[dataType].map(x => {
          return {
            boardId: board.boardId,
            month: thisMonth,
            max: board.max,
            layouName: x.boardName,
            layouData: x.data.map(y => {
              if (y.reserveStatus == -1) {
                const newOff = moment(
                  `${y.offYear}/${y.offMonth}/${y.offDay}`,
                  "YYYY/MM/DD"
                ).subtract(1, "days");
                y.offYear = newOff.year();
                y.offMonth = newOff.month() + 1;
                y.offDay = newOff.date();
              }

              let layouStatus = "";

              if (y.sourceType === 1) {
                layouStatus = srorceType[y.sourceType];
              }

              if (y.sourceType === 0) {
                if (y.usageStatus > 0) {
                  layouStatus = usage[y.usageStatus];
                } else {
                  layouStatus =
                    y.projectStatus === -1
                      ? "closed"
                      : project[y.projectStatus];
                }
              }

              return {
                userName: y.owner,
                layouStatus: layouStatus,
                layouStartYear: y.startYear,
                layouStartMonth: y.startMonth,
                layouStartDay: y.startDay,
                layouEndYear: (y.reserveStatus == -1 && y.offYear) || y.endYear,
                layouEndMonth:
                  (y.reserveStatus == -1 && y.offMonth) || y.endMonth,
                layouEndDay: (y.reserveStatus == -1 && y.offDay) || y.endDay,
                detail: { ...y.detail },
                selfBooking: y.selfBooking,
                projectStatus: y.projectStatus, // 專案狀態( 0:提案中, 1:簽回, 2:結案 )
                reserveStatus: y.reserveStatus == -1 ? 4 : y.reserveStatus, // 檔期狀態(-1:緊急下架, 0:備取, 1:正取, 2:已有委刊單, 3:已上素材, 4:已上線, 5:執行完畢),有權限者才能看到1以上
                usageStatus: y.usageStatus, // 銷用狀態( 0:一般, 1:成效PR, 2:空版PR )
                sourceType: y.sourceType // 來源類型(0:預約,1:報價) 凡屬性值為1，表示行事曆該筆記錄由報價單而來，非正式預約資料，但會安排與其他正式預約的備取資料一起出現。
              };
            })
          };
        })
      : [
          {
            layouData: [],
            layouName: board.boardName,
            boardId: board.boardId,
            month: thisMonth
          }
        ];
  });
  return boards;
};

export const MUTATIONS = {
  [MUTATIONS_TYPE.INIT_PAGES](state, { payload, device }) {
    state[device].pages = [...state[device].pages, ...payload];
  },
  [MUTATIONS_TYPE.CHANGE_DEVICE](state, device) {
    state.device = device;
  },
  [MUTATIONS_TYPE.CHANGE_LOADING](state, pageIndex) {
    let loading =
      state[state.device].pages[pageIndex][state.reserveType].isLoading;
    state[state.device].pages[pageIndex][
      state.reserveType
    ].isLoading = !loading;
  },
  [MUTATIONS_TYPE.CHANGE_RESERVE_TYPE](state, reserveType) {
    state.reserveType = reserveType;
  },
  [MUTATIONS_TYPE.INITIAL_CHANNEL_RESERVATION](state, { pageIndex }) {
    /* 檔期只有在初始化才會 1.被直接賦值 2.true isInitial */
    state[state.device].pages[pageIndex][state.reserveType].isInitial = true;
  },
  [MUTATIONS_TYPE.TOGGLE_PAGE](state, pageIndex) {
    let status = state[state.device].pages[pageIndex][state.reserveType].isOpen;
    state[state.device].pages[pageIndex][state.reserveType].isOpen = !status;
  },
  [MUTATIONS_TYPE.CHANGE_PAGE_ISOPEN](state, { pageIndex, isOpen }) {
    state[state.device].pages[pageIndex][state.reserveType].isOpen = isOpen;
  },
  [MUTATIONS_TYPE.CHANGE_CHANNEL_RESERVATION](
    state,
    { formalData, prepareData, readyData, pageIndex, boardsInfo, boardsIds }
  ) {
    /* 更換 預約檔期與備取檔期 */
    state[state.device].pages[pageIndex][
      state.reserveType
    ].channelReservations = [...formalData];
    state[state.device].pages[pageIndex][state.reserveType].channelPrepares = [
      ...prepareData
    ];
    state[state.device].pages[pageIndex][state.reserveType].channelReadies = [
      ...readyData
    ];
    state[state.device].pages[pageIndex][state.reserveType].boardsInfo = [
      ...boardsInfo
    ];
    state[state.device].pages[pageIndex][state.reserveType].boardsIds = [
      ...boardsIds
    ];
  },
  [MUTATIONS_TYPE.SELECT_PROJECT](state, projectData) {
    state.selectProject = { ...projectData };
  },
  [MUTATIONS_TYPE.UPDATE_REMARK](state, data) {
    let newRemarks = {};
    data.forEach(x => {
      newRemarks[x.date] = x.description;
    });
    state.remarks = {
      ...state.remarks,
      ...newRemarks
    };
  }
};

export default {
  namespaced: true,
  state: state,
  actions: ACTIONS,
  getters: GETTERS,
  mutations: MUTATIONS
};
