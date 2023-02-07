import reviewData from "@/mockData/reviewData";
import reportData from "@/mockData/reportData";
import inquireData from "@/mockData/inquireData";
import companyOffData from "@/mockData/companyOffData";
import logData from "@/mockData/logData";

export const state = {
  mockData: {
    reviewData,
    reportData,
    inquireData,
    companyOffData,
    logData
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
