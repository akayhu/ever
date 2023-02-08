<template>
  <div>
    <div class="maintain_wrapper_title">企業資料維護</div>
    <section>
      <SwitchTabs
        :tabsData="tabData"
        :value="currentTabType"
        @select-tab="changeSelectTab($event)"
      />

      <!-- 網頁曝光職缺設定 -->
      <template v-if="currentTabType.key === 'job_setting'">
        <WebExposureJobSetting />
      </template>

      <template v-if="currentTabType.key === 'activity_query'">
        <ActivityPageExposureSearchTop />
      </template>
    </section>

    <!-- 活動頁曝光查詢 -->
    <template v-if="currentTabType.key === 'activity_query'">
      <section v-if="isTableShow" ref="maintain_query_table" class="mt-6">
        <ActivityPageExposureSearchContent @pageChange="onPageChange" />
      </section>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, toRefs } from "vue";
import { useRoute } from "@/router/useRoute.js";
import { useMaintainStore } from "@/stores/maintain.js";
import WebExposureJobSetting from "@/components/maintain/WebExposureJobSetting.vue";
import ActivityPageExposureSearchTop from "@/components/maintain/ActivityPageExposureSearchTop.vue";
import ActivityPageExposureSearchContent from "@/components/maintain/ActivityPageExposureSearchContent.vue";
import SwitchTabs from "@/components/share/SwitchTabs";

const tabData = [
  {
    key: "job_setting",
    value: "job_setting",
    label: "網頁曝光職缺設定"
  },
  {
    key: "activity_query",
    value: "activity_query",
    label: "活動頁曝光查詢"
  }
];

export default {
  components: {
    WebExposureJobSetting,
    ActivityPageExposureSearchTop,
    ActivityPageExposureSearchContent,
    SwitchTabs
  },
  setup() {
    const { route, router } = useRoute();
    const maintainStore = useMaintainStore();
    const { currentTab, activityData } = toRefs(maintainStore);
    const getCurrentTab = computed(() => currentTab.value);
    const isTableShow = computed(() => activityData.value.firstGetData);
    const currentTabType = ref(tabData[0]);
    const maintain_query_table = ref(null);

    // 切換頁籤
    const changeSelectTab = tab => {
      router.push({ query: {} }).catch(() => {});
      currentTabType.value = tab;
    };

    const onPageChange = () => {
      const headerAndNavHegiht = 70;
      const margin = 20;
      const top =
        maintain_query_table.value.getBoundingClientRect().top +
        window.pageYOffset -
        (headerAndNavHegiht + margin);
      window.scrollTo({ top });
    };

    onMounted(() => {
      if (route.query?.currentTab) {
        route.query.currentTab === "job_setting"
          ? (currentTabType.value = tabData[0])
          : (currentTabType.value = tabData[1]);
      } else {
        currentTabType.value =
          getCurrentTab.value === "job_setting" ? tabData[0] : tabData[1];
      }
    });

    return {
      tabData,
      currentTabType,
      changeSelectTab,
      getCurrentTab,
      onPageChange,
      maintain_query_table,
      isTableShow
    };
  }
};
</script>

<style lang="scss" scoped>
.maintain_wrapper_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 32px;
  color: #333;
  margin-bottom: 16px;
}
</style>
