<template>
  <div class="board_by_day_compare">
    <!-- 選擇週間 -->
    <div class="board_by_day_compare_info week d-flex">
      <div class="board_by_day_compare_info_title pr-7">
        廣告區間
      </div>
      <div
        class="board_by_day_compare_info_content d-flex flex-wrap align-items-center"
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
    <!-- 廣告版位 -->
    <div class="board_by_day_compare_info board d-flex">
      <div class="board_by_day_compare_info_title">
        廣告版位
      </div>
      <div class="board_by_day_compare_info_content d-flex flex-wrap">
        <Tag
          class="mr-1 mb-2"
          v-for="board in selectedBoard"
          :key="board.id"
          :tagData="board"
          :content="board.name"
          :isActive="board.id === filterBoard.id"
          @onTagClick="setBoardId($event)"
        />
      </div>
    </div>
    <div
      class="board_by_day_compare_tip_warning align-items-center"
      v-show="isFilterBoardApp"
    >
      <span>移動滑鼠游標至</span>
      <span />
      <span>與各數值，可顯示來源OS</span>
    </div>
    <!-- 總數據 -->
    <div class="board_by_day_compare_summary d-flex">
      <div class="board_by_day_compare_summary_block">
        <div class="board_by_day_compare_summary_block_text">IMP</div>
        <div
          class="board_by_day_compare_summary_block_num position-relative"
          v-on="bindTotalImpressionEvt"
        >
          {{ totalImpression | numberCommaFormat }}
          <span
            class="tool_tip"
            v-show="isFilterBoardApp"
            v-tooltip="{
              html: true,
              content: sourcePanelHtml(
                totalSources,
                'impression',
                isFilterBoardApp
              ),
              placement: 'right-start',
              trigger: 'manual',
              show: isTotalImpressionToolTipShow,
              classes: 'light',
              offset: 3
            }"
          />
        </div>
      </div>
      <div class="board_by_day_compare_summary_block">
        <div class="board_by_day_compare_summary_block_text">Click</div>
        <div
          class="board_by_day_compare_summary_block_num position-relative"
          v-on="bindTotalClickEvt"
        >
          {{ totalClick | numberCommaFormat }}
          <span
            class="tool_tip"
            v-show="isFilterBoardApp"
            v-tooltip="{
              html: true,
              content: sourcePanelHtml(totalSources, 'click', isFilterBoardApp),
              placement: 'right-start',
              trigger: 'manual',
              show: isTotalClickToolTipShow,
              classes: 'light',
              offset: 3
            }"
          />
        </div>
      </div>
      <div class="board_by_day_compare_summary_block">
        <div class="board_by_day_compare_summary_block_text">CTR</div>
        <div
          class="board_by_day_compare_summary_block_num position-relative"
          v-on="bindTotalCtrEvt"
        >
          <span>{{ totalCtr }}</span>
          <span class="number_affix ml-1">％</span>
          <span
            class="tool_tip"
            v-show="isFilterBoardApp"
            v-tooltip="{
              html: true,
              content: sourcePanelHtml(totalSources, 'ctr', isFilterBoardApp),
              placement: 'right-start',
              trigger: 'manual',
              show: isTotalCtrToolTipShow,
              classes: 'light',
              offset: 3
            }"
          />
        </div>
      </div>
    </div>
    <!-- 報表標題 -->
    <div
      class="board_by_day_compare_table_title d-flex justify-content-between align-items-center"
    >
      <div class="board_by_day_compare_table_title_text mr-3">
        <span>數據列表</span>
        <icon
          class="ml-3 mb-1"
          iconName="icon-info-warmgray"
          size="16"
          v-tooltip="{
            content: '單一版位每日的數據',
            offset: 5,
            placement: 'right',
            trigger: 'hover'
          }"
        />
      </div>
      <div class="board_by_day_compare_table_title_link">
        <icon class="pr-1" iconName="icon-download" />
        <a :href="exportReportFileUrl" target="_blank">下載報表</a>
      </div>
    </div>
    <!-- 報表 -->
    <div class="board_by_day_compare_table">
      <div class="board_by_day_compare_table_header_row">
        <div
          v-for="header in boardByDayTableTitle"
          :key="header.key"
          :class="`board_by_day_compare_table_header_content_${header.key}`"
        >
          <div>{{ header.label }}</div>
          <icon
            @click.native="sortTableData(header.key)"
            class="sort_button ml-1"
            v-show="header.isSortAble"
            iconName="icon-move-top"
            size="17"
          />
          <img
            class="sort_button ml-1"
            v-show="header.isWarmShow"
            v-tooltip="{
              offset: 5,
              content: header.warmText,
              placement: 'right',
              trigger: 'hover'
            }"
            src="@/assets/icon/icon-info-warmgray.svg"
          />
        </div>
      </div>
      <template v-if="tableData.length > 0">
        <div
          v-for="(data, index) in tableData"
          :key="index"
          class="board_by_day_compare_table_body_row"
        >
          <div class="board_by_day_compare_table_body_content_date">
            {{ data.date }}
          </div>
          <div class="board_by_day_compare_table_body_content_impression">
            <span
              class="position-relative"
              v-tooltip="{
                html: true,
                content: sourcePanelHtml(
                  data.sources,
                  'impression',
                  isFilterBoardApp
                ),
                placement: 'right-start',
                trigger: 'hover',
                classes: 'light',
                offset: 10
              }"
            >
              {{ data.impression | numberCommaFormat }}
              <span class="tool_tip" v-show="isFilterBoardApp" />
            </span>
          </div>
          <div class="board_by_day_compare_table_body_content_click">
            <span
              class="position-relative"
              v-tooltip="{
                html: true,
                content: sourcePanelHtml(
                  data.sources,
                  'click',
                  isFilterBoardApp
                ),
                placement: 'right-start',
                trigger: 'hover',
                classes: 'light',
                offset: 10
              }"
            >
              {{ data.click | numberCommaFormat }}
              <span class="tool_tip" v-show="isFilterBoardApp" />
            </span>
          </div>
          <div class="board_by_day_compare_table_body_content_ctr">
            <span
              class="position-relative"
              v-tooltip="{
                html: true,
                content: sourcePanelHtml(data.sources, 'ctr', isFilterBoardApp),
                placement: 'right-start',
                trigger: 'hover',
                classes: 'light',
                offset: 10
              }"
            >
              {{ data.ctr }}%
              <span class="tool_tip" v-show="isFilterBoardApp" />
            </span>
          </div>
        </div>
      </template>
      <div v-else class="board_by_day_compare_table_body_no_result">
        無符合的資料
      </div>
    </div>
    <Pages
      class="mt-10"
      v-if="tableData.length > 0"
      v-bind="pageProp"
      @pageChange="onPageChange"
    />
  </div>
