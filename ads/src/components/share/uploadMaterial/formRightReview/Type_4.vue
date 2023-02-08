<template>
  <div class="review_main">
    <div class="left_image">
      <div class="default_bg_color image_0_0">
        <img :src="getTypeData_4.image_0_0" class="default_img_bg_color" />
      </div>
    </div>
    <div class="right_content">
      <div class="title content_0_1">
        {{ getTypeData_4.content_0_1 ? getTypeData_4.content_0_1 : "標題" }}
      </div>
      <p class="content_0_2">
        {{
          getTypeData_4.content_0_2
            ? getTypeData_4.content_0_2
            : "內文（範例）內文（範例）內文（範例）內文（範例）內文（範"
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_4",
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
    getTypeData_4() {
      return this.getUploadMaterialForm.typeData_4;
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
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 1.5px;

    .title {
      font-size: 16px;
      margin-bottom: 10px;
      color: #2d2d2d;
      padding: 5px;
    }

    p {
      margin-bottom: 0;
      font-size: 12px;
      padding: 5px;
      color: #a9a9a9;
    }
  }
}
</style>
