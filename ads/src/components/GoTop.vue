<template>
  <div class="go_top" @click="scrollToTop">
    <icon iconName="icon-arrow-go-top" />
    <div>回到頂部</div>
  </div>
</template>

<script>
export default {
  name: "GoTop",
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.go_top {
  position: fixed;
  bottom: 40px;
  right: 60px;
  width: 74px;
  height: 72px;
  background-color: #fff;
  box-shadow: 0 0 4px 0 #d0d0d0;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  z-index: 5;

  img {
    display: block;
    margin: 10px auto 6px;
  }

  div {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    letter-spacing: 1.43px;
    color: #00afb8;
    text-align: center;
  }
}
</style>
