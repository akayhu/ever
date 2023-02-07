// polyfill
import "babel-polyfill";
import "es6-promise/auto";
import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

import Vue from "vue";
import VueMeta from "vue-meta";
import Index from "./Index.vue";
import router from "./layouts/defaultLayout";
import store from "./store/index";
import {
  Option,
  Tooltip,
  Select,
  Switch,
  RadioGroup,
  Radio,
  Dialog,
  Rate,
  Autocomplete
} from "element-ui";
import { AutoComplete } from "ant-design-vue";
import TextareaAutosize from "vue-textarea-autosize";
import BootstrapVue from "bootstrap-vue";
import Vuelidate from "vuelidate";
import i18n from "./i18n";
import moment from "moment";
import vueMoment from "vue-moment";
import VueJsonLD from "vue-jsonld";
import { sync } from "vuex-router-sync";
import "moment/locale/zh-tw";
import "ant-design-vue/dist/antd.css";
import "placeholder-loading/dist/css/placeholder-loading.min.css";

// vue-moment
Vue.use(vueMoment, {
  moment
});

// BootstrapVue
Vue.use(BootstrapVue);

// Vuelidate
Vue.use(Vuelidate);

// AutoHeight-textarea
Vue.use(TextareaAutosize);

// element-ui
Vue.use(Select);
Vue.use(Option);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Dialog);
Vue.use(Rate);
Vue.use(Autocomplete);

// ant-design-vue
Vue.component(AutoComplete.name, AutoComplete);

// vue-meta
Vue.use(VueMeta);

// JSON-LD
Vue.use(VueJsonLD);

// other
Vue.config.productionTip = false;
Vue.config.debug = process.env.VUE_APP_ENV !== "production";
Vue.config.devtools = process.env.VUE_APP_ENV !== "production";

// vuex-router-sync
sync(store, router);

new Vue({
  router,
  store,
  i18n,
  render: h => h(Index)
}).$mount("#app");
