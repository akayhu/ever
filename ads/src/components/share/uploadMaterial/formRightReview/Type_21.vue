<template>
  <div class="review_main">
    <div class="content_0_0">
      {{
        getTypeData_21.content_0_0
          ? getTypeData_21.content_0_0
          : "文字（範例）文字（範例）文字（範例）文字（範例）文"
      }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_21",
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
    getTypeData_21() {
      return this.getUploadMaterialForm.typeData_21;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 347px;

  .content_0_0 {
    display: flex;
    line-height: 1.5;
    letter-spacing: 1.5px;
    color: #a9a9a9;
    font-weight: bold;
    font-size: 12px;
  }
}
</style>
