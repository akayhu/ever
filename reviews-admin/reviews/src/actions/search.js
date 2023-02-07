import {
  apiGetCompaniesAutocomplete,
  apiGetCompaniesSearch
} from "@/apis/company";

export const CHANGE_SEARCH_KEYWORD = "CHANGE_SEARCH_KEYWORD";
export const POST_COMPANY_AUTOCOMPLETE = "POST_COMPANY_AUTOCOMPLETE";
export const GET_SEARCH_COMPANY_LIST = "GET_SEARCH_COMPANY_LIST";
export const CLEAR_SEARCH = "CLEAR_SEARCH";

export const actions = {
  // 搜尋公司 AC
  changeKeyword({ commit }, payload) {
    commit(CHANGE_SEARCH_KEYWORD);
    return new Promise(resolve => {
      apiGetCompaniesAutocomplete(payload).then(response => {
        resolve(response);
        commit(POST_COMPANY_AUTOCOMPLETE, response.data.response);
      });
    });
  },
  // 搜尋公司列表
  getSearchCompanyList({ commit }, payload) {
    commit(CLEAR_SEARCH);
    apiGetCompaniesSearch(payload).then(response => {
      let apiResponse = response.data.response || {};
      commit(GET_SEARCH_COMPANY_LIST, apiResponse);
    });
  }
};
