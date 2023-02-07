<template>
  <div
    class="review-done-block container-rwd bg-white rounded mx-auto mt-md-6 d-flex flex-column flex-md-row align-items-center"
  >
    <img src="@/assets/review-done.png" />
    <div class="ml-0 ml-md-16 mt-10 mt-md-0 text-center text-md-left">
      <div class="t1 font-weight-bold mb-1">評論已送出！</div>
      <p class="t4 mb-4">
        感謝你的填寫，評論內容已交由客服人員審核，<br />
        每間公司在收集到足夠評論份數後，<br />
        才會顯示所有評論，再請耐心等候唷！
      </p>
      <button
        class="btn btn-outline-primary t4 font-weight-bold"
        data-gtm-form="回首頁"
        @click="goToHome"
      >
        回首頁
      </button>

      <button
        class="btn btn-secondary ml-3 t4 font-weight-bold"
        data-gtm-form="再發表一則評論"
        @click="goToFormReview"
      >
        再發表一則評論
      </button>
    </div>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "formReviewDone",
  mixins: [commonMixins],
  methods: {
    goToHome() {
      this.jump("/");
    },
    goToFormReview() {
      this.jump("/form/review");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.review-done-block {
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
    width: 252px;
    @include media-breakpoint-up(md) {
      width: 370px;
    }
  }

  p {
    color: #7e7e7e;
  }

  button {
    height: 32px;
    width: 130px;
  }
}
</style>
