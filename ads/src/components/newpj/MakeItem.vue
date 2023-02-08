<template>
  <tbody class="ready">
    <tr class="item">
      <td>
        <icon
          v-if="data.groupCount > 1"
          iconName="icon-icon-linksame"
          style="width:36px"
        />
        <span v-else-if="isCollapsed && data.groupCount === 1"></span>
        <div
          v-tooltip="
            data.productName
              ? {
                  offset: 0,
                  content: productTooltip,
                  placement: 'bottom-start',
                  trigger: 'hover'
                }
              : null
          "
        >
          {{ `${data.device}/${data.channelName}/${data.boardName}` }}
        </div>
      </td>
      <td>
        <div class="date px-3">
          {{ data.startDate }}
        </div>
      </td>
      <td>
        <div class="date px-3">
          {{ data.endDate }}
        </div>
      </td>
      <td>
        <TdFullText
          class="name mx-3"
          :class="showProcedure ? 'use-sm' : 'use-lg'"
        >
          {{ data.deductionDescption || data.usageDescption || "原合約" }}
        </TdFullText>
      </td>
      <td v-if="showProcedure">
        <div class="status">
          {{ statusDescription[data.status] }}
        </div>
      </td>
      <td v-if="getCaseClosedAndVoidStatus">
        <div class="edit px-3">
          <icon
            v-if="!data.canEditUsage && !data.canEditDate && !data.canEditNote"
            iconName="edit-disable"
            size="28"
          />
          <icon
            v-else
            @click.native="layoutEdit"
            iconName="edit"
            class="canEdit"
            size="28"
          />
        </div>
      </td>
      <td v-if="getCaseClosedAndVoidStatus">
        <div class="edit px-3">
          <icon v-if="!data.deletable" iconName="delete-disable" size="28" />
          <icon
            v-else
            @click.native="handleBoardDelete"
            iconName="delete"
            class="canEdit"
            size="28"
          />
          <Dialog
            v-if="boardDelete"
            @dialogCancel="handleCancelDelete"
            @dialogConfirm="handleSaveDelete"
            :isShow="boardDelete"
            componentKey="boardDelete"
            key="boardDelete"
            title="您要刪除版位嗎?"
            content="確認刪除版位。"
          />
        </div>
      </td>
      <td v-if="getCaseClosedOrVoidStatus" class="p-3">
        <img @click="layoutEdit" :src="getEyeImg" class="canEdit" />
      </td>
    </tr>

    <tr v-if="openMakeItemEdit" class="edit_block">
      <td
        class="editItem"
        :class="{ case_closed_td: !getCaseClosedAndVoidStatus }"
        :colspan="ItemEditColspan"
      >
        <div v-if="data.offDate" class="not_editable_message">
          {{ data.offDate }} 緊急下架
        </div>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <th>商品</th>
            <td
              class="ac_commodity"
              :class="{ case_closed: !getCaseClosedAndVoidStatus }"
            >
              {{ data.productName }}
            </td>
          </tr>
          <tr>
            <th>特殊銷用</th>
            <td>
              <div
                v-for="usageItem in usageArray"
                :key="usageItem.id"
                class="contract"
              >
                <label class="ad-radio-label">
                  <input
                    v-model="modifyReservation.usageType"
                    :disabled="!data.canEditUsage"
                    :value="usageItem.value"
                    @change="changeUsageType()"
                    type="radio"
                    name="text"
                  />
                  <span class="ad-radio"></span>{{ usageItem.label }}
                </label>
                <icon
                  v-if="usageItem.tooltip"
                  v-tooltip="{
                    placement: 'right',
                    offset: 5,
                    content: usageItem.tooltip,
                    trigger: 'hover'
                  }"
                  iconName="ic-help-outline"
                  class="mr-7"
                  size="16"
                />
                <span
                  v-if="getCaseClosedAndVoidStatus && usageItem.hasInput"
                  class="w480"
                >
                  <SelectDropdown
                    @value-changed="
                      setSelectedProductUsage(
                        $event,
                        usageItem.key,
                        usageItem.field
                      )
                    "
                    :value="modifyReservation[usageItem.key]"
                    :options="modifyReservation.searchedProductUsageOptions"
                    :asncSearchCb="projectSearch"
                    :disabled="
                      !data.canEditUsage ||
                        modifyReservation.usageType !== usageItem.value
                    "
                    :filterable="true"
                    :remote="true"
                    :optionsAllData="true"
                    placeholder="請輸入專案名稱"
                    :class="{
                      error_message_border:
                        $v.modifyReservation[usageItem.key].$error
                    }"
                  />
                </span>
                <span v-if="usageItem.prompt">
                  {{ usageItem.prompt }}
                </span>
                <div
                  v-if="
                    (usageItem.key === 'usageName' ||
                      usageItem.key === 'deductionName') &&
                      modifyReservation.usageType === usageItem.value &&
                      exposureProjectCustomerId &&
                      customerId !== exposureProjectCustomerId
                  "
                  class="usage-error mt-2 necessary"
                >
                  您設定銷用不同企業，送出前請確認
                </div>
                <div class="usage-error">
                  <ValidationError
                    v-if="$v.modifyReservation[usageItem.key]"
                    :vData="$v.modifyReservation[usageItem.key]"
                    text="請輸入專案名稱"
                  />
                </div>
                <span v-if="getCaseClosedOrVoidStatus" class="case_closed">
                  {{ modifyReservation[usageItem.key] }}
                </span>
              </div>
            </td>
          </tr>
          <tr class="dateTr">
            <th>日期<span class="necessary">*</span></th>
            <td class="date_td">
              <div>
                走期
                <input
                  v-if="getCaseClosedAndVoidStatus"
                  v-model="days"
                  :disabled="!data.canEditDate"
                  :max="maxBookingDays(modifyReservation.startDate)"
                  :oninput="getOnInput(days)"
                  v-numberOnly
                  min="1"
                  type="number"
                  placeholder="天數"
                  widthType="76"
                />
                <span v-if="getCaseClosedOrVoidStatus" class="case_closed">
                  {{ days }}
                </span>
                天
              </div>
              <div>
                <DatePicker
                  v-if="getCaseClosedAndVoidStatus"
                  :getSearchTime="getTime"
                  :schedule="changeSchedule"
                  :timeDay="days"
                  :dateInterval="[
                    modifyReservation.startDate,
                    modifyReservation.endDate
                  ]"
                  :disabled="!data.canEditDate"
                  :reservation="true"
                  :class="{
                    error_message_border: $v.modifyReservation.startDate.$error
                  }"
                />
                <ValidationError
                  :vData="$v.modifyReservation.startDate"
                  text="請選擇時間"
                />
                <span v-if="getCaseClosedOrVoidStatus">
                  <span class="case_title">開始日期</span>
                  <span class="case_closed">{{ data.startDate }}</span>
                  <span class="case_wave">~</span>
                  <span class="case_title">結束日期</span>
                  <span class="case_closed">{{ data.endDate }}</span>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <th>備註</th>
            <td>
              <el-input
                v-if="getCaseClosedAndVoidStatus"
                v-model="modifyReservation.note"
                :disabled="!data.canEditNote"
                @input="filterValue"
                show-word-limit
                type="textarea"
                placeholder="請輸入"
                maxlength="200"
              />
              <ValidationError
                :vData="$v.modifyReservation.note"
                text="請填入PR原因"
              />
              <div v-if="getCaseClosedOrVoidStatus" class="case_closed">
                {{ modifyReservation.note || "無" }}
              </div>
            </td>
          </tr>
        </table>

        <div v-if="getCaseClosedAndVoidStatus" class="button_block">
          <button class="button_bg_white_restraint" @click="cancel">
            取消
          </button>
          <button class="button_bg_white_restraint" @click="save">儲存</button>
        </div>

        <Dialog
          v-if="boardSave"
          @dialogCancel="handleSaveSave"
          @dialogConfirm="handleSaveSave"
          :isShow="boardSave"
          :cancelButton="false"
          :title="
            `已儲存${data.device}/${data.channelName}/${data.boardName} (${modifyReservation.startDate}~${modifyReservation.endDate})`
          "
          componentKey="boardSave"
          key="boardSave"
          content="確認儲存版位。"
        />
      </td>
    </tr>
  </tbody>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { numberOnly } from "@/directives/numberOnly";
