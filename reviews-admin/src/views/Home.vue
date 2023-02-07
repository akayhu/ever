<template>
  <div class="body-main">
    <!-- 未登入 -->
    <div class="login-main" v-if="!getUserData.isLogin">
      <div class="login">
        <div class="login-left">
          <img src="@/assets/error-not-found.png" />
        </div>
        <div class="login-right">
          <dl>
            <dt>後台登入</dt>
            <dd class="meta-content">
              104公司評論，團結的力量，打造更友善的職場生態：邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。
              藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！。<br />
              前台網址：
              <a
                :href="getDomainLink()"
                target="_blank"
                rel="noopener noreferrer"
                title="104公司評論"
              >
                {{ getDomainLink() }}
              </a>
              <br /><br />
              登入權限申請：<span class="name">王之璘(#8260)</span>、
              <span class="name">陳彥百(#8602)</span><br />
              <span class="note">
                (登入後若停留於此頁，代表未有登入權限)
              </span>
            </dd>
            <dd>
              <input
                class="submit"
                type="button"
                @click="loginFunc"
                value="登入"
              />
            </dd>
          </dl>
        </div>
      </div>
      <div class="login-footer">
        一零四資訊科技股份有限公司 版權所有 © 2020
      </div>
    </div>
    <!-- 已登入 -->
    <template v-if="getUserData.isLogin">
      <Aside />
      <div>
        <router-view />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Aside from "@/components/Aside.vue";
import { login } from "@/apis/user";

export default {
  name: "Home",
  components: {
    Aside
  },
  computed: {
    ...mapGetters("user", ["getUserData"])
  },
  methods: {
    getDomainLink(custno) {
      return `https:${process.env.VUE_APP_FRONT_DESK_DOMAIN_URL}`;
    },
    loginFunc() {
      login();
    }
  }
};
</script>

<style lang="scss" scoped>
.body-main {
  width: 1200px;
  margin: 70px auto;
  display: flex;
  justify-content: flex-start;
}

.login-main {
  width: 100%;

  .login {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 110px 150px;
    display: flex;
    justify-content: space-between;

    .login-right {
      width: 40%;

      dt {
        font-size: 24px;
        font-weight: bold;
        color: #7e7e7e;
        border-bottom: 1px solid #7e7e7e;
        padding-bottom: 15px;
        margin-bottom: 10px;
      }

      dd {
        padding: 10px 0;

        &:last-child {
          text-align: right;
        }

        &.ac-error {
          color: red;
        }

        &.meta-content {
          font-size: 16px;
          line-height: 1.5;
          color: #7e7e7e;

          a {
            color: #00bddd;
          }

          span.name {
            color: #6fb827;
          }

          span.note {
            font-size: 12px;
            color: #a9a9a9;
          }
        }

        .submit,
        button {
          padding: 10px 25px;
          border-radius: 5px;
          background-color: #f5b532;
          text-align: center;
          font-size: 16px;
          color: #fff;
          width: 84px;
          border: 1px solid #f5b532;
          font-weight: bold;
        }
      }
    }
  }

  .login-footer {
    text-align: center;
    padding-top: 15px;
    margin: 0 auto;
    color: #7e7e7e;
  }
}

input {
  border: 1px solid #a9a9a9;
  color: #a9a9a9;
  padding: 8px;
  border-radius: 4px;
  width: 95%;
}
</style>
