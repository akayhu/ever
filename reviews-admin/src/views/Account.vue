<template>
  <div class="account">
    <div class="title">帳號權限</div>
    <el-button type="danger" @click="jump('/creat_account')">
      +新增帳號
    </el-button>
    <div class="loading" v-if="!getAccountList.loadingEnd">
      <Loading />
    </div>
    <table width="100%" border="0">
      <tr>
        <th>員工編號</th>
        <th>名稱</th>
        <th>動作</th>
      </tr>
      <tr
        v-for="(item, index) in getAccountList.items"
        :key="index.accountName"
      >
        <td>{{ item.accountId }}</td>
        <td>{{ item.accountName }}</td>
        <td>
          <el-button type="primary" @click="editAc(item)">
            編輯
          </el-button>
          <br />
          <el-button type="info" @click="deleteAc(item)">
            刪除
          </el-button>
        </td>
      </tr>
    </table>

    <div
      class="pagination"
      v-if="
        getAccountList.items &&
          getAccountList.items.length > 0 &&
          getAccountList.loadingEnd
      "
    >
      <pages path="account" :maxPage="getAccountList.lastPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Pages from "@/components/Pages.vue";
import Loading from "@/components/Loading.vue";
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "Account",
  components: {
    Pages,
    Loading
  },
  mixins: [commonMixins],
  inject: ["reload"],
  computed: {
    ...mapGetters("user", ["getUserData"]),
    getUserId() {
      return this.getUserData.userId;
    },
    getAccountList() {
      return this.getUserData.accountsList;
    }
  },
  methods: {
    ...mapActions("user", ["deleteAccounts", "editeAccount", "getAccounts"]),
    deleteAc(item) {
      let sure = confirm(`確定要刪除 ${item.accountName} 帳號？`);
      if (sure) {
        this.deleteAccounts({ accountId: item.accountId });
        this.reload();
        setTimeout(() => {
          this.getAccounts({
            perPage: 10,
            page: 1
          });
        }, 300);
      }
    },
    editAc(item) {
      this.editeAccount({
        accountId: item.accountId,
        accountName: item.accountName
      });
      this.jump("/edit_account");
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 895px;
  border-radius: 5px;
  color: #333;
  letter-spacing: 1px;

  .el-button {
    margin: 15px 0 40px 15px;
  }

  .title {
    padding: 15px 15px 0;
    font-weight: bold;
    font-size: 20px;
  }

  .loading {
    text-align: center;
    padding: 150px 0;
  }

  p {
    padding: 15px 15px;
    color: #9a9a9a;
    font-weight: 400;
  }

  table {
    tr {
      &:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.05);
      }

      th {
        color: #9a9a9a;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        padding-bottom: 12px;
        vertical-align: middle;
        text-align: center;
      }

      td {
        padding: 12px 8px;
        vertical-align: middle;
        border-top: 1px solid #e9ecef;
        height: 50px;
        text-align: center;

        .el-button {
          margin: 5px 0 0;
        }
      }
    }
  }

  .pagination {
    margin: 50px 0 30px;
    text-align: center;
  }
}
</style>
