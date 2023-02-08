<template>
  <div class="review_main">
    <div class="img_section">
      <div class="image_0_0">
        <img :src="getTypeData_27.image_0_0" class="default_img_bg_color" />
      </div>
    </div>
    <div class="text_section">
      <div class="title">
        <div class="content_0_1">
          {{ getTypeData_27.content_0_1 ? getTypeData_27.content_0_1 : "標題" }}
        </div>
        <span class="content_0_2">{{
          getTypeData_27.content_0_2 ? getTypeData_27.content_0_2 : "產業"
        }}</span>
      </div>
      <div class="info">
        <span class="content_0_3">{{
          getTypeData_27.content_0_3 ? getTypeData_27.content_0_3 : "文字文字"
        }}</span>
        <span class="content_0_4">{{
          getTypeData_27.content_0_4 ? getTypeData_27.content_0_4 : "文字文字"
        }}</span>
      </div>
      <div class="description">
        <span class="content_0_5">
          {{
            getTypeData_27.content_0_5
              ? getTypeData_27.content_0_5
              : "文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字"
          }}
        </span>
      </div>
      <div class="tags">
        <span v-for="i in 4" :key="i" :class="`content_0_${i + 5}`">
          {{
            getTypeData_27[`content_0_${i + 5}`]
              ? getTypeData_27[`content_0_${i + 5}`]
              : "文字"
          }}
        </span>
      </div>
    </div>
    <div class="btn_section">
      了解更多
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_27",
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
    getTypeData_27() {
      return this.getUploadMaterialForm.typeData_27;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 396px;
  line-height: 1.5;
  letter-spacing: 1.5px;
  display: flex;

  .img_section {
    margin: 35px 10px 0 0;

    .image_0_0 {
      background-color: #d8d8d8;
      width: 60px;
      height: 60px;
      margin-bottom: 10px;

      img {
        object-fit: contain;
        min-width: 60px;
      }
    }
  }

  .text_section {
    margin-right: 6px;
    width: 260px;
    word-break: break-all;

    .title {
      font-weight: bold;
      margin-bottom: 10px;

      .content_0_1 {
        font-size: 16px;
        letter-spacing: 1px;
      }

      .content_0_2 {
        border: 1px solid #a9a9a9;
        border-radius: 20px;
        color: #a9a9a9;
        padding: 2px 6px;
        font-size: 12px;
        text-align: center;
      }
    }

    .info {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      color: #a9a9a9;

      .content_0_3 {
        position: relative;

        &:after {
          content: " | ";
          position: relative;
          color: #a9a9a9;
        }
      }
    }

    .description {
      color: #a9a9a9;
      font-size: 10px;
      margin-bottom: 8px;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      span {
        border-radius: 20px;
        background-color: #eee;
        color: #a9a9a9;
        padding: 6px 8px;
        font-size: 12px;
        text-align: center;
      }
    }
  }

  .btn_section {
    border: 1px solid #979797;
    border-radius: 3px;
    padding: 5px 2px;
    text-align: center;
    cursor: pointer;
    margin: auto 0;
    font-size: 12px;
    color: #2d2d2d;
  }
}
</style>
