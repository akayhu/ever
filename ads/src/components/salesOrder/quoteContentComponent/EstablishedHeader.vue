<template>
  <div class="established_cards">
    <div>
      <div>
        <div>訂單單號</div>
        <div>{{ quotationData.orderId }}</div>
      </div>
      <div>
        <div>申請日期</div>
        <div>{{ quotationData.createDate }}</div>
      </div>
      <div>
        <div>有效日期</div>
        <div>{{ quotationData.quotationExpiryDate || "- -" }}</div>
      </div>
    </div>
    <div>
      <div>
        <div>訂單狀態</div>
        <div>{{ statusLabel }}</div>
      </div>
      <div v-if="quotationData.quotationAttachmentHandWrittenList.length > 0">
        <img
          src="@/assets/icon/icon-icon-eye-on.svg"
          class="mr-1"
        />未用印(手簽版)
      </div>
      <div
        v-if="quotationData.quotationAttachmentHandWrittenList.length > 0"
        class="unused_print"
      >
        <a
          v-for="item in quotationData.quotationAttachmentHandWrittenList"
          :key="item.id"
          :href="
            `${apiURL}api/quotation/attachment/${item.id}/quotation/${item.quotationId}/download`
          "
          rel="noopener"
          target="_blank"
          :title="item.fileName"
        >
          {{ item.fileName }}
        </a>
      </div>
      <div>
        <img
          src="@/assets/icon/icon-icon-eye-on.svg"
          class="mr-1"
        />用印合約<img
          v-if="quotationData.quotationAttachmentContractList.length > 0"
          src="@/assets/icon/icon-info-warmgray.svg"
          class="ml-1"
          v-tooltip="{
            placement: 'right',
            content: `請選擇欲上傳的用印合約，最多可選五筆！`,
            offset: 5,
            trigger: 'hover'
          }"
        />
      </div>
      <div v-if="!isUploading" class="whole">
        <div v-for="item in contractList" :key="item.id">
          <a
            :href="
              `${apiURL}api/quotation/attachment/${item.id}/quotation/${item.quotationId}/download`
            "
            rel="noopener"
            target="_blank"
            :title="item.fileName"
          >
            {{ item.fileName }}
          </a>

          <icon
            v-if="quotationData.quotationAttachmentHandWrittenList.length > 0"
            class="delete_icon ml-2"
            iconName="icon-16-delete-icon-delete-green"
            size="16"
            @click.native="deleteFile(item.id)"
          />
        </div>
      </div>
      <div v-if="isUploading" class="loading"><Loading /></div>
      <div
        v-if="
          contractList.length < 5 &&
            quotationData.quotationAttachmentHandWrittenList.length > 0
        "
        class="upload_button"
      >
        <input
          type="file"
          ref="uploadFileRef"
          accept=".jpg,.jpeg,.gif,.png,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          style="display: none;"
          multiple="true"
          @change="uploadFile($event)"
        />
        <span class="file_upload" @click="handleInputFileClick">
          <img src="@/assets/icon/icon-photo-empty-blue.svg" />
          上傳用印檔案
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, computed } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFileUpload } from "@/composables/quotation/useFileUpload.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Loading
  },
  setup() {
    const salesOrderStore = useSalesOrderStore();
    const { quotationData } = toRefs(salesOrderStore);
    const contractList = computed(
      () => quotationData.value.quotationAttachmentContractList
    );
    const { uploadFiles, deleteFile, isUploading } = useFileUpload(
      quotationData.value.id,
      "CONTRACT"
    );
    const { statusLabel } = useFormStatus();
    const apiURL = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;
    const uploadFileRef = ref(null);

    // 上傳檔案
    const uploadFile = async e => {
      if (!quotationData.value.id) return;
      const elFiles = e.target.files;
      const files = [...elFiles].filter(file => file.size);
      if (files.length === 0) return;

      try {
        await uploadFiles(files);
      } catch (err) {
        console.error(err);
      }
    };

    // 上傳檔案互動視窗
    const handleInputFileClick = () => {
      uploadFileRef.value.click();
    };

    return {
      contractList,
      quotationData,
      apiURL,
      uploadFileRef,
      uploadFile,
      handleInputFileClick,
      deleteFile,
      statusLabel,
      isUploading
    };
  }
};
</script>

<style lang="scss" scoped>
.established_cards {
  display: flex;

  > div {
    border-radius: 8px;
    background-color: #eef8b1;
    padding: 16px;
    margin: 24px 0;

    &:nth-child(1) {
      width: 300px;
      margin-right: 20px;
      font-size: 16px;
      font-weight: bold;

      > div {
        display: flex;
        line-height: 1.38;
        letter-spacing: 1.38px;
        margin-bottom: 12px;

        div {
          &:nth-child(1) {
            color: #292929;
            margin-right: 12px;
          }
          &:nth-child(2) {
            color: #19b9c0;
          }
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    &:nth-child(2) {
      width: 580px;
      font-size: 16px;
      font-weight: bold;

      > div {
        display: flex;
        line-height: 1.38;
        letter-spacing: 1.38px;
        margin-bottom: 12px;

        &:nth-child(1) {
          div {
            &:nth-child(1) {
              color: #292929;
              margin-right: 12px;
            }
            &:nth-child(2) {
              color: #19b9c0;
            }
          }
        }

        &:nth-child(2),
        &:nth-child(4) {
          align-items: center;
          color: #19b9c0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .loading {
      margin: 0 auto;
      width: 48px;
    }

    .unused_print {
      display: initial !important;
      align-items: center;

      a {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 250px;
        margin-top: 8px;

        &:nth-child(1),
        &:nth-child(2) {
          margin-top: 0;
        }
        &:nth-child(odd) {
          margin-left: 32px;
        }
        &:nth-child(even) {
          margin-left: 8px;
        }
      }
    }

    .whole {
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 0 !important;

      div {
        display: flex;
        align-items: center;
        width: 248px;
        margin-top: 8px;

        &:nth-child(1),
        &:nth-child(2) {
          margin-top: 0;
        }
        &:nth-child(odd) {
          margin-left: 32px;
        }
        &:nth-child(even) {
          margin-left: 16px;
        }

        a {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 222px;
        }
      }
    }

    .upload_button {
      margin-top: 12px;
    }
  }
}

.file_upload {
  border-radius: 4px;
  border: dashed 1px #00afb8;
  width: 160px;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.43;
  color: #00afb8;
  padding: 7px 6px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  margin-right: 8px;
  background-color: #fff;
}

.delete_icon {
  cursor: pointer;
}

.button {
  border-radius: 4px;
  border: solid 1px #00afb8;
  background-color: #fff;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.43;
  letter-spacing: 1.43px;
  text-align: center;
  color: #00afb8;
  padding: 6px 20px;
  margin-left: 16px;
}
</style>
