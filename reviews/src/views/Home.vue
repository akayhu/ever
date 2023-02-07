<template>
  <div class="home-main">
    <div class="home-top_main bg-white" v-once>
      <div class="home-top_bg mb-md-10">
        <div class="home-top_bg_img container-rwd mx-auto">
          <div class="home-top_content mx-auto text-center">
            <h2 class="home-top_title mb-2">員工匿名評論，翻轉職場生態！</h2>
            <div class="home-top_introduction">
              員工在此平台上的發表<span>一律匿名</span>
            </div>
          </div>
          <jumbotron-btn
            class="jumbotron-btn"
            class-name="btn-outline-primary"
            left-btn-text="觀看評論"
            right-btn-text="發表公司評價"
            path="/reviews"
            gtmPosition="hero"
            data-gtm-left="觀看評論"
            data-gtm-right="發表公司評價"
          />
        </div>
      </div>
      <SearchBar />
    </div>

    <ContainerSidebar class="mx-auto mt-md-6">
      <div slot="main" class="home-bottom_main rounded bg-white">
        <div class="home-list_nav pt-md-5 paddingX-rwd border-bottom">
          <ul class="d-flex">
            <li
              class="px-4"
              :class="listTab === 'leaderboard' ? 'focus' : ''"
              @click="changeListTab('leaderboard')"
              data-gtm-list="切換至精選好公司大賞"
            >
              精選好公司大賞
            </li>
            <li
              class="px-4"
              :class="listTab === 'reviews' ? 'focus' : ''"
              data-gtm-list="切換至最新評論"
              @click="changeListTab('reviews')"
            >
              最新評論
            </li>
            <li
              class="px-4"
              :class="listTab === 'votes' ? 'focus' : ''"
              data-gtm-list="切換至最新投票"
              @click="changeListTab('votes')"
            >
              最新投票
            </li>
          </ul>
        </div>
        <!-- reviews list loading -->
        <div class="loading" v-if="!panelDataLoaded">
          <Loading />
        </div>
        <div v-else>
          <div v-show="listTab === 'leaderboard'">
            <LeaderBoardBlock :leaderboardData="top5" />
          </div>
          <div v-show="listTab === 'reviews'">
            <dl>
              <reviews-list
                v-for="(reviews, index) in homeReviewsList"
                :key="reviews.id"
                :reviews="reviews"
                :index="index"
              />
            </dl>
          </div>
          <div v-show="listTab === 'votes'">
            <dl>
              <votes-list
                v-for="(votes, index) in homeVotesList"
                :key="votes.id"
                :votes="votes"
                :index="index"
              />
            </dl>
          </div>
        </div>
        <div class="more-reviews bg-white px-4 py-3 py-md-5 border-top">
          <jumbotron-btn
            class="jumbotron-btn"
            class-name="btn-outline-primary"
            :left-btn-text="btnMap[listTab].leftText"
            :right-btn-text="btnMap[listTab].rightText"
            :path="btnMap[listTab].leftPath"
            :rightPath="btnMap[listTab].rightPath"
            gtmPosition="btn"
            :data-gtm-left="btnMap[listTab].leftGtm"
            :data-gtm-right="btnMap[listTab].rightGtm"
          />
        </div>
      </div>
      <seen-company slot="side" />
    </ContainerSidebar>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import ContainerSidebar from "@/components/ContainerSidebar.vue";
