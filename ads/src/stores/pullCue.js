import { defineStore } from "pinia";
import { apiGetQuotationOrderId } from "@/apis/quotation";
import {
  apiGetCueBannerId,
  apiGetCueBannerIdReservation,
  apiDeleteCueBannerIdReservation,
  apiPatchCueBannerIdReservation
} from "@/apis/cueBanner";
import {
  apiPostCueProjectId,
  apiDeleteCueProjectId,
  apiGetCueProjectId,
  apiPutCueProjectId,
  apiGetCueQuotationProjectId
} from "@/apis/cueProjectService";
import {
  apiPostCuePriceInformation,
  apiPostCueTotalMarketPrice,
  apiGetCueTotalMarketPriceHistory,
  apiGetProductCalculatePrice,
  apiGetCueTotalMarketPriceChangeApplication
} from "@/apis/cue";
import { apiGetProjectAvailableCount } from "@/apis/project";

const quotationDataInit = {
  id: null,
  orderId: null,
  orderExecutionStartDate: null,
  orderExecutionEndDate: null,
  paymentTaxRate: 0.05
};

const bannerQuotationProjectInit = {
  projectId: null,
  projectAvailable: false,
  cueProducts: []
};

const otherQuotationProjectInit = {
  projectId: null,
  projectAvailable: false,
  cueProjectServices: []
};

const notPullCueQuotationProjectReservationInit = {
  content: [],
  number: 0,
  size: 20,
  totalPages: 0,
  totalElements: 0,
  last: true,
  numberOfElements: 0
};

const pullCueQuotationProjectReservationInit = {
  content: [],
  number: 0,
  size: 20,
  totalPages: 0,
  totalElements: 0,
  last: true,
  numberOfElements: 0
};

const readyProjServicesInit = {
  content: [],
  number: 0,
  size: 20,
  totalPages: 0,
  totalElements: 0,
  last: true,
  numberOfElements: 0
};

const cuePriceInformationInit = {
  allowToCue: false,
  changeMarketPrice: true,
  totalMarketPriceIncludeTax: null,
  totalReserveMarketPriceIncludeTax: null,
  totalCueMarketPriceIncludeTax: null,
  totalCuePriceIncludeTax: null,
  totalPriceIncludeTax: null,
  warning: false,
  currentAppendMarketPriceIncludeTax: null,
  currentAppendPriceIncludeTax: null,
  overMarketPriceIncludeTax: null,
  overPriceIncludeTax: null,
  remainingMarketPriceIncludeTax: null,
  remainingPriceIncludeTax: null
};

const cueApplication = {
  originTotalMarketPrice: 0,
  totalMarketPrice: 0,
  discountPercentage: 0,
  reason: null
};

const state = () => ({
  // 報價單訂單/內服單資料(取需要的資訊)
  quotationData: quotationDataInit,
  // 專案 id
  projectId: 0,
  // 依報價單編號查詢可拉Cue的預約專案數
  projectAvailableCount: null,
  // 查詢合約內容(Banner-商品列表)
  bannerQuotationProject: bannerQuotationProjectInit,
  // 查詢Cue表專案型服務
  otherQuotationProject: otherQuotationProjectInit,
  // 未拉 Cue 檔期預約
  notPullCueQuotationProjectReservation: notPullCueQuotationProjectReservationInit,
  // 已拉 Cue 檔期預約
  pullCueQuotationProjectReservation: pullCueQuotationProjectReservationInit,
  // 專案型 未拉 Cue 檔期預約
  prepareProjService: {},
  // 專案型 已拉 Cue 檔期預約
  readyProjServices: readyProjServicesInit,
  // Cue 表各項金額統計資訊
  cuePriceInformation: cuePriceInformationInit,
  // 總牌價變更歷程
  cueTotalMarketPriceHistory: [],
  // 合約內容 Banner 型 loading
  cueBannerLoading: false,
  // 合約內容專案型 loading
  cueProjectLoading: false,
  // 未拉 cue loading
  notPullCueLoading: false,
  // 已拉 cue loading
  pullCueLoading: false,
  // 進度條金額 loading
  progressBarLoading: false,
  // 總牌價申請變更資料
  cueApplication: cueApplication
});

