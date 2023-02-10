import { setActivePinia, createPinia } from "pinia";
import { useAuthorityInventoryStore } from "@/stores/authorityInventory.js";
import {
  apiPatchInventory,
  apiGetInventoryId,
  apiGetInventoryLatestDate
} from "@/apis/inventory.js";

jest.mock("@/apis/inventory", () => ({
  apiPatchInventory: jest.fn(),
  apiGetInventoryId: jest.fn(),
  apiGetInventoryLatestDate: jest.fn()
}));

const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};

describe("測試 Inventory Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    apiPatchInventory.mockReset();
    apiGetInventoryId.mockReset();
    apiGetInventoryLatestDate.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("測試 patchInventory action 成功後回傳", async () => {
    const mockRequest = {
      accountId: 2121,
      requirement: 1
    };
    const mockResponse = true;
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { patchInventory } = authorityInventoryStore;
    apiPatchInventory.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await patchInventory(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 patchInventory action 回傳錯誤", async () => {
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { patchInventory } = authorityInventoryStore;
    const mockRequest = {
      accountId: 2121,
      requirement: 1
    };
    apiPatchInventory.mockRejectedValue(error500);
    try {
      await patchInventory(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 getInventoryId action 成功後回傳", async () => {
    const mockRequest = {
      id: 2121
    };
    const mockResponse = {
      accountId: 2121,
      lastLoginDate: "2023/02/09",
      logonId: "akay.hu",
      name: "胡凱綺",
      requirement: 0,
      requirementLogDate: "2023/02/09",
      status: 0
    };
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { getInventoryId } = authorityInventoryStore;
    apiGetInventoryId.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await getInventoryId(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 getInventoryId action 回傳錯誤", async () => {
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { getInventoryId } = authorityInventoryStore;
    const mockRequest = {
      id: 2121
    };
    apiGetInventoryId.mockRejectedValue(error500);
    try {
      await getInventoryId(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 getInventoryLatestDate action 成功後回傳", async () => {
    const mockResponse = {
      createDate: "2023/12/01 01:02:03",
      endDate: "2023/12/01",
      id: 0,
      isActive: 0,
      startDate: "2023/12/01",
      year: 2023
    };
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { getInventoryLatestDate } = authorityInventoryStore;
    apiGetInventoryLatestDate.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await getInventoryLatestDate();
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 getInventoryLatestDate action 回傳錯誤", async () => {
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { getInventoryLatestDate } = authorityInventoryStore;
    apiGetInventoryLatestDate.mockRejectedValue(error500);
    try {
      await getInventoryLatestDate();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });
});
