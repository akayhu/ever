<template>
  <div
    ref="root"
    class="text-truncate"
    v-tooltip="
      isOverflow
        ? {
            offset: 0,
            content: tooltipContent,
            placement: placement,
            trigger: 'hover'
          }
        : null
    "
  >
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOverflow: false,
      tooltipContent: null
    };
  },
  props: {
    placement: {
      type: String,
      default: "bottom-start"
    }
  },
  mounted() {
    this.isOverflow = this.checkIsOverflow(this.$refs.root);
    this.tooltipContent = this.$scopedSlots.default()[0].text;
  },
  methods: {
    checkIsOverflow(element) {
      const { scrollWidth, clientWidth } = element;
      return scrollWidth > clientWidth;
    }
  }
};
</script>
