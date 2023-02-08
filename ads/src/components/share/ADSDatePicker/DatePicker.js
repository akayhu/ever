import Picker from "./Picker.vue";
import DatePanel from "./panel/DatePanel.vue";
import DateRangePanel from "./panel/DateRangePanel.vue";
import MonthRangePanel from "./panel/MonthRangePanel.vue";
import AdsDateRangePanel from "./panel/AdsDateRangePanel.vue";
import AdsDateRangeDualPanel from "./panel/AdsDateRangeDualPanel.vue";

const getPanel = function(type) {
  if (type === "daterange" || type === "datetimerange") {
    return DateRangePanel;
  } else if (type === "monthrange") {
    return MonthRangePanel;
  } else if (type === "singlerange") {
    return AdsDateRangePanel;
  } else if (type === "dualrange") {
    return AdsDateRangeDualPanel;
  }
  return DatePanel;
};

export default {
  mixins: [Picker],

  name: "ADSDatePicker",

  props: {
    type: {
      type: String,
      default: "date"
    },
    timeArrowControl: Boolean
  },

  watch: {
    type(type) {
      if (this.picker) {
        this.unmountPicker();
        this.panel = getPanel(type);
        this.mountPicker();
      } else {
        this.panel = getPanel(type);
      }
    }
  },

  created() {
    this.panel = getPanel(this.type);
  }
};
