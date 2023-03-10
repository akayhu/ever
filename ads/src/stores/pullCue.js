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
  // ???????????????/???????????????(??????????????????)
  quotationData: quotationDataInit,
  // ?????? id
  projectId: 0,
  // ??????????????????????????????Cue??????????????????
  projectAvailableCount: null,
  // ??????????????????(Banner-????????????)
  bannerQuotationProject: bannerQuotationProjectInit,
  // ??????Cue??????????????????
  otherQuotationProject: otherQuotationProjectInit,
  // ?????? Cue ????????????
  notPullCueQuotationProjectReservation: notPullCueQuotationProjectReservationInit,
  // ?????? Cue ????????????
  pullCueQuotationProjectReservation: pullCueQuotationProjectReservationInit,
  // ????????? ?????? Cue ????????????
  prepareProjService: {},
  // ????????? ?????? Cue ????????????
  readyProjServices: readyProjServicesInit,
  // Cue ???????????????????????????
  cuePriceInformation: cuePriceInformationInit,
  // ?????????????????????
  cueTotalMarketPriceHistory: [],
  // ???????????? Banner ??? loading
  cueBannerLoading: false,
  // ????????????????????? loading
  cueProjectLoading: false,
  // ?????? cue loading
  notPullCueLoading: false,
  // ?????? cue loading
  pullCueLoading: false,
  // ??????????????? loading
  progressBarLoading: false,
  // ???????????????????????????
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
    // ????????????????????????????????????
    return this.prepareProjService.checked || false;
  },
  disabledPullCueStatus() {
    /*
    ??????cue?????????0???
    ????????????cue ??? ?????????cue?????????cue?????????0
    ?????????????????????????????????
    */
    return (
      this.pullCueLength === 0 &&
      (!this.allowCue || (this.allowCue && this.notPullCueLength === 0)) &&
      !this.isPrepareProjServiceSelected
    );
  }
};

const actions = {
  // ?????? cue ?????????/?????????
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
  // ??????????????????????????????Cue??????????????????
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
  // ???????????? id
  setProjectId(payload) {
    this.projectId = payload.projectId;
  },
  // ??????????????????(Banner-????????????)
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
  // ??????Cue???????????????
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
  // ?????????????????? Banner ??? loading
  changeCueBannerLoading(payload) {
    this.cueBannerLoading = payload;
  },
  // ??????????????????????????? loading
  changeCueProjectLoading(payload) {
    this.cueProjectLoading = payload;
  },
  // ???????????? cue loading
  changeNotPullCueLoading(payload) {
    this.notPullCueLoading = payload;
  },
  // ???????????? cue loading
  changePullCueLoading(payload) {
    this.pullCueLoading = payload;
  },
  // ????????????????????? loading
  changeProgressBarLoading(payload) {
    this.progressBarLoading = payload;
  },
  // Cue?????????????????????????????????(???????????????)
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
  // ???????????????Cue???
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
  // ???????????????Cue???
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
  // ??????Cue???????????????????????????
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
  // ?????????????????????Cue??????????????????
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
  // ??????Cue??????????????????
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
  // ??????Cue??????????????????
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
  // ????????????????????????????????????Cue??????
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
  // ????????????????????????Cue???(????????????)
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
  // ??????????????????
  resetData() {
    this.quotationData = quotationDataInit;
    this.bannerQuotationProject = bannerQuotationProjectInit;
    this.otherQuotationProject = otherQuotationProjectInit;
    this.readyProjServices = readyProjServicesInit;
    this.notPullCueQuotationProjectReservation = notPullCueQuotationProjectReservationInit;
    this.pullCueQuotationProjectReservation = pullCueQuotationProjectReservationInit;
    this.projectAvailableCount = null;
  },
  // ??????Cue?????????????????????????????????
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
  // ??????Cue?????????????????????????????????
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
  // ?????? cue ???????????????????????????
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
