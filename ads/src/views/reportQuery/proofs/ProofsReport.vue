<template>
  <div>
    <div class="proofs_report_wrapper_title">報表管理</div>

    <section class="wrapper">
      <h2 class="mb-6">樣張截圖</h2>

      <div class="ad_date">
        <label>廣告區間</label>
        <span>
          <DatePicker
            ref="date_picker"
            :dateInterval="[dateInterval.start, dateInterval.end]"
            :getSearchTime="getTime"
            :selectedDateAfter="false"
            :maxDay="7"
            :changeAction="handleChangeDateRange"
            :dateRange="[datePickerDesignatedDate]"
          />
        </span>
      </div>

      <div class="ad_interval">
        <label>廣告單日</label>
        <SingleDateSelector
          :limitStartDate="designatedDate"
          :startDate="dateInterval.start"
          :endDate="dateInterval.end"
          :selectedDate="selectedDate"
          @changeDate="changeDate"
          @changeWeek="updateCurrentWeek"
        >
          <icon
            class="ml-1"
            iconName="icon-info-warmgray"
            v-tooltip="{
              offset: 5,
              content: '時間可依週切換，點選單日可觀看數據',
              placement: 'right',
              trigger: 'hover'
            }"
            size="16"
          />
        </SingleDateSelector>
      </div>

      <div class="ad_company">
        <label>選擇企業</label>
        <div class="input">
          <SelectDropdown
            class="select_dropdown"
            :value="selectedCompany.name"
            :options="searchedOptions"
            :filterable="true"
            :remote="true"
            :clearable="true"
            :placeholder="'請選擇---'"
            :asncSearchCb="companySuggestSearch"
            :type="'getFilterCustomerSuggest'"
            @value-changed="setSelectedCompany($event)"
            @value-clear="clearSelectedCompany"
            @set-history-record="searchedOptions = $event"
          />
        </div>
      </div>

      <div class="ad_project">
        <div class="">
          選擇專案
          <icon
            iconName="icon-info-warmgray"
            v-tooltip="{
              placement: 'right',
              content: '請先選擇企業與廣告區間方可選擇專案',
              offset: 5,
              trigger: 'hover'
            }"
            size="16"
          />
        </div>
        <div class="project_block" v-show="isSelectedProjectBlockShow">
          <template v-if="searchedProjects.length > 0">
            <span v-for="project in searchedProjects" :key="project.id">
              <span class="project_item">
                <input
                  type="checkbox"
                  v-model="selectedProject"
                  :value="project.id"
                  :id="project.id"
                />
                <label :for="project.id"
                  ><span></span>
                  <div
                    class="d-inline"
                    v-tooltip="{
                      placement: 'bottom-start',
                      offset: 5,
                      content: project.name,
                      trigger: 'hover'
                    }"
                  >
                    {{ project.name }}
                  </div>
                </label>
              </span>
            </span>
          </template>
          <p class="m-0" v-else>無搜尋結果</p>
        </div>
      </div>

      <div class="button_block">
        <button
          class="button_bg_blue_large"
          @click="submit()"
          :disabled="!isSearchEnable"
        >
          確定
        </button>
      </div>
    </section>

    <section class="wrapper" v-if="isSearched">
      <div v-show="isLoading" class="loading">
        <Loading />
      </div>

      <template v-if="!isLoading">
        <template v-if="proofReportData.length > 0">
          <div class="switch_container">
            <switch-tabs
              :tabs-data="deviceTabs"
              :value="activeDevice.toLowerCase()"
              @select-tab="selectDevice($event.key)"
            />

            <div class="tag_block" v-show="!isLoading">
              <div class="w-100 font-weight-bold mb-4">
                選擇網站/頻道
              </div>
              <Tag
                class="mr-1 mb-3"
                v-for="channel in currentChannels"
                :key="channel.id"
                :tagData="channel"
                :content="`${channel.siteName}/${channel.name}`"
                :isActive="channel.id === activeChannel.id"
                @onTagClick="selectChannel($event)"
              />

              <div class="w-100 d-flex flex-wrap">
                <div
                  class="w-100 font-weight-bold mt-4"
                  v-if="activeChannel.id"
                >
                  選擇版位
                </div>
                <Tag
                  class="mr-1 mt-3"
                  v-for="board in currentBoards"
                  :key="board.id"
                  :tagData="board"
                  :content="board.name"
                  @onTagClick="selectBoard($event)"
                />
              </div>
            </div>
          </div>

          <div class="channel_info">
            <span class="channel_info_title">頻道</span>
            <span class="channel_info_content"
              >{{ activeChannel.siteName }}/{{ activeChannel.name }}</span
            >
            <span
              ><a
                :href="
                  `${apiURL}api/proof/download?publishDate=${selectedDate}&channelId=${activeChannel.id}`
                "
                class="font-weight-bold"
              >
                <icon iconName="icon-download" />
                全部下載
              </a></span
            >
          </div>

          <div class="d-flex">
            <div
              v-if="!isLoading"
              class="board_container"
              :class="{ showLargeImage: selectedProof }"
            >
              <ProofsReportBlock
                :ref="`board_${key}`"
                v-for="(proofItems, key) in proofsByChannel"
                :key="key"
                :proofItems="proofItems"
                :publishDate="selectedDate"
              />
            </div>

            <transition name="fade">
              <div
                ref="large_image_container"
                v-if="!isLoading && selectedProof"
                class="large_image_container"
              >
                <div class="d-flex">
                  <icon
                    class="close_btn"
                    iconName="icon-delete-big"
                    alt="close_large_image"
                    @click.native="unselectProof"
                  />
                  <icon
                    class="arrow_left"
                    iconName="icon-arrow-left"
                    alt="previous_image"
                    :disabled="isPreviousImageDisabled"
                    @click.native="changeSelectedProof('prev')"
                  />
                  <icon
                    class="arrow_right"
                    iconName="icon-arrow-right"
                    alt="next_image"
                    :disabled="isNextImageDisabled"
                    @click.native="changeSelectedProof('next')"
                  />
                </div>
                <div>
                  <img class="image" :src="selectedProof" alt="" />
                </div>
              </div>
            </transition>
          </div>

          <GoTop />
        </template>

        <div v-else class="no_data">該條件目前無樣張</div>
      </template>
    </section>

    <Dialog
      @dialogConfirm="rerenderProofDialog = false"
      @dialogCancel="rerenderProofDialog = false"
      :isShow="rerenderProofDialog"
      :cancelButton="false"
      title="重新產生樣張"
      content="將重新產生樣張，請稍候"
    />
  </div>
