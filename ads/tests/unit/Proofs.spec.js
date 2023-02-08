import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import proof from "@/store/modules/proof";
import cloneDeep from "lodash/clonedeep";

const localVue = createLocalVue();
localVue.use(Vuex);

const mockData = [
  {
    id: 7863,
    boardId: 10,
    boardName: "黃金大版位",
    channelId: 4,
    channelName: "首頁",
    siteId: 1,
    siteName: "人力銀行C主網",
    device: "PC",
    status: 5,
    customerId: 1112000051,
    customerName: "台灣麥當勞餐廳股份有限公司",
    projectId: 212,
    projectName: "麥當勞051",
    materialId: 2405,
    materialUrlList: [
      "https://proofs.adsmart.104-dev.com.tw/snapshot/2/4/0/5/preview-1.jpg"
    ]
  },
  {
    id: 5660,
    boardId: 10,
    boardName: "黃金大版位",
    channelId: 4,
    channelName: "首頁",
    siteId: 1,
    siteName: "人力銀行C主網",
    device: "PC",
    status: 5,
    customerId: 1112078211,
    customerName: "華信牙醫診所",
    projectId: 3,
    projectName: "華信_Doreen驗收_VIP",
    materialId: 1859,
    materialUrlList: [
      "https://proofs.adsmart.104-dev.com.tw/snapshot/1/8/5/9/preview-1.jpg"
    ]
  },
  {
    id: 7864,
    boardId: 11,
    boardName: "特選企業1",
    channelId: 4,
    channelName: "首頁",
    siteId: 1,
    siteName: "人力銀行C主網",
    device: "PC",
    status: 5,
    customerId: 1112000051,
    customerName: "台灣麥當勞餐廳股份有限公司",
    projectId: 212,
    projectName: "麥當勞051",
    materialId: 2406,
    materialUrlList: [
      "https://proofs.adsmart.104-dev.com.tw/snapshot/2/4/0/6/preview-1.jpg"
    ]
  }
];

jest.mock("@/apis/proof.js", () => ({
  apiGetProofPreview: () =>
    Promise.resolve({
      data: {
        response: mockData
      }
    })
}));

describe("Proofs.vue", () => {
  test("呼叫getProofPreview後，與getters資料一致", async () => {
    expect.assertions(1);

    const clonedproof = cloneDeep(proof);

    const store = new Vuex.Store(clonedproof);

    await store.dispatch("getProofPreview", { channelId: "", publishDate: "" });

    expect(store.getters.proofPreviewData).toEqual(mockData);
  });
});
