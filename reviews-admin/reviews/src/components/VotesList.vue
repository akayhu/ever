<template>
  <dd>
    <router-link
      :to="{
        name: 'singleVote',
        params: {
          custno: encodeCustno(votes.custno),
          votesId: votes.id
        }
      }"
      :target="page === 'companyList' ? '_self' : '_blank'"
      data-gtm-list="單則投票"
      rel="noopener noreferrer"
    >
      <div
        class="vote-list_content d-block d-md-flex py-4 paddingX-rwd"
        :class="{ borderBottom: page === 'votes' && index === 4 }"
      >
        <div class="vote-list_left d-flex align-items-start mb-3 mb-md-0">
          <el-tooltip class="item" placement="top">
            <div slot="content" class="t4 text-white">
              評論者可從8種植物中任選一個匿名身份；<br />
              不同評論若為相同植物，不代表為同一人<br />
              所填寫。
            </div>
            <img
              class="mr-3 rounded-circle"
              :src="getAnonymousImgUrl(votes.plantId)"
            />
          </el-tooltip>
          <div>
            <div class="anonymous-name t4">
              {{ getAnonymousName(votes.plantId) }}
            </div>
            <div
              class="anonymous-time t5"
              v-if="votes.createDate"
              :title="timeDate(votes.createDate)"
            >
              {{
                [0, "minutes"]
                  | duration("subtract", timeAgo(votes.createDate))
                  | duration("humanize", true)
              }}
            </div>
          </div>
        </div>
        <div class="vote-list_right">
          <div v-if="page !== 'companyList'" class="companyName-block t4 mb-3">
            {{ votes.company }}
          </div>
          <div class="title-block t2 font-weight-bold mb-1">
            {{ votes.title }}
          </div>
          <div class="vote-block t4">{{ votes.count }} 人已投票</div>
        </div>
      </div>
    </router-link>
    <router-link
      v-if="index === 4"
      to="/form/vote"
      data-gtm-banner="我要發起投票"
      rel="noopener noreferrer"
    >
      <div class="share-vote d-none d-md-block py-8 t1 font-weight-bold">
        歡迎舉手發問<br />幫助職場生態越來越好！
        <span class="t3 font-weight-bold ml-6">
          我要發起投票 <i class="jb_icon_right font-weight-bold" />
        </span>
      </div>
    </router-link>
  </dd>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";

export default {
  name: "VotesList",
  mixins: [commonMixins],
  props: {
    votes: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    page: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

.vote-list_content {
  border-bottom: 1px solid #eee;
  &:hover {
    background-color: none;
    @include media-breakpoint-up(md) {
      background-color: #ffeedf;
    }
  }

  &.borderBottom {
    border-bottom: 1px solid #eee;
    @include media-breakpoint-up(md) {
      border-bottom: none;
    }
  }

  .vote-list_left {
    width: 188px;

    img {
      width: 40px;
    }

    .anonymous-name {
      padding-top: 1px;
      color: #292929;
    }

    .anonymous-time {
      color: #a9a9a9;
    }
  }

  .vote-list_right {
    .companyName-block,
    .title-block {
      width: 100%;
      color: #292929;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
      @include media-breakpoint-up(md) {
        max-width: 480px;
      }
      @include media-breakpoint-up(lg) {
        max-width: 500px;
      }
    }

    .vote-block {
      color: #a9a9a9;
    }
  }
}

.share-vote {
  height: 118px;
  background-image: url(~@/assets/vote-ask.png);
  background-color: #ffeedf;
  background-repeat: no-repeat;
  background-size: 180px;
  color: #292929;

  @include media-breakpoint-up(md) {
    background-position: 479px 0px;
    padding-left: 57px;
  }
  @include media-breakpoint-up(lg) {
    background-position: 588px 0px;
    padding-left: 116px;
  }
  @include media-breakpoint-up(xl) {
    background-position: 649px 0px;
    padding-left: 227px;
  }

  span {
    color: #ff7800;
    cursor: pointer;
  }
}
</style>
