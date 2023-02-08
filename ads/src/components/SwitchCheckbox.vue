<template>
  <label class="switch_checkbox">
    <input
      type="checkbox"
      :disabled="disabled"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    />
    <div class="switch">
      <div class="btn"></div>
    </div>
  </label>
</template>

<script>
export default {
  name: "SwitchCheckbox",
  props: {
    value: {
      type: [Number, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.switch_checkbox {
  display: inline-block;

  input {
    display: none;

    &:checked + .switch {
      background-color: #00afb8;
      border: solid 1px #00afb8;

      .btn {
        left: 24px;
      }
    }

    &:checked[disabled] + .switch {
      background-color: #e6f9fa;
      border: solid 1px rgba(57, 200, 208, 0.4);

      .btn {
        background-color: rgba(57, 200, 208, 0.4);
      }
    }

    &[disabled] + .switch {
      border: solid 1px #ddd;
      background-color: #eee;
      cursor: initial;

      .btn {
        background-color: #ddd;
      }
    }
  }

  .switch {
    width: 46px;
    height: 22px;
    display: flex;
    align-items: center;
    background-color: #7e7e7e;
    border: solid 1px #7e7e7e;
    border-radius: 100px;
    transition: 0.3s;
    cursor: pointer;

    .btn {
      width: 18px;
      height: 18px;
      background-color: #fff;
      border-radius: 15px;
      position: relative;
      left: 2px;
      transition: left 0.3s;
      padding: 0 8px;
    }
  }
}
</style>
