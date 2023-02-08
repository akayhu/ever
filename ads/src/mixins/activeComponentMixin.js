export const MATERIAL_COMPONENT_LIST = {
  ORDER_LIST: "ORDER_LIST",
  AD_SLOT: "AD_SLOT",
  AD_UPLOAD_MATERIAL: "AD_UPLOAD_MATERIAL",
  APPOINTMENT_SCHEDULE: "APPOINTMENT_SCHEDULE",
  EMERGENCY: "EMERGENCY",
  COPY_MATERIAL_SCHEDULE: "COPY_MATERIAL_SCHEDULE"
};

export const CUSHION_COMPONENT_LIST = {
  SELECT_TAB: "SELECT_TAB",
  UPLOAD_MATERIAL: "UPLOAD_MATERIAL",
  EXPOSURE: "EXPOSURE"
};

const updateActiveComponentList = componentList => stage => {
  const componentNameList = Object.keys(componentList);
  if (!stage || !componentList[stage])
    return componentList[componentNameList[0]];
  return componentNameList.slice(0, componentNameList.indexOf(stage) + 1);
};

export const materialActiveComponentMixin = {
  data() {
    return {
      componentList: MATERIAL_COMPONENT_LIST,
      activeComponetList: [MATERIAL_COMPONENT_LIST.ORDER_LIST]
    };
  },
  methods: {
    updateActiveComponentList(stage) {
      this.activeComponetList = updateActiveComponentList(
        MATERIAL_COMPONENT_LIST
      )(stage);
    },
    resetActiveComponetList() {
      this.activeComponetList = [];
    }
  }
};

export const cushionActiveComponentMixin = {
  data() {
    return {
      componentList: CUSHION_COMPONENT_LIST,
      activeComponetList: [CUSHION_COMPONENT_LIST.SELECT_TAB]
    };
  },
  methods: {
    updateActiveComponentList(stage) {
      this.activeComponetList = updateActiveComponentList(
        CUSHION_COMPONENT_LIST
      )(stage);
    },
    resetActiveComponetList() {
      this.activeComponetList = [];
    }
  }
};
