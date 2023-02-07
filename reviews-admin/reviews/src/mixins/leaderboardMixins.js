import {
  companySalaryFormat,
  encodeCustno,
  formatDecimalNum
} from "@/utils/index";

export const leaderboardMixins = {
  data() {
    return {
      scoreOverallType: ["salary", "company"]
    };
  },
  computed: {
    isSalary() {
      return this.boardType === "salary";
    },
    theProperScoreKey() {
      return this.scoreOverallType.includes(this.boardType)
        ? "scoreOverall"
        : "score";
    }
  },
  filters: {
    salary: value => `${companySalaryFormat(value)}萬`,
    decimal: formatDecimalNum
  },
  methods: {
    encodeCustno: encodeCustno
  }
};
