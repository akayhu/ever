<template>
  <div class="add_quotation_menu_block">
    <div v-if="!isDraftForm" class="add_quotation_menu">
      <span v-for="action in actions" :key="action.text" @click="action.event">
        <img :src="action.icon" />
        {{ action.text }}
      </span>
      <router-link
        :to="name === '內服單' ? '/internalOrder' : '/salesOrderList'"
      >
        <img
          src="@/assets/icon/btn-close.svg"
          v-tooltip="{
            placement: 'right',
            offset: 5,
            content: '返回列表',
            trigger: 'hover'
          }"
        />
      </router-link>
    </div>

    <Teleport to="#componentDialog">
      <Dialog
        @dialogCancel="showDialog = false"
        @dialogConfirm="handleConfirm"
        :isShow="showDialog"
        :cancelButton="showCancelButton"
        :title="dialogTitle"
        :content="dialogContent"
      />

      <!-- 抽單原因 -->
      <Modal
        @close="closeDrawReasonDialog"
        :isShow="showDrawReasonDialog"
        title="抽單原因"
        width="711"
      >
        <template #body>
          <div class="draw_reason_block">
            <el-input
              v-model="reason"
              :autosize="{ minRows: 6 }"
              show-word-limit
              type="textarea"
              placeholder="請輸入"
              maxlength="500"
              class="input_field"
            />
            <div class="draw_button_block">
              <button
                type="button"
                class="button_bg_white_large mr-7"
                @click="closeDrawReasonDialog"
              >
                取消
              </button>
              <button
                type="button"
                class="button_bg_blue_large"
                @click="sendDraw"
              >
                送出
              </button>
            </div>
          </div>
        </template>
      </Modal>

      <!-- 轉訂單 action -->
      <TransferOrder
        :isShowTransferOrder="showTransferOrder"
        @cancelShowTransferOrder="showTransferOrder = false"
        @submitTransferOrder="submitTransferOrder"
      />
    </Teleport>
  </div>
</template>

<script>
import { ref, computed, nextTick } from "vue";
import { useRoute } from "@/router/useRouter.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import TransferOrder from "@/components/share/TransferOrder.vue";
import Teleport from "@/components/Teleport.vue";
import Dialog from "@/components/Dialog.vue";
import Modal from "@/components/share/Modal.vue";

