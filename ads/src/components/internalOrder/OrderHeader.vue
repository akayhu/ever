<template>
  <div class="card" :class="{ card_gray: data.credit }">
    <p class="card_title">{{ data.title }}</p>
    <p class="card_content">{{ data.content }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/views/orderManage/create";
</style>
