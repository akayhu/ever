<template>
  <div class="review_main">
    <div class="content_0_0">
      {{
        getTypeData_29.content_0_0
          ? getTypeData_29.content_0_0
          : "文字（範例）文字（範例）文字（範例）文字（範例）文"
      }}
    </div>
    <div class="content_0_1">
      {{
        getTypeData_29.content_0_1
          ? getTypeData_29.content_0_1
          : "文字（範例）文字（範例）文字（範例）文字（範例）文"
      }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_29",
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
    getTypeData_29() {
      return this.getUploadMaterialForm.typeData_29;
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

.review_main {
  width: 347px;

  .content_0_0 {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #2d2d2d;
    margin-bottom: 15px;
  }

  .content_0_1 {
    font-size: 12px;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 1.5px;
    color: #a9a9a9;
  }
}
</style>
