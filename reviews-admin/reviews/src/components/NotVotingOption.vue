<template>
  <div
    class="notVoteing-block rounded t3 font-weight-bold"
    @click="putVotes({ id: voteId, itemId })"
  >
    <div class="notVoteing-title" data-gtm-detail="投票選項">
      <span class="number mr-2">{{ index }}.</span>
      <span>{{ votedTitle }}</span>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "NotVotingOption",
  props: {
    voteId: {
      type: Number,
      default: 0
    },
    votedTitle: {
      type: String,
      default: ""
    },
    itemId: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions("company", ["putVotes"])
  }
};
</script>

<style lang="scss" scoped>
.notVoteing-block {
  padding: 11px 20px;
  border: solid 1px #7e7e7e;
  color: #7e7e7e;
  cursor: pointer;
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &:hover {
    color: #ff9100;
    border-color: #ff9100;
    box-shadow: 0 0 4px 0 #ff9100;
  }
}
</style>
