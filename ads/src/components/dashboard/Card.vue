<template>
  <div class="card" v-if="data.active">
    <div class="card_header">
      <div class="title_tab" :priority="info.priority.name">
        <Priority
          class="ml-9"
          :priorityObject="info.priority"
          :showText="false"
        />
        <span class="title">{{ info.title }}</span>
      </div>
      <div class="right">
        <span class="total_count">
          <icon iconName="icon-icon-refresh" @click.native="reload" />
          共 {{ data.totalElements }} 筆
        </span>
      </div>
    </div>
    <div class="card_content">
      <div class="header">
        <div
          v-for="header in info.tableHeader"
          :key="header.key"
          :class="`header_${header.key}`"
        >
          {{ header.label }}
        </div>
      </div>
      <div class="body">
        <fragment v-if="!isReloading">
          <div class="item" v-for="item in data.loadedContents" :key="item.id">
            <div class="body_name">
              <router-link
                :to="item.link"
                target="_blank"
                v-tooltip="{
                  content: `${item.device}/${item.channelName}/${item.boardName}`,
                  placement: 'bottom-start',
                  trigger: 'hover'
                }"
                >{{ `${item.device}/${item.channelName}/${item.boardName}` }}
              </router-link>
            </div>
            <div class="body_start_date">{{ item.startDate }}</div>
            <div class="body_end_date">{{ item.endDate }}</div>
            <div class="body_other">{{ item.daysDiff }}</div>
          </div>
          <span
            v-if="data.loadedContents.length > 5 && !data.last"
            class="loading_wrapper"
            :class="{ loading: isLoadingMore }"
          >
            <InfiniteLoading
              @intersect="intersected"
              :isLoading="isLoadingMore"
            />
          </span>
        </fragment>
        <div class="h-100" v-else><Loading size="24" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import InfiniteLoading from "@/components/InfiniteLoading.vue";
import Priority from "@/components/dashboard/Priority.vue";
import { mapGetters } from "vuex";

export default {
  name: "Card",
  components: {
    Loading,
    InfiniteLoading,
    Priority
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters("dashboard", ["getData"]),
    data() {
      return this.getData[this.info.stateName];
    }
  },
  data() {
    return {
      isReloading: false,
      isLoadingMore: false,
      query: {
        page: 1,
        size: 10,
        stateName: this.info.stateName
      }
    };
  },
  // async mounted() {
  // this.isReloading = true;
  // await this.info.action(this.query);
  // this.isReloading = false;
  // },
  methods: {
    async intersected() {
      if (this.data.page >= this.data.totalPages) return;

      this.isLoadingMore = true;
      this.query.page++;
      await this.info.action(this.query);
      this.isLoadingMore = false;
    },
    async reload() {
      if (!this.info.action) return;

      this.isReloading = true;
      await this.info.action(this.query);
      this.isReloading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

@mixin table_width($table_config) {
  @each $name, $width in $table_config {
    div[class*="_#{$name}"] {
      width: $width;
    }
  }
}

$table_width_config: (
  name: 230px,
  start_date: 144px,
  end_date: 144px,
  other: 38px
);

$priority-colors: (
  "high": #fc6a7b,
  "medium": #9ad600,
  "low": #4f9afa
);

.card {
  padding: 0 24px 24px 0;
  border-radius: 8px;
  border: 1px solid #e2e1e1;
  background-color: #fff;

  min-width: 628px;
  max-width: 1280px;
  flex-grow: 1;
  @include table_width($table_width_config);

  .card_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .title_tab {
      border-right: 1px solid #ddd;
      border-radius: 6px 6px 0 0;
      height: 60px;
      display: flex;
      align-items: center;
      position: relative;

      @each $color, $value in $priority-colors {
        &[priority="#{$color}"] {
          border-top: 5px solid #{$value};
        }
      }

      .title {
        @include font-common(18px, $font-weight-bold);
        padding-right: 32px;
        padding-left: 4px;
      }
    }

    .priority {
      display: flex;
      align-items: center;
      @include font-common(14px, $font-weight-normal, $gray-700);

      img {
        margin-right: 4px;
      }
    }

    .total_count {
      img {
        cursor: pointer;
      }
    }
  }

  .card_content {
    padding-left: 24px;

    .header {
      @include font-common(16px, $font-weight-bold, $black);
      border-bottom: solid 1px $border-color;
      padding-bottom: 4px;
      padding-left: 10px;
      display: flex;
      align-items: center;

      .header_other {
        flex-grow: 1;
      }
    }

    .body {
      height: 241px;
      overflow-y: auto;
      border-bottom: 1px solid $gray-400;

      &::-webkit-scrollbar {
        width: 12px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $gray-500;
        border-radius: 10px;
        background-clip: padding-box;
        border: 4px solid $white;
      }
      &::-webkit-scrollbar-button {
        display: none;
      }

      .item {
        padding-left: 10px;
        display: flex;
        align-items: center;
        height: 48px;

        border-bottom: 1px solid $gray-400;

        &:hover {
          background-color: $blue-lake-light;
        }

        .body_name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          padding-right: 10px;

          a {
            display: inline;
            margin-left: 4px;

            &:visited {
              color: #4e91ff;
            }
          }

          span {
            width: 24px;
            display: inline-block;
          }
        }
      }
    }

    .loading_wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      &.loading {
        height: 48px;
      }
    }
  }
}
</style>
