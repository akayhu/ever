import { setActivePinia, createPinia } from "pinia";
import { usePullCueStore } from "@/stores/pullCue";
import {
  apiGetCueBannerId,
  apiGetCueBannerIdReservation,
  apiDeleteCueBannerIdReservation,
  apiPatchCueBannerIdReservation
} from "@/apis/cueBanner";
import {
  apiPostCueProjectId,
  apiDeleteCueProjectId,
  apiGetCueProjectId,
  apiPutCueProjectId,
  apiGetCueQuotationProjectId
} from "@/apis/cueProjectService";
import {
  apiPostCuePriceInformation,
  apiPostCueTotalMarketPrice,
  apiGetCueTotalMarketPriceHistory,
  apiGetProductCalculatePrice,
  apiGetCueTotalMarketPriceChangeApplication
} from "@/apis/cue";
import { apiGetProjectAvailableCount } from "@/apis/project";

import { apiGetQuotationOrderId } from "@/apis/quotation";

jest.mock("@/apis/cueBanner", () => ({
  apiGetCueBannerId: jest.fn(),
  apiGetCueBannerIdReservation: jest.fn(),
  apiDeleteCueBannerIdReservation: jest.fn(),
  apiPatchCueBannerIdReservation: jest.fn()
}));

jest.mock("@/apis/cueProjectService", () => ({
  apiPostCueProjectId: jest.fn(),
  apiDeleteCueProjectId: jest.fn(),
  apiGetCueProjectId: jest.fn(),
  apiPutCueProjectId: jest.fn(),
  apiGetCueQuotationProjectId: jest.fn()
}));

jest.mock("@/apis/cue", () => ({
  apiPostCuePriceInformation: jest.fn(),
  apiPostCueTotalMarketPrice: jest.fn(),
  apiGetCueTotalMarketPriceHistory: jest.fn(),
  apiGetProductCalculatePrice: jest.fn(),
  apiGetCueTotalMarketPriceChangeApplication: jest.fn()
}));

jest.mock("@/apis/project", () => ({
  apiGetProjectAvailableCount: jest.fn()
}));

jest.mock("@/apis/quotation", () => ({
  apiGetQuotationOrderId: jest.fn()
}));

