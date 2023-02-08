import ProductEdit from "@/views/ProductEdit.vue";
import { shallowMount } from "@vue/test-utils";
import { useRoute, useRouter } from "vue-router";
import { VTooltip } from "floating-vue";
import { setActivePinia, createPinia } from "pinia";
import { useProductStore } from "@/storesPinia/product.js";

jest.mock("@/components/productEdit/ProductBoard.vue", () => ({
  template: "<div>Mock it out</div>"
}));

jest.mock("@/apis/product.js", () => ({
  apiGetProduct: jest.fn(),
  apiGetProductId: jest.fn(),
  apiPutProduct: jest.fn(),
  apiGetProductMisSuggest: jest.fn(),
  apiPutProductMisSync: jest.fn()
}));

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

describe("測試 ProductEdit.vue", () => {
  let productStore;
  let $route;
  let $router;
  let mountOptions;

  beforeEach(() => {
    setActivePinia(createPinia());

    $route = {
      path: "",
      params: { productId: 98 }
    };

    $router = {
      push: jest.fn()
    };

    useRoute.mockImplementation(() => ({
      path: "",
      params: { productId: 98 }
    }));

    useRouter.mockImplementation(() => ({
      push: jest.fn()
    }));

    productStore = useProductStore();
    productStore.productId = {
      boardList: [
        {
          associateWithProduct: null,
          canDelete: null,
          channelId: 55,
          channelName: "首頁(test)",
          conditionId: null,
          device: "PC",
          id: 193,
          lowerLimit: 1,
          name: "黃金大版5",
          promotion: false,
          reserve: 1,
          responseTypeTemplateDetail: null,
          siteId: 6,
          siteName: "VM測試",
          snapshot: null,
          sort: 1,
          status: true,
          style: "",
          typeId: 2,
          upperLimit: 1,
          url: null
        }
      ],
      createDate: "2020-12-11T07:19:00.000+0000",
      id: 98,
      name: "人力銀行主網/C首頁(2018)/最強主打(左二)",
      productCode: "MISC1100000110",
      status: true,
      updateDate: "2020-12-11T07:19:00.000+0000"
    };

    mountOptions = {
      global: {
        directives: {
          tooltip: VTooltip
        },
        mocks: {
          $route,
          $router
        }
      }
    };
  });

  it("測試 onMounted 初始化", () => {
    const mockProductDataBoards = [
      {
        id: 0,
        device: "PC",
        siteId: 6,
        siteName: "VM測試",
        channelId: 55,
        channelName: "首頁(test)",
        boardId: 193,
        boardName: "黃金大版5",
        edit: true,
        sortValue: [1]
      }
    ];
    const wrapper = shallowMount(ProductEdit, mountOptions);
    expect(wrapper.vm.productData.name).toEqual(
      "人力銀行主網/C首頁(2018)/最強主打(左二)"
    );
    expect(wrapper.vm.productData.productCode).toEqual("MISC1100000110");
    expect(wrapper.vm.productData.boards).toStrictEqual(mockProductDataBoards);
    expect(wrapper.vm.selectedProduct.name).toEqual(
      "人力銀行主網/C首頁(2018)/最強主打(左二)"
    );
    expect(wrapper.vm.selectedProduct.productCode).toEqual("MISC1100000110");
  });

  it("新增商品版位", () => {
    const wrapper = shallowMount(ProductEdit, mountOptions);
    const addBoards = {
      id: 1,
      device: "",
      siteId: undefined,
      siteName: "",
      channelId: undefined,
      channelName: "",
      boardId: undefined,
      boardName: "",
      edit: false,
      sortValue: []
    };
    wrapper.vm.creatProduct(1);
    expect(wrapper.vm.productData.boards.length).toEqual(2);
    expect(wrapper.vm.productData.boards[1].id).toEqual(1);
    expect(wrapper.vm.productData.boards[1]).toStrictEqual(addBoards);
  });

  it("刪除商品版位，只剩一筆則清空資料", () => {
    const wrapper = shallowMount(ProductEdit, mountOptions);
    wrapper.vm.deleteWebsite(0);
    expect(wrapper.vm.productData.boards.length).toEqual(1);
    expect(wrapper.vm.productData.boards[0].id).toEqual(0);
    // 通過，但不使用 EventBus 實例
    expect(wrapper.emitted("resetProductBoardData")).toBeTruthy;
  });
});
