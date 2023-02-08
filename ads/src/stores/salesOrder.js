import { EventBus } from "@/utils/eventBus.js";
import moment from "moment";
import { DateSlashFormat } from "@/utils/dateFormat.js";
import { uuid } from "@/utils/util";
import { round } from "@/utils/quotation";
import { defineStore } from "pinia";
import {
  apiPostQuotation,
  apiPatchQuotationId,
  apiGetQuotationId,
  apiGetQuotationFind,
  apiPutContact,
  apiGetContactFind,
  apiGetCalPrice,
  apiPatchAction,
  apiDeleteQuotationId,
  apiPostContractId,
  apiGetContractId,
  apiGetLastQuotation,
  apiGetCustomerCredit,
  apiQuotationPostVerify,
  apiGetQuotationPresignedurl,
  apiPostQuotationUploadFinished,
  apiGetQuotationAttachment,
  apiDeleteQuotationAttachment,
  apiGetQuotationOrderId,
  apiDeleteContact
} from "@/apis/quotation";

// 套用範例查詢表單
const applyExampleFormInit = {
  // 公司別 ( 1:一零四資訊科技(CO1), 4:一零四管顧公司(CO4) )
  account104: 1,
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
  size: 20
};

// 套用範例公司列表
const exampleCompanyListInit = {
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
};

