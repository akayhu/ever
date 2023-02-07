<template>
  <div class="FormReview container-rwd mx-auto">
    <bread-crumbs
      class="my-6 d-none d-md-block"
      level-two-path="/reviews"
      level-two-title="評論"
      level-three-title="匿名分享評論"
    />

    <div class="review-form-content-container bg-white rounded mt-md-6">
      <div
        v-if="pageIsLoading"
        class="loading-wrapper d-flex justify-content-center align-items-center"
      >
        <Loading />
      </div>

      <template v-else-if="userLoginStatus === 2">
        <div
          class="mobile-nav d-flex d-md-none justify-content-center border-bottom bg-white"
        >
          <MobileNavBtn :first="true" content="評論" target="#comment" />
          <MobileNavBtn content="評價" target="#rating" />
          <MobileNavBtn content="工作資訊" target="#jobinfo" />
        </div>
        <form-title form-title="匿名分享評論" class="px-4 py-4 py-md-8" />
        <form class="review-form pt-6 pt-md-0 pb-10 pb-md-12">
          <div class="form-field comment-table">
            <div id="comment" class="field-title">評論</div>

            <div class="form-group mb-6">
              <div class="form-group-title required mt-md-1">
                匿名身份
              </div>
              <PlantList
                :currentPlantId="currentPlantId"
                @click="plantId => clickAnonymousPlant(plantId)"
              />
            </div>

            <div class="form-group mb-6 align-items-center">
              <div class="form-group-title required mt-md-1">
                評論身份
              </div>
              <TypeIdRadioGroup
                :currentTypeId="currentTypeId"
                @change="changeReviewType"
              />
            </div>
          </div>
          <InterviewSection
            v-if="isTypeInterview"
            :currentPlantId="currentPlantId"
            :currentTypeId="currentTypeId"
            @jumpToFirstErr="jumpToFirstErr"
          />
          <ReviewSection
            v-else
            :resumeLists="resumeLists"
            :currentPlantId="currentPlantId"
            :currentTypeId="currentTypeId"
            :isNoWorkExp="isNoWorkExp"
            @jumpToFirstErr="jumpToFirstErr"
          />
        </form>
      </template>
    </div>
  </div>
</template>

<script>
// fixMe advantage 初始值設定為空字串一開始 dirty 就會是 true
import { commonMixins } from "@/mixins/commonMixins";
import { matchCusnoMixin } from "@/views/mixins/matchCustno";
import MobileNavBtn from "@/components/formComponent/MobileNavBtn";
import BreadCrumbs from "@/components/formComponent/BreadCrumbs";
import FormTitle from "@/components/formComponent/FormTitle";
import PlantList from "@/components/formComponent/PlantList";
import TypeIdRadioGroup from "@/components/formComponent/TypeIdRadioGroup";
import ReviewSection from "@/components/formComponent/ReviewSection";
import InterviewSection from "@/components/formComponent/InterviewSection";
import { apiGetUserResumeExp } from "@/apis/user";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import { EventBus } from "@/utils/eventBus.js";
import { TYPEID_MAP } from "@/utils/enum.js";
import { checkIsTypeInterview } from "@/utils/reviewData";

