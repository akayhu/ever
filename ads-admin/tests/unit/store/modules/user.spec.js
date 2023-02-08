import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { apiGetAuthAdminStatus } from "@/apis/user";

const mockData = {
  type: 0,
  accountId: null,
  logonId: null,
  name: null,
  role: 1,
  allowedSite: [],
  specialPermission: [],
  dataPermission: [],
  accessible: false
};

jest.mock("@/apis/user", () => ({
  apiGetAuthAdminStatus: jest.fn()
}));

describe("測試 User Store Actions", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 getAuthStatus action", async () => {
    const userStore = useUserStore();
    const { getAuthStatus } = userStore;
    apiGetAuthAdminStatus.mockResolvedValue({ data: { response: mockData } });
    const result = await getAuthStatus();
    expect(result).toStrictEqual(mockData);
  });
});
