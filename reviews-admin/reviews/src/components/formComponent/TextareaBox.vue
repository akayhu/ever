<template>
  <div class="textarea-container">
    <div
      class="textarea-container-content px-3 pt-2 pb-2 rounded"
      :class="{
        disabled: disabled,
        'invalid-field': invalidField
      }"
    >
      <slot name="textarea" />
      <slot name="fixedText" />
      <slot></slot>
    </div>
    <div class="form-element-textarea-valid">
      <slot name="valid" />
    </div>
  </div>
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
.textarea-container {
  width: 100%;
  font-size: 16px;
  line-height: 1.75;
  &-content {
    border: solid 1px get-color(border);
    background-color: get-color(bg-gray);

    &:focus-within {
      border: solid 1px get-color(primary);
      box-shadow: 0 0 0 1px get-color(primary);
    }

    &.invalid-field {
      border: solid 1px get-color(danger);
      box-shadow: 0 0 0 1px get-color(danger);
    }

    &.disabled {
      cursor: not-allowed;
      background-color: rgba(243, 243, 243, 0.5);
    }
  }
}
</style>
