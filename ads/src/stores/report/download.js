import { apiGetReportProcessList, apiGetReportStatus } from "@/apis/report";
import { defineStore } from "pinia";

export const useDownloadReportStore = defineStore("downloadReport", {
  state: () => {
    return {
      routeQuery: {
        currentTab: "1"
      },
      pageData: {
        page: 1,
        size: 100,
        totalElements: 0,
        totalPages: 0
      },
      isLoading: false,
      stopFetchFlag: null,
      tableData: []
    };
  },
  actions: {
    updateRouteQuery(params) {
      this.routeQuery = { ...this.routeQuery, ...params };
    },
    getTableDate() {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        const params = {
          page: this.pageData.page,
          size: this.pageData.size,
          accountId: this.routeQuery.selectedAccount.accountId,
          customerId: this.routeQuery.selectedCompany.id,
          projectId: this.routeQuery.selectedProject.id,
          start: this.routeQuery.selectedDate.start,
          end: this.routeQuery.selectedDate.end,
          status: this.routeQuery.selectedStatus.id,
          type: this.routeQuery.currentTab.key
        };

        apiGetReportProcessList(params)
          .then(response => {
            let apiResponse = response.data.response;
            this.tableData = apiResponse.content;
            this.pageData.totalElements = apiResponse.totalElements;
            this.pageData.totalPages = apiResponse.totalPages;
            this.isLoading = false;
            resolve(apiResponse);
          })
          .catch(error => {
            console.log("getTableDate", error);
            console.log("payload", this.routeQuery);
            reject(error);
          });
      });
    },
    async updateDataStatus(payload) {
      apiGetReportStatus(payload)
        .then(response => {
          let apiResponse = response.data.response;
          apiResponse.forEach(responseItem => {
            if (responseItem.status === 1) {
              this.tableData.find(item => item.id === responseItem.id).status =
                responseItem.status;
            }
          });
        })
        .catch(error => {
          console.log("updateDataStatus", error);
          console.log("payload", payload);
        });
    },
    fetchData() {
      this.stopFetchData();
      this.stopFetchFlag = setTimeout(async () => {
        const tokens = this.tableData
          .filter(item => item.status === 0)
          .map(item => item.id);
        if (tokens.length > 0) {
          await this.updateDataStatus(tokens);
        } else {
          this.stopFetchData();
        }

        if (this.tableData.some(item => item.status === 0)) {
          this.fetchData();
        } else {
          this.stopFetchFlag = null;
        }
      }, 30000);
    },
    stopFetchData() {
      if (this.stopFetchFlag != null) {
        clearTimeout(this.stopFetchFlag);
        this.stopFetchFlag = null;
      }
    }
  }
});
