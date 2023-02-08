<template>
  <div class="review_main">
    <div class="top_image">
      <div class="default_bg_color image_1_0">
        <img :src="getTypeData_18.image_1_0" class="default_img_bg_color" />
      </div>
    </div>
    <div class="title content_1_1">
      {{ getTypeData_18.content_1_1 ? getTypeData_18.content_1_1 : "標題" }}
    </div>
    <p class="content_1_2">
      {{
        getTypeData_18.content_1_2
          ? getTypeData_18.content_1_2
          : "文字一：內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文（範例）內文"
      }}
    </p>
    <ul>
      <li class="content_1_3">
        {{
          getTypeData_18.content_1_3
            ? getTypeData_18.content_1_3
            : "文字二：文字文字文字文字文字文字文字文字文字文字"
        }}
      </li>
      <li class="content_1_4">
        {{
          getTypeData_18.content_1_4
            ? getTypeData_18.content_1_4
            : "文字三：文字文字文字文字文字文字文字文字文字文字"
        }}
      </li>
      <li class="content_1_5">
        {{
          getTypeData_18.content_1_5
            ? getTypeData_18.content_1_5
            : "文字四：文字文字文字文字文字文字文字文字文字文字"
        }}
      </li>
      <li class="content_1_6">
        {{
          getTypeData_18.content_1_6
            ? getTypeData_18.content_1_6
            : "文字五：文字文字文字文字文字文字文字文字文字文字"
        }}
      </li>
    </ul>
    <div class="more">
      <span class="content_1_7">
        {{
          getTypeData_18.content_1_7 ? getTypeData_18.content_1_7 : "更多職缺"
        }}
      </span>
    </div>
    <div class="bottom_main">
      <span class="content_1_8">
        {{
          getTypeData_18.content_1_8
            ? getTypeData_18.content_1_8
            : "文字七：文字"
        }}
      </span>
      <span class="content_1_9">
        {{
          getTypeData_18.content_1_9
            ? getTypeData_18.content_1_9
            : "文字八：文字"
        }}
      </span>
    </div>
    <div class="bottom_img">
      <div class="default_bg_color image_1_10">
        <img :src="getTypeData_18.image_1_10" class="default_img_bg_color" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_18_2",
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
    getTypeData_18() {
      return this.getUploadMaterialForm.typeData_18;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 347px;

  .top_image {
    .default_bg_color {
      background-color: #d8d8d8;
      width: 337px;
      min-height: 106px;
      margin: 10px 5px 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .default_img_bg_color {
      background-color: #d8d8d8;
      max-width: 337px;
    }
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
    border: 1px solid #fff;
  }

  li {
    font-size: 12px;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 1.5px;
    color: #2d2d2d;
    padding: 5px;
    border: 1px solid #fff;
  }

  .more {
    text-align: right;
    margin-bottom: 20px;

    span {
      padding: 5px;
      border: 1px solid #fff;
      font-size: 10px;
      font-weight: bold;
      line-height: 1.8;
      letter-spacing: 1.25px;
      color: #2d2d2d;
    }
  }

  .bottom_main {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    font-weight: bold;
    line-height: 1.8;
    letter-spacing: 1.25px;
    color: #2d2d2d;

    span {
      padding: 5px;
    }
  }

  .bottom_img {
    .default_bg_color {
      background-color: #d8d8d8;
      width: 337px;
      min-height: 106px;
      margin: 10px 5px 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .default_img_bg_color {
      background-color: #d8d8d8;
      max-width: 337px;
    }
  }
}
</style>
