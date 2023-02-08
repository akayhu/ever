import tool from "@/store/modules/tool.js";
import { apiGetToolMaterialId, apiGetToolReservationId } from "@/apis/tool";
const { getToolMaterialId, getToolReservationId } = tool.actions;

jest.mock("@/apis/tool", () => ({
  apiGetToolMaterialId: jest.fn(),
  apiGetToolReservationId: jest.fn()
}));

describe("測試 sotre tool actions", () => {
  it("GetToolMaterialId 成功回傳", async () => {
    const query = {
      id: 1111
    };
    const mockData = {
      device: "APP",
      siteId: 3,
      siteName: "工作快找",
      channelId: 21,
      channelName: "優化版職務列表頁",
      boardId: 71,
      boardName: "列表A鑽",
      customerId: 1112114859,
      customerName: "加百裕工業股份有限公司",
      projectId: 94,
      projectName: "Doreen_加百裕1112114859",
      materialTitle: "人力資源助理_廣告平台專用勿關3_韓",
      reservationId: 3315,
      startDate: "2021/01/18",
      endDate: "2021/01/24"
    };
    apiGetToolMaterialId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getToolMaterialId(query);
    expect(result).toStrictEqual(mockData);
  });

  it("GetToolMaterialId 成功回傳", async () => {
    const query = {
      id: 3315
    };
    const mockData = {
      device: "APP",
      siteId: 3,
      siteName: "工作快找",
      channelId: 21,
      channelName: "優化版職務列表頁",
      boardId: 71,
      boardName: "列表A鑽",
      projectId: 94,
      projectName: "Doreen_加百裕1112114859",
      customerId: 1112114859,
      customerName: "加百裕工業股份有限公司",
      startDate: "2021/01/18",
      endDate: "2021/01/24"
    };
    apiGetToolReservationId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getToolReservationId(query);
    expect(result).toStrictEqual(mockData);
  });
});
