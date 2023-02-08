import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import Fragment from "vue-fragment";
import VTooltip from "v-tooltip";
import ProofsBlock from "@/components/proofs/ProofsBlock.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Fragment.Plugin);
localVue.use(VTooltip);

describe("ProofsBlock.vue", () => {
  test("renders board name in id attribute", () => {
    const proof = [
      {
        boardId: 10,
        boardName: "黃金大版位",
        channelId: 4,
        channelName: "首頁",
        customerId: 1112078211,
        customerName: "華信牙醫診所",
        device: "PC",
        id: 5663,
        materialId: 1862,
        materialUrlList: [],
        orderId: "30103-201200004",
        projectId: 3,
        projectName: "華信_Doreen驗收_VIP",
        siteId: 1,
        siteName: "人力銀行C主網",
        status: 3
      },
      {
        boardId: 19,
        boardName: "熱門企業",
        channelId: 4,
        channelName: "首頁",
        customerId: 1112081569,
        customerName: "柯達大飯店股份有限公司台北分公司",
        device: "PC",
        id: 4171,
        materialId: null,
        materialUrlList: [],
        orderId: "30103-201200021",
        projectId: 177,
        projectName: "柯達大飯店_Victor測試",
        siteId: 1,
        siteName: "人力銀行C主網",
        status: 2
      }
    ];

    const wrapper = shallowMount(ProofsBlock, {
      propsData: {
        proof
      },
      localVue
    });

    const titleElement = wrapper.find(
      `#${proof[0].device}_${proof[0].boardId}`
    );

    expect(titleElement.text()).toBe(`${proof[0].boardName}`);
  });
});
