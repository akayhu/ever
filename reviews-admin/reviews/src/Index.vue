<template>
  <div>
    <Header :class="{ 'd-none': noHeaderPage, 'd-md-block': noHeaderPage }" />
    <div class="preset-height" :class="{ noHeaderPage: noHeaderPage }">
      <router-view v-if="isRouterAlive" />
    </div>
    <Footer
      v-if="!getUi.isSealingStation && !getAnnouncementConfig"
      class="d-none d-md-block"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { EventBus } from "@/utils/eventBus.js";
import router from "@/layouts/defaultLayout";

export default {
  name: "Home",
  data() {
    return {
      isRouterAlive: true
    };
  },
  created() {
    EventBus.$on("showFooter", () => {
      this.formFooterBlackBar("show");
    });
  },
  // 因只要到發表評論頁就要先隱藏 footer 再打開，
  // 故不取消監聽 EventBus，不然第一次打開 footer 出後
  // 第二次之後就不會在隱藏打開了
  // beforeDestroy() {
  //   EventBus.$off("showFooter");
  // },
  mounted() {
    // 顯示 footer 黑 bar
    if (router.history.current.name !== "formReview") {
      this.formFooterBlackBar("show");
    } else {
      this.formFooterBlackBar("hide");
    }
  },
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapGetters("ui", ["getUi"]),
    getAnnouncementConfig() {
      return (
        window.reviewsAnnouncement &&
        window.reviewsAnnouncement.openAnnouncement
      );
    },
    noHeaderPage() {
      let pages = ["singleReview", "singleVote"];
      return pages.indexOf(this.$route.name) > -1;
    }
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  watch: {
    $route(to, from) {
      router.history.current.name !== "formReview"
        ? this.formFooterBlackBar("show")
        : this.formFooterBlackBar("hide");
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    formFooterBlackBar(type) {
      let hasFooterBlackBar = false;
      let timeoutIntervalFooterBlackBar = setInterval(() => {
        let footerScoper = document.querySelector(".app-footer-scoper");
        let footerblackBar = document.querySelector("#app-footer");
        if (footerScoper && footerblackBar && !hasFooterBlackBar) {
          if (type === "show") {
            footerScoper.style.display = "block";
            footerblackBar.style.display = "block";
          } else {
            footerScoper.style.display = "none";
            footerblackBar.style.display = "none";
          }
          hasFooterBlackBar = true;
          if (hasFooterBlackBar) clearInterval(timeoutIntervalFooterBlackBar);
        }
      }, 300);
    }
  }
};
</script>

<style lang="scss">
@import "~scss/reviews";
@import "~scss/switch-button";
@import "~scss/rating-star";
@import "~scss/element-ui-input";

/* 共用 css */
body {
  min-width: 360px;
  font-family: Arial, "微軟正黑體", "Microsoft JhengHei", Roboto, "PingFangTC",
    sans-serif;
  font-size: 14px !important;
}
.app-footer-scoper {
  display: none;
  margin-top: 40px;

  @include media-breakpoint-up(md) {
    margin-top: 0;
  }
}
.el-tooltip__popper {
  padding: 6px 12px !important;
  &[x-placement^="top"] {
    margin-bottom: 6px !important;
  }
}
.v-modal {
  background: #292929;
  opacity: 0.16;
}
.container-rwd {
  min-width: auto;
  max-width: 100%;
  @include media-breakpoint-up(md) {
    max-width: map-get($container-max-widths, "md");
  }
  @include media-breakpoint-up(lg) {
    max-width: map-get($container-max-widths, "lg");
  }
  @include media-breakpoint-up(xl) {
    max-width: map-get($container-max-widths, "xl");
  }
}
.paddingX-rwd {
  padding-right: 16px;
  padding-left: 16px;
  @include media-breakpoint-up(md) {
    padding-right: 24px;
    padding-left: 24px;
  }
  @include media-breakpoint-up(lg) {
    padding-right: 40px;
    padding-left: 40px;
  }
  @include media-breakpoint-up(xl) {
    padding-right: 64px;
    padding-left: 64px;
  }
}
.footer-placeholder {
  height: 68px;
  display: none;
  @include support-ie {
    display: block;
    @include media-breakpoint-up(md) {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "~scss/reviews";
.preset-height {
  min-height: calc(100vh - 88px);
  &.noHeaderPage {
    min-height: calc(100vh - 44px);
  }
  @include media-breakpoint-up(md) {
    min-height: calc(100vh - 380px);
  }
}
</style>
