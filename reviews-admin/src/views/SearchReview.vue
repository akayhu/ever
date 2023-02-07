<template>
  <div class="search-review">
    <div class="title">評論查詢</div>
    <p>待審核評論請至「評論審核」列表查看</p>
    <div class="search-condition">
      <div class="query-time">
        查詢區間：
        <DatePicker :getSearchTime="getSearchTime" />
      </div>
      <div class="approval-status">
        審核狀態：
        <el-checkbox-group v-model="approvalStatusValue">
          <el-checkbox label="6">審核通過</el-checkbox>
          <el-checkbox label="3">審核不通過</el-checkbox>
          <el-checkbox label="2">不須處理</el-checkbox>
          <el-checkbox label="4">申訴下架</el-checkbox>
          <el-checkbox label="5">申訴待審</el-checkbox>
          <el-checkbox label="7">申訴重新上架</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="comment-company">
        評論公司：
        <el-input v-model="custno" placeholder="custno"></el-input>
        評論編號：
        <el-input v-model="id" placeholder="評論編號"></el-input>
        評論會員：
        <el-input v-model="pid" placeholder="pid"></el-input>
      </div>
      <div class="boss-status">
        VIP 操作：
        <el-checkbox-group v-model="bossReply">
          <el-checkbox>老闆回覆</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="isVerify">
          <el-checkbox>老闆認證</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="submit">
        <el-button type="primary" @click="searchSubmit()">送出篩選</el-button>
      </div>
    </div>
    <div
      class="screen-copy"
      v-if="searchReviewsItems.length < 1 && searchReviewsLoading"
    >
      &lt;查詢無資料，請重新篩選查詢&gt;
    </div>
    <div class="loading" v-if="!searchReviewsLoading">
      <Loading />
    </div>
    <table
      width="100%"
      border="0"
      v-if="searchReviewsItems.length > 0 && searchReviewsLoading"
    >
      <tr>
        <th>評論<br />編號</th>
        <th>評論身份</th>
        <th>發表時間</th>
        <th>pid</th>
        <th>評論公司</th>
        <th>審核<br />狀態</th>
        <th width="60">老闆<br />回覆</th>
        <th>查看/審核</th>
      </tr>
      <search-list-item
        v-for="(item, index) in searchReviewsItems"
        :item="item"
        :index="index + 1"
        :key="item.id"
        type="reviews"
      />
    </table>

    <div
      class="pagination"
      v-if="searchReviewsItems.length > 0 && searchReviewsLoading"
    >
      <Pages path="search_review" :maxPage="searchReviewsList.lastPage" />
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
  name: "SearchReview",
  data() {
    return {
      approvalStatusValue: [],
      custno: "",
      id: "",
      pid: "",
      searchTimeStart: "",
      searchTimeEnd: "",
      bossReply: false,
      isVerify: false
    };
  },
  components: {
    SearchListItem,
    DatePicker,
    Pages,
    Loading
  },
  computed: {
    ...mapGetters("reviews", ["getReviewsData"]),
    searchReviewsItems() {
      return this.getReviewsData.reviewsSearchList.items;
    },
    searchReviewsLoading() {
      return this.getReviewsData.reviewsSearchList.loadingEnd;
    },
    searchReviewsList() {
      return this.getReviewsData.reviewsSearchList;
    }
  },
  methods: {
    ...mapActions("reviews", ["getReviewsSearch", "changeSearchCondition"]),
    getSearchTime(time) {
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
        bossReply: this.bossReply ? 1 : 0,
        isVerify: this.isVerify ? 1 : 0,
        id: this.id,
        pid: this.pid
      };

      if (!submitData.createStart) delete submitData.createStart;
      if (!submitData.createEnd) delete submitData.createEnd;
      if (!submitData.custno) delete submitData.custno;
      if (!submitData.bossReply) delete submitData.bossReply;
      if (!submitData.isVerify) delete submitData.isVerify;
      if (!submitData.id) delete submitData.id;
      if (!submitData.pid) delete submitData.pid;

      window.history.pushState({ page: 1 }, 0, this.$route.path);
      this.$route.query.page = 1;
      this.changeSearchCondition(submitData);
      this.getReviewsSearch(submitData);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-review {
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

  .search-condition {
    margin: 0 15px 40px;
    background-color: rgba(0, 0, 0, 0.05);
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;

    .approval-status {
      display: flex;
      margin: 20px 0;

      .el-checkbox-group {
        width: 740px;
        margin-left: 5px;
      }
    }

    .boss-status {
      display: flex;
      margin: 20px 0;

      .el-checkbox-group {
        margin-right: 25px;
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
        font-size: 14px;
        font-weight: 400;
        line-height: 1.5;
        text-align: center;
        padding-bottom: 12px;
        vertical-align: middle;
      }
    }
  }

  .pagination {
    margin: 50px 0 30px;
    text-align: center;
  }
}
</style>
