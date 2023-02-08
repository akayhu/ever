<template>
  <div class="default_bg_color image_0_0">
    <img :src="getTypeData_25.image_0_0" class="default_img_bg_color" />
    <img src="@/assets/type25_bottom.svg" class="bottom_mask" />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Type_25",
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
    getTypeData_25() {
      return this.getUploadMaterialForm.typeData_25;
    }
  }
};
</script>

<style lang="scss" scoped>
.default_bg_color {
  background-color: #d8d8d8;
  width: 347px;
  min-height: 154px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .default_img_bg_color {
    background-color: #d8d8d8;
    max-width: 347px;
  }

  .bottom_mask {
    position: absolute;
    bottom: -1px;
    width: 347px;
    min-height: 156px;
    z-index: 1;
  }
}
</style>
