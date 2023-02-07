<template>
  <header>
    <div class="header-main">
      <div class="header-left">
        <router-link to="/">
          <img
            src="@/assets/logo.png"
            title="104公司評論－匿名員工評論，翻轉職場生態"
            alt="104公司評論"
          />
        </router-link>
        <span>｜ 後台</span>
      </div>
      <div v-if="getUserData.isLogin" class="header-right">
        Hi, {{ getUserData.userName }} [
        <a :href="`https:${logoutDomain}admin/auth/logout`">登出</a>
        ]
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  computed: {
    ...mapGetters("user", ["getUserData"]),
    logoutDomain() {
      return process.env.VUE_APP_API_DOMAIN_URL;
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  min-width: 1200px;
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

      a {
        outline: none;
      }

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