export default {
  name: "FormReview",
  components: {
    MobileNavBtn,
    BreadCrumbs,
    FormTitle,
    Loading,
    PlantList,
    TypeIdRadioGroup,
    ReviewSection,
    InterviewSection
  },
  mixins: [commonMixins, matchCusnoMixin],
  data() {
    return {
      pageIsLoading: true,
      resumeLists: [
        {
          value: "",
          label: "以上都不是你想評論的公司嗎?"
        }
      ],
      currentPlantId: this.getAnonymousPlantsData()[0].value,
      isNoWorkExp: false
    };
  },
  created() {
    if (this.pageIsLoading) {
      this.getResumeCompany();
    }
  },
  computed: {
    ...mapGetters("user", ["userLoginStatus"]),
    currentTypeId() {
      return parseInt(this.$route.query.typeId, 10) || TYPEID_MAP.FULL_TIME;
    },
    isTypeInterview() {
      return checkIsTypeInterview(this.currentTypeId);
    }
  },
  methods: {
    getResumeCompany() {
      apiGetUserResumeExp().then(res => {
        this.pageIsLoading = false;
        // emit 一個事件給 footer component,讓 footer 打開
        EventBus.$emit("showFooter");

        // 如果履歷無資料, 則 touch custno, 顯示錯誤訊息
        if (res.data.response.length === 0) {
          this.isNoWorkExp = true;
        }

        this.resumeLists.unshift(...res.data.response);
        this.resumeLists.forEach(resumeCompany => {
          if (!resumeCompany.companyName) return;
          resumeCompany.label = resumeCompany.companyName;
          resumeCompany.value = resumeCompany.companyName;
        });
      });
    },
    clickAnonymousPlant(number) {
      this.currentPlantId = number;
    },
    getPosition(element) {
      let x = 0;
      let y = 0;
      while (element) {
        x += element.offsetLeft - element.scrollLeft + element.clientLeft;
        y += element.offsetTop - element.scrollLeft + element.clientTop;
        element = element.offsetParent;
      }
      return { x: x, y: y };
    },
    jumpToFirstErr() {
      const allInvalidField = document.querySelectorAll(".invalid-field");
      const firsErrRect = this.getPosition(allInvalidField[0]).y - 126;
      window.scrollTo({
        top: firsErrRect,
        behavior: "smooth"
      });
    },
    changeReviewType(typeId) {
      this.$router.replace({
        path: "/form/review",
        query: { typeId }
      });
    }
  }
};
</script>

<style lang="scss">
.FormReview {
  .el-popper {
    left: 0 !important;
    .el-scrollbar__wrap {
      max-height: calc(44px * 7);
      @include support-ie {
        max-height: calc(44px * 7 + 16px);
      }
    }
  }

  input[type="text"]:disabled,
  input[type="number"]:disabled {
    cursor: not-allowed;
  }
}

.review-form-content-container {
  .loading-wrapper {
    min-height: 800px;
  }
  .mobile-nav {
    position: sticky;
    top: 44px;
    z-index: 10;
  }

  .review-form {
    max-width: 1022px;
    margin: 0 auto;
    border-top: 1px solid get-color(border);
    @include device-up(md) {
      border-top: none;
    }
    .form-field {
      @include device-up(md) {
        padding-right: 11px;
      }
      @include device-up(lg) {
        padding-right: 0;
      }
    }

    //------評論列表------
    .comment-table {
      .company-loading {
        z-index: 1000;
        top: 5px;
        left: 5px;
        transform: scale(0.5);
        transform-origin: 0 0;
      }
      .text-length {
        color: get-color(gray-normal);
      }
    }

    //------評價列表------
    .rating-table {
      .more-ratings-btn {
        font-size: 16px;
        line-height: 28px;
        color: get-color(text-info);
        font-weight: 700;
        cursor: pointer;
        @include device-up(md) {
          font-size: 14px;
          line-height: 20px;
        }

        &:hover {
          color: get-color(primary);
        }

        &[disabled="disabled"] {
          color: get-color(disable);
          cursor: not-allowed;
        }
      }
    }

    //------工作資訊列表------
    .jobinfo-table {
      .form-group {
        position: relative;
      }
      .switch-btn {
        margin-top: 16px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        .el-switch {
          margin-left: auto;
        }
        @include device-up(md) {
          margin-top: 0;
          margin-left: 28px;
          .el-switch {
            margin-left: 0;
          }
        }
      }

      .col-4 {
        max-width: calc((100% - 32px) / 3);
        @include support-ie {
          max-width: calc((100% - 32px) / 3 - 0.5px);
        }
      }

      .invalid-text {
        padding-left: calc((100% - 32px) / 3 + 28px);
      }
    }
  }
}

//------表單操作按鈕------
.FormReview {
  .toolTip {
    font-size: 14px;
    width: 244px;
    height: 200px;
    @include device-up(md) {
      width: auto;
      height: auto;
    }
  }
}
</style>
