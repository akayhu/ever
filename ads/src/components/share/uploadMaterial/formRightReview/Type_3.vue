<template>
  <div class="review_main">
    <div class="left_image">
      <div class="default_bg_color image_0_0">
        <img :src="getTypeData_3.image_0_0" class="default_img_bg_color" />
      </div>
    </div>
    <div class="right_content content_0_1">
      {{
        getTypeData_3.content_0_1
          ? getTypeData_3.content_0_1
          : "內文（範例）內文（範例）內文"
      }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_3",
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
    getTypeData_3() {
      return this.getUploadMaterialForm.typeData_3;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  display: flex;
  align-items: center;

  .left_image {
    margin-right: 15px;

    .default_bg_color {
      background-color: #d8d8d8;
      width: 121px;
      min-height: 91px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .default_img_bg_color {
      background-color: #d8d8d8;
      max-width: 121px;
    }
  }
  .right_content {
    width: 208px;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 1.5px;
    color: #a9a9a9;
    padding: 5px;
  }
}
</style>
