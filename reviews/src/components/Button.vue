<template>
  <button class="btn font-weight-bold" @click="jump(path)">
    {{ btnText }}
  </button>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
export default {
  name: "Button",
  props: {
    path: {
      type: String,
      default: ""
    },
    btnText: {
      type: String,
      default: "發表公司評價"
    }
  },
  mixins: [commonMixins]
};
</script>

<style lang="scss" scoped>
button {
  width: 154px;
  height: 44px;
}
</style>
