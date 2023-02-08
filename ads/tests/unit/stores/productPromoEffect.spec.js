import { setActivePinia, createPinia } from "pinia";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect";
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

jest.mock("@/apis/productEffect", () => ({
  apiGetProductEffect: jest.fn(),
  apiPutProductEffect: jest.fn()
}));

jest.mock("@/apis/productPromo", () => ({
  apiGetProductPromo: jest.fn(),
  apiPutProductPromo: jest.fn(),
  apiPatchProductPromoIdAction: jest.fn(),
  apiGetProductPromoIdApplyId: jest.fn(),
  apiGetProductPromoNew: jest.fn(),
  apiGetProductPromoId: jest.fn()
}));

const mockResponse = {
  applyId: 0,
  approvedDate: "string",
  audit: 0,
  createDate: "string",
  effectiveDate: "string",
  id: 0,
  name: "string",
  note: "string",
  productPromoActionList: ["SAVE"],
  productPromoEffectList: [
    {
      boardId: 0,
      boardName: "string",
      channelId: 0,
      channelName: "string",
      click: 0,
      device: "string",
      floorPrice: 0,
      group: "string",
      impression: 0,
      marketPrice: 0,
      noteForEffect: "string",
      noteForEffectLastVersion: "string",
      noteForProduct: "string",
      noteForPromo: "string",
      noteForPromoLastVersion: "string",
      productCode: "string",
      productId: 0,
      productName: "string",
      productPromoId: 0,
      rotate: 0,
      siteId: 0,
      siteName: "string"
    }
  ],
  quarter: 0,
  token: "string",
  updateDate: "string",
  year: 0
};

const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};

