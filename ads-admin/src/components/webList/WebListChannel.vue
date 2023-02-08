<template>
  <div>
    <div
      v-show="openTypeMiddle"
      :class="`type_middle type_middle_index_${itemIndex}`"
      class="web_list_channel"
    >
      <div :type="pageIndex === 0 ? 'first' : ''"></div>
      <div>
        <div
          @click="handleOpenBoard(item.id, item.siteId)"
          :class="
            item.boardCount > 0
              ? openTypeInner
                ? `has_item_close has_slot_item_${pageIndex}`
                : `has_item_open has_slot_item_${pageIndex}`
              : ''
          "
          :style="item.boardCount > 0 ? `cursor: pointer;` : ''"
          :title="item.name"
        >
          <span class="name">{{ item.name }}</span>
        </div>
      </div>
      <div>
        <router-link
          v-if="getUserAuthority.webBoardEdit"
          @click="setCollapseSession(item.siteId, item.id)"
          :to="`/banneradd?siteId=${item.siteId}&channelId=${item.id}`"
        >
          +新增版位
        </router-link>
      </div>
      <div></div>
      <div>{{ item.status ? "上線" : "下線" }}</div>
      <div></div>
      <div>
        <img
          @click="
            setCollapseSession(item.siteId, item.id);
            jump(`/channeledit`, `siteId=${item.siteId}&channelId=${item.id}`);
          "
          :src="getChannelEdidIcon"
          class="pointer"
        />
      </div>
    </div>

    <div v-for="(boardListItem, boardIndex) in boardList" :key="boardIndex">
      <div v-show="openTypeInner" class="web_list_board">
        <div></div>
        <div :type="boardIndex === 0 ? 'first' : ''"></div>
        <div>
          <div :title="boardListItem.name">
            <span class="name">{{ boardListItem.name }}</span>
          </div>
        </div>
        <div>{{ boardListItem.id }}</div>
        <div>{{ boardListItem.status ? "上線" : "下線" }}</div>
        <div>
          <img
            @click="handleOpenADCodeDialog(boardListItem)"
            src="@/assets/icon/icon-copy.svg"
            class="pointer"
          />
        </div>
        <div>
          <img
            @click="
              setCollapseSession(boardListItem.siteId, boardListItem.channelId);
              jump(
                `/banneredit`,
                `siteId=${boardListItem.siteId}&channelId=${boardListItem.channelId}&boardId=${boardListItem.id}`
              );
            "
            :src="getBoardEdidIcon"
            class="pointer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import useMixins from "@/mixins/useMixins.js";
import { EventBus } from "@/utils/eventBus.js";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useBoardStore } from "@/storesPinia/board.js";

export default {
  name: "WebListChannel",
  props: {
    item: {
      type: Object,
      required: true
    },
    itemIndex: {
      type: Number,
      required: true
    },
    pageIndex: {
      type: Number,
      required: true
    },
    openTypeMiddle: {
      type: Boolean,
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
  setup(props) {
    const route = useRoute();
    const userStore = useUserStore();
    const boardStore = useBoardStore();
    const { user } = storeToRefs(userStore);
    const { getBoard } = boardStore;
    const { jump } = useMixins();
    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const getChannelEdidIcon = computed(() => {
      return getUserAuthority.value.webChannelEdit
        ? require("@/assets/icon/edit.svg")
        : require("@/assets/icon/eye-show-g.svg");
    });
    const getBoardEdidIcon = computed(() => {
      return getUserAuthority.value.webBoardEdit
        ? require("@/assets/icon/edit.svg")
        : require("@/assets/icon/eye-show-g.svg");
    });
    const openTypeInner = ref(false);
    const boardList = ref([]);
    const openADCodeDialog = ref(false);

    // 打開版位列表
    const handleOpenBoard = (channelId, siteId) => {
      let nowOpenTypeInner = openTypeInner.value;

      EventBus.emit("closeTypeInner");

      if (boardList.value.length < 1) {
        getBoard({ siteId, channelId, sort: props.sort }).then(boardItem => {
          boardList.value = boardItem;
          openTypeInner.value = !openTypeInner.value;
        });
      } else {
        nowOpenTypeInner
          ? (openTypeInner.value = false)
          : (openTypeInner.value = true);
      }

      setCollapseSession(siteId, channelId);
    };

    // 打開廣告代碼
    const handleOpenADCodeDialog = item => {
      props.openADCodeDialogFunc(item);
    };

    // 新增版位存在 sessionStorage
    const setCollapseSession = (siteId, channelId) => {
      if (siteId) sessionStorage.setItem("weblist_openedSite", siteId);
      if (channelId) sessionStorage.setItem("weblist_openedChannel", channelId);
    };

    // 監聽關閉版位列表
    EventBus.on("closeTypeInner", () => {
      openTypeInner.value = false;
    });

    // 監聽打開版位列表
    EventBus.on("eventBusBoardList", boardListData => {
      boardList.value = boardListData;
      openTypeInner.value = true;
    });

    const openSiteId = sessionStorage.getItem("weblist_openedSite");
    const openChannelId = sessionStorage.getItem("weblist_openedChannel");
    if (
      openSiteId &&
      openChannelId &&
      !route.query.channelId &&
      props.item.id.toString() === openChannelId
    ) {
      handleOpenBoard(openChannelId, openSiteId);
    }

    return {
      getChannelEdidIcon,
      getBoardEdidIcon,
      openTypeInner,
      boardList,
      openADCodeDialog,
      handleOpenBoard,
      handleOpenADCodeDialog,
      setCollapseSession,
      jump,
      getUserAuthority
    };
  }
};
</script>

<style lang="scss" scoped>
.web_list {
  &_channel,
  &_board {
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
    }
  }
  &_channel {
    > div {
      background-color: #f8f8f8;

      &[type="first"] {
        position: relative;

        &::before {
          content: " ";
          display: inline-block;
          border-style: solid;
          border-width: 0 10px 10px 10px;
          border-color: transparent transparent #eee transparent;
          position: absolute;
          top: -10px;
          left: 48px;
        }

        &::after {
          content: " ";
          display: inline-block;
          border-style: solid;
          border-width: 0 10px 10px 10px;
          border-color: transparent transparent #f8f8f8 transparent;
          position: absolute;
          top: -8px;
          left: 48px;
        }
      }

      &:nth-child(2) {
        div {
          display: inline-flex;
          padding-left: 12px;

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

          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            display: inline-block;
            max-width: 240px;
            padding-right: 15px;
            position: relative;
          }
        }
      }
    }
  }
  &_board {
    > div {
      background-color: #eee;

      &[type="first"] {
        position: relative;

        &::before {
          content: " ";
          display: inline-block;
          border-style: solid;
          border-width: 0 10px 10px 10px;
          border-color: transparent transparent #e2e1e1 transparent;
          position: absolute;
          top: -10px;
          left: 36px;
        }

        &::after {
          content: " ";
          display: inline-block;
          border-style: solid;
          border-width: 0 10px 10px 10px;
          border-color: transparent transparent #eee transparent;
          position: absolute;
          top: -8px;
          left: 36px;
        }
      }
    }
  }
}
</style>
