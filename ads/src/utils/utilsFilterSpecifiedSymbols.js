import emojiStrip from "emoji-strip";

// input 禁止輸入 [ ] < > { } \ ^ 與 emoji 表情
export const utilsFilterSpecifiedSymbols = value => {
  let inputVal = emojiStrip(value);
  return inputVal.replace(/[\\\^{}\[\]<>]/g, "");
};

export const utilsFilterEnterSymbols = value => {
  return value.replace(/(\r\n|\n|\r)/g, "");
};

// 傳回字串的 byte 長度
export const byteLength = str => str.replace(/[^\x00-\xff]/g, "xx").length;
