import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import user from "@/store/modules/user";
import { apiGetAuthStatus } from "@/apis/user";

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock("@/apis/user", () => ({
  apiGetAuthStatus: jest.fn()
}));

describe("測試 sotre user actions", () => {
  let store;

  store = new Vuex.Store({
    ...user
  });

  it("GetAuthStatus 成功回傳", async () => {
    const mockData = {
      type: 2,
      accountId: "2121",
      logonId: "akay.hu",
      name: "胡凱綺",
      role: 1,
      allowedSite: [1, 2, 3, 4, 5, 6, 10, 14, 20, 21, 40, 102, 115, 132],
      specialPermission: ["emergency"],
      dataPermission: [
        "CALENDAR_VIEW_SALE_LV1",
        "CALENDAR_VIEW_SALE_LV2",
        "CALENDAR_VIEW_MARKET_LV1",
        "CALENDAR_VIEW_MARKET_LV2",
        "CALENDAR_EDIT_SALE_LV1",
        "CALENDAR_EDIT_SALE_LV2",
        "CALENDAR_EDIT_SALE_LV3",
        "CALENDAR_EDIT_MARKET_LV1",
        "CALENDAR_EDIT_MARKET_LV2",
        "CALENDAR_EDIT_MARKET_LV3",
        "PROJECT_EDIT_LV1",
        "PROJECT_EDIT_LV2",
        "PROJECT_EDIT_LV3",
        "RESERVE_EDIT_SALE_LV1",
        "RESERVE_EDIT_SALE_LV2",
        "RESERVE_EDIT_MARKET_LV1",
        "RESERVE_EDIT_MARKET_LV2",
        "MATERIAL_EDIT_SALE_LV1",
        "MATERIAL_EDIT_SALE_LV2",
        "MATERIAL_EDIT_MARKET_LV1",
        "MATERIAL_EDIT_MARKET_LV2",
        "REPORT_EDIT_LV1",
        "REPORT_EDIT_LV2"
      ],
      accessible: true
    };
    apiGetAuthStatus.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getAuthStatus");
    expect(result).toStrictEqual(mockData);
  });
});
