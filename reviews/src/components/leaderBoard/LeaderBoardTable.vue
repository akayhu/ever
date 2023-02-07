<template>
  <div
    class="LeaderBoardTable border-top w-100"
    :class="{ 'salary-table': isSalary }"
  >
    <div
      class="thead border-bottom paddingX-rwd d-none d-md-flex t4"
      :class="{ 'salary-header': isSalary }"
    >
      <div class="fix-wrap">
        <div class="col-item sort text-center">排名</div>
        <div class="col-item company-logo">公司</div>
      </div>
      <div class="flexible-wrap">
        <div class="col-item company-name"></div>
        <div v-if="isSalary" class="col-item salary">年薪</div>
        <div class="col-item score" :class="{ thumbs: !isSalary }">
          評價
        </div>
        <div class="col-item comment">熱門評論</div>
        <div class="col-item opportunity"></div>
      </div>
    </div>
    <template v-if="!loading">
      <div
        v-for="(company, index) in boardTableData"
        :key="index"
        class="list-item d-flex align-items-stretch py-4 border-bottom paddingX-rwd"
        :class="{ 'salary-list': isSalary }"
      >
        <div class="fix-wrap">
          <div
            class="sort col-item text-center t3 font-weight-bold"
            data-title="排名"
          >
            {{ index + 4 }}
          </div>
          <div class="company-logo col-item">
            <Logo :src="company.logoUrl" :name="company.custName"></Logo>
          </div>
        </div>
        <div class="flexible-wrap">
          <div class="company-name col-item">
            <router-link
              :to="{
                name: 'companyReviews',
                params: { custno: encodeCustno(company.custno) }
              }"
              v-gtm="gtmTag.list"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ company.custName }}
            </router-link>
          </div>
          <div
            v-if="isSalary"
            class="salary col-item"
            data-title="年薪"
            data-prefix="年薪"
          >
            {{ company.yearSalary | salary }}
          </div>
          <div
            class="score col-item d-flex align-items-center"
            :class="{ thumbs: !isSalary }"
            data-title="評價"
            data-prefix="評價"
          >
            {{ company[theProperScoreKey] | decimal }}
            <template v-if="!isSalary">
              <praise-img
                :score="getScoreStampNum(company[theProperScoreKey])"
                class="ml-2 mb-1"
              />
            </template>
          </div>
          <div class="comment t4 col-item" data-title="熱門評論">
            {{ company.popularComment }}
          </div>
          <div class="opportunity font-weight-bold t4 col-item">
            <a
              :class="{ disabled: company.jobCount < 1 }"
              :href="company.custUrl"
              v-gtm="gtmTag.job"
              target="_blank"
              rel="noopener noreferrer"
            >
              工作機會({{ company.jobCount }})
            </a>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="num in 7"
        :key="`table-loading-${num}`"
        class="list-item loading d-flex align-items-stretch py-4 border-bottom paddingX-rwd"
      >
        <div class="fix-wrap">
          <div
            class="sort col-item text-center t3 font-weight-bold"
            data-title="排名"
          >
            {{ num + 3 }}
          </div>
          <div class="company-logo col-item placeholder-block"></div>
        </div>
        <div class="flexible-wrap w-100">
          <div class="company-name col-item placeholder-block w-100 h-50"></div>
          <div class="col-item placeholder-block w-100 h-50"></div>
        </div>
      </div>
    </template>
    <!-- 先隱藏待服務上線再開 -->
    <!-- <div v-if="isSalary" class="text-center py-5">
      <Button class="btn-outline-primary" btnText="看薪資百大排行榜" />
    </div> -->
  </div>
</template>

