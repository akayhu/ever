<template>
  <div>
    <!-- 頻道內容 -->
    <ChannelContent :siteIdData="siteIdData" :channeIdData="channeIdData" />

    <!-- 新增廣告版位 -->
    <section v-if="isBanneredit" class="web_ad_edit_main">
      <div class="web_ad_edit_main_title">
        <h2>
          {{ channelTitle }}
          <span v-if="$route.path === '/banneredit' && !boardIdData.canDelete">
            此版位無法刪除，此版位曾經與某商品有關聯
          </span>
        </h2>
        <img
          v-if="
            $route.path === '/banneredit' &&
            boardIdData.canDelete &&
            getUserAuthority.webBoardEdit
          "
          @click="deleteBoard"
          src="@/assets/icon/delete.svg"
          class="pointer"
        />
        <img
          v-if="$route.path === '/banneredit' && !boardIdData.canDelete"
          src="@/assets/icon/delete-disable.svg"
        />
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>版位名稱<span class="necessary">*</span></td>
          <td>
            <input
              v-model="board.name"
              v-filterSpecifiedSymbols
              :class="{ error_message_border: v$.board.name.$error }"
              placeholder="請填寫"
              widthType="680"
              :disabled="!getUserAuthority.webBoardEdit"
            />
            <ValidationError
              :vData="v$.board.name"
              text="請填入版位名稱"
              maxLengthText="50"
            />
          </td>
        </tr>
        <tr>
          <td>樣式</td>
          <td>
            <input
              v-model="board.style"
              v-filterSpecifiedSymbols
              placeholder="請填寫"
              widthType="680"
              :class="{ error_message_border: v$.board.style.$error }"
              :disabled="!getUserAuthority.webBoardEdit"
            />
            <ValidationError :vData="v$.board.style" maxLengthText="50" />
          </td>
        </tr>
        <tr>
          <td>網址</td>
          <td>
            <input
              v-model="board.url"
              v-filterSpecifiedSymbols
              placeholder="請先輸入https://"
              widthType="680"
              :disabled="!getUserAuthority.webBoardEdit"
            />
          </td>
        </tr>
        <tr>
          <td>條件設定</td>
          <td class="condition">
            <SelectDropdown
              @value-changed="setConditionId($event)"
              @value-clear="clearConditionContent"
              :value="board.conditionName"
              :options="board.searchedConditionOptions"
              :optionsAllData="true"
              :clearable="true"
              placeholder="請選擇"
            />
          </td>
        </tr>
        <tr>
          <td>版位識別</td>
          <td>
            <input
              v-model="board.identify"
              widthType="680"
              placeholder="請填寫"
            />
          </td>
        </tr>
        <tr>
          <td>樣張截圖</td>
          <td class="snapshot_td">
            <SwitchCheckbox
              :checked="board.snapshot"
              @handleChange="handleSnapshotChange"
            />
          </td>
        </tr>
        <tr class="no_mb">
          <td colspan="2" class="advertising_type">
            廣告型態<span class="necessary">*</span>
            <img src="@/assets/icon/icon-info-warmgray.svg" alt="廣告型態" />
            <span class="advertising_text">請依序設定您欲開立的廣告型態</span>
          </td>
        </tr>
        <!-- 廣告型態 25 種 components -->
        <tr>
          <td colspan="2" class="ad_type_content_warp">
            <div class="type_content">
              <div class="type_first_main">
                <table cellpadding="0" cellspacing="0">
                  <!-- 既有型態 -->
                  <tr>
                    <th>既有型態</th>
                    <td class="advertising_data_input">
                      <el-select
                        v-model="board.typeId"
                        @change="handleBoardTypeIdValue"
                        :disabled="typeDisabled"
                        placeholder="請選擇"
                        name="typeId"
                      >
                        <el-option
                          v-for="item in advertisingData"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                          :disabled="item.disabled"
                        >
                        </el-option>
                      </el-select>

                      <div v-if="v$.board.typeId.$error">
                        <div
                          v-if="!v$.board.typeId.required"
                          class="error_message"
                        >
                          請選擇型態
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- 預設未選時顯示 -->
                  <tr v-if="!board.typeId || !typeData.groupList" class="no_mb">
                    <td colspan="2">
                      <div class="defaule_type">
                        請選擇上方型態，設定廣告元件。
                      </div>
                    </td>
                  </tr>

                  <!-- 型態 1~25 -->
                  <AdTypeLayout
                    v-if="board.typeId"
                    @changeBoardTypeDataFunc="changeBoardTypeGroupList"
                    @changeBoardTypeMomeFunc="changeBoardTypeMemo"
                    :boardTypeId="board.typeId"
                    :typeData="typeData"
                    :v="v$.typeValidationsValue"
                  />
                </table>
              </div>
              <div class="type_last_main">
                <!-- 預覽 -->
                <Preview
                  :boardTypeId="board.typeId"
                  :adImagePreviewNumber="adImagePreviewNumber"
                />
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td>可book數量<span class="necessary">*</span></td>
          <td class="book_quantity">
            <input
              v-model="board.reserve"
              v-filterSpecifiedSymbols
              :class="{ error_message_border: v$.board.reserve.$error }"
              placeholder="請填寫"
              widthType="122"
              :disabled="!getUserAuthority.webBoardEdit"
            />
            <span>
              則
              <img
                src="@/assets/icon/icon-info-warmgray.svg"
                alt="可book數量"
              />
              若輸入１代表固定無輪播
            </span>
            <ValidationError
              :vData="v$.board.reserve"
              text="請填寫可book數量"
            />
          </td>
        </tr>
        <tr>
          <td>呈現則數<span class="necessary">*</span></td>
          <td class="book_quantity">
            <input
              v-model="board.lowerLimit"
              v-filterSpecifiedSymbols
              :class="{ error_message_border: v$.board.lowerLimit.$error }"
              placeholder="請填寫"
              widthType="78"
              :disabled="!getUserAuthority.webBoardEdit"
              maxlength="2"
            />
            ～
            <input
              v-model="board.upperLimit"
              v-filterSpecifiedSymbols
              :class="{ error_message_border: v$.board.upperLimit.$error }"
              placeholder="請填寫"
              widthType="78"
              :disabled="!getUserAuthority.webBoardEdit"
              maxlength="2"
            />
            <span>(限填數字，左:最少0則，左邊 &lt;= 右邊)</span>
            <ValidationError
              :vData="v$.board.lowerLimit || v$.board.upperLimit"
              text="請填寫正確則數(左邊 <= 右邊)"
            />
          </td>
        </tr>
        <tr v-show="getPath !== '/banneradd'">
          <td>上線狀態<span class="necessary">*</span></td>
          <td class="switch_checkbox_block">
            <SwitchCheckbox
              :checked="board.status"
              :disabled="
                board.associateWithProduct ||
                !getUserAuthority.webBoardEdit ||
                !channeIdData.status
              "
              @handleChange="handleChange"
            />
            <span v-if="board.associateWithProduct" class="cant_change">
              此版位無法變更狀態，此版位與某商品有關聯後不可變更版位狀態
            </span>
            <span v-if="!channeIdData.status" class="cant_change">
              頻道已下線，不可變更版位狀態
            </span>
          </td>
        </tr>
        <tr>
          <td>行銷版位<span class="necessary">*</span></td>
          <td class="marketing_slot_block">
            <label class="ad-radio-label">
              <input
                v-model="board.promotion"
                @change="changePromotion"
                :value="true"
                :disabled="!getUserAuthority.webBoardEdit"
                type="radio"
                name="promotion"
              />
              <span class="ad-radio"></span>是
            </label>
            <label class="ad-radio-label">
              <input
                v-model="board.promotion"
                @change="changePromotion"
                :value="false"
                :disabled="!getUserAuthority.webBoardEdit"
                type="radio"
                name="promotion"
              />
              <span class="ad-radio"></span>否
            </label>
          </td>
        </tr>
      </table>

      <div class="button_block" v-if="getUserAuthority.webBoardEdit">
        <button @click="jump('/weblist')" class="button_bg_white_large">
          取消
        </button>
        <button
          @click="
            saveBoard(
              $route.path === '/banneredit' ? '編輯' : '新增',
              '廣告版位'
            )
          "
          class="button_bg_blue_large"
        >
          儲存
        </button>
      </div>
    </section>

    <Dialog
      v-if="openDeleteDialog"
      :showDialog="openDeleteDialog"
      :closeFunc="handleCancel"
    >
      <div class="dialog_title">
        <img src="@/assets/icon/icon-line.svg" /> 您要刪除廣告版位嗎?
      </div>
      <div class="dialog_annotation">確認廣告版位刪除狀態。</div>
      <div class="dialog_button_block">
        <button @click="handleCancel" class="button_bg_white_large">
          取消
        </button>
        <button @click="handleSaveDelete()" class="button_bg_blue_large">
          確定
        </button>
      </div>
    </Dialog>

    <Dialog
      v-if="openCompletedDeleteDialog"
      :showDialog="openCompletedDeleteDialog"
      :delayTime="true"
      :closeFunc="closeJumpFunc"
      :complete="true"
      title="已刪除完成。"
      content="您已刪除完成廣告版位。"
    />

    <Dialog
      v-if="openCompletedCreateDialog"
      :showDialog="openCompletedCreateDialog"
      :delayTime="true"
      :closeFunc="closeFunc"
      :complete="true"
      :title="`已${completedCreateName}完成。`"
      :content="`您已${completedCreateName}完成廣告版位。`"
    />
  </div>
