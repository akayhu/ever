<template>
  <div
    class="error-block container-rwd bg-white rounded mx-auto mt-md-6 d-flex flex-column flex-md-row align-items-center"
    v-once
  >
    <img src="@/assets/error-500.png" width="370" />
    <div class="ml-0 ml-md-16 mt-10 mt-md-0 text-center text-md-left">
      <div class="t1 font-weight-bold mb-1">QQ… 網頁暫時壞掉了～</div>
      <p class="t4">
        請稍等我們把它修好，或透過
        <a :href="get104Url()" rel="noopener noreferrer t4 font-weight-bold">
          意見回饋
        </a>
        反映。
      </p>
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
  name: "Page500",
  components: {
    Button
  },
  methods: {
    get104Url() {
      return `${process.env.VUE_APP_104_URL}question_admin/reaction.cfm`;
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

  .error-button {
    height: 32px;
    width: 130px;
  }
}
</style>
