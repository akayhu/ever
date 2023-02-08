import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import product from "@/store/modules/product";
import { apiGetProductBoardSuggest } from "@/apis/product";

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock("@/apis/product", () => ({
  apiGetProductBoardSuggest: jest.fn()
}));

describe("測試 sotre product actions", () => {
  let store;

  store = new Vuex.Store({
    ...product
  });

  it("GetProductBoardSuggest 成功回傳", async () => {
    const query = {
      keyword: "test",
      checkPermission: true
    };
    const mockData = [
      {
        boardId: 376,
        name: "型態 28 test",
        channelId: 162,
        channelName: "Akay測試頻道22",
        siteId: 5,
        siteName: "工程開發用網站1",
        device: "PC",
        productList: [
          {
            id: 321,
            productCode: "MISC1020000114",
            name: "學生實習專區/首頁/首頁黃金版位－圖",
            status: true,
            boardList: null,
            createDate: null,
            updateDate: null
          }
        ]
      },
      {
        boardId: 398,
        name: "max test",
        channelId: 4,
        channelName: "首頁",
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        productList: [
          {
            id: 361,
            productCode: "MISC1030000069",
            name: "人力銀行主網/主動應徵頁/黃金大版位",
            status: true,
            boardList: null,
            createDate: null,
            updateDate: null
          }
        ]
      },
      {
        boardId: 399,
        name: "max test2",
        channelId: 4,
        channelName: "首頁",
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        productList: [
          {
            id: 361,
            productCode: "MISC1030000069",
            name: "人力銀行主網/主動應徵頁/黃金大版位",
            status: true,
            boardList: null,
            createDate: null,
            updateDate: null
          }
        ]
      }
    ];

    apiGetProductBoardSuggest.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getProductBoardSuggest", query);
    expect(result).toStrictEqual(mockData);
  });
});
