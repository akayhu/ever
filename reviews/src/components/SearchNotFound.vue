<template>
  <div
    class="error-block container-rwd d-flex flex-column flex-md-row align-items-center bg-white rounded mx-auto mt-3 mt-md-6"
  >
    <div>
      <img src="@/assets/error-not-found.png" />
    </div>
    <div class="error-content ml-md-16 mt-10 mt-md-0 text-center text-md-left">
      <div class="t1 font-weight-bold mb-1">
        QQ… 似乎找不到任何公司
      </div>
      <p class="mb-0 t4">
        關鍵字無符合公司名稱，建議放寬字詞重新搜尋
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchNotFound"
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
}
</style>
