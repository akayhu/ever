import { setActivePinia, createPinia } from "pinia";
import { useSiteStore } from "@/storesPinia/site.js";
import {
  apiGetSite,
  apiPostSite,
  apiPatchSite,
  apiGetSiteId,
  apiDeleteSiteId,
  apiGetSiteSuggest
} from "@/apis/site";

jest.mock("@/apis/site", () => ({
  apiGetSite: jest.fn(),
  apiPostSite: jest.fn(),
  apiPatchSite: jest.fn(),
  apiGetSiteId: jest.fn(),
  apiDeleteSiteId: jest.fn(),
  apiGetSiteSuggest: jest.fn()
}));

describe("測試 Site Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 postSite action 成功後回傳", async () => {
    const siteStore = useSiteStore();
    const { postSite } = siteStore;
    const query = {
      device: "PC",
      id: 1,
      name: "人力銀行主網",
      status: false,
      url: "www.104.com.tw"
    };
    const mockData = {
      channelCount: 0,
      device: "PC",
      id: 0,
      name: "string",
      sort: 0,
      status: true,
      url: "string"
    };
    apiPostSite.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await postSite(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getSiteId action 成功後回傳", async () => {
    const siteStore = useSiteStore();
    const { getSiteId } = siteStore;
    const query = {
      checkPermission: true,
      siteId: 1,
      status: true
    };
    const mockData = {
      id: 1,
      name: "人力銀行C主網",
      url: "https://www.104.com.tw/",
      device: "PC",
      status: true,
      sort: null,
      channelCount: 14
    };
    apiGetSiteId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getSiteId(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getSite action 成功後回傳", async () => {
    const siteStore = useSiteStore();
    const { getSite } = siteStore;
    const query = {
      checkPermission: true,
      device: "PC",
      page: 1,
      size: 20,
      sort: "status_desc",
      status: true
    };
    const mockData = {
      content: [
        {
          id: 1,
          name: "人力銀行C主網",
          url: "https://www.104.com.tw/",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 14
        },
        {
          id: 4,
          name: "人力銀行B主網",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 5,
          name: "工程開發用網站1",
          url: null,
          device: "PC",
          status: true,
          sort: null,
          channelCount: 2
        },
        {
          id: 6,
          name: "VM測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 14,
          name: "米test",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 40,
          name: "QA測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 102,
          name: "Victor測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 134,
          name: "max test",
          url: null,
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        }
      ],
      totalPages: 1,
      totalElements: 8,
      last: false,
      size: 20,
      page: 1,
      numberOfElements: 8
    };
    apiGetSite.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getSite(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 patchSite action 成功後回傳", async () => {
    const siteStore = useSiteStore();
    const { patchSite } = siteStore;
    const query = {
      device: "PC",
      id: 5,
      name: "工程開發用網站",
      status: true,
      url: null
    };
    const mockData = {
      channelCount: null,
      device: "PC",
      id: 5,
      name: "工程開發用網站",
      sort: null,
      status: true,
      url: null
    };
    apiPatchSite.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await patchSite(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 getSearchSiteList action 成功後回傳", async () => {
    const siteStore = useSiteStore();
    const { getSearchSiteList } = siteStore;
    const query = {
      checkPermission: true,
      device: "PC",
      keyword: "工程",
      status: true
    };
    const mockData = [
      {
        id: 5,
        name: "工程開發用網站",
        url: null,
        device: "PC",
        status: true,
        sort: null,
        channelCount: null
      }
    ];
    const mockGetSiteIdData = {
      id: 5,
      name: "工程開發用網站",
      url: null,
      device: "PC",
      status: true,
      sort: null,
      channelCount: 2
    };
    apiGetSiteSuggest.mockResolvedValue({
      data: { response: mockData }
    });
    apiGetSiteId.mockResolvedValue({
      data: { response: mockGetSiteIdData }
    });
    const result = await getSearchSiteList(query);
    expect(result).toStrictEqual(mockGetSiteIdData);
  });

  it("測試 getSiteMenu action 成功後回傳", async () => {
    const siteStore = useSiteStore();
    const { getSiteMenu } = siteStore;
    const query = {
      checkPermission: true,
      device: "PC",
      page: 1,
      size: 20,
      sort: "status_desc",
      status: true
    };
    const mockData = {
      content: [
        {
          id: 1,
          name: "人力銀行C主網",
          url: "https://www.104.com.tw/",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 14
        },
        {
          id: 4,
          name: "人力銀行B主網",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 5,
          name: "工程開發用網站1",
          url: null,
          device: "PC",
          status: true,
          sort: null,
          channelCount: 2
        },
        {
          id: 6,
          name: "VM測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 14,
          name: "米test",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 40,
          name: "QA測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 102,
          name: "Victor測試",
          url: "",
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        },
        {
          id: 134,
          name: "max test",
          url: null,
          device: "PC",
          status: true,
          sort: null,
          channelCount: 1
        }
      ],
      totalPages: 1,
      totalElements: 8,
      last: false,
      size: 20,
      page: 1,
      numberOfElements: 8
    };
    apiGetSite.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getSiteMenu(query);
    expect(result).toStrictEqual(mockData);
  });

  it("測試 deleteSiteId action 成功後回傳", async () => {
    const siteStore = useSiteStore();
    const { deleteSiteId } = siteStore;
    apiDeleteSiteId.mockResolvedValue(true);
    const result = await deleteSiteId({ siteId: 136 });
    expect(result).toStrictEqual(true);
  });
});