describe("測試 PullCue Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("getPullCueQuotationId: 成功取拉 cue 報價單/內服單", async () => {
    const pullCueStore = usePullCueStore();
    apiGetQuotationOrderId.mockResolvedValue({
      data: {
        response: {
          id: 413,
          orderId: 473,
          orderExecutionStartDate: "2023/03/01",
          orderExecutionEndDate: "2023/03/31",
          paymentTaxRate: 0.05
        }
      }
    });
    await pullCueStore.getPullCueQuotationId();
    expect(pullCueStore.quotationData).toStrictEqual({
      id: 413,
      orderId: 473,
      orderExecutionStartDate: "2023/03/01",
      orderExecutionEndDate: "2023/03/31",
      paymentTaxRate: 0.05
    });
  });

  it("getPullCueQuotationId: 取拉 cue 報價單/內服單失敗", async () => {
    const pullCueStore = usePullCueStore();
    apiGetQuotationOrderId.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });
    try {
      await pullCueStore.getPullCueQuotationId();
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("getProjectAvailableCount: 成功取得依報價單編號查詢可拉Cue的預約專案數", async () => {
    const pullCueStore = usePullCueStore();
    apiGetProjectAvailableCount.mockResolvedValue({
      data: {
        response: 3
      }
    });
    await pullCueStore.getProjectAvailableCount();
    expect(pullCueStore.projectAvailableCount).toBe(3);
  });

  it("getProjectAvailableCount: 取得依報價單編號查詢可拉Cue的預約專案數失敗", async () => {
    const pullCueStore = usePullCueStore();
    apiGetProjectAvailableCount.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });
    try {
      await pullCueStore.getProjectAvailableCount();
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("setProjectId: 變更專案id, projectId有值", async () => {
    const pullCueStore = usePullCueStore();

    pullCueStore.setProjectId({ projectId: 777 });
    expect(pullCueStore.projectId).toBe(777);
  });

  it("setProjectId: 變更專案id, projectId不存在", async () => {
    const pullCueStore = usePullCueStore();

    pullCueStore.setProjectId({});
    expect(pullCueStore.projectId).toBe(undefined);
  });

  it("getCueBannerId: 查詢合約內容拉cue(Banner-商品列表), 成功", async () => {
    const pullCueStore = usePullCueStore();
    apiGetCueBannerId.mockResolvedValue({
      data: {
        response: {
          cueProducts: [
            {
              arrangeDays: 20,
              endDate: "2022/09/27",
              externalName: "超熱門企業",
              price: 1000,
              productId: 1234,
              productName: "熱門企業",
              source: 20,
              startDate: "2022/09/27",
              totalDays: 27
            }
          ],
          projectAvailable: true,
          projectId: 1234
        }
      }
    });
    await pullCueStore.getCueBannerId();
    expect(pullCueStore.bannerQuotationProject).toStrictEqual({
      cueProducts: [
        {
          arrangeDays: 20,
          endDate: "2022/09/27",
          externalName: "超熱門企業",
          price: 1000,
          productId: 1234,
          productName: "熱門企業",
          source: 20,
          startDate: "2022/09/27",
          totalDays: 27
        }
      ],
      projectAvailable: true,
      projectId: 1234
    });
  });

  it("getCueBannerId: 查詢合約內容拉cue(Banner-商品列表), 失敗", async () => {
    const pullCueStore = usePullCueStore();
    apiGetCueBannerId.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.getCueBannerId();
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("getCueBannerIdReservation: 帶status狀態1為拉cue, 成功查詢合約內容拉cue(Banner-商品列表)", async () => {
    const pullCueStore = usePullCueStore();
    apiGetCueBannerIdReservation.mockResolvedValue({
      data: {
        response: {
          number: 1,
          size: 20,
          content: [
            {
              reservationId: 11691,
              startDate: "2023/03/27",
              endDate: "2023/03/31",
              price: 19354.9,
              marketPrice: 4285.7,
              unitPrice: 3871.0,
              priceIncludeTax: 20322.6,
              marketPriceIncludeTax: 4500.0,
              unitPriceIncludeTax: 4064.5,
              discountPercentage: 0.9,
              days: 5,
              free: false,
              exposed: false,
              note: null,
              groupId: "410-1673343352402-5",
              arrangeable: false,
              removable: true
            },
            {
              reservationId: 11690,
              startDate: "2023/03/20",
              endDate: "2023/03/26",
              price: 27096.8,
              marketPrice: 4285.7,
              unitPrice: 3871.0,
              priceIncludeTax: 28451.6,
              marketPriceIncludeTax: 4500.0,
              unitPriceIncludeTax: 4064.5,
              discountPercentage: 0.9,
              days: 7,
              free: false,
              exposed: false,
              note: null,
              groupId: "410-1673343352402-4",
              arrangeable: false,
              removable: true
            }
          ],
          totalPages: 1,
          totalElements: 0,
          last: true,
          numberOfElements: 0
        }
      }
    });
    await pullCueStore.getCueBannerIdReservation({ status: 1 });
    expect(pullCueStore.pullCueQuotationProjectReservation).toStrictEqual({
      number: 1,
      size: 20,
      content: [
        {
          reservationId: 11691,
          startDate: "2023/03/27",
          endDate: "2023/03/31",
          price: 19354.9,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 20322.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 5,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-5",
          arrangeable: false,
          removable: true,
          checked: false
        },
        {
          reservationId: 11690,
          startDate: "2023/03/20",
          endDate: "2023/03/26",
          price: 27096.8,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 28451.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 7,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-4",
          arrangeable: false,
          removable: true,
          checked: false
        }
      ],
      totalPages: 1,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    });
  });

  it("getCueBannerIdReservation: 未帶status狀態為未拉cue, 成功查詢合約內容未拉cue(Banner-商品列表)", async () => {
    const pullCueStore = usePullCueStore();
    apiGetCueBannerIdReservation.mockResolvedValue({
      data: {
        response: {
          number: 1,
          size: 20,
          content: [
            {
              reservationId: 11691,
              startDate: "2023/03/27",
              endDate: "2023/03/31",
              price: 19354.9,
              marketPrice: 4285.7,
              unitPrice: 3871.0,
              priceIncludeTax: 20322.6,
              marketPriceIncludeTax: 4500.0,
              unitPriceIncludeTax: 4064.5,
              discountPercentage: 0.9,
              days: 5,
              free: false,
              exposed: false,
              note: null,
              groupId: "410-1673343352402-5",
              arrangeable: false,
              removable: true
            }
          ],
          totalPages: 1,
          totalElements: 0,
          last: true,
          numberOfElements: 0
        }
      }
    });
    await pullCueStore.getCueBannerIdReservation({ status: 0 });
    expect(pullCueStore.notPullCueQuotationProjectReservation).toStrictEqual({
      number: 1,
      size: 20,
      content: [
        {
          reservationId: 11691,
          startDate: "2023/03/27",
          endDate: "2023/03/31",
          price: 19354.9,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 20322.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 5,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-5",
          arrangeable: false,
          removable: true,
          checked: false
        }
      ],
      totalPages: 1,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    });
  });

  it("getCueBannerIdReservation: nextPage 為 true, 未帶status狀態為未拉cue, 成功查詢合約內容未拉cue(Banner-商品列表)", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.notPullCueQuotationProjectReservation = {
      content: [],
      number: 0,
      size: 20,
      totalPages: 0,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    };
    apiGetCueBannerIdReservation.mockResolvedValue({
      data: {
        response: {
          number: 1,
          size: 20,
          content: [
            {
              reservationId: 11691,
              startDate: "2023/03/27",
              endDate: "2023/03/31",
              price: 19354.9,
              marketPrice: 4285.7,
              unitPrice: 3871.0,
              priceIncludeTax: 20322.6,
              marketPriceIncludeTax: 4500.0,
              unitPriceIncludeTax: 4064.5,
              discountPercentage: 0.9,
              days: 5,
              free: false,
              exposed: false,
              note: null,
              groupId: "410-1673343352402-5",
              arrangeable: false,
              removable: true
            }
          ],
          totalPages: 1,
          totalElements: 0,
          last: true,
          numberOfElements: 0
        }
      }
    });

    await pullCueStore.getCueBannerIdReservation({ status: 0 }, true);
    expect(pullCueStore.notPullCueQuotationProjectReservation).toStrictEqual({
      number: 1,
      size: 20,
      content: [
        {
          reservationId: 11691,
          startDate: "2023/03/27",
          endDate: "2023/03/31",
          price: 19354.9,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 20322.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 5,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-5",
          arrangeable: false,
          removable: true,
          checked: false
        }
      ],
      totalPages: 1,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    });
  });

  it("changeCueBannerLoading: 設定 CueBanner Loading 狀態", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.changeCueProjectLoading(true);
    expect(pullCueStore.cueProjectLoading).toBe(true);
  });

  it("changeNotPullCueLoading: 設定變更未拉 cue, Loading 狀態", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.changeNotPullCueLoading(true);
    expect(pullCueStore.notPullCueLoading).toBe(true);
  });

  it("changePullCueLoading: 設定變更已拉 cue, Loading 狀態", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.changePullCueLoading(true);
    expect(pullCueStore.pullCueLoading).toBe(true);
  });

  it("changeProgressBarLoading: 設定變更已拉 cue, Loading 狀態", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.changeProgressBarLoading(true);
    expect(pullCueStore.progressBarLoading).toBe(true);
  });

  it("postCuePriceInformation: 取得Cue表各項金額統計資訊查詢, 成功", async () => {
    const pullCueStore = usePullCueStore();
    apiPostCuePriceInformation.mockResolvedValue({
      data: {
        response: {
          totalMarketPriceIncludeTax: 693000.0,
          totalReserveMarketPriceIncludeTax: 498000.0,
          totalCueMarketPriceIncludeTax: 243000.0,
          totalCuePriceIncludeTax: 210677.4,
          totalPriceIncludeTax: 420000.0,
          warning: false,
          allowToCue: true,
          currentAppendMarketPriceIncludeTax: 0.0,
          currentAppendPriceIncludeTax: 0.0,
          overMarketPriceIncludeTax: 0.0,
          overPriceIncludeTax: 0.0,
          remainingMarketPriceIncludeTax: 450000.0,
          remainingPriceIncludeTax: 209322.6,
          changeMarketPrice: false
        }
      }
    });

    await pullCueStore.postCuePriceInformation();
    expect(pullCueStore.cuePriceInformation).toStrictEqual({
      totalMarketPriceIncludeTax: 693000.0,
      totalReserveMarketPriceIncludeTax: 498000.0,
      totalCueMarketPriceIncludeTax: 243000.0,
      totalCuePriceIncludeTax: 210677.4,
      totalPriceIncludeTax: 420000.0,
      warning: false,
      allowToCue: true,
      currentAppendMarketPriceIncludeTax: 0.0,
      currentAppendPriceIncludeTax: 0.0,
      overMarketPriceIncludeTax: 0.0,
      overPriceIncludeTax: 0.0,
      remainingMarketPriceIncludeTax: 450000.0,
      remainingPriceIncludeTax: 209322.6,
      changeMarketPrice: false
    });
  });

  it("postCuePriceInformation: 取得Cue表各項金額統計資訊查詢, 失敗", async () => {
    const pullCueStore = usePullCueStore();
    apiPostCuePriceInformation.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.postCuePriceInformation();
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("patchCueBannerIdReservation: 將檔期加入Cue表, 成功", async () => {
    const pullCueStore = usePullCueStore();
    apiPatchCueBannerIdReservation.mockResolvedValue({
      data: {}
    });

    const result = await pullCueStore.patchCueBannerIdReservation({
      free: false,
      groupId: "410-1673343352402-4",
      note: null,
      priceIncludeTax: 28451.6
    });
    expect(result).toStrictEqual({});
  });

  it("patchCueBannerIdReservation: 將檔期加入Cue表, 失敗", async () => {
    const pullCueStore = usePullCueStore();
    apiPatchCueBannerIdReservation.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.patchCueBannerIdReservation({
        free: false,
        groupId: "410-1673343352402-4",
        note: null,
        priceIncludeTax: 28451.6
      });
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("postCueTotalMarketPrice: 變更Cue表可輸入總牌價上限, 成功回傳cue表變更單的流水編號 ", async () => {
    const pullCueStore = usePullCueStore();
    apiPostCueTotalMarketPrice.mockResolvedValue({
      data: {
        response: 53
      }
    });

    const result = await pullCueStore.postCueTotalMarketPrice();
    expect(result).toBe(53);
    expect(pullCueStore.cuePriceInformation.changeMarketPrice).toBe(true);
  });

  it("postCueTotalMarketPrice: 變更Cue表可輸入總牌價上限, 失敗", async () => {
    const pullCueStore = usePullCueStore();
    apiPostCueTotalMarketPrice.mockRejectedValue({
      warning: {
        code: "2",
        desc: "尚有進行中的牌價變更"
      }
    });

    try {
      await pullCueStore.postCueTotalMarketPrice();
    } catch (error) {
      expect(error).toStrictEqual({
        warning: {
          code: "2",
          desc: "尚有進行中的牌價變更"
        }
      });
    }
  });

  it("getCueQuotationProjectId: 依報價專案查詢Cue表專案型服務, 成功", async () => {
    const pullCueStore = usePullCueStore();
    const mockData = {
      projectAvailable: true,
      productAvailable: true,
      prepareProjService: null,
      readyProjServices: {
        number: 1,
        size: 20,
        content: [
          {
            quantity: 1,
            free: false,
            marketPriceIncludeTax: 126000.0,
            priceIncludeTax: 105000.0,
            price: 100000.0,
            unitPriceIncludeTax: 105000.0,
            note: "測試",
            externalName: "人力銀行主網/新聞快訊/橫幅",
            startDate: "2023/03/01",
            endDate: "2023/03/31",
            discountPercentage: 0.8,
            days: 31
          }
        ],
        totalPages: 1,
        totalElements: 1,
        last: true,
        numberOfElements: 1
      }
    };
    apiGetCueQuotationProjectId.mockResolvedValue({
      data: {
        response: mockData
      }
    });

    await pullCueStore.getCueQuotationProjectId({
      id: 45,
      page: 1,
      projectId: 410,
      size: 20
    });
    expect(pullCueStore.otherQuotationProject).toStrictEqual(mockData);
  });

  it("getCueQuotationProjectId: 依報價專案查詢Cue表專案型服務, 失敗", async () => {
    const pullCueStore = usePullCueStore();

    apiPatchCueBannerIdReservation.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.getCueQuotationProjectId({
        id: 45,
        page: 1,
        projectId: 410,
        size: 20
      });
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("deleteCueProjectId: 刪除Cue表專案型服務, 成功", async () => {
    const pullCueStore = usePullCueStore();
    apiDeleteCueProjectId.mockResolvedValue({
      data: {
        response: {}
      }
    });

    const result = await pullCueStore.deleteCueProjectId({
      cueProjectServiceId: 405,
      projectId: 401
    });
    expect(result).toStrictEqual({});
  });

  it("deleteCueProjectId: 刪除Cue表專案型服務, 失敗 400 專案不存在", async () => {
    const pullCueStore = usePullCueStore();

    apiPatchCueBannerIdReservation.mockRejectedValue({
      warning: {
        code: "211",
        desc: "專案不存在"
      }
    });

    try {
      await pullCueStore.getCueQuotationProjectId({
        cueProjectServiceId: 405,
        projectId: 401
      });
    } catch (error) {
      expect(error).toStrictEqual({
        warning: {
          code: "211",
          desc: "專案不存在"
        }
      });
    }
  });

  it("deleteCueProjectId: 刪除Cue表專案型服務, 失敗 500 系統錯誤", async () => {
    const pullCueStore = usePullCueStore();

    apiPatchCueBannerIdReservation.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.getCueQuotationProjectId({
        cueProjectServiceId: 405,
        projectId: 401
      });
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("postCueProjectId: 新增Cue表專案型服務, 成功回傳流水單號", async () => {
    const pullCueStore = usePullCueStore();
    apiPostCueProjectId.mockResolvedValue({
      data: { response: 56 }
    });

    const result = await pullCueStore.postCueProjectId({
      costPriceIncludeTax: "10000",
      endDate: "2023/04/05",
      externalName: "hello~",
      free: false,
      marketPriceIncludeTax: "555555",
      note: null,
      priceIncludeTax: "555555",
      productId: 431,
      productName: "人力銀行主網/新聞快訊/橫幅",
      projectId: 410,
      quantity: "3",
      startDate: "2023/03/29",
      unit: "WEEK"
    });
    expect(result).toBe(56);
  });

  it("postCueProjectId: 新增Cue表專案型服務, 失敗 400 專案不存在", async () => {
    const pullCueStore = usePullCueStore();

    apiPatchCueBannerIdReservation.mockRejectedValue({
      warning: {
        code: "211",
        desc: "專案不存在"
      }
    });

    try {
      await pullCueStore.getCueQuotationProjectId({
        costPriceIncludeTax: "10000",
        endDate: "2023/04/05",
        externalName: "hello~",
        free: false,
        marketPriceIncludeTax: "555555",
        note: null,
        priceIncludeTax: "555555",
        productId: 431,
        productName: "人力銀行主網/新聞快訊/橫幅",
        projectId: 410,
        quantity: "3",
        startDate: "2023/03/29",
        unit: "WEEK"
      });
    } catch (error) {
      expect(error).toStrictEqual({
        warning: {
          code: "211",
          desc: "專案不存在"
        }
      });
    }
  });

  it("postCueProjectId: 新增Cue表專案型服務, 失敗 500 系統錯誤", async () => {
    const pullCueStore = usePullCueStore();

    apiPatchCueBannerIdReservation.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.getCueQuotationProjectId({
        costPriceIncludeTax: "10000",
        endDate: "2023/04/05",
        externalName: "hello~",
        free: false,
        marketPriceIncludeTax: "555555",
        note: null,
        priceIncludeTax: "555555",
        productId: 431,
        productName: "人力銀行主網/新聞快訊/橫幅",
        projectId: 410,
        quantity: "3",
        startDate: "2023/03/29",
        unit: "WEEK"
      });
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("getCueProjectId: 新增Cue表專案型服務, 成功回傳流水單號", async () => {
    const pullCueStore = usePullCueStore();
    apiGetCueProjectId.mockResolvedValue({
      data: {
        response: {
          projectAvailable: true,
          productAvailable: true,
          prepareProjService: {
            quantity: 1,
            free: false,
            marketPriceIncludeTax: 126000.0,
            priceIncludeTax: 105000.0,
            price: 100000.0,
            unitPriceIncludeTax: 105000.0,
            note: "測試",
            externalName: "人力銀行主網/新聞快訊/橫幅",
            startDate: "2023/03/01",
            endDate: "2023/03/31",
            discountPercentage: 0.8,
            days: 31
          },
          readyProjServices: {
            number: 1,
            size: 20,
            content: null,
            totalPages: 1,
            totalElements: 1,
            last: true,
            numberOfElements: 1
          }
        }
      }
    });

    await pullCueStore.getCueProjectId({
      id: 45,
      page: 1,
      projectId: 410,
      size: 20
    });
    expect(pullCueStore.prepareProjService).toStrictEqual({
      quantity: 1,
      free: false,
      marketPriceIncludeTax: 126000.0,
      priceIncludeTax: 105000.0,
      price: 100000.0,
      unitPriceIncludeTax: 105000.0,
      note: "測試",
      externalName: "人力銀行主網/新聞快訊/橫幅",
      startDate: "2023/03/01",
      endDate: "2023/03/31",
      discountPercentage: 0.8,
      days: 31,
      checked: false
    });
  });

  it("getCueProjectId: 新增Cue表專案型服務, 失敗 400 專案不存在", async () => {
    const pullCueStore = usePullCueStore();

    apiGetCueProjectId.mockRejectedValue({
      warning: {
        code: "211",
        desc: "專案不存在"
      }
    });

    try {
      await pullCueStore.getCueProjectId({
        id: 45,
        page: 1,
        projectId: 410,
        size: 20
      });
    } catch (error) {
      expect(error).toStrictEqual({
        warning: {
          code: "211",
          desc: "專案不存在"
        }
      });
    }
  });

  it("getCueProjectId: 新增Cue表專案型服務, 失敗 500 系統錯誤", async () => {
    const pullCueStore = usePullCueStore();

    apiGetCueProjectId.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.getCueProjectId({
        id: 45,
        page: 1,
        projectId: 410,
        size: 20
      });
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("putCueProjectId: 將專案型服務加入Cue中(無法取消), 成功回傳流水單號", async () => {
    const pullCueStore = usePullCueStore();
    apiPutCueProjectId.mockResolvedValue({
      data: {
        response: 53
      }
    });

    const result = await pullCueStore.putCueProjectId({
      id: 45,
      page: 1,
      projectId: 410,
      size: 20
    });
    expect(result).toBe(53);
  });

  it("putCueProjectId: 將專案型服務加入Cue中(無法取消), 失敗 400 專案不存在", async () => {
    const pullCueStore = usePullCueStore();

    apiGetCueProjectId.mockRejectedValue({
      warning: {
        code: "211",
        desc: "專案不存在"
      }
    });

    try {
      await pullCueStore.putCueProjectId({
        id: 45,
        page: 1,
        projectId: 410,
        size: 20
      });
    } catch (error) {
      expect(error).toStrictEqual({
        warning: {
          code: "211",
          desc: "專案不存在"
        }
      });
    }
  });

  it("putCueProjectId: 將專案型服務加入Cue中(無法取消), 失敗 500 系統錯誤", async () => {
    const pullCueStore = usePullCueStore();

    apiGetCueProjectId.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.putCueProjectId({
        id: 45,
        page: 1,
        projectId: 410,
        size: 20
      });
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("resetData: 清除所有資料", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.quotationData = {
      id: 413,
      orderId: 473,
      orderExecutionStartDate: "2023/03/01",
      orderExecutionEndDate: "2023/03/31",
      paymentTaxRate: 0.05
    };
    pullCueStore.bannerQuotationProject = {
      number: 1,
      size: 20,
      content: [
        {
          reservationId: 11691,
          startDate: "2023/03/27",
          endDate: "2023/03/31",
          price: 19354.9,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 20322.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 5,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-5",
          arrangeable: false,
          removable: true
        },
        {
          reservationId: 11690,
          startDate: "2023/03/20",
          endDate: "2023/03/26",
          price: 27096.8,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 28451.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 7,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-4",
          arrangeable: false,
          removable: true
        }
      ],
      totalPages: 1,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    };
    pullCueStore.otherQuotationProject = {
      projectAvailable: true,
      productAvailable: true,
      prepareProjService: null,
      readyProjServices: {
        number: 1,
        size: 20,
        content: [
          {
            quantity: 1,
            free: false,
            marketPriceIncludeTax: 126000.0,
            priceIncludeTax: 105000.0,
            price: 100000.0,
            unitPriceIncludeTax: 105000.0,
            note: "測試",
            externalName: "人力銀行主網/新聞快訊/橫幅",
            startDate: "2023/03/01",
            endDate: "2023/03/31",
            discountPercentage: 0.8,
            days: 31
          }
        ],
        totalPages: 1,
        totalElements: 1,
        last: true,
        numberOfElements: 1
      }
    };
    pullCueStore.readyProjServices = {
      number: 1,
      size: 20,
      content: [
        {
          quantity: 1,
          free: false,
          marketPriceIncludeTax: 126000.0,
          priceIncludeTax: 105000.0,
          price: 100000.0,
          unitPriceIncludeTax: 105000.0,
          note: "測試",
          externalName: "人力銀行主網/新聞快訊/橫幅",
          startDate: "2023/03/01",
          endDate: "2023/03/31",
          discountPercentage: 0.8,
          days: 31
        }
      ],
      totalPages: 1,
      totalElements: 1,
      last: true,
      numberOfElements: 1
    };
    pullCueStore.notPullCueQuotationProjectReservation = {
      number: 1,
      size: 20,
      content: [
        {
          reservationId: 11691,
          startDate: "2023/03/27",
          endDate: "2023/03/31",
          price: 19354.9,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 20322.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 5,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-5",
          arrangeable: false,
          removable: true,
          checked: false
        }
      ],
      totalPages: 1,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    };
    pullCueStore.pullCueQuotationProjectReservation = {
      number: 1,
      size: 20,
      content: [
        {
          reservationId: 11691,
          startDate: "2023/03/27",
          endDate: "2023/03/31",
          price: 19354.9,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 20322.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 5,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-5",
          arrangeable: false,
          removable: true,
          checked: false
        },
        {
          reservationId: 11690,
          startDate: "2023/03/20",
          endDate: "2023/03/26",
          price: 27096.8,
          marketPrice: 4285.7,
          unitPrice: 3871.0,
          priceIncludeTax: 28451.6,
          marketPriceIncludeTax: 4500.0,
          unitPriceIncludeTax: 4064.5,
          discountPercentage: 0.9,
          days: 7,
          free: false,
          exposed: false,
          note: null,
          groupId: "410-1673343352402-4",
          arrangeable: false,
          removable: true,
          checked: false
        }
      ],
      totalPages: 1,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    };
    pullCueStore.projectAvailableCount = 4;

    pullCueStore.resetData();
    expect(pullCueStore.quotationData).toStrictEqual({
      id: null,
      orderId: null,
      orderExecutionStartDate: null,
      orderExecutionEndDate: null,
      paymentTaxRate: 0.05
    });
    expect(pullCueStore.bannerQuotationProject).toStrictEqual({
      projectId: null,
      projectAvailable: false,
      cueProducts: []
    });
    expect(pullCueStore.otherQuotationProject).toStrictEqual({
      projectId: null,
      projectAvailable: false,
      cueProjectServices: []
    });
    expect(pullCueStore.readyProjServices).toStrictEqual({
      content: [],
      number: 0,
      size: 20,
      totalPages: 0,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    });
    expect(pullCueStore.notPullCueQuotationProjectReservation).toStrictEqual({
      content: [],
      number: 0,
      size: 20,
      totalPages: 0,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    });
    expect(pullCueStore.pullCueQuotationProjectReservation).toStrictEqual({
      content: [],
      number: 0,
      size: 20,
      totalPages: 0,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    });
    expect(pullCueStore.notPullCueQuotationProjectReservation).toStrictEqual({
      content: [],
      number: 0,
      size: 20,
      totalPages: 0,
      totalElements: 0,
      last: true,
      numberOfElements: 0
    });
    expect(pullCueStore.projectAvailableCount).toBe(null);
  });

  it("getProductCalculatePrice: 取得Cue表商品實際售出價錢資訊, 成功", async () => {
    const pullCueStore = usePullCueStore();
    apiGetProductCalculatePrice.mockResolvedValue({
      data: {
        response: {
          costPrice: 0,
          costPriceIncludeTax: 0,
          discountPercentage: 0,
          floorPrice: 0,
          floorPriceIncludeTax: 0,
          id: 0,
          marketPrice: 0,
          marketPriceIncludeTax: 0,
          name: "string",
          price: 0,
          priceIncludeTax: 0,
          productCode: "string",
          unitPrice: 0,
          unitPriceIncludeTax: 0
        }
      }
    });

    const result = await pullCueStore.getProductCalculatePrice({
      free: 0,
      marketPriceIncludeTax: 30000,
      priceIncludeTax: 21000,
      productId: 1,
      quantity: 7,
      taxRate: 0.05,
      unit: "DAY"
    });
    expect(result).toStrictEqual({
      costPrice: 0,
      costPriceIncludeTax: 0,
      discountPercentage: 0,
      floorPrice: 0,
      floorPriceIncludeTax: 0,
      id: 0,
      marketPrice: 0,
      marketPriceIncludeTax: 0,
      name: "string",
      price: 0,
      priceIncludeTax: 0,
      productCode: "string",
      unitPrice: 0,
      unitPriceIncludeTax: 0
    });
  });

  it("getProductCalculatePrice: 取得Cue表商品實際售出價錢資訊, 失敗 400 專案不存在", async () => {
    const pullCueStore = usePullCueStore();

    apiGetProductCalculatePrice.mockRejectedValue({
      warning: {
        code: "211",
        desc: "專案不存在"
      }
    });

    try {
      await pullCueStore.getProductCalculatePrice({
        free: 0,
        marketPriceIncludeTax: 30000,
        priceIncludeTax: 21000,
        productId: 1,
        quantity: 7,
        taxRate: 0.05,
        unit: "DAY"
      });
    } catch (error) {
      expect(error).toStrictEqual({
        warning: {
          code: "211",
          desc: "專案不存在"
        }
      });
    }
  });

  it("putCueProjectId: 將專案型服務加入Cue中(無法取消), 失敗 500 系統錯誤", async () => {
    const pullCueStore = usePullCueStore();

    apiGetProductCalculatePrice.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.getProductCalculatePrice({
        free: 0,
        marketPriceIncludeTax: 30000,
        priceIncludeTax: 21000,
        productId: 1,
        quantity: 7,
        taxRate: 0.05,
        unit: "DAY"
      });
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("getCueTotalMarketPriceHistory: 取得Cue表商品實際售出價錢資訊, 成功", async () => {
    const pullCueStore = usePullCueStore();
    apiGetCueTotalMarketPriceHistory.mockResolvedValue({
      data: {
        response: [
          {
            changeDate: "2022/03/01",
            originTotalMarketPrice: 2000000,
            totalMarketPrice: 4000000
          }
        ]
      }
    });

    await pullCueStore.getCueTotalMarketPriceHistory(368);
    expect(pullCueStore.cueTotalMarketPriceHistory).toStrictEqual([
      {
        changeDate: "2022/03/01",
        originTotalMarketPrice: 2000000,
        totalMarketPrice: 4000000
      }
    ]);
  });

  it("getCueTotalMarketPriceHistory: 將專案型服務加入Cue中(無法取消), 失敗 500 系統錯誤", async () => {
    const pullCueStore = usePullCueStore();

    apiGetCueTotalMarketPriceHistory.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.getCueTotalMarketPriceHistory(368);
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });

  it("getApplication: 取拉 cue 總牌價申請變更資料, 成功", async () => {
    const pullCueStore = usePullCueStore();
    apiGetCueTotalMarketPriceChangeApplication.mockResolvedValue({
      data: {
        response: {
          originTotalMarketPrice: 525000,
          totalMarketPrice: 5555555,
          discountPercentage: 0,
          reason: "tt"
        }
      }
    });

    await pullCueStore.getApplication(368);
    expect(pullCueStore.cueApplication).toStrictEqual({
      originTotalMarketPrice: 525000,
      totalMarketPrice: 5555555,
      discountPercentage: 0,
      reason: "tt"
    });
  });

  it("getApplication: 新增Cue表專案型服務, 失敗 500 系統錯誤", async () => {
    const pullCueStore = usePullCueStore();

    apiGetCueTotalMarketPriceChangeApplication.mockRejectedValue({
      status: 500,
      error: "INTERNAL SERVER ERROR"
    });

    try {
      await pullCueStore.getApplication(368);
    } catch (error) {
      expect(error).toStrictEqual({
        status: 500,
        error: "INTERNAL SERVER ERROR"
      });
    }
  });
});

describe("測試 PullCue Store Getters", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("notPullCueLength: 被選取的未拉cue項目", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.notPullCueQuotationProjectReservation.content = [
      {
        reservationId: 11691,
        startDate: "2023/03/27",
        endDate: "2023/03/31",
        price: 19354.9,
        marketPrice: 4285.7,
        unitPrice: 3871.0,
        priceIncludeTax: 20322.6,
        marketPriceIncludeTax: 4500.0,
        unitPriceIncludeTax: 4064.5,
        discountPercentage: 0.9,
        days: 5,
        free: false,
        exposed: false,
        note: null,
        groupId: "410-1673343352402-5",
        arrangeable: false,
        removable: true,
        checked: false
      },
      {
        reservationId: 11691,
        startDate: "2023/03/27",
        endDate: "2023/03/31",
        price: 19354.9,
        marketPrice: 4285.7,
        unitPrice: 3871.0,
        priceIncludeTax: 20322.6,
        marketPriceIncludeTax: 4500.0,
        unitPriceIncludeTax: 4064.5,
        discountPercentage: 0.9,
        days: 5,
        free: false,
        exposed: false,
        note: null,
        groupId: "410-1673343352402-5",
        arrangeable: false,
        removable: true,
        checked: true
      }
    ];

    const result = pullCueStore.notPullCueLength;
    expect(result).toBe(1);
  });

  it("pullCueLength: 被選取的已拉cue項目", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.pullCueQuotationProjectReservation.content = [
      {
        reservationId: 11691,
        startDate: "2023/03/27",
        endDate: "2023/03/31",
        price: 19354.9,
        marketPrice: 4285.7,
        unitPrice: 3871.0,
        priceIncludeTax: 20322.6,
        marketPriceIncludeTax: 4500.0,
        unitPriceIncludeTax: 4064.5,
        discountPercentage: 0.9,
        days: 5,
        free: false,
        exposed: false,
        note: null,
        groupId: "410-1673343352402-5",
        arrangeable: false,
        removable: true,
        checked: true
      },
      {
        reservationId: 11691,
        startDate: "2023/03/27",
        endDate: "2023/03/31",
        price: 19354.9,
        marketPrice: 4285.7,
        unitPrice: 3871.0,
        priceIncludeTax: 20322.6,
        marketPriceIncludeTax: 4500.0,
        unitPriceIncludeTax: 4064.5,
        discountPercentage: 0.9,
        days: 5,
        free: false,
        exposed: false,
        note: null,
        groupId: "410-1673343352402-5",
        arrangeable: false,
        removable: true,
        checked: true
      }
    ];

    const result = pullCueStore.pullCueLength;
    expect(result).toBe(2);
  });

  it("allowCue: 是否可以拉cue", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.cuePriceInformation.allowToCue = true;

    const result = pullCueStore.allowCue;
    expect(result).toBe(true);
  });

  it("projectAvailable: 有效專案大於0會傳true", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.projectAvailableCount = 4;

    const result = pullCueStore.projectAvailable;
    expect(result).toBe(true);
  });

  it("projectAvailable: 有效專案為0會傳false", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.projectAvailableCount = 0;

    const result = pullCueStore.projectAvailable;
    expect(result).toBe(false);
  });

  it("isPrepareProjServiceSelected: 非banner類型被勾選, 回傳true", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.prepareProjService.checked = true;

    const result = pullCueStore.isPrepareProjServiceSelected;
    expect(result).toBe(true);
  });

  it("isPrepareProjServiceSelected: 非banner類型沒被勾選, 回傳false", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.prepareProjService.checked = false;

    const result = pullCueStore.isPrepareProjServiceSelected;
    expect(result).toBe(false);
  });

  it("disabledPullCueStatus: 不可拉cue, 已拉cue長度為0, 其他專案沒有勾選, 回傳false", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.pullCueQuotationProjectReservation.content = [];
    pullCueStore.cuePriceInformation.allowToCue = false;
    pullCueStore.prepareProjService.checked = false;

    const result = pullCueStore.disabledPullCueStatus;
    expect(result).toBe(true);
  });

  it("disabledPullCueStatus: 不可拉cue, 被勾選已拉cue長度為1,其他專案沒有勾選, 回傳false", async () => {
    const pullCueStore = usePullCueStore();
    pullCueStore.pullCueQuotationProjectReservation.content = [
      {
        reservationId: 11691,
        startDate: "2023/03/27",
        endDate: "2023/03/31",
        price: 19354.9,
        marketPrice: 4285.7,
        unitPrice: 3871.0,
        priceIncludeTax: 20322.6,
        marketPriceIncludeTax: 4500.0,
        unitPriceIncludeTax: 4064.5,
        discountPercentage: 0.9,
        days: 5,
        free: false,
        exposed: false,
        note: null,
        groupId: "410-1673343352402-5",
        arrangeable: false,
        removable: true,
        checked: false
      },
      {
        reservationId: 11691,
        startDate: "2023/03/27",
        endDate: "2023/03/31",
        price: 19354.9,
        marketPrice: 4285.7,
        unitPrice: 3871.0,
        priceIncludeTax: 20322.6,
        marketPriceIncludeTax: 4500.0,
        unitPriceIncludeTax: 4064.5,
        discountPercentage: 0.9,
        days: 5,
        free: false,
        exposed: false,
        note: null,
        groupId: "410-1673343352402-5",
        arrangeable: false,
        removable: true,
        checked: true
      }
    ];
    pullCueStore.cuePriceInformation.allowToCue = false;
    pullCueStore.prepareProjService.checked = false;

    const result = pullCueStore.disabledPullCueStatus;
    expect(result).toBe(false);
  });

  it("disabledPullCueStatus: 可拉cue, 被勾選已拉cue長度為0,其他專案沒有勾選, 回傳false", async () => {
    const pullCueStore = usePullCueStore();

    pullCueStore.pullCueQuotationProjectReservation.content = [];
    pullCueStore.cuePriceInformation.allowToCue = true;
    pullCueStore.prepareProjService.checked = false;

    const result = pullCueStore.disabledPullCueStatus;
    expect(result).toBe(false);
  });

  it("disabledPullCueStatus: 不可拉cue, 被勾選已拉cue長度為0,其他專案有勾選, 回傳false", async () => {
    const pullCueStore = usePullCueStore();

    pullCueStore.pullCueQuotationProjectReservation.content = [];
    pullCueStore.cuePriceInformation.allowToCue = false;
    pullCueStore.prepareProjService.checked = true;

    const result = pullCueStore.disabledPullCueStatus;
    expect(result).toBe(false);
  });

  it("disabledPullCueStatus: 不可拉cue, 被勾選已拉cue長度為0,其他專案有勾選, 回傳false", async () => {
    const pullCueStore = usePullCueStore();

    pullCueStore.notPullCueQuotationProjectReservation.content = [
      {
        reservationId: 11691,
        startDate: "2023/03/27",
        endDate: "2023/03/31",
        price: 19354.9,
        marketPrice: 4285.7,
        unitPrice: 3871.0,
        priceIncludeTax: 20322.6,
        marketPriceIncludeTax: 4500.0,
        unitPriceIncludeTax: 4064.5,
        discountPercentage: 0.9,
        days: 5,
        free: false,
        exposed: false,
        note: null,
        groupId: "410-1673343352402-5",
        arrangeable: false,
        removable: true,
        checked: false
      },
      {
        reservationId: 11691,
        startDate: "2023/03/27",
        endDate: "2023/03/31",
        price: 19354.9,
        marketPrice: 4285.7,
        unitPrice: 3871.0,
        priceIncludeTax: 20322.6,
        marketPriceIncludeTax: 4500.0,
        unitPriceIncludeTax: 4064.5,
        discountPercentage: 0.9,
        days: 5,
        free: false,
        exposed: false,
        note: null,
        groupId: "410-1673343352402-5",
        arrangeable: false,
        removable: true,
        checked: true
      }
    ];
    pullCueStore.cuePriceInformation.allowToCue = false;
    pullCueStore.prepareProjService.checked = true;

    const result = pullCueStore.disabledPullCueStatus;
    expect(result).toBe(false);
  });
});
