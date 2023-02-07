<template>
  <div class="review-detail">
    <div class="review-detail-wrap">
      <div class="loading" v-if="!getReviewsDetailStatus(getReviewsDetailData)">
        <Loading />
      </div>

      <div v-if="getReviewsDetailStatus(getReviewsDetailData)">
        <div class="review-detail-top-nav">
          <div>
            <router-link to="/review_list">&lt; 返回評論審核列表</router-link>
          </div>
          <div v-if="getReviewsDetailData.auditState === 6">
            此會員已評論過此公司(且通過審核)
          </div>
          <div>評論編號：{{ getReviewsDetailData.id }}</div>
        </div>

        <div class="review-detail-review-content">
          <div class="review-detail-review-source">
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
              <span>IP：{{ getReviewsDetailData.ip }}</span>
            </div>
            <div class="company-source">
              <span>
                {{ getReviewsDetailData.company }}
                (<a
                  target="_blank"
                  :href="
                    getConpanyLink(encodeCustno(getReviewsDetailData.custno))
                  "
                >
                  公司專頁
                </a>
                )
              </span>
              <span>custno：{{ getReviewsDetailData.custno }}</span>
            </div>
          </div>
          <div
            v-if="getReviewsDetailData.isVerify"
            class="review-detail-isVerify"
          >
            <span class="review-detail-isVerify-icon">老闆認證</span>
          </div>
          <div class="review-detail-review-score">
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
                v-html="
                  getReviewsDetailData.disadvantage.replace(/\n/g, '<br>')
                "
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

        <div class="title" style="margin: 30px 15px;">
          目前狀態：{{ getAuditState(getReviewsDetailData.auditState) }}
        </div>
        <div
          class="review-detail-past-review"
          v-if="getReviewsDetailLogList.items.length > 0"
        >
          <div class="title">過往審核：</div>
          <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="(item, index) in getReviewsDetailLogList.items"
              :key="index"
              :title="`${timeDate(item.createDate)}`"
              :name="index"
            >
              <div>審核紀錄編號: {{ item.id }}</div>
              <div>審核員編: {{ item.accountId }}</div>
              <div v-html="item.memo"></div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="review-detail-review-process">
          <div class="review">
            <span class="title">審核：</span>
            <span><el-radio v-model="radio" label="6">公開評論</el-radio></span>
            <span
              ><el-radio v-model="radio" label="3">不公開評論</el-radio></span
            >
            <span><el-radio v-model="radio" label="2">不須處理</el-radio></span>
            <span></span>
          </div>

          <div class="reason" v-if="radio === '3'">
            <div class="title">原因：</div>
            <div>
              <el-radio-group v-model="reason" :change="changeReason(reason)">
                <dl>
                  <!-- <dd>
                  <el-radio label="0">
                    謾罵詆毀
                  </el-radio>
                </dd> -->
                  <dd>
                    <el-radio label="0">
                      無關訊息
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="1">
                      較具爭議
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="2">
                      涉及公司機密
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="3">
                      涉及內部流程或人事資訊
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="4">
                      內容太少/不夠具體
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="5">
                      文字和評價落差過大
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="6">
                      未填寫公司優點
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="7">
                      公司缺點寫在優點欄位
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="8">
                      其他原因，請於下方補充
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="9">
                      緊急下架(不發信)
                    </el-radio>
                  </dd>
                </dl>
              </el-radio-group>
            </div>
          </div>

          <div class="not-processed" v-if="radio === '2'">
            <div class="title">原因：</div>
            <div>
              <el-radio-group v-model="reason" :change="changeReason(reason)">
                <dl>
                  <dd>
                    <el-radio label="10">
                      內部測試
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="11">
                      垃圾訊息
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="12">
                      重複評論
                    </el-radio>
                  </dd>
                  <dd>
                    <el-radio label="13">
                      暫不處理
                    </el-radio>
                  </dd>
                </dl>
              </el-radio-group>
            </div>
          </div>
        </div>

        <div class="mail-content" v-if="radio === '3'">
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
    <BossReply v-if="getReviewsDetailData.bossReply" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { anonymousName, checkIsTypeInterview } from "@/utils/anonymous";
