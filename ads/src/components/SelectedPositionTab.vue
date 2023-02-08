<template>
  <div class="tab">
    <div class="tab_devices">
      <div
        v-for="device in devices"
        :key="device"
        :class="{ focus: device === currentDevice }"
        @click="deviceClick(device)"
        class="tab_devices_tag"
      >
        {{ device }}
      </div>
    </div>
    <div
      v-if="activePositions.length > 0"
      class="tab_positions d-flex flex-wrap"
    >
      <span
        v-for="position in activePositions"
        @click="positionClick(position)"
        :key="
          position.reservationId ? position.reservationId : position.boardId
        "
        :class="{
          focus: position.reservationId === currentPositionTag.reservationId
        }"
        v-tooltip="{
          content: `${position.startDate} ~ ${position.endDate} (ID: ${position.reservationId})`,
          offset: 5,
          placement: 'top',
          trigger: 'hover'
        }"
        class="tab_positions_tag d-flex align-items-center"
      >
        {{ position.name }}
      </span>
    </div>
    <div
      v-if="activePositions.length < 1"
      class="tab_positions d-flex flex-wrap"
    >
      無廣告版位
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectedPositionTab",
  data() {
    return {
      currentDevice: "",
      currentPositionTag: {}
    };
  },
  props: {
    devices: {
      type: Array,
      default: () => ["PC", "APP", "MOBILE"]
    },
    positions: {
      type: Array,
      required: true,
      validator: value => {
        return value.every(item => item.boardId && item.name && item.device);
      }
    },
    defaultFocusTag: {
      type: Object,
      default: () => {}
    },
    device: {
      type: String
    }
  },
  created() {
    const { positions, defaultFocusTag, device } = this;
    // 預設選取 tag
    if (defaultFocusTag.boardId) {
      this.currentDevice = defaultFocusTag.device;
      this.currentPositionTag = { ...defaultFocusTag };
    } else if (device) {
      // 若 props 有傳 device，則打開該 device tag
      this.currentDevice = device;
    } else {
      // 預設打開第一筆資料 device，共用 device 不一定是 PC
      if (positions[0]) {
        this.currentDevice = positions[0].device;
      }
    }
  },
  computed: {
    activePositions() {
      const { positions, currentDevice } = this;
      return positions.filter(position => position.device === currentDevice);
    }
  },
  methods: {
    positionClick(tag) {
      this.currentPositionTag = { ...tag, device: this.currentDevice };
      this.$emit("positionTagClick", this.currentPositionTag);
    },
    deviceClick(device) {
      this.currentDevice = device;
      this.$emit("deviceTagClick", this.currentDevice);
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  background-color: transparent;

  .tab_devices {
    border-bottom: 1px solid #d8d8d8;
    display: flex;

    .tab_devices_tag {
      min-height: 45px;
      min-width: 80px;
      padding: 0 23px;
      font-size: 20px;
      letter-spacing: 1.38px;
      border-bottom: 4px solid #fff;
      display: flex;
      align-items: center;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: #e6f9fa;
        border-bottom: 4px solid #e6f9fa;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      &.focus {
        border-bottom: 4px solid #00afb8;
        font-weight: bold;
        color: #00afb8;

        &:hover {
          background-color: #fff;
        }
      }
    }
  }

  .tab_positions {
    padding-top: 10px;

    .tab_positions_tag {
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 0.88px;
      color: #00afb8;
      border-radius: 12px;
      border: solid 1px #00afb8;
      background-color: #fff;
      padding: 2px 10px;
      margin: 10px 8px 0 0;
      cursor: pointer;

      &:first-child {
        margin-left: 0;
      }

      &.focus {
        background-color: #00afb8;
        color: #fff;

        &:hover {
          border: solid 1px #39c8d0;
          background-color: #39c8d0;
        }
      }
    }
  }
}
</style>
