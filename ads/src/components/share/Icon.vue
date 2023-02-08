<template>
  <img
    :src="imgSrc"
    :style="cssVars"
    class="icon"
    :alt="`icon_${iconName}`"
    :class="{ active, hover, disabled }"
  />
</template>

<script>
export default {
  props: {
    bgColor: {
      type: String,
      default: "currentColor"
    },
    iconName: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: "24"
    },
    active: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    imgSrc() {
      return require(`@/assets/icon/${this.iconName}.svg`);
    },
    cssVars() {
      return {
        "--size": this.size + "px"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  width: var(--size);
  height: var(--size);
}

.active {
  filter: brightness(0) saturate(100%) invert(43%) sepia(93%) saturate(766%)
    hue-rotate(144deg) brightness(96%) contrast(101%);
}

.hover {
  filter: brightness(0) saturate(100%) invert(96%) sepia(65%) saturate(7027%)
    hue-rotate(136deg) brightness(84%) contrast(91%);
}

.disabled {
  cursor: not-allowed !important;
  filter: brightness(0) saturate(100%) invert(79%) sepia(0%) saturate(0%)
    hue-rotate(199deg) brightness(87%) contrast(89%);
}
</style>
