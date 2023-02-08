<template>
  <div class="material_content_left" :class="{ focus: isFocus }">
    <div class="ad_slot_main">
      <div class="title">
        廣告版位
        <icon
          iconName="ic-help-outline"
          size="16"
          v-tooltip="{
            placement: 'right',
            offset: 5,
            content: '請選擇預曝光的廣告版位',
            trigger: 'hover'
          }"
        />
      </div>
      <dl class="device_slot_block">
        <template v-for="device in Object.keys(deviceData)">
          <dt
            :key="`dt_${device}`"
            @click="changeSelect(device)"
            :class="{ default: deviceData[device].length < 1 }"
          >
            <div class="device_left">{{ device }}</div>
            <div class="device_right">
              <span
                v-if="deviceData[device].length > 0"
                :id="`${device}_Exposure_Count`"
                >{{ deviceExposed[device] }}</span
              >
              <span
                v-if="deviceData[device].length > 0"
                :id="`${device}_TotalCount`"
              >
                / {{ deviceData[device].length }}</span
              >
              <icon
                :iconName="
                  deviceData[device].length > 0 && openSelect === device
                    ? 'icon-arrow-up-disable'
                    : 'icon-arrow-down-disable'
                "
              />
            </div>
          </dt>
          <dd
            v-if="deviceData[device].length > 0 && openSelect === device"
            :key="`dd_${device}`"
          >
            <ul :ref="`${device}_main`">
              <li
                v-for="(item, index) in deviceData[device]"
                @click="boardClick(item)"
                :key="item.reservationId ? item.reservationId : item.boardId"
                :ref="`item_${index}`"
              >
                <div
                  :class="getStatus(item.emergencyPublish.status, item.endDate)"
                >
                  {{
                    getStatusName(item.emergencyPublish.status, item.endDate)
                  }}
                </div>
                <el-tooltip
                  popper-class="item_tooltip"
                  effect="dark"
                  :content="
                    `${item.startDate} ~ ${item.endDate} (ID: ${item.reservationId})`
                  "
                  :offset="1"
                  placement="right"
                >
                  <div
                    :class="{
                      focus: item.reservationId === focusTag.reservationId
                    }"
                  >
                    {{ item.name }}
                  </div>
                </el-tooltip>
              </li>
            </ul>
          </dd>
        </template>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import expandLessSvg from "@/assets/icon/icon-arrow-up-disable.svg";
import expandMoreSvg from "@/assets/icon/icon-arrow-down-disable.svg";
import { checkStartDate } from "@/utils/dateFormat";

