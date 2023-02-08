import Vue from "vue";

// input 只能輸入數字也不可輸入負數
export const numberOnly = Vue.directive("numberOnly", {
  update: function(el) {
    el.value = el.value.replace(/\D+/, "").replace(/\-/g, "");
    if (Number(el.value) === 0) el.value = 1;
  }
});

// 限制 input 輸入內容
export const restrict = Vue.directive("restrict", {
  bind(el, binding) {
    el.addEventListener("keydown", e => {
      // delete, backpsace, tab, escape, enter,
      let special = [46, 8, 9, 27, 13];
      if (
        special.indexOf(e.keyCode) !== -1 ||
        // Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) ||
        // Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) ||
        // Ctrl+X
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return;
      }
      if (
        binding.modifiers["alpha"] &&
        // a-z/A-Z
        e.keyCode >= 65 &&
        e.keyCode <= 90
      ) {
        return;
      }
      if (
        binding.modifiers["number"] &&
        ((!e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) ||
          (e.keyCode >= 96 && e.keyCode <= 105))
      ) {
        return;
      }
      e.preventDefault();
    });
  }
});
