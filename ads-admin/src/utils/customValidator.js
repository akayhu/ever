import { helpers } from "vuelidate/lib/validators";

// 只能輸入數字
export const onlyEnterNumbers = () => {
  const rule = /^\d+$/;
  const test = new RegExp(rule);
  return helpers.regex("onlyEnterNumbers", test);
};
