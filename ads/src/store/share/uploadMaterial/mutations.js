export const MUTATIONS_TYPE = {
  UPDATE_MATERIAL_FORM: "updateMaterialForm",
  UPDATE_MATERIAL_RESERVATION: "updateMaterialReservation",
  UPDATE_MATERIAL_TYPE: "updateMaterialType"
};

export const mutations = {
  [MUTATIONS_TYPE.UPDATE_MATERIAL_FORM](state, payload) {
    const { updateType, updateKey, value } = payload;
    if (
      updateType &&
      updateKey &&
      state.materialForm[`typeData_${updateType}`]
    ) {
      state.materialForm[`typeData_${updateType}`] = {
        ...state.materialForm[`typeData_${updateType}`],
        [updateKey]: value
      };
    }
  },
  [MUTATIONS_TYPE.UPDATE_MATERIAL_RESERVATION](state, payload) {
    state.materialReservation = payload;
  },
  [MUTATIONS_TYPE.UPDATE_MATERIAL_TYPE](state, payload) {
    state.materialType = payload;
  }
};
