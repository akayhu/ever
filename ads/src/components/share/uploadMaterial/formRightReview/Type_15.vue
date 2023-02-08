<template>
  <div class="review_main">
    <div class="title content_0_0">
      {{ getTypeData_15.content_0_0 ? getTypeData_15.content_0_0 : "標題" }}
    </div>
    <div class="content_main">
      <div class="left_content">
        <ul>
          <li class="content_0_1">
            {{
              getTypeData_15.content_0_1
                ? getTypeData_15.content_0_1
                : "內文一（範例）內文內文一（範例）"
            }}
          </li>
          <li class="content_0_2">
            {{
              getTypeData_15.content_0_2
                ? getTypeData_15.content_0_2
                : "內文二（範例）內文內文二（範例）"
            }}
          </li>
          <li class="content_0_3">
            {{
              getTypeData_15.content_0_3
                ? getTypeData_15.content_0_3
                : "內文三（範例）內文內文三（範例）"
            }}
          </li>
        </ul>
      </div>
      <div class="right_image">
        <div class="default_bg_color image_0_4">
          <img :src="getTypeData_15.image_0_4" class="default_img_bg_color" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_15",
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
    getTypeData_15() {
      return this.getUploadMaterialForm.typeData_15;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 347px;

  .title {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #2d2d2d;
    padding: 5px;
    margin-bottom: 10px;
  }

  .content_main {
    display: flex;

    .left_content {
      width: 229px;

      li {
        font-size: 12px;
        font-weight: bold;
        line-height: 1.5;
        letter-spacing: 1.5px;
        color: #a9a9a9;
        padding: 5px;
        margin-bottom: 6px;
        border: 1px solid #fff;
        width: 229px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;

        &:nth-child(3) {
          margin-bottom: 0;
        }
      }
    }

    .right_image {
      .default_bg_color {
        width: 97px;
        min-height: 108px;
        background-color: #d8d8d8;
        margin-left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .default_img_bg_color {
        max-width: 97px;
        background-color: #d8d8d8;
      }
    }
  }
}
</style>
