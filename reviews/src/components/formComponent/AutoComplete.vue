<template>
  <el-autocomplete
    :disabled="disabled"
    :debounce="500"
    :hide-loading="false"
    :class="{ 'invalid-field': invalidField }"
    :fetch-suggestions="querySearch"
    :popper-class="popperClass"
    :value="selectedValue"
    :placeholder="placeholder"
    :trigger-on-focus="false"
    @select="handleSelect"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  ></el-autocomplete>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "autoComplete",
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    popperClass: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: "輸入後請點擊下方按鈕檢查公司名稱"
    },
    value: {
      type: [Number, String],
      default: null
    },
    validation: {
      type: Object,
      default: null
    },
    querySearch: {
      type: Function,
      required: true
    },
    invalidField: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mixins: [commonMixins],
  computed: {
    selectedValue() {
      return this.value;
    }
  },
  updated() {},
  methods: {
    handleSelect(val) {
      if (this.validation) this.validation.$touch();
      this.$emit("value-selected", val);
    },
    handleInput(val) {
      this.$emit("value-inputed", val);
    },
    handleFocus() {
      this.$emit("value-focus");
    },
    handleBlur() {
      this.$emit("value-blur");
    }
  }
};
</script>
