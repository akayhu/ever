import { defineStore } from "pinia";
import {
  apiGetProduct,
  apiGetCalculatePrice,
  apiGetProductId
} from "@/apis/product";

const state = () => ({
  productList: {
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
  },
  productId: {
    // 商品版位
    boardList: []
  },
  isLoading: false
});

const getters = {};

const actions = {
  async getProductList(keyword, type = 1) {
    this.productList.loading = true;
    const query = {
      status: true,
      keyword,
      type
    };
    try {
      const {
        data: { response: apiResponse }
      } = await apiGetProduct(query);
      this.productList = apiResponse;
      this.productList.loading = false;
      return apiResponse.content;
    } catch (err) {
      console.log("getProductList", error);
      console.log("payload", keyword);
    }
  },
  // 算單筆商品
  async getCalculatePrice(payload) {
    try {
      this.isLoading = true;
      const {
        data: { response: apiResponse }
      } = await apiGetCalculatePrice(payload);
      return apiResponse;
    } catch (error) {
      console.log("payload", payload);
    } finally {
      this.isLoading = false;
    }
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
  }
};

export const useProductStore = defineStore("productStore", {
  state,
  getters,
  actions
});
