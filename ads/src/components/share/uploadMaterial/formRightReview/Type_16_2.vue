<template>
  <div class="review_main d-flex align-items-center justify-content-center">
    <div
      class="main_content position-relative d-flex align-items-center justify-content-center"
    >
      <div class="content_1_0 position-relative"></div>
      <div class="persudo-block"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Type_22_2"
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
