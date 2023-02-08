<template>
  <div class="review_main">
    <div class="default_bg_color image_0_0">
      <img :src="getTypeData_17.image_0_0" class="default_img_bg_color" />
    </div>
    <div class="title content_0_1">
      {{
        getTypeData_17.content_0_1
          ? getTypeData_17.content_0_1
          : "標題標題標題標題標題"
      }}
    </div>
    <p class="content_0_2">
      {{
        getTypeData_17.content_0_2
          ? getTypeData_17.content_0_2
          : "內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）"
      }}
    </p>
    <div class="bottom_content">
      <span class="content_0_3">
        {{
          getTypeData_17.content_0_3
            ? getTypeData_17.content_0_3
            : "文字二：文字"
        }}
      </span>
      <span class="content_0_4">
        {{
          getTypeData_17.content_0_4
            ? getTypeData_17.content_0_4
            : "文字三：文字"
        }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_17",
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
    getTypeData_17() {
      return this.getUploadMaterialForm.typeData_17;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 347px;

  .default_bg_color {
    background-color: #d8d8d8;
    width: 347px;
    min-height: 42px;
    margin: 0 5px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .default_img_bg_color {
    background-color: #d8d8d8;
    max-width: 347px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.25;
    letter-spacing: 1.38px;
    color: #2d2d2d;
    padding: 5px;
    border: 1px solid #fff;
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 1.5px;
    color: #a9a9a9;
    padding: 5px;
  }

  .bottom_content {
    display: flex;
    justify-content: space-between;

    span {
      font-size: 12px;
      font-weight: bold;
      line-height: 1.5;
      letter-spacing: 1.5px;
      color: #2d2d2d;
      padding: 5px;
    }
  }
}
</style>
