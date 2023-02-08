<template>
  <section class="section_container contract" id="export_contract">
    <h2 class="mb-6">匯出套用合約</h2>

    <!-- 合約版本 -->
    <div class="contract_version_block mb-6">
      <label class="ad-radio-label">
        <input
          v-model="contractType"
          type="radio"
          name="contractType"
          value="1"
          :disabled="!canEdit"
          @change="changeContractType($event)"
        />
        <span class="ad-radio"></span>
        <span class="title">
          套用範本
        </span>
      </label>
      <div class="w-480">
        <SelectDropdown
          :disabled="!canEdit || contractType !== '1'"
          :value="selectedType"
          :options="
            account104 === 1 ? account104C01Options : account104C04Options
          "
          @value-changed="changeContract($event)"
          placeholder="請選擇合約版本"
        />
      </div>
      <!-- 合約版本選項 -->
      <div class="contract_version_options_block ml-7">
        <div>
          <label class="ad-radio-label" style="width: 80px;">
            <input
              v-model="contractVersionExtension"
              type="radio"
              name="contractVersionExtension"
              value="WORD"
              :disabled="!canEdit || contractType !== '1'"
              @change="setContractRadio($event)"
            />
            <span class="ad-radio"></span>Word
          </label>
          <label class="ad-radio-label">
            <input
              v-model="contractVersionExtension"
              type="radio"
              name="contractVersionExtension"
              value="PDF"
              :disabled="!canEdit || contractType !== '1'"
              @change="setContractRadio($event)"
            />
            <span class="ad-radio"></span>Pdf
          </label>
        </div>
      </div>
    </div>

    <!-- 預覽合約、下載合約 -->
    <div class="border_top_section">
      <button
        v-if="canEdit"
        @click="previewContract"
        type="button"
        class="button_bg_white_medium mr-4"
        :disabled="!canEdit || contractType !== '1'"
      >
        預覽合約
      </button>
      <button
        v-if="canEdit"
        type="button"
        @click="downloadContract"
        class="button_bg_white_medium"
        :disabled="!canEdit || contractType !== '1'"
      >
        下載合約
      </button>
    </div>

    <!-- 自行上傳 -->
    <div class="self_upload_block mb-5">
      <label class="ad-radio-label">
        <input
          v-model="contractType"
          type="radio"
          name="contractType"
          value="2"
          :disabled="!canEdit"
          @change="changeContractType($event)"
        />
        <span class="ad-radio"></span>
        <span class="title">
          自行上傳
        </span>
      </label>
      <div>
        <label class="ad-radio-label">
          <input
            v-model="contract"
            type="radio"
            name="contract"
            :value="2"
            :disabled="!canEdit || contractType !== '2'"
            @change="setContractRadio($event)"
          />
          <span class="ad-radio"></span>合約條文有調整
        </label>
        <label class="ad-radio-label">
          <input
            v-model="contract"
            type="radio"
            name="contract"
            :value="3"
            :disabled="!canEdit || contractType !== '2'"
            @change="setContractRadio($event)"
          />
          <span class="ad-radio"></span>合約條文未調整，僅修改銷售內容
        </label>
      </div>
    </div>

    <!-- 自行上傳 上傳檔案 -->
    <div class="self_upload_file_block">
      <Loading v-if="isUploading"></Loading>
      <template v-else>
        <div v-if="canEdit">
          <input
            type="file"
            ref="uploadFileRef"
            accept=".jpg,.jpeg,.gif,.png,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            style="display: none;"
            :disabled="(contract !== 2 && contract !== 3) || !canEdit"
            @change="uploadFile($event)"
          />
          <span
            class="file_upload"
            :class="{
              disabled: (contract !== 2 && contract !== 3) || !canEdit
            }"
            @click="handleInputFileClick"
          >
            <template>
              <img
                v-if="
                  (contract === 2 || contract === 3) &&
                    canEdit &&
                    files.length === 0
                "
                src="@/assets/icon/icon-photo-empty-blue.svg"
              />
              <img v-else src="@/assets/icon/icon-icon-photo.svg" />
            </template>
            上傳檔案
          </span>
          <img
            src="@/assets/icon/icon-info-warmgray.svg"
            v-tooltip="{
              placement: 'right',
              content: `<div>*上傳報價單圖檔</div>
                <div>*最大限制10MB</div> 
                <div>*可上傳的檔案格式：jpg,gif,pdf,doc,docx,ppt,pptx,xls,xlsx</div>`,
              offset: 5,
              trigger: 'hover'
            }"
            class="mr-3"
          />
          <div v-if="files.length > 0" class="file_name">
            <span>
              <a
                :href="
                  `${apiURL}api/quotation/attachment/${files[0].id}/quotation/${quotationData.id}/download`
                "
                rel="noopener"
                target="_blank"
                class="font-weight-bold"
                >{{ files[0].fileName }}</a
              >
              <icon
                v-if="canEdit"
                class="delete_icon"
                iconName="icon-16-delete-icon-delete-green"
                size="16"
                @click.native="deleteFile(files[0].id)"
            /></span>
          </div>
        </div>
      </template>
      <div v-if="!canEdit && files.length > 0" class="file_link">
        <a
          :href="
            `${apiURL}api/quotation/attachment/${files[0].id}/quotation/${quotationData.id}/download`
          "
          class="mr-2"
          >{{ files[0].fileName }}</a
        >
        <img src="@/assets/icon/icon-info-warmgray.svg" class="mr-1" />
        <span>若有更動條文必須重填新單</span>
      </div>
    </div>

    <Dialog
      ref="confirmDialog"
      @dialogCancel="dialogCancel"
      @dialogConfirm="clearUploadedFile"
      :isShow="showConfirm"
      :cancelButton="true"
      title="注意"
      content="自行上傳合約將被清空，確定執行此動作嗎？"
    />
  </section>
