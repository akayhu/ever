import { shallowMount } from "@vue/test-utils";
import ProductBoard from "@/components/productEdit/ProductBoard.vue";
import ElementPlus from "element-plus";
import { setActivePinia, createPinia } from "pinia";

describe("測試 components/productEdit/ProductBoard.vue", () => {
  it("測試 ProductBoard props 傳遞是否正確", () => {
    const wrapper = shallowMount(ProductBoard, {
      global: {
        plugins: [ElementPlus],
        provide: {
          store: setActivePinia(createPinia())
        }
      },
      props: {
        index: 123,
        item: {
          test: ""
        },
        v: {
          test: ""
        },
        disabled: true
      }
    });
    expect(wrapper.props().index).toBe(123);
    expect(wrapper.props().item).toMatchObject({ test: "" });
    expect(wrapper.props().v).toMatchObject({ test: "" });
    expect(wrapper.props().disabled).toBe(true);
  });
});
