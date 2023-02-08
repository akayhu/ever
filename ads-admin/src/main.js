// polyfill
import "babel-polyfill";
import "es6-promise/auto";
import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

import { createApp } from "vue";
import Index from "./Index.vue";
import router from "./router";
import { createPinia } from "pinia";
import {
  ElSelect,
  ElOption,
  ElDialog,
  ElTag,
  ElDatePicker
} from "element-plus";
import { VTooltip } from "floating-vue";
import "moment/locale/zh-tw";
import Icon from "@/components/Icon.vue";

import "element-plus/theme-chalk/index.css";
import "@/scss/views/tooltip.scss";
import "@/scss/microsoftIsBold.scss";
import "floating-vue/dist/style.css";
import "@/scss/share.scss";

import numberOnly from "@/directives/numberOnly.js";
import filterSpecifiedSymbols from "@/directives/filterSpecifiedSymbols.js";
import cantSpecialSymbol from "@/directives/cantSpecialSymbol.js";
import rollbar from "@/utils/rollbar.js";

let app;
app = createApp(Index);

app.use(router);

// pinia
app.use(createPinia());

// element-plus
app.use(ElSelect);
app.use(ElOption);
app.use(ElDialog);
app.use(ElTag);
app.use(ElDatePicker);

// rollbar
app.use(rollbar);

// directives
app.directive("numberOnly", numberOnly);
app.directive("filterSpecifiedSymbols", filterSpecifiedSymbols);
app.directive("cantSpecialSymbol", cantSpecialSymbol);
app.directive("tooltip", VTooltip);

// component
app.component("icon", Icon);

// other
app.config.debug = process.env.VUE_APP_ENV !== "production";
app.config.devtools = process.env.VUE_APP_ENV !== "production";

app.mount("#app");
