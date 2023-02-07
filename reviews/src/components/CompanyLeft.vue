<template>
  <div
    class="company-left-block"
    :class="{ 'd-none': notOverview, 'd-md-block': notOverview }"
  >
    <div class="company-content bg-white rounded mb-3 mb-md-0 p-4">
      <div class="company-name d-flex align-items-start mb-4 mb-md-6">
        <div
          class="flex-shrink-0 d-flex justify-content-center align-items-center mr-2"
        >
          <Logo
            :src="companyData.companyLogo"
            :name="companyData.companyName"
          ></Logo>
        </div>
        <div class="company-name-title d-flex align-items-center">
          <router-link
            :to="{
              name: 'companyReviews',
              params: {
                companyId: companyData.custno
              }
            }"
            data-gtm-company="公司名稱"
            rel="noopener noreferrer"
          >
            <h1 class="t3 font-weight-bold">{{ companyData.companyName }}</h1>
          </router-link>
        </div>
      </div>

      <div class="evaluation mb-4">
        <div
          v-if="checkInterviewScore"
          :class="{ divider: checkInterviewScore && checkOverallScore }"
        >
          <div class="title t3 font-weight-bold mb-1">
            <span>面試評價</span>
            <span class="score-mw ml-3 mr-1">
              {{ getScore(companyData.interviewScore) }}</span
            >
            <span class="score-mw font-weight-normal">分</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <span class="fraction mr-4  d-none d-md-block">
                {{ getScore(companyData.interviewScore) }}
              </span>
              <div class="score">
                <praise-img
                  class="mb-1 mr-3"
                  :score="companyData.interviewScore"
                  :primaryColor="false"
                />
                <div
                  class="number-of_votes t4"
                  :title="`來自${companyData.interviewCount}位員工填寫評論`"
                >
                  ({{ companyData.interviewCount }})
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="checkOverallScore">
          <div class="title t3 font-weight-bold mb-1">
            <span>公司整體評價</span>
            <span class="score-mw ml-3 mr-1">
              {{ getScore(companyData.scoreOverall) }}</span
            >
            <span class="score-mw font-weight-normal">分</span>
          </div>
          <div
            class="d-flex justify-content-between align-items-center position-relative"
          >
            <div class="d-flex align-items-center">
              <span class="fraction mr-4 d-none d-md-block">
                {{ getScore(companyData.scoreOverall) }}
              </span>
              <div class="score">
                <praise-img
                  class="mb-1 mr-3"
                  :score="companyData.scoreOverall"
                />
                <div
                  class="number-of_votes t4"
                  :title="`來自${companyData.reviewCount}位員工填寫評論`"
                >
                  ({{ companyData.reviewCount }})
                </div>
              </div>
            </div>
            <!-- MW button -->
            <Button
              path="/form/review"
              class="btn-outline-primary company-button d-md-none position-absolute mw-review-btn"
              btn-text="我要匿名評論"
              data-gtm-company="我要匿名評論"
            />
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center d-md-none">
        <div
          class="drawDown font-weight-bold"
          @click="showDropdown = true"
          v-if="checkIconShow"
        >
          查看類別評價與薪資 <i class="jb_icon_down font-weight-bold" />
        </div>
      </div>
      <div
        class="category-rating d-none d-md-block"
        v-if="checkShowReviewItems"
        :class="{
          'mb-4': employeeSalary.length,
          'mb-md-6': !employeeSalary.length,
          'd-block': showDropdown
        }"
      >
        <dl
          :class="{
            'show-border': employeeSalary.length,
            'pb-4': employeeSalary.length
          }"
        >
          <dd
            v-for="(item, index) in filterReviewItems"
            :key="index"
            class="t4"
          >
            <span class="mr-4">{{ item.reviewItem }}</span>
            <span class="font-weight-bold">{{ getScore(item.score) }}</span>
            分
          </dd>
        </dl>
      </div>
      <div
        class="category-salary d-none d-md-block mb-md-6"
        :class="{
          'd-block': checkShowSalary
        }"
      >
        <dl v-if="companyData.listedStock">
          <dt class="t3 font-weight-bold mb-1">
            <span>員工年薪</span>
            <el-tooltip placement="top">
              <div slot="content" class="t4 text-white">
                資訊取自公開資訊觀測站<br />
                (由證交所、櫃買中心共同建立)
              </div>
              <i class="jb_icon_info ml-1"></i>
            </el-tooltip>
          </dt>
          <dd
            v-for="(item, index) in employeeSalary"
            :key="index"
            class="t4 d-flex flex-shrink-0 justify-content-between"
          >
            <div class="left mr-4">
              <span>{{ item.text }}</span>
              <el-tooltip placement="top" v-if="item.showHint">
                <div slot="content" class="t4 text-white">
                  薪資中位數是將全體員工按全年總薪<br />資由小到大排列 ,
                  取中間點的數字
                </div>
                <i class="jb_icon_info ml-1"></i>
              </el-tooltip>
            </div>
            <div v-if="item.needLogin && !isLoginForInfo">
              <a
                href="#"
                class="font-weight-bold login-text"
                data-gtm-sidebar="登入看資料"
                @click.prevent="showLightBox = true"
                >登入看資料</a
              >
            </div>
            <div v-else>
              <span class="font-weight-bold mr-1 text">{{ item.value }}</span>
              <span>{{ item.unit }}</span>
            </div>
          </dd>
        </dl>
      </div>
      <Button
        class="btn-outline-primary company-button d-none d-md-block"
        path="/form/review"
        btn-text="我要匿名評論"
        data-gtm-company="我要匿名評論"
      />
      <Button
        v-if="notOverview"
        class="btn-outline-primary company-button"
        :path="`/company/${encodeCustno(companyData.custno)}/reviews`"
        btn-text="觀看所有評論"
        data-gtm-company="觀看所有評論"
      />
    </div>

    <CareerOpportunities
      v-if="companyJobs.joblist.length > 0"
      :companyJobs="companyJobs"
      class="d-none d-md-block mt-4"
    />
    <light-box
      title="登入會員"
      content="登入104會員 , 即可查看上鎖資訊"
      right-btn-content="立即登入"
      :show-cancel-btn="false"
      :rightCallBack="goLogin"
      :showLightBox="showLightBox"
      :closeAndClearLightBox="closeBox"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PraiseImg from "@/components/Praise.vue";
