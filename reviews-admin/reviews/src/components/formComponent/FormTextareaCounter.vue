<template>
  <FormElementTextareabox :disabled="disabled" :invalidField="error">
    <TextareaAutosize
      slot="textarea"
      v-on="{
        ...$listeners
      }"
      :value="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :title="title"
      :maxLength="textMaximum"
      :min-height="minHeight"
      :max-height="maxHeight"
    />
    <div slot="fixedText" class="t5 mt-2 text-length text-right">
      {{ textCount }}/{{ textMaximum }}
    </div>
    <div class="error ml-3" slot="valid" v-show="error">
      <slot name="error" />
    </div>
  </FormElementTextareabox>
</template>

<script>
import FormElementTextareabox from "@/components/formComponent/TextareaBox";
export default {
  name: "FormTextareaCounter",
  components: {
    FormElementTextareabox
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      required: true
    },
    error: {
      type: Boolean,
      default: false
    },
    textMaximum: {
      type: Number,
      default: 500
    },
    minHeight: {
      type: Number,
      default: 86
    },
    maxHeight: {
      type: Number,
      default: 202
    },
    placeholder: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    textCount() {
      return (this.value && this.value.length) || 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.error {
  color: get-color(danger);
  font-size: 12px;
}
</style>
