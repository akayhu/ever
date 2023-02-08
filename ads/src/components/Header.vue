<template>
  <header :class="{ not_Login: getUserStatus.type === 0 }">
    <div class="header_main">
      <div class="header_left">
        <div class="logo_section">
          <h1>
            <router-link to="/" title="104 廣告平台">
              <img
                src="@/assets/logo.svg"
                width="180"
                height="26"
                title="104 廣告平台"
                alt="104 廣告平台"
              />
            </router-link>
          </h1>
          <span v-if="showBranch()" class="branch">
            {{ getENV === "lab" ? "pioneer" : getENV }}
          </span>
        </div>
        <div class="menu_section">
          <div
            v-if="
              getUserStatus.type === 2 && getRouterPath && showSalesOrderTab()
            "
          >
            <router-link
              to="/salesOrderList"
              :class="{
                focus: $route.meta.activeHeader === 'salesOrder_manage'
              }"
              @mouseover.native="handleHoverMenu('salesOrder_manage')"
            >
              報價管理
            </router-link>
          </div>
          <div v-if="getUserStatus.type === 2 && getRouterPath">
            <router-link
              to="/calendar"
              :class="{
                focus: $route.meta.activeHeader === 'ad_appointment_management'
              }"
              @mouseover.native="handleHoverMenu('ad_appointment_management')"
            >
              檔期預約管理
            </router-link>
          </div>
          <div
            v-if="
              getUserStatus.type === 2 && getRouterPath && showSalesOrderTab()
            "
          >
            <router-link
              to="/cueManagement"
              :class="{
                focus: $route.meta.activeHeader === 'cue_management'
              }"
              @mouseover.native="handleHoverMenu('cue_management')"
            >
              CUE表管理
            </router-link>
          </div>
          <div v-if="getUserStatus.type === 2 && getRouterPath">
            <router-link
              to="/material"
              :class="{ focus: $route.meta.activeHeader === 'ad_management' }"
              @mouseover.native="handleHoverMenu('ad_management')"
            >
              廣告上刊管理
            </router-link>
          </div>
          <div v-if="getUserStatus.type === 2 && getRouterPath">
            <router-link
              to="/maintain_new"
              :class="{ focus: $route.meta.activeHeader === 'report_query' }"
              @mouseover.native="handleHoverMenu('report_query')"
            >
              報表管理
            </router-link>
          </div>

          <nav v-if="getUserStatus.type === 2">
            <!-- 報價管理 -->
            <div
              v-if="hoverTag === 'salesOrder_manage'"
              class="nav_main_management"
            >
              <router-link
                to="/salesOrderList"
                :class="{ focus: $route.meta.activeNav === 'salesOrderList' }"
              >
                報價單維護
              </router-link>
              <router-link
                to="/internalOrder"
                :class="{ focus: $route.meta.activeNav === 'internalOrder' }"
              >
                內服單維護
              </router-link>
              <router-link
                to="/reservePrice"
                :class="{ focus: $route.meta.activeNav === 'reservePrice' }"
              >
                底價維護
              </router-link>
            </div>
            <!-- 檔期預約管理 -->
            <div
              v-if="hoverTag === 'ad_appointment_management'"
              class="nav_main_management"
            >
              <router-link to="/calendar">
                檔期行事曆
              </router-link>
              <!-- 整召企劃無權限 -->
              <router-link
                v-if="getCanSeePjmanageView"
                to="/pjmanage"
                :class="{ focus: $route.meta.activeNav === 'pjmanage' }"
              >
                專案及版位維護
              </router-link>
            </div>
            <!-- cue表管理 -->
            <div
              v-if="hoverTag === 'cue_management'"
              class="nav_main_management"
            >
              <router-link
                to="/cueManagement"
                :class="{ focus: $route.meta.activeNav === 'cueManagement' }"
              >
                拉CUE
              </router-link>
            </div>
            <!-- 廣告上刊管理 -->
            <div
              v-if="hoverTag === 'ad_management'"
              class="nav_main_management"
            >
              <router-link to="/material">
                上傳素材
              </router-link>
              <router-link to="/proofs">
                廣告樣張
              </router-link>
              <router-link v-if="getCanSeeCushionView" to="/cushion">
                墊檔廣告
              </router-link>
            </div>
            <!-- 報表管理 -->
            <div
              v-if="hoverTag === 'report_query'"
              class="nav_main_management report"
            >
              <router-link to="/maintain">
                企業資料維護
              </router-link>
              <router-link to="/report">
                企業結案報告
              </router-link>
              <router-link to="/leaderboard">
                成效排行榜
              </router-link>
              <router-link to="/proofsReport">
                樣張截圖
              </router-link>
              <a
                :href="getBOUrl"
                class="bo"
                target="_blank"
                rel="noopener noreferrer"
                title="BO"
              >
                BO
              </a>
              <router-link to="/downloadReport">
                下載報表
              </router-link>
            </div>
          </nav>
        </div>
      </div>
      <div
        class="header_right"
        v-if="getUserStatus.type === 2 && getRouterPath"
      >
        <span class="logout_menu" @click.stop="changeLogoutMenu"
          >{{ getUserStatus.logonId
          }}<icon class="logout_menu_icon" iconName="icon-arrow-down" />
          <ul v-if="logoutMenuOpen">
            <li class="logout_menu_item">
              <router-link to="/smallTools">
                查詢小工具
              </router-link>
            </li>
            <li v-if="canGoDashboardPage" class="logout_menu_item">
              <router-link to="/dashboard">
                Dashboard
              </router-link>
            </li>
            <li @click="logoutFunc" class="logout_menu_item">登出</li>
          </ul>
        </span>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { logout } from "@/apis/user";
