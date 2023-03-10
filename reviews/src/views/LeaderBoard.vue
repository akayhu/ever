<template>
  <div class="bg-white">
    <div class="py-4">
      <div class="leaderboard-buttons mb-md-6">
        <div class="slider" ref="slider">
          <div class="slider-container paddingX-rwd">
            <router-link
              v-for="(key, idx) in leaderboardKeyList"
              :key="key"
              :ref="`${leaderboardNameRef[key].routeName}`"
              class="rectangle t4"
              :data-gtm-list="leaderboardNameRef[key].displayName"
              draggable="false"
              @mouseenter.native="showToolTip(idx)"
              @mouseleave.native="hideToolTip(idx)"
              :tag="
                currentType === leaderboardNameRef[key].routeName ? 'h3' : 'a'
              "
              :to="{
                name: 'leaderBoard',
                params: { type: leaderboardNameRef[key].routeName }
              }"
            >
              <el-tooltip
                placement="top"
                :manual="true"
                :value="showTip[idx]"
                :disabled="disableToolTip"
                popper-class="leaderboard-custom-tooltip"
              >
                <div slot="content">{{ leaderboardToolTipName[key] }}</div>
                <span>{{ leaderboardNameRef[key].displayName }} </span>
              </el-tooltip>
            </router-link>
          </div>
        </div>
      </div>
      <div class="paddingX-rwd mb-6 d-md-none info">
        {{ leaderboardToolTipName[currentKey] }}
      </div>
      <div class="paddingX-rwd">
        <TopThree
          :topThreeCompany="currentBoard.slice(0, 3)"
          :boardType="currentType"
          :loading="!currentBoard.length"
          :gtmTag="currentGTMtag"
        />
      </div>
    </div>
    <LeaderBoardTable
      :boardTableData="currentBoard.slice(3)"
      :boardType="currentType"
      :loading="!currentBoard.length"
      :gtmTag="currentGTMtag"
    />
  </div>
</template>

<script>
import TopThree from "@/components/leaderBoard/TopThree.vue";
import LeaderBoardTable from "@/components/leaderBoard/LeaderBoardTable.vue";
import { LEADER_BOARD_NAME_REF, LEADER_BOARD_KEY_LIST } from "@/utils/enum.js";
import { mapActions, mapState } from "vuex";
export default {
  name: "LeaderBoard",
  components: {
    TopThree,
    LeaderBoardTable
  },
  data() {
    return {
      leaderboardKeyList: LEADER_BOARD_KEY_LIST,
      leaderboardNameRef: LEADER_BOARD_NAME_REF,
      leaderboardToolTipName: {
        [LEADER_BOARD_KEY_LIST[0]]: "????????????????????????????????????",
        [LEADER_BOARD_KEY_LIST[1]]: "????????????????????????",
        [LEADER_BOARD_KEY_LIST[2]]: "??????????????????????????????",
        [LEADER_BOARD_KEY_LIST[3]]: "??????????????????????????????",
        [LEADER_BOARD_KEY_LIST[4]]: "??????????????????????????????",
        [LEADER_BOARD_KEY_LIST[5]]: "??????????????????????????????"
      },
      showTip: Array(6).fill(false),
      disableToolTip: false,
      currentTabOffset: 0
    };
  },
  mounted() {
    this.setSliderOffset(this.currentType);
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    setSliderOffset(type) {
      this.currentTabOffset = this.$refs[type][0].$el.offsetLeft;
      this.$refs.slider.scrollLeft = this.currentTabOffset - 16;
    },
    showToolTip(idx) {
      this.$set(this.showTip, idx, true);
    },
    hideToolTip(idx) {
      this.$set(this.showTip, idx, false);
    },
    handleResize() {
      const width = window.innerWidth;
      const mdWidth = 1024;
      if (width < mdWidth) {
        this.disableToolTip = true;
      } else {
        this.disableToolTip = false;
      }
      this.showTip = Array(6).fill(false);
    },
    ...mapActions("leaderBoard", ["getLeaderBoard"])
  },
  computed: {
    currentType() {
      return this.$route.params.type;
    },
    currentKey() {
      return Object.keys(this.leaderboardNameRef).find(
        key => this.leaderboardNameRef[key].routeName === this.currentType
      );
    },
    currentGTMtag() {
      const currentType = this.leaderboardNameRef[this.currentKey].displayName;
      return {
        list: { attr: "list", val: `${currentType}??????????????????` },
        job: { attr: "job", val: `${currentType}????????????` },
        login: { attr: "list", val: `${currentType}????????????` }
      };
    },
    ...mapState("leaderBoard", ["currentBoard"])
  },
  watch: {
    currentType(type, prev) {
      this.setSliderOffset(type);
    }
  }
};
</script>
<style lang="scss">
.leaderboard-custom-tooltip.el-tooltip__popper {
  &[x-placement^="top"] {
    margin-bottom: 11px !important;
  }
}
</style>
<style lang="scss" scoped>
.rectangle {
  display: inline-block;
  padding: 1px 8px;
  border: solid 1px get-color(calm);
  border-radius: 12px;
  color: get-color(calm);
  background-color: #fff;
  outline: none;
  &:not(:last-child) {
    margin-right: 8px;
  }
  &.router-link-active {
    margin-bottom: 0;
    background-color: get-color(calm);
    color: #fff;
  }
}
.leaderboard-buttons {
  overflow: hidden;
  .slider {
    overflow-x: auto;
    scroll-behavior: smooth;
    .slider-container {
      padding-bottom: 8px;
      position: relative;
      width: fit-content;
      height: 100%;
      white-space: nowrap;
    }
  }
}
.info {
  color: get-color(text-info);
}
</style>
