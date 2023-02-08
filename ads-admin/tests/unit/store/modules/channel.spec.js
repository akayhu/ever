import { setActivePinia, createPinia } from "pinia";
import { useChannelStore } from "@/storesPinia/channel.js";
import {
  apiGetChannel,
  apiPostChannel,
  apiPatchChannel,
  apiGetChannelId,
  apiDeleteChannelId,
  apiGetChannelSuggest
} from "@/apis/channel";

jest.mock("@/apis/channel", () => ({
  apiGetChannel: jest.fn(),
  apiPostChannel: jest.fn(),
  apiPatchChannel: jest.fn(),
  apiGetChannelId: jest.fn(),
  apiDeleteChannelId: jest.fn(),
  apiGetChannelSuggest: jest.fn()
}));

describe("測試 Channel Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 getChannel action 成功後回傳", async () => {
    const channelStore = useChannelStore();
    const { getChannel } = channelStore;
    const query = {
      siteId: 1,
      device: "PC",
      sort: "status_desc",
      status: true,
      checkPermission: true
    };
    const mockData = [
      {
        id: 4,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "首頁",
        url: "https://www.104-dev.com.tw/jobs/main/",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 16
      },
      {
        id: 5,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "工作列表頁",
        url: "https://www.104-dev.com.tw/jobs/search",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 6
      }
    ];
    apiGetChannel.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getChannel(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 postChannel action 成功後回傳", async () => {
    const channelStore = useChannelStore();
    const { postChannel } = channelStore;
    const query = [
      {
        height: "200",
        name: "工程頻道2",
        siteId: 5,
        sleep: "1000",
        status: true,
        url: null,
        width: "200"
      }
    ];
    const mockData = [
      {
        boardCount: null,
        device: "PC",
        height: 200,
        id: 176,
        name: "工程頻道2",
        siteId: 5,
        siteName: "工程開發用網站1",
        sleep: 1000,
        status: true,
        url: null,
        width: 200
      }
    ];
    apiPostChannel.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await postChannel(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getChannelId action 成功後回傳", async () => {
    const channelStore = useChannelStore();
    const { getChannelId } = channelStore;
    const query = {
      channelId: 4,
      checkPermission: true,
      siteId: 1,
      status: true
    };
    const mockData = {
      id: 4,
      siteId: 1,
      siteName: "人力銀行C主網",
      device: "PC",
      name: "首頁",
      url: "https://www.104-dev.com.tw/jobs/main/",
      sleep: 0,
      width: 0,
      height: 0,
      status: true,
      boardCount: 16
    };
    apiGetChannelId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getChannelId(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 patchChannel action 成功後回傳", async () => {
    const channelStore = useChannelStore();
    const { patchChannel } = channelStore;
    const query = {
      height: 1500,
      id: 162,
      name: "Akay測試頻道22",
      siteId: 5,
      sleep: 7000,
      status: true,
      url: "https://tw.yahoo.com",
      width: 1500
    };
    const mockData = {
      boardCount: null,
      device: "PC",
      height: 1500,
      id: 162,
      name: "Akay測試頻道22",
      siteId: 5,
      siteName: "工程開發用網站1",
      sleep: 7000,
      status: true,
      url: "https://tw.yahoo.com",
      width: 1500
    };
    apiPatchChannel.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await patchChannel(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getChannelMenu action 成功後回傳", async () => {
    const channelStore = useChannelStore();
    const { getChannelMenu } = channelStore;
    const query = {
      siteId: 1,
      device: "PC",
      sort: "status_desc",
      status: true,
      checkPermission: true
    };
    const mockData = [
      {
        id: 4,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "首頁",
        url: "https://www.104-dev.com.tw/jobs/main/",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 16
      },
      {
        id: 5,
        siteId: 1,
        siteName: "人力銀行C主網",
        device: "PC",
        name: "工作列表頁",
        url: "https://www.104-dev.com.tw/jobs/search",
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: 6
      }
    ];
    apiGetChannel.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getChannelMenu(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 deleteChannelId action 成功後回傳", async () => {
    const channelStore = useChannelStore();
    const { deleteChannelId } = channelStore;
    const query = {
      siteId: 5,
      channelId: 177
    };
    apiDeleteChannelId.mockResolvedValue(true);
    const result = await deleteChannelId(query);
    expect(result).toStrictEqual(true);
  });

  it("測試 getChannelSuggest action 成功後回傳", async () => {
    const channelStore = useChannelStore();
    const { getChannelSuggest } = channelStore;
    const query = {
      checkPermission: true,
      keyword: "測試",
      siteId: 5,
      status: true
    };
    const mockData = [
      {
        id: 62,
        siteId: 5,
        siteName: "工程開發用網站1",
        device: "PC",
        name: "測試頻道1",
        url: null,
        sleep: 0,
        width: 0,
        height: 0,
        status: true,
        boardCount: null
      },
      {
        id: 162,
        siteId: 5,
        siteName: "工程開發用網站1",
        device: "PC",
        name: "Akay測試頻道22",
        url: "https://tw.yahoo.com",
        sleep: 7000,
        width: 1500,
        height: 1500,
        status: true,
        boardCount: null
      }
    ];
    apiGetChannelSuggest.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getChannelSuggest(query);
    expect(result).toStrictEqual(mockData);
  });
});
