<template>
  <DropDownRow
    @onEditBtnClick="handleEdit"
    @onActiveOff="resetComponentData"
    @onFocusOff="isEdit = false"
    :tipText="activeText"
    :isEditBtnClickAble="!isLoading"
    :isActive="isActive"
    :isEdit="isEdit"
    :isFocus="isFocus"
    title="墊檔廣告版位"
    toolTipText="請選擇預墊檔的廣告版位"
    subTitle="設定墊檔廣告素材請先選擇網站、頻道＆版位。"
    class="mb-6"
  >
    <div class="select_tab">
      <!-- 選擇裝置 -->
      <switch-tabs
        :tabs-data="deviceList"
        :value="activeDevice"
        :loading="isLoading"
        @select-tab="isLoading || getActiveDeviceChanels($event.key)"
      />

      <!-- 選擇網站/頻道 -->
      <div v-show="!isLoading" class="select_channel pt-5">
        <p class="select_channel_title m-0">選擇網站/頻道</p>
        <div class="select_channel_tag_wrapper">
          <Tag
            class="mr-1 mt-2"
            v-for="channel in currrentChannels"
            :key="channel.id"
            :tagData="channel"
            :content="`${channel.siteName}/${channel.name}`"
            :isActive="channel.id === activeChannel.channelId"
            @onTagClick="getActiveChannelBoards($event)"
          />
        </div>
      </div>
      <!-- 選擇版位 -->
      <div
        v-show="clickSiteChannelTag && isChannelTabShow"
        class="select_board pt-5"
      >
        <p class="select_board_title m-0">
          選擇版位
          <icon
            class="align-middle mr-8"
            v-tooltip="{
              offset: 5,
              content: '無法選擇版位為無需墊檔資訊',
              placement: 'right',
              trigger: 'hover'
            }"
            iconName="icon-info-warmgray"
            size="16"
          />
        </p>
        <div class="select_board_tag_wrapper">
          <template v-if="clickSiteChannelTag && currrentBoards.length > 0">
            <Tag
              class="mr-1 mt-3"
              v-for="board in currrentBoards"
              :key="board.id"
              :tagData="board"
              :content="board.boardName"
              :isActive="board.boardId === activeBoard.boardId"
              :isDisable="board.lowerLimit === 0 || !board.status"
              @onTagClick="selectBoard($event)"
            />
          </template>
          <p v-if="clickSiteChannelTag && currrentBoards.length < 1">
            無版位需設定墊檔資訊
          </p>
        </div>
      </div>
      <!-- Loading -->
      <div v-show="isLoading" class="loading">
        <Loading />
      </div>
    </div>
  </DropDownRow>
</template>

<script>
import Loading from "@/components/Loading";
import Tag from "@/components/share/Tag";
import DropDownRow from "@/components/share/DropDownRow";
import { mapActions, mapGetters } from "vuex";
import {
  ACTIONS_TYPE as ORDER_ACTIONS_TYPE,
  GETTERS_TYPE as ORDER_GETTERS_TYPE
} from "@/store/modules/order";
import { EventBus } from "@/utils/eventBus.js";
import { devices } from "@/utils/util.js";
import SwitchTabs from "@/components/share/SwitchTabs.vue";

const state = () => {
  return {
    deviceList: devices,
    isEdit: false,
    isLoading: false,
    clickSiteChannelTag: false,
    activeDevice: "pc",
    activeChannel: {
      channelId: "",
      channelName: "",
      siteId: "",
      siteName: ""
    },
    activeBoard: {
      boardId: 0,
      boardName: "",
      channelId: 0,
      channelName: "",
      device: "",
      lowerLimit: 0,
      siteId: 0,
      siteName: "",
      status: false,
      typeId: 0
    }
  };
};

export default {
  name: "SelectTab",
  components: {
    Loading,
    Tag,
    DropDownRow,
    SwitchTabs
  },
  props: {
    isActive: {
      type: Boolean,
      required: true
    },
    isFocus: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      ...state()
    };
  },
  created() {
    EventBus.$on("resetCushionSelectTab", () => {
      this.activeBoard.device = "";
      this.activeChannel.channelId = "";
      this.clickSiteChannelTag = false;
    });
  },
  computed: {
    ...mapGetters({
      getCurrentChannels: `order/${ORDER_GETTERS_TYPE.GET_CURRENT_CHANNELS}`,
      getCurrentBoards: `order/${ORDER_GETTERS_TYPE.GET_CURRENT_BOARDS}`
    }),
    isChannelTabShow() {
      return !this.isLoading;
    },
    currrentChannels() {
      return this.getCurrentChannels({
        device: this.activeDevice
      });
    },
    currrentBoards() {
      return this.getCurrentBoards({
        device: this.activeDevice,
        siteId: this.activeChannel.siteId,
        channelId: this.activeChannel.channelId
      });
    },
    activeText() {
      const {
        activeBoard: { device, channelName, boardName }
      } = this;
      const isEmpty = !!device && !!channelName && !!boardName;
      return isEmpty ? `類型：${device}/${channelName}/${boardName}` : "";
    }
  },
  methods: {
    ...mapActions({
      addDevice: `order/${ORDER_ACTIONS_TYPE.ADD_DEVICE}`,
      getBoards: `order/${ORDER_ACTIONS_TYPE.GET_BOARDS}`
    }),
    async getActiveDeviceChanels(device) {
      this.clickSiteChannelTag = false;
      try {
        this.isLoading = true;
        await this.addDevice(device);
        this.activeDevice = device;
        this.isLoading = false;
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    },
    getActiveChannelBoards({
      name: channelName,
      id: channelId,
      siteId,
      siteName,
      device
    }) {
      this.clickSiteChannelTag = true;
      if (
        this.getCurrentBoards({
          device: device.toLowerCase(),
          siteId,
          channelId
        }).length > 0
      ) {
        return (this.activeChannel = {
          channelName,
          channelId,
          siteId,
          siteName
        });
      }
      try {
        this.isLoading = true;
        this.getBoards({
          siteId,
          channelId,
          device: device.toLowerCase()
        }).then(() => {
          this.activeChannel = { channelName, channelId, siteId, siteName };
          this.isLoading = false;
        });
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    },
    selectBoard(board) {
      this.isEdit = false;
      this.activeBoard = {
        ...board
      };
      this.$emit("submit", board);
    },
    handleEdit() {
      if (this.isLoading || !this.isActive) return;
      this.isEdit = !this.isEdit;
      this.$emit("edit");
      if (
        this.isEdit &&
        !this.activeDevice &&
        this.currrentChannels.length === 0
      ) {
        this.getActiveDeviceChanels("pc");
      }
    },
    resetComponentData() {
      Object.assign(this.$data, state());
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.select_tab {
  > p {
    line-height: 22px;
    font-size: 16px;
    margin-bottom: 24px;
    color: $gray-600;
  }

  .switch_tabs_primary {
    margin-top: 20px;
    margin-bottom: 0;
  }

  .select_channel,
  .select_board {
    &_title {
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 1.33px;
      line-height: 24px;
    }

    &_tag_wrapper {
      display: flex;
      flex-wrap: wrap;

      > p {
        color: $red;
        margin-top: 10px;
      }
    }
  }

  .select_board_tag_wrapper {
    p {
      font-size: 14px;
      letter-spacing: 1.43px;
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }
}
</style>
