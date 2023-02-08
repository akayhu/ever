import { setActivePinia, createPinia } from "pinia";
import { useSalesOrderListStore } from "@/stores/salesOrderList";
import { apiGetQuotationFind } from "@/apis/quotation";

jest.mock("@/apis/quotation", () => ({
  apiGetQuotationFind: jest.fn()
}));

const mockResponse = {
  content: [],
  last: true,
  numberOfElements: 0,
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0
};
const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};

describe("測試 SalesOrderList Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    apiGetQuotationFind.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getQuotationListData 參數帶入page，寫入searchQuotation", async () => {
    const salesOrderStore = useSalesOrderListStore();
    apiGetQuotationFind.mockResolvedValue({
      data: {
        response: mockResponse
      }
    });
    await salesOrderStore.getQuotationListData(0, 2);

    expect(salesOrderStore.searchQuotation.page).toEqual(2);
  });

  it("getQuotationListData，報價單號或內服單號爲空時，帶入status", async () => {
    const salesOrderStore = useSalesOrderListStore();
    salesOrderStore.searchQuotation.id = null;
    salesOrderStore.searchQuotation.orderId = null;
    salesOrderStore.searchQuotation.queryStatus = 1;

    apiGetQuotationFind.mockResolvedValue({
      data: {
        response: mockResponse
      }
    });
    await salesOrderStore.getQuotationListData(0, 1);

    expect(salesOrderStore.searchQuotation.queryStatus).toEqual(1);
  });

  it("getQuotationListData，查詢報價單號或內服單號時，不帶入status", async () => {
    const salesOrderStore = useSalesOrderListStore();
    salesOrderStore.searchQuotation.id = 123;
    salesOrderStore.searchQuotation.queryStatus = 1;

    apiGetQuotationFind.mockResolvedValue({
      data: {
        response: mockResponse
      }
    });
    await salesOrderStore.getQuotationListData(0, 1);

    expect(salesOrderStore.searchQuotation.queryStatus).toEqual(null);
  });

  it("getQuotationListData 成功", async () => {
    const salesOrderStore = useSalesOrderListStore();
    apiGetQuotationFind.mockResolvedValue({
      data: {
        response: mockResponse
      }
    });
    await salesOrderStore.getQuotationListData(0, 1);
    expect(salesOrderStore.quotationList).toEqual({
      ...mockResponse,
      loading: false,
      isSearch: true
    });
  });

  it("getQuotationListData 失敗", async () => {
    const salesOrderStore = useSalesOrderListStore();
    apiGetQuotationFind.mockRejectedValue(error500);

    try {
      await salesOrderStore.getQuotationListData(0, 1);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });
});
