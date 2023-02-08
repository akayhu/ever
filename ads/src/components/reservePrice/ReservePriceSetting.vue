<template>
  <div class="add_reserve_price_main">
    <div class="title_block">
      <div>建立底價</div>
      <div v-if="!loading">
        <span
          v-if="
            productPromo.id &&
              productPromo.productPromoActionList.includes('DISCARD')
          "
          class="mr-6 invalid_copywriting"
        >
          本季已有一張已通過簽核、尚未到生效日期之底價促案方案，如還有需求新增，請先作廢原通過簽核之方案。</span
        >
        <button
          v-if="
            productPromo.id &&
              productPromo.productPromoActionList.includes('DISCARD')
          "
          @click="actionConfirm('DISCARD')"
          class="button_bg_white_large"
        >
          作廢
        </button>
        <button
          v-if="
            productPromo.id &&
              productPromo.productPromoActionList.includes('RETRIEVE')
          "
          @click="actionConfirm('RETRIEVE')"
          class="button_bg_white_large"
        >
          抽單
        </button>
        <button
          v-if="productPromo.productPromoActionList.includes('SIGN')"
          @click="sign"
          class="button_bg_blue_large ml-4"
        >
          送出
        </button>
      </div>
    </div>
    <Loading v-if="loading" class="loading" />
    <div v-else>
      <div class="left_title">
        <div class="title">現在所屬版本</div>
        <div
          v-tooltip="{
            placement: 'right',
            offset: 5,
            content: !changeEffectiveDateVal ? productPromo.createDate : '',
            trigger: 'hover'
          }"
          class="current_version"
        >
          {{ currentVersion }}
        </div>
      </div>
      <div v-if="!productPromo.id" class="left_title">
        <div class="title">套用的版本</div>
        <div class="current_version">{{ appliedVersion }}</div>
      </div>
      <div v-if="editProductPromoId" class="left_title">
        <div class="title">載入資料版本</div>
        <div class="tag">
          <div>
            <span v-for="(item, index) in checkboxType" :key="index">
              <input
                type="checkbox"
                v-model="item.checked"
                @change="setPromo"
                :id="`item_${index}`"
                :data-type="item.type"
              />
              <label :for="`item_${index}`" class="mr-2">
                <span class="mr-2"></span>{{ item.title }}
              </label>
            </span>
            <button @click="toApply" class="button_bg_white_smaller ml-4">
              套用
            </button>
          </div>
          <div class="mt-4">
            <Loading
              v-if="productPromoLoading"
              size="28"
              class="date_loading"
            />
            <div v-else>
              <span
                v-for="item in productPromoListData"
                @click="setPreviousVersion(item.id)"
                :key="item.id"
                :data-audit="item.audit"
                :class="{ focus: item.id === productPromoListId }"
                >{{ moment(item.effectiveDate).format("MM-DD") }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="category_block">
        <div class="left">
          <div class="title">預計生效日期</div>
          <div>
            <el-date-picker
              v-model="productPromo.effectiveDate"
              @change="changeEffectiveDate"
              :disabled="canEdit"
              :class="{
                error_message_border: v$.effectiveDate.$error
              }"
              type="date"
              placeholder="生效日期"
            />
            <div v-if="v$.effectiveDate.$error" class="error_message">
              請輸入生效日期
            </div>
          </div>
        </div>
        <div class="right">
          <div class="search d-flex align-items-center">
            <input
              v-model="keyword"
              type="text"
              placeholder="請輸入關鍵字查詢"
              widthType="220"
              class="mr-3"
            /><img src="@/assets/icon/icon-search.svg" class="mr-6" />
            <a
              v-if="editProductPromoId"
              :href="
                `${apiURL}api/component/product/promo/${editProductPromoId}/download`
              "
              class="download mr-6"
              target="_blank"
              ><img src="@/assets/icon/icon-download.svg" class="mr-1" />
              下載檔案</a
            >
            <button
              @click="preview"
              :disabled="canEdit"
              class="button_bg_white_smaller"
            >
              預覽
            </button>
            <button
              @click="save"
              :disabled="canEdit"
              class="button_bg_white_smaller"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
      <div class="note_block">
        <div class="title">
          {{ currentVersion }}<span class="ml-2">促案</span>
        </div>
        <div class="mt-2">
          <el-input
            v-model="productPromo.note"
            :autosize="{ minRows: 8 }"
            :disabled="canEdit"
            type="textarea"
            placeholder="請輸入"
            maxlength="500"
            show-word-limit
          />
        </div>
      </div>
      <div>
        <template v-if="productPromoList.length > 0">
          <el-table
            ref="activePromoListTable"
            @row-click="rowClick"
            :data="productPromoList"
            :row-class-name="tableRowFocus"
            :cell-class-name="cellClassName"
            header-row-class-name="table_header_bg"
            style="width: 100%"
          >
            <el-table-column fixed prop="group" width="130">
              <template slot="header">
                <div class="table_title">整招版<br />產品分級</div>
              </template>
            </el-table-column>
            <el-table-column fixed prop="siteName" width="130">
              <template slot="header">
                <div class="table_title text_bottom">
                  網站名稱
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed prop="channelName" width="130">
              <template slot="header">
                <div class="table_title text_bottom">
                  頻道名稱
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed prop="boardName" width="160">
              <template slot="header">
                <div class="table_title text_bottom">
                  版位名稱
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rotate" width="100">
              <template slot="header">
                <div class="table_title">輪播次數</div>
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template slot="header">
                <div class="table_title">牌價(未稅)</div>
              </template>
              <template slot-scope="scope">
                $ {{ scope.row.marketPrice.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column width="140">
              <template slot="header">
                <div class="table_title">底價(未稅)</div>
              </template>
              <template slot-scope="scope">
                <input
                  v-model.number="scope.row.floorPrice"
                  :disabled="canEdit"
                  :class="{
                    error_message_border:
                      v$.productPromoEffectList.$each.$response.$data[
                        scope.$index
                      ].floorPrice.$error && v$.productPromoEffectList.$dirty
                  }"
                  type="text"
                  placeholder="請輸入"
                  widthType="120"
                />
                <div
                  v-if="
                    v$.productPromoEffectList.$each.$response.$data[
                      scope.$index
                    ].floorPrice.$error && v$.productPromoEffectList.$dirty
                  "
                  class="error_message"
                >
                  請輸入底價
                </div>
              </template>
            </el-table-column>
            <el-table-column width="124">
              <template slot="header">
                <div class="table_title">折扣</div>
              </template>
              <template slot-scope="scope">
                <input
                  @change="
                    changeDiscount($event, scope.row.marketPrice, scope.row)
                  "
                  :disabled="canEdit"
                  :value="
                    getDiscount(scope.row.floorPrice, scope.row.marketPrice)
                  "
                  type="text"
                  class="w-100"
                  placeholder="請輸入"
                  widthType="30"
                />
              </template>
            </el-table-column>
            <el-table-column width="140">
              <template slot="header">
                <div class="table_title">試用身分</div>
              </template>
              <template slot-scope="scope">
                <input
                  v-model="scope.row.notForProduct"
                  :disabled="canEdit"
                  type="text"
                  placeholder="請輸入"
                  widthType="120"
                />
              </template>
            </el-table-column>

            <el-table-column width="330">
              <template slot="header">
                <div class="table_title">備註</div>
              </template>
              <template slot-scope="scope">
                <div class="py-2">
                  <div
                    v-if="scope.row.noteForPromoLastVersion"
                    class="table_note"
                  >
                    <div>補充：{{ scope.row.noteForPromoLastVersion }}</div>
                  </div>
                  <div
                    v-if="scope.row.noteForEffectLastVersion"
                    class="table_note"
                  >
                    <div>補充：{{ scope.row.noteForEffectLastVersion }}</div>
                  </div>
                  <input
                    v-model="scope.row.noteForPromo"
                    :disabled="canEdit"
                    type="text"
                    placeholder="請輸入"
                    widthType="280"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div v-else class="no_list_data">
          尚無版位資料
        </div>
      </div>
    </div>

    <Dialog
      v-if="actionSuccess"
      :cancelButton="false"
      :dialogConfirm="() => (actionSuccess = false)"
      :isShow="actionSuccess"
      :title="dialogTitle"
      :content="dialogContent"
      componentKey="actionSuccess"
      key="actionSuccess"
    />

    <Dialog
      v-if="actionInvalidDialog"
      @dialogCancel="actionInvalidDialog = false"
      @dialogConfirm="productPromoAction(actionType)"
      :isShow="actionInvalidDialog"
      :title="confirmTitle"
      componentKey="actionInvalidDialog"
      key="actionInvalidDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductPromoEffectStore } from "@/stores/productPromoEffect.js";
import { getThisYear, getDateFormat } from "@/utils/dateFormat.js";
import moment from "moment";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Loading from "@/components/Loading.vue";
import Dialog from "@/components/Dialog.vue";
import { round } from "@/utils/quotation.js";

const productPromoEffectStore = useProductPromoEffectStore();
const {
  putProductPromo,
  patchProductPromoIdAction,
  getProductPromo,
  getProductPromoIdApplyId,
  getProductPromoId,
  changeProductPromoListId
} = productPromoEffectStore;
const productPromoListData = computed(
  () => productPromoEffectStore.productPromoListData
);
const productPromo = computed(() => productPromoEffectStore.productPromo);
const previousVersionProductPromo = computed(
  () => productPromoEffectStore.previousVersionProductPromo
);
const productPromoList = computed(() =>
  keyword.value
    ? productPromoEffectStore.productPromoList.filter(
        item =>
          (item.group && item.group.match(keyword.value)) ||
          item.siteName.match(keyword.value) ||
          item.channelName.match(keyword.value) ||
          item.boardName.match(keyword.value) ||
          (item.noteForPromo && item.noteForPromo.match(keyword.value)) ||
          (item.noteForEffectLastVersion &&
            item.noteForEffectLastVersion.match(keyword.value)) ||
          (item.noteForPromoLastVersion &&
            item.noteForPromoLastVersion.match(keyword.value))
      )
    : productPromoEffectStore.productPromoList
);
const loading = computed(() => productPromoEffectStore.productPromo.loading);
// 可編輯
const canEdit = computed(
  () => !productPromo.value.productPromoActionList.includes("SIGN")
);
const editProductPromoId = computed(
  () => productPromoEffectStore.editProductPromoId
);
// 現在所屬版本
const currentVersion = computed(() =>
  productPromo.value.id
    ? `Y${String(productPromo.value.year).substring(2, 4)}-Q${
        productPromo.value.quarter
      } ${moment(productPromo.value.effectiveDate).format("MM-DD")}`
    : `Y${year.value.substring(2, 4)}-Q${quarter.value} ${
        changeEffectiveDateVal.value
          ? changeEffectiveDateVal.value
          : moment(new Date()).format("MM-DD")
      }`
);
// 套用的版本
const appliedVersion = computed(() =>
  previousVersionProductPromo.value.effectiveDate
    ? `Y${String(previousVersionProductPromo.value.year).substring(2, 4)}-Q${
        previousVersionProductPromo.value.quarter
      } ${moment(previousVersionProductPromo.value.effectiveDate).format(
        "MM-DD"
      )}`
    : "- -"
);
const productPromoListId = computed(
  () => productPromoEffectStore.productPromoListId
);
const rules = computed(() => ({
  effectiveDate: { required },
  productPromoEffectList: {
    $each: helpers.forEach({
      floorPrice: { required }
    })
  }
}));
const productPromoLoading = computed(
  () => productPromoEffectStore.productPromoLoading
);
const keyword = ref(null);
const quarter = ref(`${moment().quarter()}`);
const year = ref(`${getThisYear()}`);
const activePromoListTable = ref(null);
const actionSuccess = ref(false);
const dialogTitle = ref(null);
const dialogContent = ref(null);
const changeEffectiveDateVal = ref(null);
const auditList = ref([productPromoEffectStore.audit]);
const actionInvalidDialog = ref(false);
const actionType = ref(null);
const confirmTitle = ref(null);
const checkboxType = ref([
  { title: "生效", checked: true, value: 5, type: "TAKE_EFFECT" },
  { title: "儲存", checked: false, value: 0, type: "SAVE" },
  { title: "送簽中", checked: false, value: 1, type: "SIGN" },
  { title: "駁回", checked: false, value: 2, type: "REJECT" },
  { title: "抽單", checked: false, value: 3, type: "RETRIEVE" },
  { title: "作廢", checked: false, value: 6, type: "DISCARD" }
]);
const apiURL = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;

const v$ = useVuelidate(rules, productPromo);

// 預計生效日期
const changeEffectiveDate = event => {
  // 有選預計生效日期與現在所屬版本同步異動
  changeEffectiveDateVal.value = event
    ? moment(event).format("MM-DD")
    : moment(new Date()).format("MM-DD");
};

// 選取載入資料版本
const setPreviousVersion = id => {
  changeProductPromoListId(id);
};

// 某一行被點擊
const rowClick = (row, column, event) => {
  if (event.target.tagName === "TD" || event.target.tagName === "DIV") {
    row.focus = !row.focus;
    activePromoListTable.value.toggleRowSelection(row);
  }
};

// 某一行被選取
const tableRowFocus = ({ row }) => (row.focus ? "focus_bg" : "");

// 某一個格
const cellClassName = ({ row, columnIndex }) => {
  const originalData =
    productPromoEffectStore.originalProductPromo.productPromoEffectList[
      row.index
    ];

  const floorPrice = row.floorPrice || 0;
  const originalDataFloorPrice = originalData.floorPrice || 0;
  const marketPrice = row.marketPrice;
  const originalMarketPrice = originalData.marketPrice || 0;

  if (floorPrice !== originalDataFloorPrice) {
    if (columnIndex === 6 || columnIndex === 7) return "change_bg";
  }

  if (
    marketPrice !== 0 &&
    floorPrice / marketPrice !== originalDataFloorPrice / originalMarketPrice
  ) {
    if (columnIndex === 7 || columnIndex === 6) return "change_bg";
  }

  if (
    row.notForProduct !== originalData.notForProduct &&
    !row.notForProduct !== !originalData.notForProduct
  ) {
    if (columnIndex === 8) return "change_bg";
  }

  if (
    row.noteForPromo !== originalData.noteForPromo &&
    !row.noteForPromo !== !originalData.noteForPromo
  ) {
    if (columnIndex === 9) return "change_bg";
  }
};

// 預覽
const preview = async () => {
  const validation = formValidation();
  if (validation) {
    await putProductPromoAction();
    window.open(`/reservePricePreview?id=${productPromo.value.id}`, "_blank");
  }
};

// 取得底價促案列表
const getPromoList = async () => {
  const query = {
    year: year.value,
    quarter: quarter.value,
    auditList: auditList.value
  };
  await getProductPromo(query);
};

// 計算折扣 (折扣 = 底價 / 牌價)
const getDiscount = (floorPrice, marketPrice) =>
  floorPrice && marketPrice ? round((floorPrice / marketPrice) * 100, 2) : 0;

// 計算底價 (底價 = 牌價 x 折扣)
const changeDiscount = (event, marketPrice, row) => {
  row.floorPrice = event.target.value * marketPrice;
};

// 新增/編輯底價促案
const putProductPromoAction = async () => {
  const query = {
    quarter: quarter.value,
    year: year.value,
    requestProductPromo: {
      effectiveDate: getDateFormat(
        productPromo.value.effectiveDate,
        "YYYY/MM/DD"
      ),
      id: productPromo.value.id || null,
      note: productPromo.value.note,
      name: `Y${year.value.substring(2, 4)}-Q${quarter.value} ${getDateFormat(
        productPromo.value.effectiveDate,
        "MM-DD"
      )}`,
      productPromoEffectList: [...productPromoList.value]
    }
  };
  await putProductPromo(query);
};

// 表單驗證
const formValidation = () => {
  v$.value.$touch();
  if (v$.value.effectiveDate.$error) return false;
  if (v$.value.productPromoEffectList.$error) return false;
  return true;
};

// 儲存
const save = async () => {
  const validation = formValidation();
  if (validation) {
    await putProductPromoAction();
    v$.value.$reset();
    auditList.value = [4, 5];
    keyword.value = null;
    getPromoList();
    getProductPromoId({ id: productPromo.value.id });
  }
};

// 套用
const toApply = async () => {
  if (!productPromoListId.value) return;
  const query = {
    id: productPromo.value.id,
    applyId: productPromoListId.value
  };
  await getProductPromoIdApplyId(query);
  await getProductPromoId({ id: productPromo.value.id });
};

// 送出(SIGN)/抽單(RETRIEVE)/作廢(DISCARD)
const productPromoAction = async type => {
  actionInvalidDialog.value = false;
  const actionType = {
    SIGN: "送出",
    RETRIEVE: "抽單",
    DISCARD: "作廢"
  };
  dialogTitle.value = `您已完成${actionType[type]}。`;
  dialogContent.value = `已${actionType[type]}完成`;

  await patchProductPromoIdAction({
    id: productPromo.value.id,
    action: type
  });

  actionSuccess.value = true;

  await getProductPromoId({ id: productPromo.value.id });

  // 三秒後關閉
  setTimeout(() => {
    actionSuccess.value = false;
  }, 3000);
};

// 送出
const sign = async () => {
  const validation = formValidation();
  if (!validation) return;
  await putProductPromoAction();
  productPromoAction("SIGN");
};

// action 確認標題
const actionConfirmTitle = type => {
  const actionType = {
    RETRIEVE: "抽單",
    DISCARD: "作廢"
  };
  confirmTitle.value = `您確定要將 Y${String(productPromo.value.year).substring(
    2,
    4
  )}Q${productPromo.value.quarter} 底價促案${actionType[type]}？`;
};

// 抽單/作廢
const actionConfirm = type => {
  actionConfirmTitle(type);
  actionType.value = type;
  actionInvalidDialog.value = true;
};

// 過濾
const setPromo = async event => {
  auditList.value = [];
  checkboxType.value.forEach(item => {
    if (item.checked) {
      auditList.value.push(item.value);
      if (item.value === 5) auditList.value.push(4);
    }
  });
  if (auditList.value.every(item => item.checked === true)) {
    event.target.checked = true;
    return;
  }
  await getPromoList();
};

onMounted(async () => {
  await getPromoList();
  if (editProductPromoId.value) {
    checkboxType.value.forEach(item => {
      item.value === productPromoEffectStore.audit
        ? (item.checked = true)
        : (item.checked = false);
    });
  }

  if (productPromoList.value.length > 0)
    activePromoListTable.value.bodyWrapper.scrollLeft += 1;
});
</script>

<style lang="scss" scoped>
.add_reserve_price_main {
  border-radius: 8px;
  border: solid 1px #e2e1e1;
  background-color: #fff;
  padding: 24px;

  .title_block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 30px;
    margin-bottom: 24px;
    border-bottom: 1px solid #eee;

    .invalid_copywriting {
      font-size: 14px;
      color: #ea475b;
      line-height: 1.43;
      letter-spacing: 1.43px;
    }

    div {
      &:nth-child(1) {
        font-size: 24px;
        font-weight: bold;
        line-height: 1.33;
        letter-spacing: 1.33px;
        color: #333;
      }
    }
  }

  .left_title {
    display: flex;
    align-items: baseline;
    margin-bottom: 16px;

    .title {
      font-size: 18px;
      font-weight: bold;
      line-height: 1.78;
      letter-spacing: 1px;
      color: #333;
      margin-right: 16px;
      min-width: 114px;
    }

    .current_version {
      color: #00afb8;
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
    }

    .tag {
      > div {
        &:nth-child(1) {
          display: flex;
          align-items: center;

          span {
            label {
              font-size: 16px;
              font-weight: bold;
              line-height: 1.38;
              letter-spacing: 1.38px;
            }
            &:nth-child(1) {
              label {
                color: #609af3;
              }
            }
            &:nth-child(2) {
              label {
                color: #50c0c5;
              }
            }
            &:nth-child(3) {
              label {
                color: #9bdc67;
              }
            }
            &:nth-child(4) {
              label {
                color: #fb827e;
              }
            }
            &:nth-child(5) {
              label {
                color: #ffa468;
              }
            }
            &:nth-child(6) {
              label {
                color: #798596;
              }
            }
          }
        }
        &:nth-child(2) {
          span {
            cursor: pointer;
            margin-right: 12px;
            padding: 2px 8px;
            border-radius: 12px;

            &:last-child {
              margin-right: 0;
            }

            &[data-audit="0"] {
              color: #50c0c5;
              border: 1px solid #50c0c5;

              &:hover {
                border: 1px solid #e6f9fa;
                background-color: #e6f9fa;
              }
              &.focus {
                color: #fff;
                background-color: #39c8d0;
              }
            }
            &[data-audit="1"] {
              color: #9bdc67;
              border: 1px solid #9bdc67;

              &:hover {
                border: 1px solid #def3cd;
                background-color: #def3cd;
              }
              &.focus {
                color: #fff;
                background-color: #9bdc67;
              }
            }
            &[data-audit="2"] {
              color: #fb827e;
              border: 1px solid #fb827e;

              &:hover {
                border: 1px solid #ffd5d4;
                background-color: #ffd5d4;
              }
              &.focus {
                color: #fff;
                background-color: #fb827e;
              }
            }
            &[data-audit="3"] {
              color: #ffa468;
              border: 1px solid #ffa468;

              &:hover {
                border: 1px solid #ffe5d4;
                background-color: #ffe5d4;
              }
              &.focus {
                color: #fff;
                background-color: #ffa468;
              }
            }
            &[data-audit="4"],
            &[data-audit="5"] {
              color: #609af3;
              border: 1px solid #609af3;

              &:hover {
                border: 1px solid #d2e4ff;
                background-color: #d2e4ff;
              }
              &.focus {
                background-color: #609af3;
                color: #fff;
              }
            }
            &[data-audit="6"] {
              color: #798596;
              border: 1px solid #798596;

              &:hover {
                border: 1px solid #d3dfef;
                background-color: #d3dfef;
              }
              &.focus {
                color: #fff;
                background-color: #798596;
              }
            }
          }
        }
      }
    }
  }

  .category_block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .left {
      display: flex;
      align-items: baseline;

      .title {
        font-size: 18px;
        font-weight: bold;
        line-height: 1.78;
        letter-spacing: 1px;
        color: #333;
        margin-right: 16px;
      }
    }

    .right {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      line-height: 2;
      letter-spacing: 0.89px;

      .search {
        img {
          cursor: pointer;
        }

        .download {
          color: #0e66c7;
          cursor: pointer;
        }
      }
    }
  }

  .note_block {
    padding: 24px;
    margin-bottom: 24px;
    border-radius: 8px;
    border: solid 1px #e2e1e1;
    background-color: #e6f9fa;

    .title {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      letter-spacing: 1.38px;
      color: #00afb8;

      span {
        color: #333;
      }
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

.loading {
  margin: 88px 0;
}

.no_list_data {
  text-align: center;
  margin: 100px 0;
  font-size: 16px;
  color: #ea475b;
}

::v-deep .el-table__header {
  border-bottom: 1px solid #eee !important;

  .table_header_bg {
    height: 70px;

    th.el-table__cell {
      background-color: #f8f8f8;
      border: none;
    }
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
    &:nth-child(9),
    &:nth-child(10) {
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
</style>