export default {
  name: "NewADSlot",
  data() {
    return {
      openSelect: "",
      focusTag: {},
      deviceData: {
        PC: [],
        APP: [],
        MOBILE: []
      },
      deviceExposed: {
        PC: 0,
        APP: 0,
        MOBILE: 0
      }
    };
  },
  props: {
    isFocus: {
      type: Boolean
    },
    device: {
      type: String
    },
    orderId: {
      type: String
    }
  },
  computed: {
    ...mapGetters("reservation", ["getReservationData"]),
    getReservationOrderBoardList() {
      return this.getReservationData.reservationOrderBoardList;
    },
    lessIcon() {
      return expandLessSvg;
    },
    moreIcon() {
      return expandMoreSvg;
    }
  },
  methods: {
    ...mapActions("material", ["updateCopyMaterialDataAction"]),
    // 清空資料
    getStatus(type, endDate) {
      const beforeToday = !checkStartDate(endDate, "YYYY/MM/DD");
      return type === 3 || type === 4
        ? "uploaded"
        : beforeToday || type === 5
        ? "expired"
        : "";
    },
    getStatusName(type, endDate) {
      const beforeToday = !checkStartDate(endDate, "YYYY/MM/DD");
      return type === 3 || type === 4
        ? "已上傳"
        : beforeToday || type === 5
        ? "已過期"
        : "";
    },
    changeSelect(type) {
      if (this.deviceData[type].length > 0 && this.openSelect !== type)
        this.openSelect = type;
    },
    async boardClick(tagData) {
      await this.updateCopyMaterialDataAction({
        boardId: tagData.boardId,
        reservationId: tagData.reservationId
      });
      if (
        this.$route.query.device != tagData.device ||
        this.$route.query.reservationId != tagData.reservationId
      ) {
        const orderId = this.$route.query.id || this.orderId;
        this.$router.replace({
          query: {
            id: orderId,
            device: tagData.device,
            reservationId: tagData.reservationId
          }
        });
      }
      this.focusTag = tagData;
      this.$emit("selectADSlot", { tagData });
    }
  },
  watch: {
    getReservationOrderBoardList(value) {
      const { $route, changeSelect, boardClick } = this;

      Object.keys(this.deviceData).forEach(device => {
        this.deviceData[device] = [];
        this.deviceExposed[device] = 0;
      });

      if ($route.query.device) changeSelect($route.query.device);

      let scrollTopIndex = 0;

      value.forEach(item => {
        let data = { ...item, name: `${item.channelName}/${item.boardName}` };
        const device = data.device;

        if (!this.deviceData[device]) this.deviceData[device] = [];
        this.deviceData[device].push(data);

        if (
          data.emergencyPublish.status >= 3 ||
          !checkStartDate(data.endDate, "YYYY/MM/DD")
        ) {
          this.deviceExposed[device]++;
        }

        if (item.reservationId === Number($route.query.reservationId)) {
          boardClick(item);
          scrollTopIndex = this.deviceData[device].length - 1;
        }
      });

      if ($route.query.device) {
        this.openSelect = $route.query.device;
      } else {
        Object.keys(this.deviceData).forEach(device => {
          if (this.deviceData[device].length > 0) {
            this.openSelect = device;
            return;
          }
        });
      }

      this.$nextTick(() => {
        this.$refs[`${this.openSelect}_main`][0].scrollTop =
          this.$refs[`item_${scrollTopIndex}`][0].offsetTop - 600;
      });
    }
  }
};
</script>

<style>
.item_tooltip {
  font-size: 14px !important;
  letter-spacing: 1.43px;
}
</style>
<style lang="scss" scoped>
.material_content_left {
  width: 264px;
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #fff;

  &.focus {
    border: solid 1px #00afb8;
  }
}

.ad_slot_main {
  .title {
    margin: 24px 24px;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.33;
    letter-spacing: 1.33px;
    color: #292929;
  }

  .device_slot_block {
    dt {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 4px solid #00afb8;
      height: 48px;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      cursor: pointer;

      .device_left {
        margin-left: 24px;
        font-size: 16px;
        font-weight: bold;
        color: #00afb8;
      }

      .device_right {
        margin-right: 10px;
        font-size: 12px;
        font-weight: normal;

        span {
          &:first-child {
            color: #00afb8;
          }
        }

        img {
          margin-left: 4px;
        }
      }

      &.default {
        border-left: 4px solid #ddd;
        cursor: initial;

        .device_left {
          color: #a9a9a9;
          font-weight: normal;
        }
      }
    }

    dd {
      margin-bottom: 0;

      ul {
        margin-bottom: 0;
        max-height: 380px;
        overflow-y: auto;

        li {
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: left;
          align-items: flex-start;
          padding: 7px 11px;
          cursor: pointer;

          div {
            font-size: 16px;
            letter-spacing: 1.38px;

            &:first-child {
              margin-right: 5px;
              width: 57px;
              font-size: 12px;
              color: #292929;
              padding: 3px 0;
              text-align: center;
              line-height: 1.5;
              letter-spacing: 1.5px;
              border-radius: 12px;
            }

            &:last-child {
              max-width: 174px;
            }

            &.uploaded {
              background-color: #acf6db;
            }

            &.expired {
              background-color: #ffc4db;
            }

            &.focus {
              color: #00afb8;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
