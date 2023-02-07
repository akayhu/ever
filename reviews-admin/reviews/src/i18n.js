import Vue from "vue";
import VueI18n from "vue-i18n";
import locale from "./locale";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "zhTW",
  fallbackLocale: "zhTW",
  messages: locale
});

export default i18n;
