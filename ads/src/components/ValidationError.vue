<template>
  <div v-if="vData.$error" class="error_message">
    <div
      v-if="
        (vData.hasOwnProperty('required') && !vData.required) ||
          (vData.hasOwnProperty('between') && !vData.between)
      "
    >
      {{ text }}
    </div>
    <div v-if="vData.hasOwnProperty('checkStartDate') && !vData.checkStartDate">
      起始日不能小於今日
    </div>
    <div
      v-if="vData.hasOwnProperty('onlyEnterNumbers') && !vData.onlyEnterNumbers"
    >
      只能輸入數字
    </div>
    <div v-if="vData.hasOwnProperty('minLength') && !vData.minLength">
      最少輸入{{ minLengthText }}個數字
    </div>
    <div v-if="vData.hasOwnProperty('maxLength') && !vData.maxLength">
      字數超過{{ maxLengthText }}字
    </div>
  </div>
</template>

<script>
export default {
  name: "ValidationError",
  props: {
    vData: {
      required: true
    },
    text: {
      type: String
    },
    minLengthText: {
      type: String
    },
    maxLengthText: {
      type: String
    }
  }
};
</script>
