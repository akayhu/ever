<template>
  <tr>
    <td>{{ item.companyName }}</td>
    <td>{{ item.custno }}</td>
    <td>
      <button type="button" @click="companyOn(item.custno)">重新上架</button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "CompanyOffItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    getVerifyStateName: function(verifyState) {
      const verifyStateType = {
        2: "不須處理",
        3: "未通過",
        4: "通過"
      };
      return verifyStateType[verifyState];
    },
    companyOn(custno) {
      this.$emit("company-on", custno);
    }
  }
};
</script>

<style lang="scss" scoped>
td {
  padding: 12px 8px;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
  height: 50px;
  text-align: center;
}

button {
  cursor: pointer;
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  text-align: center;
  padding: 6px 20px;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
}
</style>
