<template>
  <div>
    <Loading v-if="isLoading" size="24" />
  </div>
</template>

<script>
import Loading from "@/components/Loading";

export default {
  name: "InfiniteLoading",
  components: {
    Loading
  },
  props: {
    options: {
      type: Object
    },
    isLoading: { type: Boolean, required: true }
  },
  data: () => ({
    observer: null
  }),
  mounted() {
    const options = this.options || {};
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting && !this.isLoading) {
        this.$emit("intersect");
      }
    }, options);
    this.observer.observe(this.$el);
  },
  destroyed() {
    this.observer.disconnect();
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  img {
    animation: rotate-animation 1.2s linear infinite;
  }
}

@keyframes rotate-animation {
  100% {
    transform: rotate(360deg);
  }
}
</style>
