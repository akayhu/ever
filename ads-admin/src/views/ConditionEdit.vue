<template>
  <div>
    <section>
      <h2>條件設定</h2>
      <a href="javascript:void(0)" @click="openDescriptionDialog = true"
        >條件填寫說明</a
      >
      <div class="name_wrapper">
        <div class="name">
          <label for="conditionName">條件名稱</label>
          <input
            type="text"
            name="name"
            id="conditionName"
            :class="{
              error_message_border: v$.conditionName.$error
            }"
            placeholder="請輸入"
            v-model="conditionName"
            :disabled="!canEdit"
          />
        </div>
        <div class="conditionName_error">
          <div v-if="v$.conditionName.$error" class="error_message">
            {{ v$.conditionName.$errors[0].$message }}
          </div>
        </div>
        <div class="memo">
          <label for="conditionMemo">備註說明</label>
          <ADSTextarea
            id="conditionMemo"
            class="textarea_memo"
            placeholder="請輸入"
            v-model="conditionMemo"
            maxlength="500"
            :disabled="!canEdit"
          ></ADSTextarea>
        </div>
      </div>
      <div v-if="conditionData.loading" class="loading_block">
        <Loading />
      </div>
      <div
        class="condition_wrapper"
        v-for="(conditionGroup, groupId, groupIndex) in conditionGroupBy"
        :key="groupId"
      >
        <div class="condition_content">
          <div
            class="condition_row"
            v-for="(row, rowIndex) in conditionGroup"
            :key="row.id"
          >
            <div class="dotted" :class="{ active: rowIndex === 0 }"></div>
            <div class="sequence">
              {{ rowIndex === 0 ? `${groupIndex + 1}. ` : "" }}
            </div>
            <div class="key_block">
              <label>Key</label>
              <input
                class="input_key"
                :class="{
                  error_message_border:
                    v$.conditionGroups.$error &&
                    v$.conditionGroups.$each.$response.$data[row.index]
                      .conditionKey.$error
                }"
                type="text"
                placeholder="請輸入"
                v-model="row.conditionKey"
                :disabled="!canEdit"
                @keyup="
                  row.conditionKey = row.conditionKey.replace(/[^\w_]/g, '')
                "
              />
              <div
                v-if="
                  v$.conditionGroups.$error &&
                  v$.conditionGroups.$each.$response.$data[row.index]
                    .conditionKey.$error
                "
                class="error_message"
              >
                {{
                  v$.conditionGroups.$each.$response.$errors[row.index]
                    .conditionKey[0].$message
                }}
              </div>
            </div>
            <div class="value_block">
              <label>Value</label>
              <ADSTextarea
                class="input_value"
                :class="{
                  error_message_border:
                    v$.conditionGroups.$error &&
                    v$.conditionGroups.$each.$response.$data[row.index]
                      .conditionValue.$error
                }"
                placeholder="請輸入"
                v-model="row.conditionValue"
                maxlength="200"
                :disabled="!canEdit"
              ></ADSTextarea>
              <div
                v-if="
                  v$.conditionGroups.$error &&
                  v$.conditionGroups.$each.$response.$data[row.index]
                    .conditionValue.$error
                "
                class="error_message"
              >
                {{
                  v$.conditionGroups.$each.$response.$errors[row.index]
                    .conditionValue[0].$message
                }}
              </div>
            </div>
            <div class="memo_block">
              <label>備註說明</label>
              <ADSTextarea
                placeholder="請輸入"
                v-model="row.memo"
                maxlength="200"
                class="input_memo"
                :disabled="!canEdit"
              ></ADSTextarea>
            </div>
            <div class="icons">
              <img
                v-if="canEdit"
                src="@/assets/icon/btn-close-bg-24.svg"
                @click="removeRow(conditionGroup, row)"
              />
              <img
                v-if="canEdit"
                src="@/assets/icon/btn-add-bg-24.svg"
                @click="addRow(row.groupId)"
              />
            </div>
          </div>
        </div>
        <div class="edit_button_block">
          <img
            v-if="canEdit"
            src="@/assets/icon/material-icons-black-expand-more-x.svg"
            @click="removeGroup(groupId)"
          />
          <img
            v-if="
              canEdit && groupIndex === Object.keys(conditionGroupBy).length - 1
            "
            src="@/assets/icon/material-icons-black-expand-less.svg"
            @click="addGroup(groupId)"
          />
        </div>
      </div>

      <div class="button_block">
        <button
          v-if="canEdit"
          @click="handleCancel"
          class="button_bg_white_large"
        >
          取消
        </button>
        <button
          v-if="canEdit && conditionId"
          class="button_bg_white_large"
          @click="openDeleteDialog = true"
        >
          刪除
        </button>
        <button v-if="canEdit" @click="handleSave" class="button_bg_blue_large">
          {{ formType === "create" ? "確定" : "儲存" }}
        </button>
      </div>

      <Dialog
        v-if="openDialog"
        :showDialog="openDialog"
        :title="dialogTitleMap[formType]"
        :content="dialogContentMap[formType]"
        :closeFunc="closeDialog"
        @dialogCancel="closeDialog"
      />

      <Dialog v-if="openDeleteDialog" :showDialog="openDeleteDialog">
        <div class="dialog_title">
          <img src="@/assets/icon/icon-line.svg" /> 您要刪除{{
            conditionName
          }}條件設定嗎?
        </div>
        <div class="dialog_annotation">確認條件設定刪除狀態。</div>
        <div class="dialog_button_block">
          <button
            @click="openDeleteDialog = false"
            class="button_bg_white_large"
          >
            取消
          </button>
          <button @click="handleDelete" class="button_bg_blue_large">
            確定
          </button>
        </div>
      </Dialog>

      <Dialog
        v-if="openDescriptionDialog"
        :showDialog="openDescriptionDialog"
        @dialogCancel="openDescriptionDialog = false"
      >
        <div class="description_dialog">
          <div class="close">
            <img
              @click="openDescriptionDialog = false"
              src="@/assets/icon/icon-delete-big.svg"
            />
          </div>
          <div class="title">條件填寫說明</div>
          <div class="table_1">
            <span>中英對照表</span>
            <span>
              <img src="@/assets/icon/icon-info-warmgray.svg" />
              Key欄位不接受中文及符號，Value可支援類目邊碼、中文、英文
            </span>
            <table>
              <tr>
                <td>產業</td>
                <td>indcat_sub</td>
              </tr>
              <tr>
                <td>地區</td>
                <td>area</td>
              </tr>
              <tr>
                <td>職類</td>
                <td>jobcat</td>
              </tr>
              <tr>
                <td>關鍵字</td>
                <td>kw</td>
              </tr>
              <tr>
                <td>公司</td>
                <td>custNo</td>
              </tr>
            </table>
          </div>
          <div class="table_2">
            <span>比對規則及填寫方式</span>
            <span>
              <img src="@/assets/icon/icon-info-warmgray.svg" />
              不可空白
            </span>
            <table>
              <tr>
                <td>完全比對</td>
                <td>1001000000 → 1001000000</td>
              </tr>
              <tr>
                <td>部分比對</td>
                <td>1001000[0-9]{3} → 1001000000 ~ 1001000999</td>
              </tr>
              <tr>
                <td>模糊比對</td>
                <td>.+葡萄 → 吃葡萄</td>
              </tr>
              <tr>
                <td>模糊比對</td>
                <td>葡萄.+ → 葡萄皮</td>
              </tr>
              <tr>
                <td>模糊比對</td>
                <td>.+葡萄.+ →吃葡萄不吐皮</td>
              </tr>
              <tr>
                <td>多筆條件</td>
                <td>ON|OFF → ON or OFF</td>
              </tr>
            </table>
          </div>
        </div>
      </Dialog>
    </section>
    <section v-if="responseBoards.length > 0 && !conditionData.loading">
      <h2>已綁定版位</h2>
      <div>
        <div v-for="(item, index) in responseBoards" :key="item.id">
          {{ index + 1 }}.
          <router-link
            :to="`/banneredit?siteId=${item.siteId}&channelId=${item.channelId}&boardId=${item.id}`"
            target="_blank"
            >{{
              `${item.device}${item.siteName}/${item.channelName}/${item.name}`
            }}</router-link
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick
} from "vue";
import { useRouter, useRoute } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import Loading from "@/components/Loading.vue";
import Dialog from "@/components/Dialog.vue";
import ADSTextarea from "@/components/ADSTextarea.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useConditionSettingStore } from "@/storesPinia/conditionSetting.js";

