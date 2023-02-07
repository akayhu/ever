<template>
  <div class="vote-review">
    <div class="title">投票查詢</div>
    <p>待審核評論請至「投票審核」列表查看</p>
    <div class="vote-condition">
      <div class="query-time">
        查詢區間：
        <DatePicker :getSearchTime="getSearchTime" />
      </div>
      <div class="approval-status">
        審核狀態：
        <el-checkbox-group v-model="approvalStatusValue">
          <el-checkbox label="4">審核通過</el-checkbox>
          <el-checkbox label="3">審核不通過</el-checkbox>
          <el-checkbox label="2">不須處理</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="comment-company">
        投票公司：
        <el-input v-model="custno" placeholder="custno"></el-input>
        投票編號：
        <el-input v-model="id" placeholder="投票編號"></el-input>
        發起會員：
        <el-input v-model="pid" placeholder="pid"></el-input>
      </div>
      <div class="submit">
        <el-button type="primary" @click="searchSubmit()">送出篩選</el-button>
      </div>
    </div>
    <div
      class="screen-copy"
      v-if="searchVotesItem.length < 1 && searchVotesLoading"
    >
      &lt;查詢無資料，請重新篩選查詢&gt;
    </div>
    <div class="loading" v-if="!searchVotesLoading">
      <Loading />
    </div>
    <table
      width="100%"
      border="0"
      v-if="searchVotesItem.length > 0 && searchVotesLoading"
    >
      <tr>
        <th>投票編號</th>
        <th>發表時間</th>
        <th>pid</th>
        <th>評論公司</th>
        <th>審核狀態</th>
        <th>查看/審核</th>
      </tr>
      <search-list-item
        v-for="item in searchVotesItem"
        :item="item"
        :key="item.id"
        type="votes"
      />
    </table>

    <div
      class="pagination"
      v-if="searchVotesItem.length > 0 && searchVotesLoading"
    >
      <Pages path="search_vote" :maxPage="searchVotesList.lastPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SearchListItem from "@/components/SearchListItem.vue";
import DatePicker from "@/components/DatePicker.vue";
import Pages from "@/components/Pages.vue";
import lodash from "lodash";
import Loading from "@/components/Loading.vue";

export default {
  name: "VoteReview",
  data() {
    return {
      approvalStatusValue: [],
      custno: "",
      id: "",
      pid: "",
      searchTimeStart: "",
      searchTimeEnd: ""
    };
  },
  components: {
    SearchListItem,
    DatePicker,
    Pages,
    Loading
  },
  computed: {
    ...mapGetters("votes", ["getVotesData"]),
    searchVotesItem() {
      return this.getVotesData.votesSearchList.items;
    },
    searchVotesLoading() {
      return this.getVotesData.votesSearchList.loadingEnd;
    },
    searchVotesList() {
      return this.getVotesData.votesSearchList;
    }
  },
  methods: {
    ...mapActions("votes", ["getVotesSearch", "changeSearchCondition"]),
    getSearchTime: function(time) {
      this.searchTimeStart = time.searchTimeStart;
      this.searchTimeEnd = time.searchTimeEnd;
    },
    searchSubmit() {
      if (this.approvalStatusValue.length < 1) return alert("請選擇審核狀態");

      const submitData = {
        perPage: 10,
        page: 1,
        createStart: this.searchTimeStart,
        createEnd: this.searchTimeEnd,
        auditState: lodash.join(this.approvalStatusValue, ","),
        custno: this.custno,
        id: this.id,
        pid: this.pid
      };

      if (!submitData.createStart) delete submitData.createStart;
      if (!submitData.createEnd) delete submitData.createEnd;
      if (!submitData.custno) delete submitData.custno;
      if (!submitData.id) delete submitData.id;
      if (!submitData.pid) delete submitData.pid;

      window.history.pushState({ page: 1 }, 0, this.$route.path);
      this.$route.query.page = 1;
      this.changeSearchCondition(submitData);
      this.getVotesSearch(submitData);
    }
  }
};
</script>

<style lang="scss" scoped>
.vote-review {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 895px;
  border-radius: 5px;
  color: #333;
  letter-spacing: 1px;

  .title {
    padding: 15px 15px 0;
    font-weight: bold;
    font-size: 20px;
  }

  p {
    padding: 15px 15px;
    color: #9a9a9a;
    font-weight: 400;
  }

  .vote-condition {
    margin: 0 15px 40px;
    background-color: rgba(0, 0, 0, 0.05);
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;

    .approval-status {
      display: flex;
      margin: 20px 0;

      .el-checkbox:nth-child(1) {
        margin-left: 5px;
      }
    }

    .comment-company {
      display: flex;
      align-items: center;

      .el-input {
        width: 150px;
        margin-right: 15px;
      }
    }

    .submit {
      text-align: center;
      margin-top: 30px;
    }
  }

  .loading {
    text-align: center;
    padding: 100px 0;
  }

  .screen-copy {
    text-align: center;
    margin: 100px 0;
    color: #9a9a9a;
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
