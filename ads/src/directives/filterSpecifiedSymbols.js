import Vue from "vue";
import emojiStrip from "emoji-strip";

// input 禁止輸入 [ ] < > { } \ ^ 與 emoji 表情
export const filterSpecifiedSymbols = Vue.directive("filterSpecifiedSymbols", {
  update: function(el) {
    let inputVal = emojiStrip(el.value);
    let val = inputVal.replace(/[\\\^{}\[\]<>]/g, "");
    el.value = val;
  }
});