const state = () => ({
  // 報價單基本資料
  quotationData: {
    // *公司別 ( 1:一零四資訊科技(CO1), 4:一零四管顧公司(CO4) )
    account104: 1,
    // *申請人員編
    applicantId: null,
    // 申請人搜尋結果
    applicantInfo: {
      // 員工編號
      accountId: null,
      // 帳號
      logonId: null,
      // 姓名
      name: null
    },
    // 簽合狀態 ( 0:未送簽, 1: 簽核中, 2:駁回, 3:抽單, 4:已簽核 )
    audit: 0,
    // *利澗中心 ( 103:整招招募服務[報價/內服], 107:人力銀行[內服], 110:整合招募服務[內服], 112:整合招募服務(教育)[報價] )
    bu: 103,
    // *公司地址
    companyAddress: null,
    // *公司聯絡人
    companyContact: null,
    // *公司聯絡人部門
    companyContactDepartment: null,
    // *公司聯絡人 Email
    companyContactEmail: null,
    // *公司聯絡人職稱
    companyContactJobTitle: null,
    // *公司傳真
    companyFax: null,
    // *公司負責人
    companyLeader: null,
    // *公司電話
    companyPhone: null,
    // 自行上傳合約狀態 ( 0:無上傳, 1:合約條文及銷售內容皆無異動, 2:合約條文有調整, 3:合約條文未調整，僅修改銷售內容 )
    contract: 0,
    // 申請日期 createDate
    createDate: null,
    // 授信資訊
    customerCredit: {
      // 授信超過90天金額
      ar90: 0,
      // 可使用額度金額
      salesNum: 0,
      // 授信額度
      salesPoint: 0
    },
    // *客戶編號
    customerId: null,
    // 客戶名稱
    customerName: null,
    // 訂單折扣
    discountPercentage: null,
    // *報價單編號
    id: null,
    // *統一編號
    invoice: null,
    // 紙本發票收件人
    invoicePaperRecipientName: null,
    // 紙本發票收件人地址
    invoicePaperRecipientAddress: null,
    // *發票處理方式 ( 1:掛號, 2:交給業務, 3:平信, 4:開給104, 5:上傳金財通 )
    invoiceDeliver: 5,
    // *是否立即開立發票 ( 0:否, 1:是 )
    invoiceImmediate: 1,
    // *發票備註說明
    invoiceNote: null,
    // *發票紙本聯式 ( 2:二聯, 3:三聯 )
    invoicePaperType: 3,
    // *發票抬頭是否列印 ( 0:否, 1:是 )
    invoicePrintTitle: 1,
    // *發票收件人EMail
    invoiceRecipientEmail: null,
    // *發票收件人
    invoiceRecipientName: null,
    // *發票定期開立月份
    invoiceSendDate: null,
    // *發票定期開立說明
    invoiceSendNote: null,
    // *發票抬頭
    invoiceTitle: null,
    // *發票型式 ( 0:紙本發票, 1:電子發票 )
    invoiceType: 1,
    // *案件名稱
    name: null,
    // *合約說明/備註
    note: null,
    // *主管報價說明(內部備註)
    note4Internal: null,
    // 訂單核准日期
    orderApprovedDate: null,
    // *訂單結束日期
    orderExecutionEndDate: null,
    // *訂單開始日期
    orderExecutionStartDate: null,
    // 訂單/委刊單編號 ( 報價單轉訂單後產生 )
    orderId: null,
    // *付款方式 ( 1:電匯, 2:支票, 3:信用卡 )
    paymentMethod: null,
    // *付款價格組 ( 1:新客, 2:舊客, 3:標準客戶 )
    paymentPriceType: null,
    // *付款稅率 ( 0, 0.05 )
    paymentTaxRate: 0.05,
    // *付款條件 ( 1:月結30天, 2:月結45天, 3:月結60天, 4:月結90天, 5:月結120天, 6:預收款 )
    paymentTerms: 3,
    // 報價單申請送簽日期
    quotationApplyDate: null,
    // 報價單核准日期
    quotationApprovedDate: null,
    // 報價單有效日期
    quotationExpiryDate: null,
    // 業務員部門
    salesDepartment: null,
    // 業務員Email
    salesEmail: null,
    // 業務員分機
    salesExtension: null,
    // *業務員員編
    salesId: null,
    // 業務員搜尋結果
    salesInfo: {
      // 員工編號
      accountId: null,
      // 帳號
      logonId: null,
      // 姓名
      name: null
    },
    // 報價單階段 ( 0:草稿, 1:報價單, 2:訂單 )
    stage: 0,
    // 報價單狀態 ( 0:未結案, 1:結案, 2:逾期, 3:作廢, 4:退刊 )
    status: 0,
    // *訂單總牌價(未稅)
    totalMarketPrice: null,
    // 訂單成交金額(未稅)
    totalPrice: null,
    // 訂單成交金額(含稅)
    totalPriceIncludeTax: null,
    // *類型 ( 0:報價單, 1:內服單-內部行銷使用(含內部計價), 2:內服單-新客戶試用 )
    type: 0,
    // 更新日期 updateDate
    updateDate: null,
    // 報價單附件 - 已用印合約
    quotationAttachmentContractList: [],
    // 報價單附件 - 自訂合約
    quotationAttachmentCustomizedList: [],
    // 報價單附件
    quotationAttachmentQuotationList: []
  },
  // 聯絡人資料
  contactList: { loadedContents: [] },
  // 套用範例查詢表單
  applyExampleForm: {
    // 公司別 ( 1:一零四資訊科技(CO1), 4:一零四管顧公司(CO4) )
    account104: 1,
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
    size: 20
  },
  // 套用範例公司列表
  exampleCompanyList: {
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
  },
  // 報價內容
  projectList: [
    {
      // 負責人員編
      accountId: null,
      // 負責人搜尋結果
      accountInfo: {
        // 員工編號
        accountId: null,
        // 帳號
        logonId: null,
        // 姓名
        name: null
      },
      // 代理人員編
      agent: null,
      // 代理人搜尋結果
      agentInfo: {
        // 員工編號
        accountId: null,
        // 帳號
        logonId: null,
        // 姓名
        name: null
      },
      // 報價單專案編號
      id: null,
      // 專案名稱
      name: null,
      // 備註
      note: null,
      // 執行企劃員編
      pm: null,
      // pm 搜尋結果
      pmInfo: {
        // 員工編號
        accountId: null,
        // 帳號
        logonId: null,
        // 姓名
        name: null
      },
      // 報價單商品內容
      quotationAdList: [
        {
          // 成本價(未稅)
          costPrice: null,
          // 扣除情形( 0:原合約, 0以上:扣除專案編號 )
          deduction: 0,
          // 檔期結束日期
          endDate: null,
          // 是否為贈送商品( 0:否, 1:是 )
          free: 0,
          // 是否成效使用( 0:否, 1:是 )
          giveaway: 0,
          // 報價單廣告內容編號
          id: null,
          // 牌價單價(未稅) ( 公式 : 小計/數量 )
          marketPrice: null,
          // 備註/說明
          note: null,
          // 成交價小計(未稅)
          price: null,
          // 商品編號
          productId: null,
          // 商品名稱
          productName: null,
          // 專案編號
          projectId: null,
          // 賺買數量
          quantity: null,
          // 報價單結束執行時間
          quotationEndDate: null,
          // 報價單編號
          quotationId: null,
          // 報價單開始執行時間
          quotationStartDate: null,
          // 檔期開始日期
          startDate: null,
          // 商品類型 ( 1:Banner, 2:非 Banner 類商品 ),
          type: 1,
          // 購買單位
          unit: null,
          // 銷用情形( 0:原合約, 0以上:銷用專案編號 )
          usage: 0
        }
      ],
      // 報價單編號
      quotationId: null,
      // 專案狀態(0:提案中)
      status: 0,
      // 是否為空版專案(0:一般專案,1:空版專案)
      type: 0
    }
  ],
  // 上一張訂單
  lastQuotation: {
    totalPrice: 0,
    discountPercentage: 0,
    discountPercentageLabel: "- -"
  },
  // 左側系統備註
  leftMenuNote: [],
  lastEditGroup: "",
  isLoading: false
});

