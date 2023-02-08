import { MonthFormat, DateFormat, dateFormatter } from "@/utils/dateFormat";
import moment from "moment";

export const getSatSunAttr = item => (attrs = { six: "six", sun: "day" }) => {
  return item.week === "六" ? attrs.six : item.week === "日" ? attrs.sun : "";
};

// 取某年某月有幾天
export const getDaysInYearMonth = (year, month) => {
  if (year === undefined && month === undefined) {
    const today = new Date(); // 今天日期;
    year = today.getFullYear(); // 今年
    month = today.getMonth(); // 這個月，月份參數從 0 開始算
    // const day = today.getDate(); // 今日
  }
  return moment(`${year}-${month}`, MonthFormat).daysInMonth();
};

const extractData = (data, { year, month, days }) => {
  return data.reduce((acc, cur) => {
    // 展開檔期資料
    let tempData = {};
    // 檔期開始
    const layouStartDate = moment(
      `${cur.layouStartYear}-${cur.layouStartMonth}-${cur.layouStartDay}`
    );
    // 檔期結束
    const layouEndDate = moment(
      `${cur.layouEndYear}-${cur.layouEndMonth}-${cur.layouEndDay}`
    );
    // 檔期總天數
    const layouDays = layouEndDate.diff(layouStartDate, "days") + 1;

    // 傳入的年月
    const currentMonth = moment(`${year}-${month}`);
    // 起始日
    let startDay = cur.layouStartDay;
    // 如果傳入的年月在檔期在開始月後，起始日要為1號
    if (currentMonth.isAfter(layouStartDate, "month")) {
      startDay = 1;
    }
    // 如果傳入的年月在檔期在結束月前，結束日要為傳入的當月總天數
    let endDay = cur.layouEndDay;
    if (currentMonth.isBefore(layouEndDate, "month")) {
      endDay = days;
    }

    // 決定當月檔期開始時間
    const durationStartDate =
      startDay == 1 ? moment(`${year}-${month}-${startDay}`) : layouStartDate;
    // 決定當月檔期結束時間
    const durationEndDate = moment(`${year}-${month}-${endDay}`);

    // 計算檔期區間的天數（決定要產生的陣列大小）
    let durationDays = durationEndDate.diff(durationStartDate, "days") + 1;
    // 防呆
    durationDays = Math.max(durationDays, 0);
    // console.log(durationDays);
    // 開始展開檔期資料
    if (durationDays > 0) {
      Array.from(Array(durationDays)).forEach((d, index) => {
        process.env.VUE_APP_ENV === "development" &&
          performance.mark("extractData");
        const eachDate = moment(`${year}-${month}-${startDay}`, DateFormat).add(
          index,
          "days"
        );
        // console.log(
        //   index,
        //   eachDate.format(DateFormat),
        //   layouStartDate.format(DateFormat),
        //   layouEndDate.format(DateFormat)
        // );
        if (
          eachDate.isSameOrAfter(layouStartDate) &&
          eachDate.isSameOrBefore(layouEndDate)
        ) {
          tempData[dateFormatter(year, month, startDay + index)] = {
            ...cur,
            start: index === 0,
            end: index === durationDays - 1,
            duration: layouDays,
            durationInMonth: durationDays
          };
        }
      });
    }

    return { ...acc, ...tempData };
  }, {});
};

export const layoutForMap = (data, { year, month }) => {
  const days = getDaysInYearMonth(year, month);
  return data.map(x => {
    return {
      ...x,
      layouMap: extractData(x.layouData, { year, month, days })
    };
  });
};

export const remarksForMapping = (year, month) => data => {
  const days = getDaysInYearMonth(year, month);
  return extractData(data, { year, month, days });
};

export const severalForMapping = data => {
  return data.reduce((acc, cur) => {
    const data = {
      [dateFormatter(
        cur.layouStartYear,
        cur.layouStartMonth,
        cur.layouStartDay
      )]: cur.several
    };

    return { ...acc, ...data };
  }, {});
};

export const layoutMapping = (year, month) => data => {
  const days = getDaysInYearMonth(year, month);
  return layoutForMap(data, { year, month, days });
};