import Loading from "@/components/Loading.vue";
import BossReply from "@/components/BossReply.vue";
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "ReviewDetail",
  data() {
    return {
      radio: "",
      reason: "",
      submitDisable: false,
      activeNames: []
    };
  },
  components: {
    Loading,
    BossReply
  },
  mixins: [commonMixins],
  created() {
    const reviewsId = this.$route.params.reviewId;
    this.getReviewsDetail(reviewsId);
    this.getReviewsDetailLog({
      perPage: 20,
      page: 1,
      entityType: "review",
      entityId: reviewsId
    });
    this.getBossReplyRecord({
      perPage: 10,
      page: 1,
      reviewId: reviewsId
    });
  },
  computed: {
    ...mapGetters("reviews", ["getReviewsData"]),
    getReviewsDetailData() {
      return this.getReviewsData.reviewsDetail;
    },
    getReviewsDetailLogList() {
      return this.getReviewsData.reviewsDetailLog;
    },
    isTypeInterview() {
      const type = this.getReviewsDetailData.typeId;
      return checkIsTypeInterview(type);
    }
  },
  methods: {
    ...mapActions("reviews", [
      "getReviewsDetail",
      "patchReviewsDetail",
      "getReviewsDetailLog",
      "getBossReplyRecord"
    ]),
    changeReason(reasonNumber) {
      const mailContent = this.getReviewsMailContent(reasonNumber);
      let mailContentValue = document.querySelector(".mail-content-textarea");
      if (mailContent.content && mailContentValue) {
        mailContentValue.value = mailContent.content;
      } else if (mailContentValue) {
        mailContentValue.value = "";
      }
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
    getReasonName(reason) {
      const reasonNameType = {
        0: "無關訊息",
        1: "較具爭議",
        2: "涉及公司機密",
        3: "涉及內部流程或人事資訊",
        4: "內容太少/不夠具體",
        5: "文字和評價落差過大",
        6: "未填寫公司優點",
        7: "公司缺點寫在優點欄位",
        8: "其他原因",
        9: "緊急下架",
        10: "內部測試",
        11: "垃圾訊息",
        12: "重複評論",
        13: "暫不處理"
      };
      return reasonNameType[reason];
    },
    getAuditState(auditState) {
      const auditStateType = {
        0: "刪除",
        1: "待審核",
        2: "不需處理",
        3: "審核未過",
        4: "檢舉下架",
        5: "檢舉待審",
        6: "審核通過",
        7: "檢舉重新上架"
      };
      return auditStateType[auditState];
    },
    patchReviewDetail() {
      const audit_state = Number(this.radio);
      const mailContentValue = document.querySelector(".mail-content-textarea");

      if (!audit_state) return alert("請選擇審核內容!");
      if (audit_state !== 6 && !this.reason) return alert("請選擇審核原因!");

      this.submitDisable = true;

      const reviewData = {
        id: this.getReviewsData.reviewsDetail.id,
        typeId: this.getReviewsData.reviewsDetail.typeId,
        auditState: audit_state,
        auditMemo: this.getReasonName(this.reason),
        mailContent: mailContentValue ? mailContentValue.value : ""
      };

      if (audit_state === 6) delete reviewData.auditMemo;
      if (!reviewData.mailContent) delete reviewData.mailContent;

      this.patchReviewsDetail(reviewData);
    },
    getReviewsDetailStatus(data) {
      return JSON.stringify(data) === "{}" ? false : true;
    }
  }
};
</script>

<style lang="scss" scoped>
.review-detail-wrap {
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

  .review-detail-top-nav {
    margin: 15px;
    display: flex;
    justify-content: space-between;

    div {
      &:nth-child(2) {
        color: red;
      }
    }
  }

  .review-detail-review-content {
    border: 1px solid #ddd;
    margin: 0 15px;
    border-radius: 5px;

    .review-detail-review-source {
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
    .review-detail-isVerify {
      position: relative;
      &-icon {
        position: absolute;
        top: 15px;
        right: 15px;
        border: 1px solid rgb(111, 184, 39);
        border-radius: 4px;
        color: rgb(111, 184, 39);
        font-size: 12px;
        padding: 2px 6px;
        display: inline-block;
        line-height: 1.5;
      }
    }
    .review-detail-review-score {
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
          word-break: break-all;
        }
      }
    }
  }

  .review-detail-past-review {
    margin: 25px 15px 0;
  }

  .review-detail-review-process {
    margin-top: 65px;

    .review {
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
