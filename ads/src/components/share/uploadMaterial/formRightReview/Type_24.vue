<template>
  <div class="review_main d-flex align-items-center">
    <div class="main_content w-100 d-flex align-items-center">
      <div class="title content_0_0">
        {{ getTypeData_24.content_0_0 ? getTypeData_24.content_0_0 : "標題" }}
      </div>
      <p class="content_0_1 m-0">
        {{
          getTypeData_24.content_0_1
            ? getTypeData_24.content_0_1
            : "文字（範例）文字（範例）文字（範例）"
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_24",
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
    getTypeData_24() {
      return this.getUploadMaterialForm.typeData_24;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 347px;

  .main_content {
    font-weight: bold;
    line-height: 1.5;

    .content_0_0 {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      padding-right: 10px;
    }

    .content_0_1 {
      width: 260px;
      letter-spacing: 1.5px;
      color: #a9a9a9;
      font-size: 12px;
    }
  }
}
</style>
