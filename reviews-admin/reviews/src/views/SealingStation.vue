<template>
  <div
    class="error-block container-rwd bg-white rounded mx-auto mt-md-6 d-flex flex-column flex-md-row align-items-center"
    v-once
  >
    <img src="@/assets/error-not-found.png" width="370" />
    <div class="ml-0 ml-md-16 mt-10 mt-md-0 text-center text-md-left">
      <div class="t1 font-weight-bold mb-1">QQ… 網站功能維護中～</div>
      <p class="t4">
        親愛的用戶您好：<br />
        為提供您更好的服務， 104公司評論 將進行<br />
        系統更新維護作業，造成您的不便，敬請見諒。
      </p>
      <p v-if="showMaintainTime">
        維護時間：<br />
        {{ maintainTime }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SealingStation",
  computed: {
    showMaintainTime() {
      return window.reviewsAnnouncement
        ? window.reviewsAnnouncement.showMaintainTime
        : false;
    },
    maintainTime() {
      return window.reviewsAnnouncement
        ? window.reviewsAnnouncement.maintainTime
        : "";
    }
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
    a {
      font-weight: bold;
      color: #1654b9;
      &:hover {
        color: #4e91ff;
      }
    }
  }
}
</style>
