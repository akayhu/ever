<template>
  <div v-if="vData.$error" class="error_message">
    <div
      v-if="
        (vData.hasOwnProperty('required') && !vData.required) ||
          (vData.required && vData.required.$invalid)
      "
    >
      {{ text }}
    </div>
    <div
      v-if="
        (vData.hasOwnProperty('isUnique') && !vData.isUnique) ||
          (vData.isUnique && vData.isUnique.$invalid)
      "
    >
      {{ text }}
    </div>
    <div
      v-if="
        (vData.hasOwnProperty('onlyEnterNumbers') && !vData.onlyEnterNumbers) ||
          (vData.onlyEnterNumbers && vData.onlyEnterNumbers.$invalid)
      "
    >
      只能輸入數字
    </div>
    <div
      v-if="
        (vData.hasOwnProperty('minLength') && !vData.minLength) ||
          (vData.minLength && vData.minLength.$invalid)
      "
    >
      最少輸入{{ minLengthText }}個數字
    </div>
    <div
      v-if="
        (vData.hasOwnProperty('maxLength') && !vData.maxLength) ||
          (vData.maxLength && vData.maxLength.$invalid)
      "
    >
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
