import emojiStrip from "emoji-strip";

// input 禁止輸入 [ ] < > { } \ ^ 與 emoji 表情
export const utilsFilterSpecifiedSymbols = value => {
  let inputVal = emojiStrip(value);
  return inputVal.replace(/[\\\^{}\[\]<>]/g, "");
};
