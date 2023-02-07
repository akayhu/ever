<template>
  <div>
    <div class="company-right bg-white rounded">
      <div
        class="company-right_nav d-flex justify-content-between align-items-center paddingX-rwd border-bottom"
      >
        <ul class="d-flex pt-5 t4 font-weight-bold text-center">
          <li
            :class="listTab === 'reviews' ? 'focus' : ''"
            @click="changeListTab('reviews')"
            data-gtm-list="切換至評論"
          >
            評論
          </li>
          <li
            :class="listTab === 'votes' ? 'focus' : ''"
            @click="changeListTab('votes')"
            data-gtm-list="切換至投票"
          >
            投票
          </li>
        </ul>
      </div>

      <ReviewTypeTags
        v-if="listTab === 'reviews'"
        class="paddingX-rwd py-4"
        :currentType="currentReviewType"
        @click="changeReviewType"
      />

      <!-- reviews and votes list loading -->
      <div
        v-if="checkLoading(listTab)"
        class="loading d-flex justify-content-center align-items-center"
      >
        <Loading />
      </div>

      <!-- reviews and votes empty list -->
      <div v-else-if="isEmptyList" class="empty-list t4 text-center">
        這間公司目前還沒有{{ emptyText.title }}～
        <br />
        歡迎{{ emptyText.content }}！

        <div>
          <Button
            v-if="listTab === 'reviews'"
            class="btn-secondary empty-list-btn border-0 t4 mt-6"
            btnText="發表公司評價"
            data-gtm-btn="發表公司評價"
            path="/form/review"
          ></Button>

          <Button
            v-else
            class="btn-secondary empty-list-btn border-0 t4 mt-6"
            btnText="發起投票"
            data-gtm-btn="發起投票"
            :path="
              `/form/vote?ckw=${
                this.companyData.companyName
              }&custno=${this.getCustno()}`
            "
          ></Button>
        </div>
      </div>

      <!-- reviews and votes list -->
      <div v-else>
        <template v-if="listTab === 'reviews'">
          <reviews-list
            v-for="reviews in getReviewsList"
            :key="reviews.id"
            :reviews="reviews"
            page="companyList"
        /></template>
        <template v-else>
          <votes-list
            v-for="(votes, index) in getVotesList"
            :key="index"
            :votes="votes"
            page="companyList"
          />
        </template>
        <Pagination
          class="paddingX-rwd py-3"
          :currentPage="pageInfo.currentPage"
          :total="pageInfo.total"
          @page-change="changePage"
        />
      </div>
    </div>

    <div class="ask-block bg-white rounded mt-4">
      <div class="header">
        <span class="font-weight-bold t2">比較出最適合你的好公司</span>
      </div>
      <div class="content mx-4 mx-md-0 mt-md-4 d-flex">
        <div class="bg d-none d-md-block"></div>
        <div class="compare ml-md-7">
          <div class="mt-md-4 title">
            <span class="t4 text"
              >輸入兩間你想比較的公司 , 點擊比較按鈕後 ,
              機器人會為你生成詳細的比較表。
            </span>
          </div>
          <div class="company mt-6 d-flex">
            <AcSearchInput
              class="input"
              :companyName.sync="compareName[0]"
              :companyCustno.sync="compareCustno[0]"
            ></AcSearchInput>
            <span class="t2 my-2 mx-md-4 font-weight-bold align-self-center"
              >VS</span
            >
            <AcSearchInput
              class="input"
              :companyName.sync="compareName[1]"
              :companyCustno.sync="compareCustno[1]"
            ></AcSearchInput>
            <CompareButton
              class="button"
              :disabled="disableCompare"
              :path="comparePath"
              >比較公司</CompareButton
            >
          </div>
        </div>
      </div>
    </div>
    <CareerOpportunities
      v-if="companyJobs.joblist.length > 0"
      :companyJobs="companyJobs"
      class="d-block d-md-none mt-4"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ReviewsList from "@/components/ReviewsList.vue";
import VotesList from "@/components/VotesList.vue";
import Loading from "@/components/Loading.vue";
import Button from "@/components/Button.vue";
import AcSearchInput from "@/components/AcSearchInput";
import CompareButton from "@/components/CompareButton";
import CareerOpportunities from "@/components/CareerOpportunities.vue";
import { commonMixins } from "@/mixins/commonMixins";
import ReviewTypeTags from "@/components/ReviewTypeTags.vue";
import Pagination from "@/components/Pagination.vue";
import { TYPEID_MAP, TYPEID_GROUP_NAME_MAP } from "@/utils/enum.js";

