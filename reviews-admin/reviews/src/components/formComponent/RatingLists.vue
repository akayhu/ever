<template>
  <div :class="containerClassName">
    <div
      v-for="option in ratingOptions"
      :key="option.label"
      :title="disabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null"
      class="ratingOptions d-flex align-items-center"
    >
      <div class="rate-type">{{ option.label }}</div>
      <div class="star-icons d-flex">
        <div
          class="single-star"
          v-for="n in starFullLength"
          :key="n"
          :disabled="disabled"
          @mouseover="ratingStarMouseHover($event, n, option.value)"
          @mouseleave="ratingStarMouseLeave($event, n, option.value)"
          @click="clickRateStar(ratingType, n, option.value, option.label)"
        >
          <i
            v-if="ratingType === 'baseScores'"
            :ref="option.value"
            class="jb_icon_focus"
          ></i>
          <i
            v-else-if="ratingType === 'moreScores'"
            :ref="option.value"
            class="jb_icon_focus jb_icon_unfocus"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    containerClassName: {
      type: String,
      default: "default-rating-options"
    },
    ratingOptions: {
      type: Array,
      required: true
    },
    ratings: {
      type: Object,
      required: true
    },
    ratingType: {
      type: String,
      default: "baseScores"
    },
    disabled: {
      type: Boolean,
      default: true
    },
    starFullLength: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {};
  },
  methods: {
    ratingStarMouseHover(event, n, optionValue) {
      if (this.disabled) return;
      const stars = this.$refs[optionValue];
      for (let i = 0; i < stars.length; i++) {
        if (i + 1 > n) {
          stars[i].className = "jb_icon_focus jb_icon_unfocus";
        } else if (i + 1 <= n) {
          stars[i].className = "jb_icon_focus";
        }
      }
    },
    ratingStarMouseLeave(event, n, optionValue) {
      if (this.disabled) return;
      const stars = this.$refs[optionValue];
      for (let i = 0; i < stars.length; i++) {
        if (i + 1 > this.ratings[optionValue]) {
          stars[i].className = "jb_icon_focus jb_icon_unfocus";
        } else if (i + 1 <= this.ratings[optionValue]) {
          stars[i].className = "jb_icon_focus";
        }
      }
    },
    clickRateStar(ratingType, starNumber, optionValue, optionLabel) {
      this.$emit(
        "star-clicked",
        ratingType,
        starNumber,
        optionValue,
        optionLabel
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
.ratingOptions {
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  .rate-type {
    margin-right: 28px;
  }
}
</style>
