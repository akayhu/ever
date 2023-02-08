import { setActivePinia, createPinia } from "pinia";
import { useReviewStore } from "@/stores/review";
import {
  apiGetQuotationHistory,
  apiGetProductPromoHistory,
  apiGetResourceApprover,
  apiPostResourceAction,
  apiGetResourceSchedule
} from "@/apis/review";

jest.mock("@/apis/review", () => ({
  apiGetQuotationHistory: jest.fn(),
  apiGetProductPromoHistory: jest.fn(),
  apiGetResourceApprover: jest.fn(),
  apiPostResourceAction: jest.fn(),
  apiGetResourceSchedule: jest.fn()
}));
// jest.mock("moment", () => {
//   return () => jest.requireActual("moment")("2022-01-01T00:00:00.000Z");
// });

const mockSegmentGroups = [
  {
    endDate: "2022/09/15 12:34:56",
    groupId: "string",
    reporter: {
      empId: "T0001",
      empName: "黃粒紅"
    },
    revokeReason: "數字寫錯",
    segments: [
      {
        processId: "TL1",
        processName: "法務流程",
        records: [
          {
            allowedApprover: [
              {
                empId: "T0001",
                empName: "黃粒紅"
              }
            ],
            approver: {
              empId: "T0001",
              empName: "黃粒紅"
            },
            note: "string",
            requestDate: "2022/09/15 12:34:56",
            result: 0,
            reviewDate: "2022/09/15 12:34:56",
            tag: "TL1"
          }
        ]
      }
    ],
    startDate: "2022/09/15 12:34:56",
    terminateType: 1
  }
];
const mockQuotationHistoryResponse = {
  orderId: "30103-221200001",
  quotationAudit: 1,
  quotationId: 1234,
  quotationStage: 1,
  segmentGroups: mockSegmentGroups
};
const mockProductPromoHistoryResponse = {
  productPromoId: 1,
  productPromoName: "Y23-Q1-0104",
  segmentGroups: mockSegmentGroups
};
const mockScheduleResponse = {
  legalSegment: null,
  normalSegment: {
    processId: "TL1",
    processName: "法務流程",
    records: [
      {
        allowedApprover: [
          {
            empId: "T0001",
            empName: "黃粒紅"
          }
        ],
        approver: {
          empId: "T0001",
          empName: "黃粒紅"
        },
        note: "string",
        requestDate: "2022/09/15 12:34:56",
        result: 0,
        reviewDate: "2022/09/15 12:34:56",
        tag: "TL1"
      }
    ]
  }
};
const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};
let reviewStore = null;

describe("測試 Review Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    apiGetQuotationHistory.mockReset();
    apiGetProductPromoHistory.mockReset();
    apiGetResourceApprover.mockReset();
    apiPostResourceAction.mockReset();
    apiGetResourceSchedule.mockReset();
    reviewStore = useReviewStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getQuotationHistory 成功", async () => {
    apiGetQuotationHistory.mockResolvedValue({
      data: {
        response: mockQuotationHistoryResponse
      }
    });
    await reviewStore.getQuotationHistory({
      quotationId: 123,
      quotationStage: 0
    });

    expect(reviewStore.quotationHistory).toStrictEqual(
      mockQuotationHistoryResponse
    );
  });

  it("getQuotationHistory 失敗", async () => {
    apiGetQuotationHistory.mockRejectedValue(error500);

    try {
      await reviewStore.getQuotationHistory({
        quotationId: 123,
        quotationStage: 0
      });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getProductPromoHistory 成功", async () => {
    apiGetProductPromoHistory.mockResolvedValue({
      data: {
        response: mockProductPromoHistoryResponse
      }
    });
    await reviewStore.getProductPromoHistory({ id: 1 });

    expect(reviewStore.productPromoHistory).toStrictEqual(
      mockProductPromoHistoryResponse
    );
  });

  it("getProductPromoHistory 失敗", async () => {
    apiGetProductPromoHistory.mockRejectedValue(error500);

    try {
      await reviewStore.getProductPromoHistory({ id: 1 });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getResourceApprover 成功", async () => {
    apiGetResourceApprover.mockResolvedValue({
      data: {
        response: [
          {
            empId: "2280",
            empName: "鍾文雄"
          },
          {
            empId: "1093",
            empName: "陳嵩榮"
          },
          {
            empId: "3307",
            empName: "周家樂"
          }
        ]
      }
    });
    await reviewStore.getResourceApprover({ id: 1, type: "QUOTATION" });

    expect(reviewStore.approver).toStrictEqual([
      {
        empId: "2280",
        empName: "鍾文雄"
      },
      {
        empId: "1093",
        empName: "陳嵩榮"
      },
      {
        empId: "3307",
        empName: "周家樂"
      }
    ]);
  });

  it("getResourceApprover 失敗", async () => {
    apiGetResourceApprover.mockRejectedValue(error500);

    try {
      await reviewStore.getResourceApprover({ id: 1, type: "QUOTATION" });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });

  it("getResourceSchedule 成功", async () => {
    apiGetResourceSchedule.mockResolvedValue({
      data: {
        response: mockScheduleResponse
      }
    });
    await reviewStore.getResourceSchedule({ id: 1, type: "QUOTATION" });

    expect(reviewStore.schedule).toStrictEqual(mockScheduleResponse);
  });

  it("getResourceSchedule 失敗", async () => {
    apiGetResourceSchedule.mockRejectedValue(error500);

    try {
      await reviewStore.getResourceSchedule({ id: 1, type: "QUOTATION" });
    } catch (error) {
      expect(error).toStrictEqual(error500);
    }
  });
});
