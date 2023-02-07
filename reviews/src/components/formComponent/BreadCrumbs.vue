<template>
  <div class="review-breadcrumbs t4">
    <router-link class="level-one" to="/" rel="noopener noreferrer">
      104公司評論
    </router-link>
    <span class="level-br-line mx-2">/</span>
    <router-link class="level-two" :to="levelTwoPath" rel="noopener noreferrer">
      {{ levelTwoTitle }}
    </router-link>
    <span class="level-br-line mx-2">/</span>
    <span class="level-three">{{ levelThreeTitle }}</span>
  </div>
</template>

<script>
export default {
  props: {
    levelTwoTitle: {
      type: String,
      required: true
    },
    levelThreeTitle: {
      type: String,
      required: true
    },
    levelTwoPath: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.review-breadcrumbs {
  .level-br-line {
    width: 6px;
    color: $gray-600;
  }
  .level-one,
  .level-two {
    color: #1654b9;
    &:hover {
      color: #4e91ff;
    }
  }

  .level-three {
    color: $gray-900;
  }
}
</style>
