<template>
  <div class="review_main">
    <div class="title">
      <span class="content_0_0">
        {{
          getTypeData_26.content_0_0
            ? getTypeData_26.content_0_0
            : "標題標題標題標題標題"
        }}
      </span>
      <span class="content_0_2">
        {{ getTypeData_26.content_0_2 ? getTypeData_26.content_0_2 : "Tag" }}
      </span>
    </div>
    <p class="content_0_1">
      {{
        getTypeData_26.content_0_1
          ? getTypeData_26.content_0_1
          : "內文（範例）內文（範例）內文（範例）內文（範例"
      }}
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_26",
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
    getTypeData_26() {
      return this.getUploadMaterialForm.typeData_26;
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
    display: flex;
    justify-content: space-between;
    align-items: center;

    .content_0_2 {
      border: 1px solid #a9a9a9;
      color: #a9a9a9;
      padding: 4px;
      border-radius: 4px;
      font-size: 12px;
    }
  }

  .content_0_1 {
    font-size: 12px;
    padding: 5px;
    color: #a9a9a9;
    margin-bottom: 10px;
  }
}
</style>
