import { ref, computed } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import axios from "axios";

export const useFileUpload = (quotationId, type) => {
  let isUploading = ref(false);
  const salesOrderStore = useSalesOrderStore();
  const fileList = computed(() => {
    const typeObj = {
      QUOTATION: salesOrderStore.quotationData.quotationAttachmentQuotationList,
      CUSTOMIZED:
        salesOrderStore.quotationData.quotationAttachmentCustomizedList,
      CONTRACT: salesOrderStore.quotationData.quotationAttachmentContractList,
      HANDWRITTEN:
        salesOrderStore.quotationData.quotationAttachmentHandWrittenList
    };
    return typeObj[type] || [];
  });

  const uploadFiles = async files => {
    try {
      isUploading.value = true;
      const uploadListDestination = await salesOrderStore.getPresignedurl({
        fileNameList: files.map(file => file.name).join(","),
        quotationId,
        type
      });
      for (let [index, item] of uploadListDestination.entries()) {
        await axios({
          method: "put",
          url: item.url,
          data: files[index],
          headers: { "content-type": `${files[index].type}` }
        });
      }
      const fileInfo = await salesOrderStore.postUploadFinished({
        fileNameList: files.map(file => file.name),
        quotationId,
        type
      });
      fileInfo.forEach(file => fileList.value.push(file));
    } catch (error) {
      console.error(error);
    } finally {
      isUploading.value = false;
    }
  };

  const deleteFile = async attachmentId => {
    isUploading.value = true;
    await salesOrderStore.deleteFile({
      attachmentId,
      quotationId
    });

    const index = fileList.value.findIndex(f => f.id === attachmentId);
    fileList.value.splice(index, 1);
    isUploading.value = false;
  };

  return {
    isUploading,
    uploadFiles,
    deleteFile
  };
};
