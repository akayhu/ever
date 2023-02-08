<template>
  <div class="material_compare">
    <div class="date_switch">
      <span
        @click="changeDate('week')"
        :class="{ focus: dateSwitch === 'week' }"
      >
        週
      </span>
      <span @click="changeDate('day')" :class="{ focus: dateSwitch === 'day' }">
        日
      </span>
    </div>
    <!-- 選擇週間 -->
    <div class="material_compare_info week d-flex">
      <div class="material_compare_info_title pr-7 pt-2">
        選擇週間
      </div>
      <div class="material_compare_info_content">
        <div class="d-flex align-items-center">
          <el-select
            v-model="selectDateAllWeeksValue"
            placeholder="請選擇"
            @change="handleChangeWeek($event)"
          >
            <el-option
              v-for="(item, index) in weekStartToEnd"
              :key="index"
              :label="`週 ${item.start} ~ ${item.end}`"
              :value="index"
            >
            </el-option>
          </el-select>
          <div class="control_warning pr-3">
            <icon
              iconName="icon-info-warmgray"
              size="16"
              v-tooltip="{
                offset: 5,
                content: '時間可依週切換',
                placement: 'right',
                trigger: 'hover'
              }"
            />
          </div>
          <div v-if="dateSwitch === 'week'" class="d-flex align-items-center">
            <div class="duration pr-2">
              <span>{{ currentWeek.start }}</span>
              <span class="mx-2">~</span>
              <span>{{ currentWeek.end }}</span>
            </div>
            <div class="total_week pr-2">
              共
              <span>{{ weekStartToEnd.length }}</span>
              週
            </div>
            <div class="control_week pr-2">
              <button
                class="bg-transparent border-0 p-0"
                :style="{
                  cursor:
                    weekIndex === weekStartToEnd.length - 1
                      ? 'not-allowed'
                      : 'pointer'
                }"
                :disabled="weekIndex === weekStartToEnd.length - 1"
                @click="
                  weekIndex === weekStartToEnd.length - 1 ||
                    toggleWeek(weekIndex + 1)
                "
              >
                <icon
                  iconName="icon-arrow-left"
                  :disabled="weekIndex === weekStartToEnd.length - 1"
                />
              </button>
              <button
                class="bg-transparent border-0 p-0"
                :style="{ cursor: weekIndex === 0 ? 'not-allowed' : 'pointer' }"
                :disabled="weekIndex === 0"
                @click="weekIndex === 0 || toggleWeek(weekIndex - 1)"
              >
                <icon iconName="icon-arrow-right" :disabled="weekIndex === 0" />
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="dateSwitch === 'day'"
          class="d-flex flex-wrap align-items-center mt-3"
        >
          <div class="duration days pr-2">
            <span v-for="(item, index) in dayArray" :key="index">
              <span
                @click="changeDayDate(index)"
                :class="{ focus: item.startEndDate === focusDayDate }"
                >{{ `${item.startEndDate.substr(5, 5)}` }}</span
              >
              <span v-if="index !== 6" class="comma">、</span>
            </span>
          </div>
          <div class="total_week pr-2">
            共
            <span>{{ weekStartToEnd.length }}</span>
            週
          </div>
          <div class="control_week pr-2">
            <button
              class="bg-transparent border-0 p-0"
              :style="{
                cursor:
                  weekIndex === weekStartToEnd.length - 1
                    ? 'not-allowed'
                    : 'pointer'
              }"
              :disabled="weekIndex === weekStartToEnd.length - 1"
              @click="
                weekIndex === weekStartToEnd.length - 1 ||
                  toggleWeek(weekIndex + 1)
              "
            >
              <icon
                iconName="icon-arrow-left"
                :disabled="weekIndex === weekStartToEnd.length - 1"
              />
            </button>
            <button
              class="bg-transparent border-0 p-0"
              :style="{ cursor: weekIndex === 0 ? 'not-allowed' : 'pointer' }"
              :disabled="weekIndex === 0"
              @click="weekIndex === 0 || toggleWeek(weekIndex - 1)"
            >
              <icon iconName="icon-arrow-right" :disabled="weekIndex === 0" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 廣告版位 -->
    <div class="material_compare_info board d-flex">
      <div class="material_compare_info_title">
        廣告版位
      </div>
      <div class="material_compare_info_content d-flex flex-wrap">
        <Tag
          class="mr-1 mb-2"
          v-for="board in selectedBoard"
          :key="board.id"
          :content="board.name"
          :isDisable="true"
        />
      </div>
    </div>
    <!-- 刊登企業 -->
    <div class="material_compare_info company d-flex">
      <div class="material_compare_info_title">
        刊登企業
      </div>
      <div class="material_compare_info_content d-flex flex-wrap">
        <template v-if="selectedCompany.length > 0">
          <Tag
            class="mr-1 mb-2"
            v-for="company in selectedCompany"
            :key="company.id"
            :content="company.name"
            :isDisable="true"
          />
        </template>
        <p class="m-0" v-else>ALL</p>
      </div>
    </div>
    <!-- 報表標題 -->
    <div
      class="material_compare_table_title d-flex justify-content-between align-items-center"
    >
      <div
        class="material_compare_table_title_wrapper d-flex align-items-center"
      >
        <div class="material_compare_table_title_text mr-3">
          <span>數據列表</span>
          <icon
            class="ml-3 mb-1"
            iconName="icon-info-warmgray"
            size="16"
            v-tooltip="{
              content:
                '特定時段內，比較所篩選的版位、企業，以素材為單位依據數據高至低排名',
              offset: 5,
              placement: 'right',
              trigger: 'hover'
            }"
          />
        </div>
        <div
          v-for="item in iconList"
          :key="item.text"
          class="material_compare_table_title_example mr-2"
        >
          <img class="mr-1" :src="item.icon" />
          <span>{{ item.text }}</span>
        </div>
      </div>
      <div class="material_compare_table_title_link">
        <icon class="pr-1" iconName="icon-download" />
        <a :href="exportReportFileUrl" target="_blank">下載報表</a>
      </div>
    </div>
    <!-- 報表 -->
    <div
      class="material_compare_table"
      :class="{ withDays: dateSwitch === 'week' }"
    >
      <div class="material_compare_table_header_row">
        <fragment v-for="header in materialTableTitle" :key="header.key">
          <div
            v-if="
              header.label !== '統計天數' ||
                (header.label === '統計天數' && dateSwitch === 'week')
            "
            :class="`material_compare_table_header_content_${header.key}`"
          >
            <div>{{ header.label }}</div>
            <icon
              @click.native="
                formatTableData.length > 0 && sortTableData(header.key)
              "
              class="sort_button ml-1"
              :style="{
                cursor: formatTableData.length > 0 ? 'pointer' : 'not-allowed'
              }"
              v-show="header.isSortAble"
              iconName="icon-move-top"
              size="16"
            />
            <icon
              class="sort_button ml-1"
              v-show="header.isWarmShow"
              v-tooltip="{
                offset: 5,
                content: header.warmText,
                placement: 'right',
                trigger: 'hover'
              }"
              iconName="icon-info-warmgray"
              size="16"
            />
          </div>
        </fragment>
      </div>
      <template v-if="formatTableData.length > 0">
        <div
          v-for="(data, index) in formatTableData"
          :key="index"
          class="material_compare_table_body_row"
        >
          <div class="material_compare_table_body_content_material">
            <icon
              @click.native.prevent="
                openPreviewMaterial(
                  data.materialId,
                  data.typeId,
                  data.startDate,
                  data.boardId
                )
              "
              v-tooltip="{
                offset: 0,
                content: data.materialTitle,
                placement: 'bottom-start',
                trigger: 'hover'
              }"
              iconName="demo-icon-p"
              size="16"
            />
            <span
              v-tooltip="{
                offset: 0,
                content: data.materialTitle,
                placement: 'bottom-start',
                trigger: 'hover'
              }"
              @click.prevent="
                openPreviewMaterial(
                  data.materialId,
                  data.typeId,
                  data.startDate,
                  data.boardId
                )
              "
            >
              {{ data.materialTitle }}
            </span>
          </div>
          <div class="material_compare_table_body_content_company">
            <span
              v-tooltip="{
                offset: 5,
                content: data.customerName,
                placement: 'bottom-start',
                trigger: 'hover'
              }"
            >
              {{ data.customerName }}
            </span>
          </div>
          <div class="material_compare_table_body_content_board">
            <span
              v-tooltip="{
                offset: 5,
                content: `${data.device}/${data.channelName}/${data.boardName}`,
                placement: 'bottom-start',
                trigger: 'hover'
              }"
            >
              {{ data.boardName }}
            </span>
          </div>
          <div class="material_compare_table_body_content_duration">
            <div>
              <span class="startDate">
                {{ data.startMonthAndDate }} {{ data.startHourAndMin }}
              </span>
              <span>~</span>
              <span class="endDate d-block">
                {{ data.endtMonthAndDate }} {{ data.endHourAndMin }}
              </span>
            </div>
          </div>
          <div
            v-if="dateSwitch === 'week'"
            class="material_compare_table_body_content_days"
          >
            {{ data.days | numberCommaFormat }}
          </div>
          <div class="material_compare_table_body_content_impression">
            {{ data.impression | numberCommaFormat }}
          </div>
          <div class="material_compare_table_body_content_click">
            {{ data.click | numberCommaFormat }}
          </div>
          <div class="material_compare_table_body_content_ctr">
            {{ data.ctr }}%
          </div>
          <div class="material_compare_table_body_content_r1">
            <!-- {{ data.r1 }}% -->
            <span></span>
            <span></span>
          </div>
          <div class="material_compare_table_body_content_r2">
            <!-- {{ data.r2 }}% -->
            <span></span>
            <span></span>
          </div>
          <div
            class="material_compare_table_body_content_psnotes"
            :class="{ multi: data.prList.length > 1 }"
          >
            <div v-for="(itemSrc, index) in data.prList" :key="index">
              <img :src="itemSrc" />
            </div>
          </div>
        </div>
      </template>
      <div v-else class="board_by_day_compare_table_body_no_result">
        無符合的資料
      </div>
    </div>
    <Pages
      class="mt-10"
      v-if="formatTableData.length > 0"
      v-bind="pageProp"
      @pageChange="onPageChange"
    />
    <PreviewPopup
      v-model="showPreviewPopup"
      :hasTitle="false"
      :materialId="previewMaterialId"
      apiPath="material"
      :boardInfo="materialType"
    />
  </div>
