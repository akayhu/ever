<template>
  <div>
    <div class="company-single-review-right bg-white overflow-hidden">
      <!-- reviews detail loading -->
      <div
        v-if="!getReviewsDetailStatus(reviewsDetail)"
        class="loading d-flex justify-content-center align-items-center"
      >
        <Loading />
      </div>

      <div v-else class="single-review-content">
        <div class="prev-page paddingX-rwd bg-white">
          <router-link
            class="prev-page-btn d-block t4 rounded font-weight-bold"
            :to="{
              name: 'companyReviews',
              params: { custno: encodeCustno(reviewsDetail.custno) }
            }"
            rel="noopener noreferrer"
            :title="`${reviewsDetail.company}的所有公司評論`"
            data-gtm-detail="回公司專頁"
          >
            <i class="jb_icon_left d-block d-md-inline"></i>
            <span class="d-none d-md-inline"> 公司專頁</span>
          </router-link>
          <div class="sm-title position-absolute d-md-none font-weight-bold t2">
            評論
          </div>
        </div>
        <div class="prev-page-placeholder d-md-none"></div>
        <div
          class="review-content d-block d-md-flex pt-4 pt-md-8 pb-8 paddingX-rwd"
        >
          <div class="review-content_left d-flex align-items-start">
            <el-tooltip class="item" placement="top">
              <div slot="content" class="text-white t4">
                評論者可從8種植物中任選一個匿名身份；
                <br />不同評論若為相同植物，不代表為同一人 <br />所填寫。
              </div>
              <img
                v-if="reviewsDetail.plantId"
                width="40"
                class="rounded-circle mr-3"
                :src="getAnonymousImgUrl(reviewsDetail.plantId)"
              />
            </el-tooltip>

            <div>
              <div
                class="anonymous-name t4 font-weight-bold"
                v-if="reviewsDetail.plantId"
              >
                {{
                  getAnonymousName(reviewsDetail.plantId, reviewsDetail.typeId)
                }}
              </div>
              <div
                class="anonymous-time t5"
                v-if="reviewsDetail.createDate"
                :title="timeDate(reviewsDetail.createDate)"
              >
                {{
                  [0, "minutes"]
                    | duration("subtract", timeAgo(reviewsDetail.createDate))
                    | duration("humanize", true)
                }}
              </div>
            </div>
          </div>

          <div class="review-content_right">
            <el-tooltip class="item" placement="top">
              <div slot="content" class="text-white t4">
                此評論獲得公司主動認證，
                <br />同意其填寫內容的真實性和 <br />客觀性
              </div>
              <span
                class="boss-certification mb-md-6"
                v-if="reviewsDetail.isVerify === 1"
                v-Certification
              >
                老闆認證
              </span>
            </el-tooltip>

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

            <div class="job-information mb-6 pb-6 t3 border-bottom">
              <div class="title font-weight-bold mb-1">工作資訊</div>
              <div
                v-if="
                  reviewsDetail.seniorityYear > 0 ||
                    reviewsDetail.seniorityMonth > 0
                "
              >
                任職年資：
                <span v-if="reviewsDetail.seniorityYear > 0"
                  >{{ reviewsDetail.seniorityYear }} 年</span
                >
                <span v-if="reviewsDetail.seniorityMonth > 0">
                  {{ reviewsDetail.seniorityMonth }} 個月</span
                >
              </div>
              <div
                v-if="
                  reviewsDetail.jobName && reviewsDetail.jobNameIsPublic === 1
                "
              >
                {{ isTypeInterview ? "面試職務" : "職務名稱" }}：
                {{ reviewsDetail.jobName }}
              </div>
              <div
                v-if="reviewsDetail.wage && reviewsDetail.wageIsPublic === 1"
              >
                薪資待遇：{{ getWageType(reviewsDetail.wageType) }}
                {{ getWage(reviewsDetail.wage) }}
              </div>
            </div>

            <div class="encouraging mb-6 pb-6 t3 border-bottom">
              <div class="title font-weight-bold mb-1">
                {{ isTypeInterview ? "面試心得" : "值得鼓勵" }}
              </div>
              <div v-html="reviewsDetail.advantage.replace(/\n/g, '<br>')" />
              <template v-if="reviewsDetail.disadvantage">
                <div class="title font-weight-bold mb-1 mt-6">建議改善</div>
                <div
                  v-html="reviewsDetail.disadvantage.replace(/\n/g, '<br>')"
                />
              </template>
            </div>

            <div class="ritual-rating d-flex align-items-center t3">
              <div class="title font-weight-bold">
                {{ isTypeInterview ? "面試評價" : "整體評價" }}
              </div>
              <div class="division d-flex align-items-center">
                <span class="division-number mr-2 text-center">
                  {{ reviewsDetail.scoreOverall }}.0
                </span>
                <praise-img
                  :score="reviewsDetail.scoreOverall"
                  :primaryColor="!isTypeInterview"
                />
              </div>
            </div>

            <div v-if="!isTypeInterview" class="appraisal d-flex t3">
              <div class="title font-weight-bold">類別評價</div>
              <div class="classification">
                <div
                  class="d-flex align-items-center"
                  :class="{
                    'mb-2': index !== filterReviewItems.length - 1,
                    'mt-6': index === 5
                  }"
                  v-for="(reviewItems, index) in filterReviewItems"
                  :key="reviewItems.reviewItem"
                >
                  <div class="typeTitle mr-2">{{ reviewItems.reviewItem }}</div>
                  <praise-img :score="reviewItems.score" />
                </div>

                <div
                  v-if="reviewsDetail.reviewItems.length > 5 && !more"
                  class="more mt-4 mt-md-3 font-weight-bold"
                  @click="openMore()"
                  data-gtm-detail="更多類別評價"
                >
                  更多類別評價
                  <i class="jb_icon_down font-weight-bold" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <BossReply
          v-if="reviewsDetail.bossReply"
          :bossReplyComment="reviewsDetail.bossReplyComment[0]"
        />
      </div>
    </div>

    <interested-review-vote
      v-if="reviewsInterestedList.length > 0"
      :data="reviewsInterestedList"
      type="reviews"
    />

    <CareerOpportunities
      v-if="companyJobs.joblist.length > 0"
      :companyJobs="companyJobs"
      class="d-md-none mt-3"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PraiseImg from "@/components/Praise.vue";
