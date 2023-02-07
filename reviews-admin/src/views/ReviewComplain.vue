<template>
  <div class="review-complain">
    <div class="title">待審核申訴</div>
    <p></p>
    <div class="loading" v-if="!reviewsAccusesData.loadingEnd">
      <Loading />
    </div>
    <div
      class="no-pending-review"
      v-if="reviewsAccusesItem.length < 1 && reviewsAccusesData.loadingEnd"
    >
      目前無待申訴資料
    </div>
    <table
      width="100%"
      border="0"
      v-if="reviewsAccusesItem.length > 0 && reviewsAccusesData.loadingEnd"
    >
      <tr>
        <th>申訴編號</th>
        <th>評論發表時間</th>
        <th>公司</th>
        <th>查看/審核</th>
      </tr>
      <complain-list-item
        v-for="item in reviewsAccusesItem"
        :item="item"
        :key="item.id"
      />
    </table>

    <div
      class="pagination"
      v-if="reviewsAccusesItem.length > 0 && reviewsAccusesData.loadingEnd"
    >
      <Pages path="review_complain" :maxPage="reviewsAccusesData.lastPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ComplainListItem from "@/components/ComplainListItem.vue";
import Pages from "@/components/Pages.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "ReviewList",
  components: {
    ComplainListItem,
    Pages,
    Loading
  },
  computed: {
    ...mapGetters("reviews", ["getReviewsData"]),
    reviewsAccusesItem() {
      return this.getReviewsData.reviewsAccusesList.items;
    },
    reviewsAccusesData() {
      return this.getReviewsData.reviewsAccusesList;
    }
  }
};
</script>

<style lang="scss" scoped>
.review-complain {
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
