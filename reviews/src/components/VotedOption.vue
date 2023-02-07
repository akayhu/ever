<template>
  <voted-votes-block :theme="{ pa }" v-b-tooltip.hover :title="`${count}票`">
    <voted-votes
      class="voted-block d-flex justify-content-between align-items-center rounded font-weight-bold"
    >
      <div class="vote-title d-flex align-items-start mr-5">
        <div class="number mr-2">{{ number }}.</div>
        <div class="title">
          {{ votedTitle
          }}<i
            v-if="hasVote"
            class="jb_icon_mark ml-2"
            v-b-tooltip.hover
            title="自投票"
          ></i>
        </div>
      </div>
      <span class="vote-pa t4">{{ pa }}%</span>
    </voted-votes>
  </voted-votes-block>
</template>

<script>
import { VotedVotes } from "@/styledComponents/common.js";
import { ThemeProvider } from "vue-styled-components";

export default {
  name: "VotedOption",
  components: {
    VotedVotes,
    "voted-votes-block": ThemeProvider
  },
  props: {
    votedTitle: {
      type: String,
      default: ""
    },
    pa: {
      type: Number,
      default: 0
    },
    number: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    hasVote: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.bs-tooltip-top {
  position: relative;
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 4px;
  color: #fff;
  background-color: #292929;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -10px;
    border-style: solid;
    border-width: 10px;
    border-color: #292929 transparent transparent transparent;
  }
}

.voted-block {
  padding: 15px 20px;
  border: solid 1px #ddd;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 8px;

  .vote-title {
    .title {
      word-wrap: break-word;
      word-break: break-all;
    }
    i {
      font-size: 14px;
      color: #7e7e7e;
    }
  }

  span.vote-pa {
    color: #a9a9a9;
  }
}
</style>