</template>

<script>
import { ref, computed, onBeforeMount, nextTick } from "vue";
import { useRoute } from "vue-router";
import useMixins from "@/mixins/useMixins.js";
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import ChannelContent from "@/components/webAdEdit/ChannelContent.vue";
import Dialog from "@/components/Dialog.vue";
import ValidationError from "@/components/ValidationError.vue";
import AdTypeLayout from "@/components/webAdEdit/AdTypeLayout.vue";
import Preview from "@/components/webAdEdit/Preview.vue";
import { onlyEnterNumbers } from "@/utils/customValidator.js";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import SelectDropdown from "@/components/SelectDropdown.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useTypeStore } from "@/storesPinia/type.js";
import { useBoardStore } from "@/storesPinia/board.js";
import { useConditionSettingStore } from "@/storesPinia/conditionSetting.js";
import { useSiteStore } from "@/storesPinia/site.js";
import { useChannelStore } from "@/storesPinia/channel.js";

export default {
  name: "WebEdit",
  components: {
    ChannelContent,
    Dialog,
    ValidationError,
    AdTypeLayout,
    Preview,
    SwitchCheckbox,
    SelectDropdown
  },
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const typeStore = useTypeStore();
    const boardStore = useBoardStore();
    const siteStore = useSiteStore();
    const channelStore = useChannelStore();
    const conditionSettingStore = useConditionSettingStore();
    const { user } = storeToRefs(userStore);
    const { siteId } = storeToRefs(siteStore);
    const { channelId } = storeToRefs(channelStore);
    const { boardId } = storeToRefs(boardStore);
    const { getType, getBoardIdType } = typeStore;
    const { deleteBoardId, patchBoard, postBoard } = boardStore;
    const { getConditions } = conditionSettingStore;
    const { jump } = useMixins();
    const v$ = useVuelidate();
    const getUserStatus = computed(() => user.value);
    const siteIdData = computed(() => siteId.value);
    const channeIdData = computed(() => channelId.value);
    const boardIdData = computed(() => boardId.value);
    const getPath = computed(() => route.path);
    const getUserAuthority = computed(() => getUserStatus.value.userAuthority);
    const site = ref({ siteId: "" });
    const channel = ref({ channelId: "" });
    const board = ref({
      boardId: "",
      name: "",
      reserve: "",
      status: true,
      promotion: false,
      typeId: "",
      upperLimit: "",
      lowerLimit: "",
      style: "",
      url: "",
      snapshot: true,
      conditionName: "",
      conditionId: 0,
      searchedConditionOptions: [],
      identify: null
    });
    const typeData = ref({
      memo: "",
      groupList: []
    });
    const adImagePreviewNumber = ref("");
    const channelTitle = ref("新增廣告版位");
    const isBanneredit = ref(false);
    const openCompletedDeleteDialog = ref(false);
    const openDeleteDialog = ref(false);
    const openCompletedCreateDialog = ref(false);
    const advertisingData = ref([]);
    const typeValidationsValue = ref({});
    const typeValidations = ref({});
    const typeDisabled = ref(false);
    const completedCreateName = ref("");

    onBeforeMount(() => {
      // 網站資訊
      site.value.siteId = channeIdData.value.siteId;
      // 頻道資訊
      channel.value.channelId = channeIdData.value.id;
      // 版位資訊
      board.value.boardId = boardIdData.value.id;
      board.value.name = boardIdData.value.name;
      board.value.promotion = boardIdData.value.promotion || false;
      board.value.reserve = boardIdData.value.reserve;
      board.value.status = boardIdData.value.status;
      board.value.typeId = boardIdData.value.typeId || "";
      board.value.lowerLimit = boardIdData.value.lowerLimit;
      board.value.upperLimit = boardIdData.value.upperLimit;
      board.value.style = boardIdData.value.style || "";
      board.value.url = boardIdData.value.url || null;
      board.value.snapshot = boardIdData.value.snapshot;
      board.value.conditionId = boardIdData.value.conditionId;
      board.value.identify = boardIdData.value.identify || null;
      adImagePreviewNumber.value = boardIdData.value.typeId;

      switch (getPath.value) {
        case "/banneredit":
          channelTitle.value = "編輯廣告版位";
          isBanneredit.value = true;
          typeDisabled.value = true;
          break;
        case "/banneradd":
          isBanneredit.value = true;
          board.value.snapshot = true;
          break;
      }
    });

    // 取消刪除
    const handleCancel = () => {
      openDeleteDialog.value = false;
    };

    // 刪除廣告版位內容 icon
    const deleteBoard = () => {
      openDeleteDialog.value = true;
    };

    // 關閉已確定刪除後導頁
    const closeJumpFunc = () => {
      jump(`/weblist?device=${siteIdData.value.device}`);
    };

    // 關閉已確定 Dialog
    const closeFunc = () => {
      openCompletedCreateDialog.value = false;
      if (
        getPath.value === "/webedit" ||
        getPath.value === "/banneradd" ||
        getPath.value === "/banneredit"
      )
        closeJumpFunc();
    };

    // 打開已完成 Dialog
    const openCreateDialog = name => {
      openCompletedCreateDialog.value = true;
      completedCreateName.value = name;
    };

    // 關閉確認刪除 Dialog
    const closeDeleteDialog = () => {
      openDeleteDialog.value = false;
      nextTick(() => {
        openCompletedDeleteDialog.value = true;
      });
    };

    // 刪除版位
    const handleSaveDelete = () => {
      deleteBoardId({
        boardId: board.value.boardId,
        channelId: channel.value.channelId,
        siteId: site.value.siteId
      }).then(() => {
        closeDeleteDialog();
      });
    };

    // 儲存版位
    const saveBoard = (name, content) => {
      const patt = /^https?:\/\/.+/;
      const routeQuery = route.query;
      const selectTypeId = document.querySelector("[name=typeId]");

      if (board.value.url) {
        if (board.value.url.search("http://") !== -1) {
          board.value.url = board.value.url.replace(/http/g, "https");
        } else if (!patt.test(board.value.url)) {
          board.value.url = `https://${board.value.url}`;
        }
      }

      const query = {
        siteId: site.value.siteId,
        channelId: channel.value.channelId,
        conditionId: board.value.conditionId,
        name: board.value.name,
        id: board.value.boardId,
        promotion: board.value.promotion,
        reserve: Number(board.value.reserve),
        status: board.value.status,
        typeId: board.value.typeId,
        lowerLimit: board.value.lowerLimit,
        upperLimit: board.value.upperLimit,
        requestTypeTemplateDetail: typeData.value,
        style: board.value.style,
        url: board.value.url || null,
        snapshot: board.value.snapshot,
        identify: board.value.identify || null
      };

      const validation = v$.value.board;
      const typeValidation = v$.value.typeValidationsValue;
      validation.$touch();
      typeValidation.$touch();

      selectTypeId.className = validation.typeId.$error
        ? "el-input__inner error_message_border"
        : "el-input__inner";

      if (validation.$error || typeValidation.$error) return;
      if (routeQuery && routeQuery.boardId) {
        // 修改
        patchBoard(query).then(() => {
          openCreateDialog(name, content);
        });
        return;
      }
      // 新增
      delete query.id;
      postBoard(query).then(() => {
        openCreateDialog(name, content);
      });
    };

    // 選擇型態
    const handleBoardTypeIdValue = item => {
      const validation = v$.value.typeValidationsValue;
      validation.$reset();
      document.querySelector("[name=typeId").className = "el-input__inner";

      const typeQuery = {
        boardId: board.value.boardId || 0,
        typeId: item
      };

      // 清空型態設定
      typeData.value = {
        memo: "",
        groupList: []
      };

      // 取得型態設定
      getBoardIdType(typeQuery).then(response => {
        typeData.value = response;
        settingValidations(response.groupList);
      });

      board.value.typeId = item;
      adImagePreviewNumber.value = item;
    };

    // 變更型態欄位
    const changeBoardTypeGroupList = (
      name,
      value,
      typeDataIndex,
      elementIndex
    ) => {
      typeData.value.groupList[typeDataIndex].elementList[elementIndex][name] =
        value;
      typeValidationsValue.value[`${name}_${typeDataIndex}_${elementIndex}`] =
        value;
    };

    // 變更上刊須知
    const changeBoardTypeMemo = value => {
      typeData.value.memo = value;
    };

    // 動態設定 Validations
    const settingValidations = groupList => {
      // 清空型態 Validations
      typeValidations.value = {};
      typeValidationsValue.value = {};
      let typeGroupList = {};
      let elementList = {};
      groupList.forEach((groupListItem, groupListIndex) => {
        groupListItem.elementList.forEach(
          (elementListItem, elementListIndex) => {
            if (
              elementListItem.elementType === "image" ||
              elementListItem.elementType === "file"
            ) {
              typeGroupList[`title_${groupListIndex}_${elementListIndex}`] =
                elementListItem.title || "";
              typeGroupList[`width_${groupListIndex}_${elementListIndex}`] =
                elementListItem.width || "";
              typeGroupList[`height_${groupListIndex}_${elementListIndex}`] =
                elementListItem.height || "";
              typeGroupList[`fileLimit_${groupListIndex}_${elementListIndex}`] =
                elementListItem.fileLimit || "";
              elementList[`title_${groupListIndex}_${elementListIndex}`] = {
                required
              };
              elementList[`width_${groupListIndex}_${elementListIndex}`] = {
                required,
                onlyEnterNumbers: onlyEnterNumbers()
              };
              elementList[`height_${groupListIndex}_${elementListIndex}`] = {
                required,
                onlyEnterNumbers: onlyEnterNumbers()
              };
              elementList[`fileLimit_${groupListIndex}_${elementListIndex}`] = {
                required,
                onlyEnterNumbers: onlyEnterNumbers()
              };
            } else if (elementListItem.elementType === "text") {
              typeGroupList[`title_${groupListIndex}_${elementListIndex}`] =
                elementListItem.title || "";
              typeGroupList[`textLimit_${groupListIndex}_${elementListIndex}`] =
                elementListItem.textLimit || "";
              elementList[`title_${groupListIndex}_${elementListIndex}`] = {
                required
              };
              elementList[`textLimit_${groupListIndex}_${elementListIndex}`] = {
                required,
                onlyEnterNumbers: onlyEnterNumbers()
              };
            }
          }
        );
      });
      typeValidationsValue.value = typeGroupList;
      typeValidations.value = elementList;
    };

    // 切換上線狀態
    const handleChange = val => {
      board.value.status = val;
    };

    // 切換樣張截圖
    const handleSnapshotChange = val => {
      board.value.snapshot = val;
    };

    // 切換行銷版位，樣張截圖行銷版位預設在否，樣張截圖銷版位預設在是
    const changePromotion = () => {
      if (getPath.value === "/banneradd" && board.value.promotion)
        board.value.snapshot = false;
      if (getPath.value === "/banneradd" && !board.value.promotion)
        board.value.snapshot = true;
    };

    // 選取設定條件
    const setConditionId = data => {
      if (!!data) {
        board.value.conditionId = board.value.searchedConditionOptions.find(
          option => option.id === data.id
        ).id;
        board.value.conditionName = board.value.searchedConditionOptions.find(
          option => option.id === data.id
        ).name;
      }
    };

    // 請空設定條件
    const clearConditionContent = () => {
      board.value.conditionId = 0;
      board.value.conditionName = "";
    };

    const typeQuery = {
      boardId: boardIdData.value.id,
      typeId: boardIdData.value.typeId
    };

    // 取得型態列表
    getType().then(response => {
      // 型態 10、11、12、13 沒在用或棄用不能選
      const doNotUse = [10, 11, 12, 13];
      advertisingData.value = response;
      response.forEach((item, index) => {
        doNotUse.forEach(doNotUseItem => {
          if (doNotUseItem - 1 === index)
            advertisingData.value[index].disabled = true;
        });
      });
    });

    // 取得型態設定
    getBoardIdType(typeQuery).then(response => {
      typeData.value = response;
      if (response.groupList && response.groupList.length > 0)
        settingValidations(response.groupList);
    });

    // 取得條件設定
    getConditions().then(response => {
      board.value.searchedConditionOptions = [...response.content].map(item => {
        return {
          ...item,
          value: item.id,
          label: item.name
        };
      });
      if (boardIdData.value && boardIdData.value.conditionId !== 0) {
        board.value.conditionName = board.value.searchedConditionOptions.find(
          option => option.id === boardIdData.value.conditionId
        ).label;
      }
    });

    return {
      siteIdData,
      channeIdData,
      boardIdData,
      getPath,
      getUserAuthority,
      board,
      typeData,
      adImagePreviewNumber,
      channelTitle,
      isBanneredit,
      openCompletedDeleteDialog,
      openDeleteDialog,
      openCompletedCreateDialog,
      advertisingData,
      typeValidationsValue,
      typeValidations,
      typeDisabled,
      completedCreateName,
      handleCancel,
      deleteBoard,
      closeFunc,
      closeJumpFunc,
      openCreateDialog,
      handleSaveDelete,
      saveBoard,
      handleBoardTypeIdValue,
      changeBoardTypeGroupList,
      changeBoardTypeMemo,
      handleChange,
      handleSnapshotChange,
      changePromotion,
      setConditionId,
      clearConditionContent,
      v$,
      jump
    };
  },
  validations() {
    return {
      board: {
        name: {
          required,
          maxLength: maxLength(50)
        },
        reserve: {
          required,
          onlyEnterNumbers: onlyEnterNumbers()
        },
        lowerLimit: {
          required,
          onlyEnterNumbers: onlyEnterNumbers(),
          isUnique(value) {
            if (Number(value) > Number(this.board.upperLimit)) return false;
            return true;
          }
        },
        upperLimit: {
          required,
          onlyEnterNumbers: onlyEnterNumbers(),
          isUnique(value) {
            if (Number(value) < Number(this.board.lowerLimit)) return false;
            return true;
          }
        },
        typeId: {
          required
        },
        style: {
          maxLength: maxLength(50)
        }
      },
      typeValidationsValue: this.typeValidations
    };
  }
};
</script>

