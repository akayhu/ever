<template>
  <div
    class="error-block container-rwd d-flex flex-column flex-md-row align-items-center bg-white rounded mx-auto mt-3 mt-md-6"
  >
    <div>
      <img src="@/assets/error-not-found.png" />
    </div>
    <div class="error-content ml-md-16 mt-10 mt-md-0 text-center text-md-left">
      <div class=" t1 font-weight-bold mb-1">
        QQ… 此公司的評論還在搜集當中
      </div>
      <p class="mb-4 t4">請靜候佳音</p>
      <Button
        variant="primary"
        class="btn-outline-primary search-collect-button t4"
        path="/"
        btn-text="回公司評論首頁"
      />
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "SearchCollect",
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.error-block {
  min-height: calc(100vh - 192px);
  padding: 64px 0;
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

  .error-content {
    color: #292929;

    p {
      color: #7e7e7e;
    }
  }

  .search-collect-button {
    height: 32px;
    width: 130px;
  }
}
</style>
