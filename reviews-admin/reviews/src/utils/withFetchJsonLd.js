import Vue from "vue";
import {
  homeJsonLd,
  companyReviewsVotesJsonLd,
  companySingleReviewJsonLd,
  companySingleVoteJsonLd,
  leaderboardJsonLd
} from "./jsonLdData";
import { commonMixins } from "@/mixins/commonMixins";
import { mapGetters } from "vuex";

// render component 之前，先 render jsonLd
const withFetchJsonLd = InnerComponent => {
  return Vue.component("withFetchJsonLd", {
    jsonld() {
      return this.jsonLdContent(this.$route.name);
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
      }
    },
    methods: {
      jsonLdContent(routeName) {
        const jsonLdDataType = {
          home: homeJsonLd,
          companyReviews: companyReviewsVotesJsonLd(
            this.companyData,
            this.encodeCustno(this.companyData.custno),
            Number(this.companyData.scoreOverall).toFixed(1)
          ),
          companyVotes: companyReviewsVotesJsonLd(
            this.companyData,
            this.encodeCustno(this.companyData.custno),
            Number(this.companyData.scoreOverall).toFixed(1)
          ),
          singleReview: companySingleReviewJsonLd(
            this.companyData,
            this.encodeCustno(this.companyData.custno),
            this.reviewsDetail.id,
            this.getAnonymousName(this.reviewsDetail.plantId),
            this.jsonLdTimeDate(this.reviewsDetail.createDate)
          ),
          singleVote: companySingleVoteJsonLd(
            this.companyData.companyName,
            this.encodeCustno(this.companyData.custno),
            this.votesDetail,
            this.jsonLdTimeDate(this.votesDetail.createDate),
            this.getAnonymousName(this.votesDetail.plantId),
            this.getVotesItem()
          ),
          leaderBoard: leaderboardJsonLd(
            this.$store.state.leaderBoard.currentBoard
          )
        };
        return jsonLdDataType[routeName];
      },
      getVotesItem() {
        const detail = this.votesDetail;
        let itemContent = [];
        if (detail.voteItems && detail.voteItems.length > 0) {
          detail.voteItems.forEach(items => {
            itemContent.push({
              "@type": "Answer",
              text: items.item,
              upvoteCount: items.itemCount
            });
          });
        }
        return itemContent;
      }
    },
    render() {
      return <InnerComponent />;
    }
  });
};

export default withFetchJsonLd;
