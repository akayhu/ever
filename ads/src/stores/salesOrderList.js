import { defineStore } from "pinia";
import { apiGetQuotationFind } from "@/apis/quotation";
import { round } from "@/utils/quotation";

const state = () => ({
  searchQuotation: {
    // 公司別 ( 1:一零四資訊科技(CO1), 4:一零四管顧公司(CO4) )
    account104: 1,
    // 申請人員編
    applicantId: null,
    // 客戶編號
    customerId: null,
    // 結束日期
    endDate: null,
    // 開始日期
    startDate: null,
    // 報價單編號
    id: null,
    // 訂單/委刊單編號 ( 報價單轉訂單後產生 )
    orderId: null,
    // 報價單狀態 (1:草稿, 2:報價簽核中, 3:報價成立, 4:轉訂單簽核中, 5:訂單成立, 6:作廢, 7:退刊, 8:駁回/抽單, 9:結案)
    queryStatus: 1,
    // 業務員員編
    salesId: null,
    // 頁數
    page: 1,
    // 每頁筆數
    size: 20,
    // 類型 ( 0:報價單, 1:內服單-內部行銷使用(含內部計價), 2:內服單-新客戶試用 )
    typeList: [0]
  },
  quotationList: {
    // 內容
    content: [],
    // 是否為最後一頁
    last: true,
    // 這一頁回傳幾筆
    numberOfElements: 0,
    // 第幾頁
    page: 1,
    // 一頁幾筆
    size: 20,
    // 總共筆數
    totalElements: 0,
    // 總頁數
    totalPages: 1,
    // 讀取中
    loading: false,
    // 是否點擊查詢
    isSearch: false
  }
});

const getters = {
  getQuotationList: state =>
    state.quotationList.content.map(item => {
      return {
        ...item,
        discountPercentageLabel:
          item.discountPercentage > 1 || item.discountPercentage === 0
            ? "- -"
            : round(item.discountPercentage * 10, 1)
      };
    })
};

const actions = {
  // 取報價單列表資料
  getQuotationListData(type = 0, page) {
    return new Promise((resolve, reject) => {
      this.quotationList.loading = true;
      this.quotationList.isSearch = true;
      this.searchQuotation.typeList = type === 1 ? [1, 2] : [0]; // 內服單 : 報價單
      if (page) this.searchQuotation.page = page;
      // 查詢報價單號或訂單單號時，不帶狀態
      if (this.searchQuotation.id || this.searchQuotation.orderId) {
        this.searchQuotation.queryStatus = null;
      }

      apiGetQuotationFind(this.searchQuotation)
        .then(response => {
          let apiResponse = response.data.response;
          this.quotationList = {
            ...apiResponse,
            loading: false,
            isSearch: true
          };
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getQuotationListDate", error);
          reject(error);
        })
        .finally(() => {
          this.quotationList.loading = false;
          this.quotationList.isSearch = true;
        });
    });
  }
};

export const useSalesOrderListStore = defineStore("salesOrderList", {
  state,
  getters,
  actions
});
