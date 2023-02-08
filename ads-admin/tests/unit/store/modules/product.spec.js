import { setActivePinia, createPinia } from "pinia";
import { useProductStore } from "@/storesPinia/product.js";
import {
  apiGetProduct,
  apiGetProductId,
  apiPutProduct,
  apiGetProductMisSuggest,
  apiPutProductMisSync
} from "@/apis/product";

jest.mock("@/apis/product.js", () => ({
  apiGetProduct: jest.fn(),
  apiGetProductId: jest.fn(),
  apiPutProduct: jest.fn(),
  apiGetProductMisSuggest: jest.fn(),
  apiPutProductMisSync: jest.fn()
}));

const mockProductListHasData = {
  content: [
    {
      boardList: [
        {
          associateWithProduct: null,
          canDelete: null,
          channelId: 47,
          channelName: "新版搜尋頁",
          device: "APP",
          id: 157,
          lowerLimit: 1,
          name: "(兼職)搜尋頁Hashtag2",
          promotion: true,
          reserve: 1,
          responseTypeTemplateDetail: null,
          siteId: 3,
          siteName: "工作快找",
          snapshot: null,
          sort: 1,
          status: true,
          style: "newAppHashtag",
          typeId: 2,
          upperLimit: 1,
          url: null
        }
      ],
      createDate: "2020-12-11T06:13:51.000+0000",
      id: 64,
      name: "(0牌價)工作快找app / 新版工作快找 / (兼職)搜尋頁Hashtag2(天)",
      productCode: "MISC1100000422",
      status: true,
      updateDate: "2020-12-11T06:13:51.000+0000"
    }
  ]
};

const mockGetProductIdHasData = {
  boardList: [
    {
      associateWithProduct: null,
      canDelete: null,
      channelId: 47,
      channelName: "新版搜尋頁",
      device: "APP",
      id: 157,
      lowerLimit: 1,
      name: "(兼職)搜尋頁Hashtag2",
      promotion: true,
      reserve: 1,
      responseTypeTemplateDetail: null,
      siteId: 3,
      siteName: "工作快找",
      snapshot: null,
      sort: 1,
      status: true,
      style: "newAppHashtag",
      typeId: 2,
      upperLimit: 1,
      url: null
    }
  ],
  createDate: "2020-12-11T06:13:51.000+0000",
  id: 64,
  name: "(0牌價)工作快找app / 新版工作快找 / (兼職)搜尋頁Hashtag2(天)",
  productCode: "MISC1100000422",
  status: true,
  updateDate: "2020-12-11T06:13:51.000+0000"
};

const mockPutProductHasData = {
  boardList: [
    {
      associateWithProduct: null,
      canDelete: null,
      channelId: 47,
      channelName: "新版搜尋頁",
      device: "APP",
      id: 157,
      lowerLimit: 1,
      name: "(兼職)搜尋頁Hashtag2",
      promotion: true,
      reserve: 1,
      responseTypeTemplateDetail: null,
      siteId: 3,
      siteName: "工作快找",
      snapshot: null,
      sort: 1,
      status: true,
      style: "newAppHashtag",
      typeId: 2,
      upperLimit: 1,
      url: null
    }
  ],
  createDate: "2021-10-04T03:57:55.000+0000",
  id: 309,
  name: "(0牌價)工作快找app / 新版工作快找 / (兼職)搜尋頁Hashtag2(天)",
  productCode: "MISC1100000422",
  status: true,
  updateDate: "2021-10-04T03:57:55.000+0000"
};

const mockGetProductMisSuggestHasData = {
  name: "人力銀行主網/首頁/黃金大版位(圖)",
  productCode: "MISC1030000020",
  status: true
};

const resError = {
  status: 400,
  data: { response: { code: "210", message: "something wrong" } }
};

describe("測試 Product Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 getProductList action", async () => {
    const productStore = useProductStore();
    const { getProductList } = productStore;
    const query = {
      size: 20,
      page: 1,
      sort: "status_desc",
      status: "",
      keyword: ""
    };
    apiGetProduct.mockResolvedValue({
      data: { response: mockProductListHasData }
    });
    const result = await getProductList(query);
    expect(result).toStrictEqual(mockProductListHasData);
  });

  it("測試 getProductId action 錯誤 400", async () => {
    const productStore = useProductStore();
    const { getProductId } = productStore;
    const query = { productId: 64 };
    apiGetProductId.mockRejectedValue(resError);
    expect.assertions(1);
    try {
      await getProductId(query);
    } catch (e) {
      expect(e).toStrictEqual(resError);
    }
  });

  it("測試 getProductId action", async () => {
    const productStore = useProductStore();
    const { getProductId } = productStore;
    const query = {
      productId: 64
    };
    apiGetProductId.mockResolvedValue({
      data: { response: mockGetProductIdHasData }
    });
    const result = await getProductId(query);
    expect(result).toStrictEqual(mockGetProductIdHasData);
  });

  it("測試 putProduct action", async () => {
    const productStore = useProductStore();
    const { putProduct } = productStore;
    const params = {
      boards: [
        {
          id: 1,
          device: "PC",
          siteId: 1,
          siteName: "siteName",
          channelId: 2,
          channelName: "channelName",
          boardId: 3,
          boardName: "boardName",
          edit: true,
          sort: 1
        }
      ],
      productCode: "",
      name: "",
      status: false
    };
    apiPutProduct.mockResolvedValue({
      data: { response: mockPutProductHasData }
    });
    const result = await putProduct(params);
    expect(result).toStrictEqual(mockPutProductHasData);
  });

  it("測試 getProductMisSuggest action", async () => {
    const productStore = useProductStore();
    const { getProductMisSuggest } = productStore;
    const params = {
      keyword: "測試"
    };
    apiGetProductMisSuggest.mockResolvedValue({
      data: { response: mockGetProductMisSuggestHasData }
    });
    const result = await getProductMisSuggest(params);
    expect(result).toStrictEqual(mockGetProductMisSuggestHasData);
  });

  it("測試 getProductMisSuggest action 錯誤 400", async () => {
    const productStore = useProductStore();
    const { getProductMisSuggest } = productStore;
    const params = {
      keyword: "測試"
    };
    apiGetProductMisSuggest.mockRejectedValue(resError);
    expect.assertions(1);
    try {
      await getProductMisSuggest(params);
    } catch (e) {
      expect(e).toStrictEqual(resError);
    }
  });

  it("測試 putProductMisSync action 同步成功狀態", async () => {
    const productStore = useProductStore();
    const { putProductMisSync } = productStore;
    apiPutProductMisSync.mockResolvedValue({
      data: { response: true }
    });
    const result = await putProductMisSync();
    expect(result).toStrictEqual(true);
  });

  it("測試 putProductMisSync action 錯誤 404", async () => {
    const productStore = useProductStore();
    const { putProductMisSync } = productStore;
    apiPutProductMisSync.mockRejectedValue(resError);
    expect.assertions(1);
    try {
      await putProductMisSync();
    } catch (e) {
      expect(e).toStrictEqual(resError);
    }
  });
});
