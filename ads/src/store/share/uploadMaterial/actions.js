import {
  apiPostMaterial,
  apiDeleteMaterial,
  apiPutMaterial,
  apiGetMaterialReservation
} from "@/apis/material";
import {
  apiPostSpareMaterial,
  apiPutSpareMaterial,
  apiGetSpareMaterial,
  apiDeleteSpareMaterial
} from "@/apis/spareMaterial";
import { apiGetBoardInfo } from "@/apis/board";
import { MUTATIONS_TYPE } from "./mutations";
import {
  materialFormShape as resetMaterialFormShape,
  materialTypeShape as resetMaterialTypeShape,
  materialReservationShape as resetMaterialReservationShape
} from "./state";

export const ACTIONS_TYPE = {
  // materialReservation
  GET_MATERIAL_RESERVATION: "getMaterialReservation",
  PUT_MATERIAL_RESERVATION: "putMaterialReservation",
  POST_MATERIAL_RESERVATION: "postMaterialReservation",
  DELETE_MATERIAL_RESERVATION: "deleteMaterialReservation",
  RESET_MATERIAL_RESERVATION: "resetMaterialReservation",
  // materialType
  GET_MATERIAL_TYPE: "getMaterialType",
  RESET_MATERIAL_TYPE: "resetMaterialType",
  // materialForm
  UPDATE_MATERIAL_FORM: "updateMaterialForm",
  RESET_MATERIAL_FORM: "resetMaterialForm"
};

const TYPE_MAP = {
  IMAGE: "image",
  TEXT: "content",
  FILE: "file"
};

export const common_actions = {
  async [ACTIONS_TYPE.GET_MATERIAL_TYPE]({ commit }, payload) {
    const { boardId, typeId, reservationId } = payload;
    const {
      data: { response: apiResponse }
    } = await apiGetBoardInfo({ boardId, typeId });
    const {
      responseTypeTemplateDetail,
      style,
      device,
      channelName,
      name
    } = apiResponse;
    const materialType = {
      ...responseTypeTemplateDetail,
      style,
      device,
      channelName,
      name,
      reservationId
    };
    commit(MUTATIONS_TYPE.UPDATE_MATERIAL_TYPE, materialType);
    return materialType;
  },
  [ACTIONS_TYPE.UPDATE_MATERIAL_FORM]({ state, commit }, payload) {
    payload.forEach(item => {
      if (item.type === "IMAGE" || item.type === "FILE") {
        commit(MUTATIONS_TYPE.UPDATE_MATERIAL_FORM, {
          updateType: state.materialType.typeId,
          updateKey: `${TYPE_MAP[item.type]}_name_${item.typeGroupNo -
            1}_${item.sort - 1}`,
          value: item.fileName
        });
      }
      commit(MUTATIONS_TYPE.UPDATE_MATERIAL_FORM, {
        updateType: state.materialType.typeId,
        updateKey: `${TYPE_MAP[item.type]}_${item.typeGroupNo - 1}_${item.sort -
          1}`,
        value: item.innerText
      });
      commit(MUTATIONS_TYPE.UPDATE_MATERIAL_FORM, {
        updateType: state.materialType.typeId,
        updateKey: `${TYPE_MAP[item.type]}_url_${item.typeGroupNo -
          1}_${item.sort - 1}`,
        value: item.link
      });
    });
  },
  [ACTIONS_TYPE.RESET_MATERIAL_FORM]({ commit }, payload) {
    const resetter = resetMaterialFormShape[`typeData_${payload}`];
    if (resetter) {
      Object.keys(resetter).forEach(key => {
        commit(MUTATIONS_TYPE.UPDATE_MATERIAL_FORM, {
          updateType: payload,
          updateKey: key,
          value: resetter[key]
        });
      });
    }
  },
  [ACTIONS_TYPE.RESET_MATERIAL_TYPE]({ commit }) {
    commit(MUTATIONS_TYPE.UPDATE_MATERIAL_TYPE, resetMaterialTypeShape);
  },
  [ACTIONS_TYPE.RESET_MATERIAL_RESERVATION]({ commit }) {
    commit(
      MUTATIONS_TYPE.UPDATE_MATERIAL_RESERVATION,
      resetMaterialReservationShape
    );
  }
};

export const material_actions = {
  ...common_actions,
  async [ACTIONS_TYPE.GET_MATERIAL_RESERVATION](
    { state, commit, dispatch },
    payload
  ) {
    const {
      data: { response: apiResponse }
    } = await apiGetMaterialReservation(payload);
    commit(MUTATIONS_TYPE.UPDATE_MATERIAL_RESERVATION, apiResponse);
    if (
      apiResponse.materialResponse &&
      apiResponse.materialResponse.length > 0
    ) {
      dispatch(
        ACTIONS_TYPE.UPDATE_MATERIAL_FORM,
        apiResponse.materialResponse[0].contents
      );
    } else {
      dispatch(ACTIONS_TYPE.RESET_MATERIAL_FORM, state.materialType.typeId);
    }
    return apiResponse;
  },
  async [ACTIONS_TYPE.PUT_MATERIAL_RESERVATION]({}, payload) {
    await apiPutMaterial(payload);
  },
  async [ACTIONS_TYPE.POST_MATERIAL_RESERVATION]({}, payload) {
    await apiPostMaterial(payload);
  },
  async [ACTIONS_TYPE.DELETE_MATERIAL_RESERVATION]({}, payload) {
    await apiDeleteMaterial(payload);
  }
};

export const cushion_actions = {
  ...common_actions,
  async [ACTIONS_TYPE.GET_MATERIAL_RESERVATION](
    { state, commit, dispatch },
    payload
  ) {
    const {
      data: { response: apiResponse }
    } = await apiGetSpareMaterial(payload);
    commit(MUTATIONS_TYPE.UPDATE_MATERIAL_RESERVATION, apiResponse);
    if (
      apiResponse.materialResponse &&
      apiResponse.materialResponse.length > 0
    ) {
      dispatch(
        ACTIONS_TYPE.UPDATE_MATERIAL_FORM,
        apiResponse.materialResponse[0].contents
      );
    } else {
      dispatch(ACTIONS_TYPE.RESET_MATERIAL_FORM, state.materialType.typeId);
    }
    return apiResponse;
  },
  async [ACTIONS_TYPE.PUT_MATERIAL_RESERVATION]({}, payload) {
    await apiPutSpareMaterial(payload);
  },
  async [ACTIONS_TYPE.POST_MATERIAL_RESERVATION]({}, payload) {
    await apiPostSpareMaterial(payload);
  },
  async [ACTIONS_TYPE.DELETE_MATERIAL_RESERVATION]({}, payload) {
    await apiDeleteSpareMaterial(payload);
  }
};

export const close_report_actions = {
  [ACTIONS_TYPE.GET_MATERIAL_TYPE]: common_actions.getMaterialType
};

export const leader_board_actions = {
  [ACTIONS_TYPE.GET_MATERIAL_TYPE]: common_actions.getMaterialType
};
