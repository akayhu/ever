<template>
  <div class="ranking-container mx-auto mt-md-4">
    <div class="pt-5 paddingX-rwd border-bottom bg-white rounded-top">
      <ul class="d-flex">
        <li>
          <router-link
            to="/top"
            :class="['px-4', { active: $route.name === 'leaderBoard' }]"
            >排行榜</router-link
          >
        </li>
        <li>
          <router-link
            to="/top/compare"
            :class="['px-4', { active: $route.name === 'compare' }]"
            >比較好公司</router-link
          >
        </li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Ranking"
};
</script>

<style lang="scss" scoped>
.ranking-container {
  max-width: 100%;
  @include device-up(md) {
    max-width: 960px;
  }
  @include device-up(lg) {
    max-width: 1200px;
  }
  @include device-up(xl) {
    max-width: 1320px;
  }
}
ul {
  li a {
    display: block;
    height: 27px;
    border-bottom: 3px solid #fff;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    color: get-color(text-info);
    cursor: pointer;
    outline: none;
    transition: none;

    &:hover {
      color: get-color(primary);
      border-bottom: 3px solid get-color(primary);
    }
    &.active {
      border-bottom: 3px solid get-color(primary);
      color: get-color(primary);
    }
  }
}
</style>
