<template>
  <label class="radio m-0">
    <input
      type="radio"
      :name="name"
      :value="bindValue"
      :checked="checked"
      :disabled="disabled"
      @change="$emit('change', bindValue)"
    />
    <span class="ad-radio"></span>
    <span
      v-if="tooltip"
      v-tooltip="{
        placement: 'bottom-start',
        offset: 5,
        content: content,
        trigger: 'hover'
      }"
      >{{ content }}</span
    >
    <span v-else>{{ content }}</span>
  </label>
</template>

<script>
export default {
  name: "Radio",
  model: {
    prop: "value",
    event: "change"
  },
  computed: {
    checked() {
      if (typeof this.bindValue === "object" && this.bindValue !== null) {
        return JSON.stringify(this.value) === JSON.stringify(this.bindValue);
      } else {
        return this.value === this.bindValue;
      }
    }
  },
  props: {
    content: {
      type: String,
      required: true
    },
    bindValue: {
      type: [String, Number, Object, Boolean],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Object, Boolean]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Boolean,
      default: false
    }
  }
};
</script>
