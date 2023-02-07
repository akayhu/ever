<template>
  <div class="FormVote container-rwd mx-auto">
    <bread-crumbs
      class="my-6 d-none d-md-block"
      level-two-path="/votes"
      level-two-title="投票"
      level-three-title="匿名發起投票"
    />
    <div class="vote-form-container bg-white rounded mt-md-6 pb-10 pb-md-12">
      <div
        v-if="pageIsLoading"
        class="loading-wrapper d-flex justify-content-center align-items-center"
      >
        <Loading />
      </div>

      <template v-else-if="userLoginStatus === 2">
        <form-title form-title="匿名發起投票" class="px-4 py-4 py-md-8" />
        <form class="vote-form pt-6 pt-md-0">
          <div class="form-field vote-table">
            <div class="form-group mb-3">
              <div class="form-group-title anonymous required mt-md-1">
                匿名身份
              </div>
              <div class="overflow-hidden">
                <div class="slider">
                  <div class="plant-list slider-container">
                    <div
                      v-for="plant in getAnonymousPlantsData()"
                      :key="plant.label"
                      :data-gtm-form="plant.label"
                      class="pr-4 user-plant"
                      @click="clickAnonymousPlant(plant.value)"
                    >
                      <div
                        class="plant-icon mb-1 rounded-circle"
                        :class="{ selected: plant.value === voteData.plantId }"
                      >
                        <img :src="getAnonymousImgUrl(plant.value)" />
                      </div>
                      <div class="plant-name t5 text-center">
                        {{ plant.label }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                  <auto-complete
                    class="d-block"
                    ref="test"
                    :disabled="!isFormDisabled || isCompanyLoading"
                    :value="queryCompanyName"
                    @value-inputed="getQueryCompany"
                    @value-selected="getCompanyNo"
                    popperClass="company-ac-popper p-0 m-0"
                    :querySearch="acSearch"
                    :validation="$v.voteData.custno"
                    :invalid-field="$v.voteData.custno.$error"
                  />
                  <div class="invalid-text t5 pl-3">
                    <template v-if="$v.voteData.custno.$error">
                      <template v-if="hasCheckedCompany">
                        很抱歉，此公司沒有在 104 上徵才，因此暫不提供發問
                      </template>
                      <template v-else>
                        {{ $t("errorMsg.companyCheckRequired") }}
                      </template>
                    </template>
                    <span
                      v-else-if="$v.voteData.custno.$dirty"
                      class="valid-text"
                    >
                      公司名稱檢查正確
                    </span>
                  </div>
                  <button
                    v-if="isFormDisabled"
                    class="btn-outline-primary btn t4 font-weight-bold mt-2"
                    type="button"
                    data-gtm-form="檢查公司名稱"
                    @click.prevent="checkCompany()"
                  >
                    檢查公司名稱
                  </button>
                  <button
                    v-else
                    class="change-company-btn btn"
                    type="button"
                    data-gtm-form="修改公司名稱"
                    @click.prevent="changeCompany()"
                  >
                    修改公司名稱
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group mb-6">
              <div class="form-group-title required">
                發問標題
              </div>
              <form-element-inputbox
                class="w-100"
                :disabled="isFormDisabled"
                :invalidField="$v.voteData.title.$error"
                :title="
                  isFormDisabled ? '請先確認公司名稱，才能填寫此欄位唷！' : null
                "
              >
                <input
                  slot="input"
                  v-model="$v.voteData.title.$model"
                  class="w-100 border-0"
                  type="text"
                  :disabled="isFormDisabled"
                  @focus="focusStyle($event)"
                  @blur="blurStyle($event)"
                  maxlength="30"
                  autocomplete="off"
                />
                <div
                  slot="valid"
                  v-if="$v.voteData.title.$error"
                  class="pl-3 t5 invalid-text"
                >
                  <template v-if="!$v.voteData.title.required">
                    {{ $t("errorMsg.required") }}
                  </template>
                  <template v-else-if="!$v.voteData.title.noSpecialWord">
                    {{ $t("errorMsg.specialWord") }}
                  </template>
                </div>
              </form-element-inputbox>
            </div>

            <div class="form-group mb-0">
              <div class="form-group-title required">
                投票選項
              </div>
              <div class="w-100">
                <div class="info-text mb-2 mb-md-1">
                  為方便投票者作答，請設定可以明確辨識的單選題，且至少要有兩個選項。
                </div>
                <div
                  v-for="(option, i) in $v.voteData.voteItems.$each.$iter"
                  :key="option.itemCount"
                  class="option-item d-block d-md-flex"
                >
                  <form-element-inputbox
                    class="w-100 flex-shrink-0"
                    :disabled="isFormDisabled"
                    :invalidField="option.$error"
                    :title="
                      isFormDisabled
                        ? '請先確認公司名稱，才能填寫此欄位唷！'
                        : null
                    "
                  >
                    <span slot="fixedText" class="order-0 pl-3">
                      {{ option.$model.itemCount + 1 }}.
                    </span>
                    <input
                      slot="input"
                      v-model="option.item.$model"
                      class="w-100 border-0 order-1 pl-1"
                      type="text"
                      placeholder="請輸入選項"
                      :disabled="isFormDisabled"
                      @focus="focusStyle($event)"
                      @blur="blurStyle($event)"
                      maxlength="25"
                    />
                    <div
                      slot="valid"
                      v-if="option.$error"
                      class="pl-3 t5 invalid-text"
                    >
                      <template v-if="!option.item.required">
                        <template v-if="i > 1">
                          {{ $t("errorMsg.voteRequiredIf") }}
                        </template>
                        <template v-else>
                          {{ $t("errorMsg.required") }}
                        </template>
                      </template>
                      <template v-if="!option.item.noSpecialWord">
                        {{ $t("errorMsg.specialWord") }}
                      </template>
                    </div>
                  </form-element-inputbox>
                  <div
                    v-if="i === lastOptionKey || i > 1"
                    class="d-flex justify-content-end align-items-center flex-shrink-0 mt-md-0 ml-7 mt-4"
                    :class="{ 'mt-2': option.$error }"
                  >
                    <div
                      v-if="i === lastOptionKey && isAddOptionShowed"
                      class="add-option t4 font-weight-bold"
                      data-gtm-form="新增選項"
                      :disabled="isFormDisabled"
                      @click="addOption"
                    >
                      新增
                    </div>
                    <span
                      v-if="i > 1 && i === lastOptionKey && isAddOptionShowed"
                      class="line mt-1 mx-3"
                    />
                    <div
                      v-if="i > 1"
                      class="delete-option t4 font-weight-bold"
                      data-gtm-form="刪除選項"
                      @click="deleteOption(i)"
                    >
                      刪除
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <service-terms />

          <div class="mt-6 d-flex justify-content-center">
            <button
              class="btn btn-outline-primary cancel-btn t2 font-weight-bold"
              type="button"
              data-gtm-form="取消"
              @click.prevent="openCancelLightBox()"
            >
              取消
            </button>
            <button
              class="btn agree-btn ml-3 ml-md-5 text-white t2 font-weight-bold"
              :class="{ 'btn-secondary': !this.$v.$invalid }"
              type="button"
              data-gtm-form="同意條款並送出"
              @click.prevent="checkBeforeSubmit()"
            >
              同意條款並送出
            </button>
          </div>
        </form>
      </template>
    </div>

    <light-box
      :title="lightboxData.title"
      :content="lightboxData.content"
      :show-cancel-btn="lightboxData.showCancelBtn"
      :left-btn-content="lightboxData.leftBtnContent"
      :right-btn-content="lightboxData.rightBtnContent"
      :showLightBox="showLightBox"
      :closeAndClearLightBox="closeAndClearLightBox"
      :leftCallBack="lightboxData.leftCallBack"
      :rightCallBack="lightboxData.rightCallBack"
      :leftDataGtmForm="lightboxData.leftDataGtmForm"
      :rightDataGtmForm="lightboxData.rightDataGtmForm"
    />

    <light-box
      id="company-lists-vote"
      :title="lightboxData.title"
      :content="lightboxData.content"
      :show-cancel-btn="lightboxData.showCancelBtn"
      :show-confirm-btn="lightboxData.showConfirmBtn"
      :showLightBox="showCompanyList"
      :closeAndClearLightBox="closeCompanLists"
      :rightCallBack="lightboxData.rightCallBack"
    >
      <radio-group
        slot="additional-content"
        class="mt-6"
        :validation="$v.voteData.custno"
        :value="queryCompanyName"
        :companyLists="companyLists"
        @value-changed="getMatchedCompanyNo"
      />
    </light-box>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
import BreadCrumbs from "@/components/formComponent/BreadCrumbs";
import FormTitle from "@/components/formComponent/FormTitle";
import ServiceTerms from "@/components/formComponent/ServiceTerms";
import LightBox from "@/components/formComponent/LightBox";
import FormElementInputbox from "@/components/formComponent/InputBox";
import AutoComplete from "@/components/formComponent/AutoComplete";
import RadioGroup from "@/components/formComponent/RadioGroup";
import * as staticVoteData from "@/utils/reviewData";
import Loading from "@/components/Loading.vue";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import { apiGetCompaniesAutocomplete } from "@/apis/company";
import { apiPostVotes } from "@/apis/votes";
import { noSpecialWord } from "@/utils/customValidator";
import { EventBus } from "@/utils/eventBus.js";

export default {
  name: "FormVote",
  validations() {
    return {
      voteData: {
        custno: {
          required
        },
        title: {
          noSpecialWord: noSpecialWord(),
          required
        },
        voteItems: {
          $each: {
            item: {
              noSpecialWord: noSpecialWord(),
              required
            }
          }
        }
      }
    };
  },
  components: {
    BreadCrumbs,
    FormTitle,
    ServiceTerms,
    LightBox,
    FormElementInputbox,
    AutoComplete,
    RadioGroup,
    Loading
  },
  mixins: [commonMixins],
  data() {
    return {
      pageIsLoading: true,
      showLightBox: false,
      queryCompanyName: null,
      showCompanyList: false,
      isCompanyLoading: false,
      hasCheckedCompany: false,
      companyLists: [],
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
      voteData: {
        custno: null,
        plantId: 1,
        voteItems: [
          { itemCount: 0, item: null },
          { itemCount: 1, item: null }
        ],
        title: ""
      }
    };
  },
  created() {
    if (this.pageIsLoading) {
      this.setCustnoFromRoute();
    }
  },
  computed: {
    ...mapGetters("user", ["userLoginStatus"]),
    isFormDisabled() {
      return this.voteData.custno ? false : true;
    },
    isAddOptionShowed() {
      return this.voteData.voteItems.length === 10 ? false : true;
    },
    lastOptionKey() {
      return String(this.voteData.voteItems.length - 1);
    }
  },
  methods: {
    setCustnoFromRoute() {
      this.pageIsLoading = false;
      // emit 一個事件給 footer component,讓 footer 打開
      EventBus.$emit("showFooter");
      // source: https://reurl.cc/vnEn4A
      const routeQuery = this.$route.query;

      if (
        Object.entries(routeQuery).length === 0 &&
        routeQuery.constructor === Object
      ) {
        return;
      }
      let { ckw, custno } = routeQuery;
      custno = this.decodeCustno(custno);
      this.queryCompanyName = ckw;
      this.voteData.custno = custno;
      this.$v.voteData.custno.$touch();
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
    clickAnonymousPlant(number) {
      this.voteData.plantId = number;
    },
    getQueryCompany(selectedVal) {
      this.queryCompanyName = selectedVal;
    },
    getMatchedCompanyNo(companyName, custno) {
      this.queryCompanyName = companyName;
      this.voteData.custno = custno;
      this.showCompanyList = false;
    },
    closeCompanLists() {
      this.showCompanyList = false;
      this.resetCustNo();
      Object.assign(this.lightboxData, staticVoteData.initLightBoxData());
    },
    getCompanyNo(companyData) {
      const { custno, name } = companyData;
      this.queryCompanyName = name;
      this.voteData.custno = custno;
    },
    async checkCompany() {
      if (!this.queryCompanyName) return;
      this.hasCheckedCompany = true;
      const payload = { keyword: this.queryCompanyName };
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
        this.$v.voteData.custno.$touch();
        return;
      } else if (len === 1) {
        this.$v.voteData.custno.$touch();
        this.voteData.custno = this.companyLists[0].custno;
        this.queryCompanyName = this.companyLists[0].name;
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
    resetCustNo() {
      this.voteData.custno = null;
      this.$v.voteData.custno.$reset();
    },
    addOption() {
      if (!this.voteData.custno) return;
      const voteItemsLength = this.voteData.voteItems.length;
      if (voteItemsLength === 10) return;
      this.voteData.voteItems.push({
        itemCount: voteItemsLength,
        item: null
      });
    },
    deleteOption(i) {
      this.voteData.voteItems.splice(i, 1);
      this.$v.voteData.voteItems.$reset();
      this.reOrderItemCount();
    },
    reOrderItemCount() {
      this.voteData.voteItems.forEach((option, i) => (option.itemCount = i));
    },
    checkBeforeSubmit() {
      const validation = this.$v;
      if (validation.voteData.custno.$invalid) {
        validation.voteData.custno.$touch();
        this.$nextTick(() => {
          validation.$anyError ? this.jumpToFirstErr() : null;
        });
        return;
      }
      this.$v.$touch();
      this.$nextTick(() => {
        this.$v.$error ? this.jumpToFirstErr() : this.openSubmitLightBox();
      });
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
    openSubmitLightBox() {
      this.showLightBox = true;
      this.lightboxData.title = "確定送出投票";
      this.lightboxData.content = "確定送出後投票不再提供修改";
      this.lightboxData.leftBtnContent = "取消送出";
      this.lightboxData.rightBtnContent = "確定送出";
      this.lightboxData.rightCallBack = this.submitVote;
    },
    openCancelLightBox() {
      this.showLightBox = true;
      this.lightboxData.title = "取消發起投票";
      this.lightboxData.content = "取消後內容將不被保留";
      this.lightboxData.leftBtnContent = "取消發起";
      this.lightboxData.rightBtnContent = "繼續編輯";
      this.lightboxData.leftCallBack = this.jump.bind(null, "/");
    },
    closeAndClearLightBox() {
      this.showLightBox = false;
      this.lightboxData.leftCallBack = null;
      this.lightboxData.rightCallBack = null;
      Object.assign(this.lightboxData, staticVoteData.initLightBoxData());
    },
    submitVote() {
      let postData = { ...this.voteData };
      apiPostVotes(postData).then(res => {
        this.jump("vote/done");
      });
    }
  }
};
</script>

<style lang="scss">
.vote-form-container {
  .loading-wrapper {
    min-height: 800px;
  }
  .slider {
    overflow-x: auto;
    scroll-behavior: smooth;
    .slider-container {
      display: flex;
      padding-bottom: 12px;
      width: fit-content;
      white-space: nowrap;
      height: 100%;
    }
  }

  .vote-table {
    .company-loading {
      z-index: 1000;
      top: 5px;
      left: 5px;
      transform: scale(0.5);
      transform-origin: 0 0;
    }
    .btn-outline-primary {
      width: 116px;
      height: 32px;
    }
    .options-description {
      color: get-color(text-info);
    }

    .option-item {
      &:not(:last-child) {
        margin-bottom: 24px;
      }

      .add-option {
        color: get-color(link);
        cursor: pointer;

        &:hover {
          color: get-color(link-hover);
        }

        &[disabled="disabled"] {
          cursor: not-allowed;

          &:hover {
            color: get-color(link);
          }
        }
      }

      .delete-option {
        color: get-color(text-info);
        cursor: pointer;

        &:hover {
          color: get-color(primary);
        }
      }

      .line {
        width: 1px;
        height: 12px;
        background-color: get-color(gray-light);
      }
    }
  }
}
</style>
