<template>
  <div class="review_main">
    <div class="top_image">
      <div class="default_bg_color image_0_0">
        <img :src="getTypeData_5.image_0_0" class="default_img_bg_color" />
      </div>
    </div>
    <div class="content_0_1 text-center">
      {{
        getTypeData_5.content_0_1
          ? getTypeData_5.content_0_1
          : "文字文字文字文字"
      }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_5",
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
    getTypeData_5() {
      return this.getUploadMaterialForm.typeData_5;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 121px;

  .top_image {
    margin-bottom: 30px;

    .default_bg_color {
      background-color: #d8d8d8;
      width: 121px;
      min-height: 75px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .default_img_bg_color {
      background-color: #d8d8d8;
      max-width: 121px;
    }
  }

  .content_0_1 {
    font-size: 14px;
  }
}
</style>