</template>

<script setup>
import { ref, toRefs, computed, watch, onMounted } from "vue";
import { useRoute } from "@/router/useRouter.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useFileUpload } from "@/composables/quotation/useFileUpload.js";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import Loading from "@/components/Loading.vue";
import Dialog from "@/components/Dialog.vue";
import { projectOrderData } from "@/utils/contractContent.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import { EventBus } from "@/utils/eventBus.js";
import localStorageService from "@/utils/localStorageData.js";
import DocxTemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils";
import { saveAs } from "file-saver";
import { round } from "@/utils/quotation";
import {
  paymentTermsType,
  usePreview
} from "@/composables/quotation/usePreview";

const { router } = useRoute();
const salesOrderStore = useSalesOrderStore();
const { quotationData } = toRefs(salesOrderStore);
const { isUploading, uploadFiles, deleteFile } = useFileUpload(
  quotationData.value.id,
  "CUSTOMIZED"
);
const { canEdit } = useFormStatus();
const { projectGroups, totalMarketPrice, totalPrice } = usePreview();
const account104 = computed(() => salesOrderStore.quotationData.account104);
const { contract } = toRefs(salesOrderStore.quotationData);
const files = computed(
  () => quotationData.value.quotationAttachmentCustomizedList
);
const contractVersionExtension = ref("WORD");
const uploadFileContractQuote = ref("");
const uploadFileSelf = ref("");
const selectedType = ref("整合性行銷專案委託單");
const selectedTypeValue = ref(1);
const uploadFileRef = ref(null);
const contractType = ref(null);
const account104C01Options = ref([
  { label: "整合性行銷專案委託單", value: 1 },
  { label: "整合性行銷專案委託單(VIP)", value: 2 }
]);
const account104C04Options = ref([
  { label: "整合性行銷專案委託單(管顧)", value: 4 }
]);
const apiURL = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;
const confirmDialog = ref(null);
const showConfirm = ref(false);

// 選擇合約版本
const changeContract = event => {
  if (event < 4) {
    selectedType.value = account104C01Options.value.find(
      option => option.value === event
    ).label;
  } else {
    selectedType.value = account104C04Options.value.find(
      option => option.value === event
    ).label;
  }
  selectedTypeValue.value = event;
};

// 選擇合約類型（範本or自行上傳）
const changeContractType = event => {
  if (event.target.value === "1") {
    contractVersionExtension.value = "WORD";
    contract.value = "";
    if (files.value.length >= 1) {
      showConfirm.value = true;
    }
  } else if (event.target.value === "2") {
    contractVersionExtension.value = "";
  }
};

