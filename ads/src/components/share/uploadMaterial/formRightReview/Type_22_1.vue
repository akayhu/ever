<template>
  <div class="review_main d-flex align-items-center">
    <div class="right_image">
      <div class="default_bg_color image_0_0">
        <img :src="getTypeData_22.image_0_0" class="default_img_bg_color" />
      </div>
    </div>
    <div class="left_content">
      <div class="title content_0_1">
        {{ getTypeData_22.content_0_1 ? getTypeData_22.content_0_1 : "標題" }}
      </div>
      <p class="content_0_2">
        {{
          getTypeData_22.content_0_2
            ? getTypeData_22.content_0_2
            : "文字一（範例）文字一（範例）文字"
        }}
      </p>
      <p class="content_0_3">
        {{
          getTypeData_22.content_0_3
            ? getTypeData_22.content_0_3
            : "文字一（範例）文字一（範例）文字"
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_22_1",
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
    getTypeData_22() {
      return this.getUploadMaterialForm.typeData_22;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 347px;

  .right_image {
    .default_bg_color {
      background-color: #d8d8d8;
      width: 104px;
      min-height: 85px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .default_img_bg_color {
      background-color: #d8d8d8;
      max-width: 104px;
    }
  }

  .left_content {
    width: 243px;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 1.5px;
    padding-left: 10px;

    .title {
      font-size: 16px;
      margin-bottom: 10px;
      color: #2d2d2d;
      padding: 5px;
    }

    p {
      margin-bottom: 10px;
      font-size: 12px;
      padding: 5px;
      color: #a9a9a9;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
