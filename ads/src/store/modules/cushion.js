import {
  apiGetfinalSpareMaterialReservation,
  apiGetSpareMaterial
} from "@/apis/spareMaterial";
import { state as uploadMaterialState } from "../share/uploadMaterial/state";
import { cushion_actions as uploadMaterialActions } from "../share/uploadMaterial/actions";
import { mutations as uploadMaterialMutations } from "../share/uploadMaterial/mutations";
import { getters as uploadMaterialGetters } from "../share/uploadMaterial/getters";

export const ACTIONS_TYPE = {
  GET_MATERIAL_EXPOSURES_LIST: "getMaterialExposuresList",
  RESET_CUSHION_DATA: "resetCushionData",
  GET_CUSHION_TWENTY_MATERIAL_RESERVATION: "getCushionTwentyMaterialReservation"
};

export const MUTATIONS_TYPE = {
  UPDATE_MATERIAL_EXPOSURES_LIST: "updateMaterialExposuresList",
  RESET_PAGE_STATE: "resetPageState",
  GET_CUSHION_TWENTY_MATERIAL_RESERVATION: "getCushionTwentyMaterialReservation"
};

export const pageState = () => {
  return {
    materialExposuresList: [],
    materialReservationTwenty: {
      materialResponse: []
    },
    ...uploadMaterialState()
  };
};

const actions = {
  async [ACTIONS_TYPE.GET_MATERIAL_EXPOSURES_LIST]({ commit }, payload) {
    const {
      data: { response: responseData }
    } = await apiGetfinalSpareMaterialReservation(payload);
    commit(MUTATIONS_TYPE.UPDATE_MATERIAL_EXPOSURES_LIST, responseData);
  },
  [ACTIONS_TYPE.GET_CUSHION_TWENTY_MATERIAL_RESERVATION]({ commit }, payload) {
    return new Promise(resolve => {
      apiGetSpareMaterial(payload)
        .then(response => {
          let apiResponse = response.data.response;
          commit(
            MUTATIONS_TYPE.GET_CUSHION_TWENTY_MATERIAL_RESERVATION,
            apiResponse
          );
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

const mutations = {
  [MUTATIONS_TYPE.UPDATE_MATERIAL_EXPOSURES_LIST](state, payload) {
    state.materialExposuresList = [...payload];
  },
  [MUTATIONS_TYPE.RESET_PAGE_STATE](state) {
    Object.assign(state, pageState());
  },
  [MUTATIONS_TYPE.GET_CUSHION_TWENTY_MATERIAL_RESERVATION](state, payload) {
    state.materialReservationTwenty = payload;
  },
  ...uploadMaterialMutations
};

const state = {
  ...pageState()
};

const getters = {
  getCushionExposuresListData: state => state,
  ...uploadMaterialGetters
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
