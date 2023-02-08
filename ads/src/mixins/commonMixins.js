import { mapGetters } from "vuex";
import moment from "moment";

moment.suppressDeprecationWarnings = true; // 關閉 moment 提示

export const commonMixins = {
  computed: {
    ...mapGetters("user", ["getUserStatus"])
  },
  methods: {
    // 轉址
    jump(path) {
      this.$router.push({ path }).catch(() => {});
    },
    // 取今年
    getYear() {
      return new Date().getFullYear();
    },
    // 取這個月，月份參數從 0 開始算
    getMonth() {
      return new Date().getMonth();
    },
    // 取今日
    getDay() {
      return new Date().getDate();
    },
    // 取年月日
    getDate() {
      const time = moment(new Date()).format("YYYYMMDD");
      return time;
    },
    // 判斷是有否此網站權限
    getUserSitePermissions(siteId) {
      if (!siteId) return false;
      const { allowedSite } = this.getUserStatus;
      return allowedSite.indexOf(siteId) !== -1 ? true : false;
    }
  }
};
