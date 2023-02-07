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
            須先選擇履歷表上任職過的公司，才能繼續填寫下面的欄位唷！
          </div>
          <div class="position-relative">
            <Loading
              v-if="isCompanyLoading"
              class="company-loading position-absolute"
            />
            <SelectDropdown
              ref="companyLists"
              class="d-block"
              data-name="companyLists"
              :value="showCompanyName"
              :options="resumeLists"
              :disabled="
                reviewData.companyResume !== null || $v.reviewData.custno.$error
              "
              :placeholder="!isCompanyLoading ? '請選擇' : ''"
              :invalidField="companyNameInvalid"
              @value-changed="getCompanyNo"
            />
            <div class="invalid-text">
              <template v-if="$v.hasReview.$error">
                {{ $t("errorMsg.hasReview", { day: 90 }) }}
              </template>
              <template v-else-if="$v.reviewData.custno.$error">
                <template v-if="reviewData.companyResume">
                  很抱歉，此公司非104刊登會員，或是公司名稱不夠精準，請<a
                    @click="goToMy104"
                    data-gtm-form="前往履歷表"
                    target="_blank"
                    ><b>前往履歷表</b></a
                  >修正公司名稱
                </template>
                <template v-else>
                  很抱歉，你的履歷尚無公司任職紀錄，請先<a
                    @click="goToMy104"
                    data-gtm-form="前往履歷表"
                    target="_blank"
                    ><b>前往履歷表</b></a
                  >新增經歷
                </template>
              </template>
              <template v-else-if="$v.reviewData.companyResume.$error">
                {{ $t("errorMsg.companyRequired") }}
              </template>
              <span v-else-if="$v.reviewData.custno.$dirty" class="valid-text">
                公司名稱檢查正確
              </span>
            </div>
            <button
              v-if="reviewData.companyResume"
              type="button"
              data-gtm-form="變更評論公司"
              class="change-company-btn btn"
              @click.prevent="triggerCompanyOption"
            >
              變更評論公司
            </button>
          </div>
        </div>
      </div>
      <!-- 優點 -->
      <div class="form-group mb-6">
        <div class="form-group-title required mt-md-2">
          值得鼓勵
        </div>
        <FormTextareaCounter
          v-model="$v.reviewData.advantage.$model"
          :disabled="isFormDisabled"
          :error="$v.reviewData.advantage.$error"
          :title="
            isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
          "
          placeholder="公司值得肯定和鼓勵的地方（最少 10 字)"
        >
          <div v-if="$v.reviewData.advantage.$error" slot="error">
            <template v-if="!$v.reviewData.advantage.required">
              {{ $t("errorMsg.required") }}
            </template>
            <template v-else-if="!$v.reviewData.advantage.maxLength">
              {{ $t("errorMsg.stringLength") }}
            </template>
            <template v-else-if="!$v.reviewData.advantage.maxValue">
              {{ $t("errorMsg.stringMinLength", { minLength: "十" }) }}
            </template>
          </div>
        </FormTextareaCounter>
      </div>
      <!-- 缺點 -->
      <div class="form-group mb-0">
        <div class="form-group-title mt-md-2">
          建議改善
        </div>
        <FormTextareaCounter
          v-model="$v.reviewData.disadvantage.$model"
          :disabled="isFormDisabled"
          :error="$v.reviewData.disadvantage.$error"
          :title="
            isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
          "
          placeholder="請客觀描述公司需要改善的地方、避免情緒性字詞，提供具體的改善方向"
        >
          <div slot="error" v-if="$v.reviewData.disadvantage.$error">
            <template v-if="!$v.reviewData.disadvantage.maxLength">
              {{ $t("errorMsg.stringLength") }}
            </template>
            <template v-else-if="!$v.reviewData.disadvantage.minLength">
              {{ $t("errorMsg.stringMinLength", { minLength: "十" }) }}
            </template>
          </div>
        </FormTextareaCounter>
      </div>
    </div>

    <div class="w-100 mx-auto border-bottom my-8" />

    <!-- 評價 -->
    <div id="rating" class="form-field rating-table">
      <div class="field-title">評價</div>
      <!-- 整體評價 -->
      <div class="form-group d-flex align-items-end mb-8 mb-md-6">
        <div class="form-group-title required">
          整體評價
        </div>
        <RatingStar
          :ratings="reviewData.scoreOverall"
          :disabled="isFormDisabled"
          @star-clicked="getOverallStar"
        />
      </div>
      <!-- 類別評價 -->
      <div class="form-group mb-0">
        <div class="form-group-title required">
          類別評價
        </div>
        <div>
          <div class="info-text d-flex align-items-center">
            必填項目
            <ElTooltip class="item" placement="top">
              <div slot="content" class="toolTip text-white t4">
                薪資福利：您對公司的薪酬制度和員工福利的滿意程度<br />
                公司環境：辦公區域或作業環境的舒適程度<br />
                工作氣氛：與同事、主管的人際相處、溝通的融洽度<br />
                公司前景：你對公司的未來發展的樂觀程<br />
                工作穩定：公司保障工作者權益的穩定程度<br />
              </div>
              <i class="jb_icon_info ml-1"></i>
            </ElTooltip>
          </div>
          <RatingLists
            :disabled="isFormDisabled"
            :rating-options="baseRatingOptions()"
            :ratings="baseScores"
            @star-clicked="getStarValue"
          />

          <button
            v-if="!showmoreScore"
            class="more-ratings-btn mt-4 mb-6 border-0 bg-transparent p-0"
            :disabled="isFormDisabled"
            @click="showmoreScore = true"
            data-gtm-form="更多類別評價"
          >
            更多類別評價
            <i class="jb_icon_down font-weight-bold" />
          </button>
          <template v-if="showmoreScore">
            <div class="info-text d-flex align-items-center mt-6">
              選填項目
              <ElTooltip class="item" placement="top">
                <div slot="content" class="toolTip text-white t4">
                  兼顧生活：工作與生活平衡(Work–life balance)的程度<br />
                  主管友善：與主管溝通、相處的和睦程度<br />
                  升遷機會：公司晉升管理職和專業職的透明化、制度化程度<br />
                  教育訓練：公司的課程和訓練計劃，能幫助員工在專業上成長的充足程度<br />
                  團隊合作：與同仁合作時可以彼此信任、互相支援的順暢程度<br />
                </div>
                <i class="jb_icon_info ml-1"></i>
              </ElTooltip>
            </div>
            <RatingLists
              class="mb-8 mb-md-6"
              :disabled="isFormDisabled"
              :rating-options="moreRatingOptions()"
              :ratings="moreScores"
              rating-type="moreScores"
              @star-clicked="getStarValue"
            />
          </template>
        </div>
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
              v-model="reviewData.isRecommend"
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
              v-model="reviewData.isRecommend"
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
        <div class="form-group-title required mt-md-2">
          任職年資
        </div>
        <div class="d-flex w-100">
          <FormElementInputbox
            class="w-100 mr-4"
            for="seniorityYear"
            :disabled="isFormDisabled"
            :invalidField="$v.reviewData.seniorityYear.$error"
            :title="
              isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
            "
          >
            <input
              slot="input"
              v-model="$v.reviewData.seniorityYear.$model"
              class="w-100 border-0"
              type="text"
              id="seniorityYear"
              :disabled="isFormDisabled"
              autocomplete="off"
            />
            <span slot="fixedText" class="flex-shrink-0 t4">年</span>
            <div
              slot="valid"
              v-if="$v.reviewData.seniorityYear.$error"
              class="invalid-text"
            >
              <template
                v-if="
                  !$v.reviewData.seniorityYear.required && !seniorityNoZeroError
                "
              >
                {{ $t("errorMsg.required") }}
              </template>
              <template v-else-if="!$v.reviewData.seniorityYear.numeric">
                {{ $t("errorMsg.numeric") }}
              </template>
              <template v-else-if="!$v.reviewData.seniorityYear.between">
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
            :invalidField="$v.reviewData.seniorityMonth.$error"
          >
            <input
              slot="input"
              v-model="$v.reviewData.seniorityMonth.$model"
              class="w-100 border-0"
              type="text"
              id="seniorityMonth"
              :disabled="isFormDisabled"
              autocomplete="off"
            />
            <span slot="fixedText" class="flex-shrink-0 t4">個月</span>
            <div
              slot="valid"
              v-if="$v.reviewData.seniorityMonth.$error"
              class="invalid-text"
            >
              <template v-if="seniorityNoZeroError">
                {{ $t("errorMsg.requiredSenority") }}
              </template>
              <template v-else-if="!$v.reviewData.seniorityMonth.required">
                {{ $t("errorMsg.required") }}
              </template>
              <template v-else-if="!$v.reviewData.seniorityMonth.numeric">
                {{ $t("errorMsg.numeric") }}
              </template>
              <template v-else-if="!$v.reviewData.seniorityMonth.between">
                {{ $t("errorMsg.between", { msg: "0~11個月" }) }}
              </template>
            </div>
          </FormElementInputbox>
        </div>
      </div>

      <div class="form-group mb-6">
        <div class="form-group-title mt-md-2">
          職務名稱
        </div>
        <div class="d-md-flex align-items-center w-100">
          <FormElementInputbox
            class="w-100 flex-shrink-0"
            :disabled="isFormDisabled"
            :title="
              isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
            "
            :invalidField="$v.reviewData.jobName.$error"
          >
            <input
              slot="input"
              v-model="$v.reviewData.jobName.$model"
              class="w-100 border-0"
              type="text"
              placeholder="例如：行銷企劃專員"
              :disabled="isFormDisabled"
              maxlength="35"
              autocomplete="off"
            />
            <div
              slot="valid"
              v-if="$v.reviewData.jobName.$error"
              class="invalid-text"
            >
              <template v-if="!$v.reviewData.jobName.maxLength">
                {{ $t("errorMsg.stringLength") }}
              </template>
              <template v-if="!$v.reviewData.jobName.required">
                {{ $t("errorMsg.requiredIf") }}
              </template>
              <template v-if="!$v.reviewData.jobName.noSpecialWord">
                {{ $t("errorMsg.specialWord") }}
              </template>
            </div>
          </FormElementInputbox>
          <div
            class="switch-btn flex-shrink-0"
            :class="{ 'mt-2': $v.reviewData.jobName.$error }"
          >
            <ElSwitch
              v-model="reviewData.jobNameIsPublic"
              ref="jobName"
              :disabled="isFormDisabled"
              :title="
                isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
              "
              :active-value="1"
              :inactive-value="0"
              active-color="#ff9100"
              inactive-color="#eeeeee"
            />
            <div class="flex-shrink-0">
              {{ reviewData.jobNameIsPublic ? "公開" : "不公開" }}
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="form-group-title mt-md-2">
          薪資待遇
        </div>
        <div class="d-md-flex align-items-center w-100">
          <div class="row no-gutters w-100 flex-shrink-0">
            <SelectDropdown
              data-name="wageType"
              class="col-4 mr-4"
              placeholder="月薪"
              :disabled="isFormDisabled"
              :options="getWageOptions()"
              :value="reviewData.wageType"
              @value-changed="changeWageType"
            />
            <template v-if="reviewData.wageType === 'hour'">
              <FormElementInputbox
                class="col"
                :disabled="isFormDisabled"
                :invalidField="$v.reviewData.wage.$error"
              >
                <input
                  slot="input"
                  v-model="$v.reviewData.wage.$model"
                  class="t4 w-100 border-0"
                  type="text"
                  placeholder="例如：150"
                  :disabled="isFormDisabled"
                  maxlength="4"
                  autocomplete="off"
                />
              </FormElementInputbox>
            </template>
            <template v-else-if="reviewData.wageType === 'month'">
              <SelectDropdown
                class="col-4 mr-4"
                data-name="monthTenThoudands"
                placeholder="萬"
                :value="monthTenThoudands"
                :options="monthWageNumber('ten-thousand')"
                :disabled="isFormDisabled"
                :invalidField="$v.reviewData.wage.$error"
                :validation="$v.reviewData.wage"
                @value-changed="getWageValue"
              />
              <SelectDropdown
                class="col-4"
                data-name="monthThousands"
                placeholder="千"
                :value="monthThousands"
                :options="monthWageNumber('thousand')"
                :disabled="isFormDisabled"
                :invalidField="$v.reviewData.wage.$error"
                :validation="$v.reviewData.wage"
                @value-changed="getWageValue"
              />
            </template>
            <template v-else-if="reviewData.wageType === 'year'">
              <SelectDropdown
                data-name="wageYear"
                placeholder="請選擇"
                :value="reviewData.wage"
                :options="yearWageNumber()"
                :disabled="isFormDisabled"
                class="col"
                :invalidField="$v.reviewData.wage.$error"
                :validation="$v.reviewData.wage"
                @value-changed="getWageValue"
              />
            </template>
            <div class="invalid-text col-12" v-if="$v.reviewData.wage.$error">
              <template v-if="!$v.reviewData.wage.maxValue">
                <template v-if="reviewData.wageType === 'hour'">
                  {{
                    $t("errorMsg.maxValue", {
                      checkType: "時薪",
                      limit: "9,999"
                    })
                  }}
                </template>
                <template v-else-if="reviewData.wageType === 'month'">
                  {{
                    $t("errorMsg.maxValue", {
                      checkType: "月薪",
                      limit: "309,000"
                    })
                  }}
                </template>
              </template>
              <template v-if="!$v.reviewData.wage.required">
                {{ $t("errorMsg.requiredIf") }}
              </template>
            </div>
          </div>
          <div
            class="switch-btn flex-shrink-0"
            :class="{ 'mt-2': $v.reviewData.jobName.$error }"
          >
            <ElSwitch
              v-model="reviewData.wageIsPublic"
              ref="wage"
              :disabled="isFormDisabled"
              :title="
                isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
              "
              :active-value="1"
              :inactive-value="0"
              active-color="#ff9100"
              inactive-color="#eeeeee"
            />
            <div class="flex-shrink-0">
              {{ reviewData.wageIsPublic ? "公開" : "不公開" }}
            </div>
          </div>
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
      id="company-lists"
      :title="lightboxData.title"
      :content="lightboxData.content"
      :show-cancel-btn="lightboxData.showCancelBtn"
      :left-btn-content="lightboxData.leftBtnContent"
      :right-btn-content="lightboxData.rightBtnContent"
      :showLightBox="showCompanyList"
      :closeAndClearLightBox="closeCompanLists"
      :rightCallBack="lightboxData.rightCallBack"
    >
      <RadioGroup
        slot="additional-content"
        class="mt-6"
        :value="reviewData.companyAutoComplete"
        :companyLists="companyLists"
        @value-changed="getMatchedCompanyNo"
      />
      <template slot="additional-description">
        <div class="mb-3 t4">以上都不是我任職的公司</div>
      </template>
    </LightBox>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
