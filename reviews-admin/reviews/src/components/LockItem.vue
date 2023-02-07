<template>
  <div :class="['h-100', { 'lock-item': lockCondition && !isLoginForInfo }]">
    <template v-if="isLoginForInfo || !lockCondition">
      <slot name="normal" :login="isLoginForInfo"></slot>
    </template>
    <template v-else>
      <slot
        name="locked"
        :login="isLoginForInfo"
        :goLogin="showModal"
        :icon="icon"
        :link="link"
      >
        <a href="#" @click.prevent="showModal" :class="link">
          <i :class="icon" />
          {{ text }}
        </a>
      </slot>
      <light-box
        title="登入會員"
        content="登入104會員 , 即可查看上鎖資訊"
        right-btn-content="立即登入"
        :show-cancel-btn="false"
        :rightCallBack="goLogin"
        :showLightBox="popup"
        :closeAndClearLightBox="closeModal"
        :appendToBody="true"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { login } from "@/apis/user";
import LightBox from "@/components/formComponent/LightBox";
export default {
  name: "LockItem",
  components: {
    LightBox
  },
  props: {
    text: {
      type: String,
      default: "登入查看"
    },
    lockCondition: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      icon: "jb_icon_lock mr-1",
      link: "go-to-login",
      popup: false
    };
  },
  methods: {
    goLogin() {
      login(`${window.location.pathname}`);
    },
    showModal() {
      this.popup = true;
    },
    closeModal() {
      this.popup = false;
    }
  },
  computed: {
    ...mapGetters("user", ["isLoginForInfo"])
  }
};
</script>

<style lang="scss">
.go-to-login {
  color: get-color(text-info);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.75;
  &:hover {
    color: get-color(primary);
  }
}
</style>
