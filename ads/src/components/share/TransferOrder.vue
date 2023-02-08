<template>
  <div>
    <Modal
      @close="cancel"
      :isShow="isShowTransferOrder"
      title="轉訂單"
      comment="請先選擇欲上傳的合約版本，再進行上傳檔案，檔案最多可選五筆！"
      width="711"
    >
      <template #body>
        <div class="transfer_order_main">
          <div class="title">請上傳合約電子檔</div>
          <div class="electronic_file">
            <label class="ad-radio-label">
              <input
                v-model="electronicFile"
                type="radio"
                name="electronicFile"
                value="CONTRACT"
              />
              <span class="ad-radio"></span>用印電子檔
            </label>
            <label class="ad-radio-label">
              <input
                v-model="electronicFile"
                type="radio"
                name="electronicFile"
                value="HANDWRITTEN"
              />
              <span class="ad-radio"></span>未用印(手簽版)
            </label>
          </div>
          <div>
            <input
              ref="uploadFileRef"
              type="file"
              accept=".jpg,.jpeg,.gif,.png,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              style="display: none;"
              multiple="true"
              @change="uploadFile($event)"
            />
            <span
              class="file_upload"
              :class="{ disabled: !electronicFile }"
              @click="fileClick"
            >
              <img
                v-if="!electronicFile"
                src="@/assets/icon/icon-icon-photo.svg"
              />
              <img v-else src="@/assets/icon/icon-photo-empty-blue.svg" />
              上傳檔案
            </span>
          </div>
          <div v-if="files.length > 0" class="mt-4 filesName">
            <div v-for="(item, index) in files" :key="index">
              {{ item.name }}
            </div>
          </div>
          <div v-if="filesLengthExceed" class="files_length_error">
            檔案超過五筆！請重新上傳檔案！
          </div>
        </div>
        <div v-if="!submitLoading" class="button_block">
          <button
            type="button"
            class="button_bg_white_large mr-7"
            @click="cancel"
          >
            取消
          </button>
          <button
            :disabled="files.length === 0"
            type="button"
            class="button_bg_blue_large"
            @click="sendSign"
          >
            送出
          </button>
        </div>
        <div v-if="submitLoading"><Loading /></div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ref, toRefs } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFileUpload } from "@/composables/quotation/useFileUpload.js";
import Modal from "@/components/share/Modal.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Modal,
    Loading
  },
  props: {
    isShowTransferOrder: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const salesOrderStore = useSalesOrderStore();
    const { quotationData } = toRefs(salesOrderStore);
    const electronicFile = ref("");
    const uploadFileRef = ref(null);
    const files = ref([]);
    const filesLengthExceed = ref(false);
    const submitLoading = ref(false);

    // 上傳檔案互動視窗
    const fileClick = () => {
      if (!electronicFile.value) return;
      uploadFileRef.value.click();
    };

    // 上傳檔案
    const uploadFile = e => {
      if (!quotationData.value.id) return;
      const elFiles = e.target.files;
      if (elFiles.length > 5) {
        filesLengthExceed.value = true;
        return;
      } else {
        filesLengthExceed.value = false;
        files.value = [...elFiles].filter(file => file.size);
      }
    };

    // 取消
    const cancel = () => {
      emit("cancelShowTransferOrder");
    };

    // 送出
    const sendSign = async () => {
      submitLoading.value = true;
      const { uploadFiles } = useFileUpload(
        quotationData.value.id,
        electronicFile.value
      );
      try {
        await uploadFiles(files.value);
      } catch (err) {
        console.error(err);
      }
      submitLoading.value = false;
      emit("submitTransferOrder");
    };

    return {
      files,
      electronicFile,
      fileClick,
      sendSign,
      cancel,
      uploadFileRef,
      uploadFile,
      filesLengthExceed,
      submitLoading
    };
  }
};
</script>

<style lang="scss" scoped>
.transfer_order_main {
  text-align: center;
  width: 600px;
  margin: 32px auto 24px;
  padding-bottom: 24px;
  border-bottom: solid 1px #ddd;

  .title {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1.38px;
  }

  .electronic_file {
    margin: 24px 0;
  }

  .file_upload {
    border-radius: 4px;
    border: dashed 1px #00afb8;
    width: 124px;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.43;
    color: #00afb8;
    padding: 7px 6px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    margin-right: 8px;
    letter-spacing: 1.38px;

    &.disabled {
      cursor: not-allowed;
      color: #a9a9a9;
      border-color: #a9a9a9;
      font-weight: normal;

      &:hover {
        background-color: #fff;
      }
    }
  }

  .filesName {
    color: #1654b9;
    font-weight: bold;
    letter-spacing: 1.38px;
  }
}

.button_block {
  text-align: center;
  margin-bottom: 50px;
}

.files_length_error {
  color: #ea475b;
  font-size: 16px;
  font-weight: initial;
  letter-spacing: 1px;
  margin-top: 16px;
}
</style>
