<template>
  <div
    class="interested-review-block bg-white rounded paddingX-rwd py-4 py-md-8 mt-3 mt-md-4"
  >
    <div class="title t2 font-weight-bold">
      你可能感興趣的{{ type === "vote" ? "投票" : "評論" }}
    </div>
    <div class="d-flex flex-wrap">
      <div v-for="item in data" :key="item.id" class="reviewVote mt-4 mt-md-6">
        <router-link
          class="reviewVote-title d-block t3 font-weight-bold mb-1"
          :to="linkPath(item)"
          :data-gtm-detail="
            `你可能感興趣的${type === 'vote' ? '投票' : '評論'}`
          "
          rel="noopener noreferrer"
        >
          <template v-if="type === 'vote'">{{ item.title }}</template>
          <template v-else>{{
            checkIsTypeInterview(item.typeId)
              ? `面試心得：${item.advantage}`
              : `值得鼓勵：${item.advantage}`
          }}</template>
        </router-link>
        <div class="reviewVote-companyName t4">{{ item.company }}</div>
        <div v-if="type === 'vote'" class="vote t5 mt-1">
          {{ item.count }} 人已投票
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
import { checkIsTypeInterview } from "@/utils/reviewData";

export default {
  name: "InterestedReviewVote",
  props: {
    data: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: "review",
      required: true
    }
  },
  mixins: [commonMixins],
  methods: {
    checkIsTypeInterview,
    linkPath(item) {
      return `/company/${this.encodeCustno(item.custno)}/${
        this.type === "vote" ? "votes" : "reviews"
      }/${item.id}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.interested-review-block {
  color: #292929;

  .reviewVote {
    width: 100%;
    @include media-breakpoint-up(md) {
      width: 310px;
      &:nth-child(odd) {
        margin-right: 48px;
      }
    }
    @include media-breakpoint-up(lg) {
      width: 414px;
    }
    @include media-breakpoint-up(xl) {
      width: 440px;
    }

    &-title,
    &-companyName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }

    &-title {
      color: #1654b9;
      &:hover {
        color: #4e91ff;
      }
    }

    .vote {
      color: #a9a9a9;
    }
  }
}
</style>
