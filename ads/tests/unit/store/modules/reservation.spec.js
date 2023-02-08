import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import reservation from "@/store/modules/reservation.js";
import {
  apiGetReservation,
  apiPostReservation,
  apiDeleteReservation,
  apiPatchReservation,
  apiGetReservationOrder,
  apiGetReservationOrderId,
  apiGetReservationProjectSuggest
} from "@/apis/reservation";

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock("@/apis/reservation", () => ({
  apiGetReservation: jest.fn(),
  apiPostReservation: jest.fn(),
  apiDeleteReservation: jest.fn(),
  apiPatchReservation: jest.fn(),
  apiGetReservationOrder: jest.fn(),
  apiGetReservationOrderId: jest.fn(),
  apiGetReservationProjectSuggest: jest.fn()
}));

describe("測試 sotre reservation actions", () => {
  let store;

  store = new Vuex.Store({
    ...reservation
  });

  it("getReservation 成功回傳", async () => {
    const query = {
      page: 1,
      size: 20,
      projectId: 24,
      statuses: 1,
      type: 0
    };
    const mockData = {
      content: [
        {
          reservationId: 7413,
          boardId: 1,
          boardName: "黃金看版(APP聯播)",
          startDate: "2021/08/27",
          endDate: "2021/08/28",
          canEditDate: true,
          usageDescption: "原合約",
          deductionDescption: "",
          offDate: null,
          deletable: true,
          days: 2,
          productId: 268,
          productName: "工作快找APP/首頁/黃金看板(天)(20萬)",
          note: "",
          canEditNote: true,
          usage: 0,
          deduction: 0,
          giveaway: false,
          canEditUsage: true,
          projectName: "圓山大飯店-Victor合約簽回",
          projectOwner: "3059",
          status: 1,
          channelName: "首頁",
          siteName: "人力銀行C主網",
          device: "MOBILE",
          customerId: null,
          projectId: 24,
          projectType: 0,
          orderId: null,
          orderDate: null,
          groupCount: 1,
          createDate: "2021/08/13 10:13:31"
        }
      ],
      totalPages: 1,
      totalElements: 1,
      last: false,
      size: 20,
      page: 1,
      numberOfElements: 20
    };
    apiGetReservation.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getReservation", query);
    expect(result).toStrictEqual(mockData);
  });

  it("postReservation 成功回傳", async () => {
    const query = {
      projectId: 123,
      reservations: [
        {
          boardId: 123,
          deduction: 0,
          giveaway: false,
          note: "客戶有交代...",
          periods: [
            {
              end: "2020/06/15",
              start: "2020/06/15"
            }
          ],
          productId: 456,
          usage: 0
        }
      ]
    };
    const mockData = {
      formalCount: 1,
      prepareCount: 1
    };
    apiPostReservation.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("postReservation", query);
    expect(result).toStrictEqual(mockData);
  });

  it("deleteReservation 成功回傳", async () => {
    const query = {
      id: 24
    };
    const mockData = true;
    apiDeleteReservation.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("deleteReservation", query);
    expect(result).toStrictEqual(mockData);
  });

  it("patchReservation 成功回傳", async () => {
    const query = {
      id: 24,
      modifyReservation: {
        deduction: 0,
        endDate: "2020/07/15",
        giveaway: false,
        note: "客戶有交代...",
        startDate: "2020/06/15",
        usage: 0
      }
    };
    const mockData = {
      formalCount: 1,
      prepareCount: 1
    };
    apiPatchReservation.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("patchReservation", query);
    expect(result).toStrictEqual(mockData);
  });

  it("getReservationOrder 成功回傳", async () => {
    const query = {
      endDate: "2020/07/15",
      projectOwner: 2121,
      startDate: "2020/07/10"
    };
    const mockData = [
      {
        customerId: 0,
        customerName: "string",
        orderId: "string"
      }
    ];
    apiGetReservationOrder.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getReservationOrder", query);
    expect(result).toStrictEqual(mockData);
  });

  it("apiGetReservationOrderId 成功回傳", async () => {
    const query = {
      end: "2020/12/17",
      projectOwner: "30103-201200014",
      start: "2020/12/15"
    };
    const mockData = [
      {
        reservationId: 319,
        boardId: 20,
        startDate: "2020/12/14",
        endDate: "2020/12/20",
        boardName: "上方橫幅",
        siteId: 1,
        siteName: "人力銀行C主網",
        channelId: 5,
        channelName: "工作列表頁",
        status: 5,
        allowMaterial: false,
        allowEmergency: false,
        emergencyPermission: true,
        device: "PC",
        typeId: 1,
        emergencyPublish: {
          on: false,
          off: false,
          status: 5,
          permission: true
        }
      }
    ];
    apiGetReservationOrderId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getReservationOrderId", query);
    expect(result).toStrictEqual(mockData);
  });

  it("getReservationProjectSuggest 成功回傳", async () => {
    const query = {
      keyword: "熱門",
      projectId: 184
    };
    const mockData = [
      {
        id: 19,
        channelId: 4,
        channelName: "首頁",
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "熱門企業",
        url: null,
        conditionId: 0,
        snapshot: true,
        typeId: 14,
        style: "",
        responseTypeTemplateDetail: null,
        reserve: 28,
        lowerLimit: 14,
        upperLimit: 28,
        promotion: false,
        status: true,
        associateWithProduct: null,
        canDelete: null,
        sort: 9011001
      }
    ];
    apiGetReservationProjectSuggest.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getReservationProjectSuggest", query);
    expect(result).toStrictEqual(mockData);
  });
});
