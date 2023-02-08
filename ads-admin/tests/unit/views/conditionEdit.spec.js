import conditionEdit from "@/views/ConditionEdit.vue";
import { shallowMount } from "@vue/test-utils";
import { useRoute } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useConditionSettingStore } from "@/storesPinia/conditionSetting.js";

jest.mock("@/apis/user.js", () => ({
  apiGetAuthAdminStatus: jest.fn()
}));

jest.mock("@/apis/conditionSetting.js", () => ({
  apiGetConditions: jest.fn(),
  apiGetConditionById: jest.fn(),
  apiPostCondition: jest.fn(),
  apiPutCondition: jest.fn(),
  apiDeleteCondition: jest.fn()
}));

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

describe("測試 ConditionEdit.vue", () => {
  let store;
  let mountOptions, userStore, conditionSettingStore;

  beforeEach(() => {
    setActivePinia(createPinia());

    userStore = useUserStore();
    conditionSettingStore = useConditionSettingStore();
    conditionSettingStore.storeConditionData = {
      name: "test name",
      memo: "test memo",
      conditionGroups: [
        {
          conditionId: 36,
          conditionKey: "indcat_sub",
          conditionValue: "1001005002",
          groupId: 1,
          memo: "",
          sort: 1
        },
        {
          conditionId: 36,
          conditionKey: "indcat_sub2",
          conditionValue: "1001005003",
          groupId: 1,
          memo: "",
          sort: 2
        },
        {
          conditionId: 36,
          conditionKey: "indcat_kw",
          conditionValue: "1001000000|1008003000|1001005003",
          groupId: 2,
          memo: "電子資訊/軟體/半導體相關業 1001000000\n顧問研發設計業 1008003000",
          sort: 1
        }
      ],
      responseBoards: []
    };
    conditionSettingStore.getConditionById = jest.fn();
    // .mockResolvedValue(
    //   () => (conditionSettingStore.storeConditionData.conditionGroups = 123)
    // );

    mountOptions = {
      global: {
        stubs: {
          RouterLink: "a"
        }
      }
    };

    useRoute.mockImplementation(() => ({
      params: { id: "123" }
    }));
  });

  it("新增時初始化呼叫addGroup", async () => {
    const wrapper = shallowMount(conditionEdit, mountOptions);
    expect(wrapper.vm.formType).toEqual("create");
    expect(wrapper.vm.conditionGroups.length).toEqual(1);
    expect(wrapper.vm.conditionGroups[0].conditionId).toEqual(0);
    expect(wrapper.vm.conditionGroups[0].groupId).toEqual(1);
  });

  it("編輯時初始化資料", () => {
    const $route = {
      name: "ConditionEdit",
      params: { id: "123" }
    };
    useRoute.mockImplementation(() => ({
      ...$route
    }));

    const wrapper = shallowMount(conditionEdit, mountOptions);

    expect(wrapper.vm.formType).toEqual("edit");
    expect(wrapper.vm.conditionId).toEqual(+$route.params.id);
    expect(wrapper.vm.conditionData.name).toEqual("test name");
    expect(wrapper.vm.conditionData.memo).toEqual("test memo");
    expect(wrapper.vm.conditionData.conditionGroups).toEqual(
      conditionSettingStore.storeConditionData.conditionGroups
    );
  });

  it("addRow函式將新增conditionGroups內容", () => {
    const wrapper = shallowMount(conditionEdit, mountOptions);

    const mockGroupId = 1;
    wrapper.vm.addRow(mockGroupId);
    expect(wrapper.vm.conditionGroups.length).toEqual(2);
    expect(wrapper.vm.conditionGroups[1].conditionId).toEqual(0);
    expect(wrapper.vm.conditionGroups[1].groupId).toEqual(mockGroupId);
  });

  it("group數量大於一筆，removeRow函式將移除指定conditionGroups內容", () => {
    const wrapper = shallowMount(conditionEdit, mountOptions);

    let conditionGroups = [
      {
        conditionId: 36,
        conditionKey: "indcat_sub",
        conditionValue: "1001005002",
        groupId: 1,
        memo: "",
        sort: 1
      },
      {
        conditionId: 36,
        conditionKey: "indcat_sub2",
        conditionValue: "1001005003",
        groupId: 1,
        memo: "",
        sort: 2
      }
    ];
    wrapper.vm.conditionGroups = [...conditionGroups];

    wrapper.vm.removeRow(conditionGroups, { groupId: 1, sort: 1 });
    expect(wrapper.vm.conditionGroups.length).toEqual(1);
    expect(wrapper.vm.conditionGroups[0].conditionKey).toEqual("indcat_sub2");
    expect(wrapper.vm.conditionGroups[0].conditionValue).toEqual("1001005003");
  });

  it("group數量等於一筆，removeRow函式將清空conditionGroups內容", () => {
    const wrapper = shallowMount(conditionEdit, mountOptions);

    let conditionGroups = [
      {
        conditionId: 36,
        conditionKey: "indcat_sub",
        conditionValue: "1001005002",
        groupId: 1,
        memo: "",
        sort: 1
      }
    ];
    wrapper.vm.conditionGroups = [...conditionGroups];

    wrapper.vm.removeRow(conditionGroups, { groupId: 1, sort: 1 });
    expect(wrapper.vm.conditionGroups.length).toEqual(1);
    expect(wrapper.vm.conditionGroups[0].conditionKey).toEqual("");
    expect(wrapper.vm.conditionGroups[0].conditionValue).toEqual("");
  });

  it("呼叫addGroup函式後，conditionGroups array length +1", async () => {
    const wrapper = shallowMount(conditionEdit, mountOptions);

    wrapper.vm.conditionGroups = [];

    wrapper.vm.addGroup(1);
    expect(wrapper.vm.conditionGroups.length).toEqual(1);
    expect(wrapper.vm.conditionGroups[0].conditionId).toEqual(0);
    expect(wrapper.vm.conditionGroups[0].groupId).toEqual(2);
  });

  it("conditionGroups大於一筆，呼叫removeGroup函式後，conditionGroups移除相對應group內容", async () => {
    const wrapper = shallowMount(conditionEdit, mountOptions);

    wrapper.vm.conditionGroups = [
      {
        conditionId: 36,
        conditionKey: "indcat_sub",
        conditionValue: "1001005002",
        groupId: 1,
        memo: "",
        sort: 1
      },
      {
        conditionId: 36,
        conditionKey: "indcat_sub2",
        conditionValue: "1001005003",
        groupId: 2,
        memo: "",
        sort: 1
      }
    ];

    wrapper.vm.removeGroup(1);

    expect(wrapper.vm.conditionGroups.length).toEqual(1);
    expect(wrapper.vm.conditionGroups[0].conditionKey).toEqual("indcat_sub2");
    expect(wrapper.vm.conditionGroups[0].conditionValue).toEqual("1001005003");
    expect(wrapper.vm.conditionGroups[0].groupId).toEqual(2);
  });

  it("conditionGroups小於等於一筆，呼叫removeGroup函式後，conditionGroups內容清空", async () => {
    const wrapper = shallowMount(conditionEdit, mountOptions);

    wrapper.vm.conditionGroups = [
      {
        conditionId: 36,
        conditionKey: "indcat_sub",
        conditionValue: "1001005002",
        groupId: 1,
        memo: "",
        sort: 1
      }
    ];

    wrapper.vm.removeGroup(1);

    expect(wrapper.vm.conditionGroups.length).toEqual(1);
    expect(wrapper.vm.conditionGroups[0].conditionKey).toEqual("");
    expect(wrapper.vm.conditionGroups[0].conditionValue).toEqual("");
  });
});
