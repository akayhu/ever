export default {
  updated: function (el) {
    el.value = el.value.replace(/\D+/, "").replace(/\-/g, "");
    if (Number(el.value) === 0) el.value = 1;
  }
};