import { matchCusnoMixin } from "@/views/mixins/matchCustno";
import SelectDropdown from "@/components/formComponent/SelectDropdown";
import RatingLists from "@/components/formComponent/RatingLists";
import RatingStar from "@/components/formComponent/RatingStar";
import FormElementInputbox from "@/components/formComponent/InputBox";
import FormTextareaCounter from "@/components/formComponent/FormTextareaCounter";
import ServiceTerms from "@/components/formComponent/ServiceTerms";
import LightBox from "@/components/formComponent/LightBox";
import RadioGroup from "@/components/formComponent/RadioGroup";
import {
  required,
  requiredIf,
  minLength,
  maxLength,
  numeric,
  maxValue,
  between
} from "vuelidate/lib/validators";
import { noSpecialWord, hasReview, noZeroIf } from "@/utils/customValidator";
import * as staticreviewData from "@/utils/reviewData";
import Loading from "@/components/Loading.vue";
import { apiPostReviews } from "@/apis/reviews";

export default {
  name: "ReviewSection",
  components: {
    SelectDropdown,
    RatingLists,
    RatingStar,
    FormElementInputbox,
    FormTextareaCounter,
    ServiceTerms,
    Loading,
    LightBox,
    RadioGroup
  },
  props: {
    resumeLists: {
      type: Array,
      required: true
    },
    currentPlantId: {
      type: Number,
      required: true
    },
    currentTypeId: {
      type: Number,
      required: true
    },
    isNoWorkExp: {
      type: Boolean,
      required: true
    }
  },
  mixins: [commonMixins, matchCusnoMixin],
  validations() {
    return {
      hasReview: {
        hasReview: value => hasReview(value)
      },
      reviewData: {
        custno: {
          required
        },
        companyResume: {
          required
        },
        advantage: {
          required,
          minLength: minLength(10),
          maxLength: maxLength(500)
        },
        disadvantage: {
          minLength: minLength(10),
          maxLength: maxLength(500)
        },
        seniorityYear: {
          required: requiredIf(() => {
            return !this.reviewData.seniorityMonth;
          }),
          noZeroIf: noZeroIf("seniorityMonth"),
          numeric,
          between: between(0, 40)
        },
        seniorityMonth: {
          required: requiredIf(() => {
            return !this.reviewData.seniorityYear;
          }),
          noZeroIf: noZeroIf("seniorityYear"),
          numeric,
          between: between(0, 11)
        },
        jobName: {
          noSpecialWord: noSpecialWord(),
          required: requiredIf(() => {
            return this.reviewData.jobNameIsPublic;
          }),
          maxLength: maxLength(35)
        },
        wage: {
          required: requiredIf(() => {
            return this.reviewData.wageIsPublic;
          }),
          maxValue: maxValue(
            this.reviewData.wageType === "month" ? 309000 : 9999
          )
        }
      }
    };
  },
  data() {
    return {
      showLightBox: false,
      showCompanyList: false,
      isCompanyLoading: false,
      hasReview: false,
      companyLists: [],
      lightboxData: {
        title: "",
        content: "",
        showCancelBtn: true,
        leftBtnContent: "",
        rightBtnContent: "",
        leftCallBack: null,
        rightCallBack: null
      },
      starFullLength: 5,
      showmoreScore: false,
      monthTenThoudands: null,
      monthThousands: null,
      baseScores: {},
      moreScores: {},
      reviewData: {
        companyResume: null,
        companyAutoComplete: null,
        custno: null,
        advantage: null,
        disadvantage: null,
        scoreOverall: 5,
        isRecommend: 1,
        seniorityYear: null,
        seniorityMonth: null,
        jobName: null,
        jobNameIsPublic: 0,
        wageType: "month",
        wage: null,
        wageIsPublic: 0,
        reviewItems: []
      }
    };
  },
  computed: {
    isFormDisabled() {
      return this.reviewData.custno ? false : true;
    },
    companyNameInvalid() {
      const invalidFactors = [
        this.$v.reviewData.custno.$error,
        this.$v.reviewData.companyResume.$error,
        this.$v.hasReview.$error
      ];
      return invalidFactors.every(factor => factor === false) ? false : true;
    },
    showCompanyName() {
      /*由於要儲存使用者選的履歷公司名稱,以及比對後的建議名稱
      因此設定這個直純粹用來顯示在畫面上*/
      return this.reviewData.custno
        ? this.reviewData.companyAutoComplete
        : this.reviewData.companyResume;
    },
    combineMonthWage() {
      return this.monthTenThoudands * 10000 + this.monthThousands * 1000;
    },
    seniorityError() {
      return (
        this.$v.reviewData.seniorityMonth.$error ||
        this.$v.reviewData.seniorityYear.$error
      );
    },
    seniorityNoZeroError() {
      // 年資欄位年與月不可同時為 0 或空白
      return (
        this.$v.reviewData.seniorityMonth.$error &&
        this.$v.reviewData.seniorityYear.$error &&
        !this.$v.reviewData.seniorityMonth.noZeroIf &&
        !this.$v.reviewData.seniorityYear.noZeroIf
      );
    }
  },
  methods: {
    setDataGtm() {
      this.$refs.jobName.$el.children[1].setAttribute(
        "data-gtm-form",
        "職務名稱開關"
      );
      this.$refs.recommend.$refs.radio.setAttribute("data-gtm-form", "推薦");
      this.$refs["no-recommend"].$refs.radio.setAttribute(
        "data-gtm-form",
        "不推薦"
      );
      this.$refs.wage.$el.children[1].setAttribute(
        "data-gtm-form",
        "薪資待遇開關"
      );
    },
    setRatingOptions() {
      this.baseRatingOptions().forEach(ratingOption => {
        this.$set(this.baseScores, ratingOption.value, 5);
        this.reviewData.reviewItems.push({
          reviewItem: ratingOption.label,
          score: 5
        });
      });

      this.moreRatingOptions().forEach(ratingOption =>
        this.$set(this.moreScores, ratingOption.value, null)
      );
    },
    getStarValue(ratingType, starNumber, optionValue, optionLabel) {
      this[ratingType][optionValue] = starNumber;
      const currenReviewItems = this.reviewData.reviewItems.map(option => {
        return option.reviewItem;
      });
      if (currenReviewItems.indexOf(optionLabel) === -1) {
        this.reviewData.reviewItems.push({
          reviewItem: optionLabel,
          score: starNumber
        });
      }
      this.reviewData.reviewItems.forEach(option => {
        option.reviewItem === optionLabel ? (option.score = starNumber) : null;
      });
    },
    changeWageType(selectedVal) {
      //當薪資類型重設時,清空所有計算 wage 的相依資料
      this.reviewData.wage = null;
      this.monthThousands = null;
      this.monthTenThoudands = null;
      this.reviewData.wageType = selectedVal;
    },
    getOverallStar(starNumber) {
      this.reviewData.scoreOverall = starNumber;
    },
    async getCompanyNo(selectedVal) {
      /* fixMe 這邊目前判斷公司名稱是否要跳錯誤提示,
      同時使用了 custno && companyResume 來做;應該可以有更好的寫法
      */
      if (!selectedVal) return;

      // 選取公司名稱 reset 上一次資料
      this.resetCustNo();
      this.resetAutoFilledData();
      this.isCompanyLoading = true;

      //AC 取得公司列表資料
      const companyInfoLists = await this.getCompanyInfoBack(selectedVal);
      const len = companyInfoLists ? companyInfoLists.length : null;
      this.isCompanyLoading = false;
      this.reviewData.companyResume = selectedVal;
      // 選取公司後職稱自動帶入職稱及年資
      this.setSelectedJobInfo(selectedVal);
      /*
        !len - 比對不到資料
        len === 1 剛好只有一筆, 比對成功
        len > 1 有多筆資料, 打開選擇圖層
      */
      if (!len) {
        this.$v.reviewData.custno.$touch();
        return;
      } else if (len === 1) {
        const { hasReview, custno } = companyInfoLists[0];
        this.checkCompanyHasReviewed(hasReview);
        this.setCustNo(custno);
        this.reviewData.companyAutoComplete = companyInfoLists[0].name;
        return;
      } else if (len > 1) {
        this.companyLists = companyInfoLists.slice(0, 10);
        this.openCompanyLists();
      }
    },
    setSelectedJobInfo(selectedVal) {
      const selectedCompany = this.resumeLists.find(company => {
        return company["value"] === selectedVal;
      });
      const { jobTitle, jobMonth, jobYear } = selectedCompany;
      this.reviewData.jobName = jobTitle;
      this.reviewData.seniorityYear = jobYear;
      this.reviewData.seniorityMonth = jobMonth;

      this.$v.reviewData.seniorityYear.$touch();
      this.$v.reviewData.seniorityMonth.$touch();
    },
    getMatchedCompanyNo(companyName, custno, hasReview) {
      this.reviewData.companyAutoComplete = companyName;
      this.showCompanyList = false;
      this.checkCompanyHasReviewed(hasReview);
      if (!hasReview) this.setCustNo(custno);
    },
    checkCompanyHasReviewed(value) {
      this.hasReview = value;
      this.$v.hasReview.$touch();
    },
    setCustNo(custno) {
      this.reviewData.custno = custno;
      this.$v.reviewData.custno.$touch();
    },
    openCompanyLists() {
      this.showCompanyList = true;
      this.lightboxData.title = "請確認公司名稱";
      this.lightboxData.content =
        "公司名稱符合多家企業，請在下方選擇正確的任職公司";
      this.lightboxData.showCancelBtn = false;
      this.lightboxData.rightBtnContent = "修改履歷表";
      this.lightboxData.rightCallBack = this.goToMy104;
    },
    closeCompanLists() {
      this.showCompanyList = false;
      this.resetCustNo();
      this.resetAutoFilledData();

      Object.assign(this.lightboxData, staticreviewData.initLightBoxData());
    },
    async triggerCompanyOption() {
      if (!this.reviewData.companyResume) return;
      const arrow = await this.$refs.companyLists.$el.children[0];
      await this.resetCustNo();
      this.resetAutoFilledData();
      const timeoutID = setTimeout(() => {
        arrow.click();
        clearTimeout(timeoutID);
      }, 0);
    },
    resetCustNo() {
      this.$v.reviewData.custno.$reset();
      this.$v.reviewData.companyResume.$reset();
      this.$v.hasReview.$reset();
    },
    resetAutoFilledData() {
      /*
        由於一開始選取公司時會帶入
        companyResume, companyAutoComplete, custno, jobName, seniorityYear , seniorityMonth
        reset 的時候一次清掉
      */
      this.reviewData.companyResume = null;
      this.reviewData.companyAutoComplete = null;
      this.reviewData.custno = null;
      this.reviewData.jobName = null;
      this.reviewData.seniorityYear = null;
      this.reviewData.seniorityMonth = null;
    },
    getWageValue(selectedVal, dataName) {
      if (this.reviewData.wageType === "month") {
        this[dataName] = selectedVal;
        return;
      }
      this.reviewData.wage = selectedVal;
    },
    clickAnonymousPlant(number) {
      this.reviewData.plantId = number;
    },
    checkBeforeSubmit() {
      const validation = this.$v;
      if (validation.reviewData.companyResume.$invalid) {
        validation.reviewData.companyResume.$touch();
        this.$nextTick(() => {
          validation.$anyError ? this.$emit("jumpToFirstErr") : null;
        });
        return;
      } else if (validation.hasReview.$invalid) {
        this.$emit("jumpToFirstErr");
      } else if (validation.reviewData.custno.$invalid) {
        this.$emit("jumpToFirstErr");
      } else {
        validation.$touch();
        this.$nextTick(() => {
          validation.$error
            ? this.$emit("jumpToFirstErr")
            : this.openSubmitLightBox();
        });
      }
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
    submitReview() {
      const postData = this.prePorcessData({ ...this.reviewData });

      apiPostReviews(postData)
        .then(res => {
          this.jump("review/done");
          if (process.env.VUE_APP_ENV !== "development") return;
        })
        .catch(err => {
          this.jump("error/500");
        });
    },
    prePorcessData(target) {
      const data = {
        ...target,
        plantId: this.currentPlantId,
        typeId: this.currentTypeId,
        seniorityYear: parseInt(this.reviewData.seniorityYear, 10),
        seniorityMonth: parseInt(this.reviewData.seniorityMonth, 10),
        wage: this.reviewData.wage ? parseInt(this.reviewData.wage, 10) : null
      };

      const seniorityType = ["seniorityMonth", "seniorityYear"];
      for (let key in data) {
        if (data[key] === null || data[key] === undefined) {
          delete data[key];
        }
        if (seniorityType.indexOf(key) > -1 && !target[key]) {
          data[key] = 0;
        }
      }
      return data;
    }
  },
  watch: {
    combineMonthWage: {
      handler: function name(monthWage) {
        if (this.reviewData.wageType !== "month") return;
        this.reviewData.wage = monthWage;
      },
      deep: true
    }
  },
  created() {
    this.setRatingOptions();
    if (this.isNoWorkExp) this.$v.reviewData.custno.$touch();
    const routeQuery = this.$route.query;
    if (routeQuery.ckw && routeQuery.custno) {
      this.reviewData.custno = this.decodeCustno(routeQuery.custno);
      this.reviewData.companyAutoComplete = routeQuery.ckw;
      this.reviewData.companyResume = routeQuery.ckw;
      this.$v.reviewData.custno.$touch();
    }
  },
  mounted() {
    this.setDataGtm();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

::v-deep .el-radio .el-radio__input {
  @include device-up(md) {
    margin-right: 12px;
  }
}
</style>
