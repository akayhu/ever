<template>
  <el-date-picker
    v-model="dateValue"
    type="daterange"
    align="right"
    unlink-panels
    range-separator="至"
    start-placeholder="開始日期"
    end-placeholder="结束日期"
    @change="time($event)"
    value-format="yyyy-MM-dd"
  >
  </el-date-picker>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    getSearchTime: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      dateValue: ""
    };
  },
  methods: {
    time(picker) {
      const searchTime = {
        searchTimeStart: picker[0],
        searchTimeEnd: picker[1]
      };
      this.getSearchTime(searchTime);
    }
  }
};
</script>
