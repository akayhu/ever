<template>
  <header :class="{ not_Login: !getUserStatus.login }">
    <div class="header_main">
      <div class="header_left">
        <div class="logo_section">
          <h1>
            <router-link to="/">
              <img
                src="@/assets/logo.svg"
                width="180"
                height="26"
                title="104 廣告平台"
              />
            </router-link>
          </h1>
          <span>後台</span>
          <span v-if="showBranch()" class="branch">
            {{ getENV === "lab" ? "pioneer" : getENV }}
          </span>
        </div>
        <div class="menu_section">
          <div v-if="canSeeUsermanagement && getRouterPath">
            <router-link
              to="/userinfo"
              :class="{ focus: $route.meta.activeHeader === 'user_management' }"
              @mouseover="handleHoverMenu('user_management')"
            >
              會員管理
            </router-link>
          </div>
          <div v-if="canSeeAdComponentManagement && getRouterPath">
            <router-link
              to="/weblist"
              :class="{
                focus: $route.meta.activeHeader === 'ad_component_management'
              }"
              @mouseover="handleHoverMenu('ad_component_management')"
            >
              廣告元件管理
            </router-link>
          </div>

          <nav>
            <ul
              v-if="hoverTag === 'user_management'"
              class="nav_main_management"
            >
              <li>
                <router-link
                  to="/userinfo"
                  :class="{ focus: $route.meta.activeNav === 'userinfo' }"
                >
                  使用者資料維護
                </router-link>
              </li>
              <li v-if="getUserAuthority && getUserAuthority.userLogView">
                <router-link to="/userlog"> 使用者行為記錄 </router-link>
              </li>
              <li>
                <router-link
                  to="/authorityInventory"
                  :class="{
                    focus: $route.meta.activeNav === 'authorityInventory'
                  }"
                >
                  權限盤點
                </router-link>
              </li>
            </ul>
            <ul
              v-if="hoverTag === 'ad_component_management'"
              class="nav_main_element"
            >
              <li>
                <router-link
                  to="/weblist"
                  :class="{ focus: $route.meta.activeNav === 'weblist' }"
                >
                  網站維護
                </router-link>
              </li>
              <li v-if="getUserAuthority.productView">
                <router-link
                  to="/product"
                  :class="{ focus: $route.meta.activeNav === 'product' }"
                >
                  廣告與商品設定
                </router-link>
              </li>
              <li v-if="getUserAuthority.padAdLink">
                <a
                  :href="getFrontDeskUrl"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  墊檔素材上刊
                </a>
              </li>
              <li v-if="getUserAuthority.setConditionsView">
                <router-link
                  to="/setconditions"
                  :class="{ focus: $route.meta.activeNav === 'setconditions' }"
                >
                  設定條件
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
        <div v-if="canSeeToolsManagement && getRouterPath" class="tools_menu">
          <div>
            <router-link
              to="/tools"
              :class="{
                focus: $route.meta.activeHeader === 'tools_management'
              }"
            >
              小工具
            </router-link>
          </div>
        </div>
      </div>

      <div
        v-if="getUserStatus.type === 2 && getRouterPath"
        class="header_right"
      >
        <span v-if="getUserStatus.role === 1">
          <img src="@/assets/icon/calendar-icon-p-3.svg" alt="切換身份" />
          切換身份：
        </span>
        <span class="switch_role_block" v-if="getUserStatus.role === 1">
          <span class="change_switch_role_menu" @click="changeSwitchRoleMenu"
            >{{ userRoleName
            }}<img
              src="@/assets/icon/chevron-down.svg"
              class="change_switch_icon"
              :alt="userRoleName"
            />
          </span>
          <ul class="open_switch_role_menu" v-if="openSwitchRoleMenu">
            <li @click="changeWitchRoleStatus(1)">系統管理者</li>
            <li @click="changeWitchRoleStatus(23)">產品管理企劃</li>
            <li @click="changeWitchRoleStatus(21)">產品管理VM</li>
            <li @click="changeWitchRoleStatus(22)">產品主管</li>
            <li @click="changeWitchRoleStatus(12)">整召營運企劃</li>
            <li @click="changeWitchRoleStatus(11)">整召業務銷售人員</li>
            <li @click="changeWitchRoleStatus(13)">整召營運同仁</li>
            <li @click="changeWitchRoleStatus(14)">整召主管</li>
          </ul>
        </span>
        {{ getUserStatus.logonId }}
        <button @click="logoutFunc" class="button_bg_white_small" type="button">
          登出
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { logout } from "@/apis/user";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useAccountStore } from "@/storesPinia/account.js";