export default {
  name: "CompanyReviewsVotes",
  data: function() {
    return {
      listTab: "reviews",
      compareName: [null, null],
      compareCustno: [null, null]
    };
  },
  components: {
    ReviewsList,
    VotesList,
    Loading,
    Button,
    AcSearchInput,
    CompareButton,
    CareerOpportunities,
    ReviewTypeTags,
    Pagination
  },
  mixins: [commonMixins],
  computed: {
    ...mapGetters("company", ["getCompanyData"]),
    companyData() {
      return this.getCompanyData.companyData;
    },
    getReviewsList() {
      return this.getCompanyData.reviewsList.items;
    },
    getReviewsListLoadingEnd() {
      return this.getCompanyData.reviewsList.loadingEnd;
    },
    getVotesList() {
      return this.getCompanyData.votesList.items;
    },
    getVotesListLoadingEnd() {
      return this.getCompanyData.votesList.loadingEnd;
    },
    disableCompare() {
      return !this.compareCustno.every(custno => custno);
    },
    comparePath() {
      if (this.disableCompare) return {};
      const compareCompany = this.compareCustno.join("-vs-");
      return { name: "compare", params: { compare: compareCompany } };
    },
    companyJobs() {
      return this.getCompanyData.jobs;
    },
    currentReviewType() {
      return parseInt(this.$route.query.typeId, 10) || TYPEID_MAP.ALL;
    },
    pageInfo() {
      if (this.listTab === "reviews") return this.getCompanyData.reviewsList;
      return this.getCompanyData.votesList;
    },
    isEmptyList() {
      if (this.listTab === "reviews")
        return this.getReviewsList.length < 1 && this.getReviewsListLoadingEnd;
      return this.getVotesList.length < 1 && this.getVotesListLoadingEnd;
    },
    emptyText() {
      let text = {
        title: "投票",
        content: "舉手發問，讓未來同事幫你解答"
      };
      // 投票
      if (this.listTab === "votes") return text;
      // 評論
      const typeName = TYPEID_GROUP_NAME_MAP[this.currentReviewType];
      switch (this.currentReviewType) {
        case TYPEID_MAP.INTERVIEW:
        case TYPEID_MAP.PART_TIME:
        case TYPEID_MAP.INTERN:
          text = {
            title: `${typeName}評價`,
            content: `曾${typeName}過的會員留下你的${typeName}評價`
          };
          break;
        case TYPEID_MAP.ALL:
        case TYPEID_MAP.FULL_TIME:
        default:
          text = {
            title: "評論",
            content: "在職員工或曾任職員工留下您的評論"
          };
      }
      return text;
    }
  },
  watch: {
    companyData: {
      handler: function(company) {
        // 因為重整時進入此頁面時資料不一定返回，所以需要 watch
        this.setValue(company);
      },
      deep: true
    }
  },
  created() {
    this.listTab = this.$route.name === "companyVotes" ? "votes" : "reviews";
    this.setValue(this.companyData);
  },
  methods: {
    checkLoading(tab) {
      if (tab === "reviews") {
        return this.getReviewsList.length < 1 && !this.getReviewsListLoadingEnd;
      } else if (tab === "votes") {
        return this.getVotesList.length < 1 && !this.getVotesListLoadingEnd;
      }
    },
    checkHasListData(tab) {
      if (tab === "reviews") {
        return this.getReviewsList.length < 1 && this.getReviewsListLoadingEnd;
      } else if (tab === "votes") {
        return this.getVotesList.length < 1 && this.getVotesListLoadingEnd;
      }
    },
    changeListTab(tab) {
      this.listTab = tab;
      const custno = this.getCustno();
      this.$router.push({ path: `/company/${custno}/${tab}` }).catch(err => {});
    },

    getCustno() {
      return this.$route.params.custno;
    },
    setValue(company) {
      const { companyName, custno } = company;
      if (companyName) {
        this.$set(this.compareName, 0, companyName);
      }
      if (custno) {
        this.$set(this.compareCustno, 0, this.encodeCustno(custno));
      }
    },
    changeReviewType(typeId) {
      this.$router.push({
        path: "reviews",
        query: { typeId: typeId }
      });
    },
    changePage(page) {
      const query = this.$route.query;
      this.$router.push({
        path: this.listTab,
        query: { ...query, page: page }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.company-right {
  ul {
    li {
      width: 60px;
      height: 27px;
      border-bottom: 3px solid #fff;
      color: #7e7e7e;
      cursor: pointer;

      &:hover {
        border-bottom: 3px solid #ff7800;
        color: #ff7800;
      }

      &.focus {
        border-bottom: 3px solid #ff7800;
        color: #ff7800;
      }
    }
  }

  .loading {
    min-height: 422px;
  }

  .empty-list {
    padding: 72px 0;
    color: #7e7e7e;

    &-btn {
      height: 32px;
      width: 116px;
    }
  }
}

.ask-block {
  color: #292929;
  .header {
    padding: 24px 0px 8px 16px;

    @include media-breakpoint-up(md) {
      padding: 32px 0px 0px 40px;
    }
  }
  .content {
    display: flex;
    @include media-breakpoint-up(md) {
    }
    .bg {
      background-image: url(~@/assets/vote-compare.png);
      background-repeat: no-repeat;
      background-size: 141px;
      width: 141px;
      padding-top: 151px;
      flex-shrink: 0;
    }

    .compare {
      width: 100%;
      .title {
        @include media-breakpoint-up(lg) {
          text-align: center;
          padding-right: 170px;
        }
        @include media-breakpoint-up(xl) {
          text-align: center;
          padding-right: 120px;
        }
      }
      .text {
        color: #7e7e7e;
      }
      .company {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        @include media-breakpoint-up(md) {
          flex-wrap: nowrap;
          justify-content: flex-start;
        }
        @include media-breakpoint-up(xl) {
          justify-content: center;
        }
        .input {
          width: 100%;
          @include media-breakpoint-up(md) {
            width: 160px;
          }
          @include media-breakpoint-up(lg) {
            width: 280px;
          }
        }
        .button {
          width: 100%;
          margin: 16px 0px 24px 0px;
          @include media-breakpoint-up(md) {
            margin: 0px 0px 0px 16px;
            width: auto;
          }
        }
      }
    }
  }
}
</style>