describe("測試 ProductPromoEffect Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    apiGetProductEffect.mockReset();
    apiPutProductEffect.mockReset();
    apiGetProductPromo.mockReset();
    apiPutProductPromo.mockReset();
    apiPatchProductPromoIdAction.mockReset();
    apiGetProductPromoIdApplyId.mockReset();
    apiGetProductPromoNew.mockReset();
    apiGetProductPromoId.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("測試 getProductEffect action 成功後回傳", async () => {
    const mockRequest = {
      quarter: 1,
      year: 2023
    };
    const mockResponse = {
      year: 2023,
      quarter: 1,
      productCode: "MISC1100000242",
      rotate: 0,
      marketPrice: 0,
      actualImpression: 0,
      actualClick: 0,
      impression: 9999,
      click: 999,
      status: true,
      group: "",
      note: "",
      createDate: "2023/01/10",
      updateDate: "2023/01/10",
      productId: 441,
      productName: "人力銀行主網/C首頁(2018)/特選企業(左)天",
      siteId: 1,
      siteName: "人力銀行C主網",
      channelId: 4,
      channelName: "首頁",
      boardId: 11,
      boardName: "特選企業1",
      device: "PC"
    };
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductEffect } = productPromoEffectStore;
    apiGetProductEffect.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await getProductEffect(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 getProductEffect action 回傳錯誤", async () => {
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductEffect } = productPromoEffectStore;
    const mockRequest = {
      quarter: 1,
      year: 2023
    };
    apiGetProductEffect.mockRejectedValue(error500);
    try {
      await getProductEffect(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 putProductEffect action 成功後回傳", async () => {
    const mockRequest = {
      quarter: 2,
      year: 2023,
      requestProductEffectList: [
        {
          actualClick: 0,
          actualImpression: 0,
          boardId: 10,
          boardName: "黃金大版位",
          channelId: 4,
          channelName: "首頁",
          click: 0,
          createDate: "2023/01/10",
          ctr: 0,
          device: "PC",
          focus: false,
          group: "",
          impression: 0,
          index: 0,
          marketPrice: 14285.71,
          note: "",
          productCode: "MISC1100000283",
          productId: 241,
          productName: "人力銀行主網/C首頁(2018)/黃金大版位天(10萬)",
          quarter: 2,
          rotate: 0,
          siteId: 1,
          siteName: "人力銀行C主網",
          status: true,
          updateDate: "2023/01/10",
          year: 2023
        }
      ]
    };
    const mockResponse = [
      {
        actualClick: 0,
        actualImpression: 0,
        boardId: 10,
        boardName: "黃金大版位",
        channelId: 4,
        channelName: "首頁",
        click: 0,
        createDate: "2023/01/10",
        device: "PC",
        group: "",
        impression: 0,
        marketPrice: 14285.71,
        note: "",
        productCode: "MISC1100000283",
        productId: 241,
        productName: "人力銀行主網/C首頁(2018)/黃金大版位天(10萬)",
        quarter: 2,
        rotate: 0,
        siteId: 1,
        siteName: "人力銀行C主網",
        status: true,
        updateDate: "2023/01/10",
        year: 2023
      }
    ];
    const productPromoEffectStore = useProductPromoEffectStore();
    const { putProductEffect } = productPromoEffectStore;
    apiPutProductEffect.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await putProductEffect(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 putProductEffect action 回傳錯誤", async () => {
    const productPromoEffectStore = useProductPromoEffectStore();
    const { putProductEffect } = productPromoEffectStore;
    const mockRequest = {
      quarter: 2,
      year: 2023,
      requestProductEffectList: [
        {
          actualClick: 0,
          actualImpression: 0,
          boardId: 10,
          boardName: "黃金大版位",
          channelId: 4,
          channelName: "首頁",
          click: 0,
          createDate: "2023/01/10",
          ctr: 0,
          device: "PC",
          focus: false,
          group: "",
          impression: 0,
          index: 0,
          marketPrice: 14285.71,
          note: "",
          productCode: "MISC1100000283",
          productId: 241,
          productName: "人力銀行主網/C首頁(2018)/黃金大版位天(10萬)",
          quarter: 2,
          rotate: 0,
          siteId: 1,
          siteName: "人力銀行C主網",
          status: true,
          updateDate: "2023/01/10",
          year: 2023
        }
      ]
    };
    apiPutProductEffect.mockRejectedValue(error500);
    try {
      await putProductEffect(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 getProductPromo action 成功後回傳", async () => {
    const mockRequest = {
      quarter: 1,
      year: 2023,
      auditList: [4, 5]
    };
    const mockResponse = [
      {
        applyId: null,
        approvedDate: "2023/01/12",
        audit: 5,
        createDate: "2023/01/09 15:25:54",
        effectiveDate: "2023/01/09",
        id: 8,
        name: "Y23 Q1 01-09",
        note: null,
        productPromoActionList: null,
        productPromoEffectList: null,
        quarter: 1,
        token: "09cf0609-2667-4e4a-bb7c-90b17d3d8b10",
        updateDate: "2023/01/12 10:10:00",
        year: 2023
      }
    ];
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductPromo } = productPromoEffectStore;
    apiGetProductPromo.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await getProductPromo(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 getProductPromo action 回傳錯誤", async () => {
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductPromo } = productPromoEffectStore;
    const mockRequest = {
      quarter: 1,
      year: 2023,
      auditList: [4, 5]
    };
    apiGetProductPromo.mockRejectedValue(error500);
    try {
      await getProductPromo(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 putProductPromo action 成功後回傳", async () => {
    const mockRequest = {
      quarter: 1,
      year: 2023,
      requestProductPromo: {
        effectiveDate: "2022/12/20",
        id: 0,
        name: "我是促案",
        note: "寫些促案說明",
        productPromoEffectList: [
          {
            floorPrice: 10000,
            noteForEffect: "寫些商品成效備註",
            noteForProduct: "寫些商品促案說明",
            noteForPromo: "寫些商品促案備註",
            productCode: "A000000001"
          }
        ]
      }
    };
    const productPromoEffectStore = useProductPromoEffectStore();
    const { putProductPromo } = productPromoEffectStore;
    apiPutProductPromo.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await putProductPromo(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 putProductPromo action 回傳錯誤", async () => {
    const productPromoEffectStore = useProductPromoEffectStore();
    const { putProductPromo } = productPromoEffectStore;
    const mockRequest = {
      quarter: 1,
      year: 2023,
      requestProductPromo: {
        effectiveDate: "2022/12/20",
        id: 0,
        name: "我是促案",
        note: "寫些促案說明",
        productPromoEffectList: [
          {
            floorPrice: 10000,
            noteForEffect: "寫些商品成效備註",
            noteForProduct: "寫些商品促案說明",
            noteForPromo: "寫些商品促案備註",
            productCode: "A000000001"
          }
        ]
      }
    };
    apiGetProductPromo.mockRejectedValue(error500);
    try {
      await putProductPromo(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 patchProductPromoIdAction action 成功後回傳", async () => {
    const mockRequest = {
      action: "SAVE",
      id: 8780
    };
    const productPromoEffectStore = useProductPromoEffectStore();
    const { patchProductPromoIdAction } = productPromoEffectStore;
    apiPatchProductPromoIdAction.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await patchProductPromoIdAction(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 patchProductPromoIdAction action 回傳錯誤", async () => {
    const productPromoEffectStore = useProductPromoEffectStore();
    const { patchProductPromoIdAction } = productPromoEffectStore;
    const mockRequest = {
      action: "SAVE",
      id: 8780
    };
    apiPatchProductPromoIdAction.mockRejectedValue(error500);
    try {
      await patchProductPromoIdAction(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 getProductPromoIdApplyId action 成功後回傳", async () => {
    const mockRequest = {
      applyId: 1,
      id: 123
    };
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductPromoIdApplyId } = productPromoEffectStore;
    apiGetProductPromoIdApplyId.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await getProductPromoIdApplyId(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 patchProductPromoIdAction action 回傳錯誤", async () => {
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductPromoIdApplyId } = productPromoEffectStore;
    const mockRequest = {
      applyId: 1,
      id: 123
    };
    apiGetProductPromoIdApplyId.mockRejectedValue(error500);
    try {
      await getProductPromoIdApplyId(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 getProductPromoNew action 成功後回傳", async () => {
    const mockRequest = {
      quarter: 1,
      year: 2023
    };
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductPromoNew } = productPromoEffectStore;
    apiGetProductPromoNew.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await getProductPromoNew(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 getProductPromoNew action 回傳錯誤", async () => {
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductPromoNew } = productPromoEffectStore;
    const mockRequest = {
      quarter: 1,
      year: 2023
    };
    apiGetProductPromoNew.mockRejectedValue(error500);
    try {
      await getProductPromoNew(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 getProductPromoId action 成功後回傳", async () => {
    const mockRequest = {
      id: 123
    };
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductPromoId } = productPromoEffectStore;
    apiGetProductPromoId.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await getProductPromoId(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 getProductPromoId action 回傳錯誤", async () => {
    const productPromoEffectStore = useProductPromoEffectStore();
    const { getProductPromoId } = productPromoEffectStore;
    const mockRequest = {
      id: 123
    };
    apiGetProductPromoId.mockRejectedValue(error500);
    try {
      await getProductPromoId(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });
});