// 選擇合約方式時，清空其他選項資料
const setContractRadio = event => {
  if (event.target.value === "2" || event.target.value === "3") {
    uploadFileContractQuote.value = "";
    contractVersionExtension.value = "";
    return;
  }
  uploadFileSelf.value = "";
  contractVersionExtension.value = contractVersionExtension.value || "WORD";
  contractType.value = "1";
};

// 上傳檔案互動視窗
const handleInputFileClick = () => {
  if (files.value.length >= 1) return;
  uploadFileRef.value.click();
};

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

// dialog 取消
const dialogCancel = () => {
  contractType.value = "2";
  showConfirm.value = false;
};

// 清除自行上傳合約
const clearUploadedFile = () => {
  const id = files.value[0].id;
  if (!id) return;
  deleteFile(id);
  showConfirm.value = false;
};

//  預覽合約
const previewContract = () => {
  const routeUrl = router.resolve({
    path: `/contractPreview/${quotationData.value.id}?type=${selectedTypeValue.value}`
  });
  localStorageService.handleLocalStorage(
    "setItem",
    "quotation",
    quotationData.value
  );
  window.open(routeUrl.href, "_blank");
};

// 下載素材
const downloadContract = () => {
  if (contractVersionExtension.value === "WORD") word();
  else if (contractVersionExtension.value === "PDF") pdf();
};

const word = () => {
  PizZipUtils.getBinaryContent("/word_template.docx", (error, content) => {
    if (error) {
      throw error;
    }
    var zip = new PizZip(content);
    const imageOpts = {
      centered: false,
      getImage: function(tagValue, tagName) {
        return new Promise(function(resolve, reject) {
          PizZipUtils.getBinaryContent(tagValue, function(error, content) {
            if (error) {
              return reject(error);
            }
            return resolve(content);
          });
        });
      },
      getSize: function(img, tagValue, tagName) {
        // FOR FIXED SIZE IMAGE :
        return [50, 50];

        // FOR IMAGE COMING FROM A URL (IF TAGVALUE IS AN ADDRESS) :
        // To use this feature, you have to be using docxtemplater async
        // (if you are calling render(), you are not using async).
        // return new Promise(function(resolve, reject) {
        //   const image = new Image();
        //   image.src = tagValue;
        //   image.onload = function() {
        //     resolve([image.width, image.height]);
        //   };
        //   image.onerror = function(e) {
        //     reject(e);
        //   };
        // });
      }
    };

    let doc = new DocxTemplater(zip, {
      modules: [new ImageModule(imageOpts)],
      paragraphLoop: true,
      linebreaks: true,
      nullGetter() {
        return "";
      }
    }).compile();

    let fileData = {
      customer_name: salesOrderStore.quotationData.customerName,
      quotation_id: salesOrderStore.quotationData.id,
      quotation_name: salesOrderStore.quotationData.name,
      order_start_date: salesOrderStore.quotationData.orderExecutionStartDate,
      order_end_date: salesOrderStore.quotationData.orderExecutionEndDate,
      company_contact: salesOrderStore.quotationData.companyContact,
      contact_jobtitle: salesOrderStore.quotationData.companyContactJobTitle,
      contact_email: salesOrderStore.quotationData.companyContactEmail,
      invoice_title: salesOrderStore.quotationData.invoiceTitle,
      invoice: salesOrderStore.quotationData.invoice,
      invoice_address:
        salesOrderStore.quotationData.invoicePaperRecipientAddress,
      invoice_recipient_email:
        salesOrderStore.quotationData.invoiceRecipientEmail,
      invoice_recipient_name:
        salesOrderStore.quotationData.invoiceRecipientName,
      invoice_type:
        salesOrderStore.quotationData.invoicePaperType === 2 ? "二聯" : "三聯",
      invoice_send_date: salesOrderStore.quotationData.invoiceSendNote
        ? "分期開立"
        : salesOrderStore.quotationData.invoiceSendDate,
      invoice_send_number:
        salesOrderStore.quotationData.invoiceSendDate || "單期",
      payment_method_1:
        salesOrderStore.quotationData.paymentMethod === 1 ? "■" : "□",
      payment_method_2:
        salesOrderStore.quotationData.paymentMethod === 2 ? "■" : "□",
      payment_method_3:
        salesOrderStore.quotationData.paymentMethod === 3 ? "■" : "□",
      payment_type:
        paymentTermsType[salesOrderStore.quotationData.paymentTerms],

      price: salesOrderStore.quotationData.totalPrice,
      price_tax: salesOrderStore.quotationData.totalPrice * 0.05,
      total_price_tax: salesOrderStore.quotationData.totalPriceIncludeTax,
      salesInfo_name: salesOrderStore.quotationData.salesInfo.name,
      salesInfo_tel: salesOrderStore.quotationData.salesExtension,
      salesInfo_mail: salesOrderStore.quotationData.salesEmail,
      test_content: projectOrderData,
      groups: projectGroups.value,
      totalMarketPrice: totalMarketPrice.value,
      totalPrice: totalPrice.value
    };
    fileData.discount = round(
      (fileData.totalPrice / fileData.totalMarketPrice) * 100,
      0
    );

    if (quotationData.value.companyPhone && quotationData.value.companyFax) {
      fileData.telephone = `${quotationData.value.companyPhone}/${quotationData.value.companyFax}`;
    } else if (quotationData.value.companyPhone) {
      fileData.telephone = quotationData.value.companyPhone;
    } else if (quotationData.value.companyFax) {
      fileData.telephone = quotationData.value.companyFax;
    }

    doc.renderAsync(fileData).then(function() {
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      saveAs(out, "word_file.docx");
    });
  });
};

