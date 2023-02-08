<template>
  <section class="web_list_table">
    <h2>網站維護</h2>

    <switch-tabs
      :tabs-data="deviceTab"
      :value="deviceNav"
      @select-tab="changeDeviceNavTab($event.key)"
    />

    <div v-if="getListLoading" class="loading">
      <Loading />
    </div>

    <div v-if="siteItems.length < 1 && !getListLoading" class="no_data">
      無 {{ deviceNav }} 網站列表資料
    </div>

    <div v-if="siteItems.length > 0 && !getListLoading" class="web_list_title">
      <div>網站名稱</div>
      <div>頻道名稱</div>
      <div>版位名稱</div>
      <div>版位編號</div>
      <div>
        <span @click="changeSort" class="status">
          狀態<img src="@/assets/icon/icon-move.svg" />
        </span>
      </div>
      <div>廣告代碼</div>
      <div>編輯</div>
    </div>

    <div v-if="!getListLoading">
      <WebListSite
        v-for="(item, index) in siteItems"
        :item="item"
        :itemIndex="index"
        :key="index"
        :sort="sort"
        :openADCodeDialogFunc="openADCodeDialogFunc"
      />
    </div>

    <Pages
      v-if="siteItems.length > 0"
      :pageData="siteList"
      :displayActionQuery="{ device: deviceNav }"
      path="weblist"
      class="mt-6"
    />

    <div class="bottom_create_block">
      <button
        v-if="getUserAuthority.webSiteEdit"
        @click="createWeb"
        class="button_bg_white_large"
      >
        + 新增網站
      </button>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import WebListSite from "./WebListSite.vue";
import Loading from "@/components/Loading.vue";
import Pages from "@/components/Pages.vue";
import SwitchTabs from "@/components/SwitchTabs.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useSiteStore } from "@/storesPinia/site.js";

export default defineComponent({
  name: "WebsiteMaintenance",
  components: {
    WebListSite,
    Loading,
    Pages,
    SwitchTabs
  },
  props: {
    changeWebSiteList: {
      type: Function
    },
    changePropsSort: {
      type: Function
    },
    changePropsDeviceNav: {
      type: Function
    },
    createWeb: {
      type: Function
    },
    deviceNav: {
      type: String
    },
    openADCodeDialogFunc: {
      type: Function
    }
  },
  setup(props) {
    const router = useRouter();
    const userStore = useUserStore();
    const siteStore = useSiteStore();
    const { user } = storeToRefs(userStore);
    const { siteList } = storeToRefs(siteStore);
    const { clearSite } = siteStore;
    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const siteItems = computed(() => siteList.value.content);
    const getListLoading = computed(() => siteList.value.loading);
    let sort = ref("status_desc");
    let loading = ref(false);
    let deviceTab = ref([
      {
        key: "PC",
        label: "PC"
      },
      {
        key: "APP",
        label: "APP"
      },
      {
        key: "MOBILE",
        label: "MOBILE"
      }
    ]);

    // 切換 tab
    const changeDeviceNavTab = vehicle => {
      router.push({ query: { device: vehicle } }).catch(() => {});
      clearSite();
      props.changePropsDeviceNav(vehicle);
      nextTick(() => {
        getWebSiteList();
      });
    };

    // 變更排序
    const changeSort = () => {
      sort.value === "status_desc"
        ? (sort.value = "status_asc")
        : (sort.value = "status_desc");
      props.changePropsSort(sort.value);
      getWebSiteList();
    };

    // 取列表資料
    const getWebSiteList = () => {
      props.changeWebSiteList();
    };

    return {
      siteList,
      sort,
      loading,
      deviceTab,
      getUserAuthority,
      siteItems,
      getListLoading,
      changeDeviceNavTab,
      changeSort
    };
  }
});
</script>

<style lang="scss" scoped>
.web_list_table {
  h2 {
    margin-bottom: 24px;
  }

  .web_list_title {
    display: grid;
    grid-template-columns: 232px 290px 240px 134px 94px 94px 94px;

    > div {
      font-weight: bold;
      letter-spacing: 1px;
      padding: 16px 0 16px 12px;
      border-bottom: 1px solid #d6d6d6;

      &:nth-child(5) {
        cursor: pointer;
      }
    }
  }

  .loading {
    text-align: center;
    margin: 150px 0;
  }

  .no_data {
    text-align: center;
    color: #a9a9a9;
    font-size: 20px;
    margin: 150px 0;
  }

  .bottom_create_block {
    text-align: right;
    margin-top: 24px;
  }
}

.mt-6 {
  margin-top: 24px;
}
</style>
