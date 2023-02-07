<template>
  <div>
    <!-- 評論 -->
    <div class="form-field comment-table">
      <!-- 公司名稱 -->
      <div class="form-group mb-6">
        <div class="form-group-title required">
          公司名稱
        </div>
        <div class="w-100">
          <div class="info-text mb-2 mb-md-1">
            須先確認公司有在 104 上徵才，才能填寫以下欄位唷！
          </div>
          <div class="position-relative">
            <Loading
              v-if="isCompanyLoading"
              class="company-loading position-absolute"
            />
            <AutoComplete
              class="d-block"
              :disabled="!isFormDisabled || isCompanyLoading"
              :value="companyName"
              @value-inputed="getCompanyName"
              @value-selected="getCompanyNo"
              popperClass="company-ac-popper p-0 m-0"
              :querySearch="acSearch"
              :invalid-field="
                $v.hasReview.$error || $v.interviewData.custno.$error
              "
            />
            <div class="invalid-text t5 pl-3">
              <template v-if="$v.hasReview.$error">
                {{ $t("errorMsg.hasReview", { day: 30 }) }}
              </template>
              <template v-else-if="$v.interviewData.custno.$error">
                <template v-if="hasCheckedCompany">
                  很抱歉，此公司沒有在 104 上徵才，因此暫不提供評論
                </template>
                <template v-else>
                  請按下方「檢查公司名稱」確認評價公司
                </template>
              </template>
              <span
                v-else-if="$v.interviewData.custno.$dirty"
                class="valid-text"
              >
                公司名稱檢查正確
              </span>
            </div>
            <button
              v-if="isFormDisabled"
              class="change-company-btn btn check-btn"
              type="button"
              data-gtm-form="檢查公司名稱"
              @click.prevent="checkCompany"
            >
              檢查公司名稱
            </button>
            <button
              v-else
              class="change-company-btn btn"
              type="button"
              data-gtm-form="修改公司名稱"
              @click.prevent="changeCompany"
            >
              修改公司名稱
            </button>
          </div>
        </div>
      </div>
      <!-- 面試心得 -->
      <div class="form-group mb-6">
        <div class="form-group-title required mt-md-2">
          面試心得
        </div>
        <FormTextareaCounter
          v-model="$v.interviewData.advantage.$model"
          :disabled="isFormDisabled"
          :error="$v.interviewData.advantage.$error"
          :title="
            isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
          "
          placeholder="請描述你的面試經驗，如當時的面試問題/面試難度/整體面試時間等。(最少10字)"
        >
          <div v-if="$v.interviewData.advantage.$error" slot="error">
            <template v-if="!$v.interviewData.advantage.required">
              {{ $t("errorMsg.required") }}
            </template>
            <template v-else-if="!$v.interviewData.advantage.maxLength">
              {{ $t("errorMsg.stringLength") }}
            </template>
            <template v-else-if="!$v.interviewData.advantage.maxValue">
              {{ $t("errorMsg.stringMinLength", { minLength: "十" }) }}
            </template>
          </div>
        </FormTextareaCounter>
      </div>
    </div>
    <!-- 評價 -->
    <div id="rating" class="form-field rating-table">
      <div class="field-title">評價</div>
      <!-- 面試評價 -->
      <div class="form-group d-flex align-items-end mb-8 mb-md-6">
        <div class="form-group-title required">
          面試評價
        </div>
        <RatingStar
          :ratings="interviewData.scoreOverall"
          :disabled="isFormDisabled"
          @star-clicked="getOverallStar"
        />
      </div>
      <div class="form-group mb-0">
        <div class="form-group-title required">
          推薦意願
        </div>
        <div>
          <div class="info-text dark mb-2 mb-md-1">
            你會推薦朋友應徵這間公司嗎？
          </div>
          <div class="d-flex align-items-center">
            <ElRadio
              ref="recommend"
              :disabled="isFormDisabled"
              :title="
                isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
              "
              v-model="interviewData.isRecommend"
              class="m-0 font-weight-normal"
              :label="1"
              >推薦
            </ElRadio>
            <ElRadio
              ref="no-recommend"
              :disabled="isFormDisabled"
              :title="
                isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
              "
              v-model="interviewData.isRecommend"
              class="m-0 ml-10 ml-md-5 font-weight-normal"
              :label="0"
              >不推薦
            </ElRadio>
          </div>
        </div>
      </div>
    </div>

    <div class="w-100 mx-auto border-bottom my-8" />
    <!-- 工作資訊 -->
    <div id="jobinfo" class="form-field jobinfo-table">
      <div class="field-title">工作資訊</div>

      <div class="form-group mb-6">
        <div class="form-group-title mt-md-2">
          工作年資
        </div>
        <div class="d-flex w-100">
          <FormElementInputbox
            class="w-100 mr-4"
            for="seniorityYear"
            :disabled="isFormDisabled"
            :invalidField="$v.interviewData.seniorityYear.$error"
            :title="
              isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
            "
          >
            <input
              slot="input"
              v-model="$v.interviewData.seniorityYear.$model"
              class="w-100 border-0"
              type="text"
              id="seniorityYear"
              :disabled="isFormDisabled"
              autocomplete="off"
            />
            <span slot="fixedText" class="flex-shrink-0 t4">年</span>
            <div
              slot="valid"
              v-if="$v.interviewData.seniorityYear.$error"
              class="invalid-text"
            >
              <template v-if="!$v.interviewData.seniorityYear.numeric">
                {{ $t("errorMsg.numeric") }}
              </template>
              <template v-else-if="!$v.interviewData.seniorityYear.between">
                {{ $t("errorMsg.between", { msg: "0~40年" }) }}
              </template>
            </div>
          </FormElementInputbox>
          <FormElementInputbox
            class="w-100"
            for="seniorityMonth"
            :disabled="isFormDisabled"
            :title="
              isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
            "
            :invalidField="$v.interviewData.seniorityMonth.$error"
          >
            <input
              slot="input"
              v-model="$v.interviewData.seniorityMonth.$model"
              class="w-100 border-0"
              type="text"
              id="seniorityMonth"
              :disabled="isFormDisabled"
              autocomplete="off"
            />
            <span slot="fixedText" class="flex-shrink-0 t4">個月</span>
            <div
              slot="valid"
              v-if="$v.interviewData.seniorityMonth.$error"
              class="invalid-text"
            >
              <template v-if="!$v.interviewData.seniorityMonth.numeric">
                {{ $t("errorMsg.numeric") }}
              </template>
              <template v-else-if="!$v.interviewData.seniorityMonth.between">
                {{ $t("errorMsg.between", { msg: "0~11個月" }) }}
              </template>
            </div>
          </FormElementInputbox>
        </div>
      </div>

      <div class="form-group mb-6">
        <div class="form-group-title required mt-md-2">
          面試職務
        </div>
        <div class="d-md-flex align-items-center w-100">
          <FormElementInputbox
            class="w-100 flex-shrink-0"
            :disabled="isFormDisabled"
            :title="
              isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
            "
            :invalidField="$v.interviewData.jobName.$error"
          >
            <input
              slot="input"
              v-model="$v.interviewData.jobName.$model"
              class="w-100 border-0"
              type="text"
              placeholder="例如：行銷企劃專員"
              :disabled="isFormDisabled"
              maxlength="35"
              autocomplete="off"
            />
            <div
              slot="valid"
              v-if="$v.interviewData.jobName.$error"
              class="invalid-text"
            >
              <template v-if="!$v.interviewData.jobName.required">
                {{ $t("errorMsg.required") }}
              </template>
              <template v-if="!$v.interviewData.jobName.maxLength">
                {{ $t("errorMsg.stringLength") }}
              </template>
              <template v-if="!$v.interviewData.jobName.noSpecialWord">
                {{ $t("errorMsg.specialWord") }}
              </template>
            </div>
          </FormElementInputbox>
        </div>
      </div>
    </div>
    <!-- 服務條款 -->
    <ServiceTerms />
    <!-- 送出按鈕 -->
    <div class="mt-6 d-flex justify-content-center">
      <button
        class="btn btn-outline-primary cancel-btn t2 font-weight-bold"
        type="button"
        data-gtm-form="取消"
        @click.prevent="openCancelLightBox"
      >
        取消
      </button>
      <button
        class="btn agree-btn ml-3 ml-md-5 text-white t2 font-weight-bold"
        :class="{ 'btn-secondary': !this.$v.$invalid }"
        data-gtm-form="同意條款並送出"
        type="button"
        @click.prevent="checkBeforeSubmit"
      >
        同意條款並送出
      </button>
    </div>

    <!-- Light box -->
    <LightBox
      :title="lightboxData.title"
      :content="lightboxData.content"
      :show-cancel-btn="lightboxData.showCancelBtn"
      :left-btn-content="lightboxData.leftBtnContent"
      :right-btn-content="lightboxData.rightBtnContent"
      :showLightBox="showLightBox"
      :closeAndClearLightBox="closeAndClearLightBox"
      :leftCallBack="lightboxData.leftCallBack"
      :rightCallBack="lightboxData.rightCallBack"
    />

    <LightBox
      id="company-lists-interview"
      :title="lightboxData.title"
      :content="lightboxData.content"
      :show-cancel-btn="lightboxData.showCancelBtn"
      :show-confirm-btn="lightboxData.showConfirmBtn"
      :showLightBox="showCompanyList"
      :closeAndClearLightBox="closeCompanLists"
      :rightCallBack="lightboxData.rightCallBack"
    >
      <RadioGroup
        slot="additional-content"
        class="mt-6"
        :value="companyName"
        :companyLists="companyLists"
        @value-changed="getMatchedCompanyNo"
      />
    </LightBox>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
