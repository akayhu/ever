import moment from "moment";

export const date = new Date();
export const DateFormat = "YYYY-MM-DD";
export const DateSlashFormat = "YYYY/MM/DD";
export const MonthFormat = "YYYY-MM";
export const MonthSlashFormat = "YYYY/MM";
export const Weekends = ["日", "ㄧ", "二", "三", "四", "五", "六"];

// 帶年月日取時間
export const dateFormatter = (y, m, d) => {
  return moment(`${y}-${m}-${d}`).format(DateFormat);
};

// 取日期
export const getDateFormat = (timeDate = date, format = DateFormat) => {
  return moment(timeDate).format(format);
};

// 取今天日期
export const getToday = (sign = "-") => {
  if (sign === "-") return moment(date).format(DateFormat);
  return moment(date).format(DateSlashFormat);
};

// 取今年
export const getThisYear = () => {
  return moment(date).year();
};

// 取今天日期是否為 10/1 之後(規格：10/1 之後才能預約到明年底)
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
  const monthType = {
    "01": "一月",
    "02": "二月",
    "03": "三月",
    "04": "四月",
    "05": "五月",
    "06": "六月",
    "07": "七月",
    "08": "八月",
    "09": "九月",
    "10": "十月",
    "11": "十一月",
    "12": "十二月"
  };
  return monthType[month];
};

// 取月份 31 天日期資訊，未滿 31 天則空資料補足 31 天
export const getThirtyOneGridDate = (year, month, days) => {
  let monthData = [];
  // 是否為今天
  const today = day => {
    return `${year}/${month < 10 ? `0${month}` : month}/${
      day < 10 ? `0${day}` : day
    }` === getToday("/")
      ? true
      : false;
  };
  // 起始日
  const startDate = day => {
    return moment(`${year}/${month}/${day}`)
      .clone()
      .startOf("isoweek")
      .format("yyyy/MM/DD");
  };
  // 結束日
  const endDate = day => {
    return moment(`${year}/${month}/${day}`)
      .clone()
      .endOf("isoweek")
      .format("yyyy/MM/DD");
  };
  // 當周七日資訊，週一為第一天
  const oneWeekAllDate = date => {
    let allDate = [];
    for (let i = 0; i <= 6; i++) {
      const getDate = formatType =>
        moment(date)
          .add(i, "day")
          .format(formatType);

      allDate.push({
        date: getDate("YYYY/MM/DD"),
        year: Number(getDate("YYYY")),
        month: Number(getDate("MM")),
        day: Number(getDate("DD")),
        week:
          Weekends[
            moment(
              dateFormatter(
                Number(getDate("YYYY")),
                Number(getDate("MM")),
                Number(getDate("DD"))
              )
            ).weekday()
          ]
      });
    }
    return allDate;
  };

  // 取當月 31 天日期
  for (let i = 1; i <= days; i++) {
    monthData.push({
      date: `${year}/${month < 10 ? `0${month}` : month}/${
        i < 10 ? `0${i}` : i
      }`,
      year: year,
      month: month,
      day: i,
      week: Weekends[moment(dateFormatter(year, month, i)).weekday()],
      isToday: today(i),
      oneWeek: {
        startDate: startDate(i),
        endDate: endDate(i),
        oneWeekAllDate: oneWeekAllDate(moment(startDate(i)))
      }
    });
  }
  // 若不到 31 天，湊到 31 天日期，不秀資料
  for (let i = 1; i <= 31 - days; i++) {
    monthData.push({
      date: "",
      year: "",
      month: "",
      day: "",
      week: "",
      isToday: false,
      oneWeek: {
        startDate: "",
        endDate: "",
        oneWeekAllDate: ""
      }
    });
  }

  return monthData;
};

// 取當月週
export const getThisMonthWeek = (year, month) => {
  const result = [];
  let weekStart = moment(`${year}/${month}`)
    .startOf("month")
    .startOf("isoweek");
  let numberOfWeek =
    moment()
      .endOf("month")
      .isoWeeks() -
    moment()
      .startOf("month")
      .isoWeeks();

  for (let week = 0; week <= numberOfWeek; week++) {
    const weekDays = [];

    for (let day = 0; day < 7; day++) {
      const getDate = formatType => {
        return weekStart
          .clone()
          .add(day, "days")
          .format(formatType);
      };
      const today = () => {
        return getDate("YYYY/MM/DD") === getToday("/") ? true : false;
      };

      weekDays.push({
        date: getDate("YYYY/MM/DD"),
        year: Number(getDate("YYYY")),
        month: Number(getDate("MM")),
        day: Number(getDate("DD")),
        week:
          Weekends[
            moment(
              dateFormatter(
                Number(getDate("YYYY")),
                Number(getDate("MM")),
                Number(getDate("DD"))
              )
            ).weekday()
          ],
        isToday: today()
      });
    }

    result.push(weekDays);
    weekStart = weekStart.clone().add(7, "days");
  }
  return result;
};

// 取得兩日期區間內的日期字串
export const getDatesString = (startDate, endDate, format = DateFormat) => {
  let start = moment(startDate).clone();
  let end = moment(endDate).clone();
  let result = [];

  while (start <= end) {
    result.push(start.format(format));
    start.add(1, "days");
  }
  return result;
};

// 取得週間起始日期至結束日期
export const getWeekPeriod = (
  dateString = moment()
    .startOf("month")
    .format("YYYY/MM/DD")
) => {
  let result = [];

  let startDate = moment(dateString).startOf("isoweek");
  let endDate = moment(dateString).endOf("isoweek");

  while (startDate <= endDate) {
    result.push({
      date: startDate.format("YYYY/MM/DD"),
      year: startDate.year(),
      month: startDate.month() + 1,
      day: startDate.date(),
      week: Weekends[startDate.day()],
      isToday: moment().isSame(startDate, "day")
    });
    startDate.add(1, "days");
  }

  return result;
};

export const getFirstDate = (
  date,
  unitString = "isoWeek",
  formatString = DateFormat
) => {
  if (!moment(date).isValid()) return "";

  return moment(date)
    .clone()
    .startOf(unitString)
    .format(formatString);
};

export const getLastDate = (
  date,
  unitString = "isoWeek",
  formatString = DateFormat
) => {
  if (!moment(date).isValid()) return "";

  return moment(date)
    .clone()
    .endOf(unitString)
    .format(formatString);
};
