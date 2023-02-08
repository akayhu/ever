<template>
  <span
    class="ad_checkbox_input"
    :class="{ ad_checkbox_input_checked: checked }"
  >
    <label />
    <input type="checkbox" @click="click($event)" :value="value" />
  </span>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    click(event) {
      this.$emit("handle-click", event.target.value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.ad_checkbox_input {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  position: absolute;

  &::before {
    content: "";
    background-color: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1.5px solid #9f9f9f;
    border-radius: 0.25em;
  }

  &_checked {
    color: red;

    &::before {
      background: $primary;
      border-color: $primary;
    }
  }
}

input[type="checkbox"] {
  display: inline-block;
  width: 100%;
  height: 100%;
  opacity: 0;
}

/* input[type="checkbox"]:after {
  line-height: 1.5em;
  opacity: 1;
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-top: -4px;
  border: 1.5px solid #9f9f9f;
  border-radius: 0.25em;
  background: $white;
} */

input[type="checkbox"]:checked:after {
  width: 16px;
  height: 16px;
  background: $primary;
  border: 1.5px solid $primary;
}
</style>
