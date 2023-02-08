import { setActivePinia, createPinia } from "pinia";
import { useAccountStore } from "@/storesPinia/account.js";
import {
  apiPostAccount,
  apiGetAccount,
  apiGetAccountId,
  apiPutAccountId,
  apiDeleteAccountId,
  apiGetPhoneUser,
  apiGetAccountRecommend,
  apiGetAccountSearch
} from "@/apis/account";
import { apiPutToolSwitchRole } from "@/apis/tool";

jest.mock("@/apis/account", () => ({
  apiPostAccount: jest.fn(),
  apiGetAccount: jest.fn(),
  apiGetAccountId: jest.fn(),
  apiPutAccountId: jest.fn(),
  apiDeleteAccountId: jest.fn(),
  apiGetPhoneUser: jest.fn(),
  apiGetAccountRecommend: jest.fn(),
  apiGetAccountSearch: jest.fn()
}));

jest.mock("@/apis/tool", () => ({
  apiPutToolSwitchRole: jest.fn()
}));

const error500 = {
  status: 500,
  error: "INTERNAL SERVER ERROR"
};

describe("測試 Account Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 postAccount action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { postAccount } = accountStore;
    const mockRequest = {
      accountId: "8989889",
      allowedSite: [0],
      emergency: true,
      logonId: "michael.lee",
      name: "李麥克",
      role: 1,
      status: 1
    };
    apiPostAccount.mockResolvedValue({
      data: { response: mockRequest.accountId }
    });
    const result = await postAccount(mockRequest);
    expect(result).toStrictEqual(mockRequest.accountId);
  });

  it("測試 postAccount action 回傳錯誤", async () => {
    const accountStore = useAccountStore();
    const { postAccount } = accountStore;
    const mockRequest = {
      accountId: "8989889",
      allowedSite: [0],
      emergency: true,
      logonId: "michael.lee",
      name: "李麥克",
      role: 1,
      status: 1
    };
    let error = {};
    apiPostAccount.mockRejectedValue(error500);
    try {
      await postAccount(mockRequest);
    } catch (err) {
      error = err;
    }
    expect(error).toStrictEqual(error500);
  });

  it("測試 getAccountList action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { getAccountList } = accountStore;
    const mockRequest = {
      content: [
        {
          accountId: "3050",
          allowedSite: [],
          emergency: false,
          logonId: "ku.wang",
          name: "王少谷",
          role: 1,
          status: 1
        }
      ],
      last: false,
      numberOfElements: 20,
      page: 1,
      size: 20,
      totalElements: 177,
      totalPages: 9
    };
    apiGetAccount.mockResolvedValue({
      data: { response: mockRequest }
    });
    const result = await getAccountList();
    expect(result).toEqual(mockRequest);
  });

  it("測試 getAccountId action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { getAccountId } = accountStore;
    const mockRequest = {
      accountId: "3050",
      allowedSite: [2, 3],
      emergency: true,
      logonId: "ku.wang",
      name: "王少谷",
      role: 1,
      status: 1
    };
    apiGetAccountId.mockResolvedValue({
      data: { response: mockRequest }
    });
    const result = await getAccountId();
    expect(result).toEqual(mockRequest);
  });

  it("測試 putAccountId action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { putAccountId } = accountStore;
    const mockQuery = {
      accountId: "3050",
      allowedSite: [2, 3],
      emergency: true,
      logonId: "ku.wang",
      name: "王少谷",
      role: 1,
      status: 1
    };
    apiPutAccountId.mockResolvedValue({
      data: { response: true }
    });
    const result = await putAccountId(mockQuery);
    expect(result).toEqual(true);
  });

  it("測試 deleteAccountId action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { deleteAccountId } = accountStore;
    const mockQuery = {
      accountId: "3050"
    };
    apiDeleteAccountId.mockResolvedValue({
      data: { response: true }
    });
    const result = await deleteAccountId(mockQuery);
    expect(result).toEqual(true);
  });

  it("測試 getPhoneUser action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { getPhoneUser } = accountStore;
    const mockQuery = {
      queryStr: "3050"
    };
    const mockRequest = {
      account: "ku.wang",
      ext: "8331",
      fullDept: "產品暨價值經營總處-新創平台處-平台產品部",
      id: "3050",
      name: "王少谷",
      shortDept: "平台產品部"
    };
    apiGetPhoneUser.mockResolvedValue({
      data: { response: mockRequest }
    });
    const result = await getPhoneUser(mockQuery);
    expect(result).toEqual(mockRequest);
  });

  it("測試 getAccountRecommend action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { getAccountRecommend } = accountStore;
    const mockQuery = {
      id: "3050"
    };
    const mockRequest = {
      logonId: "ku.wang",
      name: "王少谷",
      accountId: "3050"
    };
    apiGetAccountRecommend.mockResolvedValue({
      data: { response: mockRequest }
    });
    const result = await getAccountRecommend(mockQuery);
    expect(result).toEqual(mockRequest);
  });

  it("測試 getAccountSearch action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { getAccountSearch } = accountStore;
    const mockQuery = {
      keyword: 3050
    };
    const mockRequest = {
      accountId: "3050",
      logonId: "ku.wang",
      name: "王少谷"
    };
    apiGetAccountSearch.mockResolvedValue({
      data: { response: mockRequest }
    });
    const result = await getAccountSearch(mockQuery);
    expect(result).toEqual(mockRequest);
  });

  it("測試 putToolSwitchRole action 成功後回傳", async () => {
    const accountStore = useAccountStore();
    const { putToolSwitchRole } = accountStore;
    const mockData = {
      role: 1,
      roleName: "系統管理者"
    };
    apiPutToolSwitchRole.mockResolvedValue({
      data: { response: mockData }
    });
    const result = await putToolSwitchRole({ role: mockData.role });
    expect(result).toStrictEqual(mockData);
  });
});
