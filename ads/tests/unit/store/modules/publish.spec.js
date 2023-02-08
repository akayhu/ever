import publish from "@/store/modules/publish.js";
import { apiPostPublishId, apiDeletePublishId } from "@/apis/publish";
const { postPublishId, deletePublishId } = publish.actions;

jest.mock("@/apis/publish", () => ({
  apiPostPublishId: jest.fn(),
  apiDeletePublishId: jest.fn()
}));

describe("測試 sotre publish actions", () => {
  it("PostPublishId 成功回傳", async () => {
    const query = {
      id: 10794
    };
    const mockData = {
      code: 1,
      description: "執行成功",
      emergencyPublish: {
        off: true,
        on: true,
        permission: false,
        status: 4
      }
    };
    apiPostPublishId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await postPublishId(query);
    expect(result).toStrictEqual(mockData);
  });

  it("DeletePublishId 成功回傳", async () => {
    const query = {
      id: 10794
    };
    const mockData = {
      code: 1,
      description: "執行成功",
      emergencyPublish: {
        off: true,
        on: true,
        permission: false,
        status: 4
      }
    };
    apiDeletePublishId.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await deletePublishId(query);
    expect(result).toStrictEqual(mockData);
  });
});