</template>

<script>
import { materialTableTitle, iconList } from "@/utils/report/leaderBoard/util";
import Pages from "@/components/Pages.vue";
import Tag from "@/components/share/Tag.vue";
import { createNamespacedHelpers } from "vuex";
import moment from "moment";
import PreviewPopup from "@/components/preview/PreviewPopup.vue";
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
import { ACTIONS_TYPE as UPLPAD_MATERIAL_ACTIONS_TYPE } from "@/store/share/uploadMaterial/actions";

export default {
  name: "TabMaterialCompare",
  data() {
    return {
      iconList,
      weekIndex: 0,
      materialTableTitle,
      dayArray: [],
      focusDayDate: "",
      dateSwitch: "week",
      selectDateAllWeeksValue: 0,
      showPreviewPopup: false,
      previewMaterialId: null
    };
  },
  components: {
    Pages,
    Tag,
    PreviewPopup
  },
  mounted() {
    this.changeDate("week");
  },
  computed: {
    ...mapState({
      tableData: state => state.materialCompare.data,
      currentPage: state => state.materialCompare.page.current,
      totalEl: state => state.materialCompare.page.total,
      tableSort: state => state.materialCompare.filter.sort,
      duration: state => state.materialCompare.filter.duration,
      selectedDate: state => state.selectedDate,
      selectedBoard: state => state.selectedBoard,
      selectedCompany: state => state.selectedCompany,
      materialType: state => state.materialType
    }),
    ...mapGetters({
      weekStartToEnd: GETTERS_TYPE.GET_WEEK_START_TO_END_REVERSE
    }),
    formatTableData() {
      return this.tableData.map(item => {
        return {
          ...item,
          startMonthAndDate: this.formatDate(item.startDate),
          endtMonthAndDate: this.formatDate(item.endDate),
          startHourAndMin: this.formatHour(item.startDate),
          endHourAndMin: this.formatHour(item.endDate),
          prList: this.getPrType(
            item.freeProjectCount,
            item.giveawayCount,
            item.usageCount,
            item.offCount
          )
        };
      });
    },
    currentWeek() {
      return this.weekStartToEnd[this.weekIndex];
    },
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
    boardIds() {
      return this.selectedBoard.map(board => board.id).join();
    },
    customerIds() {
      return this.selectedCompany.map(company => company.id).join();
    },
    exportReportFileUrl() {
      const {
        dateSwitch,
        weekStartToEnd,
        selectDateAllWeeksValue,
        focusDayDate
      } = this;
      const domain = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;
      const path = "api/report/file/download/leaderboard/material-compare";
      const startDay =
        dateSwitch === "week"
          ? weekStartToEnd[selectDateAllWeeksValue].start
          : focusDayDate;
      const endDay =
        dateSwitch === "week"
          ? weekStartToEnd[selectDateAllWeeksValue].end
          : focusDayDate;
      const query = `
       ?startDate=${encodeURIComponent(startDay)}&
       endDate=${encodeURIComponent(endDay)}&
       boardIds=${this.boardIds}&
       customerIds=${this.customerIds}
      `.replace(/\s/g, "");
      return domain + path + query;
    }
  },
  watch: {
    weekStartToEnd() {
      const { changeDate, dateSwitch } = this;
      this.weekIndex = 0;
      this.selectDateAllWeeksValue = 0;
      changeDate(dateSwitch);
    }
  },
  methods: {
    ...mapMutations({
      uppdateIsLoading: MUTATIONS_TYPE.UPDATE_ISLOADING
    }),
    ...mapActions({
      getMaterialCompare: ACTIONS_TYPE.GET_MATERIAL_COMPARE,
      getMaterialType: UPLPAD_MATERIAL_ACTIONS_TYPE.GET_MATERIAL_TYPE
    }),
    toggleWeek(index) {
      const { changeDate, dateSwitch, setSelectedWeek, weekStartToEnd } = this;
      this.weekIndex = index;
      this.selectDateAllWeeksValue = index;
      changeDate(dateSwitch);
      setSelectedWeek(weekStartToEnd[this.weekIndex]);
    },
    async getData({ page, sortType, sortOrderBy, startDate, endDate }) {
      this.uppdateIsLoading(true);
      try {
        await this.getMaterialCompare({
          page,
          filter: {
            sort: {
              type: sortType,
              orderBy: sortOrderBy
            },
            duration: {
              start: startDate,
              end: endDate
            }
          }
        });
        this.uppdateIsLoading(false);
      } catch (e) {
        console.log(e);
        this.uppdateIsLoading(false);
      }
    },
    sortTableData(compareKey) {
      let {
        currentPage: page,
        tableSort: { type: sortKey, orderBy },
        duration
      } = this;
      this.getData({
        page,
        sortType: compareKey,
        sortOrderBy:
          sortKey === compareKey && orderBy === "DESC" ? "ASC" : "DESC",
        startDate: duration.start,
        endDate: duration.end
      });
    },
    setSelectedWeek({ start, end }) {
      this.getData({
        page: 1,
        sortType: "impression",
        sortOrderBy: "DESC",
        startDate: start,
        endDate: end
      });
    },
    async onPageChange({ page }) {
      await this.getData({
        page,
        sortType: this.tableSort.type,
        sortOrderBy: this.tableSort.orderBy,
        startDate: this.duration.start,
        endDate: this.duration.end
      });
      this.$nextTick(() => {
        this.$emit("pageChange");
      });
    },
    formatDate(time) {
      const [year, month, date, hour] = time.split("/");
      return month + "/" + date;
      console.log(year, hour);
    },
    formatHour(time) {
      const [year, month, date, hour] = time.split("/");
      return hour;
      console.log(year, month, date);
    },
    getPrType(freeProjectCount, giveawayCount, usageCount, offCount) {
      const ary = [];
      if (freeProjectCount > 0) ary.push(this.iconList[0].icon);
      if (giveawayCount > 0) ary.push(this.iconList[1].icon);
      if (usageCount > 0) ary.push(this.iconList[2].icon);
      if (offCount > 0) ary.push(this.iconList[3].icon);
      return ary;
    },
    openPreviewMaterial(materialId, typeId, date, boardId) {
      this.getMaterialType({
        typeId,
        boardId
      }).then(() => {
        this.previewMaterialId = materialId;
        this.showPreviewPopup = true;
      });
    },
    // 切換週或日
    changeDate(type) {
      const { selectDateAllWeeksValue, getData } = this;
      this.dateSwitch = type;
      this.dayArray = [];
      if (type === "day") {
        let addDay = this.weekStartToEnd[selectDateAllWeeksValue].start;
        this.dayArray.push({
          startEndDate: this.weekStartToEnd[selectDateAllWeeksValue].start
        });
        for (let i = 0; i < 6; i++) {
          addDay = moment(addDay)
            .add(1, "days")
            .format("YYYY/MM/DD");
          this.dayArray.push({ startEndDate: addDay });
        }
        this.focusDayDate = this.dayArray[0].startEndDate;
        getData({
          page: 1,
          sortType: "impression",
          sortOrderBy: "DESC",
          startDate: this.focusDayDate,
          endDate: this.focusDayDate
        });
        return;
      }

      getData({
        page: 1,
        sortType: "impression",
        sortOrderBy: "DESC",
        startDate: this.weekStartToEnd[selectDateAllWeeksValue].start,
        endDate: this.weekStartToEnd[selectDateAllWeeksValue].end
      });
    },
    // 選擇週間下拉
    handleChangeWeek() {
      this.weekIndex = this.selectDateAllWeeksValue;
      this.changeDate(this.dateSwitch);
    },
    // 選單日日期
    changeDayDate(index) {
      this.focusDayDate = this.dayArray[index].startEndDate;
      this.getData({
        page: 1,
        sortType: "impression",
        sortOrderBy: "DESC",
        startDate: this.focusDayDate,
        endDate: this.focusDayDate
      });
    }
  }
};
</script>

