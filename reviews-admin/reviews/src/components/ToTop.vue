<template>
  <transition name="slide-fade">
    <div class="ToTop" v-show="show">
      <button class="totop-btn" @click="clickToTop">Go to Top</button>
      <span class="arrow"><i class="jb_icon_gotop"/></span>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ToTop",
  data() {
    return {
      show: false
    };
  },
  mounted() {
    window.addEventListener("scroll", this.scrollHandler);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  methods: {
    scrollHandler() {
      if (window.pageYOffset > 400) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
    clickToTop(e) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ToTop {
  position: fixed;
  bottom: 36px;
  right: 16px;
  width: 56px;
  height: 56px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(41, 41, 41, 0.2);
  z-index: 99;
  overflow: hidden;
  @include device-up(md) {
    right: 12px;
    bottom: 70px;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }
  &::after {
    content: "";
    position: absolute;
    top: 34%;
    left: 50%;
    width: 40%;
    height: 2px;
    background-color: #7e7e7e;
    transform: translateX(-50%);
    pointer-events: none;
    @include device-up(md) {
      display: none;
    }
  }
  .totop-btn {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-size: 0;
    line-height: 0;
    color: transparent;
    border: none;
    background-color: #fff;
    outline: none;
  }
  .arrow {
    display: block;
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 33.33%;
    color: #a9a9a9;
    background-color: #7e7e7e;
    border-radius: 4px;
    pointer-events: none;
    .jb_icon_gotop {
      display: none;
    }
    @include device-up(md) {
      top: 50%;
      font-size: 24px;
      width: 24px;
      height: 24px;
      background-color: transparent;
      .jb_icon_gotop {
        display: block;
      }
    }
    &::after,
    &::before {
      position: absolute;
      content: "";
      top: 1px;
      width: 2px;
      height: 75%;
      background-color: inherit;
      border-radius: inherit;
      transform-origin: 50% 0;
      @include device-up(md) {
        display: none;
      }
    }
    &::before {
      left: 0;
      transform: rotate(-45deg);
    }
    &::after {
      right: 0;
      transform: rotate(45deg);
    }
  }
}
</style>
