import account from "@/store/modules/account.js";
import { apiGetAccountSearch, apiGetAccountId } from "@/apis/account";
const { getAccountSearch, getAccountId } = account.actions;

jest.mock("@/apis/account", () => ({
  apiGetAccountSearch: jest.fn(),
  apiGetAccountId: jest.fn()
}));

describe("測試 sotre account actions", () => {
  it("GetAccountSearch 成功回傳", async () => {
    const mockData = [
      {
        accountId: "8989889",
        logonId: "michael.lee",
        name: "李麥克"
      }
    ];

    apiGetAccountSearch.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await getAccountSearch({ keyword: mockData[0].accountId });
    expect(result).toStrictEqual(mockData);
  });

  it("GetAccountId 成功回傳", async () => {
    const mockData = {
      logonId: "michael.lee",
      name: "李麥克",
      accountId: "8989889",
      status: 1,
      role: 1,
      emergency: true,
      allowedSite: [0]
    };

    apiGetAccountId.mockResolvedValue({ data: { response: mockData } });
    const result = await getAccountId({ accountId: "8888" });
    expect(result).toStrictEqual(mockData);
  });
});
