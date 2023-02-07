<template>
  <header class="bg-white">
    <div
      class="container-rwd h-100 mx-auto d-flex justify-content-center align-items-center justify-content-md-between"
    >
      <div class="header-nav d-flex align-items-center">
        <h1 class="mr-md-10" title="104公司評論" v-once>
          <router-link
            to="/"
            rel="noopener noreferrer"
            title="104公司評論－匿名員工評論，翻轉職場生態"
            v-if="!getAnnouncementConfig"
          >
            <img
              class="d-block"
              :src="getLogo"
              title="104公司評論－匿名員工評論，翻轉職場生態"
              alt="104公司評論"
              data-gtm-head="logo"
            />
          </router-link>
          <img
            class="d-block"
            :src="getLogo"
            title="104公司評論－匿名員工評論，翻轉職場生態"
            alt="104公司評論"
            data-gtm-head="logo"
            v-if="getAnnouncementConfig"
          />
        </h1>
        <ul class="header-nav-ul d-none d-md-flex">
          <li
            class="text-center font-weight-bold px-4"
            :class="{
              focus: reviewFocusRouter.indexOf(getUi.routerHistoryName) > -1
            }"
            @click="jump('/reviews')"
            data-gtm-head="匿名評論"
          >
            匿名評論
          </li>
          <li
            class="text-center font-weight-bold px-4"
            :class="{
              focus: voteFocusRouter.indexOf(getUi.routerHistoryName) > -1
            }"
            @click="jump('/votes')"
            data-gtm-head="匿名投票"
          >
            匿名投票
          </li>
          <li
            class="text-center font-weight-bold px-4"
            :class="{
              focus: boardFocusRouter.indexOf(getUi.routerHistoryName) > -1
            }"
            @click="jump('/top')"
            data-gtm-head="評比排行榜"
          >
            評比排行榜
            <span></span>
          </li>
        </ul>
      </div>
      <div class="header-btn-group d-none d-md-block">
        <jumbotron-btn
          class="jumbotron-btn"
          class-name="btn-outline-primary"
          left-btn-text="發起投票"
          right-btn-text="發表公司評價"
          path="/form/vote"
          gtmPosition="head"
          data-gtm-left="發起投票"
          data-gtm-right="發表公司評價"
          :has-left-btn="hasLeftBtn"
        />
      </div>
    </div>
    <div class="header-menu d-md-none" @click="mobileWebMenuShow = true">
      <img src="@/assets/menu.svg" />
    </div>
    <div class="header-login d-md-none my-2 mx-4 t3 font-weight-bold">
      <span v-if="userLoginStatus !== 2" @click="clickLogin">登入</span>
      <img
        v-else-if="headShot"
        class="userAvatar rounded-circle d-block"
        :src="headShot"
        @click="mobileUserMenuShow = true"
      />
      <img
        v-else
        class="userAvatar rounded-circle d-block"
        src="../assets/deer.png"
        @click="mobileUserMenuShow = true"
      />
    </div>

    <MobileWebMenu
      :isShow="mobileWebMenuShow"
      :closeCallback="closeMobileWebMenu"
    />
    <MobileUserMenu
      :isShow="mobileUserMenuShow"
      :closeCallback="closeMobileUserMenu"
    />
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { commonMixins } from "@/mixins/commonMixins";
import { login, headShot } from "@/apis/user";
import JumbotronBtn from "@/components/BtnGroup.vue";
import MobileWebMenu from "@/components/MobileWebMenu.vue";
import MobileUserMenu from "@/components/MobileUserMenu.vue";

export default {
  name: "Header",
  components: {
    JumbotronBtn,
    MobileWebMenu,
    MobileUserMenu
  },
  data() {
    return {
      reviewFocusRouter: ["reviews", "search", "formReview", "singleReview"],
      voteFocusRouter: ["votes", "formVote", "singleVote"],
      boardFocusRouter: ["leaderBoard", "compare"],
      hasLeftBtn: false,
      mobileWebMenuShow: false,
      mobileUserMenuShow: false,
      headShot: null
    };
  },
  mixins: [commonMixins],
  mounted() {
    // 直衝網址
    const routerCurrentName = this.$router.history.current.name;
    this.routerCheck(routerCurrentName);

    // 封站
    if (routerCurrentName === "sealingStation") {
      const leftContent = document.querySelector(".header-nav_ul");
      const rightContent = document.querySelector(".header-btn-group");
      leftContent.parentNode.removeChild(leftContent);
      rightContent.parentNode.removeChild(rightContent);
    }
  },
  computed: {
    ...mapGetters("ui", ["getUi"]),
    ...mapGetters("user", ["userLoginStatus"]),
    getAnnouncementConfig() {
      return (
        (window.reviewsAnnouncement &&
          window.reviewsAnnouncement.openAnnouncement) ||
        false
      );
    },
    getLogo() {
      return `https:${process.env.VUE_APP_STATIC_URL}reviews/logo.png`;
    }
  },
  methods: {
    clickLogin() {
      login(this.$route.path);
    },
    routerCheck(routerName) {
      if (
        routerName === "reviews" ||
        routerName === "votes" ||
        routerName === "formVote" ||
        routerName === "formReview" ||
        routerName === "singleVote"
      ) {
        this.hasLeftBtn = true;
      } else {
        this.hasLeftBtn = false;
      }
    },
    closeMobileWebMenu() {
      this.mobileWebMenuShow = false;
    },
    closeMobileUserMenu() {
      this.mobileUserMenuShow = false;
    }
  },
  watch: {
    // 換頁
    $route(to, from) {
      this.routerCheck(to.name);
    },
    userLoginStatus(val) {
      if (val === 2) {
        headShot().then(res => {
          this.headShot = res.data.response;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

header {
  position: sticky;
  top: 0;
  z-index: 999;
  height: 44px;
  border-bottom: 1px solid #eee;

  @include media-breakpoint-up(md) {
    position: relative;
    height: 70px;
    box-shadow: 0 2px 4px 0 #b5b5b5;
  }

  .header-nav {
    img {
      height: 16px;
      @include media-breakpoint-up(md) {
        height: 26px;
      }
    }

    .header-nav-ul {
      li {
        position: relative;
        height: 70px;
        line-height: 70px;
        letter-spacing: 1px;
        border-bottom: 4px solid transparent;
        color: #292929;
        cursor: pointer;
        font-size: 16px;
        white-space: nowrap;

        &:hover {
          border-bottom: 4px solid #ff7800;
        }

        &.focus {
          border-bottom: 4px solid #ff7800;
        }

        span {
          width: 8px;
          height: 8px;
          background-color: #ea475b;
          border-radius: 50%;
          position: absolute;
          top: 18px;
          right: 11px;
        }
      }
    }
  }

  .header-menu {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 16px;
    cursor: pointer;
  }

  .header-login {
    position: absolute;
    top: 0;
    right: 0;
    color: #ff7800;
    cursor: pointer;

    .userAvatar {
      width: 28px;
      height: 28px;
      object-fit: cover;
      border: solid 1px #ffd6b2;
    }
  }
}
</style>
