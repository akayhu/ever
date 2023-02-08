<template>
  <div class="wrapper_main_403">
    <div>
      <img src="@/assets/error_403.svg" />
    </div>
    <div class="wrapper_main_content">
      <div class="title">無權限</div>
      <p>
        如欲開通服務，請至<a
          :href="`${getPortalUrl}jdesktop.jsp`"
          rel="noopener noreferrer"
          target="_blank"
          >eportal/表單作業/資訊服務權限申請單</a
        >填寫申請。
        <router-link
          to="/authority"
          rel="noopener noreferrer"
          target="_blank"
          title="(權限查詢表)"
        >
          (權限查詢表)
        </router-link>
      </p>
      <p>
        如有疑問請洽管理者：<br />
        版位議題:翁維薇(#8343)、劉雅婷(#8583)、王茗萱(#8342)<br />
        產品問題:陳頤萱(#8667)、徐文達(#8309)
      </p>
      <div class="button_block">
        <button @click="logoutFunc" class="button_bg_white_error">
          回廣告平台首頁
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from "@/apis/user";

export default {
  name: "Page403",
  computed: {
    getPortalUrl() {
      return `http:${process.env.VUE_APP_PORTAL_URL}`;
    }
  },
  methods: {
    // 登出
    logoutFunc() {
      logout();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper_main_403 {
  width: 1280px;
  height: 440px;
  margin: 30px auto 0;
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper_main_content {
    margin-left: 55px;
    width: 405px;

    .title {
      font-size: 20px;
      line-height: 1.4;
      letter-spacing: 1.4px;
      color: #292929;
      margin-bottom: 16px;
    }

    p {
      font-size: 14px;
      line-height: 1.57;
      letter-spacing: 1.21px;
      color: #8f8f8f;
      margin-bottom: 0;

      a {
        font-size: 14px;
        font-weight: bold;
      }
    }

    .button_block {
      margin-top: 20px;
    }
  }
}
</style>
