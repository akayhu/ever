<template>
  <dd>
    <!-- 檢舉待審核 -->
    <div v-if="reviews.auditState === 5">
      <div
        class="reviews-list_content pending-review-list d-block d-md-flex py-4 paddingX-rwd"
        :class="{ borderBottom: page === 'reviews' && index === 4 }"
      >
        <div class="reviews-list_left d-flex align-items-start mb-4 mb-md-0">
          <el-tooltip class="item" placement="top">
            <div slot="content" class="t4 text-white">
              評論者可從8種植物中任選一個匿名身份；<br />
              不同評論若為相同植物，不代表為同一人<br />
              所填寫。
            </div>
            <img
              class="mr-3 rounded-circle"
              :src="getAnonymousImgUrl(reviews.plantId)"
            />
          </el-tooltip>
          <div>
            <div class="anonymous-name font-weight-bold t4">
              {{ getAnonymousName(reviews.plantId, reviews.typeId) }}
            </div>
            <div
              class="anonymous-time t5"
              v-if="reviews.createDate"
              :title="timeDate(reviews.createDate)"
            >
              {{
                [0, "minutes"]
                  | duration("subtract", timeAgo(reviews.createDate))
                  | duration("humanize", true)
              }}
            </div>
          </div>
        </div>
        <div class="reviews-list_right align-self-center">
          QQ...這則評論被送去審核了
        </div>
      </div>
    </div>

    <!-- 通過審核 -->
    <router-link
      v-if="reviews.auditState !== 5"
      :to="{
        name: 'singleReview',
        params: {
          custno: encodeCustno(reviews.custno),
          reviewsId: reviews.id
        }
      }"
      :target="page === 'companyList' ? '_self' : '_blank'"
      data-gtm-list="單則評論"
      rel="noopener noreferrer"
    >
      <div
        class="reviews-list_content d-md-flex justify-content-between py-4 paddingX-rwd"
        :class="{ borderBottom: page === 'reviews' && index === 4 }"
      >
        <div class="d-block d-md-flex">
          <div class="reviews-list_left align-items-start d-flex mb-4 mb-md-0">
            <el-tooltip class="item" placement="top">
              <div slot="content" class="t4 text-white">
                評論者可從8種植物中任選一個匿名身份；<br />
                不同評論若為相同植物，不代表為同一人<br />
                所填寫。
              </div>
              <img
                class="mr-3 rounded-circle"
                :src="getAnonymousImgUrl(reviews.plantId)"
              />
            </el-tooltip>
            <div>
              <div class="anonymous-name t4">
                {{ getAnonymousName(reviews.plantId, reviews.typeId) }}
              </div>
              <div
                class="anonymous-time t5"
                v-if="reviews.createDate"
                :title="timeDate(reviews.createDate)"
              >
                {{
                  [0, "minutes"]
                    | duration("subtract", timeAgo(reviews.createDate))
                    | duration("humanize", true)
                }}
              </div>
            </div>
          </div>
          <div class="reviews-list_right">
            <div
              class="focus-block d-flex align-items-center"
              :class="page !== 'companyList' ? 'mb-2' : 'mb-3'"
            >
              <span class="review-type mr-2 font-weight-bold">
                {{ isTypeInterview ? "面試評價" : "公司評價" }}</span
              >
              <praise-img
                class="mr-1 py-1"
                :score="reviews.scoreOverall"
                :primaryColor="!isTypeInterview"
              />
              <el-tooltip class="item" placement="top">
                <div slot="content" class="t4 text-white">
                  此評論獲得公司主動認證，<br />
                  同意其填寫內容的真實性和<br />
                  客觀性
                </div>
                <span
                  v-if="reviews.isVerify === 1"
                  v-Certification="{ marginLeft: '12px' }"
                >
                  老闆認證
                </span>
              </el-tooltip>
            </div>
            <div
              v-if="page !== 'companyList'"
              class="t2 companyName-block font-weight-bold mb-3"
            >
              {{ reviews.company }}
            </div>
            <div
              class="encourage-block d-flex t4"
              :class="{ 'mb-1': reviews.disadvantage }"
            >
              <div class="flex-shrink-0 mr-2 font-weight-bold">
                {{ isTypeInterview ? "面試心得" : "值得鼓勵" }}
              </div>
              <div>{{ reviews.advantage }}</div>
            </div>
            <div v-if="reviews.disadvantage" class="improve-block d-flex t4">
              <div class="flex-shrink-0 mr-2 font-weight-bold">建議改善</div>
              <div>{{ reviews.disadvantage }}</div>
            </div>
          </div>
        </div>
        <div class="boss-reply t4">
          <el-tooltip class="item" placement="top">
            <div slot="content" class="t4 text-white">
              公司已回覆該則評論，點擊<br />此評論觀看公司詳細回覆
            </div>
            <span class="ml-4" v-if="reviews.bossReply === 1">老闆已回覆</span>
          </el-tooltip>
        </div>
      </div>
    </router-link>

    <router-link
      v-if="index === 4"
      to="/form/review"
      data-gtm-banner="我要匿名分享"
      rel="noopener noreferrer"
    >
      <div class="share-review d-none d-md-block py-8 t1 font-weight-bold">
        歡迎分享評論<br />
        幫助職場生態越來越好！
        <span class="t3 font-weight-bold ml-6">
          我要匿名分享
          <i class="jb_icon_right font-weight-bold"></i>
        </span>
      </div>
    </router-link>
  </dd>
