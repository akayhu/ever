<template>
  <div class="board_compare">
    <!-- 選擇週間 -->
    <div class="board_compare_info week d-flex">
      <div class="board_compare_info_title pr-7">
        廣告區間
      </div>
      <div
        class="board_compare_info_content d-flex flex-wrap align-items-center"
      >
        <div class="duration pr-2">
          <span>{{ selectedDate.start }}</span>
          <span class="mx-2">~</span>
          <span>{{ selectedDate.end }}</span>
        </div>
        <div class="totaldays">
          (共<span class="px-1">{{ getDayStartToEnd }}</span
          >天)
        </div>
      </div>
    </div>
    <!-- 報表標題 -->
    <div
      class="board_compare_table_title d-flex justify-content-between align-items-center"
    >
      <div class="board_compare_table_title_text mr-3">
        <span>數據列表</span>
        <img
          class="ml-3 mb-1"
          src="@/assets/icon/icon-info-warmgray.svg"
          v-tooltip="{
            content: '各版位內全部企業、檔期的數據加總後，依版位排名',
            offset: 5,
            placement: 'right',
            trigger: 'hover'
          }"
        />
      </div>
      <div class="board_compare_table_title_link">
        <img class="pr-1" src="@/assets/icon/icon-download.svg" />
        <a :href="exportReportFileUrl" target="_blank">下載報表</a>
      </div>
    </div>
    <!-- 報表 -->
    <div class="board_compare_table">
      <div class="board_compare_table_header_row">
        <div
          v-for="header in boardTableTitle"
          :key="header.key"
          :class="`board_compare_table_header_content_${header.key}`"
        >
          <div>{{ header.label }}</div>
          <img
            @click="tableData.length > 0 && sortTableData(header.key)"
            class="sort_button ml-1"
            :style="{
              cursor: tableData.length > 0 ? 'pointer' : 'not-allowed'
            }"
            v-show="header.isSortAble"
            src="@/assets/icon/icon-move-top.svg"
          />
        </div>
      </div>
      <template v-if="tableData.length > 0">
        <div
          v-for="(data, index) in tableData"
          :key="index"
          class="board_compare_table_body_row"
        >
          <div class="board_compare_table_body_content_device">
            {{ data.device }}
          </div>
          <div class="board_compare_table_body_content_channel">
            {{ data.channelName }}
          </div>
          <div class="board_compare_table_body_content_board">
            {{ data.boardName }}
          </div>
          <div class="board_compare_table_body_content_impression">
            {{ data.impression | numberCommaFormat }}
          </div>
          <div class="board_compare_table_body_content_click">
            {{ data.click | numberCommaFormat }}
          </div>
          <div class="board_compare_table_body_content_ctr">
            {{ data.ctr }}%
          </div>
        </div>
      </template>
      <div v-else class="board_by_day_compare_table_body_no_result">
        無符合的資料
      </div>
    </div>
    <Pages
      class="mt-6"
      v-bind="pageProp"
      v-if="tableData.length > 0"
      @pageChange="onPageChange"
    />
  </div>
</template>

<script>
import { boardTableTitle } from "@/utils/report/leaderBoard/util";
import Pages from "@/components/Pages.vue";
import { createNamespacedHelpers } from "vuex";
import {
  ACTIONS_TYPE,
  GETTERS_TYPE,
  MUTATIONS_TYPE
} from "@/store/modules/report/leaderBoard";
const {
  mapState,
  mapActions,
  mapGetters,
  mapMutations
} = createNamespacedHelpers("report/leaderBoard");

export default {
  name: "TabBoardCompare",
  data() {
    return {
      boardTableTitle
    };
  },
  components: {
    Pages
  },
  computed: {
    ...mapState({
      tableData: state => state.boardCompare.data,
      currentPage: state => state.boardCompare.page.current,
      totalEl: state => state.boardCompare.page.total,
      tableSort: state => state.boardCompare.filter.sort,
      selectedDate: state => state.selectedDate
    }),
    ...mapGetters({
      getDayStartToEnd: GETTERS_TYPE.GET_DAY_START_TO_END
    }),
    pageProp() {
      const { currentPage, totalEl } = this;
      return {
        reloadPage: false,
        pageData: {
          page: currentPage,
          totalPages: Math.ceil(totalEl / 20),
          totalElements: totalEl
        },
        isUsedEmit: true
      };
    },
    exportReportFileUrl() {
      const domain = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;
      const path = "api/report/file/download/leaderboard/board-compare";
      const query = `
       ?startDate=${encodeURIComponent(this.selectedDate.start)}&
       endDate=${encodeURIComponent(this.selectedDate.end)}
      `.replace(/\s/g, "");
      return domain + path + query;
    }
  },
  methods: {
    ...mapMutations({
      uppdateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING
    }),
    ...mapActions({
      getBoardCompare: ACTIONS_TYPE.GET_BOARD_COMPARE
    }),
    async getData({ page, sortType, sortOrderBy }) {
      this.uppdateIsLoading(true);
      try {
        await this.getBoardCompare({
          page,
          filter: {
            sort: {
              type: sortType,
              orderBy: sortOrderBy
            }
          }
        });
        this.uppdateIsLoading(false);
      } catch (e) {
        console.log(e);
        this.uppdateIsLoading(false);
      }
    },
    async onPageChange({ page }) {
      const {
        tableSort: { type: sortKey, orderBy }
      } = this;
      await this.getData({
        page,
        sortType: sortKey,
        sortOrderBy: orderBy
      });
      this.$nextTick(() => {
        this.$emit("pageChange");
      });
    },
    sortTableData(compareKey) {
      let {
        currentPage: page,
        tableSort: { type: sortKey, orderBy }
      } = this;
      orderBy = sortKey === compareKey && orderBy === "DESC" ? "ASC" : "DESC";
      this.getData({
        page,
        sortType: compareKey,
        sortOrderBy: orderBy
      });
    }
  }
};
</script>

<style lang="scss">
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/report/table";

$table_width_config: (
  device: 86px,
  channel: 180px,
  board: 220px,
  impression: 140px,
  click: 140px,
  ctr: 134px
);

.board_compare {
  .board_compare_info {
    letter-spacing: 1px;
    margin-top: 24px;

    .board_compare_info_title {
      padding-right: 28px;
      box-sizing: content-box;
      @include font-common(16px, $font-weight-bold);
    }

    .board_compare_info_content {
      flex: 1 1 auto;
    }

    .duration {
      @include font-common(16px, $font-weight-normal, $blue-lake);
    }

    .totaldays {
      @include font-common(14px, $font-weight-normal, $gray-700);
      margin-top: -2px;

      > span {
        color: $blue-lake;
      }
    }
  }

  .board_compare_table_title {
    margin-top: 32px;

    .board_compare_table_title_text {
      @include font-common(24px, $font-weight-bold);
    }

    .board_compare_table_title_link {
      @include font-common(16px, $font-weight-bold, $link-color);

      > img {
        transform: translateY(-2px);
      }
    }
  }

  .board_compare_table {
    margin-top: 24px;
    @include table_width($table_width_config);
  }
}
</style>
