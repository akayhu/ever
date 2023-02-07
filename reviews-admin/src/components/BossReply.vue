<template>
  <div class="boss-reply" v-if="lastBossReplyRecord">
    <div class="boss-reply-header">
      <div class="boss-reply-titile">
        老闆回覆
      </div>
      <div
        class="boss-reply-more"
        v-if="reviewsBossReplyRecord && reviewsBossReplyRecord.items.length > 0"
        @click="editLightBox = true"
      >
        <div class="triangle"></div>
      </div>
    </div>
    <div class="boss-reply-body">
      <div class="boss-reply-date">
        {{ timeDate(lastBossReplyRecord.createDate) }}
      </div>
      <div class="boss-reply-content">
        {{ lastBossReplyRecord.comment }}
      </div>
    </div>
    <div class="boss-reply-footer">
      <el-button
        type="primary"
        @click="deleBossReply(lastBossReplyRecord)"
        :disabled="lastBossReplyRecord.commentState === 0"
      >
        刪除老闆回覆
      </el-button>
    </div>
    <el-dialog
      title="編輯紀錄"
      width="600px"
      :visible.sync="editLightBox"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <div class="edit-history-wrap">
        <template v-for="(history, index) in reviewsBossReplyRecord.items">
          <div
            class="edit-history"
            :key="history.createDate"
            v-if="!(reviewsBossReplyRecord.currentPage === 1 && index === 0)"
          >
            <div class="edit-history-date">
              {{ timeDate(history.createDate) }}
            </div>
            <div
              class="edit-history-content"
              :class="{ deleted: history.commentState === 0 }"
            >
              {{ history.comment }}
            </div>
          </div>
        </template>
      </div>
      <div class="edit-history-pagination">
        <button
          v-if="reviewsBossReplyRecord.currentPage > 1"
          type="button"
          @click="getBossReplyList(reviewsBossReplyRecord.currentPage - 1)"
        >
          上一頁
        </button>
        <div class="placeholdBox" v-else></div>
        第 {{ reviewsBossReplyRecord.currentPage }} / {{ maxPage }} 頁
        <button
          v-if="reviewsBossReplyRecord.currentPage < maxPage"
          type="button"
          @click="getBossReplyList(reviewsBossReplyRecord.currentPage + 1)"
        >
          下一頁
        </button>
        <div class="placeholdBox" v-else></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { commonMixins } from "@/mixins/commonMixins";
export default {
  name: "BossReply",
  data() {
    return {
      editLightBox: false
    };
  },
  mixins: [commonMixins],
  computed: {
    ...mapGetters("reviews", ["getReviewsData"]),
    reviewsBossReplyRecord() {
      return this.getReviewsData.reviewsBossReplyRecord;
    },
    lastBossReplyRecord() {
      return this.reviewsBossReplyRecord.items.slice(0, 1)[0];
    },
    maxPage() {
      return Math.ceil(
        this.reviewsBossReplyRecord.total / this.reviewsBossReplyRecord.perPage
      );
    }
  },
  methods: {
    ...mapActions("reviews", ["getBossReplyRecord", "deleteBossReply"]),
    getBossReplyList(page) {
      let BossReplyRecordPayload = {
        perPage: 10,
        page,
        reviewId: this.getReviewsData.reviewsDetail.id
      };
      this.getBossReplyRecord(BossReplyRecordPayload);
    },
    deleBossReply(lastBossReplyRecord) {
      let { id, reviewId } = lastBossReplyRecord;
      if (confirm("確定要刪除此筆老闆回覆嗎？"))
        this.deleteBossReply({ id, reviewId });
      else return;
    }
  }
};
</script>

<style lang="scss">
.el-dialog__header {
  font-weight: bold;
}
.el-dialog__body {
  padding: 10px 20px !important;
}
</style>
<style lang="scss" scoped>
.boss-reply {
  background-color: #fff;
  margin: 20px 0 0 0;
  padding: 20px 15px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 865px;
  border-radius: 5px;
  color: #333;
  letter-spacing: 1px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .boss-reply-titile {
      display: flex;
      align-items: center;
      color: rgb(51, 51, 51);
      font-size: 18px;
      font-weight: bold;
    }

    .boss-reply-more {
      padding: 5px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;

      .triangle {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 8px 5px 0 5px;
        border-color: #333 transparent transparent transparent;
        &:hover {
          border-color: #666 transparent transparent transparent;
        }
      }
    }
  }

  &-body {
    margin: 15px 0px 40px 0px;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #ddd;

    .boss-reply-date {
      font-size: 13px;
      color: #606266;
    }

    .boss-reply-content {
      font-size: 16px;
      line-height: 1.45;
      padding: 20px 0;
    }
  }

  &-footer {
    text-align: center;
  }
}

.edit-history-wrap {
  height: 500px;
  overflow: auto;
}

.edit-history {
  padding: 15px 0px;
  &:first-child {
    padding-top: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }

  &-date {
    padding-bottom: 10px;
    font-size: 13px;
    color: #606266;
  }

  &-content {
    font-size: 16px;
    line-height: 1.45;
    color: black;

    &.deleted {
      padding: 5px;
      background: #eee;
      color: #666;
    }
  }
}

.edit-history-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;

  button {
    margin: 0 10px;
    padding: 6px 12px;
    border-radius: 4px;
    border: solid 1px #eee;
    background-color: #f3f3f3;
    color: #7e7e7e;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    outline: none;
    vertical-align: text-top;
    cursor: pointer;
  }

  .placeholdBox {
    width: 88px;
  }
}
</style>
