export default {
  updated: function (el) {
    el.value = el.value.replace(/[^u4e00-u9fa5w]/g, "");
  }
};
