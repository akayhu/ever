<template>
  <div class="wrapper">
    <div class="top_image image_0_0">
      <img :src="getTypeData_9.image_0_0" class="default_img_bg_color" />
    </div>
    <div class="title content_0_1">
      {{ getTypeData_9.content_0_1 ? getTypeData_9.content_0_1 : "標題" }}
    </div>
    <div class="content content_0_2">
      {{
        getTypeData_9.content_0_2
          ? getTypeData_9.content_0_2
          : "文字（範例）文字（範例）"
      }}
    </div>
    <div class="content content_0_3">
      {{
        getTypeData_9.content_0_3
          ? getTypeData_9.content_0_3
          : "文字（範例）文字（範例）"
      }}
    </div>
    <div class="content content_0_4">
      {{
        getTypeData_9.content_0_4
          ? getTypeData_9.content_0_4
          : "文字（範例）文字（範例）"
      }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_9",
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
    getTypeData_9() {
      return this.getUploadMaterialForm.typeData_9;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/mixin/mixin";

.wrapper {
  width: 100%;
  margin: 0 20px;
}

%img {
  background-color: #d8d8d8;
  width: 122px;
  height: 56px;
}

.image_0_0 {
  @extend %img;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
}

.middle_content_title {
  text-align: center;
}

.title {
  @include font-common(16px, $font-weight-bold);
  text-align: center;
  line-height: 22px;
  margin-bottom: 16px;
}

.content {
  @include font-common(14px, $font-weight-bold, #a9a9a9);
  line-height: 22px;
  margin-bottom: 16px;
}
</style>
