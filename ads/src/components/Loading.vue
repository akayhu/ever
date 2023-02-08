<template>
  <div class="loading_wrapper">
    <icon iconName="icon-loading" :size="size" />
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    size: {
      type: [Number, String],
      default: 48
    }
  }
};
</script>

<style lang="scss" scoped>
.loading_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  img {
    animation: rotate-animation 0.8s linear infinite;
  }
}

@keyframes rotate-animation {
  100% {
    transform: rotate(360deg);
  }
}
</style>
