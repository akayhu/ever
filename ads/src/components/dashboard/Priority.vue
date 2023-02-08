<template>
  <div>
    <icon :iconName="priorityObject.imageName" size="20" class="mr-1" />
    <span v-if="showText">{{ priorityObject.text }}</span>
  </div>
</template>

<script>
export default {
  name: "Priority",
  props: {
    showText: {
      type: Boolean,
      default: true
    },
    priorityObject: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

div {
  display: flex;
  align-items: center;

  span {
    @include font-common(14px, $font-weight-normal, $gray-700);
  }
}
</style>
