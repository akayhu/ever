export const GETTERS_TYPE = {
  GET_MATERIAL_RESERVATION_EDITABLE: "getMaterialReservationEditable",
  GET_MATERIAL_RESERVATION_DELETABLE: "getMaterialReservationDeletable",
  GET_MATERIAL_FORM_REQUEST_PARAM: "getMaterialFormRequestParam"
};

export const getters = {
  [GETTERS_TYPE.GET_MATERIAL_RESERVATION_EDITABLE](state) {
    const {
      materialReservation: { materialResponse }
    } = state;
    if (materialResponse && materialResponse.length > 0) {
      return materialResponse[0].edible;
    } else {
      return true;
    }
  },
  [GETTERS_TYPE.GET_MATERIAL_RESERVATION_DELETABLE](state) {
    const {
      materialReservation,
      materialReservation: { materialResponse }
    } = state;
    if (materialResponse && materialResponse.length > 0) {
      return materialReservation.totalPage > 0 && materialResponse[0].deletable;
    } else {
      return materialReservation.totalPage > 0;
    }
  },
  [GETTERS_TYPE.GET_MATERIAL_FORM_REQUEST_PARAM](state) {
    const {
      materialType: { typeId },
      materialForm
    } = state;
    const materialFormData = { ...materialForm[`typeData_${typeId}`] } || {};
    return Object.entries(materialFormData)
      .filter(item => {
        return item[0].match(
          /^(content|file|image)((_url|_name?)|(?!(_file|_name)))/g
        );
      })
      .reduce((acc, item) => {
        const groupKey = item[0].match(/[0-9]_([0-9][0-9]?|10)/g);
        if (item[0].match(/url/g)) {
          acc[groupKey] = {
            fileName:
              acc[groupKey] && acc[groupKey].fileName
                ? acc[groupKey].fileName
                : "",
            innerText:
              acc[groupKey] && acc[groupKey].innerText
                ? acc[groupKey].innerText
                : "",
            link: item[1]
          };
        } else if (item[0].match(/name/g)) {
          acc[groupKey] = {
            fileName: item[1],
            innerText:
              acc[groupKey] && acc[groupKey].innerText
                ? acc[groupKey].innerText
                : "",
            link: acc[groupKey] && acc[groupKey].link ? acc[groupKey].link : ""
          };
        } else {
          acc[groupKey] = {
            fileName:
              acc[groupKey] && acc[groupKey].fileName
                ? acc[groupKey].fileName
                : "",
            innerText: item[1],
            link: acc[groupKey] && acc[groupKey].link ? acc[groupKey].link : ""
          };
        }
        return acc;
      }, {});
  }
};