<style>
.web_ad_edit_main .web_ad_page input {
  width: 260px;
}
.advertising_data_input input {
  width: 680px;
}
.el-select-dropdown__item {
  font-size: 16px !important;
  padding: 0 12px !important;
}
.el-select-dropdown__item.hover {
  background-color: #e6f9fa !important;
}
.el-select-dropdown__item.selected {
  color: #00afb8 !important;
  font-weight: bold;
}
</style>

<style lang="scss" scoped>
section {
  &.web_ad_edit_main {
    background-color: #fff;
    border-radius: 8px;
    border: solid 1px #e2e1e1;
    padding: 23px 49px 33px;
    clear: both;
    margin-bottom: 20px;

    .web_ad_edit_main_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        span {
          font-size: 12px;
          color: #ea475b;
          margin-left: 10px;
          font-weight: 400;
        }
      }

      img {
        width: 35px;

        &.pointer {
          cursor: pointer;
        }
      }
    }

    > table {
      width: 100%;

      tr {
        margin-bottom: 24px;
        display: block;

        &.no_mb {
          margin-bottom: 0;
        }

        td {
          font-size: 16px;
          font-weight: bold;
          line-height: 1.38;
          letter-spacing: 1px;
          color: #333;
          vertical-align: middle;

          &:nth-child(1) {
            width: 110px;
            height: 30px;
          }

          &.condition {
            width: 680px;
          }

          &.advertising_type {
            width: 100%;
            padding: 8px 0 24px;

            .advertising_text {
              font-size: 14px;
              font-weight: normal;
              line-height: 1.43;
              letter-spacing: 1px;
              color: #7e7e7e;
            }
          }

          &.ad_type_content_warp {
            width: 100%;

            .type_content {
              display: flex;
              justify-content: space-between;

              .type_first_main {
                width: 770px;
                margin-left: 10px;
                text-align: left;

                table {
                  width: 100%;

                  tr {
                    margin-bottom: 20px;
                    align-items: center;

                    &.no_mb {
                      margin-bottom: 0;
                    }

                    th {
                      font-size: 14px;
                      font-weight: bold;
                      line-height: 1.43;
                      letter-spacing: 1.43px;
                      color: #292929;
                      padding-right: 28px;
                    }

                    td {
                      .defaule_type {
                        border: dashed 1px #e2e1e1;
                        background-color: #fff;
                        width: 767px;
                        height: 200px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        letter-spacing: 0.89px;
                        color: #292929;
                      }
                    }
                  }
                }
              }

              .type_last_main {
                width: 278px;
                border: solid 1px #e2e1e1;
                background-color: #f8f8f8;
                margin-left: 30px;
              }
            }
          }

          &.book_quantity {
            font-size: 14px;
            letter-spacing: 1px;
            color: #8f8f8f;

            span {
              display: inline-flex;
              align-items: center;
              margin-left: 8px;
              font-weight: normal;

              img {
                margin: 0 4px 0 13px;
              }
            }
          }

          &.marketing_slot_block {
            label {
              margin-right: 20px;
            }
          }

          &.switch_checkbox_block {
            vertical-align: bottom;
          }

          &.snapshot_td {
            padding-top: 7px;
          }

          .cant_change {
            font-size: 14px;
            color: #ea475b;
            margin-left: 10px;
          }
        }

        span {
          font-weight: initial;
        }
      }
    }

    .button_block {
      text-align: center;

      button {
        &:nth-child(1) {
          margin-right: 20px;
        }
      }
    }
  }
}

.dialog_title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1.5px;
  color: #333;
  text-align: center;
  margin-top: 90px;

  img {
    vertical-align: text-top;
  }
}

.dialog_annotation {
  font-size: 16px;
  line-height: 1.38;
  letter-spacing: 1px;
  color: #8f8f8f;
  margin-top: 7px;
  text-align: center;
}

.dialog_button_block {
  margin: 50px 0 62px;
  text-align: center;

  button {
    &:first-child {
      margin-right: 30px;
    }
  }
}
</style>
