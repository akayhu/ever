<template>
  <div class="company-single-vote-right">
    <!-- votes detail loading -->
    <div
      v-if="!getVotesDetailStatus(votesDetail)"
      class="loading d-flex justify-content-center align-items-center bg-white"
    >
      <Loading />
    </div>
    <div
      v-if="getVotesDetailStatus(votesDetail)"
      class="single-vote-content bg-white overflow-hidden"
    >
      <div class="prev-page paddingX-rwd bg-white">
        <router-link
          class="prev-page-btn d-block t4 rounded font-weight-bold"
          :to="{
            name: 'companyReviews',
            params: { custno: encodeCustno(votesDetail.custno) }
          }"
          rel="noopener noreferrer"
          :title="`${votesDetail.company}的所有公司評論`"
          data-gtm-detail="回公司專頁"
        >
          <i class="jb_icon_left d-block d-md-inline"></i>
          <span class="d-none d-md-inline"> 公司專頁</span>
        </router-link>
        <div class="sm-title position-absolute d-md-none font-weight-bold t2">
          投票
        </div>
      </div>
      <div class="prev-page-placeholder d-md-none"></div>
      <div class="vote-content py-4 py-md-8 paddingX-rwd">
        <div class="d-block d-md-flex">
          <div class="vote-content_left d-flex align-items-start">
            <el-tooltip class="item" placement="top">
              <div slot="content" class="text-white t4">
                評論者可從8種植物中任選一個匿名身份；<br />
                不同評論若為相同植物，不代表為同一人<br />
                所填寫。
              </div>
              <img
                v-if="votesDetail.plantId"
                width="40"
                class="rounded-circle mr-3"
                :src="getAnonymousImgUrl(votesDetail.plantId)"
              />
            </el-tooltip>

            <div>
              <div
                class="anonymous-name t4 font-weight-bold"
                v-if="votesDetail.plantId"
              >
                {{ getAnonymousName(votesDetail.plantId) }}
              </div>
              <div
                class="anonymous-time t5"
                v-if="votesDetail.createDate"
                :title="timeDate(votesDetail.createDate)"
              >
                {{
                  [0, "minutes"]
                    | duration("subtract", timeAgo(votesDetail.createDate))
                    | duration("humanize", true)
                }}
              </div>
            </div>
          </div>

          <div class="vote-content_right">
            <div class="company-name d-md-none t3 font-weight-bold mt-4 mb-6">
              <router-link
                :to="{
                  name: 'companyReviews',
                  params: { companyId: companyData.custno }
                }"
                data-gtm-company="公司名稱"
                rel="noopener noreferrer"
              >
                {{ companyData.companyName }}
              </router-link>
            </div>

            <div class="title t2 font-weight-bold mb-3">
              {{ votesDetail.title }}
            </div>

            <div
              class="anonymous-voting d-flex justify-content-between mb-2 t4"
            >
              <span>{{
                !votesHasVote && !votesDetail.isAsker
                  ? "點擊選項即可匿名投票"
                  : "目前投票結果："
              }}</span>
              <span v-if="votesHasVote"></span>
              <span>{{ votesDetail.count }} 人已投票</span>
            </div>
            <div v-if="votesLoading" class="votes-loading text-center">
              <Loading />
            </div>
            <template v-else>
              <div
                class="voting-list"
                v-if="
                  userLoginStatus < 3 && !votesHasVote && !votesDetail.isAsker
                "
              >
                <NotVotingOption
                  v-for="(voteItem, index) in votesDetail.voteItems"
                  :key="voteItem.itemId"
                  :index="index + 1"
                  data-gtm-detail="投票選項"
                  :voted-title="voteItem.item"
                  :itemId="voteItem.itemId"
                  :voteId="votesDetail.id"
                />
              </div>
              <div
                class="voting-list"
                v-if="votesHasVote || votesDetail.isAsker"
              >
                <VotedOption
                  v-for="(voteItem, index) in votesDetail.voteItems"
                  :key="voteItem.itemId"
                  :index="index + 1"
                  :voted-title="voteItem.item"
                  :pa="voteItem.itemPercentage"
                  :count="voteItem.itemCount"
                  :number="voteItem.itemId"
                  :hasVote="voteItem.hasVote"
                />
              </div>
            </template>
            <div
              class="write-reviews d-block d-md-flex align-items-md-center mt-6 mt-md-4"
              v-if="votesHasVote || votesDetail.isAsker"
            >
              <div class="t3 text-center">歡迎匿名分享你在此公司的任職心得</div>
              <Button
                path="/form/review"
                class="mt-4 mt-md-0 ml-md-5 btn-secondary t3"
                btn-text="填寫公司評論"
                data-gtm-detail="填寫公司評論"
              />
            </div>
          </div>
        </div>
        <button
          v-if="!votesHasVote && !votesDetail.isAsker"
          class="see-result d-block text-white rounded mx-auto mt-6 t2 font-weight-bold"
          @click="seeResult"
          data-gtm-detail="觀看結果"
        >
          觀看結果
        </button>
      </div>
    </div>

    <interested-review-vote
      v-if="votesInterestedList.length > 0"
      :data="votesInterestedList"
      type="vote"
    />

    <CareerOpportunities
      v-if="companyJobs.joblist.length > 0"
      :companyJobs="companyJobs"
      class="d-md-none mt-3"
    />

    <light-box
      title="無法投票"
      content="你的履歷上無此公司任職紀錄，請先編輯履歷表才能參與此項投票"
      :show-cancel-btn="true"
      left-btn-content="返回"
      right-btn-content="編輯履歷表"
      :showLightBox="votesLightbox"
      :closeAndClearLightBox="closeLightbox"
      :rightCallBack="goResume"
    />

    <light-box
      title="登入會員"
      content="登入104會員，可以參與投票"
      right-btn-content="立即登入"
      :showLightBox="votesLoginLightbox"
      :closeAndClearLightBox="closeLoginLightbox"
      :rightCallBack="goLogin"
      :showCancelBtn="false"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import InterestedReviewVote from "@/components/InterestedReviewVote.vue";