</template>

<script>
import { boardByDayTableTitle } from "@/utils/report/leaderBoard/util";
import Pages from "@/components/Pages.vue";
import Tag from "@/components/share/Tag.vue";
import { createNamespacedHelpers } from "vuex";
const {
  mapState,
  mapActions,
  mapGetters,
  mapMutations
} = createNamespacedHelpers("report/leaderBoard");
import {
  ACTIONS_TYPE,
  GETTERS_TYPE,
  MUTATIONS_TYPE
} from "@/store/modules/report/leaderBoard";
import androidSvg from "@/assets/icon/icon-move-android.svg";
import iosSvg from "@/assets/icon/icon-move-ios.svg";

const sourcePanelTemplate = (android, ios, type) => {
  return `<div class="source_panel">
         <ul class="p-0">
           <li class="mb-1">
             <img class="mr-1" src=${androidSvg}>
             ${
               android
                 ? `<span>${android}${type === "ctr" ? "%" : ""}</span>`
                 : `<span class="no_value"><span></span> <span></span></span>`
             }
           </li>
           <li>
             <img class="mr-1" src="${iosSvg}">
             ${
               ios
                 ? `<span>${ios}${type === "ctr" ? "%" : ""}</span>`
                 : `<span class="no_value"><span></span> <span></span></span>`
             }
           </li>
         </ul>
      </div>`;
};

const sourcePanelHtml = (source, type, isShow) => {
  if (!isShow) return "";
  if (Array.isArray(source) && source.length >= 1) {
    const android =
      source[0] && source[0].source === "android"
        ? source[0][type]
        : source[1] && source[1].source === "android"
        ? source[1][type]
        : "";
    const ios =
      source[0] && source[0].source === "ios"
        ? source[0][type]
        : source[1] && source[1].source === "ios"
        ? source[1][type]
        : "";
    return sourcePanelTemplate(android, ios, type);
  } else {
    return sourcePanelTemplate(null, null, type);
  }
};

