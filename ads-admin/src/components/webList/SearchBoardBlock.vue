<template>
  <section class="web_list_search_main">
    <h2>查詢版位</h2>
    <div class="web_list_search">
      <div>
        <span>載具</span>
        <span class="device">
          <el-select
            v-model="searchDevice"
            @change="handleSearchDevice"
            placeholder="請選擇"
          >
            <el-option label="PC" value="PC"></el-option>
            <el-option label="APP" value="APP"></el-option>
            <el-option label="Mobile" value="MOBILE"></el-option>
          </el-select>
        </span>
      </div>
      <div class="web_list_site">
        <span>網站</span>
        <SelectDropdown
          @value-changed="setSelectedSite($event)"
          :value="siteData.siteName"
          :options="siteData.searchedSiteOptions"
          :filterable="true"
          :optionsAllData="true"
          :placeholder="
            siteData.searchedSiteOptions.length < 1
              ? '請先選擇載具---'
              : '請選擇----'
          "
          :disabled="!searchDevice"
        />
      </div>
      <div class="web_list_channel">
        <span>頻道</span>
        <SelectDropdown
          @value-changed="setSelectedChannel($event)"
          :value="channelData.channelName"
          :options="channelData.searchedChannelOptions"
          :filterable="true"
          :optionsAllData="true"
          :placeholder="
            channelData.searchedChannelOptions.length < 1
              ? '請先選擇網站---'
              : '請選擇----'
          "
          :disabled="!siteData.siteName"
        />
      </div>
    </div>
    <div class="search_button">
      <button @click="searchLayout" class="button_bg_blue_small">查詢</button>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import SelectDropdown from "@/components/SelectDropdown.vue";
import { useSiteStore } from "@/storesPinia/site.js";
import { useChannelStore } from "@/storesPinia/channel.js";

export default defineComponent({
  name: "SearchBoardBlock",
  components: {
    SelectDropdown
  },
  props: {
    changePropsDeviceNav: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    const route = useRoute();
    const siteStore = useSiteStore();
    const channelStore = useChannelStore();
    const { getSiteMenu } = siteStore;
    const { getChannelMenu } = channelStore;
    const router = useRouter();
    let searchDevice = ref("");
    let siteData = ref({
      siteName: "",
      siteId: "",
      searchedSiteOptions: []
    });
    let channelData = ref({
      channelName: "",
      channelId: "",
      searchedChannelOptions: []
    });

    // 取網站列表資料
    const getSiteMenuList = query => {
      getSiteMenu(query).then(siteItem => {
        siteData.value.searchedSiteOptions = siteItem.content.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
      });
    };

    // 取頻道列表資料
    const getChannelMenuList = query => {
      getChannelMenu(query).then(channelItem => {
        channelData.value.searchedChannelOptions = channelItem.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
      });
    };

    // 清除載具資料
    const clearSiteDate = () => {
      siteData.value.siteName = "";
      siteData.value.siteId = "";
      siteData.value.searchedSiteOptions = [];
    };

    // 清除頻道資料
    const clearChannelData = () => {
      channelData.value.channelName = "";
      channelData.value.channelId = "";
      channelData.value.searchedChannelOptions = [];
    };

    // 選取載具
    const handleSearchDevice = () => {
      const siteMenuQuery = {
        page: 1,
        size: 100,
        status: true,
        device: searchDevice.value
      };
      clearSiteDate();
      clearChannelData();
      getSiteMenuList(siteMenuQuery);
    };

    // 網站 Autocomplete
    const setSelectedSite = data => {
      if (!!data) {
        siteData.value.siteName = siteData.value.searchedSiteOptions.find(
          option => option.name === data.name
        ).name;
        siteData.value.siteId = siteData.value.searchedSiteOptions.find(
          option => option.name === data.name
        ).id;

        clearChannelData();
        getChannelMenuList({ siteId: siteData.value.siteId, status: true });
      }
    };

    // 頻道 Autocomplete
    const setSelectedChannel = data => {
      if (!!data) {
        channelData.value.channelName =
          channelData.value.searchedChannelOptions.find(
            option => option.name === data.name
          ).name;
        channelData.value.channelId =
          channelData.value.searchedChannelOptions.find(
            option => option.name === data.name
          ).id;
      }
    };

    // 查詢送出
    const searchLayout = () => {
      const query = {
        device: searchDevice.value,
        siteId: siteData.value.siteId,
        siteKeyword: siteData.value.siteName,
        channelId: channelData.value.channelId,
        channelKeyword: channelData.value.channelName
      };

      if (!channelData.value.channelName) delete query.channelKeyword;
      props.changePropsDeviceNav(searchDevice.value);
      router.push({ query }).catch(() => {});
    };

    const routeQuery = route.query;
    const siteMenuQuery = {
      page: 1,
      size: 100,
      status: true,
      device: routeQuery.device
    };

    if (routeQuery.device) {
      searchDevice.value = routeQuery.device;
      getSiteMenuList(siteMenuQuery);
      props.changePropsDeviceNav(routeQuery.device);
    }

    if (routeQuery.siteId) {
      siteData.value.siteId = routeQuery.siteId;
      getChannelMenuList({ siteId: routeQuery.siteId, status: true });
    }

    if (routeQuery.siteKeyword)
      siteData.value.siteName = routeQuery.siteKeyword;

    if (routeQuery.channelKeyword)
      channelData.value.channelName = routeQuery.channelKeyword;

    if (routeQuery.channelId)
      channelData.value.channelId = routeQuery.channelId;

    return {
      searchDevice,
      siteData,
      channelData,
      clearSiteDate,
      clearChannelData,
      handleSearchDevice,
      setSelectedSite,
      setSelectedChannel,
      searchLayout
    };
  }
});
</script>

<style>
.web_list_site .el-select,
.web_list_channel .el-select {
  width: 260px;
}
</style>
<style lang="scss" scoped>
.web_list_search_main {
  h2 {
    margin-bottom: 24px;
  }

  .web_list_search {
    display: flex;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #333;

    div {
      display: flex;
      align-items: center;

      &:nth-child(1) {
        span {
          margin-right: 28px;
          width: 34px;

          &:nth-child(2) {
            width: 122px;
          }
        }
      }
      &:nth-child(2) {
        margin-right: 14px;

        span {
          margin-right: 28px;
          width: 34px;
        }
      }
      &:nth-child(3) {
        margin-right: 0;

        span {
          margin-right: 28px;
          width: 34px;
        }
      }
    }
  }

  .search_button {
    text-align: center;
    margin-top: 24px;
  }
}
</style>