const getters = {
  notPullCueLength() {
    return this.notPullCueQuotationProjectReservation.content.filter(
      item => item.checked === true
    ).length;
  },
  pullCueLength() {
    return this.pullCueQuotationProjectReservation.content.filter(
      item => item.checked === true
    ).length;
  },
  allowCue() {
    return this.cuePriceInformation.allowToCue;
  },
  projectAvailable() {
    return this.projectAvailableCount ? true : false;
  },
  isPrepareProjServiceSelected() {
    // 其他類型廣吿是否有被勾選
    return this.prepareProjService.checked || false;
  },
  disabledPullCueStatus() {
    /*
    已拉cue長度為0且
    不可以拉cue 或 可以拉cue但未拉cue長度為0
    其他類型廣告沒有被選取
    */
    return (
      this.pullCueLength === 0 &&
      (!this.allowCue || (this.allowCue && this.notPullCueLength === 0)) &&
      !this.isPrepareProjServiceSelected
    );
  }
};

const actions = {
  // 取拉 cue 報價單/內服單
  getPullCueQuotationId(payload) {
    return new Promise((resolve, reject) => {
      apiGetQuotationOrderId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.quotationData = {
            id: apiResponse.id,
            orderId: apiResponse.orderId,
            orderExecutionStartDate: apiResponse.orderExecutionStartDate,
            orderExecutionEndDate: apiResponse.orderExecutionEndDate,
            paymentTaxRate: apiResponse.paymentTaxRate || 0.05
          };
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getPullCueQuotationId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 依報價單編號查詢可拉Cue的預約專案數
  getProjectAvailableCount(payload) {
    return new Promise((resolve, reject) => {
      apiGetProjectAvailableCount(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.projectAvailableCount = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProjectAvailableCount", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 變更專案 id
  setProjectId(payload) {
    this.projectId = payload.projectId;
  },
  // 查詢合約內容(Banner-商品列表)
  getCueBannerId(payload) {
    this.cueBannerLoading = true;
    return new Promise((resolve, reject) => {
      apiGetCueBannerId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.bannerQuotationProject = apiResponse;
          resolve(apiResponse);
          this.cueBannerLoading = false;
        })
        .catch(error => {
          console.log("getNewCueBannerId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 查詢Cue表檔期預約
  getCueBannerIdReservation(payload, nextPage = false) {
    return new Promise((resolve, reject) => {
      apiGetCueBannerIdReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          if (apiResponse.content.length > 0) {
            apiResponse.content.forEach(item => {
              item.checked = false;
            });
          }
          if (!nextPage) {
            payload.status === 0
              ? (this.notPullCueQuotationProjectReservation = apiResponse)
              : (this.pullCueQuotationProjectReservation = apiResponse);
          } else {
            if (payload.status === 0) {
              this.notPullCueQuotationProjectReservation = {
                ...apiResponse,
                content: this.notPullCueQuotationProjectReservation.content
              };
              apiResponse.content.forEach(item => {
                this.notPullCueQuotationProjectReservation.content.push(item);
              });
            } else {
              this.pullCueQuotationProjectReservation = {
                ...apiResponse,
                content: this.pullCueQuotationProjectReservation.content
              };
              apiResponse.content.forEach(item => {
                this.pullCueQuotationProjectReservation.content.push(item);
              });
            }
          }
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getCueBannerIdReservation", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 變更合約內容 Banner 型 loading
  changeCueBannerLoading(payload) {
    this.cueBannerLoading = payload;
  },
  // 變更合約內容專案型 loading
  changeCueProjectLoading(payload) {
    this.cueProjectLoading = payload;
  },
  // 變更未拉 cue loading
  changeNotPullCueLoading(payload) {
    this.notPullCueLoading = payload;
  },
  // 變更已拉 cue loading
  changePullCueLoading(payload) {
    this.pullCueLoading = payload;
  },
  // 變更進度條金額 loading
  changeProgressBarLoading(payload) {
    this.progressBarLoading = payload;
  },
  // Cue表各項金額統計資訊查詢(可進行試算)
  postCuePriceInformation(payload) {
    return new Promise((resolve, reject) => {
      apiPostCuePriceInformation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.cuePriceInformation = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postCuePriceInformation", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 將檔期加入Cue表
  patchCueBannerIdReservation(payload) {
    return new Promise((resolve, reject) => {
      apiPatchCueBannerIdReservation(payload)
        .then(response => {
          let apiResponse = response.data;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("patchCueBannerIdReservation", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 將檔期移出Cue表
  deleteCueBannerIdReservation(payload) {
    return new Promise((resolve, reject) => {
      apiDeleteCueBannerIdReservation(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deleteCueBannerIdReservation", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 變更Cue表可輸入總牌價上限
  postCueTotalMarketPrice(payload) {
    return new Promise((resolve, reject) => {
      apiPostCueTotalMarketPrice(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.cuePriceInformation.changeMarketPrice = true;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postCueTotalMarketPrice", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 依報價專案查詢Cue表專案型服務
  getCueQuotationProjectId(payload) {
    this.cueProjectLoading = true;
    return new Promise((resolve, reject) => {
      apiGetCueQuotationProjectId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.otherQuotationProject = apiResponse;
          this.cueProjectLoading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          this.cueProjectLoading = false;
          console.log("getCueQuotationProjectId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 刪除Cue表專案型服務
  deleteCueProjectId(payload) {
    return new Promise((resolve, reject) => {
      apiDeleteCueProjectId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deleteCueProjectId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 新增Cue表專案型服務
  postCueProjectId(payload) {
    return new Promise((resolve, reject) => {
      apiPostCueProjectId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postCueProjectId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 依專案型服務查詢該服務拉Cue清單
  getCueProjectId(payload) {
    return new Promise((resolve, reject) => {
      apiGetCueProjectId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.prepareProjService = {
            ...apiResponse.prepareProjService,
            checked: false
          };
          this.readyProjServices = apiResponse.readyProjServices;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getCueProjectId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 將專案型服務加入Cue中(無法取消)
  putCueProjectId(payload) {
    return new Promise((resolve, reject) => {
      apiPutCueProjectId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("putCueProjectId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 清除所有資料
  resetData() {
    this.quotationData = quotationDataInit;
    this.bannerQuotationProject = bannerQuotationProjectInit;
    this.otherQuotationProject = otherQuotationProjectInit;
    this.readyProjServices = readyProjServicesInit;
    this.notPullCueQuotationProjectReservation = notPullCueQuotationProjectReservationInit;
    this.pullCueQuotationProjectReservation = pullCueQuotationProjectReservationInit;
    this.projectAvailableCount = null;
  },
  // 取得Cue表商品實際售出價錢資訊
  getProductCalculatePrice(payload) {
    return new Promise((resolve, reject) => {
      apiGetProductCalculatePrice(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductCalculatePrice", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得Cue表可輸入總牌價變更歷程
  getCueTotalMarketPriceHistory(payload) {
    return new Promise((resolve, reject) => {
      apiGetCueTotalMarketPriceHistory(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.cueTotalMarketPriceHistory = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getCueTotalMarketPriceHistory", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取拉 cue 總牌價申請變更資料
  getApplication(payload) {
    return new Promise((resolve, reject) => {
      apiGetCueTotalMarketPriceChangeApplication(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.cueApplication = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getApplication", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  }
};

export const usePullCueStore = defineStore("pullCue", {
  state,
  getters,
  actions
});