const getters = {
  discountPercentageLabel: state =>
    state.quotationData.discountPercentage > 10 ||
    state.quotationData.discountPercentage === 0
      ? "- -"
      : round(state.quotationData.discountPercentage * 10, 1),
  totalPriceLabel: state =>
    round(state.quotationData.totalPrice, 1)?.toLocaleString() ?? "- -",
  totalPriceIncludeTaxLabel: state =>
    round(state.quotationData.totalPriceIncludeTax, 1)?.toLocaleString() ??
    "- -",
  exampleList: state =>
    state.exampleCompanyList.content.map(item => ({
      ...item,
      discountPercentageLabel:
        item.discountPercentage > 1 || item.discountPercentage === 0
          ? "- -"
          : round(item.discountPercentage * 10, 1)
    }))
};

const actions = {
  // 對報價單資料進行處理
  processQuotationResponse(data) {
    this.quotationData = { ...this.quotationData, ...data };
    this.projectList = data.projectList.map(project => {
      return {
        ...project,
        quotationAdList: project.quotationAdList.map(p => ({
          ...p,
          tempId: p.id,
          quotationStartDate: p.quotationStartDate
            ? moment(p.quotationStartDate).format(DateSlashFormat)
            : null,
          quotationEndDate: p.quotationEndDate
            ? moment(p.quotationEndDate).format(DateSlashFormat)
            : null,
          marketPrice: round(p.marketPrice, 1),
          unitPrice: round(p.unitPrice, 1),
          discountPercentage: round(p.discountPercentage * 10, 1)
        })),
        tempId: project.id || uuid(),
        newProductList: project.newProductList || [],
        newOtherList: project.newOtherList || []
      };
    });
    if (this.projectList.length === 0) this.createProject();
    else {
      this.projectList.forEach(project => {
        if (
          project.quotationAdList.filter(p => p.type === 1).length === 0 &&
          project.newProductList.length === 0
        )
          this.createProduct(project.tempId);
        if (
          project.quotationAdList.filter(p => p.type === 2).length === 0 &&
          project.newOtherList.length === 0
        )
          this.createOtherProduct(project.tempId);
      });
    }
  },
  // 處理套用範例的資料
  processApplyExampleData(data) {
    const {
      id,
      name,
      quotationApplyDate,
      orderApplyDate,
      quotationExpiryDate,
      quotationApprovedDate,
      quotationDate,
      orderApprovedDate,
      customerCredit,
      quotationActionList,
      audit,
      stage,
      status,
      canEdit,
      ...rest
    } = data;
    this.getCustomerCredit({ customerId: data.customerId });
    const projectList = data.projectList.map(pj => {
      return {
        ...pj,
        id: null,
        quotationAdList: [],
        newProductList: pj.quotationAdList.map(p => ({
          ...p,
          id: null
        }))
      };
    });
    return { ...rest, projectList };
  },
  // 新增/修改報價單基本資料
  createQuotation() {
    EventBus.$emit("loadingShow");
    const { quotationData, projectList } = this;
    this.isLoading = true;
    this.lastEditGroup = "";
    let projects = projectList
      .filter(pj => pj.name)
      .map(({ tempId, newProductList, newOtherList, ...p }) => ({
        ...p,
        quotationAdList: [
          ...p.quotationAdList.map(({ tempId, ...product }) => ({
            ...product,
            free: product.free ? 1 : 0,
            note: product.note || null
          })),
          ...newProductList
            .filter(p => p.productName)
            .map(({ tempId, ...product }) => ({
              ...product,
              projectId: null,
              free: product.free ? 1 : 0,
              note: product.note || null
            })),
          ...newOtherList
            .filter(p => p.productName)
            .map(({ tempId, ...product }) => ({
              ...product,
              projectId: null,
              free: product.free ? 1 : 0,
              note: product.note || null,
              unit: "OTHER"
            }))
        ]
      }));
    const payload = {
      account104: quotationData.account104,
      applicantId: quotationData.applicantId,
      bu: quotationData.bu,
      companyAddress: quotationData.companyAddress || null,
      companyContact: quotationData.companyContact || null,
      companyContactDepartment: quotationData.companyContactDepartment || null,
      companyContactEmail: quotationData.companyContactEmail || null,
      companyContactJobTitle: quotationData.companyContactJobTitle || null,
      companyFax: quotationData.companyFax || null,
      companyLeader: quotationData.companyLeader || null,
      companyPhone: quotationData.companyPhone || null,
      contract: quotationData.contract || 0,
      customerId: quotationData.customerId,
      id: quotationData.id,
      invoice: quotationData.invoice,
      invoiceDeliver: quotationData.invoiceDeliver,
      invoiceImmediate: quotationData.invoiceImmediate,
      invoiceNote: quotationData.invoiceNote || null,
      invoicePaperRecipientAddress:
        quotationData.invoiceType === 1
          ? quotationData.companyAddress
          : quotationData.invoicePaperRecipientAddress,
      invoicePaperRecipientName:
        quotationData.invoiceType === 1
          ? quotationData.companyContact
          : quotationData.invoicePaperRecipientName,
      invoicePaperType: quotationData.invoicePaperType,
      invoicePrintTitle: quotationData.invoicePrintTitle,
      invoiceRecipientEmail: quotationData.invoiceRecipientEmail || null,
      invoiceRecipientName: quotationData.invoiceRecipientName || null,
      invoiceSendDate: quotationData.invoiceSendDate,
      invoiceSendNote: quotationData.invoiceSendNote || null,
      invoiceTitle: quotationData.invoiceTitle || null,
      invoiceType: quotationData.invoiceType,
      name: quotationData.name || null,
      note: quotationData.note || null,
      note4Internal: quotationData.note4Internal || null,
      orderExecutionEndDate: quotationData.orderExecutionEndDate,
      orderExecutionStartDate: quotationData.orderExecutionStartDate,
      paymentMethod: quotationData.paymentMethod,
      paymentPriceType: quotationData.paymentPriceType,
      paymentTaxRate: quotationData.paymentTaxRate,
      paymentTerms: quotationData.paymentTerms,
      salesId: quotationData.salesId,
      totalMarketPrice: quotationData.totalMarketPrice || null,
      type: quotationData.type,
      projectList: projects
    };
    const apiAction = this.quotationData.id
      ? apiPatchQuotationId
      : apiPostQuotation;
    return new Promise((resolve, reject) => {
      apiAction(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.processQuotationResponse(apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log(apiAction.name, error);
          console.log("payload", payload);
          reject(error);
        })
        .finally(() => {
          this.isLoading = false;
          EventBus.$emit("loadingHide");
        });
    });
  },
  // 取得報價單
  getQuotationId(payload) {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      EventBus.$emit("loadingShow");
      apiGetQuotationId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          this.processQuotationResponse(apiResponse);
          this.isLoading = false;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getQuotationId", error);
          console.log("payload", payload);
          reject(error);
        })
        .finally(() => {
          EventBus.$emit("loadingHide");
        });
    });
  },
  // 刪除報價單
  async deleteQuotation() {
    EventBus.$emit("loadingShow");
    this.lastEditGroup = "";
    this.isLoading = true;
    try {
      const {
        data: { response }
      } = await apiDeleteQuotationId({
        id: this.quotationData.id
      });
      this.isLoading = false;
      return response;
    } catch (error) {
      console.log("deleteQuotation", error);
      console.log("payload", this.quotationData.id);
      return error;
    } finally {
      EventBus.$emit("loadingHide");
    }
  },
  // 計算訂單總牌價(未稅)
  calculateTotalMarketPrice() {
    const totalMarketPrice = this.projectList.reduce((total, pj) => {
      const quotationAdMarketPrice = pj.quotationAdList
        .filter(p => p.type === 1)
        .reduce(
          (acc, cur) =>
            acc +
            (cur.unit === "WEEK"
              ? round(cur.marketPrice * (cur.quantity * 7), 0)
              : round(cur.marketPrice * cur.quantity, 0)),
          0
        );
      const quotationOtherMarketPrice = pj.quotationAdList
        .filter(p => p.type === 2)
        .reduce(
          (acc, cur) => acc + round(cur.marketPrice * cur.quantity, 0),
          0
        );

      const newProductMarketPrice = pj.newProductList.reduce(
        (acc, cur) =>
          acc +
          (cur.unit === "WEEK"
            ? round(cur.marketPrice * (cur.quantity * 7), 0)
            : round(cur.marketPrice * cur.quantity, 0)),
        0
      );
      const newOtherProductMarketPrice = pj.newOtherList.reduce(
        (acc, cur) => acc + round(cur.marketPrice * cur.quantity, 0),
        0
      );

      return (
        total +
        quotationAdMarketPrice +
        quotationOtherMarketPrice +
        newProductMarketPrice +
        newOtherProductMarketPrice
      );
    }, 0);

    this.quotationData.totalMarketPrice = totalMarketPrice;
    try {
      this.getCalPrice();
    } catch (error) {
      console.log("getCalPrice", error);
      return error;
    }
  },
  // 取得報價單金額資訊
  async getCalPrice() {
    const payload = {
      taxRate: this.quotationData.paymentTaxRate,
      totalMarketPrice: this.quotationData.totalMarketPrice,
      totalPrice: this.projectList.reduce(
        (total, pj) =>
          total +
          (pj.quotationAdList.reduce((acc, cur) => acc + Number(cur.price), 0) +
            pj.newProductList.reduce((acc, cur) => acc + Number(cur.price), 0) +
            pj.newOtherList.reduce((acc, cur) => acc + Number(cur.price), 0)),
        0
      )
    };
    try {
      const {
        data: { response }
      } = await apiGetCalPrice(payload);
      Object.entries(response).forEach(
        ([key, value]) => (this.quotationData[key] = value)
      );
      return response;
    } catch (error) {
      console.log("getCalPrice", error);
      console.log("payload", payload);
      return error;
    }
  },
  // 異動報價單/內服單狀態
  async changeAction(action, id = this.quotationData.id) {
    const payload = { id, action };
    try {
      this.lastEditGroup = "";
      EventBus.$emit("loadingShow");
      const {
        data: { response }
      } = await apiPatchAction(payload);
      return response;
    } catch (error) {
      console.log("handleAction", error);
      console.log("payload", payload);
      return Promise.reject(error);
    } finally {
      EventBus.$emit("loadingHide");
    }
  },
  // 儲存聯絡人
  createContact() {
    const { quotationData } = this;
    const payload = {
      companyAddress: quotationData.companyAddress || null,
      companyContact: quotationData.companyContact || null,
      companyContactDepartment: quotationData.companyContactDepartment || null,
      companyContactEmail: quotationData.companyContactEmail || null,
      companyContactJobTitle: quotationData.companyContactJobTitle || null,
      companyFax: quotationData.companyFax || null,
      companyLeader: quotationData.companyLeader || null,
      companyPhone: quotationData.companyPhone || null,
      customerId: quotationData.customerId
    };
    return new Promise((resolve, reject) => {
      EventBus.$emit("loadingShow");
      apiPutContact(payload)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("createContact", error);
          console.log("payload", payload);
          reject(error);
        })
        .finally(() => {
          EventBus.$emit("loadingHide");
        });
    });
  },
  // 取得聯絡人列表
  getContactList(params) {
    const customerId = this.quotationData.customerId;
    if (!customerId) return;
    return new Promise((resolve, reject) => {
      params.customerId = customerId;
      apiGetContactFind(params)
        .then(response => {
          let apiResponse = response.data.response;
          if (params.page === 1) {
            this.contactList.loadedContents = [];
          }
          this.contactList = { ...this.contactList, ...apiResponse };
          this.contactList.loadedContents.push(...apiResponse.content);
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getContactList", error);
          console.log("payload", params);
          reject(error);
        });
    });
  },
  // 套用聯絡人
  applyContact(contact) {
    const { quotationData } = this;
    quotationData.companyAddress = contact.companyAddress;
    quotationData.companyContact = contact.companyContact;
    quotationData.companyContactDepartment = contact.companyContactDepartment;
    quotationData.companyContactEmail = contact.companyContactEmail;
    quotationData.companyContactJobTitle = contact.companyContactJobTitle;
    quotationData.companyFax = contact.companyFax;
    quotationData.companyLeader = contact.companyLeader;
    quotationData.companyPhone = contact.companyPhone;
    quotationData.customerId = contact.customerId;
  },
  // 刪除聯絡人
  deleteContact(contact) {
    const params = {
      customerId: contact.customerId,
      name: contact.companyContact
    };
    if (!params.customerId || !params.name) return;
    return new Promise((resolve, reject) => {
      apiDeleteContact(params)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("deleteContact", error);
          console.log("payload", params);
          reject(error);
        });
    });
  },
  // 清除套用範例表單內容
  resetApplyExample() {
    this.applyExampleForm = applyExampleFormInit;
    this.exampleCompanyList = {
      ...exampleCompanyListInit,
      loading: false,
      isSearch: false
    };
  },
  // 取得套用範例公司列表內容
  getApplyExampleCompanyList() {
    return new Promise((resolve, reject) => {
      this.exampleCompanyList.loading = true;
      this.exampleCompanyList.isSearch = true;
      apiGetQuotationFind(this.applyExampleForm)
        .then(response => {
          let apiResponse = response.data.response;
          const result = {
            ...apiResponse,
            content: apiResponse.content.filter(
              q => q.id !== this.quotationData.id
            )
          };
          this.exampleCompanyList = {
            ...result,
            loading: false,
            isSearch: true
          };
          resolve(result);
        })
        .catch(error => {
          console.log("getApplyExampleCompanyList", error);
          reject(error);
        });
    });
  },
  // 套用範例
  getApplyQuotationExample(payload) {
    return new Promise((resolve, reject) => {
      apiGetQuotationId(payload)
        .then(response => {
          let apiResponse = response.data.response;
          let exampleData = this.processApplyExampleData(apiResponse);
          // 同公司 報價單基本資料 客戶 與 案件名稱 不覆蓋，其他覆蓋
          // 不同公司 不覆蓋報價單基本資料，
          if (this.quotationData.customerId === apiResponse.customerId) {
            this.processQuotationResponse({ ...exampleData });
          } else {
            this.processQuotationResponse({
              projectList: exampleData.projectList
            });
          }
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getQuotationId", error);
          console.log("payload", payload);
          reject(error);
        });
    });
  },
  // 取得上一張訂單內容
  async getLastQuotation() {
    if (!this.quotationData.customerId) return;

    const params = {
      customerId: this.quotationData.customerId
    };

    try {
      const {
        data: { response: apiResponse }
      } = await apiGetLastQuotation(params);
      if (!apiResponse) return;
      apiResponse.discountPercentageLabel =
        apiResponse.discountPercentage > 1 ||
        apiResponse.discountPercentage === 0
          ? "- -"
          : round(apiResponse.discountPercentage * 10, 1);
      this.lastQuotation = apiResponse;

      // 帶入客戶基本資料及授信資料與發票及付款資訊
      if (
        this.quotationData.audit === 0 &&
        this.quotationData.stage === 0 &&
        this.quotationData.status === 0 &&
        this.quotationData.canEdit
      ) {
        this.quotationData.companyLeader =
          this.quotationData.companyLeader ?? apiResponse.companyLeader;
        this.quotationData.companyPhone =
          this.quotationData.companyPhone ?? apiResponse.companyPhone;
        this.quotationData.companyFax =
          this.quotationData.companyFax ?? apiResponse.companyFax;
        this.quotationData.companyAddress =
          this.quotationData.companyAddress ?? apiResponse.companyAddress;
        this.quotationData.companyContact =
          this.quotationData.companyContact ?? apiResponse.companyContact;
        this.quotationData.companyContactJobTitle =
          this.quotationData.companyContactJobTitle ??
          apiResponse.companyContactJobTitle;
        this.quotationData.companyContactDepartment =
          this.quotationData.companyContactDepartment ??
          apiResponse.companyContactDepartment;
        this.quotationData.companyContactEmail =
          this.quotationData.companyContactEmail ??
          apiResponse.companyContactEmail;

        this.quotationData.invoiceTitle =
          this.quotationData.invoiceTitle ?? apiResponse.invoiceTitle;
        this.quotationData.invoicePrintTitle =
          this.quotationData.invoicePrintTitle ?? apiResponse.invoicePrintTitle;
        this.quotationData.invoiceImmediate =
          this.quotationData.invoiceImmediate ?? apiResponse.invoiceImmediate;
        this.quotationData.paymentTerms =
          this.quotationData.paymentTerms ?? apiResponse.paymentTerms;
        this.quotationData.paymentMethod =
          this.quotationData.paymentMethod ?? apiResponse.paymentMethod;
        this.quotationData.paymentPriceType =
          this.quotationData.paymentPriceType ?? apiResponse.paymentPriceType;
        this.quotationData.invoicePaperType =
          this.quotationData.invoicePaperType ?? apiResponse.invoicePaperType;
        this.quotationData.paymentTaxRate =
          this.quotationData.paymentTaxRate ?? apiResponse.paymentTaxRate;
        this.quotationData.invoiceDeliver =
          this.quotationData.invoiceDeliver ?? apiResponse.invoiceDeliver;
        this.quotationData.invoiceRecipientName =
          this.quotationData.invoiceRecipientName ??
          apiResponse.invoiceRecipientName;
        this.quotationData.invoiceRecipientEmail =
          this.quotationData.invoiceRecipientEmail ??
          apiResponse.invoiceRecipientEmail;
        this.quotationData.invoiceType =
          this.quotationData.invoiceType ?? apiResponse.invoiceType;
        this.quotationData.invoicePaperRecipientAddress =
          this.quotationData.invoicePaperRecipientAddress ??
          apiResponse.invoicePaperRecipientAddress;
        this.quotationData.invoicePaperRecipientName =
          this.quotationData.invoicePaperRecipientName ??
          apiResponse.invoicePaperRecipientName;
        this.quotationData.invoiceNote =
          this.quotationData.invoiceNote ?? apiResponse.invoiceNote;

        if (
          !this.quotationData.invoiceSendDate &&
          !this.quotationData.invoiceSendNote
        ) {
          this.quotationData.invoiceSendDate = apiResponse.invoiceSendDate;
          this.quotationData.invoiceSendNote = apiResponse.invoiceSendNote;
        }
      }

      return apiResponse;
    } catch (err) {
      console.log("getLastQuotation", err);
      console.log("payload", params);
    }
  },
  // 新增專案
  createProject() {
    const newId = uuid();
    this.projectList.push({
      id: null,
      tempId: newId,
      quotationId: this.quotationData.id,
      name: null,
      status: 0,
      type: 0,
      note: null,
      accountId: null,
      agent: null,
      pm: null,
      quotationAdList: [],
      newProductList: [],
      newOtherList: []
    });
    this.createProduct(newId);
    this.createOtherProduct(newId);
    return newId;
  },
  // 移除專案
  removeProject(projectId) {
    this.projectList = this.projectList.filter(pj => {
      return pj.tempId !== projectId;
    });
    this.getCalPrice();
  },
  // 新增商品
  createProduct(projectId, type = 1) {
    const newId = uuid();
    this.projectList
      .find(project => project.tempId === projectId)
      ?.newProductList.push({
        id: null,
        tempId: newId,
        quotationId: this.quotationData.id,
        projectId,
        productId: null,
        productName: null,
        usage: 0,
        deduction: 0,
        giveaway: 0,
        note: null,
        quantity: 0,
        type,
        unit: "WEEK",
        quotationStartDate: this.quotationData.orderExecutionStartDate ?? "",
        quotationEndDate: this.quotationData.orderExecutionEndDate ?? "",
        free: 0,
        price: null,
        marketPrice: null,
        unitPrice: null,
        floorPrice: null,
        discountPercentage: 0
      });
    return newId;
  },
  // 移除商品
  removeProduct(projectId, productId) {
    let project = this.projectList.find(
      project => project.tempId === projectId
    );
    if (!project) return;

    if (isNaN(productId)) {
      project.newProductList = project.newProductList.filter(
        p => p.tempId != productId
      );
      project.newOtherList = project.newOtherList.filter(
        p => p.tempId != productId
      );
    } else {
      project.quotationAdList = project.quotationAdList.filter(
        p => p.tempId != productId
      );
    }

    const bannerProducts = project.quotationAdList.filter(p => p.type === 1);
    const otherProducts = project.quotationAdList.filter(p => p.type === 2);

    if (project.newProductList.length === 0 && bannerProducts.length === 0) {
      this.createProduct(projectId);
    }
    if (project.newOtherList.length === 0 && otherProducts.length === 0) {
      this.createOtherProduct(projectId);
    }

    this.getCalPrice();
  },
  // 新增其他類型商品
  createOtherProduct(projectId) {
    const newId = uuid();
    this.projectList
      .find(project => project.tempId === projectId)
      ?.newOtherList.push({
        id: null,
        tempId: newId,
        quotationId: this.quotationData.id,
        projectId,
        productId: null,
        productName: null,
        usage: 0,
        deduction: 0,
        giveaway: 0,
        note: null,
        quantity: 0,
        type: 2,
        unit: "OTHER",
        quotationStartDate: this.quotationData.orderExecutionStartDate ?? "",
        quotationEndDate: this.quotationData.orderExecutionEndDate ?? "",
        free: 0,
        price: null,
        marketPrice: null,
        unitPrice: null,
        floorPrice: null,
        discountPercentage: 0,
        costPrice: null
      });
    return newId;
  },
  // 找到對應的專案
  getSpecifiedProject(projectId) {
    return this.projectList.find(pj => pj.tempId === projectId);
  },
  // 找到對應的商品資料
  getSpecifiedProduct(projectId, productId) {
    let tempProject = this.getSpecifiedProject(projectId);
    if (!tempProject) return null;

    let tempProduct = null;
    if (isNaN(productId)) {
      tempProduct = tempProject.newProductList.find(
        p => p.tempId === productId
      );
    } else {
      tempProduct = tempProject.quotationAdList.find(
        p => p.tempId === productId
      );
    }

    return tempProduct;
  },
  // 建立合約
  postContractId(params) {
    return new Promise((resolve, reject) => {
      apiPostContractId(params)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("postContractId", error);
          console.log("payload", params);
          reject(error);
        });
    });
  },
  // 下載合約
  getContractId(params) {
    return new Promise((resolve, reject) => {
      apiGetContractId(params)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getContractId", error);
          console.log("payload", params);
          reject(error);
        });
    });
  },
  // 取得客戶授信資料
  getCustomerCredit(params) {
    return new Promise((resolve, reject) => {
      apiGetCustomerCredit(params)
        .then(response => {
          let apiResponse = response.data.response;
          this.quotationData.customerCredit = apiResponse;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getCustomerCredit", error);
          console.log("payload", params);
          reject(error);
        });
    });
  },
  // 取得簽核驗證（系統備註）
  getVerify() {
    return new Promise((resolve, reject) => {
      apiQuotationPostVerify({
        ...this.quotationData,
        contract: this.quotationData.contract || 0
      })
        .then(response => {
          this.leftMenuNote = response.data.response;
          resolve(response.data.response);
        })
        .catch(error => {
          console.log("getVerify", error);
          reject(error);
        });
    });
  },
  // 取得檔案上傳路徑
  async getPresignedurl(params) {
    try {
      const {
        data: { response: apiResponse }
      } = await apiGetQuotationPresignedurl(params);
      return apiResponse;
    } catch (error) {
      console.log("getPresignedurl", error);
      console.log("payload", params);
      return error;
    }
  },
  // 確認檔案上傳完成
  async postUploadFinished(params) {
    try {
      const {
        data: { response: apiResponse }
      } = await apiPostQuotationUploadFinished(params);
      return apiResponse;
    } catch (error) {
      console.log("postUploadFinished", error);
      console.log("payload", params);
      return error;
    }
  },
  // 取得已上傳檔案
  async getUploadFiles(params) {
    try {
      const {
        data: { response: apiResponse }
      } = await apiGetQuotationAttachment(params);
      return apiResponse;
    } catch (error) {
      console.log("getUploadFiles", error);
      console.log("payload", params);
      return error;
    }
  },
  // 刪除已上傳檔案
  async deleteFile(params) {
    try {
      const {
        data: { response: apiResponse }
      } = await apiDeleteQuotationAttachment(params);

      return apiResponse;
    } catch (error) {
      console.log("deleteFile", error);
      console.log("payload", params);
      return error;
    }
  },
  // 用訂單編號取得報價單/內服單
  getQuotationOrderId(params) {
    return new Promise((resolve, reject) => {
      apiGetQuotationOrderId(params)
        .then(response => {
          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.log("getQuotationOrderId", error);
          console.log("payload", params);
          reject(error);
        });
    });
  }
};

export const useSalesOrderStore = defineStore("salesOrder", {
  state,
  getters,
  actions
});
