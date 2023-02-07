import Vue from "vue";

export const setGtmDirective = Vue.directive("gtm", function(el, binding) {
  const gtmData = binding.value;
  if (Object.keys(gtmData).length) {
    el.setAttribute(`data-gtm-${gtmData.attr}`, gtmData.val);
  }
});

export default setGtmDirective;
