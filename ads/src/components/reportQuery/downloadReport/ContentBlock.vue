<template>
  <section>
    <SwitchTabs
      class="d-flex align-items-center"
      :tabsData="tabData"
      :value="currentTab"
      @select-tab="changeSelectTab($event)"
    >
      <span class="warning">報表數據僅保存一月。</span>
    </SwitchTabs>

    <Loading v-if="isLoading" />

    <div v-else class="table_wrapper">
      <div class="table_header">
        <div class="header_company">企業</div>
        <div class="header_project">專案</div>
        <div class="header_period">數據區間</div>
        <div class="header_createDate">產生時間</div>
        <div class="header_account">人員</div>
        <div class="header_status">可下載類型</div>
      </div>

      <div
        v-for="item in tableData"
        :key="item.id"
        class="table_body"
        :class="{ active: item.id == route.query.id }"
      >
        <div class="body_company">
          <TdFullText placement="right">{{ item.customerName }}</TdFullText>
        </div>
        <div class="body_project">
          <TdFullText placement="right">{{ item.projectName }}</TdFullText>
        </div>
        <div class="body_period">
          {{ `${item.startDate}～${item.endDate}` }}
        </div>
        <div class="body_createDate">
          <span
            v-tooltip="{
              placement: 'right',
              offset: 5,
              content: item.createDate,
              trigger: 'hover'
            }"
            >{{ item.createDate | timeLabel }}</span
          >
        </div>
        <div class="body_account">
          <TdFullText placement="right">{{ item.accountName }}</TdFullText>
        </div>
        <div class="body_status">
          <span v-if="item.status === 0">
            <Loading size="22" class="mr-1" />
            資料處理中
          </span>
          <span v-else>
            <a
              v-if="currentTab.key === '2'"
              :href="`${downloadLink}${item.id}`"
            >
              <icon iconName="icon-download" class="mr-1" />{{
                item.onlyFocus
                  | jobApplyStatusCompletedLabel(item.jobApplyReportType)
              }}{{ item.extension }}
            </a>
            <a v-else :href="`${downloadLink}${item.id}`">
              <icon iconName="icon-download" class="mr-1" />{{
                item.extension | statusCompletedLabel(item.byMaterial)
              }}
            </a>
          </span>
        </div>
      </div>

      <div v-if="tableData.length === 0" class="no_result">
        無符合資料，請切換條件！
      </div>

      <Pages
        v-if="tableData.length > 0"
        class="pagination"
        :pageData="pageData"
        :reloadPage="false"
        :isUsedEmit="true"
        @pageChange="({ page }) => changePages(page)"
      />
    </div>
  </section>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "@/router/useRoute.js";
import { useDownloadReportStore } from "@/stores/report/download.js";
import SwitchTabs from "@/components/share/SwitchTabs.vue";
import TdFullText from "@/components/share/TdFullText.vue";
import Loading from "@/components/Loading.vue";
import Pages from "@/components/Pages.vue";

export default {
  components: {
    SwitchTabs,
    TdFullText,
    Loading,
    Pages
  },
  filters: {
    timeLabel(value) {
      if (!value) return "";
      value = value.toString();
      return value.split(" ")[1];
    },
    statusCompletedLabel(extension, isByMaterial) {
      return extension === "csv"
        ? isByMaterial
          ? "分素材csv"
          : "不分素材csv"
        : "xlsx";
    },
    jobApplyStatusCompletedLabel(onlyFocus, jobApplyReportType) {
      let jobType = onlyFocus ? "重點職缺" : "全部職缺";
      let dateType = {
        1: "日",
        2: "週",
        3: "區間",
        4: "專案"
      };
      return `${jobType}(${dateType[jobApplyReportType]})`;
    }
  },
  setup() {
    const { route } = useRoute();
    const downloadStore = useDownloadReportStore();

    let tabData = ref([
      { key: "1", label: "廣告數據" },
      { key: "2", label: "主應數據" }
    ]);
    const currentTab = computed(() => downloadStore.routeQuery.currentTab);
    const pageData = computed(() => downloadStore.pageData);
    const isLoading = computed(() => downloadStore.isLoading);
    const tableData = computed(() => downloadStore.tableData);
    const downloadLink = computed(
      () =>
        `https:${process.env.VUE_APP_API_DOMAIN_URL}api/report/file/download/report-file/`
    );

    onMounted(() => {
      if (route.query.tabType && route.query.tabType === "Jobapply")
        downloadStore.routeQuery.currentTab = { key: "2", label: "主應數據" };
    });

    // 切換頁籤
    const changeSelectTab = tab => {
      downloadStore.routeQuery.currentTab = tab;
      downloadStore.pageData.page = 1;
      getData();
    };

    // 切換頁碼
    const changePages = page => {
      downloadStore.pageData.page = page;
      getData();
    };

    // 取列表資料
    const getData = async () => {
      await downloadStore.getTableDate();
      downloadStore.fetchData();
    };

    return {
      route,
      tabData,
      currentTab,
      pageData,
      isLoading,
      tableData,
      downloadLink,
      changeSelectTab,
      changePages
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/report/table";

$table_width_config: (
  company: 196px,
  project: 270px,
  period: 250px,
  createDate: 130px,
  account: 110px,
  status: 204px
);

.warning {
  width: 174px;
  height: 22px;
  margin-left: 38px;
  @include font-common(16px, $font-weight-bold, $invalid);
}

.table_wrapper {
  @include table_width($table_width_config);

  .table_header {
    display: flex;
    align-items: center;
    @include font-common(16px, $font-weight-bold);
    margin-top: -8px;
    padding-bottom: 16px;
    border-bottom: 1px solid $border-color;

    > div {
      padding: 0 12px;
    }

    .header_account {
      display: flex;
      align-items: center;
    }
  }

  .table_body {
    display: flex;
    align-items: center;
    padding: 13px 0;
    border-bottom: 1px solid $border-color;

    &.active,
    &:hover {
      background-color: $blue-lake-light;
    }

    > div {
      padding: 0 12px;
    }

    & a {
      display: flex;
      align-items: center;
    }

    .body_status {
      display: flex;
      align-items: center;

      > span {
        display: flex;
        align-items: center;

        > a {
          display: flex;
          align-items: flex-start;

          img {
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  .no_result {
    @include font-common(16px, $font-weight-normal, $red);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    position: relative;
  }

  .pagination {
    margin-top: 24px;
  }
}
</style>
