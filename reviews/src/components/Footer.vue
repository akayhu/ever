<template>
  <footer class="app-footer-scoper mt-16" v-once>
    <div class="footer-top-main text-center">
      <div class="footer-title font-weight-bold">
        團結的力量，打造更友善的職場生態！
      </div>
      <p class="mt-3 mb-6 mx-auto">
        「許多人抱怨這個世界哪裡有錯，卻不拿出行動來改變這個錯誤狀況...」<br />
        這是 104
        打造《公司評論》的出發點，台灣的職場環境還有許多需要改善的地方，
        我們邀請您一同積極參與。
      </p>
      <div>
        <router-link
          class="mx-4 t4 font-weight-bold"
          to="/about"
          data-gtm-footer="關於我們"
          rel="noopener noreferrer"
        >
          關於我們
        </router-link>
        <router-link
          class="mx-4 t4 font-weight-bold"
          to="/terms"
          data-gtm-footer="服務條款"
          rel="noopener noreferrer"
        >
          服務條款
        </router-link>
        <router-link
          class="mx-4 t4 font-weight-bold"
          to="/questions"
          data-gtm-footer="常見問答"
          rel="noopener noreferrer"
        >
          常見問答
        </router-link>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style lang="scss" scope>
footer {
  background-image: url(~@/assets/footer_bg.png);
  background-color: #ddd;
  background-repeat: no-repeat;
  background-position: center 0px;
  background-size: 1440px;
  zoom: 1;

  .footer-top-main {
    color: #7e7e7e;
    padding: 68px 0 24px;

    .footer-title {
      font-size: 24px;
      line-height: 32px;
    }

    p {
      width: 588px;
      font-size: 16px;
      line-height: 1.38;
    }

    a {
      color: #7e7e7e;
    }
  }
}
</style>
