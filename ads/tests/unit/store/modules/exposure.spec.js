import exposure from "@/store/modules/exposure.js";
import {
  apiPutExposure,
  apiGetExposureReservation,
  apiDeleteExposureReservation
} from "@/apis/exposure";

const {
  putExposure,
  getExposureReservation,
  deleteExposureReservation
} = exposure.actions;

jest.mock("@/apis/exposure", () => ({
  apiPutExposure: jest.fn(),
  apiGetExposureReservation: jest.fn(),
  apiDeleteExposureReservation: jest.fn()
}));

describe("測試 sotre exposure actions", () => {
  it("PutExposure 成功回傳", async () => {
    const query = {
      reservationId: 10794,
      dateMaterialId: [
        {
          startDate: "2022/03/28",
          materialId: 3632,
          edible: false,
          title: "新東陽",
          today: -1,
          date: "03/28"
        },
        {
          startDate: "2022/03/29",
          materialId: 3632,
          edible: false,
          title: "新東陽",
          today: -1,
          date: "03/29"
        },
        {
          startDate: "2022/03/30",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 0,
          date: "03/30"
        },
        {
          startDate: "2022/03/31",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 1,
          date: "03/31"
        },
        {
          startDate: "2022/04/01",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 1,
          date: "04/01"
        },
        {
          startDate: "2022/04/02",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 1,
          date: "04/02"
        },
        {
          startDate: "2022/04/03",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 1,
          date: "04/03"
        }
      ]
    };
    const mockData = {
      emergencyPublish: { on: false, off: true, status: 4, permission: true },
      off: true,
      on: false,
      permission: true,
      status: 4,
      result: true
    };
    apiPutExposure.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await putExposure(query);
    expect(result).toStrictEqual(mockData);
  });

  it("GetExposureReservation 成功回傳", async () => {
    const query = {
      reservationId: 10794
    };
    const mockData = {
      singleMaterial: false,
      materialExposures: [
        {
          startDate: "2022/03/28",
          materialId: 3632,
          edible: false,
          title: "新東陽",
          today: -1
        },
        {
          startDate: "2022/03/29",
          materialId: 3632,
          edible: false,
          title: "新東陽",
          today: -1
        },
        {
          startDate: "2022/03/30",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 0
        },
        {
          startDate: "2022/03/31",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 1
        },
        {
          startDate: "2022/04/01",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 1
        },
        {
          startDate: "2022/04/02",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 1
        },
        {
          startDate: "2022/04/03",
          materialId: 3632,
          edible: true,
          title: "新東陽",
          today: 1
        }
      ],
      finished: true
    };
    apiGetExposureReservation.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getExposureReservation(query);
    expect(result).toStrictEqual(mockData);
  });

  it("DeleteExposureReservation 成功回傳", async () => {
    const query = {
      reservationId: 10794,
      orderId: "30103-211000003"
    };
    const mockData = true;
    apiDeleteExposureReservation.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await deleteExposureReservation(query);
    expect(result).toStrictEqual(mockData);
  });
});
