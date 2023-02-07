import reviewsData from "@/mockData/reviewsData";
import votesData from "@/mockData/votesData";
import seenCompanyData from "@/mockData/seenCompanyData";
import companyData from "@/mockData/companyData";
import singleReviewsData from "@/mockData/singleReviewsData";
import singleVotesData from "@/mockData/singleVotesData";
import jobListData from "@/mockData/jobListData";
import interestedReviewsData from "@/mockData/interestedReviewsData";
import interestedVotesData from "@/mockData/interestedVotesData";

export const state = {
  mockData: {
    reviewsList: reviewsData,
    votesList: votesData,
    seenCompany: seenCompanyData,
    company: companyData,
    singleReviews: singleReviewsData,
    singleVotes: singleVotesData,
    jobList: jobListData,
    interestedReviews: interestedReviewsData,
    interestedVotes: interestedVotesData
  }
};

export const getters = {
  getMockData: state => state.mockData
};

export default {
  namespaced: true,
  state,
  getters
};
