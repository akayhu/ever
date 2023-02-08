<template>
  <div class="maintain_table">
    <div class="maintain_table_title">
      <span class="company_name">{{ selectedCompanyName }}</span>
      <span>活動曝光時間</span>
    </div>
    <div class="maintain_table_download_link">
      <div class="date_switch">
        <span
          @click="changeDate('week')"
          :class="{ focus: dateSwitch === 'week' }"
        >
          週
        </span>
        <span
          @click="changeDate('day')"
          :class="{ focus: dateSwitch === 'day' }"
        >
          日
        </span>
      </div>
      <div class="text-right">
        <button class="bg-transparent border-0" @click="linkAction">
          104整招最新作品集
        </button>
      </div>
    </div>
    <template>
      <div
        class="table mt-4"
        v-show="!isLoading"
        :class="{ noresult: totalTableRow === 0 }"
      >
        <div class="table_content">
          <div class="table_content_header">
            <p class="m-0 mb-3">
              <span>活動網頁網址</span>
            </p>
          </div>
          <div
            class="table_content_wrapper"
            @mouseleave.stop="toolTipIndexHandler(-1)"
          >
            <template>
              <div
                v-for="(item, index) in tableBodyContentData"
                :key="`tableContent${index}`"
                class="table_content_row"
                @mouseenter.stop="toolTipIndexHandler(index)"
              >
                <v-popover
                  :open="activeToolTipIndex === index"
                  :trigger="'manual'"
                  :container="'.table_content_wrapper'"
                  :offset="5"
                  placement="bottom-start"
                  popoverClass="light"
                >
                  <div class="text-truncate">{{ item.content }}</div>
                  <template slot="popover">
                    <div class="popover_link d-flex align-items-center">
                      <div class="popover_link_anchor">
                        <a :href="item.content" target="_blank">
                          {{ item.content }}
                        </a>
                      </div>
                      <div class="popover_link_icon">
                        <img
                          src="@/assets/icon/icon-link.svg"
                          @click.stop="copyLinkHandler(item.content)"
                        />
                      </div>
                    </div>
                  </template>
                </v-popover>
              </div>
            </template>
          </div>
        </div>
        <div class="table_date">
          <div class="table_date_header">
            <div class="table_date_header_title align-items-center">
              <span class="d-inline-block">活動曝光時間</span>
            </div>
            <div class="table_date_header_controll">
              <button
                class="p-0 border-0 bg-transparent align-items-center"
                :disabled="!isControllLeftBtnClickAble"
                :style="{
                  cursor: isControllLeftBtnClickAble ? 'pointer' : 'not-allowed'
                }"
                @click="
                  isControllLeftBtnClickAble &&
                    updateCurrentPage(currentPage - 1)
                "
              >
                <img
                  v-show="isControllLeftBtnClickAble"
                  src="@/assets/icon/icon-arrow-left.svg"
                />
                <img
                  v-show="!isControllLeftBtnClickAble"
                  src="@/assets/icon/icon-arrow-left-disable.svg"
                />
              </button>
              <transition-group
                tag="div"
                class="table_date_header_swiper d-flex flex-wrap overflow-hidden position-relative"
                :name="moveDirection"
              >
                <div
                  v-for="(headerSwiperItem, headerIndex) in tableHeaderData"
                  v-show="headerIndex + 1 === currentPage"
                  :key="`headerSwiperItem${headerIndex}`"
                  class="table_date_header_swiper_item position-absolute"
                >
                  <div
                    v-for="(week, index) in headerSwiperItem"
                    :key="`week${index}`"
                    :class="{
                      table_date_header_day_item: dateSwitch === 'day'
                    }"
                  >
                    <p
                      v-show="week.start"
                      class="m-0"
                      :class="{ week_start: dateSwitch === 'week' }"
                    >
                      {{ week.start
                      }}<span v-show="week.end"> ~ {{ week.end }}</span>
                    </p>
                    <!-- <p  class="week_end m-0">{{ week.end }}</p> -->
                  </div>
                </div>
              </transition-group>
              <button
                class="p-0 border-0 bg-transparent d-flex align-items-center"
                :disabled="!isControllRightBtnClickAble"
                :style="{
                  cursor: isControllRightBtnClickAble
                    ? 'pointer'
                    : 'not-allowed'
                }"
                @click="
                  isControllRightBtnClickAble &&
                    updateCurrentPage(currentPage + 1)
                "
              >
                <img
                  v-show="isControllRightBtnClickAble"
                  src="@/assets/icon/icon-arrow-right.svg"
                />
                <img
                  v-show="!isControllRightBtnClickAble"
                  src="@/assets/icon/icon-arrow-right-disable.svg"
                />
              </button>
            </div>
          </div>
          <div class="table_date_wrapper overflow-hidden">
            <transition-group
              tag="div"
              class="table_date_swiper position-relative"
              :style="{ height: `${totalTableRow * 68}px` }"
              :name="moveDirection"
            >
              <div
                v-for="(swiperItem, index) in tableBodyDateData"
                :key="`swiper_${index}`"
                v-show="index + 1 === currentPage"
                class="table_date_swiper_item position-absolute"
              >
                <div
                  v-for="(swiperItemRow, index) in swiperItem"
                  :key="`swiperItemRow${index}`"
                  class="table_date_swiper_item_row d-flex position-relative"
                >
                  <div
                    v-for="(rowItem, index) in swiperItemRow"
                    :key="`rowItem${index}`"
                    class="d-flex align-items-center justify-content-center position-relative"
                  >
                    <img
                      src="@/assets/icon/icon-line-on.svg"
                      v-show="rowItem.isExposure"
                    />
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
        <div class="table_noresult" v-show="totalTableRow === 0">
          無符合的資料
        </div>
      </div>
      <div
        v-show="isLoading"
        class="loading align-items-center justify-content-center"
      >
        <Loading />
      </div>
    </template>
    <Pages
      class="mt-10"
      :pageData="activityData"
      v-show="totalTableRow > 0"
      @pageChange="onPageChange"
    />
    <GoTop />
  </div>
