<template>
  <span
    class="tag"
    :class="{
      focus: isActive && !isDisable,
      disable: isDisable
    }"
    @click="onClick"
    v-text="content"
  />
</template>

<script>
export default {
  name: "Tag",
  props: {
    content: {
      type: String,
      required: true
    },
    tagData: {
      type: Object,
      default: () => ({})
    },
    isActive: {
      type: Boolean,
      default: () => false
    },
    isDisable: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    onClick() {
      if (this.isDisable) return;
      this.$emit("onTagClick", this.tagData);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.tag {
  @include font-common(14px, $font-weight-bold, $blue-turquoise);
  letter-spacing: 0.88px;
  border-radius: 12px;
  padding: 1px 8px;
  border: solid 1px $blue-turquoise;
  background-color: $white;
  cursor: pointer;

  &.focus {
    background-color: $blue-turquoise;
    color: $white;

    &:hover {
      background-color: $blue-lake;
      border-color: $blue-lake;
      color: $white;
    }
  }

  &.disable,
  &.disable:hover {
    color: $gray-600;
    border-color: $gray-600;
    cursor: not-allowed;
  }

  &:hover {
    border-color: $blue-lake;
    color: $blue-lake;
  }
}
</style>
