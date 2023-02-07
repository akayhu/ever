import { helpers } from "vuelidate/lib/validators";
import { withParams, ref } from "vuelidate/lib/validators/common";

export const noSpecialWord = regrexRule => {
  const rule = /^[\a-\z\A-\Z0-9\u4e00-\u9fa5\?\？\_\-\.\,\，\/\。\(\)\（\）\~\～\「\」\s]*$/;
  const test = new RegExp(rule);
  return helpers.regex("noSpecialWord", test);
};

export const hasReview = value => {
  return value === true ? false : true;
};

/**
 * 驗證欄位是否可為零
 * @param 預比較驗證的對象
 * @return boolean 回傳結果 true 可為零(通過驗證); false 不可為零(不通過驗證)
 */

export const noZeroIf = comparedValue =>
  withParams({ type: "sameAs", eq: comparedValue }, function(value, parentVm) {
    const isComparedValueDirty = this.$v.reviewData[comparedValue].$dirty;
    // 比較對象值等於 undefined / 0，都會回傳 true
    const isComparedValueZero =
      !!parseInt(ref(comparedValue, this, parentVm), 10) === false;
    // 本身值等於 undefined / 0，都會回傳 true
    const isSelfValueZero = !!parseInt(value, 10) === false;

    return isComparedValueDirty && isComparedValueZero && isSelfValueZero
      ? false
      : true;
  });