</template>

<script>
import { ref, computed, toRefs, nextTick } from "vue";
import { useMaintainStore } from "@/stores/maintain.js";
import Loading from "@/components/Loading.vue";
import Pages from "@/components/Pages.vue";
import GoTop from "@/components/GoTop.vue";
import { copyLink } from "@/utils/copyLink.js";

let debouceMouseActionTimer = null;

export default {
  components: {
    Pages,
    Loading,
    GoTop
  },
  setup(props, { emit }) {
    const maintainStore = useMaintainStore();
    const { selectedCompany, activityData } = toRefs(maintainStore);
    const selectedCompanyName = computed(() => selectedCompany.value.name);
    const isLoading = computed(() => activityData.value.loading);
    const totalTableRow = computed(() => activityData.value.content.length);
    const tableBodyContentData = computed(() =>
      activityData.value.content.map(item => ({ content: item.url }))
    );
    const isControllLeftBtnClickAble = computed(
      () => currentPage.value > 1 && isControllBtnClickable.value
    );
    const totalWeekTablePage = computed(() =>
      Math.round(maintainStore.getTotalWeek.length / 4)
    );
    const totalDayTablePage = computed(() =>
      Math.round(maintainStore.getTotalDay.length / 7)
    );
    const tableHeaderData = computed(() => {
      const ary = [];
      let totalPage =
        dateSwitch.value === "week"
          ? totalWeekTablePage.value
          : totalDayTablePage.value;
      for (let i = 0; i < totalPage; i++) {
        if (dateSwitch.value === "week") {
          ary.push(
            maintainStore.getTotalWeek.slice(
              i * pageLimit.value,
              (i + 1) * pageLimit.value
            )
          );
        } else {
          ary.push(
            maintainStore.getTotalDay.slice(
              i * pageLimit.value,
              (i + 1) * pageLimit.value
            )
          );
        }
      }
      return ary;
    });
    const isControllRightBtnClickAble = computed(() => {
      if (dateSwitch.value === "week") {
        return (
          currentPage.value < totalWeekTablePage.value &&
          isControllBtnClickable.value
        );
      }
      return (
        currentPage.value < totalDayTablePage.value &&
        isControllBtnClickable.value
      );
    });
    const tableBodyDateData = computed(() => {
      const list =
        dateSwitch.value === "week"
          ? maintainStore.getTableDateWeekData
          : maintainStore.getTableDateDayData;
      const ary = [];
      let totalPage =
        dateSwitch.value === "week"
          ? totalWeekTablePage.value
          : totalDayTablePage.value;
      for (let i = 0; i < totalPage; i++) {
        const temp = [];
        for (let k = 0; k < list.length; k++) {
          temp.push(
            list[k].exposureList.slice(
              i * pageLimit.value,
              (i + 1) * pageLimit.value
            )
          );
        }
        ary.push(temp);
      }
      return ary;
    });
    const dateSwitch = ref("week");
    const pageLimit = ref(4);
    const currentPage = ref(1);
    const activeToolTipIndex = ref(-1);
    const isControllBtnClickable = ref(true);
    const moveDirection = ref("");

    const changeDate = type => {
      dateSwitch.value = type;
      pageLimit.value = type === "week" ? 4 : 7;
      currentPage.value = 1;
    };

    const linkAction = () => {
      window.open(
        "https://docs.google.com/spreadsheets/d/1ASo-4Y0Srgt7_yBen9ZTnRLow6xdo5rpQI_Pzxfl4YQ/edit#gid=0"
      );
    };

    const toolTipIndexHandler = index => {
      clearTimeout(debouceMouseActionTimer);
      debouceMouseActionTimer = setTimeout(() => {
        activeToolTipIndex.value = index;
      }, 100);
    };

    const copyLinkHandler = link => {
      copyLink(link);
    };

    const resetControlData = () => {
      isControllBtnClickable.value = true;
      currentPage.value = 1;
    };

    const getTableData = async (page = 1) => {
      if (!isLoading.value) activityData.value.loading = true;
      maintainStore.getMaintainActivityPage({ page });
      activityData.value.loading = false;
    };

    const onPageChange = async ({ page }) => {
      resetControlData();
      await getTableData(page);
      nextTick(() => {
        emit("pageChange");
      });
    };

    const updateCurrentPage = page => {
      moveDirection.value = page - currentPage.value > 0 ? "right" : "left";
      currentPage.value = page;
    };

    return {
      activityData,
      selectedCompanyName,
      dateSwitch,
      currentPage,
      changeDate,
      linkAction,
      isLoading,
      totalTableRow,
      toolTipIndexHandler,
      activeToolTipIndex,
      tableBodyContentData,
      copyLinkHandler,
      onPageChange,
      isControllLeftBtnClickAble,
      updateCurrentPage,
      moveDirection,
      tableHeaderData,
      isControllRightBtnClickAble,
      tableBodyDateData
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

// animate setting
.right-enter-active,
.right-leave-active,
.left-enter-active,
.left-leave-active {
  transition: all 0.3s ease;
}

.right-enter,
.left-leave-to {
  transform: translateX(100%);
}

.right-enter-to,
.right-leave,
.left-enter-to,
.laft-leave {
  transform: translateX(0);
}

.right-leave-to,
.left-enter {
  transform: translateX(-100%);
}

$control-button-width: 24px;
$table-content-width: 470px;
$table-date-width: 708px;
$table-row-item-height: 68px;
$table-row-item-width: 165px;
$table-heaedr-height: 116px;

.maintain_table {
  .maintain_table_title {
    > span {
      @include font-common(22px, $font-weight-bold);
    }

    .company_name {
      color: $blue-lake;
    }
  }

  .maintain_table_download_link {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .date_switch {
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

    button {
      @include font-common(16px, $font-weight-normal, $link-color);
      letter-spacing: 1px;
      cursor: pointer;
    }
  }
}

.table {
  display: flex;
  margin-bottom: 0;

  .table_content {
    flex: 0 0 $table-content-width;
    max-width: $table-content-width;
    border-right: 1px solid $gray-400;

    .table_content_header {
      min-height: $table-heaedr-height;
      max-height: $table-heaedr-height;
      border-top: 1px solid $gray-400;
      border-bottom: 1px solid $gray-400;
      padding: 24px 18px 35px 18px;

      > p {
        @include font-common(16px, $font-weight-bold);
        display: flex;
        align-items: flex-end;

        span {
          margin-right: 6px;
          line-height: 1;
        }
      }

      > div {
        > span {
          @include font-common(14px, $font-weight-normal, $gray-600);
        }
      }
    }

    .table_content_wrapper {
      .table_content_row {
        border-bottom: 1px solid $gray-400;
        max-height: $table-row-item-height;
        padding: 24px 18px;
        @include font-common(14px, $font-weight-normal);

        a {
          font-size: 14px;
          outline: medium none;
          text-decoration: none;
        }

        ::v-deep .v-popover {
          .trigger {
            width: 100%;

            > div {
              cursor: default;
            }
          }
        }
      }
    }
  }

  .table_date {
    flex: 0 0 $table-date-width;
    max-width: $table-date-width;

    .table_date_header {
      max-height: $table-heaedr-height;
      border-top: 1px solid $gray-400;
      border-bottom: 1px solid $gray-400;

      .table_date_header_title {
        display: flex;
        padding: 24px 8px 0px 8px;

        > span {
          @include font-common(16px, $font-weight-bold);
        }

        > div {
          margin-top: -1px;

          > span {
            @include font-common(14px, $font-weight-normal, $gray-600);
          }
        }
      }

      .table_date_header_controll {
        display: flex;

        > button {
          display: flex;
          height: inherit;
          width: $control-button-width;
          outline: none;
        }

        .table_date_header_swiper {
          width: $table-date-width - $control-button-width * 2;
          min-height: $table-row-item-height;

          .table_date_header_swiper_item {
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            display: flex;

            > div {
              min-width: $table-row-item-width;
              padding: 16px 15px;
              display: flex;
              align-items: center;

              &.table_date_header_day_item {
                min-width: 94px;
                padding: 16px 0;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              > p {
                @include font-common(12px, $font-weight-normal);
                letter-spacing: 0;
                position: relative;
              }

              /* .week_start {
                &::after {
                  content: "~";
                  position: absolute;
                  right: -2px;
                  top: 50%;
                  transform: translateY(-50%);
                }
              } */
            }
          }
        }
      }
    }

    .table_date_wrapper {
      padding: 0 $control-button-width;
    }

    .table_date_swiper {
      .table_date_swiper_item {
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        .table_date_swiper_item_row {
          display: flex;

          &::before,
          &::after {
            content: "";
            display: inline-block;
            height: 1px;
            width: $control-button-width;
            background-color: $gray-400;
            bottom: 0;
            position: absolute;
          }
          &::before {
            left: $control-button-width * -1;
          }
          &::after {
            right: $control-button-width * -1;
          }

          > div {
            width: $table-row-item-width;
            padding: 16px 18px;
            min-height: $table-row-item-height;
            border-bottom: 1px solid $gray-400;
            z-index: 1;
          }
        }
      }
    }
  }

  &.noresult {
    padding-bottom: 144px;
    position: relative;
  }

  .table_noresult {
    position: absolute;
    left: 0;
    top: $table-heaedr-height;
    width: 100%;
    height: 144px;
    @include font-common(16px, $font-weight-normal, $red);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid $gray-400;
  }
}

.loading {
  display: flex;
  height: 500px;
}
</style>
