import { setActivePinia, createPinia } from "pinia";
import { useDownloadReportStore } from "@/stores/report/download";
import { apiGetReportProcessList, apiGetReportStatus } from "@/apis/report";

jest.mock("@/apis/report", () => ({
  apiGetReportProcessList: jest.fn(),
  apiGetReportStatus: jest.fn()
}));

let mockRouteQuery = {};
let mockTableData = {};
let mockProccessingStatus = [];
let mockCompletedStatus = [];
const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};

describe("測試 Download Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    apiGetReportProcessList.mockReset();
    apiGetReportStatus.mockReset();

    mockRouteQuery = {
      selectedCompany: { id: 1, name: "Company" },
      selectedDate: { start: "2021/01/01", end: "2021/01/31" },
      selectedAccount: { id: 1, name: "Account" },
      selectedProject: { id: 1, name: "Project" },
      selectedStatus: { id: 1, name: "Status" },
      currentTab: "1"
    };

    mockTableData = {
      number: 0,
      size: 10,
      content: [
        {
          id: 2,
          status: 1,
          customerId: 1112082628,
          customerName: "多麗絲股份有限公司勿動",
          projectId: 146,
          projectName: "多麗絲QA_April",
          startDate: "2021/03/12",
          endDate: "2021/10/31",
          createDate: "2022/03/29 09:19:09",
          finishDate: "2022/03/29 09:19:25",
          accountId: "2037",
          accountName: "何勝勇",
          extension: "xlsx"
        }
      ],
      totalPages: 2,
      totalElements: 12,
      last: false,
      numberOfElements: 10
    };

    mockProccessingStatus = [
      {
        id: 21,
        status: 0
      },
      {
        id: 22,
        status: 0
      }
    ];

    mockCompletedStatus = [
      {
        id: 21,
        status: 1
      },
      {
        id: 22,
        status: 1
      }
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("updateRouteQuery action 測試", () => {
    const downloadStore = useDownloadReportStore();
    downloadStore.updateRouteQuery(mockRouteQuery);
    expect(downloadStore.routeQuery).toEqual(mockRouteQuery);
  });

  it("getTableDate action 成功", async () => {
    const downloadStore = useDownloadReportStore();
    apiGetReportProcessList.mockResolvedValue({
      data: { response: mockTableData }
    });
    downloadStore.updateRouteQuery(mockRouteQuery);
    await downloadStore.getTableDate();
    expect(downloadStore.tableData).toEqual(mockTableData.content);
    expect(downloadStore.pageData.totalElements).toEqual(
      mockTableData.totalElements
    );
    expect(downloadStore.pageData.totalPages).toEqual(mockTableData.totalPages);
  });

  it("getTableDate action 失敗", async () => {
    const downloadStore = useDownloadReportStore();
    downloadStore.updateRouteQuery(mockRouteQuery);
    apiGetReportProcessList.mockRejectedValue(error500);
    try {
      await downloadStore.getTableDate();
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("updateDataStatus action 成功", async () => {
    const downloadStore = useDownloadReportStore();
    apiGetReportStatus.mockResolvedValue({
      data: { response: mockCompletedStatus }
    });
    downloadStore.tableData = [...mockProccessingStatus];

    await downloadStore.updateDataStatus([]);
    expect(downloadStore.tableData).toEqual(mockCompletedStatus);
  });

  it("polling 1 times", async () => {
    jest.useFakeTimers();
    const downloadStore = useDownloadReportStore();
    apiGetReportStatus
      .mockResolvedValueOnce({
        data: {
          response: mockProccessingStatus
        }
      })
      .mockResolvedValueOnce({
        data: {
          response: mockCompletedStatus
        }
      });
    downloadStore.tableData = [...mockProccessingStatus];

    downloadStore.fetchData();
    jest.runAllTimers();
    expect(apiGetReportStatus).toBeCalledTimes(1);
  });

  it("polling 3 times", async () => {
    jest.useFakeTimers();
    const downloadStore = useDownloadReportStore();
    apiGetReportStatus
      .mockResolvedValueOnce({
        data: {
          response: mockProccessingStatus
        }
      })
      .mockResolvedValueOnce({
        data: {
          response: mockProccessingStatus
        }
      })
      .mockResolvedValueOnce({
        data: {
          response: mockCompletedStatus
        }
      });
    downloadStore.tableData = [...mockProccessingStatus];

    downloadStore.fetchData();
    for (let i = 0; i < 7; i++) {
      jest.advanceTimersByTime(30000);
      await Promise.resolve();
    }

    expect(apiGetReportStatus).toBeCalledTimes(3);
  });
});