<style>
.material_compare_info_content .el-select {
  width: 290px;
  margin-right: 12px;
}
</style>
<style lang="scss">
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/report/table";

$table_width_config: (
  material: 211px,
  company: 144px,
  board: 144px,
  duration: 131px,
  days: 0px,
  impression: 94px,
  click: 94px,
  ctr: 98px,
  r1: 98px,
  r2: 98px,
  psnotes: 68px
);

$table_width_with_days_config: (
  material: 177px,
  company: 127px,
  board: 127px,
  duration: 143px,
  days: 56px,
  impression: 94px,
  click: 94px,
  ctr: 98px,
  r1: 98px,
  r2: 98px,
  psnotes: 68px
);

.material_compare {
  .date_switch {
    margin-top: 24px;
    font-size: 18px;
    color: #393939;

    span {
      padding: 3px 20px;
      border: 1px solid #ddd;
      cursor: pointer;

      &:nth-child(1) {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: 0px;
      }

      &:nth-child(2) {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-left: 0px;
      }

      &.focus {
        border: solid 1px #00afb8;
        background-color: #e6f9fa;
        color: #00afb8;
        font-weight: bold;
      }
    }
  }

  .material_compare_info {
    letter-spacing: 1px;
    margin-top: 20px;

    .material_compare_info_title {
      padding-right: 28px;
      padding-top: 3px;
      box-sizing: content-box;
      display: inline-flex;
      @include font-common(16px, $font-weight-bold);
    }

    .material_compare_info_content {
      flex: 1 1 auto;
      @include font-common(16px, $font-weight-normal);

      .control_warning {
        line-height: 0;
      }

      > p {
        transform: translateY(2px);
        @include font-common(16px, $font-weight-normal, $gray-600);
      }
    }

    &.week {
      .duration {
        color: $blue-lake;

        &.days {
          cursor: pointer;

          .focus {
            font-weight: bold;
            background-color: #e1fafa;
            padding: 4px;
            line-height: 1;
          }

          span {
            display: inline-block;
          }
        }
      }

      .total_week {
        display: flex;
        align-items: center;
        @include font-common(12px, $font-weight-normal, $gray-700);

        > span {
          margin: 0 3px;
          @include font-common(16px, $font-weight-normal, $blue-lake);
        }
      }

      .control_week {
        button {
          outline: none;
        }
      }
    }

    &.board,
    &.company {
      margin-top: 12px;
    }
  }

  .material_compare_table_title {
    margin-top: 42px;

    .material_compare_table_title_wrapper {
      .material_compare_table_title_text {
        @include font-common(24px, $font-weight-bold);
      }

      .material_compare_table_title_example {
        @include font-common(12px);

        > span {
          display: inline-block;
          transform: translateY(2px);
        }
      }
    }

    .material_compare_table_title_link {
      @include font-common(16px, $font-weight-bold, $link-color);

      > img {
        transform: translateY(-2px);
      }
    }
  }

  .material_compare_table {
    margin-top: 24px;
    @include table_width($table_width_config);

    &.withDays {
      @include table_width($table_width_with_days_config);
    }

    .material_compare_table_body_row {
      > div {
        max-height: 70px;
        padding: 25px 0px 25px 12px;
      }
    }

    .material_compare_table_body_content_material {
      display: flex;
      align-items: flex-start;

      img {
        cursor: pointer;
      }

      span {
        line-height: 1;
        margin-left: 6px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 150px;
        cursor: pointer;
        color: #1654b9;
      }
    }

    .material_compare_table_body_content_duration {
      > div {
        transform: translateY(-11px);
      }
    }

    .material_compare_table_body_row {
      .material_compare_table_body_content_r1,
      .material_compare_table_body_content_r2 {
        > span {
          display: inline-block;
          width: 10px;
          height: 1px;
          background-color: $gray-600;
          transform: translateY(-4px);
        }

        > span + span {
          margin-left: 6px;
        }
      }

      .material_compare_table_body_content_psnotes {
        &.multi {
          > div {
            transform: translateY(-16px);
          }
        }

        div + div {
          margin-top: 4px;
        }
      }
    }
  }
}
</style>
