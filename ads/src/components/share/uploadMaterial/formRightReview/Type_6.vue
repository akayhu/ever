<template>
  <div class="review_main d-flex align-items-center">
    <div class="right_content">
      <div class="title content_0_0">
        {{ getTypeData_6.content_0_0 ? getTypeData_6.content_0_0 : "標題" }}
      </div>
      <p class="content_0_1">
        {{
          getTypeData_6.content_0_1
            ? getTypeData_6.content_0_1
            : "內文（範例）內文（範例）內文（範例）內文（範例）內文（範"
        }}
      </p>
    </div>
    <div class="left_image">
      <div class="default_bg_color image_0_3">
        <img :src="getTypeData_6.image_0_2" class="default_img_bg_color" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_6",
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
    getTypeData_6() {
      return this.getUploadMaterialForm.typeData_6;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 347px;

  .right_content {
    width: 226px;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 1.5px;
    padding-right: 20px;

    .title {
      font-size: 16px;
      margin-bottom: 10px;
      color: #2d2d2d;
      padding: 5px;
    }

    p {
      font-size: 12px;
      padding: 5px;
      color: #a9a9a9;
    }
  }

  .left_image {
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
}
</style>
