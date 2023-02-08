import { setActivePinia, createPinia } from "pinia";
import { useConditionSettingStore } from "@/storesPinia/conditionSetting.js";
import {
  apiGetConditions,
  apiGetConditionById,
  apiPostCondition,
  apiPutCondition,
  apiDeleteCondition
} from "@/apis/conditionSetting";

const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};

jest.mock("@/apis/conditionSetting", () => ({
  apiGetConditions: jest.fn(),
  apiGetConditionById: jest.fn(),
  apiPostCondition: jest.fn(),
  apiPutCondition: jest.fn(),
  apiDeleteCondition: jest.fn()
}));

const conditionList = [
  {
    conditionId: 46,
    conditionKey: "1",
    conditionValue: "1",
    groupId: 1,
    index: 0,
    memo: "",
    sort: 1
  },
  {
    conditionId: 46,
    conditionKey: "2",
    conditionValue: "2",
    groupId: 1,
    index: 1,
    memo: "",
    sort: 2
  },
  {
    conditionId: 46,
    conditionKey: "1",
    conditionValue: "1",
    groupId: 2,
    index: 2,
    memo: "",
    sort: 1
  }
];

describe("測試 ConditionSetting Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 getConditions action 成功後回傳", async () => {
    const conditionSettingStore = useConditionSettingStore();
    const { getConditions } = conditionSettingStore;
    const mockRequest = [
      {
        conditionGroups: null,
        id: 46,
        memo: "",
        name: "test",
        responseBoards: null
      },
      {
        conditionGroups: null,
        id: 36,
        memo: "被動電子元件製造業1001005002",
        name: "測試產業動態",
        responseBoards: null
      }
    ];
    apiGetConditions.mockResolvedValue({ data: { response: mockRequest } });
    const result = await getConditions(mockRequest);
    expect(result).toStrictEqual(mockRequest);
  });

  it("測試 getConditions action 回傳錯誤", async () => {
    const conditionSettingStore = useConditionSettingStore();
    const { getConditions } = conditionSettingStore;
    const mockRequest = [
      {
        conditionGroups: null,
        id: 46,
        memo: "",
        name: "test",
        responseBoards: null
      },
      {
        conditionGroups: null,
        id: 36,
        memo: "被動電子元件製造業1001005002",
        name: "測試產業動態",
        responseBoards: null
      }
    ];
    let error = {};
    apiGetConditions.mockRejectedValue(error500);
    expect.assertions(1);
    try {
      await getConditions(mockRequest);
    } catch (err) {
      error = err;
    }
    expect(error).toStrictEqual(error500);
  });

  it("測試 getConditionById action 成功後回傳", async () => {
    const conditionSettingStore = useConditionSettingStore();
    const { getConditionById } = conditionSettingStore;
    const mockRequest = { conditionList };
    apiGetConditionById.mockResolvedValue({ data: { response: mockRequest } });
    const result = await getConditionById(mockRequest);
    expect(result).toStrictEqual(mockRequest);
  });

  it("測試 createCondition action 成功後回傳", async () => {
    const conditionSettingStore = useConditionSettingStore();
    const { createCondition } = conditionSettingStore;
    const mockRequest = {
      conditionGroups: conditionList,
      name: "name",
      memo: "memo"
    };
    const mockResponse = {
      conditionGroups: conditionList,
      id: 0,
      name: "name",
      memo: "memo",
      responseBoards: []
    };
    apiPostCondition.mockResolvedValue({ data: { response: mockResponse } });
    const result = await createCondition(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 editCondition action 成功後回傳", async () => {
    const conditionSettingStore = useConditionSettingStore();
    const { editCondition } = conditionSettingStore;
    const mockRequest = {
      conditionId: "123",
      conditionGroups: conditionList,
      name: "name",
      memo: "memo"
    };
    const mockResponse = {
      conditionGroups: conditionList,
      id: 0,
      name: "name",
      memo: "memo",
      responseBoards: []
    };
    apiPutCondition.mockResolvedValue({ data: { response: mockResponse } });
    const result = await editCondition(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });

  it("測試 deleteCondition action 成功後回傳", async () => {
    const conditionSettingStore = useConditionSettingStore();
    const { deleteCondition } = conditionSettingStore;
    const mockRequest = {
      conditionId: "123"
    };
    const mockResponse = {};
    apiDeleteCondition.mockResolvedValue({ data: { response: mockResponse } });
    const result = await deleteCondition(mockRequest);
    expect(result).toStrictEqual(mockResponse);
  });
});