const pdf = () => {
  EventBus.$emit("loadingShow");
  localStorageService.handleLocalStorage(
    "setItem",
    "quotation",
    quotationData.value
  );
  var ifrm = document.createElement("iframe");
  ifrm.id = "ifrm_test";
  ifrm.setAttribute(
    "src",
    `/contractPreview/${salesOrderStore.quotationData.id}?type=1&download=1`
  );
  ifrm.addEventListener("load", () => {
    EventBus.$emit("loadingHide");
    setTimeout(() => {
      document.body.removeChild(ifrm);
    }, 10000);
  });
  document.body.appendChild(ifrm);
  return false;
};

watch(account104, newVal => {
  changeContract(newVal);
});

onMounted(() => {
  if (files.value.length > 0) {
    contractType.value = "2";
  } else {
    contractType.value = "1";
  }
});
</script>

<style lang="scss" scoped>
.section_container {
  margin-bottom: 20px;
  line-height: 1.38;
  letter-spacing: 1.38px;

  h2 {
    font-size: 20px;
  }

  .contract_version_block,
  .contract_version_options_block,
  .quote_content_block,
  .self_upload_block,
  .self_upload_file_block {
    display: flex;
    align-items: center;

    .title {
      font-weight: bold;
    }
  }

  .contract_version_block,
  .self_upload_block {
    position: relative;

    .title {
      margin-right: 28px;

      &::after {
        position: absolute;
        color: #7e7e7e;
        line-height: 1.43;
        font-size: 14px;
        letter-spacing: 1.43px;
      }
    }
  }

  .contract_version_block {
    .title {
      &::after {
        content: "(104)";
        top: 32px;
        left: 36px;
      }
    }

    .w-480 {
      width: 480px;
    }
  }

  .quote_content_block {
    .title {
      margin-right: 28px;
    }

    .contract {
      display: flex;
      align-items: center;
    }
  }

  .border_top_section {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    text-align: right;
  }

  .self_upload_block {
    .title {
      &::after {
        content: "(非104)";
        top: 28px;
        left: 36px;
      }
    }
  }

  .self_upload_file_block {
    margin-left: 150px;
  }

  .file_link {
    a {
      font-weight: bold;
    }

    span {
      color: #ea475b;
      font-weight: bold;
    }
  }
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

.file_name {
  margin-top: 12px;

  span {
    display: block;

    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }

  ::v-deep {
    .delete_icon {
      cursor: pointer;
    }
  }
}
</style>
