import {
  apiGetReviewsList,
  apiGetReviewsDetail,
  apiGetReviewsInterested
} from "@/apis/reviews";
import {
  apiGetVotesList,
  apiGetVotesDetail,
  apiPutVotes,
  apiGetVotesInterested
} from "@/apis/votes";
import {
  apiGetCompanyCustonInfo,
  apiGetCompaniesJobs,
  apiGetCompanyCompare
} from "@/apis/company";
import { decodeCustno } from "@/utils/index";
import router from "@/layouts/defaultLayout";
// mock data
import companyData from "@/mockData/companyData";
import reviewsData from "@/mockData/reviewsData";
import votesData from "@/mockData/votesData";
import singleReviewsData from "@/mockData/singleReviewsData";
import singleVotesData from "@/mockData/singleVotesData";
import jobListData from "@/mockData/jobListData";
import interestedReviewsData from "@/mockData/interestedReviewsData";
import interestedVotesData from "@/mockData/interestedVotesData";
import compareCompany from "@/mockData/compareCompany";

export const GET_COMPANY_DATA = "GET_COMPANY_DATA";
export const CLEAR_COMPANY_DATA = "CLEAR_COMPANY_DATA";
export const CHANGE_COMPANY_COMPANY_NAME = "CHANGE_COMPANY_COMPANY_NAME";
export const CHANGE_COMPANY_CUSTNO = "CHANGE_COMPANY_CUSTNO";
export const CLEAR_COMPANY_STATUS = "CLEAR_COMPANY_STATUS";
export const GET_COMPANY_REVIEWS_LIST = "GET_COMPANY_REVIEWS_LIST";
export const CLEAR_COMPANY_REVIEWS_LIST = "CLEAR_COMPANY_REVIEWS_LIST";
export const GET_COMPANY_REVIEWS_DETAIL = "GET_COMPANY_REVIEWS_DETAIL";
export const CLEAR_COMPANY_REVIEWS_DETAIL = "CLEAR_COMPANY_REVIEWS_DETAIL";
export const CLEAR_COMPANY_VOTES_LIST = "CLEAR_COMPANY_VOTES_LIST";
export const GET_COMPANY_VOTES_LIST = "GET_COMPANY_VOTES_LIST";
export const CLEAR_COMPANY_VOTES_DETAIL = "CLEAR_COMPANY_VOTES_DETAIL";
export const GET_COMPANY_VOTES_DETAIL = "GET_COMPANY_VOTES_DETAIL";
export const GET_COMPANY_JOBS = "GET_COMPANY_JOBS";
export const CHANGE_VOTES_HAS_VOTE = "CHANGE_VOTES_HAS_VOTE";
export const CHANGE_OPEN_VOTE_LIGHTBOX = "CHANGE_OPEN_VOTE_LIGHTBOX";
export const CHANGE_OPEN_VOTE_LOGIN_LIGHTBOX =
  "CHANGE_OPEN_VOTE_LOGIN_LIGHTBOX";
export const CHANGE_CLOSE_VOTE_LOGIN_LIGHTBOX =
  "CHANGE_CLOSE_VOTE_LOGIN_LIGHTBOX";
export const CHANGE_CLOSE_VOTE_LIGHTBOX = "CHANGE_CLOSE_VOTE_LIGHTBOX";
export const GET_REVIEWS_INTERESTED_LIST = "GET_REVIEWS_INTERESTED_LIST";
export const CLEAR_REVIEWS_INTERESTED_LIST = "CLEAR_REVIEWS_INTERESTED_LIST";
export const GET_VOTES_INTERESTED_LIST = "GET_VOTES_INTERESTED_LIST";
export const CLEAR_VOTES_INTERESTED_LIST = "CLEAR_REVIEWS_INTERESTED_LIST";
export const VOTES_LOADING_TRUE = "VOTES_LOADING_TRUE";
export const VOTES_LOADING_FALSE = "VOTES_LOADING_FALSE";
export const GET_COMPANY_COMPARE = "GET_COMPANY_COMPARE";
export const CLEAN_COMPANY_COMPARE = "CLEAN_COMPANY_COMPARE";

