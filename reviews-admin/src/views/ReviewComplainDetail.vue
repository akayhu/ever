<template>
  <div class="review-complain-detail">
    <div class="loading" v-if="!getReviewsDetailStatus(getReviewsDetailData)">
      <Loading />
    </div>

    <div v-if="getReviewsDetailStatus(getReviewsDetailData)">
      <div class="review-complain-detail-top-nav">
        <div>
          <router-link to="/review_complain">&lt; 返回申訴審核列表</router-link>
        </div>
        <div v-if="getReviewsDetailData.auditState === 6">
          此會員已評論過此公司(且通過審核)
        </div>
        <div>申訴編號：{{ getReviewsDetailData.id }}</div>
      </div>

      <div class="review-complain-detail-top-content">
        <div class="review-complain-detail-top-source">
          <div class="user-source">
            <span>{{
              getPlantName(
                getReviewsDetailData.plantId,
                getReviewsDetailData.typeId
              )
            }}</span>
            <span>
              發表時間：{{ timeDate(getReviewsDetailData.createDate) }}
            </span>
            <span>pid：{{ getReviewsDetailData.pid }}</span>
          </div>
          <div class="company-source">
            <span>
              {{ getReviewsDetailData.company }} (
              <a
                :href="
                  getConpanyLink(encodeCustno(getReviewsDetailData.custno))
                "
                target="_blank"
              >
                公司專頁
              </a>
              )
            </span>
            <span>custno：{{ getReviewsDetailData.custno }}</span>
          </div>
        </div>

        <div class="review-complain-detail-score">
          <dl>
            <dt>工作資訊</dt>
            <dd v-if="getReviewsDetailData.jobNameIsPublic === 1">
              職稱：{{ getReviewsDetailData.jobName }}
            </dd>
            <dd>
              年資：{{ getReviewsDetailData.seniorityYear }} 年
              {{ getReviewsDetailData.seniorityMonth || 0 }} 個月
            </dd>
            <dd v-if="getReviewsDetailData.wageIsPublic === 1">
              薪資：{{ getWageType(getReviewsDetailData.wageType) }}
              {{ getWage(getReviewsDetailData.wage) }}
            </dd>
          </dl>

          <dl>
            <dt>{{ this.isTypeInterview ? "面試心得" : "值得鼓勵" }}</dt>
            <dd
              v-html="getReviewsDetailData.advantage.replace(/\n/g, '<br>')"
            ></dd>
          </dl>

          <dl v-if="getReviewsDetailData.disadvantage">
            <dt>建議改善</dt>
            <dd
              v-html="getReviewsDetailData.disadvantage.replace(/\n/g, '<br>')"
            ></dd>
          </dl>

          <dl>
            <dt>評分</dt>
            <dd>
              {{ this.isTypeInterview ? "面試評分" : "整體評分" }}：{{
                getReviewsDetailData.scoreOverall
              }}
            </dd>
            <dd
              v-for="(item, index) in getReviewsDetailData.reviewItems"
              :key="index"
            >
              {{ item.reviewItem }}：{{ item.score }}
            </dd>
          </dl>
        </div>
      </div>

      <div class="review-complain-detail-top-content appeal-content">
        <div class="review-complain-detail-top-source">
          申訴內容
        </div>
        <div
          class="review-complain-detail-score"
          v-if="getReviewsDetailData.reviewAccuses"
        >
          <dl>
            <dt>申訴時間</dt>
            <dd>{{ timeDate(getReviewAccuses.createDate) }}<br /><br /></dd>
            <dt>申訴原因</dt>
            <dd>
              <div v-if="getReviewAccuses.accuseMemo">
                {{ getReviewAccuses.accuseMemo }}
              </div>
              <div v-if="getReviewAccuses.accuseOtherReason">
                {{ getReviewAccuses.accuseOtherReason }}
              </div>
              <br />
              <div
                v-for="(item, index) in getReviewAccuses.reviewAccuseReasons"
                :key="index"
              >
                {{ item.accuseReason }}
              </div>
            </dd>
          </dl>
        </div>
      </div>

      <div class="review-complain-detail-process">
        <div class="review-complain">
          <span class="title">審核：</span>
          <span><el-radio v-model="radio" label="4">維持下架</el-radio></span>
          <span><el-radio v-model="radio" label="7">重新上架</el-radio></span>
          <span></span>
        </div>

        <div class="reason" v-if="radio === '7'">
          <div class="title">原因：</div>
          <div>
            <el-radio-group v-model="reason" :change="changeReason(reason)">
              <dl>
                <dd>
                  <el-radio label="1">
                    客服評估無爭議
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="2">
                    客服評估沒有違法
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="3">
                    其他原因，請於下方補充
                  </el-radio>
                </dd>
              </dl>
            </el-radio-group>
          </div>
        </div>
      </div>

      <div class="mail-content" v-if="radio === '7'">
        <div class="title">發信內容預覽(可編輯)：</div>
        <textarea type="textarea" class="mail-content-textarea"></textarea>
      </div>

      <div class="send-out">
        <el-button
          type="primary"
          @click="patchReviewDetail()"
          :disabled="submitDisable"
        >
          送出
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { anonymousName, checkIsTypeInterview } from "@/utils/anonymous";
import { commonMixins } from "@/mixins/commonMixins";
import Loading from "@/components/Loading.vue";

