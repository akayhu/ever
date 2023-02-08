<template>
  <div class="switch_devices_container">
    <switch-tabs
      :tabs-data="adDeviceTabs"
      :value="activeDevice"
      @select-tab="selectDevice($event.key)"
    />

    <div class="tag_block" v-show="!isLoading">
      <div class="w-100 font-weight-bold mb-4">
        選擇網站/頻道
      </div>
      <Tag
        class="mr-1 mb-2"
        v-for="channel in currentChannels"
        :key="channel.id"
        :tagData="channel"
        :content="`${channel.siteName}/${channel.name}`"
        :isActive="channel.id === activeChannel.channelId"
        @onTagClick="selectChannel($event)"
      />

      <div class="w-100 d-flex flex-wrap" v-if="requiredSelectBoards">
        <div class="w-100 font-weight-bold mt-4" v-if="activeChannel.channelId">
          選擇版位
        </div>
        <Tag
          class="mr-1 mt-2"
          v-for="board in currentBoards"
          :key="board.id"
          :tagData="board"
          :content="board.boardName"
          :isActive="board.boardId === activeBoard.boardId"
          @onTagClick="selectBoard($event)"
        />
      </div>
    </div>

    <div v-show="isLoading" class="loading">
      <Loading />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  ACTIONS_TYPE as ORDER_ACTIONS_TYPE,
  GETTERS_TYPE as ORDER_GETTERS_TYPE
} from "@/store/modules/order";
import Loading from "@/components/Loading";
import Tag from "@/components/share/Tag";
import { devices } from "@/utils/util.js";
import SwitchTabs from "@/components/share/SwitchTabs.vue";

export default {
  name: "SwitchDevices",
  components: {
    Loading,
    Tag,
    SwitchTabs
  },
  props: {
    requiredSelectBoards: {
      type: Boolean,
      default: true
    },
    canActiveBoards: {
      type: Boolean,
      default: true
    },
    boardsFromData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: false,
      adDeviceTabs: devices,
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
  },
  created() {
    if (this.$route.query.device)
      this.selectDevice(this.$route.query.device.toLowerCase());
    else this.selectDevice(this.activeDevice);
  },
  computed: {
    ...mapGetters({
      getCurrentChannels: `order/${ORDER_GETTERS_TYPE.GET_CURRENT_CHANNELS}`,
      getCurrentBoards: `order/${ORDER_GETTERS_TYPE.GET_CURRENT_BOARDS}`
    }),
    currentChannels() {
      return this.getCurrentChannels({
        device: this.activeDevice
      });
    },
    currentBoards() {
      if (this.boardsFromData.length > 0) {
        return this.boardsFromData;
      }
      let boards = this.getCurrentBoards({
        device: this.activeDevice,
        siteId: this.activeChannel.siteId,
        channelId: this.activeChannel.channelId
      });
      return boards;
    }
  },
  methods: {
    ...mapActions({
      addDevice: `order/${ORDER_ACTIONS_TYPE.ADD_DEVICE}`,
      getBoards: `order/${ORDER_ACTIONS_TYPE.GET_BOARDS}`
    }),
    async selectDevice(device) {
      this.isLoading = true;
      this.activeDevice = device;
      this.activeChannel = {};
      this.activeBoard = {};
      this.$emit("changeDevice", device);
      await this.addDevice(device);

      if (this.currentChannels.length > 0) {
        if (this.$route.query.siteId && this.$route.query.channelId) {
          const channel = this.currentChannels.find(
            item => item.id === +this.$route.query.channelId
          );
          if (channel) this.selectChannel(channel);
          else this.selectChannel(this.currentChannels[0]);
        } else {
          this.selectChannel(this.currentChannels[0]);
        }
      }
      this.isLoading = false;
    },
    async selectChannel({
      id: channelId,
      name: channelName,
      siteId,
      siteName
    }) {
      this.activeChannel = { channelName, channelId, siteId, siteName };
      this.isLoading = true;
      this.$emit("reset");
      await this.getBoards({
        siteId,
        channelId,
        device: this.activeDevice
      });
      this.isLoading = false;
      this.$emit("changeChannel", {
        channel: { ...this.activeChannel },
        boards: [...this.currentBoards]
      });
      // if (this.currentBoards.length > 0)
      //   this.selectBoard(this.currentBoards[0]);
    },
    selectBoard(board) {
      if (this.canActiveBoards) this.activeBoard = board;
      this.$emit("changeBoard", board);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.switch_devices_container {
  border-bottom: 1px solid $gray-500;
  padding-bottom: 24px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.switch_tabs_primary {
  margin-bottom: 1.5rem;

  ::v-deep .switch_tabs_element {
    line-height: 1.1;
    letter-spacing: 1.13px;
  }
}

.tag_block {
  display: flex;
  flex-wrap: wrap;
}
</style>
