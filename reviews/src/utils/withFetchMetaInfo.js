import Vue from "vue";
import {
  homeMetaInfo,
  reviewsMetaInfo,
  votesMetaInfo,
  companyReviewsVotesMetaInfo,
  companySingleReviewMetaInfo,
  companySingleVoteMetaInfo,
  page404MetaInfo,
  page500MetaInfo,
  aboutMetaInfo,
  questionsMetaInfo,
  sealingStationMetaInfo,
  termsMetaInfo,
  searchMetaInfo,
  serachPrivateMetaInfo,
  formVoteDoneMetaInfo,
  formReviewDoneMetaInfo,
  formReviewMetaInfo,
  formVoteMetaInfo,
  compareCompanyMetaInfo,
  leaderboardMetaInfo
} from "./metaInfoData";
import { mapGetters } from "vuex";
import { commonMixins } from "@/mixins/commonMixins";
import { checkIsTypeInterview } from "@/utils/reviewData";
import { TYPEID_MAP } from "@/utils/enum.js";

// render component 之前，先 render metaInfo
const withFetchMetaInfo = InnerComponent => {
  return Vue.component("withFetchMetaInfo", {
    metaInfo() {
      return this.metaInfoContent(this.$route.name);
    },
    mixins: [commonMixins],
    computed: {
      ...mapGetters("company", ["getCompanyData"]),
      companyData() {
        return this.getCompanyData.companyData;
      },
      reviewsDetail() {
        return this.getCompanyData.reviewsDetail;
      },
      votesDetail() {
        return this.getCompanyData.votesDetail;
      },
      advantageTitle() {
        const advantage = this.reviewsDetail.advantage;
        if (advantage && advantage.length > 8) {
          return `${advantage.substr(0, 8)}…`;
        } else {
          return advantage;
        }
      },
      advantageSubstring() {
        const advantage = this.reviewsDetail.advantage;
        if (advantage && advantage.length > 39) {
          return `${advantage.substr(0, 39)}…`;
        } else {
          return advantage;
        }
      },
      isTypeInterview() {
        return checkIsTypeInterview(
          this.reviewsDetail.typeId || TYPEID_MAP.ALL
        );
      }
    },
    methods: {
      metaInfoContent(routeName) {
        const metaInfoDataType = {
          home: homeMetaInfo,
          reviews: reviewsMetaInfo,
          votes: votesMetaInfo,
          companyReviews: companyReviewsVotesMetaInfo(
            this.companyData,
            this.encodeCustno(this.companyData.custno),
            this.$route.name
          ),
          companyVotes: companyReviewsVotesMetaInfo(
            this.companyData,
            this.encodeCustno(this.companyData.custno),
            this.$route.name
          ),
          singleReview: companySingleReviewMetaInfo(
            this.companyData.companyName,
            this.encodeCustno(this.companyData.custno),
            this.advantageTitle,
            this.reviewsDetail.id,
            this.advantageSubstring,
            this.isTypeInterview
          ),
          singleVote: companySingleVoteMetaInfo(
            this.companyData.companyName,
            this.encodeCustno(this.companyData.custno),
            this.votesDetail.title,
            this.votesDetail.id
          ),
          page404: page404MetaInfo,
          page500: page500MetaInfo,
          about: aboutMetaInfo,
          questions: questionsMetaInfo,
          sealingStation: sealingStationMetaInfo,
          terms: termsMetaInfo,
          search: searchMetaInfo(this.getKeywordName()),
          serachPrivate: serachPrivateMetaInfo(this.getKeywordName()),
          formVoteDone: formVoteDoneMetaInfo,
          formReviewDone: formReviewDoneMetaInfo,
          formReview: formReviewMetaInfo,
          formVote: formVoteMetaInfo,
          compare: compareCompanyMetaInfo,
          leaderBoard: leaderboardMetaInfo(this.$route.params.type)
        };
        return metaInfoDataType[routeName];
      },
      getKeywordName() {
        return this.$router.history.current.query.keyword;
      }
    },
    render() {
      return <InnerComponent />;
    }
  });
};

export default withFetchMetaInfo;
