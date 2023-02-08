import { defineStore } from "pinia";
import { apiGetCustomer } from "@/apis/project";

const actions = {
  // 取得所有企業資訊(上限1000筆)
  getCustomer() {
    return new Promise(resolve => {
      apiGetCustomer()
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getCustomer", error);
          console.log("payload", payload);
        });
    });
  }
};

export const useProjectStore = defineStore("project", { actions });
