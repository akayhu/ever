<template>
  <div>
    <div
      class="mask d-none"
      :class="{ 'd-block': isShow }"
      @click="closeCallback"
    />
    <div
      class="mobile-user-menu d-md-none bg-white px-4"
      :class="{ show: isShow }"
    >
      <i class="d-inline-block jb_icon_delete" @click="closeCallback" />

      <div class="link-group py-1 t3" @click="clickLogout">
        <div class="t3">登出</div>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from "@/apis/user";
export default {
  name: "MobileUserMenu",
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
  watch: {
    $route() {
      this.closeCallback();
    }
  },
  methods: {
    clickLogout() {
      logout(this.$route.path);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.mobile-user-menu {
  position: fixed;
  top: 0;
  right: -250px;
  z-index: 999;
  width: 240px;
  height: 100vh;
  padding-top: 10px;
  box-shadow: -2px 0 4px 0 rgba(41, 41, 41, 0.2);
  transition: 0.4s;

  &.show {
    right: 0;
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
