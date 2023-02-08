import { setActivePinia, createPinia } from "pinia";
import { useSalesOrderStore } from "@/stores/salesOrder";
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
  apiGetQuotationOrder,
  apiDeleteContact,
  apiGetQuotationOrderId
} from "@/apis/quotation";

jest.mock("@/apis/quotation", () => ({
  apiPostQuotation: jest.fn(),
  apiPatchQuotationId: jest.fn(),
  apiGetQuotationId: jest.fn(),
  apiGetQuotationFind: jest.fn(),
  apiPutContact: jest.fn(),
  apiGetContactFind: jest.fn(),
  apiGetCalPrice: jest.fn(),
  apiPatchAction: jest.fn(),
  apiDeleteQuotationId: jest.fn(),
  apiPostContractId: jest.fn(),
  apiGetContractId: jest.fn(),
  apiGetLastQuotation: jest.fn(),
  apiGetCustomerCredit: jest.fn(),
  apiQuotationPostVerify: jest.fn(),
  apiGetQuotationPresignedurl: jest.fn(),
  apiPostQuotationUploadFinished: jest.fn(),
  apiGetQuotationAttachment: jest.fn(),
  apiDeleteQuotationAttachment: jest.fn(),
  apiGetQuotationOrder: jest.fn(),
  apiDeleteContact: jest.fn(),
  apiGetQuotationOrderId: jest.fn()
}));
jest.mock("moment", () => {
  return () => jest.requireActual("moment")("2022-01-01T00:00:00.000Z");
});

const mockResponse = {
  id: 123,
  orderId: "ERIC-1234",
  type: 0,
  stage: 3,
  audit: 0,
  status: 0,
  quotationDate: "2022/11/04",
  quotationApplyDate: "2022/11/04",
  quotationApprovedDate: "2022/11/04",
  quotationExpiryDate: "2023/03/04",
  orderApplyDate: "2022/11/04",
  orderApprovedDate: "2022/11/04",
  account104: 1,
  applicantId: "2037",
  applicantInfo: {
    logonId: "yung.ho",
    name: "何勝勇",
    accountId: "2037"
  },
  salesId: "2037",
  salesInfo: {
    logonId: "yung.ho",
    name: "何勝勇",
    accountId: "2037"
  },
  salesDepartment: "4EA12",
  salesExtension: "8370",
  salesEmail: "yung.ho@104.com.tw",
  bu: 103,
  customerId: 1110215674,
  name: "大潤發2022年終感恩回饋",
  orderExecutionStartDate: "2022/12/01",
  orderExecutionEndDate: "2022/12/31",
  note4Internal: "好棒棒",
  note: "好棒棒",
  totalMarketPrice: 132860,
  discountPercentage: 0.9,
  totalPrice: 120000,
  totalPriceIncludeTax: 126000,
  companyLeader: "全聯先生",
  companyAddress: "新店區環河南路",
  companyPhone: "02123456789",
  companyFax: "02123456789",
  companyContact: "全聯先生",
  companyContactEmail: "abc@rtmart.com.tw",
  companyContactJobTitle: "代言人",
  companyContactDepartment: "公關部",
  invoice: 97165560,
  invoiceTitle: "大潤發流通事業股份有限公司",
  invoicePaperType: 3,
  invoiceDeliver: 5,
  invoiceImmediate: 1,
  invoiceSendNote: null,
  invoiceSendDate: "2022/12/01",
  invoicePrintTitle: 1,
  invoiceType: 1,
  invoiceRecipientName: "全聯先生",
  invoiceRecipientEmail: "abc@rtmart.com.tw",
  invoicePaperRecipientName: null,
  invoicePaperRecipientAddress: null,
  invoiceNote: "好棒棒",
  paymentTerms: 3,
  paymentMethod: 1,
  paymentPriceType: 3,
  paymentTaxRate: 0.05,
  contract: null,
  createDate: "2022/11/04",
  updateDate: "2022/11/04",
  customerName: "大潤發流通事業股份有限公司",
  customerCredit: {
    ar90: 0,
    salesNum: 0,
    salesPoint: 0
  },
  projectList: [
    {
      id: 145,
      quotationId: 234,
      name: "2022年終感恩回饋專案",
      status: 0,
      type: 0,
      note: null,
      accountId: "2037",
      accountInfo: {
        logonId: "yung.ho",
        name: "何勝勇",
        accountId: "2037"
      },
      agent: null,
      agentInfo: null,
      pm: null,
      pmInfo: null,
      quotationAdList: [
        {
          id: 317,
          quotationId: 234,
          projectId: 145,
          productId: 410,
          productName: "人力銀行主網/C首頁(2018)/熱門企業",
          externalName: null,
          usage: 0,
          usageInfo: null,
          deduction: 0,
          deductionInfo: null,
          giveaway: false,
          note: null,
          type: 1,
          quantity: 31,
          unit: "DAY",
          quotationStartDate: "2022/12/01",
          quotationEndDate: "2022/12/31",
          startDate: "2022/12/01",
          endDate: "2022/12/31",
          free: 0,
          price: 120000,
          marketPrice: 4285.71,
          unitPrice: 3870.97,
          floorPrice: 0,
          costPrice: null,
          discountPercentage: 0.9
        }
      ]
    }
  ],
  canEdit: true,
  quotationActionList: ["DISCARD", "FINISH"],
  quotationAttachmentQuotationList: [],
  quotationAttachmentCustomizedList: [],
  quotationAttachmentHandWrittenList: [],
  quotationAttachmentContractList: []
};
const mockContactData = {
  companyAddress: "新店區環河南路",
  companyContact: "全聯先生",
  companyContactDepartment: "公關部",
  companyContactEmail: "abc@rtmart.com.tw",
  companyContactJobTitle: "代言人",
  companyFax: "02123456789",
  companyLeader: "全聯先生",
  companyPhone: "02123456789",
  customerId: 1110215674
};
const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};
let salesOrderStore = null;