export default {
  name: "ReviewComplainDetail",
  data() {
    return {
      radio: "",
      reason: "",
      notProcessedValue: "",
      submitDisable: false
    };
  },
  components: {
    Loading
  },
  created() {
    const complainId = this.$route.params.complainId;
    this.getReviewsDetail(complainId);
  },
  mixins: [commonMixins],
  computed: {
    ...mapGetters("reviews", ["getReviewsData"]),
    getReviewsDetailData() {
      return this.getReviewsData.reviewsDetail;
    },
    getReviewAccuses() {
      return this.getReviewsData.reviewsDetail.reviewAccuses[0];
    },
    isTypeInterview() {
      const type = this.getReviewsDetailData.typeId;
      return checkIsTypeInterview(type);
    }
  },
  methods: {
    ...mapActions("reviews", ["getReviewsDetail", "patchReviewsAccuseDetail"]),
    getReasonName(reason) {
      const reasonNameType = {
        1: "客服評估無爭議",
        2: "客服評估沒有違法",
        3: "其他原因"
      };

      return reasonNameType[reason];
    },
    getConpanyLink(custno) {
      return `https:${process.env.VUE_APP_FRONT_DESK_DOMAIN_URL}company/${custno}/reviews`;
    },
    getPlantName(plantId, typeId) {
      return anonymousName(plantId, typeId);
    },
    getWageType(wage) {
      const wageType = {
        hour: "時薪",
        month: "月薪",
        year: "年薪"
      };
      return wageType[wage];
    },
    getWage(wage) {
      const wageType = {
        1: "100 萬以下",
        2: "100 ~ 150 萬",
        3: "150 ~ 200 萬",
        4: "200 ~ 250 萬",
        5: "250 ~ 300 萬",
        6: "300 萬以上"
      };
      return wage < 7 ? wageType[wage] : wage;
    },
    changeReason(reasonNumber) {
      const mailContent = this.getAppealMailContent(reasonNumber);
      let mailContentValue = document.querySelector(".mail-content-textarea");

      if (mailContent.content && mailContentValue) {
        mailContentValue.value = mailContent.content;
      } else if (mailContentValue) {
        mailContentValue.value = "";
      }
    },
    patchReviewDetail() {
      const audit_state = Number(this.radio);
      const mailContentValue = document.querySelector(".mail-content-textarea");

      if (!audit_state) return alert("請選擇審核內容!");
      if (audit_state !== 4 && !this.reason) return alert("請選擇審核原因!");

      this.submitDisable = true;

      const reviewData = {
        id: this.getReviewAccuses.id,
        auditState: audit_state,
        auditMemo: this.getReasonName(this.reason),
        mailContent: mailContentValue ? mailContentValue.value : ""
      };

      if (audit_state === 4) {
        delete reviewData.auditMemo;
        reviewData.mailContent = this.getAppealMailContent(0).content;
      }

      this.patchReviewsAccuseDetail(reviewData);
    },
    getReviewsDetailStatus(data) {
      return JSON.stringify(data) === "{}" ? false : true;
    }
  }
};
</script>

<style lang="scss" scoped>
.review-complain-detail {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 895px;
  border-radius: 5px;
  color: #333;
  letter-spacing: 1px;

  .loading {
    text-align: center;
    padding: 150px 0;
  }

  .review-complain-detail-top-nav {
    margin: 15px;
    display: flex;
    justify-content: space-between;

    div {
      &:nth-child(2) {
        color: red;
      }
    }
  }

  .review-complain-detail-top-content {
    border: 1px solid #ddd;
    margin: 0 15px;
    border-radius: 5px;

    &.appeal-content {
      margin-top: 20px;
    }

    .review-complain-detail-top-source {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 15px;

      .user-source {
        display: flex;
        justify-content: space-between;
      }

      .company-source {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
      }
    }

    .review-complain-detail-score {
      padding: 15px;

      dl {
        margin: 15px 0 !important;
        overflow: hidden;

        &:last-child {
          margin-bottom: 0 !important;
        }

        dt {
          color: #ff9100;
          font-size: 18px;
          margin-bottom: 15px;
        }

        dd {
          line-height: 1.5;
          margin-bottom: 5px !important;
        }
      }
    }
  }

  .review-complain-detail-process {
    margin-top: 25px;

    .review-complain {
      display: flex;
      margin: 0 15px;
      font-size: 18px;

      span {
        margin-right: 15px;
        font-size: 16px;
      }
    }

    .reason,
    .not-processed {
      margin: 25px 0 0 15px;
      display: flex;

      dl {
        margin-left: 15px !important;
      }

      dd {
        margin-bottom: 10px !important;
      }
    }
  }

  .mail-content {
    margin: 20px 15px;

    .mail-content-textarea {
      border: 1px solid #dcdfe6;
      color: #606266;
      border-radius: 5px;
      width: 500px;
      height: 200px;
      padding: 10px;
    }
  }

  .send-out {
    margin: 50px 0 30px;
    text-align: center;
  }

  .title {
    margin-bottom: 15px;
    font-weight: bold;
  }

  a {
    color: #1654b9;
  }
}
</style>