export const actions = {
  // ??????????????????
  getCompanyData({ commit }, payload) {
    commit(CLEAR_COMPANY_DATA);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_COMPANY_DATA, companyData);
    }
    apiGetCompanyCustonInfo({ custno: payload.custno }).then(response => {
      const res = response.data.response;
      const companyData = res || {};
      return commit(GET_COMPANY_DATA, companyData);
    });
  },
  // ????????????????????????
  getCompanyReviewsList({ commit }, payload) {
    commit(CLEAR_COMPANY_REVIEWS_LIST);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_COMPANY_REVIEWS_LIST, reviewsData);
    }
    apiGetReviewsList(payload).then(response => {
      let apiResponse = response.data.response || {};
      commit(GET_COMPANY_REVIEWS_LIST, apiResponse);
    });
  },
  // ???????????????????????????
  getCompanyReviewsInterestedList({ commit }, payload) {
    commit(CLEAR_REVIEWS_INTERESTED_LIST);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_REVIEWS_INTERESTED_LIST, interestedReviewsData);
    }
    apiGetReviewsInterested(payload).then(response => {
      let apiResponse = response.data.response || {};
      commit(GET_REVIEWS_INTERESTED_LIST, apiResponse);
    });
  },
  // ??????????????????
  getCompanyReviewsDetail({ commit }, payload) {
    commit(CLEAR_COMPANY_REVIEWS_DETAIL);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_COMPANY_REVIEWS_DETAIL, singleReviewsData);
    }
    apiGetReviewsDetail({ id: payload.id, custno: payload.custno }).then(
      response => {
        const detailData = response.data.response || {};
        // ??????????????????????????? 404
        if (detailData.auditState === 5) {
          router.replace({
            name: "page404"
          });
        }
        commit(GET_COMPANY_REVIEWS_DETAIL, detailData);
      }
    );
  },
  // ????????????????????????
  getCompanyVotesList({ commit }, payload) {
    commit(CLEAR_COMPANY_VOTES_LIST);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_COMPANY_VOTES_LIST, votesData);
    }
    apiGetVotesList(payload).then(response => {
      let apiResponse = response.data.response || [];
      commit(GET_COMPANY_VOTES_LIST, apiResponse);
    });
  },
  // ???????????????????????????
  getCompanyVotesInterestedList({ commit }, payload) {
    commit(CLEAR_VOTES_INTERESTED_LIST);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_VOTES_INTERESTED_LIST, interestedVotesData);
    }
    apiGetVotesInterested(payload).then(response => {
      let apiResponse = response.data.response || {};
      commit(GET_VOTES_INTERESTED_LIST, apiResponse);
    });
  },
  // ??????????????????
  getCompanyVotesDetail({ commit }, payload) {
    commit(CLEAR_COMPANY_VOTES_DETAIL);
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_COMPANY_VOTES_DETAIL, singleVotesData);
    }
    apiGetVotesDetail({ id: payload.id, custno: payload.custno }).then(
      response => {
        const detailData = response.data.response || {};
        if (
          response.data.response.voteItems &&
          response.data.response.voteItems.length > 0
        ) {
          response.data.response.voteItems.forEach(item => {
            if (item.hasVote) commit(CHANGE_VOTES_HAS_VOTE);
          });
        }
        commit(GET_COMPANY_VOTES_DETAIL, detailData);
      }
    );
  },
  // ??????
  putVotes({ commit }, payload) {
    commit(VOTES_LOADING_TRUE);
    apiPutVotes({
      id: payload.id,
      answers: {
        voteAnswers: [
          {
            itemId: payload.itemId
          }
        ]
      }
    })
      .then(response => {
        let apiResponse = response.data.response.result;
        apiGetVotesDetail({ id: payload.id }).then(response => {
          const detailData = response.data.response || {};
          commit(GET_COMPANY_VOTES_DETAIL, detailData);
          commit(CHANGE_VOTES_HAS_VOTE, apiResponse);
          commit(VOTES_LOADING_FALSE);
        });
      })
      .catch(() => {
        commit(VOTES_LOADING_FALSE);
      });
  },
  // ??????????????? action
  changeVotesHasVote({ commit }) {
    commit(CHANGE_VOTES_HAS_VOTE);
  },
  // ??????????????? lightbox ??????
  changeOpenVoteLoginLightbox({ commit }) {
    commit(CHANGE_OPEN_VOTE_LOGIN_LIGHTBOX);
  },
  // ??????????????? lightbox ??????
  changeCloseVoteLoginLightbox({ commit }) {
    commit(CHANGE_CLOSE_VOTE_LOGIN_LIGHTBOX);
  },
  // ??????????????? lightbox ??????
  changeOpenVoteLightbox({ commit }) {
    commit(CHANGE_OPEN_VOTE_LIGHTBOX);
  },
  // ??????????????? lightbox ??????
  changeCloseVoteLightbox({ commit }) {
    commit(CHANGE_CLOSE_VOTE_LIGHTBOX);
  },
  // ????????????
  getCompanyJobs({ commit }, payload) {
    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_COMPANY_JOBS, jobListData);
    }
    apiGetCompaniesJobs({ custno: payload.custno }).then(response => {
      let apiResponse = response.data.response || { joblist: [] };
      commit(GET_COMPANY_JOBS, apiResponse);
    });
  },
  // ?????? custno
  changeCompanyCustno({ commit }, payload) {
    commit(CHANGE_COMPANY_CUSTNO, payload);
  },
  // ????????????
  clearCompanyStatus({ commit }) {
    commit(CLEAR_COMPANY_STATUS);
  },
  // ????????????????????????
  getCompanyCompare({ commit }, payload) {
    commit(CLEAN_COMPANY_COMPARE);

    if (process.env.VUE_APP_MOCK_SERVER === "true") {
      return commit(GET_COMPANY_COMPARE, compareCompany);
    }
    const compareCustno = payload.map(custno => decodeCustno(custno));
    const query = { custno: compareCustno.join(",") };
    return apiGetCompanyCompare(query).then(response => {
      const res = response.data.response || [];
      const result = [];
      compareCustno.forEach(custno => {
        const company = res.find(item => item.custno === custno) || {};
        result.push(company);
      });
      commit(GET_COMPANY_COMPARE, result);
    });
  },
  // ????????????
  clearCompanyCompare({ commit }) {
    commit(CLEAN_COMPANY_COMPARE);
  },
  // ????????????????????????
  emptyDataCompanyJobs({ commit }) {
    commit(GET_COMPANY_JOBS, { joblist: [] });
  }
};
