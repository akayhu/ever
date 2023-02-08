import { defineStore } from "pinia";
import {
  apiGetProduct,
  apiGetProductId,
  apiGetProductBoard,
  apiPutProduct,
  apiGetProductMisSuggest,
  apiPutProductMisSync,
  apiGetProductCode
} from "@/apis/product";

const productListInit = {
  // 資料列表
  content: [],
  // 總頁數
  totalPages: 1,
  // 總共筆數
  totalElements: 1,
  // 是否為最後一頁
  last: true,
  // 一頁幾筆
  size: 10,
  // 第幾頁
  page: 1,
  // 這一頁回傳幾筆
  numberOfElements: 1,
  // loading
  loading: false
};

const productIdInit = {
  // 商品版位
  boardList: [],
  // 新增時間
  createDate: "",
  // 商品代碼(MIS)
  productCode: "",
  // 商品編號
  id: "",
  // 商品名稱
  name: "",
  // 商品狀態 ( 0:未生效/已失效, 1:生效中 )
  status: false,
  // 更新時間
  updateDate: ""
};

const state = () => ({
  storeProductList: productListInit,
  productId: productIdInit
});

const getters = {};

const actions = {
  // 取得商品資訊
  getProductList(payload) {
    this.storeProductList = productListInit;
    this.storeProductList.loading = true;
    return new Promise((resolve, reject) => {
      apiGetProduct(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.storeProductList = apiResponse;
          this.storeProductList.loading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductList", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得單筆商品資訊
  getProductId(payload) {
    return new Promise((resolve, reject) => {
      apiGetProductId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.productId = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 以版位編號查商品
  getProductBoard(payload) {
    return new Promise((resolve, reject) => {
      apiGetProductBoard(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 新增修改商品
  putProduct(payload) {
    return new Promise((resolve, reject) => {
      apiPutProduct(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("putProduct", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得商品AC
  getProductMenu(payload) {
    return new Promise(resolve => {
      apiGetProduct(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductMenu", error);
          console.log("payload", payload);
        });
    });
  },
  // 清除單筆商品資訊
  clearProductId() {
    this.productId = productIdInit;
  },
  // MIS商品名稱推薦
  getProductMisSuggest(payload) {
    return new Promise((resolve, reject) => {
      apiGetProductMisSuggest(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductMisSuggest", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 更新 MIS 商品資訊
  putProductMisSync() {
    return new Promise((resolve, reject) => {
      apiPutProductMisSync()
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("putProductMisSync", error);
          reject(error);
        });
    });
  },
  // 取得單筆商品資訊
  getProductCode(payload) {
    return new Promise((resolve, reject) => {
      apiGetProductCode(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getProductCode", error);
          reject(error);
        });
    });
  }
};

export const useProductStore = defineStore("product", {
  state,
  getters,
  actions
});
