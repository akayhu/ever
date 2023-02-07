<template>
  <div
    class="mobile-nav-btn  t3 text-center font-weight-bold"
    :class="{ active: active }"
    @click="jumpToPosition"
  >
    {{ content }}
  </div>
</template>

<script>
export default {
  name: "MobileNavBtn",
  data() {
    return {
      targetDom: null,
      targetPosition: 0,
      targetBottom: 0,
      windowScrollTop: 0
    };
  },
  props: {
    first: {
      type: Boolean,
      required: false
    },
    content: {
      type: String,
      default: "預設"
    },
    target: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.targetDom = document.querySelector(this.target);
      this.targetBottom = this.targetDom.getBoundingClientRect().bottom;
      this.resetPosition();
      window.addEventListener("scroll", this.scrollHandler);
      window.addEventListener("resize", this.resetPosition);
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollHandler);
    window.removeEventListener("resize", this.resetPosition);
  },
  computed: {
    active() {
      return this.first
        ? this.targetBottom >= 52
        : this.targetPosition - 116 <= this.windowScrollTop &&
            this.targetBottom >= 52;
    }
  },
  methods: {
    getPosition(element) {
      let x = 0;
      let y = 0;
      while (element) {
        x += element.offsetLeft - element.scrollLeft + element.clientLeft;
        y += element.offsetTop - element.scrollLeft + element.clientTop;
        element = element.offsetParent;
      }
      return { x: x, y: y };
    },
    resetPosition() {
      this.targetPosition = this.getPosition(this.targetDom).y;
    },
    jumpToPosition() {
      this.resetPosition();
      window.scrollTo({
        top: this.targetPosition - 116,
        behavior: "smooth"
      });
    },
    scrollHandler() {
      this.resetPosition();
      this.windowScrollTop = window.pageYOffset;
      this.targetBottom = this.targetDom.getBoundingClientRect().bottom;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.mobile-nav-btn {
  width: 120px;
  height: 47px;
  line-height: 47px;
  border-bottom: 4px solid transparent;
  color: $gray-900;
  cursor: pointer;

  &:hover,
  &.active {
    color: $primary;
    border-bottom: 4px solid $primary;
  }
}
</style>