import CareerOpportunities from "@/components/CareerOpportunities.vue";
import VotedOption from "@/components/VotedOption.vue";
import NotVotingOption from "@/components/NotVotingOption.vue";
import Button from "@/components/Button.vue";
import LightBox from "@/components/formComponent/LightBox";
import Loading from "@/components/Loading.vue";
import { commonMixins } from "@/mixins/commonMixins";
import { login } from "@/apis/user";

export default {
  name: "CompanySingleVote",
  components: {
    InterestedReviewVote,
    CareerOpportunities,
    VotedOption,
    Button,
    NotVotingOption,
    LightBox,
    Loading
  },
  mixins: [commonMixins],
  mounted() {
    // IOS 進入此頁時位置不在最頂端，原因暫時查不到
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapGetters("company", ["getCompanyData"]),
    ...mapGetters("user", ["userLoginStatus"]),
    companyData() {
      return this.getCompanyData.companyData;
    },
    companyJobs() {
      return this.getCompanyData.jobs;
    },
    votesDetail() {
      return this.getCompanyData.votesDetail;
    },
    votesInterestedList() {
      return this.getCompanyData.votesInterestedList.items;
    },
    votesHasVote() {
      return this.getCompanyData.votesHasVote;
    },
    votesLightbox() {
      return this.getCompanyData.openVoteLightbox;
    },
    votesLoginLightbox() {
      return this.getCompanyData.openVoteLoginLightbox;
    },
    votesLoading() {
      return this.getCompanyData.votesLoading;
    }
  },
  methods: {
    ...mapActions("company", [
      "changeCloseVoteLightbox",
      "changeVotesHasVote",
      "changeCloseVoteLoginLightbox"
    ]),
    closeLightbox() {
      this.changeCloseVoteLightbox();
    },
    closeLoginLightbox() {
      this.changeCloseVoteLoginLightbox();
    },
    goResume() {
      window.open(
        `https:${process.env.VUE_APP_PDA_URL}my104/resume/manage/index`
      );
    },
    goLogin() {
      login(`${window.location.pathname}`);
    },
    seeResult() {
      // 回畫面頂部
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.changeVotesHasVote();
    },
    getVotesDetailStatus(data) {
      return JSON.stringify(data) === "{}" ? false : true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.loading {
  min-height: 664px;
}

.loading,
.single-vote-content {
  @include media-breakpoint-up(md) {
    border-radius: 4px;
  }
}

.votes-loading {
  padding: 150px 0;
}

.prev-page-placeholder {
  height: 44px;
}

.prev-page {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  box-shadow: 0 0 4px 0 #a9a9a9;
  @include media-breakpoint-up(md) {
    position: static;
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
    box-shadow: unset;
  }

  &-btn {
    width: 24px;
    color: #7e7e7e;
    @include media-breakpoint-up(md) {
      width: 106px;
      padding: 5px 16px 5px 12px;
      border: 1px solid #eee;
      background-color: #f3f3f3;
      color: #7e7e7e;
    }
    i {
      font-size: 24px;
      font-weight: normal;
      @include media-breakpoint-up(md) {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .sm-title {
    top: 10px;
    left: calc(50% - 18px);
  }
}

.vote-content_left {
  flex-shrink: 0;
  @include media-breakpoint-up(md) {
    margin-right: 46px;
  }
  @include media-breakpoint-up(lg) {
    margin-right: 66px;
  }

  .anonymous-name {
    margin-top: 1px;
    color: #292929;
  }

  .anonymous-time {
    color: #a9a9a9;
  }
}

.vote-content_right {
  flex-grow: 1;
  color: #292929;
  @include media-breakpoint-up(md) {
    max-width: 500px;
  }

  .company-name {
    a {
      color: #1654b9;
      word-wrap: break-word;
      word-break: break-all;

      &:hover {
        color: #4e91ff;
      }
    }
  }

  .anonymous-voting {
    color: #a9a9a9;
  }
}

.see-result {
  width: 100%;
  height: 44px;
  border: none;
  background-color: #ff9100;
  @include media-breakpoint-up(md) {
    max-width: 154px;
  }
}

.write-reviews {
  button {
    width: 100%;
    @include media-breakpoint-up(md) {
      max-width: 154px;
    }
  }
}
</style>
