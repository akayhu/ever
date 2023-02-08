<template>
  <div>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
    ></textarea>
    <span v-show="maxlength">{{ characterCount }}/{{ maxlength }}</span>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "ADSTextarea",
  props: {
    modelValue: String,
    placeholder: String,
    maxlength: String,
    disabled: Boolean
  },
  emits: ["update:modelValue"],
  setup(props) {
    const characterCount = computed(() =>
      props.modelValue ? props.modelValue.length : 0
    );

    return {
      characterCount
    };
  }
});
</script>

<style lang="scss" scoped>
div {
  display: inline-block;
  position: relative;
  resize: both;
  overflow: auto;
}

textarea {
  width: calc(100% - 26px);
  height: calc(100% - 26px);
  font-family: "Microsoft JhengHei", Arial;

  &[disabled] {
    border: solid 1px #eee !important;
    color: #a9a9a9 !important;
    background-color: rgba(243, 243, 243, 0.5) !important;
  }
}

span {
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 1.5px;
  text-align: right;
  color: #7e7e7e;
  background-color: #f1f1f1;
}
</style>
