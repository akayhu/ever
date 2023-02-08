<template>
  <div :class="getWrapperMainClass">
    <!-- 未登入 -->
    <div
      v-if="getUserStatus.type === 0 && getAccessible"
      class="login_before_main"
    >
      <div>
        <img src="@/assets/before_login.svg" width="285" />
      </div>
      <div>
        <div class="title">歡迎來到104廣告平台</div>
        <p>
          如欲開通服務，請至
          <a
            :href="`${getEportalUrl}jdesktop.jsp`"
            rel="noopener noreferrer"
            target="_blank"
            title="eportal/表單作業/資訊服務權限申請單"
          >
            eportal/表單作業/資訊服務權限申請單
          </a>
          <br />
          填寫申請。
          <router-link
            to="/authority"
            rel="noopener noreferrer"
            target="_blank"
            title="(權限查詢表)"
          >
            (權限查詢表)
          </router-link>
          <br />
          如有問題請洽管理員：<br />
          版位商品:翁維薇(#8343)、劉雅婷(#8583)、王茗萱(#8342)<br />
          廣告檔期或素材上刊:
          張元嘉(#8131)、張麗芳(#8567)、王婷鶯(#8180)、林巧怡(#8103)<br />
          產品使用:陳頤萱(#8667)、徐文達(#8309)<br /><br />
          提醒：每日晚間11:30 ~ 凌晨00:10 為系統作業時間，此時段暫停服務。
        </p>

        <div class="button_block">
          <button class="button_bg_blue_large" @click="loginFunc">登入</button>
        </div>
      </div>
    </div>

    <!-- 晚上 11:30 ~ 00:10 無法登入操作 -->
    <div
      v-if="getUserStatus.type === 0 && !getAccessible"
      class="login_before_main"
    >
      <div>
        <img src="@/assets/error_maintain.svg" width="285" />
      </div>
      <div>
        <div class="maintain_title">廣告上架作業時間</div>
        <p>
          親愛的用戶您好：<br />
          每日晚間11:30 ~ 凌晨00:10 為系統作業時間，此時段暫停服務。<br />
          <br />
          如有緊急事件，請聯絡產品管理者：陳頤萱(#8667)、徐文達(#8309)
        </p>
      </div>
    </div>

    <!-- 已登入 -->
    <router-view v-if="getUserStatus.type !== 0 && getAccessible" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { login } from "@/apis/user";

export default {
  name: "Home",
  computed: {
    ...mapGetters("user", ["getUserStatus"]),
    ...mapState({
      name: state => state.route.name
    }),
    // Router Name
    getRouterName() {
      return this.name;
    },
    // Wrapper Main Class
    getWrapperMainClass() {
      const { getUserStatus, getRouterName } = this;
      if (getUserStatus.type !== 0) {
        switch (getRouterName) {
          case "Home":
            return "wrapper_main_home";
          case "Calendar":
          case "Cushion":
            return "wrapper_main";
          default:
            return "wrapper_main_wide";
        }
      }
      return "wrapper_main_wide";
    },
    // Eportal Url
    getEportalUrl() {
      return `http:${process.env.VUE_APP_PORTAL_URL}`;
    },
    // 是否可登入
    getAccessible() {
      return this.getUserStatus.accessible;
    }
  },
  methods: {
    ...mapActions("user", ["getLogin"]),
    loginFunc() {
      login();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper_main_home {
  width: 1200px;
  margin: 0 auto;
}

.wrapper_main {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0 80px;
}

.wrapper_main_wide {
  width: 1280px;
  margin: 0 auto;
  padding: 20px 0 80px;
}

.login_before_main {
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #fff;
  padding: 120px 80px;
  display: flex;
  justify-content: center;

  > div:nth-child(1) {
    margin-right: 55px;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    line-height: 0.92;
    letter-spacing: 1.5px;
    color: #8f8f8f;
    margin: 14px 0 20px;
  }

  .maintain_title {
    font-size: 20px;
    line-height: 1.4;
    letter-spacing: 1.4px;
    color: #292929;
    margin-bottom: 16px;
  }

  p {
    font-size: 14px;
    line-height: 1.6;
    letter-spacing: 1.38px;
    color: #8f8f8f;
    margin-bottom: 0;

    a {
      font-weight: bold;
      font-size: 14px;
    }
  }

  .button_block {
    margin-top: 20px;
  }
}
</style>
