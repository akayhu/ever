import ADSTextarea from "@/components/ADSTextarea.vue";
import { shallowMount } from "@vue/test-utils";

describe("測試 components/ADSTextarea.vue", () => {
  it("測試字數計算是否正確", async () => {
    const content = "test content.";
    const maxlength = "500";
    const otherContent = "other content.";
    const otherLength = "200";
    const wrapper = shallowMount(ADSTextarea, {
      props: {
        maxlength: maxlength,
        modelValue: content
      }
    });
    expect(wrapper.get("span").text()).toBe(`${content.length}/${maxlength}`);

    await wrapper.setProps({
      modelValue: otherContent,
      maxlength: otherLength
    });
    expect(wrapper.get("span").text()).toBe(
      `${otherContent.length}/${otherLength}`
    );
  });

  it("測試 props disabled 功能", async () => {
    const wrapper = shallowMount(ADSTextarea, {
      props: {
        disabled: true
      }
    });
    const textareaElement = wrapper.get("textarea");
    expect(textareaElement.element.disabled).toBe(true);

    await wrapper.setProps({ disabled: false });
    expect(textareaElement.element.disabled).toBe(false);
  });

  it("測試 props placeholder 功能", async () => {
    const content = "test content.";
    const otherContent = "other content.";
    const wrapper = shallowMount(ADSTextarea, {
      props: {
        placeholder: content
      }
    });
    const textareaElement = wrapper.get("textarea");
    expect(textareaElement.element.placeholder).toBe(content);

    await wrapper.setProps({ placeholder: otherContent });
    expect(textareaElement.element.placeholder).toBe(otherContent);
  });
});
