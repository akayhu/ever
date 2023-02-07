<template>
  <div class="form-title-container">
    <div class="form-title text-center mb-2 t2 font-weight-bold">
      {{ formTitle }}
    </div>
    <div class="form-sub-title text-center mb-0 t4">
      你提供的資訊將以匿名方式呈現，公司並不會知道你的身份、IP等資訊，敬請放心填寫。
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formTitle: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.form-title-container {
  .form-title {
    color: $gray-900;
  }

  .form-sub-title {
    color: $gray-700;
  }
}
</style>
