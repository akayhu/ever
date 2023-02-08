<template>
  <div>
    <!-- 報價單基本資料上方表頭 -->
    <div class="cards">
      <OrderHeader
        v-for="(item, index) in cardsData"
        :key="index"
        :data="item"
      />
    </div>

    <!-- 公司別 -->
    <div class="account_block mb-4">
      <div class="title mr-7">公司別<span class="necessary">*</span></div>
      <div>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.account104"
            :value="1"
            type="radio"
            name="company_type"
          />
          <span class="ad-radio"></span>一零四資訊科技
        </label>
        <label class="ad-radio-label">
          <input
            v-model="quotationData.account104"
            :value="4"
            type="radio"
            name="company_type"
          />
          <span class="ad-radio"></span>一零四管理顧問
        </label>
      </div>
    </div>

    <!-- 公司別、申請人 -->
    <div class="applicant_block mb-6 pb-6">
      <div class="title mr-7">申請人</div>
      <div class="mr-7">
        <input
          :value="quotationData.applicantInfo.name"
          type="text"
          widthType="154"
          disabled
        />
      </div>
      <div class="title mr-7">業務人員<span class="necessary">*</span></div>
      <div class="w-280">
        <SelectDropdown
          @value-changed="setSelectedSales($event)"
          :value="selectedSales"
          :options="searchedSalesOptions"
          :asncSearchCb="accountSearch"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          placeholder="請輸入業務人員"
        />
      </div>
    </div>

    <!-- BU -->
    <div class="client_block mb-4">
      <div class="title">BU<span class="necessary">*</span></div>
      <div class="w-480">
        <el-select v-model="quotationData.bu" placeholder="請選擇">
          <el-option
            v-for="item in buOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 客戶 -->
    <div class="client_block mb-4">
      <div class="title">客戶<span class="necessary">*</span></div>
      <div class="w-480">
        <SelectDropdown
          @value-changed="setSelectedClient($event)"
          :value="selectedClient"
          :options="searchedClientOptions"
          :asncSearchCb="companySuggestSearch"
          :class="{ error_message_border: v$.customerId.$error }"
          :filterable="true"
          :remote="true"
          :optionsAllData="true"
          :disabled="!isDraftForm"
          placeholder="請輸入統編、代碼或公司名稱"
          class="input_field"
        />
        <div v-if="v$.customerId.$error" class="error_message">
          請輸入統編、代碼或公司名稱
        </div>
      </div>
    </div>

    <!-- 案件名稱 -->
    <div class="case_name_block mb-4">
      <div class="title">案件名稱<span class="necessary">*</span></div>
      <div>
        <input
          v-model="quotationData.name"
          type="text"
          :class="{ error_message_border: v$.name.$error }"
          placeholder="請輸入"
          widthType="480"
        />
        <div v-if="v$.name.$error" class="error_message">
          請輸入案件名稱
        </div>
      </div>
    </div>

    <!-- 預計執行時間 -->
    <div class="execution_date_block mb-4">
      <div class="title">預計執行時間<span class="necessary">*</span></div>
      <div class="w-480">
        <DatePicker ref="date_Picker" :getSearchTime="getTime" />
      </div>
    </div>

    <!-- 主管報價說明 -->
    <div class="note4Internal_block mb-4">
      <div class="title">主管報價說明</div>
      <div class="w-680">
        <el-input
          v-model="quotationData.note4Internal"
          :autosize="{ minRows: 6 }"
          show-word-limit
          type="textarea"
          placeholder="請輸入"
          maxlength="1500"
          class="input_field"
        />
      </div>
    </div>

    <!-- 合約說明/備註 -->
    <div class="note_block mb-4">
      <div class="title">合約說明/備註<br />(顯示於合約)</div>
      <div class="w-680">
        <el-input
          v-model="quotationData.note"
          :autosize="{ minRows: 6 }"
          show-word-limit
          type="textarea"
          placeholder="請輸入"
          maxlength="1500"
          class="input_field"
        />
      </div>
    </div>

    <!-- 附件(報價單) -->
    <div class="field_block align-items-baseline">
      <div class="title">附件(報價單)</div>
      <div>
        <Loading v-if="isUploading"></Loading>
        <template v-else>
          <input
            type="file"
            ref="uploadFileAttachedRef"
            accept=".jpg,.jpeg,.gif,.png,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            multiple="true"
            style="display: none;"
            @change="uploadFile($event)"
          />
          <span
            class="file_upload"
            @click="handleInputFileClick"
            :class="{
              disabled:
                quotationData.quotationAttachmentQuotationList.length >= 5 ||
                !quotationData.canEdit
            }"
          >
            <template>
              <img
                v-if="
                  quotationData.quotationAttachmentQuotationList.length < 5 &&
                    quotationData.canEdit
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
              content: `<div>*上傳最後報價單</div>
                <div>*最大限制10MB</div> 
                <div>*可上傳的檔案格式：jpg,gif,pdf,doc,docx,ppt,pptx,xls,xlsx</div>`,
              offset: 5,
              trigger: 'hover'
            }"
          />
          <div class="file_name">
            <span
              v-for="file in quotationData.quotationAttachmentQuotationList"
              :key="file.id"
              ><a
                :href="
                  `${apiURL}api/quotation/attachment/${file.id}/quotation/${quotationData.id}/download`
                "
                rel="noopener"
                target="_blank"
                class="font-weight-bold"
              >
                {{ file.fileName }} </a
              ><icon
                v-if="quotationData.canEdit"
                class="delete_icon"
                iconName="icon-16-delete-icon-delete-green"
                size="16"
                @click.native="deleteFile(file.id)"
            /></span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "@/store/index.js";
