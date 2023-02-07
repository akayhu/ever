<template>
  <div class="bossReply-wrap px-4 px-md-5 pb-4 pb-md-5">
    <div
      class="bossReply rounded d-block d-md-flex px-4 px-md-5 px-lg-6 py-4 py-md-8"
    >
      <div class="bossReply-left d-flex align-items-start">
        <el-tooltip class="item" placement="top">
          <div slot="content" class="t4 text-white">
            盆栽(公司)提供養份(資源)孕育植物(員<br />工)。也因為員工的努力和付出，使公司逐<br />漸成長茁壯。
          </div>
          <img
            class="rounded-circle mr-3"
            width="40"
            src="@/assets/flowerpot.png"
          />
        </el-tooltip>
        <div>
          <div class="bossReply-title t4 font-weight-bold">老闆回覆</div>
          <div
            class="bossReply-date t5"
            :title="timeDate(bossReplyComment.createDate)"
          >
            {{
              [0, "minutes"]
                | duration("subtract", timeAgo(bossReplyComment.createDate))
                | duration("humanize", true)
            }}
          </div>
        </div>
      </div>
      <div class="bossReply-right mt-2 mt-md-0">
        <div
          class="bossReply-comment t3"
          v-html="bossReplyComment.comment.replace(/\n/g, '<br>')"
        ></div>
        <div
          class="bossReply-edited t4 mt-4"
          v-if="bossReplyComment.commentState === 2"
        >
          已編輯
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
export default {
  name: "BossReply",
  mixins: [commonMixins],
  props: {
    bossReplyComment: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.bossReply {
  background: #f2f2f2;
  color: #292929;

  &-left {
    flex-shrink: 0;
    margin-right: 80px;

    .bossReply-date {
      color: #a9a9a9;
    }
  }

  &-right {
    .bossReply-comment {
      max-width: 500px;
      word-wrap: break-word;
      word-break: break-all;
    }
    .bossReply-edited {
      color: #a9a9a9;
    }
  }
}
</style>
