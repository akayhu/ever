<template>
  <div>
    <div
      class="mask d-none"
      :class="{ 'd-block': isShow }"
      @click="closeCallback"
    />
    <div
      class="mobile-web-menu d-md-none bg-white px-4"
      :class="{ show: isShow }"
    >
      <i class="d-inline-block jb_icon_delete" @click="closeCallback" />

      <div class="link-group py-1 t3 border-bottom">
        <div class="t3" @click="goTo('/')">
          首頁
        </div>
      </div>
      <div class="link-group py-1 border-bottom">
        <div class="t3" @click="goTo('/reviews')" data-gtm-head="匿名評論">
          匿名評論
        </div>
        <div class="t3" @click="goTo('/votes')" data-gtm-head="匿名投票">
          匿名投票
        </div>
        <div class="t3" @click="goTo('/top')" data-gtm-head="評比排行榜">
          評比排行榜
        </div>
      </div>
      <div class="link-group py-1">
        <div class="t3" @click="goTo('/about')" data-gtm-footer="關於我們">
          關於我們
        </div>
        <div class="t3" @click="goTo('/terms')" data-gtm-footer="服務條款">
          服務條款
        </div>
        <div class="t3" @click="goTo('/questions')" data-gtm-footer="常見問答">
          常見問答
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
export default {
  name: "MobileWebMenu",
  props: {
    closeCallback: {
      type: Function,
      required: true
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  mixins: [commonMixins],
  methods: {
    goTo(path) {
      if (this.$route.path === path) this.closeCallback();
      else {
        this.closeCallback();
        this.jump(path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.mobile-web-menu {
  position: fixed;
  top: 0;
  left: -250px;
  z-index: 999;
  width: 240px;
  height: 100vh;
  padding-top: 10px;
  box-shadow: 2px 0 4px 0 rgba(41, 41, 41, 0.2);
  transition: 0.4s;

  &.show {
    left: 0;
  }

  .jb_icon_delete {
    margin-bottom: 6px;
    font-size: 24px;
    line-height: 24px;
    color: $gray-700;
    cursor: pointer;
  }

  .link-group {
    div {
      padding: 10px 0;
      color: $gray-900;
      cursor: pointer;
      transition: 0.25s;

      &:hover {
        color: #ff7800;
      }
    }
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
</style>
