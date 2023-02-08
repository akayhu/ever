import { governmentCalendar } from "./governmentCalendar";
import { dateFormatter } from "@/utils/dateFormat";

const { holiday, work } = governmentCalendar.result.records.reduce(
  (acc, cur) => {
    const [y, m, d] = cur.date.split("/");
    if (cur.isHoliday === "是") {
      const holiday = { [dateFormatter(y, m, d)]: cur };
      return { ...acc, holiday: { ...holiday, ...acc.holiday } };
    } else if (cur.isHoliday === "否") {
      const work = { [dateFormatter(y, m, d)]: cur };
      return { ...acc, work: { ...work, ...acc.work } };
    }
    return acc;
  },
  {}
);

export { holiday, work };
