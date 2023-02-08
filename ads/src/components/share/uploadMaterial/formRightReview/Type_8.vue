<template>
  <div class="review_main">
    <div class="title content_0_0">
      {{ getTypeData_8.content_0_0 ? getTypeData_8.content_0_0 : "標題" }}
    </div>
    <p class="content_0_1">
      {{
        getTypeData_8.content_0_1
          ? getTypeData_8.content_0_1
          : "文字一（範例）文字一（範例）文字一（範例）文字一"
      }}
    </p>
    <div class="sub_content d-flex">
      <p class="content_0_2 m-0">
        {{ getTypeData_8.content_0_2 ? getTypeData_8.content_0_2 : "小標題" }}
      </p>
      <p class="content_0_3 m-0">
        {{
          getTypeData_8.content_0_3
            ? getTypeData_8.content_0_3
            : "文字二（範例）文字二（範例）文字二"
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_8",
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
    getTypeData_8() {
      return this.getUploadMaterialForm.typeData_8;
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 347px;
  line-height: 1.5;
  letter-spacing: 1.5px;

  .title {
    font-size: 16px;
    margin-bottom: 10px;
    color: #2d2d2d;
    padding: 5px;
    margin-bottom: 10px;
  }

  .content_0_1 {
    font-size: 12px;
    padding: 5px;
    color: #a9a9a9;
    margin-bottom: 10px;
  }

  .sub_content {
    font-size: 12px;

    .content_0_2 {
      flex-grow: 1;
      max-width: 100%;
      padding: 5px;
      color: #2d2d2d;
    }

    .content_0_3 {
      width: 250px;
      padding: 5px;
      color: #a9a9a9;
    }
  }
}
</style>
