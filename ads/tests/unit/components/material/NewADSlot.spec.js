import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import VTooltip from "v-tooltip";
import ElementUI from "element-ui";
import NewADSlot from "@/components/material/NewADSlot.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(ElementUI);
localVue.use(VTooltip);

describe("NewADSlot.vue", () => {
  let getters;
  let store;

  const route = {
    query: {
      id: "30103-201200004",
      device: "",
      reservationId: "5669"
    }
  };

  beforeEach(() => {
    getters = {
      getReservationData: () => ({
        reservationOrderBoardList: [
          {
            reservationId: 4,
            boardId: 10,
            startDate: "2020/12/14",
            endDate: "2020/12/20",
            boardName: "黃金大版位",
            siteId: 1,
            siteName: "人力銀行C主網",
            channelId: 4,
            channelName: "首頁",
            status: 5,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "PC",
            typeId: 1,
            emergencyPublish: {
              on: false,
              off: false,
              status: 5,
              permission: true
            }
          },
          {
            reservationId: 5,
            boardId: 11,
            startDate: "2020/12/14",
            endDate: "2020/12/20",
            boardName: "特選企業1",
            siteId: 1,
            siteName: "人力銀行C主網",
            channelId: 4,
            channelName: "首頁",
            status: 5,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "PC",
            typeId: 1,
            emergencyPublish: {
              on: false,
              off: false,
              status: 5,
              permission: true
            }
          },
          {
            reservationId: 6,
            boardId: 14,
            startDate: "2020/12/14",
            endDate: "2020/12/20",
            boardName: "最強主打2",
            siteId: 1,
            siteName: "人力銀行C主網",
            channelId: 4,
            channelName: "首頁",
            status: 5,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "PC",
            typeId: 17,
            emergencyPublish: {
              on: false,
              off: false,
              status: 5,
              permission: true
            }
          },
          {
            reservationId: 7,
            boardId: 26,
            startDate: "2020/12/14",
            endDate: "2020/12/20",
            boardName: "職缺P鑽",
            siteId: 1,
            siteName: "人力銀行C主網",
            channelId: 6,
            channelName: "職缺頁",
            status: 5,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "PC",
            typeId: 15,
            emergencyPublish: {
              on: false,
              off: false,
              status: 5,
              permission: true
            }
          },
          {
            reservationId: 8,
            boardId: 3,
            startDate: "2020/12/14",
            endDate: "2020/12/20",
            boardName: "職缺P鑽",
            siteId: 2,
            siteName: "人力銀行C主網",
            channelId: 3,
            channelName: "職缺頁",
            status: 5,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "MOBILE",
            typeId: 20,
            emergencyPublish: {
              on: false,
              off: false,
              status: 5,
              permission: true
            }
          },
          {
            reservationId: 855,
            boardId: 2,
            startDate: "2020/12/17",
            endDate: "2020/12/20",
            boardName: "列表P鑽",
            siteId: 2,
            siteName: "人力銀行C主網",
            channelId: 2,
            channelName: "工作列表頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "MOBILE",
            typeId: 20,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 859,
            boardId: 2,
            startDate: "2020/12/21",
            endDate: "2020/12/27",
            boardName: "列表P鑽",
            siteId: 2,
            siteName: "人力銀行C主網",
            channelId: 2,
            channelName: "工作列表頁",
            status: 5,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "MOBILE",
            typeId: 20,
            emergencyPublish: {
              on: false,
              off: false,
              status: 5,
              permission: true
            }
          },
          {
            reservationId: 3966,
            boardId: 1,
            startDate: "2021/04/27",
            endDate: "2021/05/02",
            boardName: "黃金看版(APP聯播)",
            siteId: 2,
            siteName: "人力銀行C主網",
            channelId: 1,
            channelName: "首頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "MOBILE",
            typeId: 1,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 3971,
            boardId: 1,
            startDate: "2021/05/03",
            endDate: "2021/05/03",
            boardName: "黃金看版(APP聯播)",
            siteId: 2,
            siteName: "人力銀行C主網",
            channelId: 1,
            channelName: "首頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "MOBILE",
            typeId: 1,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 3965,
            boardId: 85,
            startDate: "2021/04/27",
            endDate: "2021/05/02",
            boardName: "黃金看版(全職)",
            siteId: 3,
            siteName: "工作快找",
            channelId: 29,
            channelName: "新版首頁",
            status: 5,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "APP",
            typeId: 25,
            emergencyPublish: {
              on: false,
              off: false,
              status: 5,
              permission: true
            }
          },
          {
            reservationId: 3967,
            boardId: 51,
            startDate: "2021/04/27",
            endDate: "2021/05/02",
            boardName: "黃金看版",
            siteId: 3,
            siteName: "工作快找",
            channelId: 16,
            channelName: "【下線】優化版首頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "APP",
            typeId: 1,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 3968,
            boardId: 100,
            startDate: "2021/04/27",
            endDate: "2021/05/02",
            boardName: "黃金看版(兼職)",
            siteId: 3,
            siteName: "工作快找",
            channelId: 29,
            channelName: "新版首頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "APP",
            typeId: 25,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 3969,
            boardId: 60,
            startDate: "2021/04/27",
            endDate: "2021/05/02",
            boardName: "搜尋看版",
            siteId: 3,
            siteName: "工作快找",
            channelId: 17,
            channelName: "優化版搜尋頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "APP",
            typeId: 1,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 3970,
            boardId: 85,
            startDate: "2021/05/03",
            endDate: "2021/05/03",
            boardName: "黃金看版(全職)",
            siteId: 3,
            siteName: "工作快找",
            channelId: 29,
            channelName: "新版首頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "APP",
            typeId: 25,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 3972,
            boardId: 51,
            startDate: "2021/05/03",
            endDate: "2021/05/03",
            boardName: "黃金看版",
            siteId: 3,
            siteName: "工作快找",
            channelId: 16,
            channelName: "【下線】優化版首頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "APP",
            typeId: 1,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 3973,
            boardId: 100,
            startDate: "2021/05/03",
            endDate: "2021/05/03",
            boardName: "黃金看版(兼職)",
            siteId: 3,
            siteName: "工作快找",
            channelId: 29,
            channelName: "新版首頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "APP",
            typeId: 25,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          },
          {
            reservationId: 3974,
            boardId: 60,
            startDate: "2021/05/03",
            endDate: "2021/05/03",
            boardName: "搜尋看版",
            siteId: 3,
            siteName: "工作快找",
            channelId: 17,
            channelName: "優化版搜尋頁",
            status: 2,
            allowMaterial: false,
            allowEmergency: false,
            emergencyPermission: true,
            device: "APP",
            typeId: 1,
            emergencyPublish: {
              on: false,
              off: false,
              status: 2,
              permission: true
            }
          }
        ]
      })
    };

    store = new Vuex.Store({
      modules: {
        reservation: {
          getters,
          namespaced: true
        }
      }
    });
  });

  test("正確顯示各裝置檔期數量", async () => {
    const wrapper = shallowMount(NewADSlot, {
      mocks: {
        $route: route
      },
      localVue,
      store
    });

    wrapper.vm.$options.watch.getReservationOrderBoardList.call(
      wrapper.vm,
      getters.getReservationData().reservationOrderBoardList
    );
    await localVue.nextTick();

    const pcCountElement = wrapper.find("#PC_TotalCount");
    const AppCountElement = wrapper.find("#APP_TotalCount");
    const MobileCountElement = wrapper.find("#MOBILE_TotalCount");

    expect(pcCountElement.text()).toBe("/ " + 4);
    expect(AppCountElement.text()).toBe("/ " + 8);
    expect(MobileCountElement.text()).toBe("/ " + 5);
  });

  test("正確顯示出各裝置已曝光檔期數量", async () => {
    const wrapper = shallowMount(NewADSlot, {
      mocks: {
        $route: route
      },
      localVue,
      store
    });

    wrapper.vm.$options.watch.getReservationOrderBoardList.call(
      wrapper.vm,
      getters.getReservationData().reservationOrderBoardList
    );
    await localVue.nextTick();

    const pcCountElement = wrapper.find("#PC_Exposure_Count");
    const AppCountElement = wrapper.find("#APP_Exposure_Count");
    const MobileCountElement = wrapper.find("#MOBILE_Exposure_Count");

    expect(pcCountElement.text()).toBe("4");
    expect(AppCountElement.text()).toBe("8");
    expect(MobileCountElement.text()).toBe("5");
  });

  test("正確顯示route對應的裝置", async () => {
    const route = {
      query: {
        id: "30103-201200004",
        device: "APP",
        reservationId: "5669"
      }
    };

    const wrapper = shallowMount(NewADSlot, {
      mocks: {
        $route: route
      },
      localVue,
      store
    });

    wrapper.vm.$options.watch.getReservationOrderBoardList.call(
      wrapper.vm,
      getters.getReservationData().reservationOrderBoardList
    );
    await localVue.nextTick();

    const element = wrapper.find({ ref: "APP_main" });
    expect(element.exists()).toBe(true);
  });
});
