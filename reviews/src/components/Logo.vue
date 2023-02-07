<template>
  <div class="logo" :class="logoClass">
    <img v-if="!showDefault" :src="src" @error="showDefault = true" />
    <div
      v-if="showDefault"
      class="default py-4 text-center text-white d-flex align-items-center justify-content-center"
      :style="logoDefaultStyle"
    >
      <span>{{ name.split("")[0] }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Logo",
  props: {
    src: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    logoClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showDefault: false
    };
  },
  computed: {
    logoDefaultStyle() {
      const background = { background: this.logoColor() };
      return {
        ...background
      };
    }
  },
  methods: {
    logoColor() {
      const color = [
        "#FFC31B",
        "#6FB827",
        "#00AFB8",
        "#4E91FF",
        "#1654B9",
        "#78269F"
      ];
      const random = Math.floor(Math.random() * color.length);
      return color[random];
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  @include device-up(md) {
    width: 56px;
    height: 56px;
  }
  img {
    width: 100%;
  }
  .default {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    font-size: 24px;
    line-height: 1;
  }
}
</style>
