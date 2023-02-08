<template>
  <div>
    <section
      v-if="reqResRootData.reservations.length > 0"
      class="create_layout_table"
    >
      <div class="title">
        <h2>新增版位</h2>
      </div>

      <div
        v-for="(slotItem, index) in reqResRootData.reservations"
        :key="slotItem.id"
        class="create_layout_table_block"
        :class="
          index === 0
            ? `first layout_table_${slotItem.id}`
            : `multiple_slots layout_table_${slotItem.id}`
        "
      >
        <div :class="{ first: index === 0 }" class="delete_icon">
          <icon @click.native="deleteSlotItem(slotItem.id)" iconName="delete" />
        </div>

        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <th>版位<span class="necessary">*</span></th>
            <td class="ac_layout">
              <div class="w480">
                <SelectDropdown
                  @value-changed="setSelectedProjectStaff($event, index)"
                  :value="slotItem.boardName"
                  :options="slotItem.searchedProductBoardOptions"
                  :asncSearchCb="productBoardSuggest"
                  :itemIndex="index"
                  :filterable="true"
                  :remote="true"
                  :optionsAllData="true"
                  :class="{
                    error_message_border:
                      $v.reqResRootData.reservations.$each[index].boardId.$error
                  }"
                  placeholder="請輸入版位"
                />
              </div>
              <ValidationError
                :vData="$v.reqResRootData.reservations.$each[index].boardId"
                text="請選擇正確版位名稱"
              />
            </td>
          </tr>
          <tr>
            <th>商品</th>
            <td class="ac_commodity">
              <div class="w480">
                <SelectDropdown
                  :value="slotItem.productName"
                  :options="slotItem.searchedProductOptions"
                  :optionsAllData="true"
                  :disabled="slotItem.searchedProductOptions.length === 0"
                  placeholder="請選擇商品"
                  @value-changed="setSelectedProduct($event, index)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="getPjStatus !== 0">
            <th>特殊銷用</th>
            <td>
              <div
                v-for="usageItem in usageArray"
                :key="usageItem.id"
                class="contract"
              >
                <label class="mr-1">
                  <input
                    v-model="slotItem.usageType"
                    @change="changeUsageType(index)"
                    :name="`giveaway_${index}`"
                    :value="usageItem.value"
                    type="radio"
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
                  size="16"
                  class="mr-7"
                />
                <span v-if="usageItem.hasInput" class="w480">
                  <SelectDropdown
                    @value-changed="
                      setSelectedProductUsage(
                        $event,
                        index,
                        usageItem.key,
                        usageItem.field
                      )
                    "
                    :value="slotItem[usageItem.key]"
                    :options="slotItem.searchedProductUsageOptions"
                    :asncSearchCb="projectSearch"
                    :itemIndex="index"
                    :filterable="true"
                    :remote="true"
                    :optionsAllData="true"
                    :disabled="slotItem.usageType !== usageItem.value"
                    placeholder="請輸入專案名稱"
                    :class="{
                      error_message_border:
                        $v.reqResRootData.reservations.$each[index][
                          usageItem.key
                        ].$error
                    }"
                  />
                </span>
                <div
                  v-if="
                    (usageItem.key === 'usageName' ||
                      usageItem.key === 'deductionName') &&
                      slotItem.usageType === usageItem.value &&
                      reqResRootData.reservations[index].customerId &&
                      reqResRootData.reservations[index].customerId !==
                        customerId
                  "
                  class="usage-error mt-2 necessary"
                >
                  您設定銷用不同企業，送出前請確認
                </div>
                <span v-if="usageItem.prompt" class="prompt">
                  {{ usageItem.prompt }}
                </span>
                <div class="usage-error">
                  <ValidationError
                    v-if="
                      $v.reqResRootData.reservations.$each[index][usageItem.key]
                    "
                    :vData="
                      $v.reqResRootData.reservations.$each[index][usageItem.key]
                    "
                    text="請輸入專案名稱"
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr
            v-for="(dateItem, dateItemIndex) in slotItem.periods"
            :key="dateItem.id"
          >
            <th>日期<span class="necessary">*</span></th>
            <td class="date_td">
              <div class="expiration">
                走期
                <input
                  v-model="dateItem.timeDay"
                  v-numberOnly
                  :oninput="
                    getOnInput(dateItem, dateItem.timeDay, index, dateItemIndex)
                  "
                  :max="maxBookingDays(dateItem)"
                  min="1"
                  type="number"
                  placeholder="天數"
                />
                天
              </div>
              <div>
                <DatePicker
                  :getSearchTime="getTime"
                  :itemIndex="index"
                  :dateItemIndex="dateItemIndex"
                  :schedule="changeSchedule"
                  :timeDay="dateItem.timeDay"
                  :reservation="true"
                  :class="{
                    error_message_border:
                      $v.reqResRootData.reservations.$each[index].periods.$each[
                        dateItemIndex
                      ].start.$error
                  }"
                />
                <ValidationError
                  :vData="
                    $v.reqResRootData.reservations.$each[index].periods.$each[
                      dateItemIndex
                    ].start
                  "
                  text="請選擇時間"
                />
              </div>
              <div class="createDeleteBlock">
                <icon
                  v-if="slotItem.periods.length > 1"
                  @click.native="deleteDate(index, dateItem.id)"
                  iconName="icon-x-border"
                />
                <icon
                  v-if="
                    slotItem.periods.length === dateItemIndex + 1 &&
                      slotItem.periods.length <= 20
                  "
                  @click.native="createDate(index, dateItem.id)"
                  iconName="icon-plus-border"
                />
              </div>
            </td>
          </tr>
          <tr>
            <th>備註</th>
            <td>
              <el-input
                v-model="slotItem.note"
                @input="filterValue(index)"
                show-word-limit
                type="textarea"
                placeholder="請輸入"
                maxlength="200"
              />
              <ValidationError
                :vData="$v.reqResRootData.reservations.$each[index].note"
                text="請填入PR原因"
              />
            </td>
          </tr>
        </table>
      </div>

      <div class="create_layout_button_block">
        <button class="button_bg_white_large" @click="cancel">取消</button>
        <button class="button_bg_blue_large" @click="save">儲存</button>
      </div>
    </section>

    <div v-if="haveCreateIcon && getPjStatus !== -1" class="create_layout">
      <button
        @click="createLayout(itemIdNumber)"
        :class="
          newPjServiceValue === 'create'
            ? 'button_bg_white_large_disable'
            : 'button_bg_white_large'
        "
        :disabled="newPjServiceValue === 'create' ? true : false"
      >
        +新增版位
      </button>
    </div>

    <Dialog
      v-if="addExceed"
      @dialogCancel="closeAddExceed"
      @dialogConfirm="closeAddExceed"
      :isShow="addExceed"
      :cancelButton="false"
      componentKey="addExceed"
      key="addExceed"
      title="新增版位最多只能20組！"
      content="批次最多只能20組！"
    />

    <Dialog
      v-if="addedSuccessfully"
      @dialogCancel="closeAddedSuccessfully"
      @dialogConfirm="closeAddedSuccessfully"
      :isShow="addedSuccessfully"
      :cancelButton="false"
      :content="`已預約成功 ${formalCount} 筆版位，備取 ${prepareCount} 筆版位`"
      :theEssential="`${prepareCount > 0 ? '提醒您有檔期為備取' : ''}`"
      componentKey="addedSuccessfully"
      key="addedSuccessfully"
      title="您已完成版位預約！"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { numberOnly } from "@/directives/numberOnly";
