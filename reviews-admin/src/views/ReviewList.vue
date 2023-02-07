<template>
  <div class="review-list">
    <div class="title">待審核評論</div>
    <p>已審核評論請至「評論查詢」列表查看</p>
    <div class="loading" v-if="!reviewsListData.loadingEnd">
      <Loading />
    </div>
    <div
      class="no-pending-review"
      v-if="reviewsItems.length < 1 && reviewsListData.loadingEnd"
    >
      目前無待審核資料
    </div>
    <table
      width="100%"
      border="0"
      v-if="reviewsItems.length > 0 && reviewsListData.loadingEnd"
    >
      <tr>
        <th>評論編號</th>
        <th>評論身份</th>
        <th>發表時間</th>
        <th>pid</th>
        <th>評論公司</th>
        <th>查看/審核</th>
      </tr>
      <review-list-item
        v-for="item in reviewsItems"
        :item="item"
        :key="item.id"
      />
    </table>

    <div
      class="pagination"
      v-if="reviewsItems.length > 0 && reviewsListData.loadingEnd"
    >
      <pages path="review_list" :maxPage="reviewsListData.lastPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ReviewListItem from "@/components/ReviewListItem.vue";
import Pages from "@/components/Pages.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "ReviewList",
  components: {
    ReviewListItem,
    Pages,
    Loading
  },
  computed: {
    ...mapGetters("reviews", ["getReviewsData"]),
    reviewsItems() {
      return this.getReviewsData.reviewsList.items;
    },
    reviewsListData() {
      return this.getReviewsData.reviewsList;
    }
  }
};
</script>

<style lang="scss" scoped>
.review-list {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 895px;
  border-radius: 5px;
  color: #333;
  letter-spacing: 1px;

  .loading,
  .no-pending-review {
    text-align: center;
    padding: 150px 0;
  }

  .title {
    padding: 15px 15px 0;
    font-weight: bold;
    font-size: 20px;
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
