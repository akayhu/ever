<template>
  <label class="input-container mb-0">
    <div
      class="input-container-wrap d-flex justify-content-between align-items-center rounded"
      :class="{ 'invalid-field': invalidField, 'pr-3': $slots.fixedText }"
      :disabled="disabled"
    >
      <slot name="input" />
      <slot name="fixedText" />
    </div>
    <slot name="valid" />
  </label>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    invalidField: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.input-container {
  font-size: 16px;
  line-height: 1.75;
  &-wrap {
    border: 1px solid get-color(border);
    background-color: get-color(bg-gray);
    height: 44px;

    &:focus-within {
      border: solid 1px get-color(primary);
      box-shadow: 0 0 0 1px get-color(primary);
    }

    &.invalid-field {
      border: solid 1px get-color(danger);
      box-shadow: 0 0 0 1px get-color(danger);
    }

    &[disabled="disabled"] {
      cursor: not-allowed;
      background-color: rgba(243, 243, 243, 0.5);
    }
  }
}
</style>
