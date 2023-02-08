<template>
  <div>
    <div class="web_list_site">
      <div>
        <span
          @click="item.channelCount > 0 ? handleOpenChannel(item.id) : ''"
          :class="
            item.channelCount > 0
              ? openTypeMiddle
                ? `has_item_close has_item_${itemIndex}`
                : `has_item_open has_item_${itemIndex}`
              : ''
          "
          :style="item.channelCount > 0 ? `cursor: pointer;` : ''"
        >
          <span class="name">{{ item.name }}</span>
        </span>
      </div>
      <div>
        <router-link
          v-if="getUserAuthority.webChannelEdit"
          :to="`/channeladd?siteId=${item.id}`"
        >
          +新增頻道
        </router-link>
      </div>
      <div></div>
      <div></div>
      <div>
        {{ item.status ? "上線" : "下線" }}
      </div>
      <div></div>
      <div>
        <img
          @click="jump(`/webedit`, `siteId=${item.id}`)"
          :src="getSiteEdidIcon"
          class="pointer"
        />
      </div>
    </div>

    <template v-if="channelList.length > 0">
      <WebListChannel
        v-for="(channelListItem, pageIndex) in channelList"
        :key="pageIndex"
        :pageIndex="pageIndex"
        :item="channelListItem"
        :itemIndex="itemIndex"
        :openTypeMiddle="openTypeMiddle"
        :sort="sort"
        :openADCodeDialogFunc="openADCodeDialogFunc"
      />
    </template>
  </div>
</template>

<script>
import { ref, computed, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import useMixins from "@/mixins/useMixins.js";
import WebListChannel from "./WebListChannel.vue";
import { EventBus } from "@/utils/eventBus.js";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useChannelStore } from "@/storesPinia/channel.js";

export default {
  name: "WebListSite",
  props: {
    item: {
      type: Object,
      required: true
    },
    itemIndex: {
      type: Number,
      required: true
    },
    sort: {
      type: String,
      required: true
    },
    openADCodeDialogFunc: {
      type: Function
    }
  },
  components: {
    WebListChannel
  },
  setup(props) {
    const route = useRoute();
    const userStore = useUserStore();
    const channelStore = useChannelStore();
    const { user } = storeToRefs(userStore);
    const { getChannel } = channelStore;
    const { jump } = useMixins();
    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const getSiteEdidIcon = computed(() => {
      return getUserAuthority.value.webSiteEdit
        ? require("@/assets/icon/edit.svg")
        : require("@/assets/icon/eye-show-g.svg");
    });
    const openTypeMiddle = ref(false);
    const channelList = ref([]);

    // 打開頻道列表
    const handleOpenChannel = siteId => {
      let nowOpenTypeMiddleStatus = openTypeMiddle.value;

      EventBus.emit("eventBusCloseChannelList");

      if (channelList.value.length < 1) {
        getChannel({ siteId, sort: props.sort }).then(channelItem => {
          channelList.value = channelItem;
          openTypeMiddle.value = true;
        });
      } else {
        nowOpenTypeMiddleStatus
          ? (openTypeMiddle.value = false)
          : (openTypeMiddle.value = true);
      }

      EventBus.emit("closeTypeInner");
      sessionStorage.setItem("weblist_openedSite", siteId);
    };

    // 變更頻道列表
    const updateChannelList = (channelListData, type) => {
      channelList.value = [];
      if (type === "push") {
        let listArr = [];
        listArr.push(channelListData);
        channelList.value = listArr;
      } else {
        channelList.value = channelListData;
      }
      openTypeMiddle.value = true;
    };

    onBeforeUnmount(() => {
      EventBus.off("eventBusCloseChannelList");
      EventBus.off("eventBusChannelList");
      EventBus.off("eventBusSearchChannelList");
    });

    // 監聽關閉頻道列表
    EventBus.on("eventBusCloseChannelList", () => {
      openTypeMiddle.value = false;
    });

    // 監聽打開頻道列表(查詢版位)
    EventBus.on("eventBusChannelList", channelListData => {
      updateChannelList(channelListData);
    });

    // 監聽打開頻道列表(直衝網址)
    EventBus.on("eventBusSearchChannelList", channelListData => {
      updateChannelList(channelListData, "push");
    });

    const openSiteId = sessionStorage.getItem("weblist_openedSite");
    if (
      openSiteId &&
      !route.query.siteId &&
      props.item.id.toString() === openSiteId
    ) {
      handleOpenChannel(openSiteId);
    }

    return {
      getUserAuthority,
      getSiteEdidIcon,
      openTypeMiddle,
      channelList,
      handleOpenChannel,
      jump
    };
  }
};
</script>

<style lang="scss" scoped>
.web_list_site {
  display: grid;
  grid-template-columns: 232px 290px 240px 134px 94px 94px 94px;

  > div {
    height: 47px;
    border-bottom: 1px solid #e2e1e1;
    display: flex;
    align-items: center;
    padding-left: 12px;
    letter-spacing: 1px;

    img {
      cursor: pointer;
    }

    &:nth-child(1) {
      span {
        display: inline-flex;

        &.has_item_open {
          span:after {
            content: " ";
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 5px 5px 0 5px;
            border-color: #000 transparent transparent transparent;
            position: absolute;
            top: 9px;
            right: 0;
          }
        }
        &.has_item_close {
          span:after {
            content: " ";
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 5px 5px 5px;
            border-color: transparent transparent #000 transparent;
            position: absolute;
            top: 10px;
            right: 0;
          }
        }

        &.name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          display: inline-block;
          max-width: 160px;
          padding-right: 15px;
          position: relative;
        }
      }
    }
  }
}
</style>
