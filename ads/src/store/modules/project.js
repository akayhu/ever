import {
  apiGetCustomerSuggestion,
  apiGetCustomerSuggestionKeyword,
  apiGetProject,
  apiPostProject,
  apiPatchProject,
  apiGetProjectId,
  apiGetProjectRecommend,
  apiGetProjectSearch,
  apiGetProjectSuggestion,
  apiDeleteProjectId
} from "@/apis/project";

export const GET_PROJECT = "GET_PROJECT";
export const GET_PROJECT_ID = "GET_PROJECT_ID";
export const CLEAR_PROJECT_LIST = "CLEAR_PROJECT_LIST";
export const CLEAR_PROJECT = "CLEAR_PROJECT";
export const CAN_EDIT_OWNER = "CAN_EDIT_OWNER";

export const actions = {
  // 選擇企業
  getCustomerSuggestion({}, payload) {
    const apiChooseByKeyword = payload.keyword
      ? apiGetCustomerSuggestionKeyword
      : apiGetCustomerSuggestion;
    return new Promise(resolve => {
      apiChooseByKeyword(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getCustomerSuggestion", error);
          console.log("payload", payload);
        });
    });
  },
  // 依推薦結果查詢專案(列表)
  getProject({ commit }, payload) {
    return new Promise(resolve => {
      apiGetProject(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
          commit(GET_PROJECT, apiResponse);
        })
        .catch(error => {
          console.log("getProject", error);
          console.log("payload", payload);
        });
    });
  },
  // 新增預約專案
  postProject({}, payload) {
    return new Promise(resolve => {
      apiPostProject(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postProject", error);
          console.log("payload", payload);
        });
    });
  },
  // 修改預約專案
  patchProject({}, payload) {
    return new Promise(resolve => {
      apiPatchProject(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchProject", error);
          console.log("payload", payload);
        });
    });
  },
  // 查詢單筆預約專案
  getProjectId({ commit }, payload) {
    return new Promise(resolve => {
      apiGetProjectId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          commit(GET_PROJECT_ID, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProjectId", error);
          console.log("payload", payload);
        });
    });
  },
  // 依關鍵字搜尋專案(預約版位銷用)
  getProjectRecommend({}, payload) {
    return new Promise(resolve => {
      apiGetProjectRecommend(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProjectRecommend", error);
          console.log("payload", payload);
        });
    });
  },
  // 依關鍵字搜尋專案(預約版位銷用)
  getProjectSearch({}, payload) {
    return new Promise(resolve => {
      apiGetProjectSearch(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProjectSearch", error);
          console.log("payload", payload);
        });
    });
  },
  // 依關鍵字推薦企業或專案
  getProjectSuggestion({}, payload) {
    return new Promise(resolve => {
      apiGetProjectSuggestion(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProjectSuggestion", error);
          console.log("payload", payload);
        });
    });
  },
  // 刪除預約專案
  deleteProjectId({}, payload) {
    return new Promise(resolve => {
      apiDeleteProjectId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deleteProjectId", error);
          console.log("payload", payload);
        });
    });
  },
  // 清除列表
  clearProjectList({ commit }) {
    commit(CLEAR_PROJECT_LIST);
  },
  // 清除專案id
  clearProjectId({ commit }) {
    commit(CLEAR_PROJECT);
  },
  // 可編輯預約人員
  patchCanEditOwner({ commit }) {
    commit(CAN_EDIT_OWNER);
  }
};

const projectListInit = {
  // 內容
  content: [],
  // 是否為最後一頁
  last: true,
  // 這一頁回傳幾筆
  numberOfElements: 0,
  // 第幾頁
  page: 0,
  // 一頁幾筆
  size: 0,
  // 總共筆數
  totalElements: 0,
  // 總頁數
  totalPages: 0
};

const projectIdInit = {
  // 結束日期(可能為 null)
  closeDate: "",
  // 企業編號
  customerId: "",
  // 企業名稱
  customerName: "",
  // 是否為空版專案(false:一般專案, true:空版專案)
  freeProject: false,
  // 備註
  note: "",
  // 預約者編號
  owner: "",
  // 預約者名稱
  ownerName: "",
  // 成交價
  price: "",
  // 專案編號
  projectId: 0,
  // 專案名稱
  projectName: "",
  // 開始日期
  startDate: "",
  // 專案狀態(0:提案中, 1:簽回, 2:結案)
  status: 0,
  // 是否可刪除專案
  canDeleteProject: true,
  // 是否可編輯企業
  canEditCustomer: true,
  // 是否可編輯專案名稱
  canEditProjectName: true,
  // 是否可編輯狀態
  canEditStatus: 0,
  // 是否可編輯備註
  canEditNote: true,
  // 是否可編輯成交價
  canEditPrice: true,
  // 是否可編輯空版專案
  canEditFreeProject: true,
  // 是否可編輯預約人員
  canEditOwner: false
};

export const state = {
  projectId: projectIdInit,
  projectList: projectListInit
};

export const mutations = {
  [GET_PROJECT](state, payload) {
    state.projectList = payload;
  },
  [GET_PROJECT_ID](state, payload) {
    state.projectId = payload;
  },
  [CLEAR_PROJECT_LIST]() {
    state.projectList = projectListInit;
  },
  [CLEAR_PROJECT](state) {
    state.projectId = projectIdInit;
  },
  [CAN_EDIT_OWNER](state) {
    state.projectId.canEditOwner = true;
  }
};

export const getters = {
  getProjectData: state => state
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