export default defineComponent({
  name: "ConditionEdit",
  components: {
    Loading,
    Dialog,
    ADSTextarea
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const conditionSettingStore = useConditionSettingStore();
    const { user } = storeToRefs(userStore);
    const { storeConditionData } = storeToRefs(conditionSettingStore);
    const {
      getConditionById,
      createCondition,
      editCondition,
      deleteCondition
    } = conditionSettingStore;

    let conditionId = ref("");
    let conditionName = ref("");
    let conditionMemo = ref("");
    let conditionGroups = ref([]);
    let responseBoards = ref([]);
    let formType = ref("create");
    const dialogTitleMap = {
      create: "已新增條件",
      edit: "已更新條件",
      delete: "已刪除完成"
    };
    const dialogContentMap = {
      create: "您已完成新增條件",
      edit: "您已完成更新條件",
      delete: "您已刪除條件設定"
    };
    let openDialog = ref(false);
    let openDeleteDialog = ref(false);
    let openDescriptionDialog = ref(false);
    let timer = null;

    const rules = {
      conditionName: { required: helpers.withMessage("請輸入Key", required) },
      conditionGroups: {
        $each: helpers.forEach({
          conditionKey: {
            required: helpers.withMessage("請輸入Key", required),
            isUnique: helpers.withMessage(
              "Key不可重複",
              function (value, condition) {
                if (!value) return true;
                let invalidCount = conditionGroups.value.filter(
                  (item, index) =>
                    item.groupId === condition.groupId &&
                    item.conditionKey === value &&
                    condition.index !== index
                ).length;
                return invalidCount ? false : true;
              }
            )
          },
          conditionValue: {
            required: helpers.withMessage("請輸入Value", required)
          }
        })
      }
    };

    const v$ = useVuelidate(rules, { conditionName, conditionGroups });

    const getUserStatus = computed(() => user.value);
    const conditionData = computed(() => storeConditionData.value);
    const conditionGroupBy = computed(() => {
      const result = {};
      conditionGroups.value.forEach(item => {
        if (!result[item.groupId]) {
          result[item.groupId] = [];
        }
        result[item.groupId].push(item);
      });
      return result;
    });
    const canEdit = computed(() => {
      return getUserStatus.value.userAuthority.setConditionsEdit;
    });

    const getConditionByIdData = async params => {
      await getConditionById(params);
    };

    const createConditionData = async params => {
      await createCondition(params);
    };

    const editConditionData = async params => {
      await editCondition(params);
    };

    const deleteConditionData = async params => {
      await deleteCondition(params);
    };

    const setCloseDialogTimer = () => {
      timer = setTimeout(() => {
        closeDialog();
      }, 3000);
    };

    const handleCancel = () => {
      router.push("/setconditions");
    };

    const handleSave = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        nextTick(() => {
          let domRect = document
            .querySelector(".error_message_border")
            .getBoundingClientRect();
          window.scrollTo({
            top: domRect.top + document.documentElement.scrollTop - 70
          });
        });
        return;
      }

      let params = {
        conditionGroups: conditionGroups.value,
        name: conditionName.value,
        memo: conditionMemo.value
      };

      let action;
      if (formType.value === "create") {
        action = createConditionData;
      } else {
        params.conditionId = conditionId.value;
        action = editConditionData;
      }

      await action(params);
      openDialog.value = true;
      setCloseDialogTimer();
    };

    const handleDelete = async () => {
      if (!conditionId.value) return;
      try {
        await deleteConditionData(conditionId.value);
        formType.value = "delete";
        openDialog.value = true;
        setCloseDialogTimer();
      } catch (e) {
        openDeleteDialog = false;
      }
    };

    const closeDialog = () => {
      openDialog = false;
      if (route.name !== "SetConditions")
        router.push("/setconditions").catch(() => {});
    };

    const resetIndex = () => {
      conditionGroups.value.forEach((item, index) => (item.index = index));
    };

    const addGroup = groupId => {
      conditionGroups.value.push({
        conditionId: 0,
        conditionKey: "",
        conditionValue: "",
        memo: "",
        groupId: +groupId + 1,
        sort: 1,
        index: conditionGroups.value.length
      });
      v$.value.$reset();
    };

    const removeGroup = groupId => {
      if (conditionGroups.value.length <= 1) {
        conditionGroups.value[0].conditionKey = "";
        conditionGroups.value[0].conditionValue = "";
        conditionGroups.value[0].memo = "";
      } else {
        conditionGroups.value = conditionGroups.value.filter(
          item => +item.groupId !== +groupId
        );
      }
      resetIndex();
      v$.value.$reset();
    };

    const removeRow = (conditionGroup, row) => {
      let index = conditionGroups.value.findIndex(
        item => item.groupId === row.groupId && item.sort === row.sort
      );
      if (conditionGroup.length <= 1) {
        removeGroup(row.groupId);
      } else {
        conditionGroups.value.splice(index, 1);
      }
      resetIndex();
      v$.value.$reset();
    };

    const addRow = groupId => {
      let sort = Math.max(
        ...conditionGroupBy.value[groupId].map(item => item.sort),
        0
      );
      conditionGroups.value.push({
        conditionId: 0,
        conditionKey: "",
        conditionValue: "",
        memo: "",
        groupId,
        sort: sort + 1,
        index: conditionGroups.value.length
      });
      v$.value.$reset();
    };

    onMounted(async () => {
      if (route.name === "ConditionEdit") {
        formType.value = "edit";
        conditionId.value = +route.params.id;
        await getConditionByIdData(conditionId.value);
        conditionName.value = conditionData.value.name;
        conditionMemo.value = conditionData.value.memo;
        conditionData.value.conditionGroups.forEach((item, index) => {
          conditionGroups.value.push({ ...item, index });
        });
        responseBoards.value = conditionData.value.responseBoards;
      } else {
        formType.value = "create";
        addGroup(0);
      }
    });

    onBeforeUnmount(() => {
      clearTimeout(timer);
    });

    return {
      conditionId,
      conditionName,
      conditionMemo,
      responseBoards,
      formType,
      dialogTitleMap,
      dialogContentMap,
      openDialog,
      openDeleteDialog,
      openDescriptionDialog,
      v$,
      conditionData,
      conditionGroups,
      conditionGroupBy,
      canEdit,
      closeDialog,
      handleCancel,
      handleSave,
      handleDelete,
      addGroup,
      removeGroup,
      addRow,
      removeRow
    };
  }
});
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