import InterestedReviewVote from "@/components/InterestedReviewVote.vue";
import CareerOpportunities from "@/components/CareerOpportunities.vue";
import BossReply from "@/components/BossReply.vue";
import { Certification } from "@/directive/certificationDirective";
import { commonMixins } from "@/mixins/commonMixins";
import Loading from "@/components/Loading.vue";
import accounting from "accounting/accounting.min";
import { checkIsTypeInterview } from "@/utils/reviewData";

export default {
  name: "CompanySingleReview",
  directive: {
    Certification
  },
  components: {
    InterestedReviewVote,
    CareerOpportunities,
    PraiseImg,
    Loading,
    BossReply
  },
  data: function() {
    return {
      more: false
    };
  },
  mixins: [commonMixins],
  mounted() {
    // IOS 進入此頁時位置不在最頂端，原因暫時查不到
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapGetters("company", ["getCompanyData"]),
    companyData() {
      return this.getCompanyData.companyData;
    },
    companyJobs() {
      return this.getCompanyData.jobs;
    },
    reviewsDetail() {
      return this.getCompanyData.reviewsDetail;
    },
    reviewsInterestedList() {
      return this.getCompanyData.reviewsInterestedList.items;
    },
    filterReviewItems() {
      let reviewItems = this.getCompanyData.reviewsDetail.reviewItems;
      let condition = this.more ? reviewItems.length : 5;
      return this.getCompanyData.reviewsDetail.reviewItems.filter(
        (item, index) => index < condition
      );
    },
    isTypeInterview() {
      return checkIsTypeInterview(this.reviewsDetail.typeId);
    }
  },
  methods: {
    openMore() {
      this.more = true;
    },
    getComma(money) {
      return accounting.formatNumber(money);
    },
    getReviewsDetailStatus(data) {
      return JSON.stringify(data) === "{}" ? false : true;
    },
    getWageType(wage) {
      const wageType = {
        hour: "時薪",
        month: "月薪",
        year: "年薪"
      };
      return wageType[wage];
    },
    getWage(wage) {
      const wageType = {
        1: "100 萬以下",
        2: "100 ~ 150 萬",
        3: "150 ~ 200 萬",
        4: "200 ~ 250 萬",
        5: "250 ~ 300 萬",
        6: "300 萬以上"
      };
      return wage < 7 ? wageType[wage] : this.getComma(wage);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.company-single-review-right {
  .loading {
    min-height: 664px;
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

  .review-content {
    position: relative;

    .review-content_left {
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

    .review-content_right {
      flex-grow: 1;
      color: #292929;

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

      .boss-certification {
        position: absolute;
        top: 16px;
        right: 16px;
        @include media-breakpoint-up(md) {
          position: static;
        }
      }

      .encouraging {
        div {
          word-break: break-all;
        }
      }

      .ritual-rating {
        .title {
          margin-right: 32px;
          @include media-breakpoint-up(md) {
            margin-right: 66px;
          }
        }
        .division {
          &-number {
            width: 64px;
            font-size: 36px;
            line-height: 40px;
          }
        }
      }
    }

    .appraisal {
      .title {
        margin-right: 32px;
        @include media-breakpoint-up(md) {
          margin-right: 66px;
        }
      }

      .typeTitle {
        line-height: 28px;
        @include media-breakpoint-up(md) {
          line-height: 22px;
        }
      }

      .more {
        font-size: 16px;
        line-height: 28px;
        color: #7e7e7e;
        cursor: pointer;
        @include media-breakpoint-up(md) {
          font-size: 14px;
          line-height: 20px;
        }
        &:hover {
          color: #ff7800;
        }
      }
    }
  }

  @include media-breakpoint-up(md) {
    border-radius: 4px;
  }
}
</style>
