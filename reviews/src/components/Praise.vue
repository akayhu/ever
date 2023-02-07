<template>
  <div class="d-flex align-items-center">
    <i
      class="jb_icon_focus"
      :class="{
        primary: primaryColor
      }"
      v-for="i in Math.floor(Number(score))"
      :key="`score-${i}`"
    ></i>
  </div>
</template>

<script>
export default {
  name: "PraiseImg",
  props: {
    score: {
      type: Number,
      default: 1
    },
    primaryColor: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style lang="scss" scoped>
i {
  font-size: 16px;
  margin-right: 4px;
  color: get-color(calm);

  &:last-child {
    margin-right: 0;
  }

  &.primary {
    color: get-color(primary-fill);
  }
}
</style>
