<template>
  <div class="topThree-container d-flex flex-wrap">
    <template v-if="!loading">
      <div
        v-for="(company, index) in topThreeCompany"
        :key="`${company}-${index}`"
        class="topThree-block rounded position-relative bg-white"
      >
        <LockItem :lockCondition="index === 0">
          <template #locked="{ icon, link, goLogin }">
            <div
              class="noLogin position-relative"
              :class="{ isSalary: isSalary }"
            >
              <div class="number pl-1">{{ index + 1 }}</div>
              <p class="mb-2"><i :class="icon" />登入查看第一名</p>
              <button
                class="rounded t4 text-white font-weight-bold"
                v-gtm="gtmTag.login"
                @click.prevent="goLogin"
              >
                立即登入
              </button>
            </div>
          </template>
          <template #normal>
            <div class="card">
              <div class="number pl-1">{{ index + 1 }}</div>
              <div
                class="pt-4 pt-md-6 pb-4 px-6 border-bottom d-flex flex-column flex-grow-1"
              >
                <CompanyHeader
                  class="d-flex justify-content-center align-items-center mb-0 mb-md-3"
                  :src="company.logoUrl"
                  :custno="company.custno"
                  :name="company.custName"
                  logoClass="mr-4"
                  :gtm="gtmTag.list"
                />
                <div v-if="isSalary" class="salary mb-3 mb-md-4 text-center">
                  {{ company.yearSalary | salary }}
                </div>
                <div class="comment t4">
                  {{ company.popularComment }}
                </div>
              </div>
              <div class="d-flex action-btn text-center t3">
                <router-link
                  class="w-100 py-2 border-right"
                  :to="{
                    name: 'companyReviews',
                    params: { custno: encodeCustno(company.custno) }
                  }"
                  v-gtm="gtmTag.list"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="rate">{{
                    company[theProperScoreKey] | decimal
                  }}</span>
                  <span class="title">公司評價</span>
                </router-link>
                <a
                  :class="['w-100', 'py-2', { disabled: company.jobCount < 1 }]"
                  :href="company.custUrl"
                  v-gtm="gtmTag.job"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="rate job">{{ company.jobCount }}</span>
                  <span class="title">工作機會</span>
                </a>
              </div>
            </div>
          </template>
        </LockItem>
      </div>
    </template>
    <template v-else>
      <div
        class="topThree-block rounded position-relative bg-white"
        v-for="num in 3"
        :key="`loading-${num}`"
      >
        <div class="card loading">
          <div class="number pl-1">{{ num }}</div>
          <div
            class="card__content pt-4 pt-md-6 pb-4 px-6 border-bottom d-flex flex-column justify-content-center flex-grow-1"
            :class="{ salary: isSalary }"
          >
            <div
              class="company-header d-flex justify-content-center align-items-center mb-0 mb-md-4"
            >
              <div
                class="logo mr-4 placeholder-block h-100 flex-shrink-0"
              ></div>
              <div class="placeholder-block w-100 h-50"></div>
            </div>
            <div class="comment placeholder-block w-100 h-50 mx-auto"></div>
          </div>
          <div class="d-flex action-btn text-center t3">
            <a class="w-100 py-2 border-right" href="javascript: void(0);">
              <span class="placeholder-block w-50 h-50"></span>
            </a>
            <a class="w-100 py-2" href="javascript: void(0);">
              <span class="placeholder-block w-50 h-50"></span>
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CompanyHeader from "@/components/CompanyHeader.vue";
import LockItem from "@/components/LockItem.vue";
import { leaderboardMixins } from "@/mixins/leaderboardMixins.js";
import setGtmDirective from "@/directive/setGtmDirective.js";
export default {
  name: "TopThree",
  components: {
    CompanyHeader,
    LockItem
  },
  mixins: [leaderboardMixins],
  directives: {
    setGtmDirective
  },
  props: {
    topThreeCompany: {
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
  }
};
</script>

<style lang="scss" scoped>
.topThree-block {
  display: flex;
  flex: 0 0 100%;
  flex-direction: column;
  min-height: 109px;
  max-width: 100%;
  box-shadow: 0 4px 8px 0 rgba(41, 41, 41, 0.2);
  overflow: hidden;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
  &:hover {
    box-shadow: 0 6px 16px 0 rgba(41, 41, 41, 0.2);
  }
}
.card {
  display: flex;
  flex-direction: column;
  height: 100%;

  .action-btn {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 36px;
    @include device-up(md) {
      flex-basis: 60px;
    }
  }
  &.loading {
    .card__content {
      flex-basis: 72px;
      &.salary {
        flex-basis: 112px;
      }
      @include device-up(md) {
        flex-basis: 152px;
        &.salary {
          flex-basis: 212px;
        }
      }
    }

    .company-header {
      height: 40px;
      .logo {
        width: 40px;
      }
      @include device-up(md) {
        height: 56px;
        .logo {
          width: 56px;
        }
      }
    }
  }
}
.number {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  font-size: 16px;
  line-height: 18px;
  padding-top: 2px;
  font-weight: 700;
  color: get-color(primary);
  background: linear-gradient(
    135deg,
    get-color(bg-primary) 50%,
    transparent 50%
  );
}
.salary {
  font-size: 20px;
  line-height: 1.4;
  font-weight: bold;
  color: get-color(text);
}
.comment {
  color: get-color(text-info);
  display: none;
  @include device-up(md) {
    display: block;
    @include truncate-text(2);
    height: 40px;
  }
}
.action-btn {
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: get-color(link);
    &:hover {
      color: get-color(link-hover);
    }
    &.disabled {
      color: get-color(disable);
      pointer-events: none;
    }
  }
  .title {
    line-height: 1.43;
    color: get-color(text-info);
    pointer-events: none;
  }
  .rate {
    order: 1;
    color: get-color(text-info);
    line-height: 1.43;
    margin-right: 2px;
    pointer-events: none;
    &.job {
      &::before {
        content: "(";
      }
      &::after {
        content: ")";
      }
    }
  }
}

