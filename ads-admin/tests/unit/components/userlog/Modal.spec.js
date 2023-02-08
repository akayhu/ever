import Modal from "@/components/userLog/Modal.vue";
import { shallowMount } from "@vue/test-utils";

describe("測試 components/userLog/Modal.vue", () => {
  it("測試 Modal props 傳遞是否正確", () => {
    const wrapper = shallowMount(Modal, {
      props: {
        title: "測試標題",
        isShow: true
      }
    });
    expect(wrapper.props().title).toBe("測試標題");
    expect(wrapper.props().isShow).toBe(true);
  });
});
