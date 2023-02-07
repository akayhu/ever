import {
  apiGetCompanyOffLists,
  apiGetCompany,
  apiPostCompanyOnOff
} from "@/apis/company";

export const GET_COMPANY_OFF_LISTS = "GET_COMPANY_OFF_LISTS";
export const GET_COMPANY = "GET_COMPANY";
export const POST_COMPANY_ON_OFF = "POST_COMPANY_ON_OFF";
export const CLEAR_COMPANY_OFF_LISTS = "CLEAR_COMPANY_OFF_LISTS";
export const UNDEFINED_COMPANY = "UNDEFINED_COMPANY";

// 公司資料初始值
const companyDataInit = {
  companyName: "",
  custno: 0,
  isPublic: false,
  reviewCount: 0,
  scoreOverall: 0,
  searchLoadingEnd: false,
  voteCount: 0
};

// 申訴列表初始值
const companyOffListInit = {
  currentPage: 1,
  hasMorePages: false,
  items: [],
  lastPage: 1,
  perPage: "10",
  total: 0,
  loadingEnd: false
};

const state = {
  company: {
    companyData: companyDataInit,
    companyList: companyOffListInit
  }
};

export const actions = {
  // 公司下架列表
  getCompanyOffLists({ commit }, payload) {
    commit(CLEAR_COMPANY_OFF_LISTS);
    apiGetCompanyOffLists(payload).then(response => {
      let apiResponse = response.data.response;
      commit(GET_COMPANY_OFF_LISTS, apiResponse);
    });
  },
  // 單筆搜尋公司
  getCompany({ commit }, payload) {
    apiGetCompany({ custno: payload }).then(response => {
      let apiResponse = response.data.response;
      commit(GET_COMPANY, apiResponse);
    });
  },
  // 上下架公司
  postCompanyOnOff({ commit }, payload) {
    apiPostCompanyOnOff(payload).then(() => {
      commit(CLEAR_COMPANY_OFF_LISTS);
    });
  },
  // 查無此公司
  setUndefinedCompany({ commit }) {
    commit(UNDEFINED_COMPANY);
  }
};

export const mutations = {
  // 公司下架列表
  [GET_COMPANY_OFF_LISTS](state, payload) {
    state.company.companyList = payload;
    state.company.companyList.loadingEnd = true;
  },
  // 單筆搜尋公司資料
  [GET_COMPANY](state, payload) {
    state.company.companyData = payload;
    state.company.companyData.searchLoadingEnd = true;
  },
  // 清除列表狀態
  [CLEAR_COMPANY_OFF_LISTS](state) {
    state.company.companyData = companyDataInit;
    state.company.companyData.searchLoadingEnd = false;
    state.company.companyList = companyOffListInit;
  },
  // 查不到公司
  [UNDEFINED_COMPANY](state) {
    state.company.companyData.companyName = "";
    state.company.companyData.searchLoadingEnd = true;
  }
};

export const getters = {
  getCompanyData: state => state.company
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