import SeenCompany from "@/components/SeenCompany.vue";
import LeaderBoardBlock from "@/components/leaderBoard/LeaderBoardBlock.vue";
import ReviewsList from "@/components/ReviewsList.vue";
import VotesList from "@/components/VotesList.vue";
import JumbotronBtn from "@/components/BtnGroup.vue";
import SearchBar from "@/components/SearchBar.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "Home",
  components: {
    ContainerSidebar,
    SeenCompany,
    LeaderBoardBlock,
    ReviewsList,
    VotesList,
    JumbotronBtn,
    SearchBar,
    Loading
  },
  data: function() {
    return {
      listTab: "leaderboard",
      btnMap: {
        leaderboard: {
          leftText: "觀看匿名評論",
          leftGtm: "觀看匿名評論",
          leftPath: "/reviews",
          rightText: "前往評比排行榜",
          rightGtm: "前往評比排行榜",
          rightPath: "/top/company"
        },
        reviews: {
          leftText: "全部評論",
          leftGtm: "全部評論",
          leftPath: "/reviews",
          rightText: "發表公司評價",
          rightGtm: "發表公司評價",
          rightPath: "/form/review"
        },
        votes: {
          leftText: "全部投票",
          leftGtm: "全部投票",
          leftPath: "/votes",
          rightText: "發起投票",
          rightGtm: "發起投票",
          rightPath: "/form/vote"
        }
      }
    };
  },
  mounted() {
    let placeholder = document.createElement("div");
    placeholder.setAttribute("class", "footer-placeholder");
    document.body.appendChild(placeholder);
    this.getLeaderBoardTop5();
  },
  beforeDestroy() {
    let placeholder = document.querySelector(".footer-placeholder");
    document.body.removeChild(placeholder);
  },

  computed: {
    ...mapGetters("home", ["getHomeData"]),
    ...mapState("leaderBoard", ["top5"]),
    homeReviewsList() {
      return this.getHomeData.reviewsList;
    },
    homeVotesList() {
      return this.getHomeData.votesList;
    },
    panelDataLoaded() {
      let flag;
      if (this.listTab === "reviews") {
        flag = this.homeReviewsList.length > 0;
      }
      if (this.listTab === "votes") {
        flag = this.homeVotesList.length > 0;
      }
      if (this.listTab === "leaderboard") {
        flag = Object.values(this.top5).length > 0;
      }
      return flag;
    }
  },
  methods: {
    changeListTab(tab) {
      this.listTab = tab;
    },
    ...mapActions("leaderBoard", ["getLeaderBoardTop5"])
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.home-top_main {
  .home-top_bg {
    height: 184px;
    background-color: #ffeedf;
    @include media-breakpoint-up(md) {
      height: 310px;
    }

    .home-top_bg_img {
      height: 184px;
      background-repeat: no-repeat;
      background-position: center 2px;
      background-size: 1440px;
      zoom: 1;
      @include media-breakpoint-up(md) {
        height: 340px;
        background-image: url(~@/assets/home_top_bg.png);
      }
    }

    .home-top_content {
      padding-top: 32px;
      color: #292929;
      @include media-breakpoint-up(md) {
        padding-top: 80px;
      }

      .home-top_title {
        font-size: 18px;
        line-height: 24px;
        font-weight: bold;
        @include media-breakpoint-up(md) {
          font-size: 24px;
          line-height: 32px;
        }
      }

      .home-top_introduction {
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        @include media-breakpoint-up(md) {
          font-size: 16px;
          line-height: 22px;
        }

        span {
          font-weight: normal;
          @include media-breakpoint-up(md) {
            font-weight: bold;
          }
        }
      }
    }

    .jumbotron-btn {
      margin-top: 24px;
      @include media-breakpoint-up(md) {
        margin-top: 42px;
      }
    }
  }
}

.home-bottom_main {
  .loading {
    text-align: center;
    margin: 179px 0;
  }

  ul {
    li {
      height: 27px;
      border-bottom: 3px solid #fff;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.43;
      color: #7e7e7e;
      cursor: pointer;

      &:hover {
        color: get-color(primary);
        border-bottom: 3px solid get-color(primary);
      }

      &.focus {
        border-bottom: 3px solid get-color(primary);
        color: get-color(primary);
      }
    }
  }

  .more-reviews {
    position: sticky;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;

    @include support-ie {
      position: fixed;
    }
    @include media-breakpoint-up(md) {
      position: static;
    }
  }
}
</style>
