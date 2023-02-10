import { setActivePinia, createPinia } from "pinia";
import { useAuthorityInventoryStore } from "@/storesPinia/authorityInventory.js";
import {
  apiPostInventoryActivate,
  apiDeleteInventory,
  apiGetInventoryLatestDate,
  apiPatchInventoryRestore,
  apiGetInventoryDates
} from "@/apis/inventory";

jest.mock("@/apis/inventory", () => ({
  apiPostInventoryActivate: jest.fn(),
  apiDeleteInventory: jest.fn(),
  apiGetInventoryLatestDate: jest.fn(),
  apiPatchInventoryRestore: jest.fn(),
  apiGetInventoryDates: jest.fn()
}));

const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};

describe("測試 Inventory Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    apiPostInventoryActivate.mockReset();
    apiDeleteInventory.mockReset();
    apiGetInventoryLatestDate.mockReset();
    apiPatchInventoryRestore.mockReset();
    apiGetInventoryDates.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("測試 postInventoryActivate action 成功後回傳", async () => {
    const mockRequest = {
      endDate: "2022/12/14",
      id: 1,
      startDate: "2022/12/01"
    };
    const mockResponse = 0;
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { postInventoryActivate } = authorityInventoryStore;
    apiPostInventoryActivate.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await postInventoryActivate(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 postInventoryActivate action 回傳錯誤", async () => {
    const mockRequest = {
      endDate: "2022/12/14",
      id: 1,
      startDate: "2022/12/01"
    };
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { postInventoryActivate } = authorityInventoryStore;
    apiPostInventoryActivate.mockRejectedValue(error500);
    try {
      await postInventoryActivate(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 deleteInventory action 成功後回傳", async () => {
    const mockResponse = true;
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { deleteInventory } = authorityInventoryStore;
    apiDeleteInventory.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await deleteInventory();
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 deleteInventory action 回傳錯誤", async () => {
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { deleteInventory } = authorityInventoryStore;
    apiDeleteInventory.mockRejectedValue(error500);
    try {
      await deleteInventory();
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

  it("測試 patchInventoryRestore action 成功後回傳", async () => {
    const mockRequest = {
      endDate: "2022/12/14",
      id: 1,
      startDate: "2022/12/01"
    };
    const mockResponse = true;
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { patchInventoryRestore } = authorityInventoryStore;
    apiPatchInventoryRestore.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await patchInventoryRestore(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 patchInventoryRestore action 回傳錯誤", async () => {
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { patchInventoryRestore } = authorityInventoryStore;
    const mockRequest = {
      endDate: "2022/12/14",
      id: 1,
      startDate: "2022/12/01"
    };
    apiPatchInventoryRestore.mockRejectedValue(error500);
    try {
      await patchInventoryRestore(mockRequest);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("測試 getInventoryDates action 成功後回傳", async () => {
    const mockResponse = [
      {
        createDate: "2022/12/01 01:02:03",
        endDate: "2022/12/01",
        id: 0,
        isActive: 0,
        startDate: "2022/12/01",
        year: 2022
      }
    ];
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { getInventoryDates } = authorityInventoryStore;
    apiGetInventoryDates.mockResolvedValue({
      data: { response: mockResponse }
    });
    const result = await getInventoryDates();
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 getInventoryDates action 回傳錯誤", async () => {
    const authorityInventoryStore = useAuthorityInventoryStore();
    const { getInventoryDates } = authorityInventoryStore;
    const mockResponse = [
      {
        createDate: "2022/12/01 01:02:03",
        endDate: "2022/12/01",
        id: 0,
        isActive: 0,
        startDate: "2022/12/01",
        year: 2022
      }
    ];
    apiGetInventoryDates.mockRejectedValue(error500);
    try {
      await getInventoryDates(mockResponse);
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });
});
