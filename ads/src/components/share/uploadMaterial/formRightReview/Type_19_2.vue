<template>
  <div class="review_main d-flex align-items-center justify-content-center">
    <div
      class="main_content position-relative d-flex align-items-center justify-content-center"
    >
      <div class="content_1_0 position-relative">
        {{
          getTypeData_19.content_1_0 ? getTypeData_19.content_1_0 : "文字（範例"
        }}
      </div>
      <div class="persudo-block"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_19_2",
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
    getTypeData_19() {
      return this.getUploadMaterialForm.typeData_19;
    }
  }
};
</script>

<style lang="scss" scoped>
$main_content_width: 139px;
$persudo_max_width: 83px;
$persudo_y: ($main_content_width - $persudo_max_width) / 2;
$persudo_x: 26px;

%persudo-css {
  display: inline-block;
  position: absolute;
  content: "";
  background-color: #d8d8d8;
  z-index: 0;
}

@mixin persudo-size($width, $height) {
  @extend %persudo-css;
  width: $width;
  height: $height;
}

.review_main {
  width: 347px;

  .main_content {
    width: $main_content_width;
    height: $main_content_width;
    border: 1px solid #e2e1e1;
    border-radius: 2px;

    &::before {
      @include persudo-size(83px, 21px);
      bottom: $persudo_x;
      left: $persudo_y;
    }

    &::after {
      @include persudo-size(35px, 56px);
      top: $persudo_x;
      left: $persudo_y;
    }

    .content_1_0 {
      z-index: 1;
    }

    .persudo-block {
      &::before {
        @include persudo-size(35px, 19px);
        top: $persudo_x;
        right: $persudo_y;
      }

      &::after {
        @include persudo-size(35px, 28px);
        bottom: $persudo_x + 21px + 6px;
        right: $persudo_y;
      }
    }
  }
}
</style>