section {
  margin-bottom: 24px;

  h2 {
    letter-spacing: 1.5px;
    margin-bottom: 30px;
    margin-right: 16px;
    display: inline-block;
  }

  label {
    margin-right: 28px;
    font-weight: bold;
  }
}

.name_wrapper {
  margin-bottom: 32px;

  input {
    width: 480px;
  }

  .conditionName_error {
    padding-left: 84px;
  }

  .memo {
    display: flex;
    margin-top: 12px;

    .textarea_memo {
      width: 680px;
      height: 90px;
    }
  }
}

.condition_wrapper {
  margin-top: 16px;

  .condition_content {
    margin-bottom: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid #d6d6d6;

    .condition_row {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;

      &:not(:last-child) {
        margin-bottom: 24px;
      }

      .dotted {
        width: 24px;
        height: 24px;
        transform: translateY(-5px);

        &.active {
          border-bottom: 1px dashed #d6d6d6;
          border-left: 1px dashed #d6d6d6;
        }
      }

      .sequence {
        display: inline-block;
        width: 17px;
        margin-left: 12px;
        margin-right: 6px;
        text-align: right;
        font-weight: bold;
      }

      label {
        display: inline-block;
        min-width: 70px;
      }

      .key_block {
        margin-bottom: 12px;

        .input_key {
          width: 220px;
          margin-right: 28px;
        }
      }

      .value_block {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 12px;
        margin-left: 58px;

        .input_value {
          width: 684px;
          height: 90px;
        }
      }

      .memo_block {
        display: flex;
        margin-right: 24px;
        margin-left: 58px;

        .input_memo {
          width: 684px;
          height: 90px;
        }
      }

      .error_message {
        width: 100%;
        margin-left: 88px;
      }

      .icons {
        align-self: flex-end;

        img {
          cursor: pointer;
          &:nth-child(1) {
            margin-right: 12px;
          }
        }
      }
    }
  }

  .edit_button_block {
    display: flex;
    justify-content: flex-end;

    img {
      margin-left: 12px;
      cursor: pointer;
    }
  }
}

.button_block {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
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

.description_dialog {
  .title {
    @include font-common(16px, $font-weight-bold, #333);
    margin-bottom: 16px;
  }

  .close {
    text-align: end;

    img {
      cursor: pointer;
    }
  }

  span {
    &:nth-child(1) {
      @include font-common(16px, $font-weight-bold, #333);
      margin-right: 8px;
    }
    &:nth-child(2) {
      @include font-common(14px, $font-weight-normal, $gray-700);

      img {
        transform: translateY(-2px);
      }
    }
  }

  table {
    margin-top: 16px;
    margin-bottom: 24px;
    border: 1px solid #e2e1e1;

    tr {
      td {
        border: 1px solid #e2e1e1;
        padding: 14px 12px;

        &:nth-child(1) {
          @include font-common(14px, $font-weight-bold, $gray-900);
          min-width: 200px;
        }

        &:nth-child(2) {
          @include font-common(14px, $font-weight-normal, $gray-900);
          width: 100%;
        }
      }
    }
  }
}
</style>
