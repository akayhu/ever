<template>
  <router-link
    :disabled="disabled"
    :to="path"
    class=" compare-button btn-secondary t2 font-weight-bold text-center rounded"
    data-gtm-btn="比較公司"
  >
    <div class="text text-white"><slot></slot></div>
  </router-link>
</template>

<script>
export default {
  name: "CompareButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    path: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.compare-button {
  cursor: pointer;
  &[disabled] {
    background: #a9a9a9;
  }
  .text {
    padding: 10px 16px;
    pointer-events: none;
  }
}
</style>
