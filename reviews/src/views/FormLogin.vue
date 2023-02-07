<template>
  <div id="review-login-block">
    <light-box
      :title="lightboxData.title"
      :content="lightboxData.content"
      :show-cancel-btn="lightboxData.showCancelBtn"
      :right-btn-content="lightboxData.rightBtnContent"
      :showLightBox="showLightBox"
      :closeAndClearLightBox="closeAndClearLightBox"
      :rightCallBack="clickLogin"
    />
  </div>
</template>

<script>
import LightBox from "@/components/formComponent/LightBox";
import { mapGetters } from "vuex";
import { login } from "@/apis/user";
import * as staticreviewData from "@/utils/reviewData";

export default {
  name: "formReviewLogin",
  components: {
    LightBox
  },
  data() {
    return {
      showLoading: false,
      routerFromPath: null,
      routerToPath: null,
      showLightBox: true,
      lightboxData: {
        title: "",
        content: "",
        showCancelBtn: false,
        leftBtnContent: "",
        rightBtnContent: "",
        leftCallBack: null,
        rightCallBack: null
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.routerFromPath = from.path;
      vm.routerToPath = to.path;
    });
  },
  created() {
    this.lightboxData.title = "登入會員";
    this.lightboxData.content = "登入104會員，即可參與評論或投票";
    this.lightboxData.rightBtnContent = "立即登入";
    this.lightboxData.rightCallBack = this.clickLogin;
  },
  computed: {
    ...mapGetters("user", ["userLoginStatus"])
  },
  methods: {
    clickLogin() {
      login(this.routerToPath.replace("/login", ""));
    },
    closeAndClearLightBox() {
      this.showLightBox = false;
      this.$router.push(this.routerFromPath);
      Object.assign(this.lightboxData, staticreviewData.initLightBoxData());
    }
  }
};
</script>
