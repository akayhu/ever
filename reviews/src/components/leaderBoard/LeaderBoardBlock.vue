<template>
  <div class="d-flex flex-wrap paddingX-rwd pt-6 pb-0 pb-md-1">
    <div
      v-for="key in leaderBoardKeyList"
      :key="key"
      class="leaderboard p-6 mb-4 mb-md-5 rounded"
    >
      <div class="d-flex justify-content-between align-items-center mb-8">
        <h3 class="leaderboard-title t2 font-weight-bold mb-0">
          {{ leaderBoardNameRef[key].displayName }}
        </h3>
        <router-link
          :to="{
            name: 'leaderBoard',
            params: { type: leaderBoardNameRef[key].routeName }
          }"
          class="leaderboard-see-all t4 font-weight-bold"
          :data-gtm-list="`${leaderBoardNameRef[key].displayName}更多`"
        >
          更多 <i class="jb_icon_right font-weight-bold" />
        </router-link>
      </div>
      <ul class="leaderboard-list">
        <li
          v-for="(item, index) in leaderboardData[leaderBoardTypeRef[key]]"
          :key="encodeCustno(item.custno)"
          class="d-flex mb-4 t3 overflow-hidden"
        >
          <div class="mr-4 t2 font-weight-bold number text-center">
            {{ index + 1 }}
          </div>
          <LockItem :lockCondition="index === 0" class="company-name">
            <template #locked="{ icon, link, goLogin }">
              <a
                href="#"
                @click.prevent="goLogin"
                :class="link"
                :data-gtm-list="
                  `${leaderBoardNameRef[key].displayName}登入看第一名`
                "
              >
                <i :class="icon" />
                登入看第一名
              </a>
            </template>
            <template #normal>
              <router-link
                :to="{
                  name: 'companyReviews',
                  params: { custno: encodeCustno(item.custno) }
                }"
                :data-gtm-list="
                  `${leaderBoardNameRef[key].displayName}單家公司`
                "
              >
                {{ item.custName }}
              </router-link>
            </template>
          </LockItem>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LockItem from "@/components/LockItem.vue";
import { leaderboardMixins } from "@/mixins/leaderboardMixins";
import {
  LEADER_BOARD_NAME_REF,
  LEADER_BOARD_TYPE,
  LEADER_BOARD_KEY_LIST
} from "@/utils/enum.js";
export default {
  name: "LeaderBoardBlock",
  mixins: [leaderboardMixins],
  props: {
    leaderboardData: {
      type: Object,
      required: true
    }
  },
  components: {
    LockItem
  },
  data() {
    return {
      leaderBoardKeyList: LEADER_BOARD_KEY_LIST,
      leaderBoardNameRef: LEADER_BOARD_NAME_REF,
      leaderBoardTypeRef: LEADER_BOARD_TYPE
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";

$bg-sort: "salary", "company", "workingconditions", "culture",
  "careeropportunite", "workbalance";
$bg-map: (
  salary: 188px #f3f3f3,
  company: 278px #fff4e5,
  workingconditions: 218px #ebf9fa,
  culture: 202px #ebf9fa,
  careeropportunite: 249px #f3f3f3,
  workbalance: 246px #fff4e5
);

.leaderboard {
  flex-basis: calc((100% - 32px) / 3);
  max-width: calc((100% - 32px) / 3);
  background: #fff4e5;
  min-height: 450px;
  color: get-color(text);
  transition: 0.2s;
  background-repeat: no-repeat;
  background-position: center bottom;
  @include support-ie {
    flex-basis: calc((100% - 32px) / 3 - 0.5px);
    max-width: calc((100% - 32px) / 3 - 0.5px);
  }

  @include media-breakpoint-down(sm) {
    flex-basis: 100%;
    max-width: 100%;
  }

  @for $i from 1 through length($bg-sort) {
    $key: nth($bg-sort, $i);
    $config: map-get($bg-map, $key);
    &:nth-child(#{$i}) {
      background-color: nth($config, 2);
      background-image: url("~@/assets/leaderboard/#{$key}.png");
      background-size: nth($config, 1);
    }
  }

  &:hover {
    box-shadow: 0 6px 16px 0 rgba(41, 41, 41, 0.2);
  }

  &:not(:nth-child(3n)) {
    margin-right: 16px;
  }

  a {
    color: currentColor;
    &.leaderboard-see-all,
    &.go-to-login {
      color: get-color(text-info);
    }

    &:hover {
      color: get-color(primary);
    }
  }
  .leaderboard-title {
    color: get-color(text);
  }
  .company-name {
    line-height: 1.75;
    @include truncate-text();
  }

  &-list {
    .number {
      flex: 0 0 11px;
    }
    .company {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #292929;
    }
  }

  @include media-breakpoint-down(sm) {
    width: 100%;
    &:not(:nth-child(3n)) {
      margin-right: 0;
    }
  }
}
</style>
