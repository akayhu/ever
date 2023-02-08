<template>
  <div>
    <div class="top_image image_0_0">
      <img :src="getTypeData_28.image_0_0" class="default_img_bg_color" />
    </div>
    <div class="middle_content_title content_0_1">
      {{ getTypeData_28.content_0_1 ? getTypeData_28.content_0_1 : "標題" }}
    </div>
    <div class="middle_content">
      <div><img src="@/assets/icon/icon-icon-location.svg" /></div>
      <div class="content_0_2">
        {{
          getTypeData_28.content_0_2
            ? getTypeData_28.content_0_2
            : "文字（範例）文字（範例）"
        }}
      </div>
    </div>
    <div class="middle_content">
      <div><img src="@/assets/icon/icon-icon-company-saved.svg" /></div>
      <div class="content_0_3">
        {{
          getTypeData_28.content_0_3
            ? getTypeData_28.content_0_3
            : "文字（範例）文字（範例）"
        }}
      </div>
    </div>
    <div class="bottom_content content_0_4">
      {{
        getTypeData_28.content_0_4
          ? getTypeData_28.content_0_4
          : "文字（範例）文字（範例）文字（範例）文字（範例）文字（範例）文字（範例）"
      }}
    </div>
    <div class="more">了解更多</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Type_28",
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
    getTypeData_28() {
      return this.getUploadMaterialForm.typeData_28;
    }
  }
};
</script>

<style lang="scss" scoped>
.top_image {
  background-color: #d8d8d8;
  width: 80px;
  height: 80px;
  margin: 0 auto 8px;
}

.middle_content_title {
  color: #2d2d2d;
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  margin-bottom: 8px;
}

.middle_content {
  margin-bottom: 4px;
  color: #2d2d2d;
  font-size: 14px;
  display: flex;
  align-items: center;

  img {
    margin-right: 8px;
    vertical-align: text-bottom;
  }
}

.bottom_content {
  color: #a9a9a9;
  font-size: 14px;
  max-width: 300px;
}

.more {
  border-top: 1px solid #d8d8d8;
  color: #2d2d2d;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  width: 300px;
  margin-top: 8px;
  padding-top: 16px;
}
</style>
