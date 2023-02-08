import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import project from "@/store/modules/project";
import {
  apiGetCustomerSuggestion,
  apiGetCustomerSuggestionKeyword,
  apiGetProject,
  apiPostProject,
  apiPatchProject,
  apiGetProjectId,
  apiGetProjectRecommend,
  apiGetProjectSearch,
  apiGetProjectSuggestion,
  apiDeleteProjectId
} from "@/apis/project";

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock("@/apis/project", () => ({
  apiGetCustomerSuggestion: jest.fn(),
  apiGetCustomerSuggestionKeyword: jest.fn(),
  apiGetProject: jest.fn(),
  apiPostProject: jest.fn(),
  apiPatchProject: jest.fn(),
  apiGetProjectId: jest.fn(),
  apiGetProjectRecommend: jest.fn(),
  apiGetProjectSearch: jest.fn(),
  apiGetProjectSuggestion: jest.fn(),
  apiDeleteProjectId: jest.fn()
}));

describe("測試 sotre project actions", () => {
  let store;

  store = new Vuex.Store({
    ...project
  });

  it("GetCustomerSuggestion 企業名稱成功回傳", async () => {
    const query = {
      keyword: "信義房屋"
    };
    const mockData = [
      {
        id: 1110256292,
        name: "信義房屋仲介股份有限公司(1110256292)"
      }
    ];
    apiGetCustomerSuggestionKeyword.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getCustomerSuggestion", query);
    expect(result).toStrictEqual(mockData);
  });

  it("GetCustomerSuggestion 企業統編成功回傳", async () => {
    const query = {
      invoice: 84598349
    };
    const mockData = [
      {
        id: 1609002854,
        name: "一零四資訊科技股份有限公司(1609002854)"
      }
    ];
    apiGetCustomerSuggestion.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getCustomerSuggestion", query);
    expect(result).toStrictEqual(mockData);
  });

  it("GetProject 成功回傳", async () => {
    const query = {
      page: 1,
      size: 20,
      condition: "C-1112083465"
    };
    const mockData = {
      content: [
        {
          customerId: 1112083465,
          canEditCustomer: false,
          projectName: "圓山大飯店_測試銷用B",
          canEditProjectName: true,
          status: 1,
          canEditStatus: [2, -1],
          note: "",
          canEditNote: true,
          price: 0,
          canEditPrice: true,
          freeProject: false,
          canEditFreeProject: false,
          owner: "3059",
          canEditOwner: true,
          ownerName: "徐文達",
          customerName: "圓山大飯店",
          projectId: 184,
          startDate: "2021/06/07",
          closeDate: null,
          contractDate: null,
          canDeleteProject: false
        }
      ],
      totalPages: 1,
      totalElements: 8,
      last: false,
      size: 20,
      page: 1,
      numberOfElements: 8
    };
    apiGetProject.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getProject", query);
    expect(result).toStrictEqual(mockData);
  });

  it("PostProject 成功回傳", async () => {
    const query = {
      customerId: 1234,
      freeProject: false,
      note: "這個案子很重要",
      owner: "T1234",
      price: 1000000,
      projectName: "信義房屋-20200505",
      status: 0
    };
    const mockData = {
      warning: {
        code: "211",
        desc: "客戶編號不存在"
      }
    };
    apiPostProject.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("postProject", query);
    expect(result).toStrictEqual(mockData);
  });

  it("PatchProject 成功回傳", async () => {
    const query = {
      customerId: 1234,
      freeProject: false,
      note: "這個案子很重要",
      owner: "T1234",
      price: 1000000,
      projectName: "信義房屋-20200505",
      status: 0
    };
    const mockData = {
      warning: {
        code: "211",
        desc: "客戶編號不存在"
      }
    };
    apiPatchProject.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("patchProject", query);
    expect(result).toStrictEqual(mockData);
  });

  it("GetProjectId 成功回傳", async () => {
    const query = {
      id: 184
    };
    const mockData = {
      customerId: 1112083465,
      canEditCustomer: false,
      projectName: "圓山大飯店_測試銷用B",
      canEditProjectName: true,
      status: 1,
      canEditStatus: [2, -1],
      note: "",
      canEditNote: true,
      price: 0,
      canEditPrice: true,
      freeProject: false,
      canEditFreeProject: false,
      owner: "3059",
      canEditOwner: true,
      ownerName: "徐文達",
      customerName: "圓山大飯店",
      projectId: 184,
      startDate: "2021/06/07",
      closeDate: null,
      contractDate: "2021/06/07 09:37:24",
      canDeleteProject: false
    };
    apiGetProjectId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getProjectId", query);
    expect(result).toStrictEqual(mockData);
  });

  it("GetProjectRecommend 成功回傳", async () => {
    const query = {
      keyword: "圓山"
    };
    const mockData = [
      {
        customerId: 1112083465,
        projectName: "圓山大飯店-Victor合約簽回",
        owner: "3059",
        customerName: "圓山大飯店",
        projectId: 24,
        projectStatus: 1,
        projectType: 0
      }
    ];
    apiGetProjectRecommend.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getProjectRecommend", query);
    expect(result).toStrictEqual(mockData);
  });

  it("GetProjectSearch 成功回傳", async () => {
    const query = {
      customerId: 1112083465,
      excludeProject: 42,
      keyword: "圓山"
    };
    const mockData = [
      {
        id: 24,
        name: "圓山大飯店-Victor合約簽回"
      },
      {
        id: 131,
        name: "圓山大飯店_測試提案中"
      },
      {
        id: 142,
        name: "圓山大飯店_Victor測改狀態"
      },
      {
        id: 167,
        name: "圓山大飯店_測試拉cue"
      },
      {
        id: 181,
        name: "圓山大飯店_測有走期作廢"
      },
      {
        id: 183,
        name: "圓山大飯店_測試銷用A"
      },
      {
        id: 184,
        name: "圓山大飯店_測試銷用B"
      }
    ];
    apiGetProjectSearch.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getProjectSearch", query);
    expect(result).toStrictEqual(mockData);
  });

  it("GetProjectSuggestion", async () => {
    const query = {
      keyword: "圓山"
    };
    const mockData = [
      {
        id: "C-1112083465",
        name: "圓山大飯店"
      },
      {
        id: "P-24",
        name: "圓山大飯店-Victor合約簽回"
      },
      {
        id: "P-42",
        name: "圓山大飯店-Victortest"
      },
      {
        id: "P-131",
        name: "圓山大飯店_測試提案中"
      },
      {
        id: "P-142",
        name: "圓山大飯店_Victor測改狀態"
      },
      {
        id: "P-167",
        name: "圓山大飯店_測試拉cue"
      },
      {
        id: "P-181",
        name: "圓山大飯店_測有走期作廢"
      },
      {
        id: "P-183",
        name: "圓山大飯店_測試銷用A"
      },
      {
        id: "P-184",
        name: "圓山大飯店_測試銷用B"
      }
    ];
    apiGetProjectSuggestion.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("getProjectSuggestion", query);
    expect(result).toStrictEqual(mockData);
  });

  it("DeleteProjectId", async () => {
    const query = { id: 123 };
    const mockData = true;
    apiDeleteProjectId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await store.dispatch("deleteProjectId", query);
    expect(result).toStrictEqual(mockData);
  });
});
