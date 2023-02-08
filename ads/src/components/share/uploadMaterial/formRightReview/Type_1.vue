<template>
  <div class="default_bg_color image_0_0">
    <img :src="getTypeData_1.image_0_0" class="default_img_bg_color" />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_1",
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
    getTypeData_1() {
      return this.getUploadMaterialForm.typeData_1;
    }
  }
};
</script>

<style lang="scss" scoped>
.default_bg_color {
  background-color: #d8d8d8;
  width: 347px;
  min-height: 134px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.default_img_bg_color {
  background-color: #d8d8d8;
  max-width: 347px;
}
</style>
