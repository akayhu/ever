import { apiGetSite } from "@/apis/site";
import { apiGetAllChannels } from "@/apis/channel";
import { apiGetBoard } from "@/apis/board";
import {
  MUTATIONS_TYPE as CALENDAR_MUTATIONS,
  ACTIONS_TYPE as CALENDAR_ACTIONS
} from "./calendar";

export const GETTERS_TYPE = {
  ORDER: "order",
  GET_CURRENT_CHANNELS: "GET_CURRENT_CHANNELS",
  GET_CURRENT_BOARDS: "GET_CURRENT_BOARDS",
  GET_CURRENT_DATA: "GET_CURRENT_DATA"
};

export const ACTIONS_TYPE = {
  ADD_DEVICE: "addDevice",
  GET_CHANNELS_BY_DEVICE: "getChannelsByDevice",
  GET_BOARDS: "getBoards"
};

export const MUTATIONS_TYPE = {
  UPDATE_ORDER: "updateOrder",
  UPDATE_ORDER_STATUS: "updateOrderStatus",
  UPDATE_CHANNELS: "updateChannels",
  UPDATE_CHANNELS_BY_DEVICE: "updateChannelsByDevice",
  UPDATE_BOARDS: "updateBoards"
};

const state = {
  pc: {
    initial: false,
    content: [],
    APIText: "PC"
  },
  mobile: {
    initial: false,
    content: [],
    APIText: "MOBILE"
  },
  app: {
    initial: false,
    content: [],
    APIText: "APP"
  }
};

export const GETTERS = {
  [GETTERS_TYPE.GET_CURRENT_CHANNELS]: state => ({ device }) => {
    if (!state[device]) return [];
    return state[device].content.reduce((acc, site) => {
      if (site.channels) acc = [...acc, ...site.channels];
      return acc;
    }, []);
  },
  [GETTERS_TYPE.GET_CURRENT_BOARDS]: state => ({
    device,
    siteId,
    channelId
  }) => {
    if (!state[device]) return [];
    return state[device].content.reduce((acc, site) => {
      if (site.id === siteId && site.channels) {
        site.channels.forEach(channel => {
          if (channel.id === channelId && channel.boards) {
            acc = [...acc, ...channel.boards];
          }
        });
      }
      return acc;
    }, []);
  },
  [GETTERS_TYPE.ORDER](state) {
    return [];
    // return state[state.globalDevice].content.length > 0 ? state[state.globalDevice].content : [];
  },
  [GETTERS_TYPE.GET_CURRENT_DATA](state) {
    return state;
  }
};

export const ACTIONS = {
  [ACTIONS_TYPE.ADD_DEVICE](
    { state, dispatch, commit },
    device,
    yearMonth = null
  ) {
    return new Promise(resolve => {
      const siteParam = {
        device: state[device].APIText,
        size: 50,
        page: 1,
        sort: "status_desc"
      };
      const allchannelsParam = {
        device: state[device].APIText,
        sort: "status_desc",
        status: true
      };

      /*
        如果下面兩支API在要帶不同參數(ex: checkPermission)
        可以自己再開一個 PromiseAll 在這裡或是自己的 store
      */
      Promise.all([
        apiGetSite(siteParam),
        apiGetAllChannels(allchannelsParam)
      ]).then(async values => {
        const [resSites, resAllChannels] = [...values];

        const { response: sites } = resSites.data;
        commit(MUTATIONS_TYPE.UPDATE_ORDER, {
          payload: sites.content.map(site => {
            return {
              ...site,
              channels: []
            };
          }),
          device
        });
        commit(MUTATIONS_TYPE.UPDATE_ORDER_STATUS, device);

        const { response: allChannels } = resAllChannels.data;
        commit(MUTATIONS_TYPE.UPDATE_CHANNELS_BY_DEVICE, {
          channels: allChannels,
          device
        });

        /* 以下協助 calendar 初始化架構 */
        allChannels.map(x => {
          commit(
            `calendar/${CALENDAR_MUTATIONS.INIT_PAGES}`,
            {
              payload: [
                {
                  name: x.name,
                  siteId: x.siteId,
                  siteName: x.siteName,
                  channelId: x.id,
                  status: x.status,
                  boardCount: x.boardCount,
                  sales: {
                    isInitial: false,
                    isOpen: false,
                    isLoading: false,
                    channelReservations: []
                  },
                  market: {
                    isInitial: false,
                    isOpen: false,
                    isLoading: false,
                    channelReservations: []
                  }
                }
              ],
              device
            },
            { root: true }
          );
        });

        await dispatch(
          `calendar/${CALENDAR_ACTIONS.INSERT_MONTH_DATA}`,
          {
            pageIndex: 0,
            openFirst: true,
            yearMonth
          },
          { root: true }
        );
        resolve("add device done.");
      });
    });
  },
  [ACTIONS_TYPE.GET_BOARDS]({ commit }, payload) {
    return new Promise(resolve => {
      apiGetBoard({
        siteId: payload.siteId,
        channelId: payload.channelId
      })
        .then(resp => {
          const { response: responseData } = resp.data;
          const addBoards = responseData.map(item => {
            return {
              device: item.device,
              siteId: item.siteId,
              siteName: item.siteName,
              channelId: item.channelId,
              channelName: item.channelName,
              boardId: item.id,
              boardName: item.name,
              typeId: item.typeId,
              lowerLimit: item.lowerLimit,
              status: item.status,
              snapshot: item.snapshot
            };
          });
          addBoards.sort((a, b) => a.boardId - b.boardId);
          commit(MUTATIONS_TYPE.UPDATE_BOARDS, {
            ...payload,
            boards: [...addBoards]
          });
          resolve(addBoards);
        })
        .catch(error => {
          console.log("apiGetBoard", error);
          console.log("payload", payload);
        });
    });
  }
};

export const MUTATIONS = {
  updateOrder(state, { payload, device }) {
    state[device].content = [...payload];
    state[device].siteIds = payload.map(x => x.id);
  },
  updateOrderStatus(state, device) {
    state[device].initial = true;
  },
  updateChannels(state, { siteId, device, channels }) {
    if (!state[device]) return;
    state[device].content = state[device].content.map(site => {
      return site.id === siteId ? { ...site, channels } : site;
    });
  },
  [MUTATIONS_TYPE.UPDATE_CHANNELS_BY_DEVICE](state, { device, channels }) {
    if (!state[device]) return;

    channels.map(channel => {
      state[device].content[
        state[device].siteIds.indexOf(channel.siteId)
      ].channels = [
        ...state[device].content[state[device].siteIds.indexOf(channel.siteId)]
          .channels,
        channel
      ];
    });
  },
  updateBoards(state, { device, siteId, channelId, boards }) {
    if (!state[device]) return;
    state[device].content = state[device].content.map(site => {
      if (site.id === siteId && site.channels) {
        return {
          ...site,
          channels: site.channels.map(channel => {
            return channel.id === channelId ? { ...channel, boards } : channel;
          })
        };
      }
      return site;
    });
  }
};

export default {
  namespaced: true,
  state: state,
  actions: ACTIONS,
  getters: GETTERS,
  mutations: MUTATIONS
};
