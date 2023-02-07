<template>
  <div class="vote-detail">
    <div class="loading" v-if="!getVotesDetailStatus(getVotesDetailData)">
      <Loading />
    </div>

    <div v-if="getVotesDetailStatus(getVotesDetailData)">
      <div class="vote-detail-top-nav">
        <div>
          <router-link to="/review_vote">&lt; 返回投票審核列表</router-link>
        </div>
        <div>投票編號：{{ getVotesDetailData.id }}</div>
      </div>

      <div class="vote-detail-vote-content">
        <div class="vote-detail-vote-source">
          <div class="user-source">
            <span>{{ getPlantName(getVotesDetailData.plantId) }}</span>
            <span>
              發表時間：{{ timeDate(getVotesDetailData.createDate) }}
            </span>
            <span>pid：{{ getVotesDetailData.pid }}</span>
            <span>IP：{{ getVotesDetailData.ip }}</span>
          </div>
          <div class="company-source">
            <span>
              {{ getVotesDetailData.company }}
              (
              <a
                target="_blank"
                :href="getConpanyLink(encodeCustno(getVotesDetailData.custno))"
              >
                公司專頁
              </a>
              )
            </span>
            <span>custno：{{ getVotesDetailData.custno }}</span>
          </div>
        </div>

        <div class="vote-detail-vote-score">
          <dl>
            <dt>投票主題</dt>
            <dd>{{ getVotesDetailData.title }}</dd>
          </dl>

          <dl>
            <dt>選項</dt>
            <dd
              v-for="(item, index) in getVotesDetailData.voteItems"
              :key="index"
            >
              {{ item.item }}
            </dd>
          </dl>
        </div>
      </div>

      <div class="title" style="margin: 30px 15px;">
        目前狀態：{{ getAuditState(getVotesDetailData.auditState) }}
      </div>
      <div
        class="vote-detail-past-vote"
        v-if="getVotesDetailLogList.items.length > 0"
      >
        <div class="title">過往審核：</div>
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(item, index) in getVotesDetailLogList.items"
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

      <div class="vote-detail-vote-process">
        <div class="vote">
          <span class="title">審核：</span>
          <span><el-radio v-model="radio" label="4">公開投票</el-radio></span>
          <span><el-radio v-model="radio" label="3">不公開投票</el-radio></span>
          <span><el-radio v-model="radio" label="2">不須處理</el-radio></span>
          <span></span>
        </div>

        <div class="reason" v-if="radio === '3'">
          <div class="title">原因：</div>
          <div>
            <el-radio-group v-model="reason" :change="changeReason(reason)">
              <dl>
                <dd>
                  <el-radio label="0">
                    可能引發爭議
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="1">
                    可能涉及個人隱私
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="2">
                    可能涉及公司營業祕密
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="3">
                    可能觸犯公然侮辱或誹謗罪
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="4">
                    已有類似投票主題
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="5">
                    無關訊息
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="6">
                    其他原因，請於下方補充
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="7">
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
                  <el-radio label="8">
                    內部測試
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="9">
                    垃圾訊息
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="10">
                    重複主題
                  </el-radio>
                </dd>
                <dd>
                  <el-radio label="11">
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
        <textarea type="textarea" class="mail-content-textarea" />
      </div>

      <div class="send-out">
        <el-button
          type="primary"
          @click="patchVotesDetailFunc()"
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
import { anonymousVoteName } from "@/utils/anonymous";
import { commonMixins } from "@/mixins/commonMixins";
import Loading from "@/components/Loading.vue";

export default {
  name: "VoteDetail",
  data() {
    return {
      radio: "",
      reason: "",
      notProcessedValue: "",
      submitDisable: false,
      activeNames: []
    };
  },
  components: {
    Loading
  },
  mixins: [commonMixins],
  created() {
    const votesId = this.$route.params.voteId;
    this.getVotesDetail(votesId);
    this.getVotesDetailLog({
      perPage: 20,
      page: 1,
      entityType: "vote",
      entityId: votesId
    });
  },
  computed: {
    ...mapGetters("votes", ["getVotesData"]),
    getVotesDetailData() {
      return this.getVotesData.votesDetail;
    },
    getVotesDetailLogList() {
      return this.getVotesData.votesDetailLog;
    }
  },
  methods: {
    ...mapActions("votes", [
      "getVotesDetail",
      "patchVotesDetail",
      "getVotesDetailLog"
    ]),
    getConpanyLink(custno) {
      return `https:${process.env.VUE_APP_FRONT_DESK_DOMAIN_URL}company/${custno}/reviews`;
    },
    getReasonName(reason) {
      const reasonNameType = {
        0: "可能引發爭議",
        1: "可能涉及個人隱私",
        2: "可能涉及公司營業祕密",
        3: "可能觸犯公然侮辱或誹謗罪",
        4: "已有類似投票主題",
        5: "無關訊息",
        6: "其他原因",
        7: "緊急下架",
        8: "內部測試",
        9: "垃圾訊息",
        10: "重複主題",
        11: "暫不處理"
      };

      return reasonNameType[reason];
    },
    getAuditState(auditState) {
      const auditStateType = {
        0: "刪除",
        1: "待審核",
        2: "不需處理",
        3: "不公開投票",
        4: "公開投票"
      };
      return auditStateType[auditState];
    },
    changeReason(reasonNumber) {
      const mailContent = this.getVotesMailContent(reasonNumber);
      let mailContentValue = document.querySelector(".mail-content-textarea");
      if (mailContent.content && mailContentValue) {
        mailContentValue.value = mailContent.content;
      } else if (mailContentValue) {
        mailContentValue.value = "";
      }
    },
    patchVotesDetailFunc(event) {
      const audit_state = Number(this.radio);
      const mailContentValue = document.querySelector(".mail-content-textarea");

      if (!audit_state) return alert("請選擇審核內容!");
      if (audit_state !== 4 && !this.reason) return alert("請選擇審核原因!");

      this.submitDisable = true;

      const votesData = {
        id: this.getVotesData.votesDetail.id,
        auditState: audit_state,
        auditMemo: this.getReasonName(this.reason),
        mailContent: mailContentValue ? mailContentValue.value : ""
      };

      if (audit_state === 4) delete votesData.auditMemo;
      if (!votesData.mailContent) delete votesData.mailContent;

      this.patchVotesDetail(votesData);
    },
    getVotesDetailStatus(data) {
      return JSON.stringify(data) === "{}" ? false : true;
    },
    getPlantName(plantId) {
      return anonymousVoteName(plantId);
    }
  }
};
</script>

<style lang="scss" scoped>
.vote-detail {
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

  .vote-detail-top-nav {
    margin: 15px;
    display: flex;
    justify-content: space-between;

    div {
      &:nth-child(2) {
        color: red;
      }
    }
  }

  .vote-detail-vote-content {
    border: 1px solid #ddd;
    margin: 0 15px;
    border-radius: 5px;

    .vote-detail-vote-source {
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

    .vote-detail-vote-score {
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

  .vote-detail-past-vote {
    margin: 25px 15px 0;
  }

  .vote-detail-vote-process {
    margin-top: 65px;

    .vote {
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
