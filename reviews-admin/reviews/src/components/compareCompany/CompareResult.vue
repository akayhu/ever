<template>
  <div class="bg-white rounded-bottom overflow-hidden ">
    <div class="compare-result py-6 pt-md-12 pb-md-8 paddingX-rwd">
      <div class="compare-container">
        <div class="text-center t2 font-weight-bold mb-4 d-none d-md-block">
          比較結果
        </div>
        <template v-if="!loading">
          <div class="d-flex justify-content-center">
            <div
              v-for="(company, index) in compareData"
              :key="index"
              class="compare-panel basic bg-white rounded p-4 p-md-6"
            >
              <template v-if="showPanel[index] && company.custno">
                <CompanyHeader
                  class="mb-7 mb-md-4 text-center"
                  logoClass="mb-1 mb-md-3 mx-auto"
                  :src="company.companyLogo"
                  :custno="company.custno"
                  :name="company.companyName"
                />
                <template v-if="showReviewItems[index]">
                  <div class="average mb-12">
                    <div class="average__score">
                      <div class="score mb-1 font-weight-bold">
                        {{ company.scoreOverall | decimal }}
                      </div>
                      <praise-img
                        :score="getScoreStampNum(+company.scoreOverall)"
                      />
                    </div>
                    <div class="average__link mt-4 mt-md-0">
                      <router-link
                        class="see-more font-weight-bold t4"
                        :to="{
                          name: 'companyReviews',
                          params: { custno: encodeCustno(company.custno) }
                        }"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        看匿名評論 <i class="jb_icon_right font-weight-bold" />
                      </router-link>
                    </div>
                  </div>
                  <div class="compare-term-list">
                    <div class="text-center t2 font-weight-bold mb-2">
                      類別評價
                    </div>
                    <template v-for="(item, idx) in reviewItemsMap">
                      <div
                        :key="item"
                        class="compare-term d-flex justify-content-center"
                        v-if="idx < 5 || showMore"
                      >
                        <div>
                          <div class="title text-center t3">
                            {{ item }}
                          </div>
                          <template v-if="company.reviewItems[idx]">
                            <div
                              class="score text-center font-weight-bold"
                              :class="{
                                win:
                                  compareScoreResult.reviewItems[item] === index
                              }"
                            >
                              {{ company.reviewItems[idx].score | decimal }}
                            </div>
                          </template>
                          <template v-else>
                            <p class="no-data">評價蒐集中</p>
                          </template>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <div class="no-result no-comment">
                    <div class="wrap px-4 px-md-6">
                      <p class="mb-6">
                        這間公司目前還沒有評論~<br />歡迎在職或曾任職員工留下您的評論!
                      </p>
                      <Button class="btn-secondary" path="/form/review" />
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>

          <div v-if="!showMore" class="d-flex justify-content-center mt-4">
            <div
              class="see-more font-weight-bold"
              data-gtm-btn="更多類別評價"
              @click="showMore = true"
            >
              更多類別評價 <i class="jb_icon_down font-weight-bold" />
            </div>
          </div>

          <div class="d-flex justify-content-center mt-6">
            <div
              v-for="(company, index) in compareData"
              :key="index"
              class="compare-panel salary bg-white rounded p-4 p-md-6"
            >
              <template v-if="showPanel[index] && company.custno">
                <template v-if="showListedStock[index]">
                  <div class="compare-term-list">
                    <div class="text-center t2 font-weight-bold mb-2">
                      員工年薪
                    </div>
                    <div
                      v-for="(value, key) in company.listedStock"
                      :key="key"
                      class="compare-term d-flex justify-content-center"
                    >
                      <div class="d-flex flex-column align-items-center">
                        <div class="title text-center t3">
                          {{ listedStockMap[key] }}
                        </div>
                        <LockItem
                          text="登入看資料"
                          :lockCondition="lockItem.includes(key)"
                        >
                          <template #locked="{ icon, link, goLogin }">
                            <a
                              href="#"
                              @click.prevent="goLogin"
                              :class="link"
                              data-gtm-btn="登入看資料"
                            >
                              <i :class="icon" />
                              登入看資料
                            </a>
                          </template>
                          <template #normal v-if="!!+value">
                            <div
                              class="score text-center text-md-right font-weight-bold"
                              :data-suffix="
                                key === 'avgRaiseSalary' ? '%' : '萬'
                              "
                              :class="{
                                percentage: key === 'avgRaiseSalary',
                                win:
                                  compareScoreResult.listedStock[key] === index
                              }"
                            >
                              <span>{{ value | salary(key) }}</span>
                            </div>
                          </template>
                          <template #normal v-else>
                            <p class="no-data">公司未揭露資訊</p>
                          </template>
                        </LockItem>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="no-result no-salary-data px-4 px-md-6">
                    <p>非本國上市、上櫃企業，故無薪資資訊揭露</p>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="d-flex justify-content-center loading">
            <div
              v-for="panel in 2"
              class="compare-panel basic d-flex flex-column bg-white rounded p-4 p-md-6 overflow-hidden"
              :key="`loading-panel-${panel}`"
            >
              <div class="company-header">
                <div class="logo placeholder-block mx-auto mb-3"></div>
                <div class="name placeholder-block"></div>
              </div>
              <div class="w-100 h-100 mt-3 mt-md-5">
                <div class="placeholder-block h-100 my-2"></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <ToTop />
  </div>
</template>

