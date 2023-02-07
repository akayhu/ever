<template>
  <div
    class="d-flex"
    :title="disabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null"
  >
    <div
      v-for="n in starFullLength"
      :key="n"
      :disabled="disabled"
      class="d-flex single-star"
      @mouseover="ratingStarMouseHover($event, n)"
      @mouseleave="ratingStarMouseLeave($event, n)"
      @click="clickRateStar(n)"
    >
      <i ref="stars" class="jb_icon_focus d-block"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    ratings: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      starFullLength: 5
    };
  },
  methods: {
    ratingStarMouseHover(event, n) {
      if (this.disabled) return;
      const stars = this.$refs.stars;
      for (let i = 0; i < stars.length; i++) {
        if (i + 1 > n) {
          stars[i].className = "jb_icon_focus jb_icon_unfocus";
        } else if (i + 1 <= n) {
          stars[i].className = "jb_icon_focus";
        }
      }
    },
    ratingStarMouseLeave(event, n) {
      if (this.disabled) return;
      const stars = this.$refs.stars;
      for (let i = 0; i < stars.length; i++) {
        if (i + 1 > this.ratings) {
          stars[i].className = "jb_icon_focus jb_icon_unfocus";
        } else if (i + 1 <= this.ratings) {
          stars[i].className = "jb_icon_focus";
        }
      }
    },
    clickRateStar(starNumber) {
      this.$emit("star-clicked", starNumber);
    }
  }
};
</script>
