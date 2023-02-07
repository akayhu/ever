<template>
  <div class="review-vote">
    <div class="title">待審核投票</div>
    <p>已審核評論請至「投票查詢」列表查看</p>
    <div class="loading" v-if="!votesListLoading">
      <Loading />
    </div>
    <div
      class="no-pending-vote"
      v-if="votesListItem.length < 1 && votesListLoading"
    >
      目前無待審核資料
    </div>
    <table
      width="100%"
      border="0"
      v-if="votesListItem.length > 0 && votesListLoading"
    >
      <tr>
        <th>投票編號</th>
        <th>發表時間</th>
        <th>pid</th>
        <th>投票公司</th>
        <th>查看/審核</th>
      </tr>
      <vote-list-item
        v-for="item in votesListItem"
        :item="item"
        :key="item.id"
      />
    </table>

    <div class="pagination" v-if="votesListItem.length > 0 && votesListLoading">
      <Pages path="review_vote" :maxPage="votesListData.lastPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VoteListItem from "@/components/VoteListItem.vue";
import Pages from "@/components/Pages.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "ReviewVote",
  components: {
    VoteListItem,
    Pages,
    Loading
  },
  computed: {
    ...mapGetters("votes", ["getVotesData"]),
    votesListItem() {
      return this.getVotesData.votesList.items;
    },
    votesListLoading() {
      return this.getVotesData.votesList.loadingEnd;
    },
    votesListData() {
      return this.getVotesData.votesList;
    }
  }
};
</script>

<style lang="scss" scoped>
.review-vote {
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

  .loading,
  .no-pending-vote {
    text-align: center;
    padding: 150px 0;
  }

  p {
    padding: 15px 15px 50px;
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
    }
  }

  .pagination {
    margin: 50px 0 30px;
    text-align: center;
  }
}
</style>
