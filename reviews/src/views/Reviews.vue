<template>
  <div>
    <div class="reviews-block d-none d-md-block bg-white pt-8">
      <SearchBar />
    </div>

    <ContainerSidebar class="mx-auto mt-md-6">
      <template slot="main">
        <div class="reviews-bottom_main bg-white rounded">
          <div
            class="reviews-list_page paddingX-rwd py-3 d-flex justify-content-between align-items-center border-bottom"
          >
            <h3 class="title t2 font-weight-bold mb-0">所有匿名評論</h3>
          </div>
          <ReviewTypeTags
            class="paddingX-rwd py-4"
            :currentType="currentReviewType"
            @click="changeReviewType"
          />
          <!-- reviews list loading -->
          <template v-if="isLoading">
            <div
              class="loading d-flex justify-content-center align-items-center"
            >
              <Loading />
            </div>
          </template>
          <!-- empty reviews list -->
          <template v-else-if="isEmptyList">
            <div class="empty-list t4 text-center">
              目前還沒有{{ emptyText.title }}評價～
              <br />
              歡迎會員留下你對於{{ emptyText.content }}評價！
              <div>
                <Button
                  class="btn-secondary empty-list-btn border-0 t4 mt-6"
                  btnText="發表公司評價"
                  data-gtm-btn="發表公司評價"
                  path="/form/review"
                ></Button>
              </div>
            </div>
          </template>
          <!-- reviews list -->
          <template v-else>
            <dl>
              <reviews-list
                v-for="(reviews, index) in reviewsList"
                :key="reviews.id"
                :reviews="reviews"
                :index="index"
                page="reviews"
              />
            </dl>
            <Pagination
              class="paddingX-rwd py-3"
              :currentPage="getReviewsData.currentPage"
              :total="getReviewsData.total"
              @page-change="changePage"
            />
          </template>
        </div>

        <router-link
          v-once
          to="/form/vote"
          data-gtm-banner="匿名發起投票"
          rel="noopener noreferrer"
        >
          <div class="ask-block rounded d-none d-md-block mt-4 py-8">
            <div class="raise-hand_ask font-weight-bold mb-2">舉手發問</div>
            <div class="ask-block-content-sub">
              了解你有興趣的公司，在職員工幫你解答！
              <span class="anonymous-voting ml-4 font-weight-bold">
                匿名發起投票<i class="jb_icon_right font-weight-bold"></i>
              </span>
            </div>
          </div>
        </router-link>
      </template>
      <seen-company slot="side" />
    </ContainerSidebar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ContainerSidebar from "@/components/ContainerSidebar.vue";
import SearchBar from "@/components/SearchBar.vue";
import ReviewsList from "@/components/ReviewsList.vue";
import SeenCompany from "@/components/SeenCompany.vue";
import Loading from "@/components/Loading.vue";
import ReviewTypeTags from "@/components/ReviewTypeTags.vue";
import Pagination from "@/components/Pagination.vue";
import Button from "@/components/Button.vue";
import { TYPEID_MAP, TYPEID_GROUP_NAME_MAP } from "@/utils/enum.js";

export default {
  name: "Reviews",
  components: {
    ContainerSidebar,
    SearchBar,
    ReviewsList,
    SeenCompany,
    Loading,
    ReviewTypeTags,
    Pagination,
    Button
  },
  computed: {
    ...mapGetters("reviews", ["getReviewsData", "isLoading"]),
    reviewsList() {
      return this.getReviewsData.items;
    },
    currentReviewType() {
      return parseInt(this.$route.query.typeId, 10) || 0;
    },
    isEmptyList() {
      return this.reviewsList.length < 1;
    },
    emptyText() {
      const typeName = TYPEID_GROUP_NAME_MAP[this.currentReviewType];
      const text = {
        title: "正職員工",
        content: "任職或曾任職公司的正職員工"
      };

      switch (this.currentReviewType) {
        case TYPEID_MAP.INTERVIEW:
          text.title = typeName;
          text.content = `曾${typeName}過的公司${typeName}`;
          break;
        case TYPEID_MAP.PART_TIME:
        case TYPEID_MAP.INTERN:
          text.title = typeName;
          text.content = `任職或曾任職公司的${typeName}`;
          break;
        case TYPEID_MAP.ALL:
        case TYPEID_MAP.FULL_TIME:
        default:
          break;
      }

      return text;
    }
  },
  methods: {
    changeReviewType(typeId) {
      this.$router.push({
        path: "reviews",
        query: { typeId: typeId }
      });
    },
    changePage(page) {
      const query = this.$route.query;
      this.$router.push({
        path: "reviews",
        query: { ...query, page: page }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.reviews-bottom_main {
  .loading {
    min-height: 100vh;
    @include media-breakpoint-up(md) {
      min-height: 430px;
    }
  }

  .reviews-list_page {
    .title {
      color: #292929;
    }
  }
}

.ask-block {
  background-image: url(~@/assets/review-ask.png);
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: 180px;
  height: 126px;
  color: #7e7e7e;

  @include media-breakpoint-up(md) {
    background-position: 24px 16px;
    padding-left: 258px;
  }
  @include media-breakpoint-up(lg) {
    background-position: 144px 16px;
    padding-left: 378px;
  }
  @include media-breakpoint-up(xl) {
    background-position: 194px 16px;
    padding-left: 428px;
  }

  .raise-hand_ask {
    font-size: 24px;
    line-height: 32px;
    color: #292929;
  }

  .ask-block-content-sub {
    font-size: 16px;
    line-height: 22px;
  }

  .anonymous-voting {
    color: #ff7800;
  }
}

.empty-list {
  padding: 72px 0;
  color: get-color(text-info);

  &-btn {
    height: 32px;
    width: 116px;
  }
}
</style>
