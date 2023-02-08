<template>
  <img
    :src="imgSrc"
    :style="cssVars"
    :alt="`icon_${iconName}`"
    :class="{ active, hover, disabled }"
    class="icon"
  />
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  iconName: { type: String, required: true },
  size: { type: String, default: "24" },
  active: { type: Boolean, default: false },
  hover: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

const imgSrc = computed(() => require(`@/assets/icon/${props.iconName}.svg`));
const cssVars = computed(() => `--size: ${props.size}px;`);
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