import { required, requiredIf } from "vuelidate/lib/validators";
import { checkStartDate } from "@/utils/dateFormat";
import DatePicker from "@/components/DatePicker.vue";
import ValidationError from "@/components/ValidationError";
import Dialog from "@/components/Dialog.vue";
import userAuthority from "@/utils/userAuthority";
import { getMaxBookingDays } from "@/utils/dateFormat";
import SelectDropdown from "@/components/share/SelectDropdown";
import { utilsFilterSpecifiedSymbols } from "@/utils/utilsFilterSpecifiedSymbols";

export default {
  name: "AddSlot",
  data() {
    return {
      itemIdNumber: 0,
      reqResRootData: {
        projectId: "",
        reservations: []
      },
      addExceed: false,
      addedSuccessfully: false,
      formalCount: "",
      prepareCount: ""
    };
  },
  props: {
    newPjServiceValue: {
      type: String
    },
    projectId: {
      type: Number,
      required: true
    },
    customerId: {
      type: [String, Number],
      required: true
    },
    projectStatus: {
      type: Number,
      required: true
    },
    usageArray: {
      type: Array
    }
  },
  mounted() {
    const { reqResRootData, projectId } = this;
    reqResRootData.projectId = projectId;
  },
  computed: {
    ...mapGetters("user", ["getUserStatus"]),
    ...mapGetters("project", ["getProjectData"]),
    getProjectFreeProject() {
      return this.getProjectData.projectId.freeProject;
    },
    getPjStatus() {
      return this.projectStatus;
    },
    // 是否出現新增
    haveCreateIcon() {
      const { getUserStatus } = this;
      const userAuthorityData = userAuthority[getUserStatus.role];
      if (userAuthorityData.pjmanageEdit) {
        if (
          userAuthorityData.pjmanageEdit_3 ||
          userAuthorityData.pjmanageEdit_4 ||
          (userAuthorityData.pjmanageEdit_2 &&
            this.getProjectData.projectId.owner === getUserStatus.accountId)
        ) {
          return true;
        }
      }
      return false;
    }
  },
  components: {
    DatePicker,
    ValidationError,
    Dialog,
    SelectDropdown
  },
  directives: { numberOnly },
  validations: {
    reqResRootData: {
      reservations: {
        $each: {
          boardId: {
            required
          },
          periods: {
            $each: {
              start: { required, checkStartDate }
            }
          },
          usageName: {
            required: requiredIf(
              currentReservation => currentReservation.usageType == 1
            )
          },
          deductionName: {
            required: requiredIf(
              currentReservation => currentReservation.usageType == 3
            )
          },
          note: {
            required: requiredIf(
              currentReservation => currentReservation.usageType == 2 // 選擇成效PR時，備註必填
            )
          }
        }
      }
    }
  },
  methods: {
    ...mapActions("reservation", [
      "postReservation",
      "getReservation",
      "resetReservation"
    ]),
    ...mapActions("product", ["getProductBoardSuggest"]),
    ...mapActions("project", ["getProjectSearch", "getProjectId"]),
    // 銷用 Autocomplete
    async projectSearch(keyword, index) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { getProjectSearch, customerId, projectId } = this;
        const { reservations } = this.reqResRootData;
        const responseData = await getProjectSearch({
          keyword,
          customerId,
          excludeProject: projectId
        });
        reservations[index].searchedProductUsageOptions = [...responseData].map(
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
    setSelectedProductUsage(data, index, key, field) {
      const { reservations } = this.reqResRootData;

      reservations[index][key] = reservations[
        index
      ].searchedProductUsageOptions.find(
        option => option.label === data.label
      ).label;

      reservations[index][field] = reservations[
        index
      ].searchedProductUsageOptions.find(
        option => option.value === data.value
      ).value;

      reservations[index].customerId = data.customerId;
      reservations[index].giveaway = false;
    },
    // 版位
    async productBoardSuggest(keyword, index) {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const { getProductBoardSuggest } = this;
        const { reservations } = this.reqResRootData;
        const responseData = await getProductBoardSuggest({
          keyword,
          checkPermission: true
        });
        reservations[index].searchedProductBoardOptions = [...responseData].map(
          item => {
            return {
              ...item,
              value: item.boardId,
              label: `${item.device}/${item.channelName}/${item.name}`
            };
          }
        );
      }
    },
    // 版位 Autocomplete
    setSelectedProjectStaff(data, index) {
      const { reservations } = this.reqResRootData;
      reservations[index].boardId = data.boardId;
      reservations[index].boardName = data.label;
      reservations[index].productId = data.productList[0].id;
      reservations[index].productName = data.productList[0].name;
      reservations[index].searchedProductOptions = data.productList.map(
        product => ({
          ...product,
          value: product.id,
          label: product.name
        })
      );
    },
    // 商品
    setSelectedProduct(data, index) {
      const { reservations } = this.reqResRootData;
      reservations[index].productId = data.id;
      reservations[index].productName = data.name;
    },
    // 取得時間
    getTime(time) {
      const { reservations } = this.reqResRootData;
      reservations[time.itemIndex].periods[time.dateItemIndex].start =
        time.searchTimeStart;
      reservations[time.itemIndex].periods[time.dateItemIndex].end =
        time.searchTimeEnd;
    },
    // 新增版位
    async createLayout(idNumber) {
      const { reqResRootData, itemIdNumber } = this;

      if (reqResRootData.reservations.length < 20) {
        // 批次新增版位
        await reqResRootData.reservations.push({
          id: itemIdNumber,
          searchedProductBoardOptions: [],
          searchedProductOptions: [],
          boardName: "",
          boardId: "",
          giveaway: false,
          periods: [
            {
              id: 0,
              end: "",
              start: "",
              timeDay: ""
            }
          ],
          productId: "",
          productName: "",
          searchedProductUsageOptions: [],
          usageName: "",
          usage: 0,
          note: "",
          deduction: 0,
          deductionName: "",
          usageType: 0
        });

        document
          .querySelector(`.layout_table_${idNumber}`)
          .scrollIntoView(true);

        this.itemIdNumber += 1;
      } else {
        this.addExceed = true;
      }
    },
    // 取消
    cancel() {
      const { $v, reqResRootData } = this;
      const reservationsValidation = $v.reqResRootData.reservations;
      reservationsValidation.$reset();
      reqResRootData.reservations = [];
    },
    // 儲存
    save() {
      const {
        $v,
        reqResRootData,
        projectId,
        resetReservation,
        postReservation,
        cancel,
        getReservation,
        getProjectId
      } = this;
      const reservationsValidation = $v.reqResRootData.reservations;
      reservationsValidation.$touch();
      if (reservationsValidation.$error) return;

      let querySlot = reqResRootData;
      const reservationQuery = {
        page: 1,
        size: 20,
        projectId,
        type: 1
      };

      // 清空列表
      resetReservation();

      // 新增預約檔期
      postReservation(querySlot).then(res => {
        this.addedSuccessfully = true;
        this.formalCount = res.formalCount;
        this.prepareCount = res.prepareCount;
        // 新增後讓新增版位區塊驗證表單要重新點擊
        cancel();
        // 重新讀專案資料
        getProjectId({ projectId });
        // 重新讀取列表資料，取得正取資料列表
        getReservation(reservationQuery);
        // 重新讀取列表資料，取得備取資料列表
        getReservation({
          ...reservationQuery,
          type: 0
        });
      });
    },
    // 刪除批次版位
    deleteSlotItem(index) {
      const { reqResRootData } = this;
      reqResRootData.reservations = reqResRootData.reservations.filter(e => {
        return index !== e.id;
      });
    },
    // 新增日期
    createDate(index, id) {
      const { reservations } = this.reqResRootData;
      reservations[index].periods.push({
        id: id + 1,
        timeDay: "",
        start: "",
        end: ""
      });
    },
    // 刪除日期
    deleteDate(index, itemIndex) {
      const { reservations } = this.reqResRootData;
      reservations[index].periods = reservations[index].periods.filter(e => {
        return itemIndex !== e.id;
      });
    },
    // 走期連動
    changeSchedule(diffDay, index, dateItemIndex) {
      const { reservations } = this.reqResRootData;
      reservations[index].periods[dateItemIndex].timeDay = diffDay;
    },
    // 關閉 Dialog
    closeAddExceed() {
      this.addExceed = false;
    },
    // 關閉 Dialog
    closeAddedSuccessfully() {
      this.addedSuccessfully = false;
    },
    // 取走期最多幾天(選擇)
    maxBookingDays(day) {
      return getMaxBookingDays(day.start) + 1;
    },
    // 取走期最多幾天(手輸入)
    getOnInput(day, timeDay, index, dateItemIndex) {
      const maxDay = getMaxBookingDays(day.start) + 1;
      this.reqResRootData.reservations[index].periods[dateItemIndex].timeDay =
        Number(timeDay) > maxDay ? String(maxDay) : String(timeDay);
      if (timeDay.length > 3) timeDay = timeDay.slice(0, 3);
    },
    // 過濾指定符號
    filterValue(index) {
      const { reservations } = this.reqResRootData;
      reservations[index].note = utilsFilterSpecifiedSymbols(
        reservations[index].note
      );
    },
    // 銷用切換
    changeUsageType(index) {
      const { $v, reqResRootData, getProjectFreeProject } = this;
      reqResRootData.reservations[index].usage = 0;
      reqResRootData.reservations[index].usageName = "";
      reqResRootData.reservations[index].deduction = 0;
      reqResRootData.reservations[index].deductionName = "";
      reqResRootData.reservations[index].giveaway = false;
      reqResRootData.reservations[index].customerId = null;

      if (
        reqResRootData.reservations[index].usageType === 2 &&
        !getProjectFreeProject
      )
        reqResRootData.reservations[index].giveaway = true;

      $v.reqResRootData.reservations.$reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.create_layout_table {
  border-radius: 8px;
  border: solid 2px #34bec5;
  background-color: #fff;
  margin-top: 20px;
  padding: 24px 0;

  .title {
    padding-left: 100px;
    position: absolute;

    img {
      cursor: pointer;
    }
  }

  .create_layout_table_block {
    background-color: #f2fcfc;
    padding: 0 100px;
    margin-bottom: 24px;

    .delete_icon {
      text-align: right;
      cursor: pointer;
      padding-top: 24px;

      &.first {
        padding-top: 0;
      }
    }

    table {
      text-align: left;
      width: 800px;
      margin-top: 24px;

      tr {
        display: flex;
        align-items: self-start;
        margin-bottom: 24px;

        &:nth-child(3),
        &:last-child {
          th {
            padding-top: 0;
          }
        }

        &:nth-child(3) {
          td {
            padding-left: 8px;
          }
        }

        th {
          width: 100px;
          font-size: 18px;
          letter-spacing: 1px;
          color: #333;
          padding-top: 6px;
        }

        td {
          font-size: 16px;
          letter-spacing: 0.89px;
          color: #333;
          vertical-align: 20px;

          .contract {
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: 100px auto 480px;
            align-items: center;

            .usage-error {
              grid-column: 3;
            }

            .prompt {
              grid-column: 3;
            }

            &:last-child {
              margin-bottom: 4px;
            }
          }

          .w480 {
            display: inline-block;
            width: 480px;
          }

          &.date_td {
            width: 700px;
            border-bottom: solid 1px #d9d9d9;
            padding-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .expiration {
              input {
                width: 76px;
                text-align: left;
              }
            }

            .createDeleteBlock {
              min-width: 76px;
              text-align: right;

              img {
                cursor: pointer;

                &:nth-child(2) {
                  margin-left: 12px;
                }
              }
            }

            ::v-deep {
              .el-date-editor--daterange {
                &.el-input__inner {
                  width: 400px;
                }
              }
            }
          }
        }
      }
    }

    &.first {
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 0;
      padding-bottom: 0;
    }
  }

  .create_layout_button_block {
    text-align: center;

    button {
      &:first-child {
        margin-right: 30px;
      }
    }
  }

  ::v-deep {
    .el-textarea {
      .el-textarea__inner {
        width: 700px;
        height: 76px;
      }
    }
  }
}

.create_layout {
  margin: 24px 0 0;
  text-align: right;
}

.multiple_slots {
  input {
    background-color: #fff;
  }

  ::v-deep {
    .el-input__inner {
      background-color: #fff !important;
    }

    .el-date-editor {
      &.el-range-editor {
        background-color: #fff !important;
      }

      .el-range-input {
        background-color: #fff !important;
      }
    }

    .el-input {
      &.is-disabled {
        .el-input__inner {
          color: #a9a9a9 !important;
          background-color: #fff !important;
        }
      }
    }
  }
}
</style>
