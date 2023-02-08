import moment from "moment";

export const calcDiffDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  return moment.duration(moment(endDate).diff(startDate)).asDays() + 1;
};

export const calcDays = (startDate, endDate) => {
  if (!startDate || !endDate) return [];
  let dateLists = [];

  let momentStartDate = moment(startDate);
  if (momentStartDate.weekday() === 0)
    momentStartDate = momentStartDate.subtract(6, "days");

  let momentEndDate = moment(endDate);
  if (momentEndDate.weekday() === 0)
    momentEndDate = momentEndDate.subtract(6, "days");

  let sixDaysAfterDate = momentStartDate
    .clone()
    .startOf("week")
    .add(1, "days")
    .format("YYYYMMDD");

  const endDay = momentEndDate
    .clone()
    .startOf("week")
    .add(7, "days")
    .format("YYYYMMDD");

  while (moment(endDay).diff(moment(sixDaysAfterDate), "days") >= 0) {
    dateLists.push({
      start: sixDaysAfterDate,
      startSign: moment(sixDaysAfterDate).format("YYYY/MM/DD")
    });

    sixDaysAfterDate = moment(sixDaysAfterDate)
      .add(1, "days")
      .format("YYYYMMDD");
  }

  return dateLists;
};

export const calcWeeks = (startDate, endDate, reverse = false) => {
  if (!startDate || !endDate) return [];
  let dateLists = [];
  const momentEndDate = moment(new Date(endDate));
  let momentStartDate = moment(new Date(startDate));
  if (momentStartDate.weekday() === 0) {
    momentStartDate = momentStartDate.subtract(6, "days");
  }
  let sixDaysAfterDate = momentStartDate
    .clone()
    .startOf("week")
    .add(7, "days");
  let index = 0;
  while (sixDaysAfterDate.diff(momentEndDate, "days") <= 6) {
    const start = momentStartDate
      .clone()
      .startOf("week")
      .add(1, "days")
      .format("YYYY/MM/DD");
    const end = momentStartDate
      .clone()
      .startOf("week")
      .add(7, "days")
      .format("YYYY/MM/DD");
    dateLists.push({
      start,
      end,
      index
    });
    index++;
    momentStartDate = sixDaysAfterDate.clone().add(1, "days");
    sixDaysAfterDate = sixDaysAfterDate
      .clone()
      .startOf("week")
      .add(7, "days");
  }

  if (reverse) {
    dateLists = dateLists.reverse();
    dateLists.forEach((item, index) => {
      item.index = index;
    });
    return dateLists;
  }

  return dateLists;
};

export const testDateBetween = (startDate, endDate, compareDate) => {
  return moment(compareDate).isBetween(
    moment(startDate)
      .subtract(1, "d")
      .format("YYYY/MM/DD"),
    endDate
  );
};
