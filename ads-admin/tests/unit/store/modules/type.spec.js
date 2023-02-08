import { setActivePinia, createPinia } from "pinia";
import { useTypeStore } from "@/storesPinia/type.js";
import { apiGetType, apiGetBoardIdType } from "@/apis/type";

jest.mock("@/apis/type.js", () => ({
  apiGetType: jest.fn(),
  apiGetBoardIdType: jest.fn()
}));

describe("測試 Type Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 getType action", async () => {
    const typeStore = useTypeStore();
    const { getType } = typeStore;
    const mockTypeData = {
      id: 1,
      name: "圖片(GIF / JPG / PNG 等)"
    };
    apiGetType.mockImplementation(() =>
      Promise.resolve({
        data: { response: mockTypeData }
      })
    );
    const result = await getType();
    expect(result).toStrictEqual(mockTypeData);
  });

  it("測試 getType action 返回錯誤", async () => {
    const typeStore = useTypeStore();
    const { getType } = typeStore;
    const error = { status: 404, message: "something wrong" };
    apiGetType.mockImplementation(() => Promise.reject(error));
    try {
      await getType();
    } catch (e) {
      expect(e).toStrictEqual(error);
    }
  });

  it("測試 getBoardIdType action", async () => {
    const typeStore = useTypeStore();
    const { getBoardIdType } = typeStore;
    const mockBoardIdType = {
      boardId: 189,
      groupList: [],
      memo: "",
      typeId: 1
    };
    apiGetBoardIdType.mockImplementation(() =>
      Promise.resolve({
        data: {
          response: mockBoardIdType
        }
      })
    );
    const result = await getBoardIdType();
    expect(result).toMatchObject(mockBoardIdType);
  });
});