import { EventBus } from "@/utils/eventBus.js";
import { required, requiredIf } from "vuelidate/lib/validators";
import { checkStartDate } from "@/utils/dateFormat";
import DatePicker from "@/components/DatePicker.vue";
import ValidationError from "@/components/ValidationError";
import { getMaxBookingDays } from "@/utils/dateFormat";
import SelectDropdown from "@/components/share/SelectDropdown";
import Dialog from "@/components/Dialog.vue";
import TdFullText from "@/components/share/TdFullText";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";

export default {
  name: "MakeItem",
  components: {
    DatePicker,
    ValidationError,
    SelectDropdown,
    Dialog,
    TdFullText
  },
  data() {
    return {
      openMakeItemEdit: false,
      days: "",
      offDate: "",
      modifyReservation: {
        endDate: "",
        giveaway: "",
        note: "",
        startDate: "",
        usage: "",
        usageName: "",
        searchedProductUsageOptions: [],
        deduction: "",
        deductionName: "",
        usageType: 0,
        productId: "",
        productName: ""
      },
      boardDelete: false,
      boardSave: false,
      statusDescription: {
        "-1": "緊急下架",
        "0": "未拉cue",
        "1": "未拉cue",
        "2": "已拉CUE",
        "3": "已上素材",
        "4": "上刊中",
        "5": "上刊結束"
      },
      productOptions: [],
      exposureProjectCustomerId: null
    };
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    customerId: {
      type: [String, Number],
      required: true,
      default: 0
    },
    projectId: {
      type: Number,
      required: true,
      default: 0
    },
    showProcedure: {
      type: Boolean,
      default: false
    },
    distinguish: {
      type: String
    },
    usageArray: {
      type: Array
    },
    isCollapsed: {
      type: Boolean
    }
  },
  computed: {
    ...mapState(["project"]),
    getProjectStatus() {
      return this.project.projectId.status;
    },
    getEyeImg() {
      return this.openMakeItemEdit
        ? require("@/assets/icon/eye-show.svg")
        : require("@/assets/icon/eye-show-g.svg");
    },
    ItemEditColspan() {
      const { getProjectStatus, showProcedure } = this;
      return getProjectStatus !== 2 && getProjectStatus !== -1
        ? showProcedure
          ? 7
          : 6
        : 5;
    },
    // 取得不等於結案與不等於作廢狀態值
    getCaseClosedAndVoidStatus() {
      const { getProjectStatus } = this;
      return getProjectStatus !== 2 && getProjectStatus !== -1;
    },
    // 取得結案或作廢狀態值
    getCaseClosedOrVoidStatus() {
      const { getProjectStatus } = this;
      return getProjectStatus === 2 || getProjectStatus === -1;
    },
    productTooltip() {
      let html = "<div class='mb-1'>商品：</div>";
      html += `<div class='mb-1'>${this.data.productName}</div>`;
      return html;
    }
  },
  created() {
    EventBus.$on("closeMakeItemEdit", () => {
      this.openMakeItemEdit = false;
    });
  },
  beforeMount() {
    const { reLoadingData } = this;
    reLoadingData();
  },
  directives: { numberOnly },
  validations: {
    modifyReservation: {
      usageName: {
        required: requiredIf(
          modifyReservation => modifyReservation.usageType == 1
        )
      },
      deductionName: {
        required: requiredIf(
          modifyReservation => modifyReservation.usageType == 3
        )
      },
      startDate: { required, checkStartDate },
      note: {
        required: requiredIf(
          modifyReservation => modifyReservation.usageType == 2 // 選擇成效PR時，備註必填
        )
      }
    }
  },
  methods: {
    ...mapActions("reservation", [
      "resetReservation",
      "patchReservation",
      "deleteReservation",
      "getReservation"
    ]),
    ...mapActions("project", ["getProjectSearch", "getProjectId"]),
    ...mapActions("product", ["getProductsByBoard"]),
    // 銷用 Autocomplete
    async projectSearch(keyword) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { getProjectSearch, customerId, projectId } = this;
        const { modifyReservation } = this;
        const responseData = await getProjectSearch({
          keyword,
          customerId,
          excludeProject: projectId
        });
        modifyReservation.searchedProductUsageOptions = [...responseData].map(
          item => {
            return {
              value: item.id,
              label: item.name,
              customerId: item.customerId
            };
          }
        );
      }
    },
    // 銷用
    setSelectedProductUsage(data, key, field) {
      const { modifyReservation } = this;

      this.exposureProjectCustomerId = data.customerId;

      modifyReservation[
        key
      ] = modifyReservation.searchedProductUsageOptions.find(
        option => option.label === data.label
      ).label;

      modifyReservation[
        field
      ] = modifyReservation.searchedProductUsageOptions.find(
        option => option.value === data.value
      ).value;

      modifyReservation.giveaway = false;
    },
    // 讀取編修資料
    reLoadingData() {
      const { modifyReservation, data } = this;
      modifyReservation.startDate = data.startDate;
      modifyReservation.endDate = data.endDate;
      modifyReservation.giveaway =
        data.usageDescption === "成效PR" || data.usageDescption === "內部"
          ? true
          : false;
      modifyReservation.note = data.note;
      modifyReservation.usage = data.usage;
      modifyReservation.deduction = data.deduction;
      modifyReservation.productId = data.productId;
      modifyReservation.productName = data.productName;
      data.usage !== 0
        ? (modifyReservation.usageName = data.projectName)
        : (modifyReservation.usageName = "");
      data.deduction !== 0
        ? (modifyReservation.deductionName = data.projectName)
        : (modifyReservation.deductionName = "");

      if (data.projectType == 1) {
        /* 空版PR */
        modifyReservation.usageType =
          this.data.usage == 0
            ? 2 // 空版PR, 如果是內部 value = 2
            : 1;
      } else {
        modifyReservation.usageType = 0;
        if (modifyReservation.usage > 0) modifyReservation.usageType = 1; // usage > 0 => 有銷用，曝光專案
        if (modifyReservation.giveaway) modifyReservation.usageType = 2; // giveaway: true => 成效PR
        if (modifyReservation.deduction > 0) modifyReservation.usageType = 3; // deduction > 0 => 舊單PR
      }

      this.days = String(data.days);
      this.offDate = data.offDate;
    },
    // 編輯版位
    layoutEdit() {
      // 先關閉其他的，再打開自己的
      EventBus.$emit("closeMakeItemEdit");
      this.openMakeItemEdit = !this.openMakeItemEdit;
    },
    // 刪除版位
    layoutDelete() {
      const { deleteReservation, data, getProjectId, projectId } = this;
      deleteReservation({ id: data.reservationId }).then(() => {
        this.$emit("getListData");
        // 重新讀專案資料
        getProjectId({ projectId });
      });
    },
    // 取得時間
    getTime(time) {
      const { modifyReservation } = this;
      modifyReservation.startDate = time.searchTimeStart;
      modifyReservation.endDate = time.searchTimeEnd;
    },
    // 取消
    cancel() {
      this.reLoadingData();
      this.openMakeItemEdit = false;
    },
    // 儲存
    save() {
      const { $v, data, patchReservation, modifyReservation } = this;
      const modifyReservationValidation = $v.modifyReservation;
      const patchReservationFunc = () => {
        patchReservation({
          id: data.reservationId,
          ...modifyReservation
        }).then(() => {
          this.boardSave = true;
        });
      };

      // 可編輯需擋起始日與銷用，不可編不用擋，避免無法送出
      if (data.canEditDate || data.canEditUsage) {
        modifyReservationValidation.$touch();
        if (!modifyReservationValidation.$error) {
          patchReservationFunc();
        }
      } else {
        patchReservationFunc();
      }
    },
    // 走期連動
    changeSchedule(diffDay) {
      this.days = diffDay;
    },
    // 取走期最多幾天(選擇)
    maxBookingDays(startDate) {
      return getMaxBookingDays(startDate) + 1;
    },
    // 取走期最多幾天(手輸入)
    getOnInput(timeDay) {
      const maxDay = getMaxBookingDays(this.modifyReservation.startDate) + 1;
      this.days = Number(timeDay) > maxDay ? String(maxDay) : String(timeDay);
      if (timeDay.length > 3) timeDay = timeDay.slice(0, 3);
    },
    // 刪除 icon
    handleBoardDelete() {
      this.boardDelete = true;
    },
    // 取消刪除
    handleCancelDelete() {
      this.boardDelete = false;
    },
    // 確認刪除
    handleSaveDelete() {
      this.layoutDelete();
    },
    // 確認儲存
    handleSaveSave() {
      const { getProjectId, projectId } = this;
      this.$emit("getListData");

      // 重新讀專案資料
      getProjectId({ projectId });
      this.openMakeItemEdit = false;
      this.boardSave = false;
    },
    // 過濾指定符號
    filterValue() {
      this.modifyReservation.note = utilsFilterSpecifiedSymbols(
        this.modifyReservation.note
      );
    },
    // 銷用切換
    changeUsageType() {
      const { modifyReservation, data } = this;

      modifyReservation.usage = 0;
      modifyReservation.usageName = "";
      modifyReservation.deduction = 0;
      modifyReservation.deductionName = "";
      modifyReservation.giveaway = false;
      this.exposureProjectCustomerId = null;

      if (modifyReservation.usageType === 2 && data.projectType === 0)
        modifyReservation.giveaway = true;

      this.$v.modifyReservation.$reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.notReady,
.ready {
  tr {
    &.item {
      &:hover {
        background-color: #e6f9fa;
      }

      td {
        border-bottom: 1px solid #eee;
        font-size: 16px;
        line-height: 1.35;
        letter-spacing: 1px;
        align-items: center;

        &:nth-child(1) {
          img {
            vertical-align: bottom;
            height: 24px;
            padding-left: 12px;
          }
          span {
            display: inline-block;
            width: 36px;
          }
          div {
            display: inline;
          }
        }

        div {
          padding: 13px 0;
        }

        &:nth-last-child(1),
        &:nth-last-child(2) {
          width: 64px;
          text-align: center;

          img {
            &.canEdit {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

.notReady {
  tr {
    &.item {
      td {
        div {
          &.name {
            // width: 445px;
            width: min-content;
          }
          &.date {
            width: 126px;
          }
          &.use {
            &-sm {
              width: 111px;
            }
            &-lg {
              width: 111px;
            }
          }
          &.status {
            width: 94px;
            padding: 0 11px 0 12px;
          }
          &.edit {
            padding: 0;
            width: 46px;
          }
        }
      }
    }
  }
}

.ready {
  tr {
    &.item {
      td {
        div {
          &.name {
            // width: 347px;
            width: min-content;
          }
          &.date {
            width: 126px;
          }
          &.use {
            &-sm {
              width: 111px;
            }
            &-lg {
              width: 270px;
            }
          }
          &.status {
            width: 94px;
            padding: 0 11px 0 12px;
          }
          &.edit {
            padding: 0;
            width: 48px;
          }
        }
      }
    }
  }
}

tr {
  &.edit_block {
    transition: height 0.5s;

    td {
      .not_editable_message {
        font-size: 14px;
        color: #ea475b;
        letter-spacing: 1.5px;
        margin-bottom: 10px;
      }

      &.editItem {
        background-color: #f8f8f8;
        padding: 20px 18px;
        position: relative;

        &::before {
          content: " ";
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 10px 10px 10px;
          border-color: transparent transparent #eee transparent;
          top: -11px;
          right: 80px;
        }

        &::after {
          content: " ";
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 10px 10px 10px;
          border-color: transparent transparent #f8f8f8 transparent;
          top: -10px;
          right: 80px;
        }

        table {
          width: 792px;

          tr {
            &:last-child {
              th {
                vertical-align: top;
              }
            }

            th {
              width: 96px;
              font-size: 16px;
              font-weight: bold;
              line-height: 1.38;
              letter-spacing: 1px;
              color: #292929;
            }

            td {
              font-size: 16px;
              letter-spacing: 0.89px;
              color: #333;
              padding-bottom: 20px;

              .contract {
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                flex-wrap: wrap;

                .usage-error {
                  padding-left: 140px;
                }

                .ad-radio-label {
                  width: 96px;
                  margin-right: 4px;
                }
              }

              .w480 {
                display: inline-block;
                width: 482px;
              }

              &.date_td {
                border-bottom: solid 1px #d9d9d9;
                padding-bottom: 16px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;

                > div {
                  &:nth-child(1) {
                    margin-right: 28px;
                  }

                  &:nth-child(2) {
                    margin-right: 58px;
                  }
                }
              }
            }
          }
        }

        .button_block {
          text-align: right;
        }

        input {
          background-color: #fff;
        }

        ::v-deep {
          .el-textarea {
            .el-textarea__inner {
              width: 700px;
              height: 76px;
            }
          }

          .el-input__inner {
            background-color: #fff !important;
          }

          .el-input {
            &.is-disabled {
              .el-input__inner {
                color: #a9a9a9 !important;
                background-color: #fff !important;
              }
            }
          }

          .el-date-editor {
            &.el-range-editor {
              background-color: #fff !important;

              &.is-disabled {
                .el-range-input {
                  color: #a9a9a9 !important;
                  background-color: #fff !important;
                }
              }
            }

            .el-range-input {
              background-color: #fff !important;
            }
          }
        }
      }

      &.case_closed_td {
        &::before {
          right: 20px;
        }

        &::after {
          right: 20px;
        }

        .case_wave {
          margin: 0 25px;
        }

        .case_title {
          margin-right: 30px;
        }

        .case_closed {
          color: #00afb8;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
