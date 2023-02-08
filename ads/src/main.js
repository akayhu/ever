// polyfill
import "babel-polyfill";
import "es6-promise/auto";
import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

// import
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import Index from "./Index.vue";
import router from "./router";
import store from "./store";
import Fragment from "vue-fragment";
import moment from "moment";
import vueMoment from "vue-moment";
import Vuelidate from "vuelidate";
import HighchartsVue from "highcharts-vue";
import { sync } from "vuex-router-sync";
import {
  Select,
  Option,
  DatePicker,
  Input,
  Autocomplete,
  Tooltip,
  Dialog,
  Table,
  TableColumn,
  Button
} from "element-ui";
import "moment/locale/zh-tw";
import VTooltip from "v-tooltip";
import ADSDatePicker from "@/components/share/ADSDatePicker/index.js";
import pinia from "@/stores/index.js";
import rollbar from "@/utils/rollbar.js";
import Icon from "@/components/share/Icon.vue";

// css
import "element-ui/lib/theme-chalk/index.css";
import "vue2-animate/dist/vue2-animate.min.css";
import "@/scss/views/tooltip.scss";
import "@/scss/views/copyLinkMessagebox.scss";
import "@/scss/microsoftIsBold.scss";
import "@/scss/share.scss";

// Filters
Vue.filter("numberCommaFormat", value => {
  return value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

// vue-moment
Vue.use(vueMoment, {
  moment
});

// element-ui
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Input);
Vue.use(Autocomplete);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);

// Vuelidate
Vue.use(Vuelidate);

// vue-fragment
Vue.use(Fragment.Plugin);

// BootstrapVue
Vue.use(BootstrapVue);

// Highchart
Vue.use(HighchartsVue);

// ToolTip
Vue.use(VTooltip);

// 廣告平台客製datepicker
Vue.use(ADSDatePicker);

// rollbar
Vue.prototype.$rollbar = rollbar;

// Icon Component
Vue.component("icon", Icon);

// other
Vue.config.productionTip = false;
Vue.config.debug = process.env.VUE_APP_ENV !== "production";
Vue.config.devtools = process.env.VUE_APP_ENV !== "production";

// vuex-router-sync
sync(store, router);

export const VM = new Vue({
  router,
  store,
  pinia,
  render: h => h(Index)
}).$mount("#app");
