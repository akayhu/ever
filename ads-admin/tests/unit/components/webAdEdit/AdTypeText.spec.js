import AdTypeText from "@/components/webAdEdit/AdTypeText.vue";
import { shallowMount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";

describe("測試 components/webAdEdit/AdTypeText.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const props = {
    typeData: {
      groupList: [
        {
          elementList: [
            {
              title: "文字"
            }
          ]
        }
      ]
    },
    v: {
      title_0_0: { $error: false },
      textLimit_0_0: { $error: true }
    },
    typeDataIndex: 0,
    elementIndex: 0
  };

  it("AdTypeText props 傳遞是否正確", () => {
    const wrapper = shallowMount(AdTypeText, {
      props,
      directives: {
        filterSpecifiedSymbols() {}
      }
    });
    expect(wrapper.props().typeData).toMatchObject({
      groupList: [
        {
          elementList: [
            {
              title: "文字"
            }
          ]
        }
      ]
    });
    expect(wrapper.props().v).toMatchObject({
      title_0_0: { $error: false },
      textLimit_0_0: { $error: true }
    });
    expect(wrapper.props().typeDataIndex).toBe(0);
    expect(wrapper.props().elementIndex).toBe(0);
  });

  it("data name 正常顯示", () => {
    const wrapper = shallowMount(AdTypeText, {
      props,
      directives: {
        filterSpecifiedSymbols() {}
      }
    });

    expect(wrapper.find("input").attributes().placeholder).toContain(
      `請輸入${props.typeData.groupList[0].elementList[0].title}(顯示於前台)`
    );
  });

  it("輸入錯誤時，顯示錯誤提示class", () => {
    const wrapper = shallowMount(AdTypeText, {
      props,
      directives: {
        filterSpecifiedSymbols() {}
      }
    });

    expect(wrapper.find(".error_message_border").exists()).toBe(true);
  });
});
