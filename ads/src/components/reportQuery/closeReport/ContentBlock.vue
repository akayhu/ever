<template>
  <div class="content_block">
    <div class="header">
      <slot name="header" />
    </div>
    <div class="content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentBlock",
  props: {}
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.content_block {
  border-radius: 8px;
  border: solid 1px #eeeeee;
}
</style>
