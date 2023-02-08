<template>
  <div>
    <Modal
      ref="settingAgent"
      :isShow="settingAgentStatus"
      @close="closeSettingAgent"
      title="設定專案內容"
      width="711"
    >
      <template #body>
        <div class="agent_block">
          <div>
            <div>負責人<span class="necessary">*</span></div>
            <SelectDropdown
              class="input_field"
              @value-changed="changeUser($event, 'accountId', 'accountInfo')"
              :value="account"
              :options="searchedAccountOptions"
              :asncSearchCb="accountSuggestSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              placeholder="請輸入"
            />
          </div>
          <div>
            <div>代理人</div>
            <SelectDropdown
              class="input_field"
              @value-changed="changeUser($event, 'agent', 'agentInfo')"
              :value="agent"
              :options="searchedAccountOptions"
              :asncSearchCb="accountSuggestSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              :clearable="true"
              placeholder="請輸入"
            />
          </div>
          <div>
            <div>執行企劃</div>
            <SelectDropdown
              class="input_field"
              @value-changed="changeUser($event, 'pm', 'pmInfo')"
              :value="pm"
              :options="searchedAccountOptions"
              :asncSearchCb="accountSuggestSearch"
              :filterable="true"
              :remote="true"
              :optionsAllData="true"
              :clearable="true"
              placeholder="請輸入"
            />
          </div>
          <div v-if="isEmptyBoard">
            <div>空版專案</div>
            <div>
              <label class="ad-radio-label">
                <input
                  v-model="data.type"
                  :value="1"
                  type="radio"
                  name="company"
                />
                <span class="ad-radio"></span>是
              </label>
              <label class="ad-radio-label">
                <input
                  v-model="data.type"
                  :value="0"
                  type="radio"
                  name="company"
                />
                <span class="ad-radio"></span>否
              </label>
            </div>
          </div>
          <div>
            <div>備註</div>
            <div>
              <el-input
                v-model="data.note"
                :autosize="{ minRows: 4 }"
                type="textarea"
                placeholder="請輸入"
                maxlength="200"
                class="input_field"
                show-word-limit
              />
            </div>
          </div>
        </div>
        <div class="button_block">
          <button class="button_bg_white_large mr-7" @click="closeSettingAgent">
            取消
          </button>
          <button class="button_bg_blue_large" @click="saveSettingAgent">
            確定
          </button>
        </div>
      </template>
    </Modal>

    <Dialog
      v-if="showDialog"
      @dialogCancel="showDialog = false"
      @dialogConfirm="showDialog = false"
      :isShow="showDialog"
      :cancelButton="false"
      title="確定"
      content="專案內容已設定"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import Modal from "@/components/share/Modal.vue";
import Dialog from "@/components/Dialog.vue";
import SelectDropdown from "@/components/share/SelectDropdown";
import useSelectUser from "@/composables/useSelectUser";

export default defineComponent({
  name: "SettingAgent",
  components: {
    Modal,
    Dialog,
    SelectDropdown
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    settingAgentStatus: {
      type: Boolean,
      default: false
    },
    closeSettingAgent: {
      type: Function
    },
    savePjSetting: {
      type: Function
    },
    // 是否顯示空版專案
    isEmptyBoard: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const salesOrderStore = useSalesOrderStore();
    const { searchedAccountOptions, accountSuggestSearch } = useSelectUser();

    const showDialog = ref(false);
    const data = ref({});

    const account = computed(() => data.value.accountInfo?.name || "");
    const agent = computed(() => data.value.agentInfo?.name || "");
    const pm = computed(() => data.value.pmInfo?.name || "");
    const changeUser = (val, valueField, labelField) => {
      data.value[valueField] = val.accountId;
      data.value[labelField] = {
        name: val.name
      };
    };

    // 儲存設定專案內容
    const saveSettingAgent = () => {
      props.savePjSetting(data.value);
      showDialog.value = true;
    };

    const init = () => {
      data.value = {
        accountId: props.project.accountId,
        accountInfo: { name: props.project.accountInfo?.name },
        agent: props.project.agent,
        agentInfo: { name: props.project.agentInfo?.name },
        pm: props.project.pm,
        pmInfo: { name: props.project.pmInfo?.name },
        note: props.project.note,
        type: props.project.type
      };
    };

    // onCreate
    if (!props.project.accountId) {
      props.project.accountId =
        salesOrderStore.quotationData.salesId ||
        salesOrderStore.quotationData.applicantId;
      props.project.accountInfo = {
        name:
          salesOrderStore.quotationData.salesInfo?.name ||
          salesOrderStore.quotationData.applicantInfo?.name
      };
    }

    return {
      showDialog,
      data,
      searchedAccountOptions,
      account,
      agent,
      pm,
      accountSuggestSearch,
      changeUser,
      saveSettingAgent,
      init
    };
  }
});
</script>

<style lang="scss" scoped>
.agent_block {
  padding-bottom: 8px;
  padding: 0 0 8px 16px;
  border-bottom: 1px solid #ddd;

  > div {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    div {
      &:first-child {
        width: 70px;
        margin-right: 28px;
      }

      &:last-child {
        width: 480px;
      }

      ::v-deep &.el-select {
        width: 260px;
      }

      .input_field {
        ::v-deep textarea {
          background-color: #f3f3f3;
          border: 1px solid #ddd;
          font-size: 16px;
        }

        ::v-deep .el-input__count {
          background-color: transparent;
        }
      }
    }

    &:nth-child(1) {
      div {
        &:last-child {
          color: #a9a9a9;
          font-weight: bold;
        }
      }
    }

    &:last-child {
      align-items: flex-start;
    }
  }
}

.button_block {
  text-align: center;
  margin-top: 24px;
}
</style>
