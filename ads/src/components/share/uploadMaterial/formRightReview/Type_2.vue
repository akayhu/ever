<template>
  <div class="review_main content_0_0">
    {{
      getTypeData_2.content_0_0
        ? getTypeData_2.content_0_0
        : "內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文"
    }}
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_2",
  props: {
    storeName: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      getUploadMaterialForm(state) {
        return state[this.storeName].materialForm;
      }
    }),
    getTypeData_2() {
      return this.getUploadMaterialForm.typeData_2;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 1.5px;
  color: #a9a9a9;
  width: 347px;
  word-break: break-all;
  padding: 5px;
}
</style>
