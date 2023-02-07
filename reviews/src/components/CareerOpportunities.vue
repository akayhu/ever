<template>
  <div class="career-opportunities bg-white rounded p-4">
    <div class="career-opportunities-title t3 font-weight-bold">
      <span class="d-none d-md-block">工作機會</span>
      <span class="d-md-none">此公司最新工作</span>
    </div>
    <div class="career-opportunities-list py-4">
      <div
        class="career-opportunities-job"
        v-for="(item, index) in companyJobs.joblist"
        :key="index"
      >
        <a
          class="d-block font-weight-bold mb-2 mb-md-0"
          :href="item.jobUrl"
          target="_blank"
          data-gtm-job="單筆工作"
          rel="noopener noreferrer"
        >
          {{ item.jobName }}
        </a>
        <div class="t4">{{ item.area }}</div>
      </div>
    </div>

    <a
      class="allJob d-block t4 mt-2 mt-md-4 text-center font-weight-bold"
      :href="companyJobs.custUrl"
      target="_blank"
      data-gtm-job="所有工作"
      rel="noopener noreferrer"
    >
      所有工作機會 <i class="jb_icon_right font-weight-bold" />
    </a>
  </div>
</template>

<script>
export default {
  name: "CareerOpportunities",
  props: {
    companyJobs: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.career-opportunities {
  color: #292929;

  &-list {
    @include media-breakpoint-up(md) {
      border-bottom: 1px solid #eee;
    }
    .career-opportunities-job {
      color: #7e7e7e;
      &:not(:last-child) {
        margin-bottom: 16px;
        @include media-breakpoint-up(md) {
          margin-bottom: 20px;
        }
      }
    }
  }

  a {
    font-size: 16px;
    line-height: 28px;
    color: #1654b9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    max-width: 100%;
    &:hover {
      color: #4e91ff;
    }
    @include media-breakpoint-up(md) {
      font-size: 14px;
      line-height: 20px;
      color: #7e7e7e;
      &:hover {
        color: #ff7800;
      }
    }

    &.allJob {
      color: #7e7e7e;
      &:hover {
        color: #ff7800;
      }
    }
  }
}
</style>
