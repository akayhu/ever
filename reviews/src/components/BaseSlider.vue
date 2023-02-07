<template>
  <div class="BaseSlider">
    <div
      class="slider"
      ref="slider"
      :style="sliderStyleObj"
      @click.capture="useClick"
    >
      <slot name="content" :click="isClick"></slot>
    </div>
  </div>
</template>

<script>
import Drag from "@/utils/drag.js";
export default {
  name: "BaseSlider",
  props: {
    defaultOffset: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      swipe: null,
      sliderWidth: 0,
      sliderOffset: 0,
      initialOffset: 0,
      isSwipe: false,
      isClick: false,
      ticker: null,
      lifeTime: 10,
      life: 10,
      isFixed: null
    };
  },
  computed: {
    sliderStyleObj() {
      return {
        transition: this.isSwipe ? "none" : null,
        transform: `translate3d(${this.sliderOffset}px, 0, 0)`
      };
    }
  },
  watch: {
    defaultOffset(offset, prev) {
      if (this.isFixed) return;
      this.sliderOffset = this.boundingHandler(offset * -1);
    }
  },
  mounted() {
    this.swipe = new Drag(".slider", {
      onstart: () => {
        this.isClick = true;
        this.initialOffset = this.sliderOffset;
        this.life = this.lifeTime;
        this.updateTick();
      },
      onmove: (el, pos, initialPos) => {
        // 如果slider的寬度比父層寬度小，則不移動slider
        if (this.isFixed) return;
        this.isClick = false;
        this.isSwipe = true;
        this.sliderOffset = ~~(this.initialOffset + -(initialPos.x - pos.x));
      },
      onend: (el, pos, initialPos, e) => {
        this.cancelTick();
        if (!this.isSwipe) return;
        const offset = initialPos.x - pos.x;
        // 如果位移誤差小於2px就判斷為點擊
        if (Math.abs(offset) <= 2) {
          this.isClick = true;
        } else {
          this.sliderOffset = this.boundingHandler(
            ~~(this.sliderOffset + offset * -this.life)
          );
        }
        this.isSwipe = false;
      }
    });
    this.sliderWidth = this.$refs.slider.offsetWidth;
    this.resizeHandler();
    window.addEventListener("resize", this.resizeHandler);
  },
  methods: {
    boundingHandler(value) {
      const parent = this.$refs.slider.parentNode;
      return value > 0
        ? 0
        : value < (this.sliderWidth - parent.offsetWidth) * -1
        ? (this.sliderWidth - parent.offsetWidth) * -1
        : value;
    },
    resizeHandler() {
      if (this.sliderWidth <= this.$refs.slider.parentNode.offsetWidth) {
        this.isFixed = true;
        this.sliderOffset = 0;
      } else {
        this.isFixed = false;
        this.sliderOffset = this.boundingHandler(this.defaultOffset * -1);
      }
      this.$emit("onreset");
    },
    useClick(e) {
      if (!this.isClick) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    updateTick() {
      if (this.life <= 0) {
        this.life = 0;
        return this.cancelTick();
      }
      this.life = this.life - this.lifeTime / 20;
      this.ticker = window.requestAnimationFrame(this.updateTick.bind(this));
    },
    cancelTick() {
      window.cancelAnimationFrame(this.ticker);
      this.ticker = null;
    }
  },
  beforeDestroy() {
    this.swipe.removeEvent();
    window.removeEventListener("resize", this.resizeHandler);
  }
};
</script>

<style lang="scss">
.BaseSlider {
  display: flex;
  overflow: hidden;
  .slider {
    // set offset parent
    position: relative;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    height: 100%;
    touch-action: pan-y;
    transition: transform 0.4s ease-out;
  }
}
</style>
