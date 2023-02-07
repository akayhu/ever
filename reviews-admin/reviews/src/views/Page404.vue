<template>
  <div
    class="error-block container-rwd bg-white rounded mx-auto mt-md-6 d-flex flex-column flex-md-row align-items-center"
    v-once
  >
    <img src="@/assets/error-404.png" />
    <div class="ml-0 ml-md-16 mt-10 mt-md-0 text-center text-md-left">
      <div class="t1 font-weight-bold mb-1">QQ… 找不到任何頁面</div>
      <p class="t4">你要找的評論或公司不存在～</p>
      <Button
        class="btn-outline-primary error-button t4"
        path="/"
        btn-text="回公司評論首頁"
      />
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "Page404",
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.error-block {
  min-height: calc(100vh - 88px);
  padding: 64px 0;
  color: #292929;
  @include media-breakpoint-up(md) {
    min-height: unset;
    padding: 146px 113px;
  }
  @include media-breakpoint-up(lg) {
    padding: 146px 233px;
  }
  @include media-breakpoint-up(xl) {
    padding: 146px 293px;
  }

  img {
    width: 248px;
    @include media-breakpoint-up(md) {
      width: 370px;
    }
  }

  p {
    color: #7e7e7e;
  }

  .error-button {
    height: 32px;
    width: 130px;
  }
}
</style>
