/**
 * base36 轉成 base10 俗稱解密(decode)
 * @param noBase36 {string}
 * @returns {string}
 */
export function base36to10(noBase36) {
  if (!noBase36) return "";
  return `${parseInt(noBase36, 36)}`;
}

/**
 * base10 轉成 base36 俗稱加密(encode)
 * @param noBase10 {string}
 * @returns {string}
 */
export function base10to36(noBase10) {
  if (!noBase10) return "";
  return (+noBase10).toString(36);
}

export default {
  base36to10,
  base10to36
};
