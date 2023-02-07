<template>
  <div class="creat-account">
    <div class="title">新增帳號</div>
    <!-- <p>查詢權限僅能瀏覽評論/投票內容，無法執行審核</p> -->
    <div class="ad-account">
      <span>*</span>
      <span>員工編號：</span>
      <span>
        <el-input v-model="adValue" placeholder="請輸入員工編號"></el-input>
      </span>
    </div>
    <div class="ad-name">
      <span>*</span>
      <span>顯示名稱：</span>
      <span>
        <el-input v-model="adName" placeholder="請輸入名稱"></el-input>
      </span>
    </div>
    <div class="ad-button">
      <el-button type="info" @click="jump('/account')">取消</el-button>
      <el-button type="primary" @click="submit">確定儲存</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "CreatAccount",
  data() {
    return {
      adValue: "",
      adName: ""
    };
  },
  mixins: [commonMixins],
  methods: {
    ...mapActions("user", ["postAccounts"]),
    submit() {
      if (!this.adValue) return alert("請輸入員工編號");
      if (!this.adName) return alert("請輸入名稱");
      this.postAccounts({ accountId: this.adValue, accountName: this.adName });
    }
  }
};
</script>

<style lang="scss" scoped>
.creat-account {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 895px;
  border-radius: 5px;
  color: #333;
  letter-spacing: 1px;

  .title {
    padding: 15px 15px;
    font-weight: bold;
    font-size: 20px;
  }

  p {
    padding: 15px 15px 30px;
    color: #9a9a9a;
    font-weight: 400;
  }

  .ad-account,
  .ad-name {
    display: flex;
    align-items: center;
    margin: 10px 15px 0;

    span {
      &:first-child {
        color: red;
        padding-top: 5px;
        margin-right: 5px;
      }
    }
  }

  .ad-button {
    text-align: center;
    margin: 50px 0 15px;
  }
}
</style>
