<template>
  <footer :class="{ fixed: fixedFooter }">
    <div class="footer_main">
      <div>
        <a
          :href="`http:${getEportalUrl}dwrform/quotation_apply/?`"
          rel="noopener noreferrer"
          target="_blank"
          title="報價管理"
        >
          報價管理
        </a>
        |
        <a
          :href="`http:${getBCPUrl}logon/index.action`"
          rel="noopener noreferrer"
          target="_blank"
          title="業務公版"
        >
          業務公版
        </a>
        |
        <a
          :href="`https:${getManagerphpUrl}admgr/other/index.php?r=login/login`"
          target="_blank"
          rel="noopener noreferrer"
          title="轉址後台"
        >
          轉址後台
        </a>
      </div>
      <div>
        一零四資訊科技股份有限公司 版權所有 © {{ nowYear }} 建議瀏覽器 Chrome
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      nowYear: "",
      fixedFooter: false
    };
  },
  created() {
    const today = new Date();
    const routeName = this.$route.name;
    this.nowYear = today.getFullYear();
    if (
      routeName === "Page403" ||
      routeName === "Page404" ||
      routeName === "Page500" ||
      routeName === "Page503"
    ) {
      this.fixedFooter = true;
    }
  },
  computed: {
    getEportalUrl() {
      return process.env.VUE_APP_PORTAL_URL;
    },
    getBCPUrl() {
      return process.env.VUE_APP_BCP_URL;
    },
    getManagerphpUrl() {
      return process.env.VUE_APP_MANAGERPHP_URL;
    }
  }
};
</script>

<style lang="scss" scoped>
footer {
  background-color: #292929;
  width: 100%;
  min-width: 1200px;

  &.fixed {
    position: fixed;
    bottom: 0px;
    z-index: 3;
  }

  .footer_main {
    max-width: 1440px;
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    font-size: 12px;
    color: #fff;
    margin: 0 auto;
  }

  div {
    line-height: 1.33;
    letter-spacing: 0.75px;

    a {
      color: #fff;
      text-decoration: none;
      font-size: 12px;
    }
  }
}
</style>