</template>

<script>
import PraiseImg from "@/components/Praise.vue";
import { commonMixins } from "@/mixins/commonMixins";
import { Certification } from "@/directive/certificationDirective";
import { checkIsTypeInterview } from "@/utils/reviewData";

export default {
  name: "ReviewsList",
  props: {
    reviews: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    page: {
      type: String,
      default: ""
    }
  },
  directives: { Certification },
  components: {
    PraiseImg
  },
  computed: {
    isTypeInterview() {
      return checkIsTypeInterview(this.reviews.typeId);
    }
  },
  mixins: [commonMixins]
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
.reviews-list_content {
  position: relative;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: none;
    @include media-breakpoint-up(md) {
      background-color: #ffeedf;
    }
  }

  &.borderBottom {
    border-bottom: 1px solid #eee;
    @include media-breakpoint-up(md) {
      border-bottom: none;
    }
  }

  &.pending-review-list {
    min-height: 112px;
    cursor: initial;
    color: #b5b5b5;
    background-color: rgba(243, 243, 243, 0.5);

    .anonymous-name,
    .anonymous-time {
      color: #b5b5b5 !important;
    }

    img {
      opacity: 0.5;
    }
  }

  .reviews-list_left {
    width: 188px;

    img {
      width: 40px;
    }

    .anonymous-name {
      margin-top: 1px;
      color: #292929;
    }

    .anonymous-time {
      color: #a9a9a9;
    }
  }

  .reviews-list_right {
    .review-type {
      color: get-color(gray-normal);
    }
    .companyName-block {
      width: 100%;
      color: #292929;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
      @include media-breakpoint-up(md) {
        max-width: 394px;
      }
      @include media-breakpoint-up(lg) {
        max-width: 500px;
      }
    }

    .encourage-block,
    .improve-block {
      color: #292929;
      div:nth-child(2) {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        @include media-breakpoint-up(md) {
          max-width: 330px;
        }
        @include media-breakpoint-up(lg) {
          max-width: 436px;
        }
      }
    }
  }

  .boss-reply {
    position: absolute;
    top: 16px;
    right: 16px;
    color: #7e7e7e;
    @include media-breakpoint-up(md) {
      position: static;
      align-self: center;
    }
  }
}

.share-review {
  height: 118px;
  background-image: url(~@/assets/review-share.png);
  background-color: #ffeedf;
  background-repeat: no-repeat;
  background-size: 180px;
  color: #292929;

  @include media-breakpoint-up(md) {
    background-position: 479px 0px;
    padding-left: 57px;
  }
  @include media-breakpoint-up(lg) {
    background-position: 588px 0px;
    padding-left: 116px;
  }
  @include media-breakpoint-up(xl) {
    background-position: 649px 0px;
    padding-left: 227px;
  }

  span {
    color: #ff7800;
  }
}
</style>