<script>
import CompanyHeader from "@/components/CompanyHeader.vue";
import PraiseImg from "@/components/Praise.vue";
import LockItem from "@/components/LockItem.vue";
import Button from "@/components/Button.vue";
import ToTop from "@/components/ToTop.vue";
import {
  formatDecimalNum,
  companySalaryFormat,
  encodeCustno
} from "@/utils/index";
export default {
  name: "CompareResult",
  components: {
    CompanyHeader,
    PraiseImg,
    ToTop,
    LockItem,
    Button
  },
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    compareData: {
      type: Array,
      required: true
    },
    compareScoreResult: {
      type: Object,
      required: true
    },
    showPanel: {
      type: Array,
      required: true
    },
    listedStockMap: {
      type: Object,
      required: true
    },
    reviewItemsMap: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showMore: false,
      lockItem: ["avgRaiseSalary"]
    };
  },
  filters: {
    decimal: formatDecimalNum,
    salary: (value, key) => {
      if (key === "avgRaiseSalary") {
        return value;
      } else {
        return companySalaryFormat(value);
      }
    }
  },
  computed: {
    showReviewItems() {
      if (!this.compareData.length) return;
      return this.compareData.map(company => {
        return company.custno ? company.reviewItems.some(item => item) : false;
      });
    },
    showListedStock() {
      if (!this.compareData.length) return;
      return this.compareData.map(company => !!company.listedStock);
    }
  },
  methods: {
    getScoreStampNum(score) {
      return score ? +score.toFixed(1) : 0;
    },
    encodeCustno: encodeCustno
  },
  watch: {
    compareData() {
      // 在換公司時，顯示更多狀態要重置
      if (this.showMore) this.showMore = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.loading {
  .company-header {
    .logo {
      width: 40px;
      height: 40px;
    }
    .name {
      height: 40px;
    }
    @include device-up(md) {
      .logo {
        width: 56px;
        height: 56px;
      }
    }
  }
}
.compare-result {
  color: get-color(text);
  background-color: rgba(255, 238, 223, 0.5);

  .compare-panel {
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    flex-basis: calc((100% - 24px) / 2);
    max-width: calc((100% - 24px) / 2);
    box-shadow: 0 4px 8px 0 #ffd6b2;
    z-index: 1;
    &:not(:last-child) {
      margin-right: 24px;
    }
    &.basic {
      min-height: 724px;
    }
    &.salary {
      min-height: 400px;
      .score {
        position: relative;
        min-width: 64px;
        &::after {
          font-weight: normal;
          line-height: 1;
          content: attr(data-suffix);
        }
        &.win {
          &::before {
            left: calc(100% + 10px);
          }
        }
        &:not(.percentage) {
          &::after {
            margin-left: 8px;
            font-size: 16px;
          }
        }
      }
    }
    @include device-up(md) {
      &.basic {
        min-height: 824px;
      }
      &.salary {
        min-height: 500px;
        .score {
          min-width: 89px;
        }
      }
    }

    .average {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      @include device-down(md) {
        justify-content: center;
        align-items: center;
        .average__score {
          flex-basis: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
        }
      }
    }

    .score {
      font-size: 36px;
      line-height: 40px;
      &.win {
        position: relative;
        &::before {
          content: "";
          position: absolute;
          // top: 50%;
          bottom: 0;
          left: calc(100% + 8px);
          width: 31px;
          height: 32px;
          background: url(~@/assets/compareCompany/icon-win.png) no-repeat 50%
            50% / contain;
          transform: translateY(-8px);
        }
      }
      @include device-down(md) {
        font-size: 20px;
        line-height: 1.4;
      }
    }

    @include device-down(md) {
      flex-basis: calc((100% - 8px) / 2);
      max-width: calc((100% - 8px) / 2);
      &:not(:last-child) {
        margin-right: 2%;
      }
    }
  }

  .compare-term-list {
    .compare-term {
      padding-top: 16px;
      &:not(:last-child) {
        padding-bottom: 16px;
        border-bottom: 1px solid get-color(border);
      }
      .score {
        line-height: 48px;
        @include device-down(md) {
          line-height: 1.4;
        }
      }
    }
  }

  .see-more {
    color: get-color(text-info);
    cursor: pointer;
    &:hover {
      color: get-color(primary);
    }
  }
}
.no-data,
.lock-item {
  color: get-color(disable);
  font-size: 16px;
  line-height: 1.75;
  text-align: center;
  margin: 0;
  @include device-up(md) {
    margin: 10px 0;
  }
}
.no-result {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  color: get-color(text-info);
  line-height: 1.43;
  &.no-comment {
    top: 18.4%;
    padding-top: 115px;
    background: url(~@/assets/compareCompany/bg-no-comment_mb.png) no-repeat 50%
      100% / 100% auto;
    @include device-up(md) {
      top: 17.8%;
      padding-top: 93px;
      background: url(~@/assets/compareCompany/bg-no-comment.png) no-repeat 50%
        100% / 100% auto;
    }
  }
  &.no-salary-data {
    bottom: 16px;
    padding-top: 145px;
    background: url(~@/assets/compareCompany/bg-no-salaryData.png) no-repeat 50%
      100% / 70% auto;
    @include device-up(md) {
      bottom: 24px;
      top: 17.8%;
      padding-top: 70px;
      background-size: 189px 198px;
    }
  }
}
.btn {
  max-width: 154px;
  width: 100%;
}
</style>