</template>

<script>
import moment from "moment";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { MUTATIONS_TYPE } from "@/store/modules/proof";
import DatePicker from "@/components/DatePicker.vue";
import Loading from "@/components/Loading.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import Tag from "@/components/share/Tag.vue";
import ProofsReportBlock from "@/components/reportQuery/proofs/ProofsReportBlock.vue";
import GoTop from "@/components/GoTop.vue";
import { devices } from "@/utils/util.js";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import Dialog from "@/components/Dialog.vue";
import SingleDateSelector from "@/components/SingleDateSelector.vue";
import {
  stringifyObjQuery,
  stringifyAryQuery,
  parseObjQuery,
  parseAryQuery
} from "@/utils/queryString";

import {
  apiGetFilterCustomerSuggest,
  apiGetFilterProjectSuggest
} from "@/apis/report";

const FORMAT_STRING = "YYYY/MM/DD";

export default {
  name: "ProofsReport",
  components: {
    DatePicker,
    Loading,
    SelectDropdown,
    Tag,
    ProofsReportBlock,
    GoTop,
    SwitchTabs,
    Dialog,
    SingleDateSelector
  },
  data() {
    return {
      today: moment(),
      dateInterval: { start: "", end: "" },
      selectedDate: "",
      activeDevice: "PC",
      activeChannel: {},
      isLoading: false,
      selectedCompany: { name: "", id: 0 },
      selectedProject: [],
      searchedOptions: [],
      searchedProjects: [],
      isProjectLoaded: false,
      isSearched: false,
      hasPrev: true,
      datePickerDesignatedDate:
        process.env.VUE_APP_ENV === "production" ? "2021-09-14" : "2021-08-30",
      designatedDate:
        process.env.VUE_APP_ENV === "production" ? "2021/09/13" : "2021/08/30",
      devices,
      apiURL: `https:${process.env.VUE_APP_API_DOMAIN_URL}`,
      rerenderProofDialog: false
    };
  },
  computed: {
    ...mapState("proof", {
      selectedProof: state => state.selectedProof,
      currentBoardImages: state => state.currentBoardImages
    }),
    ...mapGetters("proof", ["proofReportData"]),
    showBoardContent() {
      return this.selectedDate && Object.keys(this.boardInfo).length > 0;
    },
    isSelectedProjectBlockShow() {
      return (
        this.isProjectLoaded &&
        this.dateInterval.start &&
        this.dateInterval.end &&
        this.selectedCompany.name &&
        this.selectedCompany.id
      );
    },
    isSearchEnable() {
      return this.selectedDate;
    },
    allProofDevices() {
      return [
        ...new Set(this.proofReportData.map(proofItem => proofItem.device))
      ];
    },
    deviceTabs() {
      return this.devices.map(item => {
        const disabled =
          this.allProofDevices.indexOf(item.key.toUpperCase()) === -1;
        return { ...item, disabled };
      });
    },
    currentChannels() {
      let tempData = this.proofReportData
        .filter(item => item.device === this.activeDevice)
        .map(item => {
          return {
            id: item.channelId,
            name: item.channelName,
            siteName: item.siteName
          };
        });

      return uniqBy(tempData, "id");
    },
    currentBoards() {
      let tempData = this.proofReportData
        .filter(
          item =>
            item.device === this.activeDevice &&
            item.channelId == this.activeChannel.id
        )
        .sort((a, b) => a.boardId - b.boardId)
        .map(item => {
          return {
            id: item.boardId,
            name: item.boardName,
            isCollapsed: false
          };
        });

      return uniqBy(tempData, "id");
    },
    proofsByChannel() {
      let temp = this.proofReportData
        .filter(
          item =>
            item.device === this.activeDevice &&
            item.channelId == this.activeChannel.id
        )
        .map(item => {
          return { ...item, isCollapsed: false };
        });

      return groupBy(temp, "boardId");
    },
    selectedProofIndex() {
      return this.currentBoardImages.indexOf(this.selectedProof);
    },
    isPreviousImageDisabled() {
      return this.selectedProofIndex <= 0;
    },
    isNextImageDisabled() {
      return (
        this.selectedProofIndex === -1 ||
        this.selectedProofIndex === this.currentBoardImages.length - 1
      );
    }
  },
  created() {
    this.initDate();
  },
  mounted() {
    if (this.$route.query.selectedDate) {
      this.dateInterval = parseObjQuery(this.$route.query.dateInterval);
      this.$refs["date_picker"].dateValue = [
        this.dateInterval.start,
        this.dateInterval.end
      ];
      this.selectedDate = this.$route.query.selectedDate;
      if (this.$route.query.selectedCompany) {
        this.selectedCompany = parseObjQuery(this.$route.query.selectedCompany);
        this.searchedProjects = parseAryQuery(
          this.$route.query.searchedProjects
        );
        this.selectedProject = this.$route.query.selectedProject?.split(",");
        this.isProjectLoaded = true;
      }

      this.activeDevice =
        this.$route.query.currentDevice || this.allProofDevices[0];
      this.activeChannel =
        parseObjQuery(this.$route.query.currentChannel) || {};
      this.getProof();
    }
  },
  watch: {
    selectedProof() {
      this.$nextTick(() => {
        this.$refs["large_image_container"]?.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }
  },
  methods: {
    ...mapActions("proof", ["getProofSnapshot"]),
    ...mapMutations("proof", {
      updateReportData: MUTATIONS_TYPE.UPDATE_PROOF_REPORT,
      unselectProof: MUTATIONS_TYPE.UNSELECT_PROOF,
      selectProof: MUTATIONS_TYPE.SELECT_PROOF
    }),
    initDate() {
      this.dateInterval = {
        end: this.today.format(FORMAT_STRING),
        start: moment()
          .startOf("isoweek")
          .format(FORMAT_STRING)
      };
      this.selectedDate = this.today.format(FORMAT_STRING);
    },
    getTime(time) {
      this.dateInterval.start = time.searchTimeStart;
      this.dateInterval.end = time.searchTimeEnd;
      this.selectedDate = this.dateInterval.start;
      this.selectedCompany = { name: "", id: 0 };
      this.selectedProject = [];
      this.selectedProjects = [];
    },
    handleChangeDateRange([start, end]) {
      const newStartDatePrevDate = moment(start).valueOf();
      this.hasPrev =
        moment(this.designatedDate).valueOf() < newStartDatePrevDate;
      this.changeDate(start);
      this.getProjectsSuggest();
    },
    changeDate(day) {
      this.selectedDate = day;
    },
    updateCurrentWeek(type) {
      const start = moment(this.dateInterval.start);
      const newWeek =
        type === "prev"
          ? start.clone().subtract(1, "weeks")
          : start.clone().add(1, "weeks");
      const newStartDate =
        newWeek.clone().startOf("isoweek") > this.today
          ? this.today
          : newWeek.clone().startOf("isoweek");
      const newEndDate =
        newWeek.clone().endOf("isoweek") > this.today
          ? this.today
          : newWeek.clone().endOf("isoweek");

      this.dateInterval.start = newStartDate.format(FORMAT_STRING);
      this.dateInterval.end = newEndDate.format(FORMAT_STRING);
      this.selectedDate = "";
      this.$refs["date_picker"].dateValue = [
        this.dateInterval.start,
        this.dateInterval.end
      ];

      this.selectedCompany = { id: 0, name: "" };
      this.searchedProjects = [];
      this.selectedProject = [];

      this.changeDate(this.dateInterval.start);
    },
    submit() {
      if (!this.selectedDate) return;

      let query = {
        dateInterval: stringifyObjQuery(this.dateInterval),
        selectedDate: this.selectedDate
      };

      if (this.selectedCompany.id) {
        query.selectedCompany = stringifyObjQuery(this.selectedCompany);

        if (this.searchedProjects.length > 0) {
          query.selectedProject = this.selectedProject.join(",");
          query.searchedProjects = stringifyAryQuery(this.searchedProjects);
        }
      }

      this.$router
        .push({
          path: "proofsReport",
          query
        })
        .catch(() => {});

      this.getProof();
    },
    async getProof() {
      let params = {
        publishDate: this.selectedDate
      };

      if (this.selectedCompany.id) params.customerId = this.selectedCompany.id;

      if (this.selectedProject?.length > 0)
        params.projectIdList = this.selectedProject.join("&projectIdList=");

      try {
        this.isLoading = true;
        this.isSearched = true;
        this.unselectProof();
        await this.getProofSnapshot(params);

        if (this.currentChannels.length === 0)
          this.activeDevice = this.allProofDevices[0];
        this.selectDevice(this.activeDevice);
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },

    async companySuggestSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        try {
          const {
            data: { response: responseData }
          } = await apiGetFilterCustomerSuggest({ keyword });
          this.searchedOptions = [...responseData].map(item => {
            return {
              ...item,
              value: item.id,
              label: `${item.name}(${item.id})`
            };
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    setSelectedCompany(companyId) {
      if (!companyId) {
        this.clearSelectedCompany();
        return;
      }

      const findVal = this.searchedOptions.find(
        option => option.id === companyId
      );
      if (!findVal) return;
      this.selectedCompany = {
        name: `${findVal.name}(${findVal.id})`,
        id: findVal.id
      };
      this.getProjectsSuggest();
    },
    async getProjectsSuggest() {
      this.isProjectLoaded = false;
      try {
        const {
          data: { response: responseData }
        } = await apiGetFilterProjectSuggest({
          customerId: this.selectedCompany.id,
          start: this.dateInterval.start,
          end: this.dateInterval.end
        });
        this.selectedProject = [];
        this.searchedProjects = [...responseData];
        this.isProjectLoaded = true;
      } catch (error) {
        console.log(error);
      }
    },
    clearSelectedCompany() {
      this.selectedCompany = { name: "", id: 0 };
      this.searchedOptions = [];
    },
    selectDevice(device) {
      if (!device) return;
      device = device.toUpperCase();
      if (this.allProofDevices.indexOf(device) === -1) {
        this.activeDevice = "PC";
      } else {
        this.activeDevice = device;
      }
      this.$router
        .push({
          path: "proofsReport",
          query: {
            ...this.$route.query,
            currentDevice: this.activeDevice
          }
        })
        .catch(() => {});

      this.selectChannel(this.activeChannel);
    },
    selectChannel(channel) {
      if (
        channel &&
        this.currentChannels.some(channelItem => channelItem.id === channel.id)
      )
        this.activeChannel = channel;
      else this.activeChannel = this.currentChannels[0];

      if (this.activeChannel?.id) {
        this.$router
          .push({
            path: "proofsReport",
            query: {
              ...this.$route.query,
              currentChannel: stringifyObjQuery(this.activeChannel)
            }
          })
          .catch(() => {});
      }
    },
    selectBoard(board) {
      const el = document.querySelector(`#board_${board.id}`);
      if (!el) return;

      this.$refs[`board_${board.id}`][0].openCollaspe();
      this.$nextTick(function() {
        window.scrollTo({
          top: el.offsetTop - 70,
          behavior: "smooth"
        });
      });
    },
    changeSelectedProof(type) {
      if (
        (type === "prev" && this.isPreviousImageDisabled) ||
        (type === "next" && this.isNextImageDisabled)
      )
        return;

      const index =
        type === "prev"
          ? this.selectedProofIndex - 1
          : this.selectedProofIndex + 1;

      this.selectProof(this.currentBoardImages[index]);
    }
  }
};
</script>

<style lang="scss" scoped>
.proofs_report_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 1.33px;
  color: #333;
  margin-bottom: 16px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.wrapper {
  line-height: 1.38;
  letter-spacing: 1.38px;
  margin-bottom: 24px;

  .ad_date,
  .ad_interval,
  .ad_company,
  .ad_project {
    // display: flex;
    // align-items: center;

    label {
      width: 70px;
      margin-right: 28px;
      margin-bottom: 28px;
    }

    .input {
      display: inline-block;
      width: 480px;
    }

    .project_block {
      margin: 20px 0;

      p {
        color: #ea475b;
      }

      .project_item {
        height: 24px;

        label {
          width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          display: inline-block;
          font-weight: normal;
          color: #000;
          margin-right: 19px;
          margin-bottom: 12px;
        }
      }
    }
  }

  .button_block {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  .channel_info {
    padding-top: 16px;
    margin-bottom: 30px;

    .channel_info_title {
      font-weight: bold;
      color: #333;
      margin-right: 16px;
    }

    .channel_info_content {
      margin-right: 16px;
    }
  }

  .board_container {
    width: 1180px;
    transition: width 1s;

    &.showLargeImage {
      width: 700px;
    }
  }

  .large_image_container {
    background-color: #f5f5f5;
    width: 580px;
    height: 90vh;
    margin-left: 40px;
    border: 1px dashed #d8d8d8;
    position: sticky;
    top: 70px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 16px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ddd;
      border-radius: 10px;
      border: 4px solid #f5f5f5;
      background-clip: padding-box;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }

    > div:nth-child(1) {
      position: sticky;
      top: 24px;
    }

    > div:nth-child(2) {
      padding: 64px 40px 40px;
    }

    %icon_base {
      position: absolute;
      cursor: pointer;
    }

    img.close_btn {
      @extend %icon_base;
      left: 16px;
    }

    img.arrow_left {
      @extend %icon_base;
      right: 52px;

      &.disabled {
        cursor: not-allowed;
      }
    }

    img.arrow_right {
      @extend %icon_base;
      right: 24px;

      &.disabled {
        cursor: not-allowed;
      }
    }

    img.image {
      width: 100%;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    width: 0;
    height: 0;
    margin-left: 0;
    padding: 0;
  }

  .switch_container {
    .tag_block {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 24px;
    }
  }

  .no_data {
    text-align: center;
    color: #ea475b;
  }
}
</style>
