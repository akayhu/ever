import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import { DateSlashFormat } from "@/utils/dateFormat.js";
import { uuid } from "@/utils/util";
import { defineStore } from "pinia";
import {
  apiGetQuotationId,
  apiPostQuotation,
  apiPatchQuotationId,
  apiGetQuotationFind
} from "@/apis/quotation";

const STATUS = {
  draft: 0, // 草稿
  finished: 1, // 完稿
  pending: 2, // 簽核中
  approved: 3, // 成立
  rejected: 96, // 駁回
  canceled: 97, // 抽單
  invalid: 98, // 作廢
  closed: 99 // 結案
};

const STATUS_TEXT = {
  0: "草稿",
  1: "完稿",
  2: "簽核中",
  3: "成立",
  96: "駁回",
  97: "抽單",
  98: "作廢",
  99: "結案"
};

const useStore = defineStore("internalOrder", {
  state: () => ({
    query: {
      customerId: null,
      startDate: null,
      endDate: null,
      salesId: null,
      id: null,
      queryStatus: 1,
      account104: 1,
      size: 20,
      page: 1,
      typeList: [1, 2]
    },
    listData: {
      content: [],
      last: false,
      numberOfElements: 0,
      page: 1,
      size: 20,
      totalElements: 0,
      totalPages: 1
    },
    formData: {
      account104: 1,
      type: null,
      applicantId: null,
      bu: null,
      customerId: null,
      customerName: null,
      name: null,
      note: null,
      totalMarketPrice: null,
      status: STATUS.draft
      // projects: [{ id: 1, name: { label: "", value: -1 } }],
      // products: [
      //   {
      //     projectId: 1,
      //     tempId: 1,
      //     name: { label: "", value: -1 },
      //     start: "",
      //     end: "",
      //     giveAway: false,
      //     qry: "",
      //     unit: { label: "週", value: 0 }
      //   }
      // ]
    },
    projectList: [],
    productList: [],
    oriFormData: { projects: [], products: [] },
    isSearch: false,
    isLoading: false
  }),
  getters: {
    statusText: state => {
      return STATUS_TEXT[state.formData.status];
    }
    // groupByProject: state => {
    //   return state.formData.products.reduce((groups, product) => {
    //     const key = product.projectId;
    //     groups[key] ||= [];
    //     groups[key].push(product);
    //     return groups;
    //   }, {});
    // }
    // test() {
    //   let result = {};
    //   Object.entries(this.groupByProject).forEach(
    //     ([projectId, productGroups]) => {
    //       // console.log(projectId);
    //       // console.log(productGroups);
    //       Object.entries(productGroups).forEach(([productId, productList]) => {
    //         console.log(productId);
    //         console.log(productList);
    //         productList.forEach(product => {
    //           result[`${projectId}_${productId}`]
    //         });
    //       });
    //     }
    //   );
    //   return "";
    // }
  },
  actions: {
    // 取得列表
    async getList() {
      try {
        this.isSearch = true;
        this.isLoading = true;
        let res = await apiGetQuotationFind(this.query);
        let apiResponse = res.data.response;
        this.listData = apiResponse;
        this.isLoading = false;
        return apiResponse;
      } catch (err) {
        console.log("getList", err);
        console.log("payload", this.query);
      }
    },
    // 取得內服單
    async fetchData(id) {
      try {
        this.isLoading = true;
        const res = await apiGetQuotationId({ id });
        const data = res.data.response;

        this.formData = {
          ...cloneDeep(data)
          // projects: [{ id: 1, name: { label: "", value: -1 } }],
          // products: [
          //   {
          //     projectId: 1,
          //     tempId: 1,
          //     name: { label: "", value: -1 },
          //     start: "",
          //     end: "",
          //     giveAway: false,
          //     qry: "",
          //     unit: { label: "週", value: 0 }
          //   }
          // ]
        };

        // this.projectList = data.projectList.map(p => {
        //   let { quotationAdList, ...project } = p;
        //   return project;
        // });
        this.projectList = data.projectList.map(p => ({ ...p, tempId: p.id }));
        this.productList = data.projectList.reduce((acc, project) => {
          acc.push(
            ...project.quotationAdList.map(p => ({
              ...p,
              tempId: p.id,
              quotationStartDate: p.quotationStartDate
                ? moment(p.quotationStartDate).format(DateSlashFormat)
                : null,
              quotationEndDate: p.quotationEndDate
                ? moment(p.quotationEndDate).format(DateSlashFormat)
                : null
            }))
          );
          return acc;
        }, []);
        this.oriFormData = {
          ...cloneDeep(data),
          projects: [],
          products: []
        };
        this.isLoading = false;
      } catch (err) {
        console.log("fetchData", err);
        console.log("payload", id);
      }
    },
    // 建立內服單
    async createOrder() {
      try {
        this.isLoading = true;
        this.formData.salesId = this.formData.applicantId;
        await apiPostQuotation(this.formData);
      } catch (err) {
        console.log("createOrder", err);
        console.log("payload", this.formData);
      } finally {
        this.isLoading = false;
      }
    },
    // 編輯內服單
    async editOrder() {
      try {
        this.isLoading = true;
        await apiPatchQuotationId(this.formData);
        this.isLoading = false;
      } catch (err) {
        console.log("editOrder", err);
        console.log("payload", this.formData);
      } finally {
        this.isLoading = false;
      }
    },
    // 儲存
    async saveOrder() {
      this.projectList = this.projectList.filter(project => project.name);
      this.projectList.forEach(project => {
        project.quotationAdList = this.productList
          .filter(
            product => product.projectId === project.tempId && product.productId
          )
          .map(({ tempId, projectId, ...product }) => ({
            ...product,
            free: product.free ? 1 : 0,
            quotationStartDate: product.quotationStartDate
          }));
      });
      this.formData.projectList = this.projectList;
      console.log(JSON.stringify(this.formData));
      if (this.formData.id) {
        await this.editOrder();
      } else {
        await this.createOrder();
      }
    },
    addProduct(projectId) {
      let newId = uuid();
      this.productList.push({
        tempId: newId,
        deduction: 0,
        discountPercentage: 0,
        floorPrice: 0,
        free: 0,
        giveaway: 0,
        id: null,
        marketPrice: 0,
        note: "",
        price: 0,
        productId: null,
        productName: null,
        projectId: projectId,
        quantity: 0,
        quotationId: null,
        quotationStartDate: "",
        quotationEndDate: "",
        unit: "WEEK",
        unitPrice: 0,
        usage: 0
      });

      return newId;
    },
    removeProduct(projectId, productTempId) {
      const index = this.productList.findIndex(p => p.tempId == productTempId);
      if (index === -1) return;
      this.productList.splice(index, 1);

      const projects = this.productList.filter(p => p.projectId === projectId);
      if (projects.length === 0) {
        this.addProduct(projectId);
      }
    },
    removeEmptyProduct() {
      this.productList = this.productList.filter(product => product.productId);
    },
    createProject() {
      const projectId = uuid();
      this.projectList.push({
        id: null,
        tempId: projectId,
        quotationId: this.formData.id,
        name: null,
        status: 0,
        type: 0,
        note: null,
        accountId: this.formData.applicantId,
        agent: null,
        pm: null
      });
      this.addProduct(projectId);
    },
    removeProject(projectId) {
      this.projectList = this.projectList.filter(p => p.id != projectId);
      this.productList = this.productList.filter(p => p.projectId != projectId);
    }
  }
});

export default useStore;
