import {
  apiGetMaterialFinalReservation,
  apiGetMaterialPresignedurl,
  apiPostMaterialUploadZip,
  apiGetMaterialReservationGrouping,
  apiGetSingleMaterial,
  apiPostMaterialDuplicate,
  apiGetMaterialReservation
} from "@/apis/material";
import { apiGetReservationSchedule } from "@/apis/reservation";
import { state as uploadMaterialState } from "../share/uploadMaterial/state";
import { material_actions as uploadMaterialActions } from "../share/uploadMaterial/actions";
import { ACTIONS_TYPE } from "../share/uploadMaterial/actions";
import { mutations as uploadMaterialMutations } from "../share/uploadMaterial/mutations";
import { MUTATIONS_TYPE } from "../share/uploadMaterial/mutations";
import { getters as uploadMaterialGetters } from "../share/uploadMaterial/getters";

export const UPDATE_FINAL_MATERIAL_RESERVATION =
  "UPDATE_FINAL_MATERIAL_RESERVATION";
export const GET_MATERIAL_RESERVATION_GROUPING =
  "GET_MATERIAL_RESERVATION_GROUPING";
export const UPDATE_COPY_MATERIAL_DATA = "UPDATE_COPY_MATERIAL_DATA";
export const GET_SINGLE_MATERIAL = "GET_SINGLE_MATERIAL";
export const GET_MATERIAL_RESERVATION_SCHEDULE =
  "GET_MATERIAL_RESERVATION_SCHEDULE";
export const GET_TWENTY_MATERIAL_RESERVATION =
  "GET_TWENTY_MATERIAL_RESERVATION";

export const pageState = () => {
  return {
    materialExposuresList: [],
    ...uploadMaterialState(),
    materialReservationGrouping: [],
    copyMaterialData: {
      boardId: "",
      orderId: "",
      reservationId: ""
    },
    reservationSchedule: [],
    materialReservationTwenty: {
      materialResponse: []
    }
  };
};

export const actions = {
  // 取得圖片上傳路徑
  getMaterialPresignedurl({}, payload) {
    return new Promise(resolve => {
      apiGetMaterialPresignedurl(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getMaterialPresignedurl", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得正式素材列表
  getMaterialFinalReservation({ commit }, payload) {
    return new Promise(resolve => {
      apiGetMaterialFinalReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          commit(UPDATE_FINAL_MATERIAL_RESERVATION, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getMaterialFinalReservation", error);
          console.log("payload", payload);
        });
    });
  },
  // 上傳壓縮檔
  postMaterialUploadZip({}, payload) {
    return new Promise(resolve => {
      apiPostMaterialUploadZip(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postMaterialUploadZip", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得可複製素材選項
  getMaterialReservationGrouping({ commit }, payload) {
    return new Promise(resolve => {
      apiGetMaterialReservationGrouping(payload)
        .then(response => {
          let apiResponse = response.data.response;
          commit(GET_MATERIAL_RESERVATION_GROUPING, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getMaterialReservationGrouping", error);
          console.log("payload", payload);
        });
    });
  },
  // 取得單一素材(複製素材套用)
  getSingleMaterial({ state, commit, dispatch }, payload) {
    return new Promise(resolve => {
      apiGetSingleMaterial(payload.materialId)
        .then(response => {
          let apiResponse = response.data.response;

          // 複製素材可編輯
          apiResponse.edible = true;

          let res = {
            limit: state.materialReservation.limit,
            materialResponse: [apiResponse],
            page: state.materialReservation.page,
            total: state.materialReservation.total,
            totalPage: state.materialReservation.totalPage
          };

          // 把複製素材的 id 改回原本素材頁籤的 id
          if (payload.materialBookmarkId)
            res.materialResponse[0].id = payload.materialBookmarkId;

          // 把原本複製的狀態改成原本素材頁籤的狀態
          if (payload.materialBookmarkStatus)
            res.materialResponse[0].status = payload.materialBookmarkStatus;

          // 若是新增素材
          if (payload.create) {
            res.materialResponse[0].id = "";
            // 避免新增時不會出現未儲存文案，此地方刪除 title
            delete res.materialResponse[0].title;
            // 清除最後修改資訊
            res.materialResponse[0].updateBy = "";
            res.materialResponse[0].updateDate = "";
          }

          commit(MUTATIONS_TYPE.UPDATE_MATERIAL_RESERVATION, res);
          dispatch(
            ACTIONS_TYPE.UPDATE_MATERIAL_FORM,
            res.materialResponse[0].contents
          );
          resolve(res);
        })
        .catch(error => {
          console.log("getSingleMaterial", error);
          console.log("payload", payload);
        });
    });
  },
  // 儲存複製素材要用的值
  updateCopyMaterialDataAction({ commit }, payload) {
    commit(UPDATE_COPY_MATERIAL_DATA, payload);
  },
  // 依預約編號取得已預約檔期 (複製素材至其他檔期用)
  getMaterialReservationSchedule({ commit }, payload) {
    return new Promise(resolve => {
      apiGetReservationSchedule(payload)
        .then(response => {
          let apiResponse = response.data.response;
          commit(GET_MATERIAL_RESERVATION_SCHEDULE, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getMaterialReservationSchedule", error);
          console.log("payload", payload);
        });
    });
  },
  // 複製素材
  postMaterialDuplicate({}, payload) {
    return new Promise(resolve => {
      apiPostMaterialDuplicate(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postMaterialDuplicate", error);
          console.log("payload", payload);
        });
    });
  },
  getTwentyMaterialReservation({ commit }, payload) {
    return new Promise(resolve => {
      apiGetMaterialReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          commit(GET_TWENTY_MATERIAL_RESERVATION, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getTwentyMaterialReservation", error);
          console.log("payload", payload);
        });
    });
  },
  ...uploadMaterialActions
};

export const state = {
  ...pageState()
};

export const mutations = {
  [UPDATE_FINAL_MATERIAL_RESERVATION](state, payload) {
    state.materialExposuresList = payload;
  },
  resetPageState(state) {
    Object.assign(state, pageState());
  },
  [GET_MATERIAL_RESERVATION_GROUPING](state, payload) {
    state.materialReservationGrouping = payload;
  },
  [UPDATE_COPY_MATERIAL_DATA](state, payload) {
    if (payload.boardId) state.copyMaterialData.boardId = payload.boardId;
    if (payload.orderId) state.copyMaterialData.orderId = payload.orderId;
    if (payload.reservationId)
      state.copyMaterialData.reservationId = payload.reservationId;
  },
  [GET_MATERIAL_RESERVATION_SCHEDULE](state, payload) {
    state.reservationSchedule = payload;
  },
  [GET_TWENTY_MATERIAL_RESERVATION](state, payload) {
    state.materialReservationTwenty = payload;
  },
  ...uploadMaterialMutations
};

export const getters = {
  getMaterialExposuresListData: state => state,
  ...uploadMaterialGetters
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
