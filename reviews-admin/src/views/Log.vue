<template>
  <div class="log">
    <div class="title">審核紀錄</div>
    <div class="log-condition">
      <div class="query-time">
        查詢區間：
        <DatePicker :getSearchTime="getSearchTime" />
      </div>
      <div class="operator">
        操作人員：
        <el-select v-model="operatorValue" placeholder="全部">
          <el-option
            v-for="(item, index) in getAllAccount"
            :key="index"
            :label="`${item.accountName} (${item.accountId})`"
            :value="item.accountId"
          >
          </el-option>
        </el-select>
      </div>
      <div class="operation-category">
        操作類別：
        <el-checkbox-group v-model="operationCategoryVaule">
          <el-checkbox
            v-for="(item, index) in operationOptions"
            :label="item.value"
            :key="index"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="submit">
        <el-button type="primary" @click="submit">送出篩選</el-button>
      </div>
    </div>

    <div class="screen-copy" v-if="getLogList.length < 1 && searchLogLoading">
      &lt;查詢無資料，請重新篩選查詢&gt;
    </div>

    <div class="loading" v-if="!searchLogLoading">
      <Loading />
    </div>

    <table
      width="100%"
      border="0"
      v-if="getLogList.length > 0 && searchLogLoading"
    >
      <tr>
        <th>Log 編號</th>
        <th>時間</th>
        <th>目標項目</th>
        <th>
          目標Id<br />( 評論編號 / 投票編號 /<br />
          公司編號 / 帳號員編 )
        </th>
        <th>操作人員員編</th>
        <th>重點摘要</th>
      </tr>
      <log-list-item v-for="item in getLogList" :item="item" :key="item.id" />
    </table>

    <div class="pagination" v-if="getLogList.length > 0 && searchLogLoading">
      <Pages path="log" :maxPage="getLogPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LogListItem from "@/components/LogListItem.vue";
import DatePicker from "@/components/DatePicker.vue";
import Pages from "@/components/Pages.vue";
import lodash from "lodash";
import Loading from "@/components/Loading.vue";

export default {
  name: "Log",
  data() {
    return {
      operationOptions: [
        {
          value: "review",
          name: "評論審核"
        },
        {
          value: "vote",
          name: "投票審核"
        },
        {
          value: "accuse",
          name: "申訴審核"
        },
        {
          value: "company",
          name: "公司上下架"
        },
        {
          value: "account",
          name: "帳號權限"
        },
        {
          value: "bossReply",
          name: "老闆回覆"
        }
      ],
      searchTimeStart: "",
      searchTimeEnd: "",
      operationCategoryVaule: [],
      operatorValue: "",
      entityId: ""
    };
  },
  components: {
    LogListItem,
    DatePicker,
    Pages,
    Loading
  },
  computed: {
    ...mapGetters("mockData", ["getMockData"]),
    ...mapGetters("user", ["getUserData"]),
    ...mapGetters("log", ["getLogData"]),
    searchLogLoading() {
      return this.getLogData.logList.searchLogLoading;
    },
    getAllAccount() {
      return this.getUserData.allAccount;
    },
    getLogPage() {
      return this.getLogData.logList.lastPage;
    },
    getLogList() {
      return this.getLogData.logList.items;
    }
  },
  methods: {
    ...mapActions("log", ["getLogSearchList", "setLogSearchCondition"]),
    getSearchTime(time) {
      this.searchTimeStart = time.searchTimeStart;
      this.searchTimeEnd = time.searchTimeEnd;
    },
    submit() {
      let submitData = {
        perPage: 10,
        page: 1,
        createStart: this.searchTimeStart,
        createEnd: this.searchTimeEnd,
        entityId: this.entityId,
        entityType: lodash.join(this.operationCategoryVaule, ","),
        accountId: this.operatorValue
      };

      if (!submitData.createStart) delete submitData.createStart;
      if (!submitData.createEnd) delete submitData.createEnd;
      if (!submitData.entityId) delete submitData.entityId;
      if (!submitData.entityType) delete submitData.entityType;
      if (!submitData.accountId) delete submitData.accountId;

      window.history.pushState({ page: 1 }, 0, this.$route.path);
      this.$route.query.page = 1;
      this.getLogSearchList(submitData);
      this.setLogSearchCondition(submitData);
    }
  }
};
</script>

<style lang="scss" scoped>
.log {
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

  .log-condition {
    margin: 0 15px 40px;
    background-color: rgba(0, 0, 0, 0.05);
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;

    .operator {
      margin-top: 10px;
    }

    .operation-category {
      display: flex;
      margin: 20px 0;

      .el-checkbox:nth-child(1) {
        margin-left: 5px;
      }
    }

    .submit {
      text-align: center;
      margin-top: 30px;
    }
  }

  .screen-copy {
    text-align: center;
    margin: 100px 0;
    color: #9a9a9a;
  }

  .loading {
    text-align: center;
    padding: 100px 0;
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
    }
  }

  .pagination {
    margin: 50px 0 30px;
    text-align: center;
  }
}
</style>
