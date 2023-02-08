<template>
  <div class="review_main d-flex">
    <div class="main_content  d-flex flex-wrap">
      <div class="image_0_0">
        <img :src="getTypeData_14.image_0_0" class="default_img_bg_color" />
      </div>
      <div v-for="num in 5" :key="num" class="fake_img"></div>
    </div>
    <div
      class="fake_pagintaion d-flex justify-content-between align-items-center"
    >
      <div v-for="num in 3" :key="num"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_14",
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
    getTypeData_14() {
      return this.getUploadMaterialForm.typeData_14;
    }
  }
};
</script>

<style lang="scss" scoped>
$container_width: 347px;
$inner_box_width: 69px;
$inner_box_margin-right: 30px;
$inner_box_margin_bottom: 15px;
$main_content_width: ($inner_box_margin-right * 2 + $inner_box_width * 3);
$fake_pagination_width: $container_width - $main_content_width;

%img {
  background-color: #d8d8d8;
  width: $inner_box_width;
  height: 60px;
  margin-right: $inner_box_margin-right;
  margin-bottom: $inner_box_margin_bottom;
}

.review_main {
  width: $container_width;

  .main_content {
    width: $main_content_width;

    .fake_img {
      @extend %img;
    }

    .image_0_0 {
      @extend %img;
      > img {
        object-fit: contain;
        width: $inner_box_width;
        min-height: 60px;
      }
    }

    & > div:nth-child(n + 4) {
      margin-bottom: 0;
    }

    & > div:nth-child(3n) {
      margin-right: 0;
    }
  }

  .fake_pagintaion {
    width: $fake_pagination_width;
    padding-left: 20px;

    > div {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #d8d8d8;
    }
  }
}
</style>
