import AdTypeImage from "@/components/webAdEdit/AdTypeImage.vue";
import { shallowMount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";

describe("測試 components/webAdEdit/AdTypeImage.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("測試 AdTypeImage props 傳遞是否正確", () => {
    const wrapper = shallowMount(AdTypeImage, {
      props: {
        typeData: {
          groupList: [
            {
              elementList: [
                {
                  title: "圖片"
                }
              ]
            }
          ]
        },
        v: {
          width_0_0: { $error: false },
          height_0_0: { $error: false },
          fileLimit_0_0: { $error: false },
          title_0_0: { $error: false }
        },
        typeDataIndex: 0,
        elementIndex: 0
      },
      directives: {
        filterSpecifiedSymbols() {}
      }
    });
    expect(wrapper.props().typeData).toMatchObject({
      groupList: [
        {
          elementList: [
            {
              title: "圖片"
            }
          ]
        }
      ]
    });
    expect(wrapper.props().v).toMatchObject({
      width_0_0: { $error: false },
      height_0_0: { $error: false },
      fileLimit_0_0: { $error: false },
      title_0_0: { $error: false }
    });
    expect(wrapper.props().typeDataIndex).toBe(0);
    expect(wrapper.props().elementIndex).toBe(0);
  });
});
