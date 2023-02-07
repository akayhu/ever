<template>
  <div>
    <Header />
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: "Index",
  data() {
    return {
      isRouterAlive: true
    };
  },
  components: {
    Header
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  box-shadow: 0 2px 4px 0 #b5b5b5;
  height: 70px;
  background-color: #fff;

  .header-main {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;

    .header-left {
      display: flex;
      align-items: center;
      font-size: 20px;
      color: #7e7e7e;

      img {
        width: 180px;
        margin: 22px 10px 22px;
      }
    }

    .header-right {
      padding: 22px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #666;
    }
  }
}
</style>