export default defineComponent({
  name: "Header",
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const accountStore = useAccountStore();
    const { user } = storeToRefs(userStore);
    const { putToolSwitchRole } = accountStore;
    const getUserStatus = computed(() => user.value);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const getENV = computed(() => process.env.VUE_APP_ENV);
    const canSeeUsermanagement = computed(
      () =>
        getUserStatus.value.type === 2 &&
        (getUserAuthority.value.userInfoView ||
          getUserAuthority.value.userLogView)
    );
    const canSeeAdComponentManagement = computed(
      () =>
        getUserStatus.value.type === 2 &&
        (getUserAuthority.value.webSiteView ||
          getUserAuthority.value.productView ||
          getUserAuthority.value.AdTypeManagementView ||
          getUserAuthority.value.padAdLink)
    );
    const canSeeToolsManagement = computed(
      () => getUserStatus.value.type === 2 && getUserAuthority.value.tools
    );
    const getFrontDeskUrl = computed(
      () =>
        `https:${process.env.VUE_APP_API_DOMAIN_URL}internal/auth/login?relayState=/cushion`
    );
    const getRouterPath = computed(() =>
      route.path !== "/error/403" ? true : false
    );
    let hoverTag = ref("user_management");
    let userRoleName = ref("");
    let openSwitchRoleMenu = ref(false);

    onMounted(() => {
      document.addEventListener("click", e => {
        let thisClassName = e.target.className;
        if (
          thisClassName !== "switch_role_block" &&
          thisClassName !== "change_switch_role_menu" &&
          thisClassName !== "open_switch_role_menu" &&
          thisClassName !== "change_switch_icon"
        ) {
          openSwitchRoleMenu.value = false;
        }
      });
    });

    // 滑鼠滑入開 nav 選單
    const handleHoverMenu = type => {
      hoverTag.value = type;
    };

    // 登出
    const logoutFunc = () => {
      logout();
    };

    // 打開關閉切換身份選單
    const changeSwitchRoleMenu = () => {
      openSwitchRoleMenu.value = !openSwitchRoleMenu.value;
    };

    // 選擇切換身份
    const changeWitchRoleStatus = type => {
      putToolSwitchRole({ role: type }).then(res => {
        userRoleName.value = res.roleName;
      });
    };

    // 顯示 lab 目前是什麼分支推上去的，只在 lab 出現
    const showBranch = () =>
      process.env.VUE_APP_ENV !== "production" &&
      process.env.VUE_APP_ENV !== "staging";

    watch(getUserStatus, (newVal, oldVal) => {
      if (newVal.role !== oldVal.role && getUserAuthority.value)
        userRoleName.value = getUserAuthority.value.authorityName;
    });

    return {
      hoverTag,
      userRoleName,
      openSwitchRoleMenu,
      getUserStatus,
      getUserAuthority,
      canSeeUsermanagement,
      canSeeAdComponentManagement,
      canSeeToolsManagement,
      getFrontDeskUrl,
      getRouterPath,
      getENV,
      handleHoverMenu,
      logoutFunc,
      changeSwitchRoleMenu,
      changeWitchRoleStatus,
      showBranch
    };
  }
});
</script>

<style lang="scss" scoped>
%menu_a_tag {
  padding: 22px 47px 20px;
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
  }
}

header {
  background-color: #fff;
  width: 100%;
  min-width: 1200px;
  border-bottom: solid 1px #d6d6d6;
  position: fixed;
  z-index: 1001;

  &.not_Login {
    box-shadow: 0 2px 4px 0 #a9a9a9;
  }

  .header_main {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 70px;
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: 1.38px;
    min-width: 1280px;
    max-width: 1440px;

    .header_left {
      display: flex;

      .logo_section {
        display: flex;
        align-items: center;
        margin-right: 70px;

        h1 {
          margin-bottom: 0;
          cursor: pointer;

          a {
            outline: none;
          }
        }

        span {
          font-size: 14px;
          color: #8f8f8f;
          margin-left: 10px;
          display: flex;
          align-items: flex-end;
          height: 28px;

          &.branch {
            position: absolute;
            color: #7e7e7e;
            bottom: 0;
            margin-left: 0;
          }
        }
      }

      .menu_section {
        display: flex;

        &:hover {
          nav {
            transition: height 0.3s ease;
            height: 50px;
          }
        }

        > div {
          a {
            @extend %menu_a_tag;
          }
        }
      }

      .tools_menu {
        display: flex;

        a {
          @extend %menu_a_tag;
        }
      }
    }

    .header_right {
      display: flex;
      align-items: center;
      color: #292929;

      > span {
        &:nth-child(1) {
          img {
            vertical-align: bottom;
          }
        }
        &:nth-child(2) {
          position: relative;
          color: #00afb8;
          cursor: pointer;
          margin-right: 8px;
          display: inline-block;
          padding: 25px 0 24px;

          span {
            &.change_switch_role_menu {
              border-right: 1px solid #979797;
              padding: 1px 8px 0 0;

              img {
                margin-left: 12px;
              }
            }
          }

          ul {
            position: absolute;
            z-index: 1002;
            right: 0;
            top: 71px;
            width: 240px;
            background-color: #fff;
            box-shadow: 0 2px 8px 0 #a9a9a9;

            li {
              font-size: 16px;
              color: #333;
              padding: 8px 13px;

              &:hover {
                background-color: #e6f9fa;
              }
            }
          }
        }
      }

      button {
        margin-left: 20px;
      }
    }
  }

  nav {
    width: 100%;
    min-width: 1200px;
    background-color: #e6f9fa;
    height: 0;
    box-shadow: 0 2px 4px 0 #a9a9a9;
    position: absolute;
    top: 71px;
    z-index: 1001;
    left: 0;
    overflow: hidden;
    transition: height 0.3s ease;

    .nav_main_management,
    .nav_main_element {
      min-width: 1200px;
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 1.38px;

      li,
      a {
        width: 200px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #7e7e7e;
        cursor: pointer;
        outline: none;

        &:hover {
          color: #02cbd6;
          font-weight: initial;
        }

        &.focus {
          color: #00afb8;
        }
      }
    }

    .nav_main_management {
      li {
        &:nth-child(1) {
          margin-left: 293px;
        }
      }
    }

    .nav_main_element {
      li {
        &:nth-child(1) {
          margin-left: 293px;
        }
      }
    }
  }
}
</style>