import userAuthority from "@/utils/userAuthority";

export default {
  name: "Header",
  data() {
    return {
      hoverTag: "ad_appointment_management",
      logoutMenuOpen: false
    };
  },
  mounted() {
    document.addEventListener("click", e => {
      let thisClassName = e.target.className;
      if (
        thisClassName !== "logout_menu" &&
        thisClassName !== "logout_menu_item" &&
        thisClassName !== "logout_menu_icon"
      ) {
        this.logoutMenuOpen = false;
      }
    });
  },
  computed: {
    ...mapGetters("user", ["getUserStatus"]),
    getBOUrl() {
      return `http:${process.env.VUE_APP_BO_URL}`;
    },
    getRouterPath() {
      return this.$route.path !== "/error/403" ? true : false;
    },
    canGoDashboardPage() {
      const conscriptArr = [11, 13, 14];
      return conscriptArr.includes(this.getUserStatus.role);
    },
    getENV() {
      return process.env.VUE_APP_ENV;
    },
    getCanSeeCushionView() {
      return userAuthority[this.getUserStatus.role].cushionView;
    },
    getCanSeePjmanageView() {
      return userAuthority[this.getUserStatus.role].pjmanageView;
    }
  },
  methods: {
    // 滑鼠滑入開 nav 選單
    handleHoverMenu(type) {
      this.hoverTag = type;
    },
    // 登出
    logoutFunc() {
      logout();
    },
    // 打開關閉 Menu
    changeLogoutMenu() {
      this.logoutMenuOpen = !this.logoutMenuOpen;
    },
    // 顯示報價單標籤
    showSalesOrderTab() {
      return (
        process.env.VUE_APP_ENV !== "production" &&
        process.env.VUE_APP_ENV !== "staging"
      );
    },
    // 顯示 lab 目前是什麼分支推上去的，只在 lab 出現
    showBranch() {
      return (
        process.env.VUE_APP_ENV !== "production" &&
        process.env.VUE_APP_ENV !== "staging"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  width: 100%;
  min-width: 1200px;
  border-bottom: solid 1px #d6d6d6;
  position: fixed;
  z-index: 1999;
  top: 0;
  left: 0;
  box-shadow: 0 2px 4px 0 rgba(41, 41, 41, 0.2);

  &.not_Login {
    box-shadow: 0 2px 4px 0 #a9a9a9;
  }

  .header_main {
    min-width: 1164px;
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 0 20px 0 16px;
    height: 70px;
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
  }

  .header_left {
    display: flex;

    .logo_section {
      display: flex;
      align-items: center;
      margin-right: 109px;

      h1 {
        margin-bottom: 0;
        cursor: pointer;
        font-size: initial;

        a {
          outline: none;
        }
      }

      span {
        position: absolute;
        color: #7e7e7e;
        bottom: 0;
      }
    }

    .menu_section {
      display: flex;

      > div {
        a {
          padding: 22px 36px 20px;
          display: inline-block;
          font-weight: bold;
          color: #292929;
          border-bottom: 6px solid #fff;
          outline: none;

          &.focus {
            border-bottom: 6px solid #39c8d0;
            color: #39c8d0;
          }

          &:hover {
            color: #02cbd6;
            font-weight: initial;
            text-decoration: none;
          }
        }
      }

      &:hover {
        nav {
          transition: height 0.3s ease;
          height: 50px;
        }
      }
    }
  }

  .header_right {
    display: flex;
    align-items: center;
    color: #292929;

    span {
      position: relative;
      height: 70px;
      display: inline-block;
      padding-top: 25px;
      cursor: pointer;

      img {
        margin-left: 12px;
      }

      ul {
        position: absolute;
        right: 0;
        top: 71px;
        z-index: 1002;
        width: 160px;
        box-shadow: 0 2px 8px 0 #a9a9a9;
        background-color: #fff;

        li {
          padding: 8px 13px;
          cursor: pointer;

          a {
            color: #333;
            text-decoration: none;
            display: inline-block;
            width: 100%;
          }

          &:hover {
            background-color: #e6f9fa;
          }
        }
      }
    }
  }
}

nav {
  width: 100%;
  min-width: 1200px;
  background-color: #e6f9fa;
  height: 0px;
  box-shadow: 0 2px 4px 0 #a9a9a9;
  position: absolute;
  z-index: 1001;
  top: 71px;
  left: 0;
  overflow: hidden;
  transition: height 0.3s ease;

  .nav_main_management {
    min-width: 1200px;
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1.38px;

    a {
      width: 200px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #7e7e7e;
      cursor: pointer;
      outline: medium none;

      &.focus {
        color: #00afb8;
      }

      &:hover {
        color: #02cbd6;
        font-weight: initial;
        text-decoration: none;
      }

      &:nth-child(1) {
        margin-left: 304px;
      }
    }

    .bo {
      width: 170px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #7e7e7e;
      text-decoration: none;

      &:hover {
        color: #02cbd6;
        font-weight: initial;
      }
    }

    &.report {
      a {
        width: 160px;

        &:nth-child(1) {
          margin-left: 320px;
        }
      }
    }
  }

  .nav_main_element {
    justify-content: center;
  }
}
</style>
