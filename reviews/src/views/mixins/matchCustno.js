import { apiGetCompaniesCandidate } from "@/apis/company";

export const matchCusnoMixin = {
  methods: {
    getCompanyInfoBack(companyValue) {
      let matchedCompanyLists;
      const payload = { keyword: companyValue };

      return new Promise(resolve => {
        apiGetCompaniesCandidate(payload).then(res => {
          matchedCompanyLists = res.data.response;
          resolve(matchedCompanyLists);
        });
      });
    }
  }
};