<script>
// import Button from "@/components/Button.vue";
import PraiseImg from "@/components/Praise.vue";
import Logo from "@/components/Logo.vue";
import { leaderboardMixins } from "@/mixins/leaderboardMixins.js";
import setGtmDirective from "@/directive/setGtmDirective.js";
export default {
  name: "LeaderBoardTable",
  components: {
    // Button,
    PraiseImg,
    Logo
  },
  mixins: [leaderboardMixins],
  directives: {
    setGtmDirective
  },
  props: {
    boardTableData: {
      type: Array,
      required: true
    },
    boardType: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    gtmTag: {
      type: Object,
      required: true
    }
  },
  methods: {
    getScoreStampNum(score) {
      return score ? Number(score.toFixed(1)) : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  color: get-color(link);
  &:hover {
    color: get-color(link-hover);
  }
  &.disabled {
    color: get-color(disable);
    pointer-events: none;
  }
}
.thead {
  height: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
  .col-item {
    color: get-color(text);
    font-size: 14px !important;
    line-height: 1.43;
    font-weight: normal !important;
  }
}
.fix-wrap,
.flexible-wrap {
  display: flex;
  align-items: center;
  overflow: hidden;
}
.fix-wrap {
  flex: 0 0 76px;
  max-width: 76px;
  margin-right: 12px;
}
.flexible-wrap {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: calc(100% - 76px - 12px);
  max-width: calc(100% - 76px - 12px);
  flex-wrap: wrap;
}
.company-name {
  font-weight: bold;
  font-size: 16px;
  line-height: 1.75;
  &.col-item {
    margin-bottom: 4px;
  }
  a {
    display: block;
    @include truncate-text();
  }
}
.list-item {
  .col-item {
    color: get-color(text);

    &.comment {
      color: get-color(text-info);
    }
  }
  &.salary-list {
    .salary {
      position: relative;
      margin-right: 25px;
      &::after {
        content: "";
        position: absolute;
        right: -12px;
        width: 1px;
        height: 60%;
        background-color: get-color(gray-light);
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .salary,
    .score {
      font-weight: normal;
      &::before {
        content: attr(data-prefix);
      }
      @include device-up(md) {
        font-weight: bold;
      }
    }
  }

  &.loading {
    .company-logo {
      width: 40px;
      height: 40px;
      @include device-up(md) {
        width: 56px;
        height: 56px;
      }
    }
  }
}
.col-item {
  flex-shrink: 0;
  flex-grow: 0;

  &.sort {
    justify-content: center;
    max-width: 20px;
    flex: 0 0 20px;
    margin-right: 16px;
  }
  &.comment,
  &.opportunity {
    display: none;
  }
  &.company-name {
    max-width: 100%;
    flex-basis: 100%;
  }
  &.salary,
  &.score {
    font-size: 14px;
    line-height: 1.43;
    font-weight: bold;
    @include device-up(md) {
      font-size: 16px;
      line-height: 1.75;
    }
  }
}
button {
  width: 182px;
  height: 44px;
}

@include device-up(md) {
  .fix-wrap {
    flex: 0 0 128px;
    max-width: 128px;
    margin-right: 0;
  }
  .flexible-wrap {
    flex-basis: calc(100% - 128px);
    max-width: calc(100% - 128px);
    justify-content: space-between;
    flex-wrap: nowrap;
    .col-item:not(:first-child) {
      margin-left: 32px;
    }
  }
  .company-name {
    font-size: 18px;
    font-size: 1.33;
    &.col-item {
      margin-bottom: 0;
    }
  }
  .col-item {
    &.comment,
    &.opportunity {
      display: block;
    }
    &.sort {
      max-width: 40px;
      flex-basis: 40px;
      margin-right: 16px;
    }
    &.company-name {
      flex-basis: 190px;
      max-width: 190px;
      @include device-up(lg) {
        flex-basis: 304px;
        max-width: 304px;
      }
    }
    &.score.thumbs {
      flex-basis: 128px;
      max-width: 128px;
    }
    &.comment {
      flex-basis: 280px;
      max-width: 280px;
      @include truncate-text();
      @include device-up(lg) {
        flex-basis: 373px;
        max-width: 373px;
      }
      @include device-up(xl) {
        flex-basis: 445px;
        max-width: 445px;
      }
    }
    &.salary {
      flex: 0 0 45px;
      max-width: 45px;
      font-weight: bold;
    }
    &.opportunity {
      flex: 0 0 91px;
      max-width: 91px;
    }
  }

  .salary-table {
    .col-item {
      &.comment {
        flex-basis: 302px;
        max-width: 302px;
        @include device-up(lg) {
          flex-basis: 396px;
          max-width: 396px;
        }
        @include device-up(xl) {
          flex-basis: 468px;
          max-width: 468px;
        }
      }
    }
  }

  .list-item {
    &.salary-list {
      .score {
        max-width: 28px;
        flex-basis: 28px;
      }
      .salary,
      .score {
        &::before {
          display: none;
        }
      }
      .salary {
        margin-right: 0;
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