export default {
  components: {
    Teleport,
    TransferOrder,
    Dialog,
    Modal
  },
  props: {
    validate: Function,
    resetValidation: Function
  },
  setup(props) {
    const { route, router } = useRoute();
    const salesOrderStore = useSalesOrderStore();
    const { isDraftForm } = useFormStatus();
    // 內服單新增時，預設只有儲存
    const actions = computed(
      () =>
        salesOrderStore.quotationData.quotationActionList?.map(
          action => ACTIONS_TYPE[action]
        ) || [ACTIONS_TYPE["SAVE"]]
    );
    const showDialog = ref(false);
    const showCancelButton = ref(false);
    const showTransferOrder = ref(false);
    const showDrawReasonDialog = ref(false);
    const reason = ref(null);
    const dialogTitle = ref("");
    const dialogContent = ref("");
    const ACTIONS_ENUM = Object.freeze({
      DELETE: "DELETE",
      SAVE: "SAVE",
      SEAL: "SEAL",
      RETRIEVE: "RETRIEVE",
      DISCARD: "DISCARD",
      SIGN: "SIGN",
      FINISH: "FINISH",
      APPROVAL: "APPROVAL",
      REJECT: "REJECT"
    });
    const name =
      route.name === "CreateInternalOrder" ||
      route.name === "EditInternalOrder" ||
      route.name === "ViewInternalOrder"
        ? "內服單"
        : "報價單";
    const ACTIONS_TYPE = {
      DELETE: {
        icon: require("@/assets/icon/delete.svg"),
        text: "刪除",
        event: () => {
          performAction({
            title: `刪除${name}！`,
            content: `您確定要刪除此${name}嗎？`,
            actionType: ACTIONS_ENUM.DELETE,
            cancelButton: true
          });
        }
      },
      SAVE: {
        icon: require("@/assets/icon/icon-ordoff-namal.svg"),
        text: "儲存",
        event: () => {
          if (props.validate()) {
            salesOrderStore.createQuotation().then(res => {
              props.resetValidation();
              const content =
                res.stage === 1
                  ? `此單已成為完稿，完稿不可再清除欄位或刪除${name}，但可作廢`
                  : `可查詢${name}狀態`;
              performAction({
                title: `${name}儲存已完成！`,
                content,
                actionType: ACTIONS_ENUM.SAVE,
                cancelButton: false
              });
            });
          }
        }
      },
      SEAL: {
        icon: require("@/assets/icon/icon-seal-normal.svg"),
        text: "用印申請",
        event: () => {
          salesOrderStore.changeAction("SEAL").then(() => {
            window.location.reload();
          });
        }
      },
      RETRIEVE: {
        icon: require("@/assets/icon/icon-ordoff-normal.svg"),
        text: "抽單",
        event: () => (showDrawReasonDialog.value = true)
      },
      DISCARD: {
        icon: require("@/assets/icon/icon-void-nomal.svg"),
        text: "作廢",
        event: () => {
          salesOrderStore.changeAction("DISCARD").then(() => {
            window.location.reload();
          });
        }
      },
      SIGN: {
        icon: require("@/assets/icon/icon-signoff-normal.svg"),
        text: salesOrderStore.quotationData.stage === 2 ? "轉訂單" : "送出簽核",
        event: async () => {
          if (props.validate()) {
            props.resetValidation();
            if (salesOrderStore.quotationData.stage === 2) {
              showTransferOrder.value = true;
            } else {
              await salesOrderStore.changeAction("SIGN");
              props.resetValidation();
              performAction({
                title: `${name}已送出簽核！`,
                content: "可查詢送出簽核狀態",
                actionType: ACTIONS_ENUM.SIGN,
                cancelButton: false
              });
            }
          }
        }
      },
      FINISH: {
        icon: require("@/assets/icon/icon-ordoff-normal.svg"),
        text: "結案",
        event: () => {
          salesOrderStore.changeAction("FINISH").then(() => {
            window.location.reload();
          });
        }
      },
      // 暫時提供，待簽核機制完成後移除
      APPROVAL: {
        icon: require("@/assets/icon/icon-ordoff-normal.svg"),
        text: "核准",
        event: () => {
          salesOrderStore.changeAction("APPROVAL").then(() => {
            window.location.reload();
          });
        }
      },
      // 暫時提供，待簽核機制完成後移除
      REJECT: {
        icon: require("@/assets/icon/icon-ordoff-normal.svg"),
        text: "駁回",
        event: () => {
          salesOrderStore.changeAction("REJECT").then(() => {
            window.location.reload();
          });
        }
      }
    };

    let currentAction = null;

    // dialog 按下確定
    const handleConfirm = async () => {
      showDialog.value = false;
      if (
        currentAction !== ACTIONS_ENUM.SIGN &&
        currentAction !== ACTIONS_ENUM.DELETE &&
        currentAction !== ACTIONS_ENUM.RETRIEVE
      )
        return;

      props.resetValidation();

      if (currentAction === ACTIONS_ENUM.DELETE) {
        await salesOrderStore.deleteQuotation();
      }

      nextTick(() => {
        name === "內服單"
          ? router.push("/internalOrder")
          : router.push("/salesOrderList");
      });
    };

    // 打開 Dialog 動作
    const performAction = dialogData => {
      showDialog.value = true;
      showCancelButton.value = dialogData.cancelButton;
      dialogTitle.value = dialogData.title;
      dialogContent.value = dialogData.content;
      currentAction = dialogData.actionType;
    };

    // 轉訂單送出
    const submitTransferOrder = async () => {
      await salesOrderStore.changeAction("SIGN");
      showTransferOrder.value = false;
      performAction({
        title: "您已轉訂單完成！",
        content: "按下確認鈕後至列表頁",
        actionType: ACTIONS_ENUM.SIGN,
        cancelButton: false
      });
    };

    // 關閉抽單原因 Dialog
    const closeDrawReasonDialog = () => {
      showDrawReasonDialog.value = false;
    };

    // 送出抽單原因
    const sendDraw = () => {
      salesOrderStore.changeAction("RETRIEVE").then(() => {
        showDrawReasonDialog.value = false;
        performAction({
          title: "您已抽單完成！",
          content: "按下確認鈕後至列表頁",
          actionType: ACTIONS_ENUM.RETRIEVE,
          cancelButton: false
        });
      });
    };

    return {
      route,
      actions,
      isDraftForm,
      showDialog,
      showCancelButton,
      showTransferOrder,
      dialogTitle,
      dialogContent,
      handleConfirm,
      submitTransferOrder,
      showDrawReasonDialog,
      closeDrawReasonDialog,
      reason,
      sendDraw,
      name
    };
  }
};
</script>

<style lang="scss" scoped>
.add_quotation_menu_block {
  position: sticky;
  top: 90px;
  z-index: 1998;
  text-align: right;
  min-height: 39px;
  width: max-content;
  margin-left: auto;

  .add_quotation_menu {
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(169, 169, 169, 0.5);
    background-color: #fff;
    padding: 5px 24px;
    font-weight: bold;
    letter-spacing: 1.38px;
    color: #292929;

    span {
      cursor: pointer;
      margin-right: 15px;

      &::after {
        content: "";
        border-right: 1px solid #d8d8d8;
        height: 18px;
        padding-right: 12px;
      }

      &:last-child {
        margin-right: 0;

        &::after {
          border-right: 0;
          padding-right: 0;
        }
      }

      img {
        vertical-align: bottom;
        cursor: pointer;
      }
    }
  }
}

.draw_reason_block {
  margin-top: 4px;

  .draw_button_block {
    margin-top: 48px;
    margin-bottom: 36px;
    text-align: center;
  }
}

.input_field {
  width: 100%;

  ::v-deep textarea {
    background-color: #f3f3f3;
    border: 1px solid #ddd;
    font-size: 16px;
  }

  ::v-deep .el-input__count {
    color: #7e7e7e !important;
    background-color: #f3f3f3 !important;
  }
}
</style>
