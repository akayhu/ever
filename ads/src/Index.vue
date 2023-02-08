<template>
  <div id="app">
    <Header v-if="!$route.meta?.hideHeader" />
    <article
      v-if="isRouterAlive"
      :class="{ full_page_preview: $route.meta?.hideHeader }"
    >
      <router-view :key="$route.name" />
    </article>
    <Footer v-if="!$route.meta?.hideFooter" />
    <Dialog
      @dialogConfirm="closeFunc"
      @dialogCancel="closeFunc"
      :isShow="openErrorDialog"
      :content="errorDialogContent"
      componentKey="openErrorDialog"
      :cancelButton="false"
      title="錯誤"
    />
    <LoadingPage v-if="showLoading" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { mapGetters } from "vuex";
import Dialog from "@/components/Dialog.vue";
import { EventBus } from "@/utils/eventBus.js";
import LoadingPage from "@/components/LoadingPage";
export default {
  name: "Index",
  data() {
    return {
      isLoading: true,
      showLoading: false,
      isRouterAlive: true,
      openErrorDialog: false,
      errorDialogContent: ""
    };
  },
  components: {
    Header,
    Footer,
    Dialog,
    LoadingPage
  },
  computed: {
    ...mapGetters("user", ["getUserStatus"]),
    ...mapGetters("order", ["order"]),
    getRouterPath() {
      return this.$route.path;
    }
  },
  created() {
    EventBus.$on("openErrorDialog", resError => {
      this.errorDialogContent = resError.data.warning.desc;
      this.openErrorDialog = true;
    });
    EventBus.$on("loadingShow", () => {
      this.showLoading = true;
    });
    EventBus.$on("loadingHide", () => {
      this.showLoading = false;
    });
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    // 關閉 Dialog
    closeFunc() {
      this.errorDialogContent = "";
      this.openErrorDialog = false;
    }
  }
};
</script>

<style lang="scss">
@import "~scss/ads";
@import "~scss/component/variables";
</style>

<style lang="scss" scoped>
article {
  min-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 32px);
  padding-top: 70px;

  &.full_page_preview {
    padding-top: 0;
    width: max-content;
  }
}
</style>
