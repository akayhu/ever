import Vue from "vue";
import index from "./index.vue";
import router from "@/layouts/defaultLayout";
import store from "@/store";
import {
  DatePicker,
  CheckboxGroup,
  Checkbox,
  Input,
  Button,
  Select,
  Option,
  Radio,
  RadioGroup,
  Collapse,
  CollapseItem,
  Pagination,
  Dialog
} from "element-ui";
import moment from "moment";
import vueMoment from "vue-moment";
import "moment/locale/zh-tw";
import "element-ui/lib/theme-chalk/index.css";

// vue-moment
Vue.use(vueMoment, {
  moment
});

// element-ui
Vue.use(DatePicker);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Pagination);
Vue.use(Dialog);

Vue.config.productionTip = false;
Vue.config.debug = process.env.VUE_APP_ENV !== "production";
Vue.config.devtools = process.env.VUE_APP_ENV !== "production";

new Vue({
  router,
  store,
  render: h => h(index)
}).$mount("#app");
