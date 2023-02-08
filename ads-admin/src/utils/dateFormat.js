import moment from "moment";
moment.suppressDeprecationWarnings = true; // 關閉 moment 提示

export const date = new Date();
export const DateFormat = "YYYY-MM-DD";
export const MonthFormat = "YYYY-MM";
export const Weekends = ["日", "ㄧ", "二", "三", "四", "五", "六"];

// 帶年月日取時間
export const dateFormatter = (y, m, d) => {
  return moment(`${y}-${m}-${d}`).format(DateFormat);
};

// 取日期
export const getDateFormat = (timeDate = date, format = DateFormat) => {
  return moment(timeDate).format(format);
};

// 取今天
export const getToday = () => {
  return moment(date).format(DateFormat);
};

// 取今年
export const getThisYear = () => {
  return moment(date).year();
};

// 取今天日期是否為 9 月底之後
export const getAfterOctober = () => {
  const today = getToday();
  const thisYear = getThisYear();
  return moment(today).isAfter(`${thisYear}-09-30`);
};

// 取起始日與結束日相差天數
export const getDiffDay = (startDay, endDay, sign = "-") => {
  const splitStartDay = startDay.split(sign);
  const splitEndDayDay = endDay.split(sign);
  // 月份使用 0-11 做計算，故月份需減 1
  const diffStartDay = moment([
    splitStartDay[0],
    splitStartDay[1] - 1,
    splitStartDay[2]
  ]);
  const diffEndDay = moment([
    splitEndDayDay[0],
    splitEndDayDay[1] - 1,
    splitEndDayDay[2]
  ]);
  return diffEndDay.diff(diffStartDay, "days");
};

// 取走期最多可預約幾天
export const getMaxBookingDays = timeStart => {
  let today;
  timeStart ? (today = timeStart.replace(/\//g, "-")) : (today = getToday());
  const thisYear = getThisYear();
  const afterOctober = getAfterOctober();
  return getDiffDay(today, `${afterOctober ? thisYear + 1 : thisYear}-12-31`);
};

// 判斷起始日是否為今日之前
export const checkStartDate = startDate => {
  const today = moment(date).format(DateFormat);
  const start = startDate.replace(/\//g, "-");
  return moment(today).isSameOrBefore(start);
};

// 數字月份切換中文月份
export const monthText = month => {
  switch (month) {
    case "01":
      return "一月";
    case "02":
      return "二月";
    case "03":
      return "三月";
    case "04":
      return "四月";
    case "05":
      return "五月";
    case "06":
      return "六月";
    case "07":
      return "七月";
    case "08":
      return "八月";
    case "09":
      return "九月";
    case "10":
      return "十月";
    case "11":
      return "十一月";
    case "12":
      return "十二月";
  }
};
