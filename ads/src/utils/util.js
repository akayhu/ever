export const devices = [
  {
    key: "pc",
    label: "PC"
  },
  {
    key: "app",
    label: "APP"
  },
  {
    key: "mobile",
    label: "Mobile"
  }
];

// 阿拉伯數字轉中文數字，一到九十九
export const getNumberConverter = value => {
  const word = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  value++;
  const quotient = Math.floor(value / 10);
  const remainder = value % 10;
  let wordString = word[quotient];
  if (quotient === 1) wordString = "十";
  if (quotient >= 2) wordString += "十";
  wordString += word[remainder];

  return wordString;
};

export const uuid = () => {
  var d = Date.now();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};
