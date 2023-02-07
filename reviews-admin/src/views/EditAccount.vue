<template>
  <div class="edit-account">
    <div class="title">編輯帳號</div>
    <div class="ad-name">
      <span style="color: #fff;">*</span>
      <span>舊名稱：{{ getEditeAccountName }}</span>
    </div>
    <div class="ad-name">
      <span>*</span>
      <span>新名稱：</span>
      <span>
        <el-input v-model="adName" placeholder="請輸入名稱"></el-input>
      </span>
    </div>
    <div class="ad-button">
      <el-button type="info" @click="jump('/account')">取消</el-button>
      <el-button type="primary" @click="submit">確定編輯</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "EditAccount",
  data() {
    return {
      adName: ""
    };
  },
  mixins: [commonMixins],
  computed: {
    ...mapGetters("user", ["getUserData"]),
    getEditeAccountName() {
      return this.getUserData.editeAccount.accountName;
    },
    getEditeAccountId() {
      return this.getUserData.editeAccount.accountId;
    }
  },
  methods: {
    ...mapActions("user", ["patchAccounts"]),
    submit() {
      if (!this.adName) return alert("請輸入新名稱");
      this.patchAccounts({
        accountId: this.getEditeAccountId,
        accountName: this.adName
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-account {
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