import { ref, computed, onMounted, watch, toRefs } from "vue";
import { useAccountStore } from "@/stores/account.js";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import { useFileUpload } from "@/composables/quotation/useFileUpload.js";
import OrderHeader from "@/components/salesOrder/quoteContentComponent/OrderHeader.vue";
import SelectDropdown from "@/components/share/SelectDropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    SelectDropdown,
    OrderHeader,
    DatePicker,
    Loading
  },
  setup() {
    const store = useStore();
    const accountStore = useAccountStore();
    const salesOrderStore = useSalesOrderStore();
    const { getAccountSearch } = accountStore;
    const getUserStatus = computed(() => store.getters["user/getUserStatus"]);
    const { quotationData } = toRefs(salesOrderStore);
    const { statusLabel, isDraftForm } = useFormStatus();
    const { uploadFiles, deleteFile, isUploading } = useFileUpload(
      quotationData.value.id,
      "QUOTATION"
    );
    const date_Picker = ref([]);
    const searchedSalesOptions = ref([]);
    const selectedSales = ref("");
    const searchedClientOptions = ref([]);
    const selectedClient = ref("");
    const selectedClientId = ref("");
    const uploadFileAttachedRef = ref(null);
    const apiURL = `https:${process.env.VUE_APP_API_DOMAIN_URL}`;
    const cardsData = computed(() => [
      {
        title: "報價單號",
        content: quotationData.value.id
      },
      {
        title: "報價單狀態",
        content: statusLabel.value
      },
      {
        title: "申請日期",
        content: "- -"
      },
      {
        title: "有效日期",
        content: "- -"
      }
    ]);
    const buOptions = [
      { label: "整招招募服務", value: 103 },
      { label: "整合招募服務(教育)", value: 112 }
    ];

    onMounted(() => {
      selectedSales.value = `${quotationData.value.salesInfo.logonId}(${quotationData.value.salesInfo.name}/${quotationData.value.salesInfo.accountId})`;
      searchedSalesOptions.value = [
        {
          accountId: quotationData.value.salesInfo.accountId,
          logonId: quotationData.value.salesInfo.logonId,
          name: quotationData.value.salesInfo.name,
          label: `${quotationData.value.salesInfo.logonId}(${quotationData.value.salesInfo.name}/${quotationData.value.salesInfo.accountId})`,
          value: quotationData.value.salesInfo.accountId
        }
      ];
      selectedClient.value = `${quotationData.value.customerName}(${quotationData.value.customerId})`;

      // 預計執行時間
      if (
        quotationData.value.orderExecutionStartDate &&
        quotationData.value.orderExecutionEndDate
      ) {
        date_Picker.value.dateValue = [
          quotationData.value.orderExecutionStartDate,
          quotationData.value.orderExecutionEndDate
        ];
      }
    });

    const rules = {
      customerId: { required },
      name: { required, maxLength: maxLength(50) },
      note4Internal: {},
      note: {}
    };

    // 選擇業務人員
    const setSelectedSales = data => {
      selectedSales.value = searchedSalesOptions.value.find(
        option => option.name === data.name
      ).label;
      quotationData.value.salesId = data.accountId;
    };

    // 業務人員 AC
    const accountSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        const responseData = await getAccountSearch({ keyword });
        searchedSalesOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.accountId,
            label: `${item.logonId}(${item.name}/${item.accountId})`
          };
        });
      }
    };

    // 選擇客戶
    const setSelectedClient = async data => {
      await salesOrderStore.getCustomerCredit({ customerId: data.value });
      selectedClient.value = searchedClientOptions.value.find(
        option => option.name === data.name
      ).label;
      selectedClientId.value = searchedClientOptions.value.find(
        option => option.name === data.name
      ).value;
      quotationData.value.customerId = data.value;
    };

    // 客戶 AC
    const companySuggestSearch = async keyword => {
      if (!keyword) return;
      if (keyword.length >= 2) {
        let query = !isNaN(Number(keyword))
          ? { invoice: keyword }
          : { keyword };
        const responseData = await store.dispatch(
          "project/getCustomerSuggestion",
          query
        );

        searchedClientOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
      }
    };

    // 預計執行時間
    const getTime = time => {
      quotationData.value.orderExecutionStartDate = time.searchTimeStart;
      quotationData.value.orderExecutionEndDate = time.searchTimeEnd;
    };

    // 上傳檔案互動視窗
    const handleInputFileClick = () => {
      if (quotationData.value.quotationAttachmentQuotationList.length >= 5)
        return;
      uploadFileAttachedRef.value.click();
    };

    // 上傳檔案
    const uploadFile = async e => {
      if (!quotationData.value.id) return;

      const elFiles = e.target.files;
      const files = [...elFiles].filter(
        file => file.size && file.size <= 10000000
      );
      if (files.length === 0) return;

      try {
        await uploadFiles(files);
      } catch (err) {
        console.error(err);
      }
    };

    watch(
      quotationData,
      newValue => {
        if (newValue.orderExecutionStartDate) {
          date_Picker.value.dateValue = [
            newValue.orderExecutionStartDate,
            newValue.orderExecutionEndDate
          ];
          quotationData.value.orderExecutionStartDate =
            newValue.orderExecutionStartDate;
          quotationData.value.orderExecutionEndDate =
            newValue.orderExecutionEndDate;
        }
      },
      { immediate: true }
    );

    return {
      v$: useVuelidate(rules, quotationData, { $autoDirty: true }),
      quotationData,
      getUserStatus,
      cardsData,
      searchedSalesOptions,
      selectedSales,
      statusLabel,
      isDraftForm,
      uploadFileAttachedRef,
      apiURL,
      isUploading,
      buOptions,
      setSelectedSales,
      accountSearch,
      setSelectedClient,
      searchedClientOptions,
      selectedClient,
      companySuggestSearch,
      date_Picker,
      getTime,
      handleInputFileClick,
      uploadFile,
      deleteFile
    };
  }
};
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  justify-content: space-between;
}

.account_block,
.applicant_block,
.client_block,
.case_name_block,
.execution_date_block,
.note4Internal_block,
.note_block,
.field_block {
  display: flex;

  .title {
    width: 141px;
    font-weight: bold;
  }
}

.applicant_block,
.client_block,
.case_name_block,
.execution_date_block,
.field_block {
  align-items: center;
}

.applicant_block {
  border-bottom: 1px solid #ddd;
}

.w-280 {
  width: 280px;
}

.w-480 {
  width: 480px;
}

.w-680 {
  width: 680px;
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