.company-header {
  order: 1;
}
.noLogin {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  flex-grow: 1;
  font-size: 16px;
  line-height: 1.75;
  color: get-color(text-info);
  font-weight: bold;
  background-color: get-color(bg-primary);
  background-image: url("~@/assets/leaderboard/noLogin_mb.png");
  background-position: center bottom;
  background-size: 276px;
  background-repeat: no-repeat;
  &.isSalary {
    background-image: url("~@/assets/leaderboard/noLogin-salary_mb.png");
    height: 149px;
    @include device-up(md) {
      height: 100%;
    }
  }

  .number {
    background: linear-gradient(135deg, #fff 50%, transparent 50%);
  }

  button {
    display: block;
    width: 88px;
    height: 32px;
    outline: none;
    border: none;
    background-color: get-color(primary-fill);
    &:hover,
    &:active,
    &:focus {
      background-color: get-color(primary-fill-hover);
    }
  }
}

@include device-up(md) {
  .topThree-block {
    flex-basis: calc((100% - 32px) / 3);
    max-width: calc((100% - 32px) / 3);
    &:not(:last-child) {
      margin-bottom: 0;
      margin-right: 16px;
    }
    @include support-ie {
      flex-basis: calc((100% - 32px) / 3 - 0.5px);
      max-width: calc((100% - 32px) / 3 - 0.5px);
    }
  }
  .company-header {
    order: 0;
  }
  .salary {
    font-size: 36px;
    line-height: 48px;
  }
  .noLogin {
    justify-content: center;
    padding-top: 0;
    background-size: 309px;
    background-image: url("~@/assets/leaderboard/noLogin.png");
    &.isSalary {
      background-image: url("~@/assets/leaderboard/noLogin-salary.png");
    }
  }
  .action-btn {
    a {
      flex-direction: column;
    }
    .title {
      font-size: 12px;
      line-height: 1.33;
    }
    .rate {
      color: currentColor;
      font-weight: bold;
      font-size: 16px;
      order: initial;
      line-height: 1.75;
      &.job {
        &::after,
        &::before {
          display: none;
        }
      }
    }
  }
}
</style>
