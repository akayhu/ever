<template>
  <div>
    <div class="copywriting">
      <div class="left">
        <span>{{ version }}</span
        >促案
      </div>
      <div>{{ promoData.note }}</div>
    </div>

    <el-table
      ref="activePromoListTable"
      @row-click="rowClick"
      :data="productPromoEffectList"
      :row-class-name="tableRowFocus"
      style="width: 100%;"
      header-row-class-name="table_header_bg"
    >
      <el-table-column fixed prop="group" width="130">
        <template slot="header">
          <div class="table_title">整招版<br />產品分級</div>
        </template>
      </el-table-column>
      <el-table-column fixed prop="siteName" width="130">
        <template slot="header">
          <div class="table_title">
            網站名稱
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed prop="channelName" width="130">
        <template slot="header">
          <div class="table_title">
            頻道名稱
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed prop="boardName" width="160">
        <template slot="header">
          <div class="table_title">
            版位名稱
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="rotate" width="112">
        <template slot="header">
          <div class="table_title">輪播次數</div>
        </template>
      </el-table-column>

      <el-table-column width="120">
        <template slot="header">
          <div class="table_title">牌價(未稅)</div>
        </template>
        <template slot-scope="scope">
          $ {{ scope.row.marketPrice.toLocaleString() }}
        </template>
      </el-table-column>
      <!-- fix -->

      <el-table-column width="130">
        <template slot="header">
          <div class="table_title">底價(未稅)</div>
        </template>
        <template slot-scope="scope">{{ scope.row.floorPrice }}%</template>
      </el-table-column>

      <el-table-column width="130">
        <template slot="header">
          <div class="table_title">折扣</div>
        </template>
        <template slot-scope="scope">
          {{ getDiscount(scope.row.floorPrice, scope.row.marketPrice) }}%
        </template>
      </el-table-column>

      <el-table-column prop="notForProduct" width="130">
        <template slot="header">
          <div class="table_title">試用身分</div>
        </template>
      </el-table-column>

      <el-table-column width="130">
        <template slot="header">
          <div class="table_title">平均曝光數<br />(週)</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.impression.toLocaleString() }}
        </template>
      </el-table-column>

      <el-table-column width="130">
        <template slot="header">
          <div class="table_title">總平均Click<br />(週)</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.click.toLocaleString() }}
        </template>
      </el-table-column>

      <el-table-column width="130">
        <template slot="header">
          <div class="table_title">平均CTR</div>
        </template>
        <template slot-scope="scope">
          {{ getActualCTR(scope.row.impression, scope.row.click) }}
        </template>
      </el-table-column>

      <!-- fix -->
      <el-table-column width="360">
        <template slot="header">
          <div class="table_title">備註</div>
        </template>
        <template slot-scope="scope">
          <div class="py-2">
            <div v-if="scope.row.noteForPromoLastVersion" class="table_note">
              <div>補充：{{ scope.row.noteForPromoLastVersion }}</div>
            </div>
            <div v-if="scope.row.noteForEffectLastVersion" class="table_note">
              <div>補充：{{ scope.row.noteForEffectLastVersion }}</div>
            </div>
            <div v-if="scope.row.noteForPromo">
              <div>補充：{{ scope.row.noteForPromo }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect.js";
import moment from "moment";
import { round } from "@/utils/quotation.js";

const props = defineProps({
  promoListData: Object,
  year: [String, Date],
  keyword: String
});
const productPromoEffectStore = useProductPromoEffectStore();
const promoData = computed(() => props.promoListData);
const productPromoEffectList = computed(() =>
  props.keyword
    ? productPromoEffectStore.productPromoList.filter(
        item =>
          (item.group && item.group.match(props.keyword)) ||
          item.siteName.match(props.keyword) ||
          item.channelName.match(props.keyword) ||
          item.boardName.match(props.keyword) ||
          (item.noteForPromo && item.noteForPromo.match(props.keyword)) ||
          (item.noteForEffectLastVersion &&
            item.noteForEffectLastVersion.match(props.keyword)) ||
          (item.noteForPromoLastVersion &&
            item.noteForPromoLastVersion.match(props.keyword))
      )
    : productPromoEffectStore.productPromoList
);
const version = computed(
  () =>
    `Y${String(props.promoListData.year).substring(2, 4)}-Q${
      props.promoListData.quarter
    } ${moment(props.promoListData.effectiveDate).format("MM-DD")}`
);
const activePromoListTable = ref(null);

// 平均CTR
const getActualCTR = (impression, click) =>
  impression && click ? ((click / impression) * 100).toFixed(2) + "%" : "- -";

// 計算折扣 (折扣 = 底價 / 牌價)
const getDiscount = (floorPrice, marketPrice) =>
  floorPrice && marketPrice ? round((floorPrice / marketPrice) * 100, 2) : 0;

// 某一行被點擊
const rowClick = (row, column, event) => {
  if (event.target.tagName === "TD" || event.target.tagName === "DIV") {
    row.focus = !row.focus;
    activePromoListTable.value.toggleRowSelection(row);
  }
};

// 某一行被選取
const tableRowFocus = ({ row }) => (row.focus ? "focus_bg" : "");

nextTick(() => {
  activePromoListTable.value.bodyWrapper.scrollLeft += 1;
});
</script>

<style lang="scss" scoped>
.copywriting {
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #e6f9fa;
  padding: 24px;
  margin: 24px 0;
  font-size: 14px;
  line-height: 1.57;
  letter-spacing: 1.23px;
  color: #333;
  font-size: 14px;

  .left {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;

    span {
      color: #00afb8;
      margin-right: 8px;
    }
  }
}

.table_title {
  height: 44px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.57;
  letter-spacing: 1.23px;
  color: #292929;
  display: flex;
  align-items: center;

  img {
    margin-bottom: 1px;
    cursor: pointer;
  }
}

.table_note {
  padding-bottom: 8px;
}

::v-deep .table_header_bg {
  th {
    background-color: #f8f8f8 !important;
    border-bottom: 1px solid #eee !important;

    &:nth-child(7),
    &:nth-child(8),
    &:nth-child(9),
    &:nth-child(13) {
      background-color: #e6f9fa !important;
    }
    &:nth-child(10),
    &:nth-child(11),
    &:nth-child(12) {
      background-color: #dbf7c5 !important;
    }
  }
}
::v-deep .el-table__body {
  td {
    height: 70px;
    line-height: 1.57;
    letter-spacing: 1.23px;
    color: #292929;

    &:nth-child(7),
    &:nth-child(8),
    &:nth-child(9),
    &:nth-child(13) {
      background-color: #f7fdfd;
    }
    &:nth-child(10),
    &:nth-child(11),
    &:nth-child(12) {
      background-color: #edfbe2;
    }
  }
}

::v-deep .focus_bg {
  background-color: #cbf9f1;

  td {
    &:nth-child(7),
    &:nth-child(8),
    &:nth-child(9),
    &:nth-child(10),
    &:nth-child(11),
    &:nth-child(12),
    &:nth-child(13) {
      background-color: initial;
    }
  }
}

::v-deep .el-table {
  .el-table__cell {
    padding: 16px 0;
  }
  .hover-row > td {
    background-color: #e6f9fa !important;
  }
}
</style>
