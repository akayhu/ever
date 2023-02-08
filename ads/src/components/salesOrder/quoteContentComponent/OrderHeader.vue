<template>
  <div class="card" :class="{ card_gray: data.greyBackground }">
    <p class="card_title">{{ data.title }}</p>
    <p class="card_content">{{ data.content }}</p>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  }
});
</script>

<style lang="scss" scoped>
.card {
  flex-grow: 1;
  padding: 15px 0 4px 16px;
  margin: 24px 0;
  border-radius: 8px;
  background-color: #e6f9fa;
  font-weight: bold;

  &:not(:last-child) {
    margin-right: 20px;
  }

  &_gray {
    background-color: #f6f6f6;
  }

  &_title {
    margin-bottom: 12px;
    color: #333333;
  }

  &_content {
    margin-bottom: 12px;
    color: #19b9c0;
  }
}
</style>
