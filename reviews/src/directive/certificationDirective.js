import Vue from "vue";

// 老闆認證
export const Certification = Vue.directive("Certification", {
  bind: function(el, binding) {
    el.style.border = "1px solid #6fb827";
    el.style.borderRadius = "4px";
    el.style.color = "#6fb827";
    el.style.fontSize = "12px";
    el.style.padding = "2px 6px";
    el.style.display = "inline-block";
    if (binding.value && binding.value.marginLeft) {
      el.style.marginLeft = binding.value.marginLeft;
    }
    if (binding.value && binding.value.marginBottom) {
      el.style.marginBottom = binding.value.marginBottom;
    }
  }
});