import FormTextareaCounter from "@/components/formComponent/FormTextareaCounter";
import AutoComplete from "@/components/formComponent/AutoComplete";
import RatingStar from "@/components/formComponent/RatingStar";
import FormElementInputbox from "@/components/formComponent/InputBox";
import ServiceTerms from "@/components/formComponent/ServiceTerms";
import LightBox from "@/components/formComponent/LightBox";
import Loading from "@/components/Loading.vue";
import RadioGroup from "@/components/formComponent/RadioGroup";
import {
  required,
  minLength,
  maxLength,
  numeric,
  between
} from "vuelidate/lib/validators";
import { noSpecialWord, hasReview } from "@/utils/customValidator";
import * as staticreviewData from "@/utils/reviewData";
import { apiGetCompaniesAutocomplete } from "@/apis/company";
import {
  apiPostInterviewReviews,
  apiGetInterviewReviewStatus
} from "@/apis/reviews";

export default {
  name: "InterviewSection",
  components: {
    AutoComplete,
    FormTextareaCounter,
    RatingStar,
    FormElementInputbox,
    ServiceTerms,
    RadioGroup,
    LightBox,
    Loading
  },
  props: {
    currentPlantId: {
      type: Number,
      required: true
    },
    currentTypeId: {
      type: Number,
      required: true
    }
  },
  mixins: [commonMixins],
  validations() {
    return {
      hasReview: {
        hasReview: value => hasReview(value)
      },
      interviewData: {
        custno: {
          required
        },
        advantage: {
          required,
          minLength: minLength(10),
          maxLength: maxLength(500)
        },
        seniorityYear: {
          numeric,
          between: between(0, 40)
        },
        seniorityMonth: {
          numeric,
          between: between(0, 11)
        },
        jobName: {
          required,
          noSpecialWord: noSpecialWord(),
          maxLength: maxLength(35)
        }
      }
    };
  },
  data() {
    return {
      companyName: null,
      hasCheckedCompany: false,
      hasReview: false,
      companyLists: [],
      showCompanyList: false,
      isCompanyLoading: false,
      showLightBox: false,
      lightboxData: {
        title: "",
        content: "",
        showCancelBtn: true,
        showConfirmBtn: true,
        leftBtnContent: "",
        rightBtnContent: "",
        leftCallBack: null,
        rightCallBack: null
      },
      interviewData: {
        custno: null,
        advantage: null,
        scoreOverall: 5,
        isRecommend: 1,
        seniorityYear: null,
        seniorityMonth: null,
        jobName: null
      }
    };
  },
  created() {
    const routeQuery = this.$route.query;
    if (routeQuery.ckw && routeQuery.custno) {
      this.companyName = routeQuery.ckw;
      this.interviewData.custno = this.decodeCustno(routeQuery.custno);
      this.$v.interviewData.custno.$touch();
    }
  },
  computed: {
    isFormDisabled() {
      return this.interviewData.custno ? false : true;
    }
  },
  methods: {
    async checkCompany() {
      if (!this.companyName) return;
      this.hasCheckedCompany = true;
      const payload = { keyword: this.companyName };
      this.isCompanyLoading = true;
      this.companyLists = await apiGetCompaniesAutocomplete(payload).then(
        res => {
          const acCompanyResults = res.data.response;

          return acCompanyResults;
        }
      );
      const len = this.companyLists.length;
      this.isCompanyLoading = false;

      if (!len) {
        this.$v.interviewData.custno.$touch();
        return;
      } else if (len === 1) {
        const { custno, name } = this.companyLists[0];
        this.touchCustNo(custno);
        this.interviewData.custno = custno;
        this.companyName = name;
        return;
      }

      this.showCompanyList = true;
      this.lightboxData.title = "請確認公司名稱";
      this.lightboxData.content = "公司名稱符合多家企業，請選擇你想發問的公司";
      this.lightboxData.showCancelBtn = false;
      this.lightboxData.showConfirmBtn = false;
    },
    async changeCompany() {
      this.hasCheckedCompany = false;
      this.companyLists = [];
      const acInput = document.querySelector(
        ".el-autocomplete .el-input__inner"
      );
      await this.resetCustNo();
      await acInput.focus();
      await acInput.select();
    },
    async checkCompanyHasReviewed(custno) {
      this.isCompanyLoading = true;
      this.hasReview = await apiGetInterviewReviewStatus({
        custno: custno.toString()
      }).then(res => res.data.response.result);
      this.isCompanyLoading = false;
    },
    acSearch(queryString, cb) {
      const payload = { keyword: queryString };
      apiGetCompaniesAutocomplete(payload).then(res => {
        const acCompanyResults = res.data.response;
        acCompanyResults.forEach(company => {
          company.value = company.name;
        });
        this.companyLists = acCompanyResults;

        cb(this.companyLists);
      });
    },
    getCompanyName(selectedVal) {
      this.companyName = selectedVal;
    },
    getCompanyNo(companyData) {
      const { custno, name } = companyData;
      this.touchCustNo(custno);
      this.cmpanyName = name;
      this.interviewData.custno = custno;
    },
    async touchCustNo(custno) {
      await this.checkCompanyHasReviewed(custno);
      this.$v.hasReview.$touch();
      this.$v.interviewData.custno.$touch();
    },
    resetCustNo() {
      this.interviewData.custno = null;
      this.$v.interviewData.custno.$reset();
      this.$v.hasReview.$reset();
    },
    getOverallStar(starNumber) {
      this.interviewData.scoreOverall = starNumber;
    },
    checkBeforeSubmit() {
      const validation = this.$v;
      this.$v.interviewData.custno.$touch();
      if (validation.interviewData.custno.$invalid) {
        this.$nextTick(() => {
          validation.$anyError ? this.$emit("jumpToFirstErr") : null;
        });
        return;
      }
      validation.$touch();
      this.$nextTick(() => {
        validation.$error
          ? this.$emit("jumpToFirstErr")
          : this.openSubmitLightBox();
      });
    },
    submitReview() {
      let postData = {
        ...this.interviewData,
        plantId: this.currentPlantId,
        typeId: this.currentTypeId,
        seniorityYear: parseInt(this.interviewData.seniorityYear, 10) || 0,
        seniorityMonth: parseInt(this.interviewData.seniorityMonth, 10) || 0
      };

      apiPostInterviewReviews(postData)
        .then(res => {
          this.jump("review/done");
        })
        .catch(err => {
          this.jump("error/500");
        });
    },
    // light box
    getMatchedCompanyNo(companyName, custno) {
      this.touchCustNo(custno);
      this.companyName = companyName;
      this.interviewData.custno = custno;
      this.showCompanyList = false;
    },
    openSubmitLightBox() {
      this.showLightBox = true;
      this.lightboxData.showCancelBtn = true;
      this.lightboxData.title = "確定送出評論";
      this.lightboxData.content = "確定送出後評論不再提供修改";
      this.lightboxData.leftBtnContent = "取消送出";
      this.lightboxData.rightBtnContent = "確定送出";
      this.lightboxData.rightCallBack = this.submitReview;
    },
    openCancelLightBox() {
      this.showLightBox = true;
      this.lightboxData.showCancelBtn = true;
      this.lightboxData.title = "取消分享評論";
      this.lightboxData.content = "取消後內容將不被保留";
      this.lightboxData.leftBtnContent = "取消分享";
      this.lightboxData.rightBtnContent = "繼續編輯";
      this.lightboxData.leftCallBack = this.jump.bind(null, "/");
    },
    closeAndClearLightBox() {
      this.showLightBox = false;
      Object.assign(this.lightboxData, staticreviewData.initLightBoxData());
    },
    closeCompanLists() {
      this.showCompanyList = false;
      this.resetCustNo();
      Object.assign(this.lightboxData, staticreviewData.initLightBoxData());
    },
    // gtm
    setDataGtm() {
      this.$refs.recommend.$refs.radio.setAttribute("data-gtm-form", "推薦");
      this.$refs["no-recommend"].$refs.radio.setAttribute(
        "data-gtm-form",
        "不推薦"
      );
    }
  },
  mounted() {
    this.setDataGtm();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
.check-btn.btn {
  border: solid 1px get-color(primary);
  color: get-color(primary);
}

::v-deep .el-radio .el-radio__input {
  @include device-up(md) {
    margin-right: 12px;
  }
}
</style>
