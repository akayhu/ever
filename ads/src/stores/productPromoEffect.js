import { defineStore } from "pinia";
import {
  apiGetProductEffect,
  apiPutProductEffect
} from "@/apis/productEffect.js";
import {
  apiGetProductPromo,
  apiPutProductPromo,
  apiPatchProductPromoIdAction,
  apiGetProductPromoIdApplyId,
  apiGetProductPromoNew,
  apiGetProductPromoId
} from "@/apis/productPromo.js";
import cloneDeep from "lodash/cloneDeep";

const state = () => ({
  // 版位成效資料
  productEffect: {
    // 資料內容
    content: [],
    // loading
    loading: false
  },
  // 新增版位成效原始資料內容，比對用
  originalProductEffect: {
    content: []
  },
  // 取得底價促案列表
  productPromoListData: [],
  // 底價促案列表 id
  productPromoListId: null,
  // 底價促案資料
  productPromo: {
    note: null,
    productPromoActionList: ["SIGN"],
    // 資料內容
    productPromoEffectList: [],
    // loading
    loading: false
  },
  // 新增底價設定原始資料內容，比對用
  originalProductPromo: {
    productPromoEffectList: []
  },
  // 上一版本底價促案資料
  previousVersionProductPromo: {
    year: null,
    quarter: null,
    effectiveDate: null
  },
  // 季度(底價＆成效共用)
  quarter: 1,
  // 列表點編輯的簽核狀態
  audit: 0,
  // 編輯的底價促案 id
  editProductPromoId: null,
  // 取得底價促案列表 loading
  productPromoLoading: false
});

const getters = {
  productEffectList: state => {
    return state.productEffect.content.map((item, index) => {
      item.ctr =
        item.actualImpression && item.actualClick
          ? ((item.actualClick / item.actualImpression) * 100).toFixed(2)
          : 0;
      item.focus = false;
      item.index = index;
      return item;
    });
  },
  originalProductEffectList: state => {
    return state.originalProductEffect.content.map(item => {
      item.ctr =
        item.actualImpression && item.actualClick
          ? ((item.actualClick / item.actualImpression) * 100).toFixed(2)
          : 0;
      return item;
    });
  },
  productEffectUpdateDate: state => {
    if (state.productEffect.content.length === 0) return "- -";
    return new Date(
      state.productEffect.content[0].updateDate
    ).toLocaleDateString("zh-TW");
  },
  productPromoList: state => {
    if (state.productPromo.productPromoEffectList.length === 0) return [];
    return state.productPromo.productPromoEffectList.map((item, index) => {
      item.focus = false;
      item.index = index;
      return item;
    });
  }
};

const actions = {
  // 取得版位成效
  async getProductEffect(payload) {
    this.productEffect.loading = true;
    try {
      const {
        data: { response: apiResponse }
      } = await apiGetProductEffect(payload);
      this.originalProductEffect.content = cloneDeep(apiResponse);
      this.productEffect.content = cloneDeep(apiResponse);
      this.productEffect.loading = false;
      return apiResponse;
    } catch (error) {
      console.log("getProductEffect", error);
      console.log("payload", payload);
    } finally {
      this.productEffect.loading = false;
    }
  },
  // 更新版位成效
  async putProductEffect(payload) {
    try {
      const {
        data: { response: apiResponse }
      } = await apiPutProductEffect(payload);
      return apiResponse;
    } catch (error) {
      console.log("payload", payload);
    }
  },
  // 變更成效季度
  changeQuarter(payload) {
    this.quarter = payload;
  },
  // 取得底價促案列表
  async getProductPromo(payload) {
    this.productPromoLoading = true;
    try {
      const {
        data: { response: apiResponse }
      } = await apiGetProductPromo(payload);
      this.productPromoListData = apiResponse;
      this.productPromoLoading = false;
      return apiResponse;
    } catch (error) {
      console.log("getProductPromo", error);
      console.log("payload", payload);
    }
  },
  // 新增底價促案
  async putProductPromo(payload) {
    try {
      const {
        data: { response: apiResponse }
      } = await apiPutProductPromo(payload);
      this.productPromo.id = apiResponse.id;
      return apiResponse;
    } catch (error) {
      console.log("putProductPromo", error);
      console.log("payload", payload);
    }
  },
  // 取得底價促案
  async getProductPromoId(payload, previousVersion = false) {
    if (!previousVersion) this.productPromo.loading = true;
    try {
      const {
        data: { response: apiResponse }
      } = await apiGetProductPromoId(payload);
      if (!previousVersion) {
        this.productPromo = cloneDeep({ ...apiResponse, loading: false });
        this.originalProductPromo.productPromoEffectList = cloneDeep(
          apiResponse.productPromoEffectList
        );
      } else {
        this.previousVersionProductPromo = apiResponse;
      }
      return apiResponse;
    } catch (error) {
      console.log("getProductPromoId", error);
      console.log("payload", payload);
    }
  },
  // 異動促案狀態
  async patchProductPromoIdAction(payload) {
    try {
      const {
        data: { response: apiResponse }
      } = await apiPatchProductPromoIdAction(payload);
      return apiResponse;
    } catch (error) {
      console.log("patchProductPromoIdAction", error);
      console.log("payload", payload);
    }
  },
  // 取得並套用底價促案
  async getProductPromoIdApplyId(payload) {
    try {
      const {
        data: { response: apiResponse }
      } = await apiGetProductPromoIdApplyId(payload);
      return apiResponse;
    } catch (error) {
      console.log("getProductPromoIdApplyId", error);
      console.log("payload", payload);
    }
  },
  // 取得新增的底價促案
  async getProductPromoNew(payload) {
    this.productPromo.loading = true;
    try {
      const {
        data: { response: apiResponse }
      } = await apiGetProductPromoNew(payload);
      this.productPromo = cloneDeep({ ...apiResponse, loading: false });
      this.originalProductPromo.productPromoEffectList = cloneDeep(
        apiResponse.productPromoEffectList
      );
      return apiResponse;
    } catch (error) {
      console.log("getProductPromoNew", error);
      console.log("payload", payload);
    } finally {
      this.productPromo.loading = false;
    }
  },
  // 清除底價資料
  resettingProductPromoEffectList() {
    this.productPromo.productPromoEffectList = [];
  },
  changeProductPromoListId(payload) {
    this.productPromoListId = payload;
  },
  setEditProductPromoId(payload) {
    this.editProductPromoId = payload;
  },
  changeAudit(payload) {
    this.audit = payload;
  }
};

export const useProductPromoEffectStore = defineStore(
  "productPromoEffectStore",
  {
    state,
    getters,
    actions
  }
);
