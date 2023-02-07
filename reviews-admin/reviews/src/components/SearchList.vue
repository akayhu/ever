<template>
  <dd>
    <router-link
      :to="{
        name: 'companyReviews',
        params: {
          custno: encodeCustno(company.custno)
        }
      }"
      target="_blank"
      data-gtm-list="單則公司"
      rel="noopener noreferrer"
    >
      <div class="search-list py-4 paddingX-rwd border-bottom">
        <div class="search-list-title t2 font-weight-bold mb-3">
          {{ company.companyName }}
        </div>
        <div class="review-block d-flex">
          <div
            v-if="company.interviewCount > 0"
            class="d-flex pr-3 align-items-center"
          >
            <span class="t4 label font-weight-bold mr-2">面試評價</span>
            <praise-img :score="company.interviewScore" :primaryColor="false" />
            <span class="ml-2">({{ company.interviewCount }})</span>
          </div>
          <div
            :class="{
              divider: company.interviewCount > 0 && company.reviewCount > 0
            }"
          ></div>
          <div v-if="company.reviewCount > 0" class="d-flex align-items-center">
            <span class="t4 label font-weight-bold mr-2">公司評價</span>
            <praise-img :score="company.scoreOverall" />
            <span class="ml-2">({{ company.reviewCount }})</span>
          </div>
        </div>
      </div>
    </router-link>
  </dd>
</template>

<script>
import PraiseImg from "@/components/Praise.vue";
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "SearchList",
  props: {
    company: {
      type: Object,
      required: true
    }
  },
  components: {
    PraiseImg
  },
  mixins: [commonMixins]
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
.search-list {
  color: get-color(text-info);
  &:hover {
    background-color: get-color(bg-primary);
  }

  &-title {
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    color: get-color(text);
    @include media-breakpoint-up(md) {
      max-width: 500px;
    }
  }
}

.review-block {
  align-items: center;
  @include media-breakpoint-down(sm) {
    flex-direction: column;
    align-items: flex-start;
  }

  > div {
    @include media-breakpoint-down(sm) {
      margin-bottom: 4px;
    }
  }

  .label {
    color: get-color(gray-normal);
  }

  .divider {
    width: 1px;
    height: 14px;
    background-color: get-color(gray-light);
    margin-right: 12px;

    @include media-breakpoint-down(sm) {
      display: none;
    }
  }
}
</style>