describe("測試 SalesOrder Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    apiPostQuotation.mockReset();
    apiPatchQuotationId.mockReset();
    apiGetQuotationId.mockReset();
    apiGetQuotationFind.mockReset();
    apiPutContact.mockReset();
    apiGetContactFind.mockReset();
    apiGetCalPrice.mockReset();
    apiPatchAction.mockReset();
    apiDeleteQuotationId.mockReset();
    apiPostContractId.mockReset();
    apiGetContractId.mockReset();
    apiGetLastQuotation.mockReset();
    apiGetCustomerCredit.mockReset();
    apiQuotationPostVerify.mockReset();
    apiGetQuotationPresignedurl.mockReset();
    apiPostQuotationUploadFinished.mockReset();
    apiGetQuotationAttachment.mockReset();
    apiDeleteQuotationAttachment.mockReset();
    apiGetQuotationOrder.mockReset();
    apiDeleteContact.mockReset();

    salesOrderStore = useSalesOrderStore();
    salesOrderStore.quotationData = JSON.parse(JSON.stringify(mockResponse));
    salesOrderStore.projectList = [
      {
        quotationAdList: [
          {
            id: 317,
            quotationId: 234,
            projectId: 145,
            productId: 410,
            productName: "人力銀行主網/C首頁(2018)/熱門企業",
            externalName: null,
            usage: 0,
            usageInfo: null,
            deduction: 0,
            deductionInfo: null,
            giveaway: false,
            note: null,
            type: 1,
            quantity: 31,
            unit: "DAY",
            quotationStartDate: "2022/12/01",
            quotationEndDate: "2022/12/31",
            startDate: "2022/12/01",
            endDate: "2022/12/31",
            free: 0,
            price: 120000,
            marketPrice: 4285.71,
            unitPrice: 3870.97,
            floorPrice: 0,
            costPrice: null,
            discountPercentage: 0.9
          }
        ],
        newProductList: []
      }
    ];
    salesOrderStore.newProductList = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("createQuotation 新增成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    salesOrderStore.quotationData.id = null;
    apiPostQuotation.mockResolvedValue({
      data: {
        response: mockResponse
      }
    });
    await salesOrderStore.createQuotation();

    expect(salesOrderStore.quotationData).toStrictEqual(mockResponse);
  });

  it("createQuotation 修改成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    salesOrderStore.quotationData.id = "123";
    apiPatchQuotationId.mockResolvedValue({
      data: {
        response: mockResponse
      }
    });
    await salesOrderStore.createQuotation();

    expect(salesOrderStore.quotationData).toStrictEqual(mockResponse);
  });

  it("createQuotation 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    salesOrderStore.quotationData.id = null;
    apiPostQuotation.mockRejectedValue(error500);

    try {
      await salesOrderStore.createQuotation();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getQuotationId 成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiGetQuotationId.mockResolvedValue({
      data: {
        response: mockResponse
      }
    });
    await salesOrderStore.getQuotationId({ id: 123 });

    expect(salesOrderStore.quotationData).toStrictEqual(mockResponse);
  });

  it("getQuotationId 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiGetQuotationId.mockRejectedValue(error500);

    try {
      await salesOrderStore.getQuotationId({ id: 123 });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("deleteQuotation 成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    salesOrderStore.quotationData.id = 123;
    apiDeleteQuotationId.mockResolvedValue({
      data: {
        response: {}
      }
    });
    await salesOrderStore.deleteQuotation();

    expect(apiDeleteQuotationId).toHaveBeenCalled();
  });

  it("deleteQuotation 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiGetQuotationId.mockRejectedValue(error500);

    try {
      await salesOrderStore.deleteQuotation();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("calculateTotalMarketPrice 成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    salesOrderStore.getCalPrice = jest.fn();
    salesOrderStore.calculateTotalMarketPrice();

    expect(salesOrderStore.quotationData.totalMarketPrice).toBe(132857);
  });

  it("getCalPrice 成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiGetCalPrice.mockResolvedValue({
      data: {
        response: {
          totalMarketPrice: 10000,
          discountPercentage: 0.8,
          totalPrice: 8000,
          totalPriceIncludeTax: 8400
        }
      }
    });
    await salesOrderStore.getCalPrice();

    expect(salesOrderStore.quotationData.totalMarketPrice).toBe(10000);
    expect(salesOrderStore.quotationData.discountPercentage).toBe(0.8);
    expect(salesOrderStore.quotationData.totalPrice).toBe(8000);
    expect(salesOrderStore.quotationData.totalPriceIncludeTax).toBe(8400);
  });

  it("getCalPrice 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiGetCalPrice.mockRejectedValue(error500);

    try {
      await salesOrderStore.getCalPrice();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("changeAction 成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiPatchAction.mockResolvedValue({
      data: {
        response: {
          ...mockResponse,
          stage: 1
        }
      }
    });
    await salesOrderStore.changeAction({ action: "SAVE", id: 123 });

    expect(salesOrderStore.quotationData).toStrictEqual({
      ...mockResponse,
      stage: 1
    });
  });

  it("changeAction 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiPatchAction.mockRejectedValue(error500);

    try {
      await salesOrderStore.changeAction({ action: "SAVE", id: 123 });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("createContact 成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiPutContact.mockResolvedValue({
      data: {
        response: mockContactData
      }
    });
    const result = await salesOrderStore.createContact();

    expect(result).toStrictEqual(mockContactData);
  });

  it("createContact 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiPutContact.mockRejectedValue(error500);

    try {
      await salesOrderStore.createContact();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getContactList，無customerId，不呼叫API", async () => {
    salesOrderStore.quotationData.customerId = null;
    await salesOrderStore.getContactList({
      page: 1,
      size: 20
    });

    expect(apiGetContactFind).not.toHaveBeenCalled();
  });

  it("getContactList，成功", async () => {
    apiGetContactFind.mockResolvedValue({
      data: {
        response: {
          content: [{ ...mockContactData }],
          last: true,
          numberOfElements: 0,
          page: 0,
          size: 0,
          totalElements: 0,
          totalPages: 0
        }
      }
    });
    await salesOrderStore.getContactList({
      page: 1,
      size: 20
    });

    expect(salesOrderStore.contactList.loadedContents.length).toBe(1);
  });

  it("getContactList 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiGetContactFind.mockRejectedValue(error500);

    try {
      await salesOrderStore.getContactList({
        page: 1,
        size: 20
      });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("deleteContact，無customerId或無companyContact，不呼叫API", async () => {
    const salesOrderStore = useSalesOrderStore();
    await salesOrderStore.deleteContact({
      customerId: 1110215674,
      name: null
    });

    expect(apiDeleteContact).not.toHaveBeenCalled();

    await salesOrderStore.deleteContact({
      customerId: null,
      companyContact: "全聯先生"
    });

    expect(apiDeleteContact).not.toHaveBeenCalled();
  });

  it("deleteContact，成功", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiDeleteContact.mockResolvedValue({
      data: {
        response: {}
      }
    });
    await salesOrderStore.deleteContact({
      customerId: 1110215674,
      companyContact: "全聯先生"
    });

    expect(apiDeleteContact).toHaveBeenCalled();
  });

  it("deleteContact 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiDeleteContact.mockRejectedValue(error500);

    try {
      await salesOrderStore.deleteContact({
        customerId: 1110215674,
        companyContact: "全聯先生"
      });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("applyContact，成功改變store quotationData", () => {
    const objKeys = [
      "companyContact",
      "companyContactDepartment",
      "companyContactEmail",
      "companyContactJobTitle",
      "companyFax",
      "companyLeader",
      "companyPhone",
      "customerId"
    ];
    const mockData = {
      companyContact: "123",
      companyContactDepartment: "123",
      companyContactEmail: "123",
      companyContactJobTitle: "123",
      companyFax: "123",
      companyLeader: "123",
      companyPhone: "123",
      customerId: "123"
    };
    salesOrderStore.applyContact(mockData);

    objKeys.forEach(key => {
      expect(salesOrderStore.quotationData[key]).toBe(mockData[key]);
    });
  });

  it("getApplyExampleCompanyList，成功且排除相同的id", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiGetQuotationFind.mockResolvedValue({
      data: {
        response: {
          content: [
            {
              ...mockResponse,
              id: 123
            },
            {
              ...mockResponse,
              id: 456
            }
          ],
          last: true,
          numberOfElements: 0,
          page: 0,
          size: 0,
          totalElements: 0,
          totalPages: 0
        }
      }
    });
    await salesOrderStore.getApplyExampleCompanyList();

    expect(salesOrderStore.exampleCompanyList.content.length).toBe(1);
    expect(salesOrderStore.exampleCompanyList.loading).toBe(false);
  });

  it("getApplyExampleCompanyList 失敗", async () => {
    const salesOrderStore = useSalesOrderStore();
    apiGetQuotationFind.mockRejectedValue(error500);

    try {
      await salesOrderStore.getApplyExampleCompanyList();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getApplyQuotationExample，customerId相同，以processApplyExampleData值覆蓋quotationData", async () => {
    const mockData = { ...mockResponse, name: "test" };
    salesOrderStore.processApplyExampleData = jest
      .fn()
      .mockReturnValue(mockData);
    apiGetQuotationId.mockResolvedValue({
      data: { response: mockData }
    });
    await salesOrderStore.getApplyQuotationExample();

    expect(salesOrderStore.quotationData.name).toBe(mockData.name);
  });

  it("getApplyQuotationExample，customerId不同，只覆蓋projectList", async () => {
    const mockData = { ...mockResponse, name: "test", projectList: [] };
    salesOrderStore.processApplyExampleData = jest
      .fn()
      .mockReturnValue(mockData);
    apiGetQuotationId.mockResolvedValue({
      data: { response: mockData }
    });
    salesOrderStore.quotationData.customerId = 12345678;
    await salesOrderStore.getApplyQuotationExample();

    expect(salesOrderStore.quotationData.name).not.toBe(mockData.name);
    expect(salesOrderStore.quotationData.projectList.length).toBe(0);
  });

  it("getApplyQuotationExample，失敗", async () => {
    apiGetQuotationId.mockRejectedValue(error500);

    try {
      await salesOrderStore.getApplyQuotationExample();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getLastQuotation，成功", async () => {
    apiGetLastQuotation.mockResolvedValue({
      data: { response: { ...mockResponse } }
    });
    await salesOrderStore.getLastQuotation();

    expect(salesOrderStore.lastQuotation).toStrictEqual({
      ...mockResponse,
      discountPercentageLabel: 9
    });
  });

  it("getLastQuotation，失敗", async () => {
    apiGetLastQuotation.mockRejectedValue(error500);

    try {
      await salesOrderStore.getLastQuotation();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("processQuotationResponse，quotationData寫入傳入參數", () => {
    const mockData = { test: "test", projectList: [] };
    salesOrderStore.processQuotationResponse(mockData);

    expect(salesOrderStore.quotationData).toHaveProperty("test");
  });

  it("processQuotationResponse，projectList爲空時，呼叫createProject", () => {
    const mockData = {
      projectList: []
    };
    salesOrderStore.createProject = jest.fn();

    salesOrderStore.processQuotationResponse(mockData);

    expect(salesOrderStore.createProject).toHaveBeenCalled();
  });

  it("processQuotationResponse，projectList不爲空時，呼叫createProduct和createOtherProduct", () => {
    const mockData = {
      projectList: [
        {
          quotationAdList: [],
          newProductList: [],
          newOtherList: []
        }
      ]
    };
    salesOrderStore.createProduct = jest.fn();
    salesOrderStore.createOtherProduct = jest.fn();

    salesOrderStore.processQuotationResponse(mockData);

    expect(salesOrderStore.createProduct).toHaveBeenCalled();
    expect(salesOrderStore.createOtherProduct).toHaveBeenCalled();
  });

  it("postContractId，成功", async () => {
    const mockData = {
      companyAddress: "新北市新店區寶中路 119 號 3 樓",
      companyContact: "王小明",
      companyContactDepartment: "收發室",
      companyContactEmail: "qq@104.com.tw",
      companyContactJobTitle: "發言人",
      companyFax: "02-29175677",
      companyLeader: "王大明",
      companyPhone: "02-29126104",
      customerId: 1234
    };
    apiPostContractId.mockResolvedValue({
      data: { response: { ...mockData } }
    });
    const result = await salesOrderStore.postContractId(mockData);

    expect(result).toStrictEqual(mockData);
  });

  it("postContractId，失敗", async () => {
    const mockData = {
      companyAddress: "新北市新店區寶中路 119 號 3 樓",
      companyContact: "王小明",
      companyContactDepartment: "收發室",
      companyContactEmail: "qq@104.com.tw",
      companyContactJobTitle: "發言人",
      companyFax: "02-29175677",
      companyLeader: "王大明",
      companyPhone: "02-29126104",
      customerId: 1234
    };
    apiPostContractId.mockRejectedValue(error500);

    try {
      await salesOrderStore.postContractId(mockData);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getContractId，成功", async () => {
    const mockData = {
      companyAddress: "新北市新店區寶中路 119 號 3 樓",
      companyContact: "王小明",
      companyContactDepartment: "收發室",
      companyContactEmail: "qq@104.com.tw",
      companyContactJobTitle: "發言人",
      companyFax: "02-29175677",
      companyLeader: "王大明",
      companyPhone: "02-29126104",
      customerId: 1110215674
    };
    apiGetContractId.mockResolvedValue({
      data: { response: { ...mockData } }
    });
    const result = await salesOrderStore.getContractId({
      customerId: 1110215674,
      name: "大潤發2022年終感恩回饋"
    });

    expect(result).toStrictEqual(mockData);
  });

  it("getContractId，失敗", async () => {
    apiGetContractId.mockRejectedValue(error500);

    try {
      await salesOrderStore.getContractId({
        customerId: 1110215674,
        name: "大潤發2022年終感恩回饋"
      });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getCustomerCredit，成功", async () => {
    const mockData = {
      ar90: 0,
      salesNum: 0,
      salesPoint: 0
    };
    apiGetCustomerCredit.mockResolvedValue({
      data: { response: { ...mockData } }
    });
    await salesOrderStore.getCustomerCredit({
      customerId: 1110215674
    });

    expect(salesOrderStore.quotationData.customerCredit).toStrictEqual(
      mockData
    );
  });

  it("getCustomerCredit，失敗", async () => {
    apiGetCustomerCredit.mockRejectedValue(error500);

    try {
      await salesOrderStore.getCustomerCredit({
        customerId: 1110215674
      });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getVerify，成功", async () => {
    const mockData = [
      {
        id: "floorPrice",
        name: "底價",
        confirm: false,
        note: "有一個以上Banner成交價 < 底價",
        actualValue: 71.43
      },
      {
        id: "projectCost",
        name: "專案型成本",
        confirm: false,
        note: "非 Banner 商品成本 > 30%",
        actualValue: 1
      }
    ];
    apiQuotationPostVerify.mockResolvedValue({
      data: { response: mockData }
    });
    await salesOrderStore.getVerify(mockResponse);

    expect(salesOrderStore.leftMenuNote).toStrictEqual(mockData);
  });

  it("getVerify，失敗", async () => {
    apiQuotationPostVerify.mockRejectedValue(error500);

    try {
      await salesOrderStore.getVerify(mockResponse);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getPresignedurl，成功", async () => {
    const mockRequest = {
      fileNameList: "test",
      quotationId: 123,
      type: "QUOTATION"
    };
    const mockResponse = [
      {
        fileName: "報價單-1.doc",
        url: "https://material.adsmart.104-dev.com.tw/sample.jpg"
      }
    ];
    apiGetQuotationPresignedurl.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await salesOrderStore.getPresignedurl(mockRequest);

    expect(result).toStrictEqual(mockResponse);
  });

  it("getPresignedurl，失敗", async () => {
    const mockRequest = {
      fileNameList: "test",
      quotationId: 123,
      type: "QUOTATION"
    };
    apiGetQuotationPresignedurl.mockRejectedValue(error500);

    try {
      await salesOrderStore.getPresignedurl(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("postUploadFinished，成功", async () => {
    const mockRequest = {
      fileNameList: ["報價單-1.doc"],
      quotationId: 123,
      type: "QUOTATION"
    };
    const mockResponse = [
      {
        fileName: "報價單-1.doc",
        id: 1,
        quotationId: 123,
        type: "QUOTATION"
      }
    ];
    apiPostQuotationUploadFinished.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await salesOrderStore.postUploadFinished(mockRequest);

    expect(result).toStrictEqual(mockResponse);
  });

  it("postUploadFinished，失敗", async () => {
    const mockRequest = {
      fileNameList: ["報價單-1.doc"],
      quotationId: 123,
      type: "QUOTATION"
    };
    apiPostQuotationUploadFinished.mockRejectedValue(error500);

    try {
      await salesOrderStore.postUploadFinished(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getUploadFiles，成功", async () => {
    const mockRequest = {
      quotationAttachmentType: "QUOTATION",
      quotationId: 123
    };
    const mockResponse = [
      {
        fileName: "報價單-1.doc",
        id: 1,
        quotationId: 123,
        type: "QUOTATION"
      }
    ];
    apiGetQuotationAttachment.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await salesOrderStore.getUploadFiles(mockRequest);

    expect(result).toStrictEqual(mockResponse);
  });

  it("getUploadFiles，失敗", async () => {
    const mockRequest = {
      quotationAttachmentType: "QUOTATION",
      quotationId: 123
    };
    apiGetQuotationAttachment.mockRejectedValue(error500);

    try {
      await salesOrderStore.getUploadFiles(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("deleteFile，成功", async () => {
    const mockRequest = {
      attachmentId: 1,
      quotationId: 123
    };
    apiDeleteQuotationAttachment.mockResolvedValue({
      data: { response: {} }
    });
    await salesOrderStore.deleteFile(mockRequest);

    expect(apiDeleteQuotationAttachment).toHaveBeenCalled();
  });

  it("deleteFile，失敗", async () => {
    const mockRequest = {
      attachmentId: 1,
      quotationId: 123
    };
    apiDeleteQuotationAttachment.mockRejectedValue(error500);

    try {
      await salesOrderStore.deleteFile(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getQuotationOrderId，成功", async () => {
    const mockRequest = {
      orderId: "eric-1234"
    };
    apiGetQuotationOrderId.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await salesOrderStore.getQuotationOrderId(mockRequest);

    expect(result).toStrictEqual(mockResponse);
  });

  it("getQuotationOrderId，失敗", async () => {
    const mockRequest = {
      orderId: "eric-1234"
    };
    apiGetQuotationOrderId.mockRejectedValue(error500);

    try {
      await salesOrderStore.getQuotationOrderId(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });
});
