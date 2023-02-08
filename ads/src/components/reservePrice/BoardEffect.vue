<template>
  <div>
    <div class="board_effect_main mb-7">
      <div class="title_block">
        <div class="title">
          新增版位成效
          <input
            v-model="year"
            type="text"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="請輸入"
            widthType="90"
            class="ml-3 mr-3"
          />
          年
          <div class="quarter_block ml-3 mr-3">
            <SelectDropdown
              @value-changed="changeQuarter"
              :options="quarterType"
              :value="quarterName"
              :optionsAllData="true"
              placeholder="請選擇"
            />
          </div>
          季
          <button
            @click="getEffectList(year, quarter)"
            class="button_bg_white_smaller ml-7"
          >
            確定
          </button>
        </div>
      </div>
      <div class="mt-6 mb-6">
        <Loading v-if="loading" class="loading" />
        <template v-else-if="activeEffectList.length">
          <el-table
            ref="activeEffectListTable"
            @row-click="rowClick"
            :data="activeEffectList"
            :row-class-name="tableRowFocus"
            :cell-class-name="cellClassName"
            header-row-class-name="table_header_bg"
            style="width: 100%"
          >
            <el-table-column fixed prop="productName" width="164">
              <template slot="header">
                <div class="table_title">
                  商品名稱
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed prop="siteName" width="120">
              <template slot="header">
                <div class="table_title">
                  網站名稱
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed prop="channelName" width="152">
              <template slot="header">
                <div class="table_title">
                  頻道名稱
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed prop="boardName" width="152">
              <template slot="header">
                <div class="table_title">
                  版位名稱
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rotate" width="130">
              <template slot="header">
                <div class="table_title">輪播次數</div>
              </template>
            </el-table-column>
            <el-table-column prop="marketPrice" width="130">
              <template slot="header">
                <div class="table_title">牌價(未稅)$</div>
              </template>
            </el-table-column>
            <el-table-column :class-name="'table_col--highlight'" width="372">
              <template slot="header">
                <div class="table_title table_title--colspan text-center">
                  校正前 / 校正後
                </div>
              </template>
              <el-table-column
                :class-name="'table_col--highlight'"
                type="index"
                width="180"
              >
                <template slot="header">
                  <div class="table_title table_title--rowspan">
                    平均曝光數(週)
                  </div>
                </template>
                <template slot-scope="scope">
                  <div class="py-4">
                    <div class="pl-3 mb-2 table_text--prev-value">
                      {{ scope.row.actualImpression }}
                    </div>
                    <div class="average_exposure_block">
                      <input
                        v-model.number="scope.row.impression"
                        type="number"
                        placeholder="請輸入"
                        widthType="120"
                        min="1"
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :class-name="'table_col--highlight'"
                type="index"
                width="180"
              >
                <template slot="header">
                  <div class="table_title table_title--rowspan">
                    總平均Click(週)
                  </div>
                </template>
                <template slot-scope="scope">
                  <div class="py-4">
                    <div class="pl-3 mb-2 table_text--prev-value">
                      {{ scope.row.actualClick }}
                    </div>
                    <div class="average_exposure_block">
                      <input
                        v-model.number="scope.row.click"
                        type="number"
                        placeholder="請輸入"
                        widthType="120"
                        min="1"
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :class-name="'table_col--highlight'" width="130">
                <template slot="header">
                  <div class="table_title table_title--rowspan">平均CTR</div>
                </template>
                <template slot-scope="scope">
                  <div class="py-4">
                    <div class="pb-4">
                      {{ scope.row.ctr ? `${scope.row.ctr}%` : "- -" }}
                    </div>
                    <div>
                      {{ getActualCTR(scope.row.impression, scope.row.click) }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="address" width="150">
              <template slot="header">
                <div class="table_title">產品分級</div>
              </template>
              <template slot-scope="scope">
                <input
                  v-model="scope.row.group"
                  type="text"
                  placeholder="請輸入"
                  widthType="120"
                />
              </template>
            </el-table-column>
            <el-table-column width="336">
              <template slot="header">
                <div class="table_title">備註</div>
              </template>
              <template slot-scope="scope">
                <input
                  v-model="scope.row.note"
                  type="text"
                  placeholder="請輸入"
                  widthType="280"
                />
              </template>
            </el-table-column>
            <el-table-column width="65">
              <template slot-scope="scope">
                <icon
                  @click.native.stop="handleDelete(scope.row)"
                  iconName="btn-close"
                  size="16"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="submit_button_block">
            <button @click="saveOpenDialog" class="button_bg_blue_smaller">
              儲存
            </button>
          </div>
        </template>
        <div v-else class="no_list_data">
          尚無版位資料
        </div>
      </div>
    </div>

    <!-- 新增商品 -->
    <div class="board_effect_main create_product">
      <div class="title">新增商品</div>

      <Loading v-if="loading" class="loading" />
      <template v-else-if="inActiveEffectList.length">
        <el-table
          :data="inActiveEffectList"
          style="width: 100%"
          header-row-class-name="table_header_bg"
        >
          <el-table-column prop="productName" width="220">
            <template slot="header">
              <div class="table_title">
                商品名稱
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="siteName" width="220">
            <template slot="header">
              <div class="table_title">
                網站名稱
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="channelName" width="220">
            <template slot="header">
              <div class="table_title">
                頻道名稱
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="boardName" fix>
            <template slot="header">
              <div class="table_title">
                版位名稱
              </div>
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <icon
                @click.native.stop="handleCreate(scope.row)"
                iconName="icon-icon-add-normal"
                size="16"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div v-else class="no_list_data">
        無列表資料
      </div>
    </div>

    <Dialog
      v-if="createProductSuccess"
      @dialogCancel="closeDialog"
      @dialogConfirm="updateEffectList"
      :isShow="createProductSuccess"
      title="您已更動商品內容，按下確定後資料即更動。"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import moment from "moment";
import { getThisYear } from "@/utils/dateFormat.js";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import Dialog from "@/components/Dialog.vue";
import Loading from "@/components/Loading.vue";

const productPromoEffectStore = useProductPromoEffectStore();
const { getProductEffect, putProductEffect } = productPromoEffectStore;
const loading = computed(() => productPromoEffectStore.productEffect.loading);
const activeEffectList = computed(() =>
  effectList.value.filter(item => item.status === true)
);
const inActiveEffectList = computed(() =>
  effectList.value.filter(item => item.status === false)
);
const year = ref(null);
const quarterName = ref(null);
const quarter = ref(null);
const effectList = ref([]);
const activeEffectListTable = ref(null);
const createProductSuccess = ref(false);
const quarterType = [
  { label: "Q1", value: 1 },
  { label: "Q2", value: 2 },
  { label: "Q3", value: 3 },
  { label: "Q4", value: 4 }
];

// 某一行被點擊
const rowClick = (row, column, event) => {
  if (event.target.tagName === "TD" || event.target.tagName === "DIV") {
    row.focus = !row.focus;
    activeEffectListTable.value.toggleRowSelection(row);
  }
};

// 某一行被選取
const tableRowFocus = ({ row }) => (row.focus ? "focus_bg" : "");

// 某一個格
const cellClassName = ({ row, columnIndex }) => {
  if (
    row.impression !==
    productPromoEffectStore.originalProductEffectList[row.index].impression
  ) {
    if (columnIndex === 6) return "change_bg";
  }

  if (
    row.click !==
    productPromoEffectStore.originalProductEffectList[row.index].click
  ) {
    if (columnIndex === 7) return "change_bg";
  }

  if (
    row.impression !==
      productPromoEffectStore.originalProductEffectList[row.index].impression ||
    row.click !==
      productPromoEffectStore.originalProductEffectList[row.index].click
  ) {
    if (columnIndex === 8) return "change_bg";
  }

  if (
    row.group !==
    productPromoEffectStore.originalProductEffectList[row.index].group
  ) {
    if (columnIndex === 9) return "change_bg";
  }

  if (
    row.note !==
    productPromoEffectStore.originalProductEffectList[row.index].note
  ) {
    if (columnIndex === 10) return "change_bg";
  }
};

// 切換季
const changeQuarter = quartersData => {
  quarterName.value = quartersData.label;
  quarter.value = quartersData.value;
};

// 變更狀態
const effectStatusHandler = (rowData, status) => (rowData.status = status);

// 刪除鈕
const handleDelete = rowData => effectStatusHandler(rowData, false);

// 新增鈕
const handleCreate = rowData => effectStatusHandler(rowData, true);

// 計算平均CTR
const getActualCTR = (impression, click) =>
  impression && click ? ((click / impression) * 100).toFixed(2) + "%" : "- -";

// 取得版位成效
const getEffectList = async () => {
  const getProductEffectQuery = {
    year: year.value,
    quarter: quarter.value
  };
  await getProductEffect(getProductEffectQuery);
  effectList.value = [...productPromoEffectStore.productEffectList];
};

// 更新版位成效
const updateEffectList = async () => {
  const putProductEffectQuery = {
    year: year.value,
    quarter: quarter.value,
    requestProductEffectList: [
      ...activeEffectList.value,
      ...inActiveEffectList.value
    ]
  };
  await putProductEffect(putProductEffectQuery);
  closeDialog();
  getEffectList();
};

// 關閉 Dialog
const closeDialog = () => (createProductSuccess.value = false);

// 按下儲存開啟 Dialog
const saveOpenDialog = () => (createProductSuccess.value = true);

onMounted(async () => {
  // 預設一進來取下一季
  year.value = getThisYear();
  quarter.value = moment().quarter() + 1;
  quarterName.value = `Q${quarter.value}`;
  if (quarter.value > 4) {
    year.value = year.value += 1;
    quarter.value = 1;
    quarterName.value = "Q1";
  }

  await getEffectList();
  // scroll 捲到最右邊操作
  if (activeEffectList.value.length > 0)
    activeEffectListTable.value.bodyWrapper.scrollLeft += 800;
});

onBeforeUnmount(() => {
  productPromoEffectStore.$reset();
});
</script>

<style lang="scss" scoped>
.board_effect_main {
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #fff;
  padding: 24px;

  .title_block {
    display: flex;
    align-items: center;

    .title {
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      line-height: 1.33;
      letter-spacing: 1.33px;
      color: #333;
    }

    .quarter_block {
      width: 90px;
    }
  }

  .average_exposure_block {
    display: flex;
    align-items: center;

    label {
      span {
        margin-right: 0;
      }
    }
  }

  .table_title {
    padding: 24px 2px;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.57;
    letter-spacing: 1.23px;
    color: #292929;

    &--colspan {
      padding-top: 24px;
      padding-bottom: 4px;
    }

    &--rowspan {
      padding-top: 0;
      padding-bottom: 24px;
    }

    img {
      margin-bottom: 1px;
      cursor: pointer;
    }
  }

  .submit_button_block {
    text-align: right;
    margin-top: 24px;

    button {
      font-size: 14px;
    }
  }
}

.create_product {
  .title {
    font-size: 24px;
    font-weight: bold;
    line-height: 1.33;
    letter-spacing: 1.33px;
    color: #333;
    margin-bottom: 28px;
  }
}

::v-deep .el-table__header {
  border-bottom: 1px solid #eee !important;

  .table_header_bg th.el-table__cell {
    background-color: #f8f8f8;
    border: none;
  }
}

::v-deep .el-table__body {
  tr {
    &.current-row {
      > td {
        &.el-table__cell {
          background-color: #cbf9f1;
        }
      }
    }
  }
  td {
    height: 70px;
    line-height: 1.57;
    letter-spacing: 1.23px;
    color: #292929;
    border-right: none;

    img {
      cursor: pointer;
    }
  }
}

::v-deep thead.is-group th.el-table__cell.table_col--highlight {
  background: #e6f9fa;
}

::v-deep tr:not(.focus_bg) {
  td {
    &:nth-child(7),
    &:nth-child(8),
    &:nth-child(9) {
      background: #f2fcfc;
    }
  }
}
::v-deep tr {
  &.focus_bg {
    background-color: #cbf9f1;
  }
  td {
    &.change_bg {
      background-color: #fefce8 !important;
    }
  }
}

::v-deep .el-table {
  .el-table__cell {
    padding: 0;
  }
  .hover-row > td {
    background-color: #e6f9fa !important;
  }
}

::v-deep .el-table--border {
  border: 0;
  &::after {
    display: none;
  }
  th.el-table__cell {
    border: none;
    padding: 0;
    vertical-align: bottom;
  }
}

.table_text--prev-value {
  height: 24px;
}

.no_list_data {
  text-align: center;
  margin: 100px 0;
  font-size: 16px;
  color: #ea475b;
}

.loading {
  margin: 88px 0;
}
</style>
