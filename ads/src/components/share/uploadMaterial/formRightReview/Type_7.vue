<template>
  <div class="review_main d-flex align-items-center">
    <div class="content">
      <div v-html="highlight()"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_7",
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
    getTypeData_7() {
      return this.getUploadMaterialForm.typeData_7;
    }
  },
  methods: {
    highlight() {
      let { getTypeData_7 } = this;
      if (!getTypeData_7.content_0_0) {
        return getTypeData_7.content_0_1 || "文字（範例）文字（範例）";
      }
      return getTypeData_7.content_0_1.replace(
        new RegExp(getTypeData_7.content_0_0, "i"),
        match => {
          return '<span class="highlight">' + match + "</span>";
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.review_main {
  width: 416px;
  font-weight: bold;
  line-height: 1.5;
  letter-spacing: 1.5px;
}

::v-deep .highlight {
  color: #00afb8;
  background-color: #c9f3f5;
  padding: 4px 2px;
  margin: 0 2px;
}
</style>
