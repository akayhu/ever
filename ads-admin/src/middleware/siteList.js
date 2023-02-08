import { EventBus } from "@/utils/eventBus.js";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useSiteStore } from "@/storesPinia/site.js";
import { useChannelStore } from "@/storesPinia/channel.js";
import { useBoardStore } from "@/storesPinia/board.js";

const siteListMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const siteStore = useSiteStore();
  const channelStore = useChannelStore();
  const boardStore = useBoardStore();
  const { user } = storeToRefs(userStore);
  const { deviceTag } = storeToRefs(siteStore);
  const { getSearchSiteList, getSite } = siteStore;
  const { getChannelId, getChannel } = channelStore;
  const { getBoard } = boardStore;
  const userLogin = user.value.type;
  const deviceTagValue = deviceTag.value;
  const query = {
    size: 20,
    page: to.query.page || 1,
    sort: to.query.sort || "status_desc",
    siteId: to.query.siteId || "",
    siteKeyword: to.query.siteKeyword || "",
    channelId: to.query.channelId || "",
    channelKeyword: to.query.channelKeyword || "",
    device: to.query.device || deviceTagValue
  };

  if (!query.siteId) delete query.siteId;
  if (!query.siteKeyword) delete query.siteKeyword;
  if (!query.channelId) delete query.channelId;
  if (!query.channelKeyword) delete query.channelKeyword;

  if (userLogin === 2) {
    if (query.channelKeyword) {
      // 查詢版位有傳頻道
      getSearchSiteList({
        device: query.device,
        keyword: query.siteKeyword
      }).then(() => {
        getChannelId({
          siteId: query.siteId,
          channelId: query.channelId
        }).then(channelList => {
          setTimeout(() => {
            EventBus.emit("eventBusSearchChannelList", channelList);
          }, 0);

          getBoard({
            siteId: query.siteId,
            channelId: query.channelId,
            sort: "status_desc"
          }).then(boardList => {
            setTimeout(() => {
              EventBus.emit("eventBusBoardList", boardList);
            }, 0);
          });

          return done();
        });
      });
    } else if (query.siteKeyword) {
      // 查詢版位只傳網站
      getSearchSiteList({
        device: query.device,
        keyword: query.siteKeyword
      }).then(() => {
        getChannel({
          siteId: query.siteId,
          sort: "status_desc"
        }).then(channelList => {
          setTimeout(() => {
            EventBus.emit("eventBusChannelList", channelList);
          }, 0);
          return done();
        });
      });
    } else {
      // 網站列表
      getSite(query).then(() => {
        return done();
      });
    }
  } else {
    return next("/");
  }
};

export default siteListMiddleware;