import Button from "@/components/Button.vue";
import Logo from "@/components/Logo.vue";
import CareerOpportunities from "@/components/CareerOpportunities.vue";
import { commonMixins } from "@/mixins/commonMixins";
import { companySalaryFormat } from "@/utils/index";
import { login } from "@/apis/user";
import LightBox from "@/components/formComponent/LightBox";

export default {
  name: "CompanyLeft",
  components: {
    PraiseImg,
    Button,
    CareerOpportunities,
    Logo,
    LightBox
  },
  mixins: [commonMixins],
  data() {
    return {
      salaryTextMap: {
        overallAvgSalary: "全體平均",
        nonSupervisorAvg: "非主管平均",
        nonSupervisorMed: "非主管中位數",
        avgRaiseSalary: "平均加薪幅度"
      },
      showDropdown: false,
      showLightBox: false
    };
  },

  computed: {
    ...mapGetters("company", ["getCompanyData"]),
    ...mapGetters("ui", ["getUi"]),
    ...mapGetters("user", ["isLoginForInfo"]),

    companyData() {
      return this.getCompanyData.companyData;
    },
    companyJobs() {
      return this.getCompanyData.jobs;
    },
    filterReviewItems() {
      let data = this.getCompanyData.companyData.reviewItems.filter(
        (item, index) => Number(Math.round(item.score)) > 2
      );
      if (data.length > 5) data = data.filter((item, index) => index < 5);
      return data;
    },
    getEnv() {
      return process.env.VUE_APP_ENV;
    },
    getRouterName() {
      return this.getUi.routerHistoryName;
    },
    notOverview() {
      return (
        this.getRouterName !== "companyReviews" &&
        this.getRouterName !== "companyVotes"
      );
    },
    employeeSalary() {
      const result = [];
      if (!this.companyData.listedStock) return result;
      const salary = this.companyData.listedStock;
      Object.keys(this.salaryTextMap).forEach(key => {
        const originalValue = salary[key];
        const valid = this.checkValueValid(originalValue);
        if (valid) {
          const tmp = {
            value:
              key === "avgRaiseSalary"
                ? originalValue
                : companySalaryFormat(originalValue),
            text: this.salaryTextMap[key],
            showHint: key === "nonSupervisorMed",
            needLogin: key === "avgRaiseSalary",
            unit: key === "avgRaiseSalary" ? "%" : "萬"
          };
          result.push(tmp);
        }
      });
      return result;
    },
    checkIconShow() {
      // 當還沒按下且有評論的時候顯示
      return !this.showDropdown && this.checkShowReviewItems;
    },
    checkShowSalary() {
      // 當按下箭頭或者是沒有評論的時候顯示
      return this.showDropdown || !this.checkShowReviewItems;
    },
    checkOverallScore() {
      // 若平均分數小於 3 ，則不顯示評價以及評論
      const scoreOverall = this.companyData.scoreOverall;
      return scoreOverall && Math.floor(scoreOverall) >= 3;
    },
    checkInterviewScore() {
      // 若平均分數小於 3 ，則不顯示評價以及評論
      const interviewScore = this.companyData.interviewScore;
      return interviewScore && Math.floor(interviewScore) >= 3;
    },
    checkShowReviewItems() {
      if (!this.checkOverallScore) return false;
      return this.companyData.reviewItems.length > 0;
    }
  },
  methods: {
    getImageReplace(url) {
      const imgUrl = url.replace("104-dev", "104");
      return imgUrl;
    },
    checkValueValid(value) {
      // 如果沒值，或者是值為 0 的情況下，不顯示 (代表沒資料)
      if (!value) return false;
      return true;
    },
    goLogin() {
      login(`${window.location.pathname}`);
    },
    closeBox() {
      this.showLightBox = false;
    },
    getScore(scroe) {
      return Number(scroe).toFixed(1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.company-left-block {
  .company-content {
    color: #292929;
    .company-name {
      &-title {
        min-height: 44px;
        h1 {
          color: #1654b9;
          word-wrap: break-word;
          word-break: break-all;
          @include media-breakpoint-down(sm) {
            @include truncate-text(4);
          }
          &:hover {
            color: #4e91ff;
          }
        }
      }
    }

    .evaluation {
      .fraction {
        font-size: 36px;
        line-height: 40px;
      }

      .score {
        @include media-breakpoint-down(sm) {
          display: flex;
        }

        &-mw {
          display: none;
          @include media-breakpoint-down(sm) {
            display: inline-block;
          }
        }
      }

      .divider {
        margin-bottom: 24px;
        @include media-breakpoint-down(sm) {
          margin-bottom: 16px;
        }
      }

      .number-of_votes {
        color: #7e7e7e;
      }

      .mw-review-btn {
        right: 0;
        bottom: 0;
      }
    }

    .category-rating,
    .category-salary {
      dd {
        &:not(:last-child) {
          padding-bottom: 4px;
        }
      }
    }
    .category-salary {
      .login-text {
        color: #7e7e7e;
        cursor: pointer;
        &:hover {
          color: #ff7800;
        }
      }
      .jb_icon_info {
        color: $gray-700;
        font-size: 16px;
        vertical-align: -2px;
      }
    }

    .top-comments {
      p {
        word-wrap: break-word;
        word-break: break-all;
      }
    }

    .drawDown {
      color: #7e7e7e;
      cursor: pointer;
      &:hover {
        color: #ff7800;
      }
    }

    .company-button {
      width: 116px;
      height: 32px;
      font-size: 14px;
      line-height: 20px;
      @include media-breakpoint-up(md) {
        width: 100%;
      }

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
    .show-border {
      border-bottom: 1px solid #eeeeee;
    }
  }
}
.logo {
  width: 44px;
  height: 44px;
}
</style>
