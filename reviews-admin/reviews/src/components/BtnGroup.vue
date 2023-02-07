<template>
  <div class="d-flex justify-content-center no-gutters">
    <template v-if="!isVote && hasLeftBtn">
      <Button
        class="group-btn t2"
        :class="className"
        :variant="btnType"
        :path="path"
        :btn-text="leftBtnText"
        :data-gtm-head="gtmPosition === 'head' ? dataGtmLeft : ''"
        :data-gtm-hero="gtmPosition === 'hero' ? dataGtmLeft : ''"
        :data-gtm-btn="gtmPosition === 'btn' ? dataGtmLeft : ''"
      />
    </template>
    <Button
      class="btn-secondary group-btn ml-3 ml-md-5 t2"
      variant="primary"
      :path="rightPath"
      :btn-text="rightBtnText"
      :data-gtm-head="gtmPosition === 'head' ? dataGtmRight : ''"
      :data-gtm-hero="gtmPosition === 'hero' ? dataGtmRight : ''"
      :data-gtm-btn="gtmPosition === 'btn' ? dataGtmRight : ''"
    />
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "BtnGroup",
  components: {
    Button
  },
  props: {
    leftBtnText: {
      type: String,
      required: true
    },
    rightBtnText: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ""
    },
    path: {
      type: String,
      default: "/"
    },
    rightPath: {
      type: String,
      default: "/form/review"
    },
    btnType: {
      type: String,
      default: "primary"
    },
    isVote: {
      type: Boolean,
      default: false
    },
    hasLeftBtn: {
      type: Boolean,
      default: true
    },
    dataGtmLeft: {
      type: String,
      default: ""
    },
    dataGtmRight: {
      type: String,
      default: ""
    },
    gtmPosition: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
.group-btn {
  width: 158px;
  @include media-breakpoint-up(md) {
    width: 154px;
  }
}

.btn-outline-primary {
  border-width: 2px;
  @include media-breakpoint-up(md) {
    border-width: 1px;
  }
}
</style>
