import { setActivePinia, createPinia } from "pinia";
import { useLogStore } from "@/storesPinia/log.js";
import {
  apiGetLog,
  apiGetLogidCompareResult,
  apiGetLogDataHistory
} from "@/apis/log";

const error = { status: 404, message: "something wrong" };

jest.mock("@/apis/log.js", () => ({
  apiGetLog: jest.fn(),
  apiGetLogidCompareResult: jest.fn(),
  apiGetLogDataHistory: jest.fn()
}));

describe("測試 Log Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 getLog action 成功後回傳", async () => {
    const logStore = useLogStore();
    const { getLog } = logStore;
    const mockLogData = {
      content: [
        {
          accountId: "8888",
          createDate: "2021/09/30 14:49:30",
          description: "後台登入",
          id: 5886,
          keyId: "8888",
          logType: 0,
          logonId: "InDay.Big",
          manipulation: 0,
          model: null,
          name: "大中天"
        }
      ],
      last: false,
      numberOfElements: 20,
      page: 1,
      size: 20,
      totalElements: 5870,
      totalPages: 294
    };
    apiGetLog.mockResolvedValue({ data: { response: mockLogData } });
    const result = await getLog();
    expect(result).toStrictEqual(mockLogData);
  });

  it("測試 getLog action 錯誤 404", async () => {
    const logStore = useLogStore();
    const { getLog } = logStore;
    apiGetLog.mockResolvedValue({ data: { response: error } });
    try {
      await getLog();
    } catch (e) {
      expect(e).toStrictEqual(error);
    }
  });

  it("測試 getLogidCompareResult action 成功後回傳", async () => {
    const logStore = useLogStore();
    const { getLogidCompareResult } = logStore;
    const mockLogidCompareResultHasData = {
      differences: [
        {
          after: "0.0",
          before: "1.0",
          property: "status"
        },
        {
          after: "https://adsmart.104-dev.com.tw/",
          before: "",
          property: "contents.0.link"
        }
      ],
      onlyOnLeft: null,
      onlyOnRight: null
    };
    apiGetLogidCompareResult.mockResolvedValue({
      data: { response: mockLogidCompareResultHasData }
    });
    const result = await getLogidCompareResult();
    expect(result).toStrictEqual(mockLogidCompareResultHasData);
  });

  it("測試 getLogidCompareResult action 無資料狀態", async () => {
    const logStore = useLogStore();
    const { getLogidCompareResult } = logStore;
    const mockLogidCompareResultNoData = {
      differences: null,
      onlyOnLeft: null,
      onlyOnRight: null
    };
    apiGetLogidCompareResult.mockResolvedValue({
      data: { response: mockLogidCompareResultNoData }
    });
    const result = await getLogidCompareResult();
    expect(result).toStrictEqual(mockLogidCompareResultNoData);
  });

  it("測試 getLogDataHistory action 成功後回傳", async () => {
    const logStore = useLogStore();
    const { getLogDataHistory } = logStore;
    const mockLogDataHistoryHasData = {
      content: [
        {
          accountId: "8888",
          createDate: "2021/09/30 14:49:30",
          description: "後台登入",
          id: 5886,
          keyId: "8888",
          logType: 0,
          logonId: "InDay.Big",
          manipulation: 0,
          model: null,
          name: "大中天"
        }
      ],
      last: true,
      numberOfElements: 0,
      page: 1,
      size: 20,
      totalElements: 0,
      totalPages: 0
    };
    apiGetLogDataHistory.mockResolvedValue({
      data: { response: mockLogDataHistoryHasData }
    });
    const result = await getLogDataHistory();
    expect(result).toStrictEqual(mockLogDataHistoryHasData);
  });

  it("測試 getLogDataHistory action 錯誤 404", async () => {
    const logStore = useLogStore();
    const { getLogDataHistory } = logStore;
    const error = { status: 404, message: "something wrong" };
    apiGetLogDataHistory.mockResolvedValue({ data: { response: error } });
    try {
      await getLogDataHistory();
    } catch (e) {
      expect(e).toStrictEqual(error);
    }
  });
});