export default {
  name: "TabBoardByDayCompare",
  data() {
    return {
      boardByDayTableTitle,
      isTotalImpressionToolTipShow: false,
      isTotalClickToolTipShow: false,
      isTotalCtrToolTipShow: false
    };
  },
  components: {
    Pages,
    Tag
  },
  computed: {
    ...mapState({
      tableData: state => state.boardByDayCompare.data,
      currentPage: state => state.boardByDayCompare.page.current,
      totalEl: state => state.boardByDayCompare.page.total,
      filterBoard: state => state.boardByDayCompare.filter.board,
      selectedBoard: state => state.selectedBoard,
      selectedDate: state => state.selectedDate,
      totalImpression: state => state.boardByDayCompare.summary.impression,
      totalClick: state => state.boardByDayCompare.summary.click,
      totalCtr: state => state.boardByDayCompare.summary.ctr,
      totalSources: state => state.boardByDayCompare.summary.sources
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
    isFilterBoardApp() {
      return this.filterBoard.device === "APP";
    },
    exportReportFileUrl() {
      const domain = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;
      const path = "api/report/file/download/leaderboard/board-daily-compare";
      const query = `
       ?startDate=${encodeURIComponent(this.selectedDate.start)}&
       endDate=${encodeURIComponent(this.selectedDate.end)}&
       boardIds=${encodeURIComponent(this.filterBoard.id)}
      `.replace(/\s/g, "");
      return domain + path + query;
    },
    bindTotalImpressionEvt() {
      if (this.isFilterBoardApp) {
        return {
          mouseenter: () => (this.isTotalImpressionToolTipShow = true),
          mouseleave: () => (this.isTotalImpressionToolTipShow = false)
        };
      } else {
        return {};
      }
    },
    bindTotalClickEvt() {
      if (this.isFilterBoardApp) {
        return {
          mouseenter: () => (this.isTotalClickToolTipShow = true),
          mouseleave: () => (this.isTotalClickToolTipShow = false)
        };
      } else {
        return {};
      }
    },
    bindTotalCtrEvt() {
      if (this.isFilterBoardApp) {
        return {
          mouseenter: () => (this.isTotalCtrToolTipShow = true),
          mouseleave: () => (this.isTotalCtrToolTipShow = false)
        };
      } else {
        return {};
      }
    }
  },
  methods: {
    ...mapMutations({
      uppdateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING
    }),
    ...mapActions({
      getBoardByDayCompare: ACTIONS_TYPE.GET_BOARD_BY_DAY_COMPARE,
      getBoardByDayCompareSummary: ACTIONS_TYPE.GET_BOARD_BY_DAY_COMPARE_SUMMARY
    }),
    async getData({ page, boardId, device }) {
      this.uppdateIsLoading(true);
      try {
        await this.getBoardByDayCompareSummary({
          filter: {
            board: {
              id: boardId
            }
          }
        });
        await this.getBoardByDayCompare({
          page,
          filter: {
            board: {
              id: boardId,
              device
            }
          }
        });
        this.uppdateIsLoading(false);
      } catch (e) {
        console.log(e);
        this.uppdateIsLoading(false);
      }
    },
    setBoardId({ id, device }) {
      this.getData({
        page: 1,
        boardId: id,
        device
      });
    },
    async onPageChange({ page }) {
      this.uppdateIsLoading(true);
      try {
        await this.getBoardByDayCompare({
          page,
          filter: {
            board: {
              id: this.filterBoard.id,
              device: this.filterBoard.device
            }
          }
        });
        this.uppdateIsLoading(false);
        this.$nextTick(() => {
          this.$emit("pageChange");
        });
      } catch (e) {
        console.log(e);
        this.uppdateIsLoading(false);
      }
    },
    sourcePanelHtml
  }
};
</script>

<style lang="scss">
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/report/table";

.tool_tip {
  position: absolute;
  width: 0;
  height: 0;

  &::before {
    display: inline-block;
    position: absolute;
    content: "";
    bottom: -3px;
    left: -4px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 0 4px 4px;
    border-color: transparent transparent transparent $gray-700;
  }
}

$table_width_config: (
  date: 300px,
  impression: 200px,
  click: 200px,
  ctr: 200px
);

.board_by_day_compare {
  .board_by_day_compare_info {
    letter-spacing: 1;
    margin-top: 20px;

    .board_by_day_compare_info_title {
      padding-right: 28px;
      padding-top: 3px;
      box-sizing: content-box;
      @include font-common(16px, $font-weight-bold);
    }

    .board_by_day_compare_info_content {
      flex: 1 1 auto;

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
  }

  .board_by_day_compare_tip_warning {
    display: flex;
    margin-top: 22px;
    @include font-common(14px, $font-weight-normal, $gray-700);

    > span:nth-child(2) {
      width: 16px;
      height: 16px;
      display: inline-block;
      position: relative;

      &::before {
        display: inline-block;
        position: absolute;
        content: "";
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 4px 0 4px 4px;
        border-color: transparent transparent transparent $gray-700;
      }
    }
  }

  .board_by_day_compare_summary {
    margin-top: 12px;

    > div + div {
      border-left: 1px solid $gray-200;
    }

    .board_by_day_compare_summary_block {
      padding: 0 40px 10px 40px;

      &:first-child {
        padding-left: 20px;
      }

      .board_by_day_compare_summary_block_text {
        @include font-common(16px, $font-weight-normal);
        padding-bottom: 10px;
      }

      .board_by_day_compare_summary_block_num {
        @include font-common(28px, $font-weight-normal, $blue-lake);
      }
    }

    .tool_tip {
      bottom: 13px;
      right: -8px;
    }
  }

  .board_by_day_compare_table_title {
    margin-top: 42px;

    .board_by_day_compare_table_title_text {
      @include font-common(24px, $font-weight-bold);
    }

    .board_by_day_compare_table_title_link {
      @include font-common(16px, $font-weight-bold, $link-color);

      > img {
        transform: translateY(-2px);
      }
    }
  }

  .board_by_day_compare_table {
    margin-top: 24px;
    @include table_width($table_width_config);

    .tool_tip {
      right: -7px;
      bottom: 6px;
    }
  }
}
</style>
